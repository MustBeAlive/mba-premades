import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function claw({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let target = workflow.targets.first();
    let effect = await mba.findEffect(target.actor, "Nycaloth: Infernal Wound");
    if (effect) {
        let newStacks = effect.flags['mba-premades']?.feature?.infernalWound?.stacks;
        if (!newStacks) {
            ui.notifications.warn("Unable to find Infernal Wound stacks!");
            return;
        }
        newStacks += 2;
        let updates = {
            'description': `
                <p>You are suffering from an Infernal Wound, taking ${newStacks}d4 slashing damage on the start of your turn.</p>
                <p>Any creature can take an action to stanch the wound with a successful DC 13 Wisdom (Medicine) check.</p>
                <p>The wound also closes if the target receives magical healing.</p>
            `,
            'changes': [
                {
                    'key': 'flags.midi-qol.OverTime',
                    'mode': 0,
                    'value': `turn=start, damageType=slashing, damageRoll=${newStacks}d4, name=Infernal Wound: Turn Start, killAnim=true, fastForwardDamage=true`,
                    'priority': 20
                },
                {
                    'key': 'flags.midi-qol.OverTime',
                    'mode': 0,
                    'value': `actionSave=true, rollType=skill, saveAbility=med, saveDC=13, saveMagic=false, name=Infernal Wound: Action Save (DC13), killAnim=true`,
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
            .attachTo(target)
            .scaleToObject(1.65 * target.document.texture.scaleX)
            .delay(100)
            .duration(2500)
            .fadeOut(1000)
            .scaleIn(0, 500, { 'ease': 'easeOutCubic' })
            .randomRotation()
            .belowTokens()

            .thenDo(async () => {
                await mba.updateEffect(effect, updates);
            })

            .play()

        return;
    }
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Monster Features", "Nycaloth: Claw", false);
    if (!featureData) return;
    delete featureData._id;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([target.document.uuid]);
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (!featureWorkflow.failedSaves.size) return;
    let effectData = {
        'name': "Nycaloth: Infernal Wound",
        'icon': "modules/mba-premades/icons/generic/infernal_wound.webp",
        'origin': workflow.item.uuid,
        'description': `
                <p>You are suffering from an Infernal Wound, taking 2d4 slashing damage on the start of your turn.</p>
                <p>Any creature can take an action to stanch the wound with a successful DC 13 Wisdom (Medicine) check.</p>
                <p>The wound also closes if the target receives magical healing.</p>
            `,
        'changes': [
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `turn=start, damageType=slashing, damageRoll=2d4, name=Infernal Wound: Turn Start, killAnim=true, fastForwardDamage=true`,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `actionSave=true, rollType=skill, saveAbility=med, saveDC=13, saveMagic=false, name=Infernal Wound: Action Save (DC13), killAnim=true`,
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
                        'stacks': 2
                    }
                }
            }
        }
    };
    new Sequence()

        .effect()
        .file("jaamod.sequencer_fx_master.blood_splat.red.2")
        .attachTo(target)
        .scaleToObject(1.65 * target.document.texture.scaleX)
        .delay(100)
        .duration(2500)
        .fadeOut(1000)
        .scaleIn(0, 500, { 'ease': 'easeOutCubic' })
        .randomRotation()
        .belowTokens()

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectData);
        })

        .play()
}

export let nycaloth = {
    'claw': claw
}