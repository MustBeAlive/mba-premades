import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function check({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = await mba.findEffect(workflow.actor, "Stirge: Blood Drain");
    if (effect) {
        let targetName = effect.flags['mba-premades']?.feature?.bloodDrain?.targetName;
        ui.notifications.warn(`Stirge is attached to ${targetName} and can't use it's attack!`);
        return false;
    }
}

async function attach({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    new Sequence()

        .effect()
        .file("jb2a.energy_strands.range.multiple.dark_red.01")
        .attachTo(target)
        .stretchTo(workflow.token)
        .repeats(2, 1500)

        .effect()
        .file("jb2a.divine_smite.caster.dark_red")
        .attachTo(workflow.token)
        .scaleToObject(1.5)
        .fadeIn(500)
        .belowTokens()

        .play()

    if (!workflow.hitTargets.size) return;
    if (mba.findEffect(workflow.actor, `Stirge: Blood Drain`)) return;
    async function effectMacroStart() {
        await mbaPremades.macros.monsters.stirge.bloodDrain(token);
    }
    let effectData = {
        'name': "Stirge: Blood Drain",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Target: <u>${target.document.name}</u></p>
        `,
        'flags': {
            'dae': {
                'showIcon': true
            },
            'effectmacro': {
                'onTurnStart': {
                    'script': mba.functionToString(effectMacroStart)
                }
            },
            'mba-premades': {
                'feature': {
                    'bloodDrain': {
                        'targetName': target.document.name,
                        'targetUuid': target.document.uuid,
                        'total': 0
                    }
                }
            }
        }
    };
    await mba.createEffect(workflow.actor, effectData);
}

async function bloodDrain(token) {
    let effect = await mba.findEffect(token.actor, "Stirge: Blood Drain");
    if (!effect) return;
    let targetDoc = await fromUuid(effect.flags['mba-premades']?.feature?.bloodDrain?.targetUuid);
    let target = targetDoc.object;
    let total = effect.flags['mba-premades']?.feature?.bloodDrain?.total;
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Monster Features", "Blood Drain: Turn Start", false);
    if (!featureData) return;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': token.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([targetDoc.uuid]);
    new Sequence()

        .effect()
        .file("jb2a.energy_strands.range.multiple.dark_red.01")
        .attachTo(target)
        .stretchTo(token)
        .repeats(2, 1500)

        .effect()
        .file("jb2a.divine_smite.caster.dark_red")
        .attachTo(token)
        .scaleToObject(1.5)
        .fadeIn(500)
        .belowTokens()

        .play()

    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    total += featureWorkflow.damageTotal;
    if (total >= 10) {
        await mbaPremades.helpers.removeEffect(effect);
        return;
    }
    let updates = {
        'flags': {
            'mba-premades': {
                'feature': {
                    'bloodDrain': {
                        'total': total
                    }
                }
            }
        }
    };
    await mbaPremades.helpers.updateEffect(effect, updates);
}

async function detach({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = await mba.findEffect(workflow.actor, `Stirge: Blood Drain`);
    if (effect) await mba.removeEffect(effect);
}

export let stirge = {
    'check': check,
    'attach': attach,
    'bloodDrain': bloodDrain,
    'detach': detach
}