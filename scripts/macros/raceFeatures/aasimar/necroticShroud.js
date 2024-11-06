import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    async function effectMacroTurnStart() {
        let updates = {
            'flags': {
                'mba-premades': {
                    'feature': {
                        'necroticShroud': {
                            'used': 0
                        }
                    }
                }
            }
        };
        let effect = await mbaPremades.helpers.findEffect(actor, "Necrotic Shroud");
        if (effect) await mbaPremades.helpers.updateEffect(effect, updates);
    };
    const effectDataSource = {
        'name': "Necrotic Shroud",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Your eyes briefly become pools of darkness, and ghostly, flightless wings sprout from your back temporarily.</p>
            <p>Creatures other than your allies within 10 feet of you that can see you must succeed on a Charisma saving throw or become @UUID[Compendium.mba-premades.MBA SRD.Item.oR1wUvem3zVVUv5Q]{Frightened} of you until the end of your next turn.</p>
            <p>Until the transformation ends, once on each of your turns, you can deal extra necrotic damage to one target when you deal damage to it with an attack or a spell</p>
            <p>The extra damage equals your proficiency bonus.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.necroticShroud.damage,postDamageRoll',
                'priority': 20
            }
        ],
        'flags': {
            'effectmacro': {
                'onTurnStart': {
                    'script': mba.functionToString(effectMacroTurnStart)
                }
            },
            'mba-premades': {
                'feature': {
                    'necroticShroud': {
                        'used': 0
                    }
                }
            }
        }
    };
    const effectDataTarget = {
        'name': "Necrotic Shroud: Fear",
        'origin': workflow.item.uuid,
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': 'Frightened',
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'specialDuration': ['turnEndSource']
            }
        }
    };
    await mba.createEffect(workflow.actor, effectDataSource);
    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Race Feature Items', "Necrotic Shroud: Save", false);
    if (!featureData) return;
    delete featureData._id;
	featureData.system.save.dc = mba.getSpellDC(workflow.item);
	let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
    let targetUuids = Array.from(await mba.findNearby(workflow.token, 10, "enemy", false, false, false, true)).map(t => t.document.uuid);
    if (!targetUuids.length) return;
	let [config, options] = constants.syntheticItemWorkflowOptions(targetUuids);
	let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (!featureWorkflow.failedSaves.size) return;
    for (let target of Array.from(featureWorkflow.failedSaves)) {
        if (!mba.checkTrait(target.actor, "ci", "frightened")) await mba.createEffect(target.actor, effectDataTarget);
    }
}

async function damage({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    if (!constants.attacks.includes(workflow.item.system.actionType)) return;
    let effect = await mba.findEffect(workflow.actor, "Necrotic Shroud");
    if (!effect) return;
    if (effect.flags['mba-premades']?.feature?.necroticShroud?.used === 1) return;
    let queueSetup = await queue.setup(workflow.item.uuid, "necroticShroud", 249);
    if (!queueSetup) return;
    await mba.playerDialogMessage(game.user);
    let selection = await mba.dialog("Necrotic Shroud", constants.yesNo, `Deal extra damage? (+${workflow.actor.system.attributes.prof}[necrotic])`);
    await mba.clearPlayerDialogMessage();
    if (!selection) {
        queue.remove(workflow.item.uuid);
        return;
    }
    let oldFormula = workflow.damageRoll._formula;
    let bonusDamageFormula = `+${workflow.actor.system.attributes.prof}[necrotic]`;
    if (workflow.isCritical) bonusDamageFormula = mba.getCriticalFormula(bonusDamageFormula);
    let damageFormula = oldFormula + ' + ' + bonusDamageFormula;
    let damageRoll = await new Roll(damageFormula).roll({ async: true });
    await workflow.setDamageRoll(damageRoll);
    let updates = {
        'flags': {
            'mba-premades': {
                'feature': {
                    'necroticShroud': {
                        'used': 1
                    }
                }
            }
        }
    };
    await mba.updateEffect(effect, updates);
    queue.remove(workflow.item.uuid);
}

export let necroticShroud = {
    'item': item,
    'damage': damage
}