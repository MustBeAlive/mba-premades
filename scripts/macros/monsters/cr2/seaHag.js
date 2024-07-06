import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function deathGlare({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    if (!mba.findEffect(target.actor, "Frightened")) {
        ui.notifications.warn("Target it not frightened!");
        return;
    }
    let saveDC = workflow.item.system.save.dc;
    let saveRoll = await mba.rollRequest(target, 'save', 'wis');
    if (saveRoll.total >= saveDC) return;

    new Sequence()

        .effect()
        .file("animated-spell-effects-cartoon.misc.skull")
        .attachTo(target)
        .scaleToObject(1)
        .mask()

        .wait(700)

        .thenDo(async () => {
            await mba.applyDamage([target], target.actor.system.attributes.hp.value, 'force');
        })

        .play()
}

// To do: overlapping issue

async function horrificAppearance(actor, token) {
    if (!mba.inCombat()) return;
    let tokenId = game.combat.current.tokenId;
    let [target] = await mba.findNearby(token, 30, null, false, false).filter(i => i.document.id === tokenId && i.document.name != "Sea Hag");
    if (!target) return;
    if (mba.raceOrType(target.actor) != "humanoid") return;
    if (mba.findEffect(target.actor, "Sea Hag: Horrific Appearance Immune")) return;
    if (mba.findEffect(target.actor, "Sea Hag: Horrific Appearance")) return;
    let choices = [["<b>Avert Eyes</b> (disadvantage on attack rolls against Hag)", "avert"], ["<b>Embrace Horrific Appearance</b> (saving throw)", "save"]];
    let selection = await mba.remoteDialog("Sea Hag: Horrific Appearance", choices, mba.firstOwner(target).id, `<p>You are about to be affected by <b>Sea Hag's Horrific Appearance</b></p><p>What would you like to do?</p>`);
    if (!selection) selection = "save";
    if (selection === "avert") {
        const effectDataAvert = {
            'name': "Sea Hag: Avert Eyes",
            'icon': "modules/mba-premades/icons/conditions/avert_eyes.webp",
            'description': `
                <p>You averted your eyes to escape the effect of Sea Hag's Horrific Appearance.</p>
                <p>While your eyes are averted, you have diasdvantage on all attack rolls against the Hag.</p>
            `,
            'changes': [
                {
                    'key': 'flags.midi-qol.onUseMacroName',
                    'mode': 0,
                    'value': 'function.mbaPremades.macros.monsters.seaHag.avertEyes,preAttackRoll',
                    'priority': 20
                }
            ],
            'flags': {
                'dae': {
                    'showIcon': true,
                    'specialDuration': ['turnStart']
                }
            }
        };
        await mba.createEffect(target.actor, effectDataAvert);
        return;
    }
    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Monster Features', 'Sea Hag: Horrific Appearance', false);
    if (!featureData) return;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': token.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([target.document.uuid]);
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (!featureWorkflow.failedSaves.size) {
        const immuneData = {
            'name': "Sea Hag: Horrific Appearance Immune",
            'icon': "modules/mba-premades/icons/generic/horrific_appearance_immune.webp",
            'description': `
                <p>You are immune to Sea Hag's Horrific Appearance</p>
            `,
            'duration': {
                'seconds': 86400
            },
        };
        await mba.createEffect(target.actor, immuneData);
        return;
    }
    async function effectMacroDel() {
        const immuneData = {
            'name': "Sea Hag: Horrific Appearance Immune",
            'icon': "modules/mba-premades/icons/generic/horrific_appearance_immune.webp",
            'description': `
                <p>You are immune to Sea Hag's Horrific Appearance</p>
            `,
            'duration': {
                'seconds': 86400
            },
        };
        await mbaPremades.helpers.createEffect(actor, immuneData);
    }
    async function effectMacroTurnEnd() {
        let effect = await mbaPremades.helpers.findEffect(actor, "Sea Hag: Horrific Appearance");
        if (!effect) return;
        let [hagCanSee] = await MidiQOL.findNearby(null, token, 30, { includeIncapacitated: false, isSeen: true, includeToken: false }).filter(i => i.document.name === "Sea Hag");
        if (hagCanSee) {
            let disadvantageData = {
                'name': 'Save Disdadvantage: Hag is in Sight',
                'icon': 'modules/mba-premades/icons/generic/generic_debuff.webp',
                'description': "You have disadvantage on the next save you make.",
                'duration': {
                    'turns': 1
                },
                'changes': [
                    {
                        'key': 'flags.midi-qol.disadvantage.ability.save.all',
                        'value': '1',
                        'mode': 5,
                        'priority': 120
                    }
                ],
                'flags': {
                    'dae': {
                        'specialDuration': [
                            'isSave'
                        ]
                    },
                    'mba-premades': {
                        'effect': {
                            'noAnimation': true
                        }
                    }
                }
            };
            await mbaPremades.helpers.createEffect(actor, disadvantageData);
        }
        let saveRoll = await mbaPremades.helpers.rollRequest(token, 'save', 'wis');
        if (saveRoll.total <= 11) return;
        await mbaPremades.helpers.removeEffect(effect);
    }
    const effectData = {
        'name': "Sea Hag: Horrific Appearance",
        'icon': "icons/magic/control/fear-fright-monster-grin-purple-blue.webp",
        'description': `
            <p>You are frightened by Sea Hag's Horrific Appearance.</p>
            <p>You can repeat the saving throw at the end of each of your turns, with disadvantage if the hag is within line of sight, ending the effect on a success.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Frightened",
                'priority': 20
            },
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                },
                'onTurnEnd': {
                    'script': mba.functionToString(effectMacroTurnEnd)
                }
            }
        }
    };
    await mba.createEffect(target.actor, effectData);
}

async function avertEyes({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.targets.size) return;
    let targets = Array.from(workflow.targets).filter(i => i.document.name === "Sea Hag");
    if (!targets.length) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'avertEyes', 150);
    if (!queueSetup) return;
    workflow.disadvantage = true;
    workflow.advReminderAttackAdvAttribution.add("DIS:Averted Eyes");
    queue.remove(workflow.item.uuid);
}

export let seaHag = {
    'deathGlare': deathGlare,
    'horrificAppearance': horrificAppearance,
    'avertEyes': avertEyes
}