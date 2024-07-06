import {mba} from "../../../helperFunctions.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} FoM` })
        await warpgate.revert(token.document, "Freedom of Movement");
    };
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Freedom of Movement: End Grapple", false);
    if (!featureData) return;
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>For the duration, your movement is unaffected by difficult terrain, and spells and other magical effects can neither reduce your speed nor cause you to be paralyzed or restrained.</p>
            <p>You can also spend 5 feet of movement to automatically escape from nonmagical restraints, such as manacles or a creature that has you @UUID[Compendium.mba-premades.MBA SRD.Item.EthsAglVRC2bOxun]{Grappled}.</p>
            <p>Finally, being underwater imposes no penalties on your movement or attacks.</p>
        `,
        'duration': {
            'seconds': 3600
        },
        'changes': [
            {
                'key': 'system.traits.ci.value',
                'mode': 2,
                'value': 'Restrained',
                'priority': 20
            },
            {
                'key': 'system.traits.ci.value',
                'mode': 2,
                'value': 'Paralyzed',
                'priority': 20
            },
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 4,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
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
        'name': 'Freedom of Movement',
        'description': 'Freedom of Movement'
    };

    new Sequence()

        .effect()
        .file("jb2a.aura_themed.01.orbit.loop.cold.01.blue")
        .attachTo(target)
        .scaleToObject(2)
        .fadeIn(1000)
        .fadeOut(1000)
        .playbackRate(0.75)
        .belowTokens()
        .filter("ColorMatrix", { hue: 210 })
        .persist()
        .name(`${target.document.name} FoM`)

        .thenDo(async () => {
            await warpgate.mutate(workflow.token.document, updates, {}, options);
        })

        .play()
}

async function grapple({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effectsFirst = workflow.actor.effects.filter(i => i.name.includes("Grapple"));
    if (!effectsFirst.length) {
        ui.notifications.warn("You are not grappled!");
        return;
    }
    if (effectsFirst.length < 2) {
        let grapple = await mba.findEffect(workflow.actor, effectsFirst[0].name);
        if (!grapple) {
            ui.notifications.warn(`Unable to find : ${effectsFirst[0].name}`);
            return;
        }
        await mba.removeEffect(grapple);
    } else {
        let effects = effectsFirst.filter(i => i.name != "Grappled");
        if (effects.length < 2) {
            let grapple = await mba.findEffect(workflow.actor, effects[0].name);
            if (!grapple) {
                ui.notifications.warn(`Unable to find Poison: ${effects[0].name}`);
                return;
            }
            await mba.removeEffect(grapple);
        } else {
            let effectToRemove = await mba.selectEffect("Freedom of Movement", effects, "<b>Choose one effect:</b>", false);
            if (!effectToRemove) return;
            await mba.removeEffect(effectToRemove);
        }
    }
}

export let freedomOfMovement = {
    'item': item,
    'grapple': grapple
}