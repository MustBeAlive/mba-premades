import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function beard({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    if (!workflow.failedSaves.size) return;
    let target = workflow.targets.first();
    if (mba.checkTrait(target.actor, "ci", "poisoned")) return;
    if (mba.findEffect(target.actor, "Bearded Devil: Poison")) return;
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} BeaDePoi` })
    };
    let effectData = {
        'name': `Bearded Devil: Poison`,
        'icon': "modules/mba-premades/icons/generic/generic_poison.webp",
        'origin': workflow.item.uuid,
        'description': `
            <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.pAjPUbk2oPUTfva2]{Poisoned} by Bearded Devil's Poison and are unable to regain hit points while poisoned in this way.</p>
            <p>You can repeat the saving throw at the end of each of your turns, ending the effect on a success.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Poisoned",
                'priority': 20
            },
            {
                'key': 'system.traits.di.value',
                'mode': 0,
                'value': 'healing',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `turn=end, saveAbility=con, saveDC=12, saveMagic=false, name=Poison: Turn End (DC12), killAnim=true`,
                'priority': 20
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
    new Sequence()

        .effect()
        .file("jb2a.smoke.puff.centered.green.2")
        .attachTo(target)
        .scaleToObject(2 * target.document.texture.scaleX)

        .effect()
        .file("jb2a.template_circle.symbol.normal.poison.dark_green")
        .attachTo(target)
        .scaleToObject(1 * target.document.texture.scaleX)
        .delay(500)
        .fadeIn(500)
        .fadeOut(500)
        .randomRotation()
        .mask(target)
        .persist()
        .name(`${target.document.name} BeaDePoi`)

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectData)
        })

        .play()
}

async function glaive({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let target = workflow.targets.first();
    let effect = await mba.findEffect(target.actor, "Infernal Wound");
    if (effect) {
        let newStacks = effect.flags['mba-premades']?.feature?.infernalWound?.stacks;
        if (!newStacks) {
            ui.notifications.warn("Unable to find Infernal Wound stacks!");
            return;
        }
        newStacks += 1;
        let updates = {
            'description': `
                <p>You are suffering from an Infernal Wound, taking ${newStacks}d10 damage on the start of your turn.</p>
                <p>Any creature can take an action to stanch the wound with a successful DC 12 Wisdom (Medicine) check.</p>
                <p>The wound also closes if the target receives magical healing.</p>
            `,
            'changes': [
                {
                    'key': 'flags.midi-qol.OverTime',
                    'mode': 0,
                    'value': `turn=start, damageType=none, damageRoll=${newStacks}d10, name=Infernal Wound: Turn Start, killAnim=true, fastForwardDamage=true`,
                    'priority': 20
                },
                {
                    'key': 'flags.midi-qol.OverTime',
                    'mode': 0,
                    'value': `actionSave=true, rollType=skill, saveAbility=med, saveDC=12, saveMagic=false, name=Infernal Wound: Action Save (DC12), killAnim=true`,
                    'priority': 20
                }
            ],
            'flags': {
                'mba-premades': {
                    'feature': {
                        'infernalWound': {
                            'stacks': newStacks
                        }
                    }
                }
            }
        };
        new Sequence()

            .effect()
            .file("jaamod.sequencer_fx_master.blood_splat.red.2")
            .delay(100)
            .attachTo(target)
            .scaleIn(0, 500, { 'ease': 'easeOutCubic' })
            .scaleToObject(1.65 * target.document.texture.scaleX)
            .duration(2500)
            .fadeOut(1000)
            .randomRotation()
            .belowTokens()

            .thenDo(async () => {
                await mba.updateEffect(effect, updates);
            })

            .play()

        return;
    }
    let type = await mba.raceOrType(target.actor);
    if (type === "undead" || type === "construct") return;
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Monster Features", "Bearded Devil: Glaive", false);
    if (!featureData) return;
    delete featureData._id;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([target.document.uuid]);
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (!featureWorkflow.failedSaves.size) return;
    let effectData = {
        'name': "Infernal Wound",
        'icon': "modules/mba-premades/icons/generic/infernal_wound.webp",
        'origin': workflow.item.uuid,
        'description': `
                <p>You are suffering from an Infernal Wound, taking 1d10 damage on the start of your turn.</p>
                <p>Any creature can take an action to stanch the wound with a successful DC 12 Wisdom (Medicine) check.</p>
                <p>The wound also closes if the target receives magical healing.</p>
            `,
        'changes': [
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `turn=start, damageType=none, damageRoll=1d10, name=Infernal Wound: Turn Start, killAnim=true, fastForwardDamage=true`,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `actionSave=true, rollType=skill, saveAbility=med, saveDC=12, saveMagic=false, name=Infernal Wound: Action Save (DC12), killAnim=true`,
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['isDamaged.healing', 'isHealed'],
            },
            'mba-premades': {
                'feature': {
                    'infernalWound': {
                        'stacks': 1
                    }
                }
            }
        }
    };

    new Sequence()

        .effect()
        .file("jaamod.sequencer_fx_master.blood_splat.red.2")
        .delay(100)
        .attachTo(target)
        .scaleIn(0, 500, { 'ease': 'easeOutCubic' })
        .scaleToObject(1.65 * target.document.texture.scaleX)
        .duration(2500)
        .fadeOut(1000)
        .randomRotation()
        .belowTokens()

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectData);
        })

        .play()

    return;


}

async function steadfast(token) {
    let effect = await mba.findEffect(token.actor, "Steadfast: Passive");
    if (!effect) {
        ui.notifications.warn("Unable to find effect! (Steadfast: Passive)");
        return;
    }
    let allyNearby = await mba.findNearby(token, 30, "ally", false, false, false, true);
    console.log(allyNearby);
    let changes = [];
    if (allyNearby.length) changes = [
        {
            'key': 'system.traits.ci.value',
            'mode': 0,
            'value': 'frightened',
            'priority': 20
        }
    ];
    let updates = {
        'changes': changes
    };
    await mba.updateEffect(effect, updates);
}

export let beardedDevil = {
    'beard': beard,
    'glaive': glaive,
    'steadfast': steadfast
}