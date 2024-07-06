import {mba} from "../../../helperFunctions.js";

async function swallow({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let target = workflow.targets.first();
    if (mba.getSize(target.actor) > 2) {
        ui.notifications.warn("Target is too big to swallow!");
        return;
    }
    let effect = await mba.findEffect(target.actor, "Giant Toad: Grapple");
    if (!effect) return;
    async function effectMacroDelTarget() {
        await mbaPremades.helpers.addCondition(actor, "Prone");
    }
    async function effectMacroDelSource() {
        let targets = Array.from(canvas.scene.tokens).filter(i => i.actor.effects.some(i => i.name === "Giant Toad: Swallow"));
        if (!targets.length) return;
        for (let target of targets) {
            let effect = await mbaPremades.helpers.findEffect(target.actor, "Giant Toad: Swallow");
            let sourceUuid = effect.flags['mba-premades']?.feature?.giantToad?.sourceUuid;
            if (token.document.uuid != sourceUuid) continue;
            await mbaPremades.helpers.removeEffect(effect);
        }
    }
    async function effectMacroTurnStartSource() {
        let sourceEffect = await mbaPremades.helpers.findEffect(actor, "Acid Stomach");
        if (!sourceEffect) return;
        let target = await fromUuid(sourceEffect.flags['mba-premades']?.feature?.giantToad?.targetUuid);
        let damageRoll = await new Roll('3d6[acid]').roll({ 'async': true });
        await MidiQOL.displayDSNForRoll(damageRoll);
        damageRoll.toMessage({
            rollMode: 'roll',
            speaker: { 'alias': name },
            flavor: "Giant Toad: Acid Stomach"
        });
        await mbaPremades.helpers.applyDamage([target.object], damageRoll.total, 'acid');
    }
    const effectDataTarget = {
        'name': "Giant Toad: Swallow",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Blinded",
                'priority': 20
            },
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Restrained",
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': false
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDelTarget)
                }
            },
            'mba-premades': {
                'feature': {
                    'giantToad': {
                        'sourceUuid': workflow.token.document.uuid
                    }
                }
            }
        }
    };
    const effectDataSource = {
        'name': "Acid Stomach",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'flags': {
            'dae': {
                'showIcon': false,
                'specialDuration': ['zeroHP']
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDelSource),
                },
                'onTurnStart': {
                    'script': mba.functionToString(effectMacroTurnStartSource),
                }
            },
            'mba-premades': {
                'feature': {
                    'giantToad': {
                        'targetUuid': target.document.uuid
                    }
                }
            }
        }
    };
    await mba.removeEffect(effect);
    await mba.pushToken(workflow.token, target, -5);
    await mba.createEffect(target.actor, effectDataTarget);
    await mba.createEffect(workflow.actor, effectDataSource);
}

export let giantToad = {
    'swallow': swallow
}