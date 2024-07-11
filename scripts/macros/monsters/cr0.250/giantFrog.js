import {mba} from "../../../helperFunctions.js";

//To do: remake with synth item

async function swallow({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let target = workflow.targets.first();
    if (mba.getSize(target.actor) > 1) {
        ui.notifications.warn("Target is too big to swallow!");
        return;
    }
    let effect = await mba.findEffect(target.actor, "Giant Frog: Grapple");
    if (!effect) return;
    async function effectMacroDelTarget() {
        if (!mbaPremades.helpers.findEffect(token.actor, "Prone")) await mbaPremades.helpers.addCondition(token.actor, "Prone");
    }
    async function effectMacroDelSource() {
        let targets = Array.from(canvas.scene.tokens).filter(t => t.actor.effects.some(e => e.name === "Giant Frog: Swallow"));
        if (!targets.length) return;
        for (let target of targets) {
            let effect = await mbaPremades.helpers.findEffect(target.actor, "Giant Frog: Swallow");
            let sourceUuid = effect.flags['mba-premades']?.feature?.giantFrog?.sourceUuid;
            if (token.document.uuid != sourceUuid) continue;
            await mbaPremades.helpers.removeEffect(effect);
        }
    }
    async function effectMacroTurnStartSource() {
        let sourceEffect = await mbaPremades.helpers.findEffect(token.actor, "Acid Stomach");
        if (!sourceEffect) return;
        let target = await fromUuid(sourceEffect.flags['mba-premades']?.feature?.giantFrog?.targetUuid);
        let damageRoll = await new Roll('2d4[acid]').roll({ 'async': true });
        await MidiQOL.displayDSNForRoll(damageRoll);
        damageRoll.toMessage({
            rollMode: 'roll',
            speaker: { 'alias': name },
            flavor: "Giant Frog: Acid Stomach"
        });
        await mbaPremades.helpers.applyDamage([target.object], damageRoll.total, 'acid');
    }
    const effectDataTarget = {
        'name': "Giant Frog: Swallow",
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
                'showIcon': false,
                'specialDuration': ['combatEnd']
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDelTarget)
                }
            },
            'mba-premades': {
                'feature': {
                    'giantFrog': {
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
                    'giantFrog': {
                        'targetUuid': target.document.uuid
                    }
                }
            }
        }
    };
    await mba.removeEffect(effect);
    await warpgate.wait(100);
    await mba.pushToken(workflow.token, target, -5);
    await mba.createEffect(target.actor, effectDataTarget);
    await mba.createEffect(workflow.actor, effectDataSource);
}

export let giantFrog = {
    'swallow': swallow
}