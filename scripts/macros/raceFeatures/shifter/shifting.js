import { mba } from "../../../helperFunctions.js";
import { queue } from "../../mechanics/queue.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let choices = [
        ["Beasthide", "Beasthide", "modules/mba-premades/icons/generic/shifting_hide.webp"],
        ["Longtooth", "Longtooth", "modules/mba-premades/icons/generic/shifting_longtooth.webp"],
        ["Swiftstride", "Swiftstride", "modules/mba-premades/icons/generic/shifting_stride.webp"],
        ["Wildhunt", "Wildhunt", "modules/mba-premades/icons/generic/shifting_hunt.webp"]
    ];
    let selection = await mba.selectImage("Shifting", choices, "<b>Choose form to assume:</b>", "both");
    if (!selection.length) return;
    if (selection[0] === "Beasthide") {
        let effectData = {
            'name': "Shifting: Beasthide",
            'icon': selection[1],
            'origin': workflow.item.uuid,
            'description': `
                <p>You gain 1d6 additional temporary hit points. Also, you have a +1 bonus to your Armor Class.</p>
            `,
            'duration': {
                'seconds': 60
            },
            'changes': [
                {
                    'key': 'system.attributes.ac.bonus',
                    'mode': 2,
                    'value': "+1",
                    'priority': 20
                },
            ],
        };
        let damageRoll = await new Roll(`1d6[temphp]`).roll({ 'async': true });
        await MidiQOL.displayDSNForRoll(damageRoll);
        await mba.createEffect(workflow.actor, effectData);
        await mba.applyWorkflowDamage(workflow.token, damageRoll, "temphp", [workflow.token], undefined, workflow.itemCardId);
    }
    else if (selection[0] === "Longtooth") {
        async function effectMacroDel() {
            await warpgate.revert(token.document, 'Longtooth');
        };
        let effectData = {
            'name': "Shifting: Longtooth",
            'icon': selection[1],
            'origin': workflow.item.uuid,
            'description': `
                <p>When you shift and as a bonus action on your other turns while shifted, you can use your elongated fangs to make an unarmed strike.</p>
                <p>If you hit with your fangs, you can deal piercing damage equal to 1d6 + your Strength modifier, instead of the bludgeoning damage normal for an unarmed strike.</p>
            `,
            'duration': {
                'seconds': 60
            },
            'flags': {
                'effectmacro': {
                    'onDelete': {
                        'script': mba.functionToString(effectMacroDel)
                    }
                }
            }
        };
        let featureData = await mba.getItemFromCompendium("mba-premades.MBA Race Feature Items", "Shifter: Fangs", false);
        if (!featureData) return;
        featureData.name = "Fangs";
        let updates = {
            'embedded': {
                'Item': {
                    [featureData.name]: featureData,
                },
                'ActiveEffect': {
                    [effectData.name]: effectData
                }
            }
        };
        let options = {
            'permanent': false,
            'name': 'Longtooth',
            'description': 'Longtooth'
        };
        await warpgate.mutate(workflow.token.document, updates, {}, options);
    }
    else if (selection[0] === "Swiftstride") {
        async function effectMacroDel() {
            await warpgate.revert(token.document, "Swiftstride")
        };
        let effectData = {
            'name': "Shifting: Swiftstride",
            'icon': selection[1],
            'origin': workflow.item.uuid,
            'description': `
                <p>Your walking speed increases by 10 feet.</p>
                <p>Additionally, you can move up to 10 feet as a reaction when a creature ends its turn within 5 feet of you. This reactive movement doesn't provoke opportunity attacks.</p>
            `,
            'duration': {
                'seconds': 60
            },
            'changes': [
                {
                    'key': 'system.attributes.movement.walk',
                    'mode': 2,
                    'value': '+10',
                    'priority': 50
                }
            ],
            'flags': {
                'effectmacro': {
                    'onDelete': {
                        'script': mba.functionToString(effectMacroDel)
                    }
                }
            }
        };
        let featureData = await mba.getItemFromCompendium("mba-premades.MBA Race Feature Items", "Swiftstride: Reaction", false);
        if (!featureData) return;
        let updates = {
            'embedded': {
                'Item': {
                    [featureData.name]: featureData,
                },
                'ActiveEffect': {
                    [effectData.name]: effectData
                }
            }
        };
        let options = {
            'permanent': false,
            'name': 'Swiftstride',
            'description': 'Swiftstride'
        };
        await warpgate.mutate(workflow.token.document, updates, {}, options);
    }
    else if (selection[0] === "Wildhunt") {
        let effectData = {
            'name': "Shifting: Wildhunt",
            'icon': selection[1],
            'origin': workflow.item.uuid,
            'description': `
                <p>You have advantage on Wisdom checks, and no creature within 30 feet of you can make an attack roll with advantage against you unless you're @UUID[Compendium.mba-premades.MBA SRD.Item.LCcuJNMKrGouZbFJ]{Incapacitated}.</p>
            `,
            'duration': {
                'seconds': 60
            },
            'changes': [
                {
                    'key': 'flags.midi-qol.advantage.ability.check.wis',
                    'mode': 2,
                    'value': 1,
                    'priority': 20
                },
            ],
        };
        await mba.createEffect(workflow.actor, effectData);
    }
}

async function longtooth({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();

    new Sequence()

        .effect()
        .file("jb2a.bite.400px.yellow")
        .attachTo(target)
        .scaleToObject(2)
        .missed(!workflow.hitTargets.size)

        .effect()
        .file("jaamod.sequencer_fx_master.blood_splat.red.2")
        .attachTo(target)
        .scaleToObject(2)
        .delay(200)
        .duration(4000)
        .fadeOut(2000)
        .belowTokens()
        .playIf(() => {
            return workflow.hitTargets.size
        })

        .play()
}

async function swiftstride({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (mba.findEffect(workflow.actor, "Reaction")) {
        ui.notifications.warn("You don't have a reaction available!");
        return;
    }
    let position = await mba.aimCrosshair(workflow.token, 10, workflow.item.img, 2, workflow.token.document.width);
    if (position.canceled) return;
    let updates = {
        'token': {
            'x': position.x - (canvas.grid.size * 0.5), 
            'y': position.y - (canvas.grid.size * 0.5)
        }
    };
    let options = {
        'permanent': true,
        'name': 'Move Token',
        'description': 'Move Token'
    };
    await warpgate.mutate(workflow.token.document, updates, {}, options);
}

async function wildhunt(workflow) {
    if (!workflow.targets.size || workflow.disadvanage) return;
    let target = workflow.targets.first();
    if (!mba.findEffect(target.actor, 'Shifting: Wildhunt')) return;
    if (mba.getDistance(workflow.token, target) > 30) return;
    if (mba.findEffect(target.actor, "Incapacitated")) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'wildhunt', 50);
    if (!queueSetup) return;
    workflow.advantage = false; //
    workflow.rollOptions.advantage = false; //
    workflow.flankingAdvantage = false; //
    workflow.advReminderAttackAdvAttribution.add('DIS: Wildhunt');
    queue.remove(workflow.item.uuid);
}

export let shifting = {
    'item': item,
    'longtooth': longtooth,
    'swiftstride': swiftstride,
    'wildhunt': wildhunt
}