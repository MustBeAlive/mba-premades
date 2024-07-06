import {mba} from "../../../helperFunctions.js";

async function check({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = await mba.findEffect(workflow.actor, `Stirge: Blood Drain`);
    if (effect) {
        ui.notifications.warn("Stirge is attached to someone and can't use it's attack!");
        return false;
    }
}

async function attach({ speaker, actor, token, character, item, args, scope, workflow }) {
    new Sequence()

        .effect()
        .file("jb2a.energy_strands.range.multiple.dark_red.01")
        .attachTo(workflow.targets.first())
        .stretchTo(token)
        .repeats(2, 1500)

        .effect()
        .file("jb2a.divine_smite.caster.dark_red")
        .attachTo(token)
        .fadeIn(500)
        .scaleToObject(1.5)

        .play()

    if (!workflow.hitTargets.size) return;
    if (mba.findEffect(workflow.actor, `Stirge: Blood Drain`)) return;
    async function effectMacroStart() {
        let effect = await mbaPremades.helpers.findEffect(actor, "Stirge: Blood Drain");
        if (!effect) return;
        let target = await fromUuid(effect.flags['mba-premades']?.feature?.bloodDrain?.targetUuid);
        let total = effect.flags['mba-premades']?.feature?.bloodDrain?.total;
        let featureData = await mbaPremades.helpers.getItemFromCompendium('mba-premades.MBA Monster Features', 'Blood Drain: Turn Start', false);
        if (!featureData) return;
        let feature = new CONFIG.Item.documentClass(featureData, { 'parent': actor });
        let [config, options] = mbaPremades.constants.syntheticItemWorkflowOptions([target.uuid]);
        new Sequence()

            .effect()
            .file("jb2a.energy_strands.range.multiple.dark_red.01")
            .attachTo(target)
            .stretchTo(token)
            .repeats(2, 1500)

            .effect()
            .file("jb2a.divine_smite.caster.dark_red")
            .attachTo(token)
            .fadeIn(500)
            .scaleToObject(1.5)

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
    let effectData = {
        'name': "Stirge: Blood Drain",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
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
                        'targetUuid': workflow.targets.first().document.uuid,
                        'total': 0
                    }
                }
            }
        }
    };
    await mba.createEffect(workflow.actor, effectData);
}

async function detach({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = await mba.findEffect(workflow.actor, `Stirge: Blood Drain`);
    if (effect) await mba.removeEffect(effect);
}

export let stirge = {
    'check': check,
    'attach': attach,
    'detach': detach
}