import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function oilPuddleCreator({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;
    let choices = [["Slippery Oil (Prone)", "slippery"], ["Sticky Oil (Restrained)", "sticky"]];
    await mba.gmDialogMessage();
    let selection = await mba.dialog("Oil Puddle", choices, "Choose puddle type:");
    await mba.clearGMDialogMessage();
    if (!selection) return;
    if (selection === "slippery") {
        await template.update({
            'flags': {
                'mba-premades': {
                    'template': {
                        'icon': workflow.item.img,
                        'itemUuid': workflow.item.uuid,
                        'templateUuid': template.uuid,
                        'type': "slippery"
                    }
                }
            }
        });
    }
    else if (selection === "sticky") {
        await template.update({
            'flags': {
                'mba-premades': {
                    'template': {
                        'icon': workflow.item.img,
                        'itemUuid': workflow.item.uuid,
                        'templateUuid': template.uuid,
                        'type': "sticky"
                    }
                }
            }
        });
    }
    new Sequence()

        .effect()
        .file("jb2a.water_splash.circle.01.black")
        .attachTo(template)
        .size(1.5, { gridUnits: true })
        .fadeIn(500)
        .fadeOut(1000)
        .scaleIn(0, 1500, { ease: "easeOutCubic" })
        .scaleOut(0, 1500, { ease: "linear" })
        .belowTokens()
        .zIndex(2)

        .effect()
        .file('jb2a.grease.dark_brown')
        .attachTo(template)
        .scaleToObject(1.3)
        .delay(100)
        .fadeIn(5000)
        .fadeOut(1000)
        .scaleOut(0, 1500, { ease: "linear" })
        .scaleIn(0, 5000, { ease: "easeOutCubic" })
        .zIndex(1)
        .randomRotation()
        .belowTokens()
        .persist()
        .name(`Oil Puddle`)

        .thenDo(async () => {
            let effect = await mba.findEffect(workflow.actor, "Oil Puddle Template");
            let updates = { 'disabled': true };
            if (effect) await mba.updateEffect(effect, updates);
        })

        .play()
}

async function oilPuddleEnter(template, token) {
    let trigger = template.flags['mba-premades']?.template;
    if (!trigger) return;
    await oilPuddleTrigger(token.document, trigger);
}

async function oilPuddleTrigger(token, trigger) {
    if (token.name === "Boggle") return;
    if (trigger.type === "slippery" && mba.checkTrait(token.actor, "ci", "prone")) return;
    if (trigger.type === "slippery" && mba.findEffect(token.actor, "Prone")) return;
    if (trigger.type === "sticky" && mba.checkTrait(token.actor, "ci", "restrained")) return;
    if (trigger.type === "sticky" && mba.findEffect(token.actor, "Restrained")) return;
    let template = await fromUuid(trigger.templateUuid);
    if (!template) return;
    let originItem = await fromUuid(trigger.itemUuid);
    if (!originItem) return;
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Monster Features", "Boggle: Oil Puddle", false);
    if (!featureData) return;
    delete featureData._id;
    if (trigger.type === "slippery") featureData.system.save.ability = "dex";
    else if (trigger.type === "sticky") featureData.system.save.ability = "str";
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': originItem.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([token.uuid]);
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (!featureWorkflow.failedSaves.size) return;
    if (featureWorkflow.failedSaves.size && trigger.type === "slippery") await mba.addCondition(token.actor, "Prone");
    else if (featureWorkflow.failedSaves.size && trigger.type === "sticky") {
        let effectData = {
            'name': "Boggle: Sticky Oil",
            'icon': trigger.icon,
            'origin': trigger.itemUuid,
            'description': `
                <p>You are stuck in a puddle of sticky oil.</p>
                <p>You can use your action to make a Strength ability check. If you succeed, you are no longer restrained.</p>
            `,
            'changes': [
                {
                    'key': 'macro.CE',
                    'mode': 0,
                    'value': 'Restrained',
                    'priority': 20
                },
                {
                    'key': 'flags.midi-qol.OverTime',
                    'mode': 0,
                    'value': `actionSave=true, rollType=check, saveAbility=str, saveDC=11, saveMagic=false, name=Restrain: Action Save (DC11), killAnim=true`,
                    'priority': 20
                }
            ],
            'flags': {
                'dae': {
                    'showIcon': true
                },
            }
        };
        await mba.createEffect(token.actor, effectData);
    }
}

async function boggleOil({ speaker, actor, token, character, item, args, scope, workflow }) {
    let choices = [["Slippery Oil (Acrobatics ADV)", "acr"], ["Sticky Oil (Athletics ADV)", "ath"]];
    await mba.gmDialogMessage();
    let selection = await mba.dialog("Boggle Oil", choices, "Choose effect:");
    await mba.clearGMDialogMessage();
    if (!selection) return;
    let effect = await mba.findEffect(workflow.actor, "Boggle Oil: Passive");
    if (!effect) {
        let effectData = {
            'name': `Boggle Oil: Passive`,
            'icon': workflow.item.img,
            'origin': workflow.item.uuid,
            'changes': [
                {
                    'key': `flags.midi-qol.advantage.skill.${selection}`,
                    'mode': 2,
                    'value': 1,
                    'priority': 20
                }, 
            ],
            'flags': {
                'dae': {
                    'showIcon': false,
                    'specialDuration': ['zeroHP', 'combatEnd']
                }
            }
        };
        await mba.createEffect(workflow.actor, effectData);
    }
    else if (effect) {
        let updates = {
            'changes': [
                {
                    'key': `flags.midi-qol.advantage.skill.${selection}`,
                    'mode': 2,
                    'value': 1,
                    'priority': 20
                }, 
            ]
        };
        await mba.updateEffect(effect, updates);
    }
}

async function dimensionalRift({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>QoL: while effect is active, Boggle has a 35 feet range on his melee attack (lol).</p>
        `,
        'changes': [
            {
                'key': 'flags.midi-qol.range.mwak',
                'mode': 2,
                'value': '+30',
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['zeroHP', 'combatEnd', 'turnEndSource']
            }
        }
    };
    new Sequence()

        .effect()
        .file("jb2a.misty_step.01.dark_purple")
        .attachTo(workflow.token)
        .scaleToObject(2)

        .thenDo(async () => {
            await mba.createEffect(workflow.actor, effectData);
        })

        .play()
}

export let boggle = {
    'oilPuddleCreator': oilPuddleCreator,
    'oilPuddleEnter': oilPuddleEnter,
    'oilPuddleTrigger': oilPuddleTrigger,
    'boggleOil': boggleOil,
    'dimensionalRift': dimensionalRift
}