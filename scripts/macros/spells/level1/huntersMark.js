import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.targets.size != 1) return;
    let target = workflow.targets.first();
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Hunter's Mark: Move", false);
    if (!featureData) return;
    delete featureData._id;
    let seconds;
    switch (workflow.castData.castLevel) {
        case 3:
        case 4:
            seconds = 28800;
            break;
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
            seconds = 86400;
            break;
        default:
            seconds = 3600;
    }
    let targetEffectData = {
        'name': "Hunter's Mark: Target",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'duration': {
            'seconds': seconds
        },
        'flags': {
            'dae': {
                'specialDuration': ["zeroHP"]
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 1,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    await mba.createEffect(target.actor, targetEffectData);

    new Sequence()

        .effect()
        .file(`jb2a.particles.outward.greenyellow.01.03`)
        .attachTo(target)
        .scale(0.15)
        .duration(5500)
        .fadeOut(500)
        .scaleIn(0, 1000, { ease: "easeOutCubic" })
        .zIndex(0.2)
        .filter("ColorMatrix", { hue: 0 })

        .effect()
        .file("jb2a.hunters_mark.loop.01.green")
        .attachTo(target)
        .scaleToObject(1)
        .duration(5500)
        .fadeOut(1000)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .zIndex(0.1)

        .effect()
        .file("animated-spell-effects-cartoon.simple.27")
        .attachTo(target)
        .scaleToObject(4)
        .spriteOffset({ x: 0.1, y: -0.45 }, { gridUnits: true })
        .filter("ColorMatrix", { brightness: -1 })
        .belowTokens()

        .effect()
        .file("jb2a.ward.rune.dark_purple.01")
        .attachTo(target)
        .scaleToObject(1.85)
        .duration(5500)
        .fadeOut(3500)
        .scaleIn(0, 250, { ease: "easeOutCubic" })
        .opacity(1)
        .belowTokens()
        .filter("ColorMatrix", { hue: 182 })

        .effect()
        .file("jb2a.extras.tmfx.outflow.circle.04")
        .attachTo(target)
        .scaleToObject(1.35)
        .duration(5500)
        .fadeOut(500)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .belowTokens()
        .tint("#098a00")
        .opacity(2)

        .play()

    async function effectMacro() {
        await warpgate.revert(token.document, "Hunter's Mark");
        let targetTokenId = effect.changes[0].value;
        let targetToken = canvas.scene.tokens.get(targetTokenId);
        if (!targetToken) return;
        let targetActor = targetToken.actor;
        let targetEffect = mbaPremades.helpers.findEffect(targetActor, "Hunter's Mark: Target");
        if (targetEffect) await mbaPremades.helpers.removeEffect(targetEffect);
    }
    let sourceEffectData = {
        'name': "Hunter's Mark",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'duration': {
            'seconds': seconds
        },
        'changes': [
            {
                'key': 'flags.mba-premades.spell.huntersMark',
                'mode': 5,
                'value': target.id,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.huntersMark.attack,postDamageRoll',
                'priority': 20
            }
        ],
        'transfer': false,
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacro)
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 1,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    let updates = {
        'embedded': {
            'Item': {
                [featureData.name]: featureData
            },
            'ActiveEffect': {
                [sourceEffectData.name]: sourceEffectData
            }
        }
    };
    let options = {
        'permanent': false,
        'name': sourceEffectData.name,
        'description': sourceEffectData.name
    };
    await warpgate.mutate(workflow.token.document, updates, {}, options);
    let conEffect = mba.findEffect(workflow.actor, 'Concentrating');
    if (conEffect) {
        let updates = {
            'duration': {
                'seconds': seconds
            }
        };
        await mba.updateEffect(conEffect, updates);
    }
}

async function attack({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.hitTargets.size != 1) return;
    let attackType = workflow.item.system.actionType;
    if (!(attackType === 'mwak' || attackType === 'rwak')) return;
    let sourceActor = workflow.actor;
    let markedTarget = sourceActor.flags['mba-premades']?.spell?.huntersMark;
    let targetToken = workflow.hitTargets.first();
    if (targetToken.id != markedTarget) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'huntersMark', 250);
    if (!queueSetup) return;
    let oldFormula = workflow.damageRoll._formula;
    let bonusDamageFormula = '1d6[' + workflow.defaultDamageType + ']';
    if (workflow.isCritical) bonusDamageFormula = mba.getCriticalFormula(bonusDamageFormula);
    let damageFormula = oldFormula + ' + ' + bonusDamageFormula;
    let damageRoll = await new Roll(damageFormula).roll({ async: true });
    await workflow.setDamageRoll(damageRoll);
    queue.remove(workflow.item.uuid);

    new Sequence()

        .effect()
        .file(`jb2a.particles.outward.greenyellow.01.03`)
        .attachTo(targetToken)
        .scale(0.15)
        .playbackRate(1)
        .duration(1000)
        .fadeOut(500)
        .scaleIn(0, 1000, { ease: "easeOutCubic" })
        .filter("ColorMatrix", { hue: 0 })
        .zIndex(0.2)

        .effect()
        .file("jb2a.hunters_mark.loop.01.green")
        .attachTo(targetToken)
        .scaleToObject(0.75)
        .scaleIn(0, 250, { ease: "easeOutCubic" })
        .zIndex(0.1)
        .duration(3000)
        .fadeOut(500)

        .effect()
        .file("animated-spell-effects-cartoon.simple.27")
        .attachTo(targetToken)
        .scaleToObject(4)
        .spriteOffset({ x: 0.1, y: -0.45 }, { gridUnits: true })
        .filter("ColorMatrix", { brightness: -1 })
        .belowTokens()

        .effect()
        .from(targetToken)
        .attachTo(targetToken)
        .fadeOut(300)
        .loopProperty("sprite", "position.x", { from: -0.05, to: 0.05, duration: 175, pingPong: true, gridUnits: true })
        .scaleToObject(targetToken.document.texture.scaleX)
        .duration(500)
        .tint("#dcace3")
        .opacity(0.45)

        .play()
}

async function move({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.targets.size != 1) return;
    let targetToken = workflow.targets.first();
    let targetActor = targetToken.actor;
    let oldTargetTokenId = workflow.actor.flags['mba-premades']?.spell?.huntersMark;
    let oldTargetToken = canvas.scene.tokens.get(oldTargetTokenId);
    let oldTargetOrigin;
    if (oldTargetToken) {
        let oldTargetActor = oldTargetToken.actor;
        let oldTargetEffect = mba.findEffect(oldTargetActor, "Hunter's Mark: Target");
        if (oldTargetEffect) {
            await mba.removeEffect(oldTargetEffect);
            oldTargetOrigin = oldTargetEffect.origin;
        }
    }
    let effect = mba.findEffect(workflow.actor, "Hunter's Mark");
    let duration = 3600;
    if (effect) duration = effect.duration.remaining;
    let effectData = {
        'name': "Hunter's Mark: Target",
        'icon': workflow.item.img,
        'origin': oldTargetOrigin,
        'duration': {
            'seconds': duration
        },
        'flags': {
            'midi-qol': {
                'castData': {
                    baseLevel: 1,
                    castLevel: effect.flags['midi-qol']?.castData.castLevel,
                    itemUuid: effect.flags['midi-qol']?.castData.itemUuid
                }
            }
        }
    };
    await mba.createEffect(targetActor, effectData);

    new Sequence()

        .effect()
        .file(`jb2a.particles.outward.greenyellow.01.03`)
        .attachTo(targetToken)
        .scale(0.15)
        .playbackRate(1)
        .duration(1000)
        .fadeOut(500)
        .scaleIn(0, 1000, { ease: "easeOutCubic" })
        .filter("ColorMatrix", { hue: 0 })
        .zIndex(0.2)

        .effect()
        .file("jb2a.hunters_mark.loop.01.green")
        .attachTo(targetToken)
        .scaleToObject(0.9)
        .scaleIn(0, 250, { ease: "easeOutCubic" })
        .zIndex(0.1)
        .fadeOut(500)

        .effect()
        .file("animated-spell-effects-cartoon.simple.27")
        .attachTo(targetToken)
        .scaleToObject(4)
        .spriteOffset({ x: 0.1, y: -0.45 }, { gridUnits: true })
        .filter("ColorMatrix", { brightness: -1 })
        .belowTokens()

        .effect()
        .file("jb2a.ward.rune.dark_purple.01")
        .attachTo(targetToken)
        .scaleToObject(1.85)
        .fadeOut(3000)
        .duration(3500)
        .opacity(1)
        .belowTokens()
        .filter("ColorMatrix", { hue: 182 })
        .scaleIn(0, 250, { ease: "easeOutCubic" })

        .effect()
        .file("jb2a.extras.tmfx.outflow.circle.04")
        .attachTo(targetToken)
        .belowTokens()
        .tint("#098a00")
        .opacity(2)
        .scaleToObject(1.35)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .fadeOut(500)

        .play()

    if (effect) {
        let changes = effect.changes;
        changes[0].value = targetToken.id;
        let updates = { changes };
        await mba.updateEffect(effect, updates);
    }
}

export let huntersMark = {
    'item': item,
    'attack': attack,
    'move': move
};