// Original macro by CPR
async function item({speaker, actor, token, character, item, args, scope, workflow}) {
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.staggeringSmite.damage,postDamageRoll',
                'priority': 20
            }
        ],
        'flags': {
            'mba-premades': {
                'spell': {
                    'staggeringSmite': {
                        'dc': chrisPremades.helpers.getSpellDC(workflow.item)
                    }
                }
            }
        }
    };
    await chrisPremades.helpers.createEffect(workflow.actor, effectData);
}

async function damage({speaker, actor, token, character, item, args, scope, workflow}) {
    if (workflow.hitTargets.size != 1 || !workflow.item) return;
    if (workflow.item.system.actionType != 'mwak') return;
    let effect = workflow.actor.effects.find(i => i.flags['mba-premades']?.spell?.staggeringSmite);
    if (!effect) return;
    let targetToken = workflow.targets.first();
    let queueSetup = await chrisPremades.queue.setup(workflow.item.uuid, 'staggeringSmite', 250);
    if (!queueSetup) return;
    let oldFormula = workflow.damageRoll._formula;
    let bonusDamageFormula = '4d6[psychic]';
    if (workflow.isCritical) bonusDamageFormula = chrisPremades.helpers.getCriticalFormula(bonusDamageFormula);
    let damageFormula = oldFormula + ' + ' + bonusDamageFormula;
    let damageRoll = await new Roll(damageFormula).roll({async: true});
    await workflow.setDamageRoll(damageRoll);
    let featureData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Spell Features', 'Staggering Smite: Stagger');
    if (!featureData) {
        chrisPremades.queue.remove(workflow.item.uuid);
        return;
    }
    delete featureData._id;
    featureData.system.save.dc = effect.flags['mba-premades'].spell.staggeringSmite.dc;
    let feature = new CONFIG.Item.documentClass(featureData, {'parent': workflow.actor});
    let [config, options] = chrisPremades.constants.syntheticItemWorkflowOptions([targetToken.document.uuid]);
    await warpgate.wait(100);
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (featureWorkflow.failedSaves.size) {
        let effectData = {
            'name': 'Staggering Smite: Stagger',
            'icon': effect.icon,
            'description': "You are staggered by Staggering Smite. You have disadvantage on ability checks, attack rolls and can't take reactions until the end of your next turn.",
            'origin': effect.uuid,
            'duration': {
                'seconds': 12
            },
            'changes': [
                {
                    'key': 'flags.midi-qol.disadvantage.attack.all',
                    'mode': 2,
                    'value': 1,
                    'priority': 20
                },
                {
                    'key': 'flags.midi-qol.disadvantage.ability.check.all',
                    'mode': 2,
                    'value': 1,
                    'priority': 20
                },
                {
                    'key': 'macro.CE',
                    'mode': 0,
                    'value': 'Reaction',
                    'priority': 20
                }
            ],
            'flags': {
                'dae': {
                    'specialDuration': ['turnEnd']
                }
            }
        };
        await chrisPremades.helpers.createEffect(targetToken.actor, effectData);
    }
    let conEffect = chrisPremades.helpers.findEffect(workflow.actor, 'Concentrating');
    if (conEffect) await chrisPremades.helpers.removeEffect(conEffect);
    chrisPremades.queue.remove(workflow.item.uuid);
}

export let staggeringSmite = {
    'damage': damage,
    'item': item
}