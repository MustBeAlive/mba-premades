import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function hexItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Hex: Move", false);
    if (!featureData) return;
    delete featureData._id;
    let queueSetup = await queue.setup(workflow.item.uuid, 'hex', 50);
    if (!queueSetup) return;
    let choices = [
        ['Strength', 'str', "modules/mba-premades/icons/spells/level1/hex_strength.webp"],
        ['Dexterity', 'dex', "modules/mba-premades/icons/spells/level1/hex_dexterity.webp"],
        ['Constitution', 'con', "modules/mba-premades/icons/spells/level1/hex_constitution.webp"],
        ['Intelligence', 'int', "modules/mba-premades/icons/spells/level1/hex_intelligence.webp"],
        ['Wisdom', 'wis', "modules/mba-premades/icons/spells/level1/hex_wisdom.webp"],
        ['Charisma', 'cha', "modules/mba-premades/icons/spells/level1/hex_charisma.webp"]
    ];
    let selection = await mba.selectImage("Hex", choices, '<b>Which ability should have disadvantage?</b>', "both");
    if (!selection.length) {
        queue.remove(workflow.item.uuid);
        return;
    }
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
    };
    let targetEffectData = {
        'name': "Hex: Target",
        'icon': selection[1],
        'origin': workflow.item.uuid,
        'duration': {
            'seconds': seconds
        },
        'changes': [
            {
                'key': `flags.midi-qol.disadvantage.ability.check.${selection[0]}`,
                'mode': 5,
                'value': '1',
                'priority': 20
            }
        ],
        'flags': {
            'midi-qol': {
                'castData': {
                    baseLevel: 1,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            },
            'mba-premades': {
                'greaterRestoration': true,
                'isCurse': true,
            },
        }
    };
    async function effectMacro() {
        await warpgate.revert(token.document, 'Hex');
        let targetTokenId = effect.changes[0].value;
        let target = canvas.scene.tokens.get(targetTokenId);
        if (!target) return;
        let targetEffect = mbaPremades.helpers.findEffect(target.actor, "Hex: Target");
        if (targetEffect) await mbaPremades.helpers.removeEffect(targetEffect);
    }
    let sourceEffectData = {
        'name': 'Hex',
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'duration': {
            'seconds': seconds
        },
        'changes': [
            {
                'key': 'flags.mba-premades.spell.hex',
                'mode': 5,
                'value': target.id,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.hex.attack,postDamageRoll',
                'priority': 20
            }
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacro)
                }
            },
            'mba-premades': {
                'spell': {
                    'hex': {
                        'icon': selection[1]
                    }
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 1,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            },
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
    new Sequence()

        .effect()
        .file(`jb2a.particles.outward.purple.01.03`)
        .attachTo(target)
        .scale(0.15)
        .duration(5500)
        .fadeOut(500)
        .scaleIn(0, 1000, { ease: "easeOutCubic" })
        .zIndex(0.2)
        .filter("ColorMatrix", { hue: 0 })

        .effect()
        .file("animated-spell-effects-cartoon.misc.all seeing eye")
        .attachTo(target)
        .scaleToObject(0.85)
        .duration(5500)
        .fadeOut(1000)
        .scaleIn(0, 250, { ease: "easeOutCubic" })
        .zIndex(0.1)
        .filter("ColorMatrix", { hue: 182 })

        .effect()
        .file("animated-spell-effects-cartoon.simple.27")
        .attachTo(target)
        .scaleToObject(4)
        .spriteOffset({ x: 0.1, y: -0.45 }, { gridUnits: true })
        .filter("ColorMatrix", { brightness: -1 })

        .effect()
        .file("jb2a.ward.rune.dark_purple.01")
        .attachTo(target)
        .scaleToObject(1.85)
        .duration(5500)
        .fadeOut(3500)
        .scaleIn(0, 250, { ease: "easeOutCubic" })
        .opacity(1)
        .belowTokens()

        .effect()
        .file("jb2a.extras.tmfx.outflow.circle.04")
        .attachTo(target)
        .scaleToObject(1.35)
        .duration(5500)
        .fadeOut(500)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .belowTokens()
        .filter("ColorMatrix", { brightness: -1 })
        .opacity(2)

        .thenDo(async () => {
            await mba.createEffect(target.actor, targetEffectData);
            await warpgate.mutate(workflow.token.document, updates, {}, options);
        })

        .play();

    let conEffect = await mba.findEffect(workflow.actor, 'Concentrating');
    if (conEffect) {
        let updates = {
            'duration': {
                'seconds': seconds
            }
        };
        await mba.updateEffect(conEffect, updates);
    }
    queue.remove(workflow.item.uuid);
}

async function hexAttack({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    if (!constants.attacks.includes(workflow.item.system.actionType)) return;
    let sourceActor = workflow.actor;
    let hexedTarget = sourceActor.flags['mba-premades']?.spell?.hex;
    let targetToken = workflow.hitTargets.first();
    if (targetToken.id != hexedTarget) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'hex', 250);
    if (!queueSetup) return;
    let oldFormula = workflow.damageRoll._formula;
    let bonusDamageFormula = "1d6[necrotic]";
    if (workflow.isCritical) bonusDamageFormula = mba.getCriticalFormula(bonusDamageFormula);
    let damageFormula = oldFormula + ' + ' + bonusDamageFormula;
    let damageRoll = await new Roll(damageFormula).roll({ async: true });
    await workflow.setDamageRoll(damageRoll);
    queue.remove(workflow.item.uuid);

    new Sequence()

        .effect()
        .file(`jb2a.particles.outward.purple.01.03`)
        .attachTo(targetToken)
        .scale(0.15)
        .playbackRate(1)
        .duration(1000)
        .fadeOut(500)
        .scaleIn(0, 1000, { ease: "easeOutCubic" })
        .filter("ColorMatrix", { hue: 0 })
        .zIndex(0.2)

        .effect()
        .file("animated-spell-effects-cartoon.misc.all seeing eye")
        .attachTo(targetToken)
        .scaleToObject(0.85)
        .scaleIn(0, 250, { ease: "easeOutCubic" })
        .zIndex(0.1)
        .filter("ColorMatrix", { hue: 182 })

        .effect()
        .file("animated-spell-effects-cartoon.simple.27")
        .attachTo(targetToken)
        .scaleToObject(4)
        .spriteOffset({ x: 0.1, y: -0.45 }, { gridUnits: true })
        .filter("ColorMatrix", { brightness: -1 })

        .effect()
        .from(targetToken)
        .attachTo(targetToken)
        .scaleToObject(targetToken.document.texture.scaleX)
        .duration(500)
        .fadeOut(300)
        .loopProperty("sprite", "position.x", { from: -0.05, to: 0.05, duration: 175, pingPong: true, gridUnits: true })
        .opacity(0.45)
        .tint("#dcace3")

        .play()
}

async function hexMoveItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.targets.size != 1) return;
    let target = workflow.targets.first();
    let oldTargetTokenId = workflow.actor.flags['mba-premades']?.spell?.hex;
    let oldTargetToken = canvas.scene.tokens.get(oldTargetTokenId);
    let oldTargetOrigin;
    let selection = 'flags.midi-qol.disadvantage.ability.check.str';
    if (oldTargetToken) {
        let oldTargetActor = oldTargetToken.actor;
        let oldTargetEffect = mba.findEffect(oldTargetActor, "Hex: Target");
        if (oldTargetEffect) {
            await mba.removeEffect(oldTargetEffect);
            oldTargetOrigin = oldTargetEffect.origin;
            selection = oldTargetEffect.changes[0].key;
        }
    }
    let effect = mba.findEffect(workflow.actor, 'Hex');
    let duration = 3600;
    if (effect) duration = effect.duration.remaining;
    let icon = effect.flags['mba-premades']?.spell?.hex?.icon;
    let effectData = {
        'name': "Hex: Target",
        'icon': icon,
        'origin': oldTargetOrigin,
        'duration': {
            'seconds': duration
        },
        'changes': [
            {
                'key': selection,
                'mode': 5,
                'value': '1',
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'specialDuration': ["zeroHP"]
            },
            'mba-premades': {
                'greaterRestoration': true,
                'isCurse': true,
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 1,
                    castLevel: effect.flags['midi-qol']?.castData.castLevel,
                    itemUuid: effect.flags['midi-qol']?.castData.itemUuid
                }
            }
        }
    };
    await mba.createEffect(target.actor, effectData);

    new Sequence()

        .effect()
        .file(`jb2a.particles.outward.purple.01.03`)
        .attachTo(target)
        .scale(0.15)
        .duration(5500)
        .fadeOut(500)
        .scaleIn(0, 1000, { ease: "easeOutCubic" })
        .playbackRate(1)
        .filter("ColorMatrix", { hue: 0 })
        .zIndex(0.2)

        .effect()
        .file("animated-spell-effects-cartoon.misc.all seeing eye")
        .attachTo(target)
        .filter("ColorMatrix", { hue: 182 })
        .scaleToObject(0.85)
        .duration(5500)
        .fadeOut(1000)
        .scaleIn(0, 250, { ease: "easeOutCubic" })
        .zIndex(0.1)

        .effect()
        .file("animated-spell-effects-cartoon.simple.27")
        .attachTo(target)
        .scaleToObject(4)
        .spriteOffset({ x: 0.1, y: -0.45 }, { gridUnits: true })
        .filter("ColorMatrix", { brightness: -1 })

        .effect()
        .file("jb2a.ward.rune.dark_purple.01")
        .attachTo(target)
        .scaleToObject(1.85)
        .duration(5500)
        .fadeOut(3500)
        .scaleIn(0, 250, { ease: "easeOutCubic" })
        .opacity(1)
        .belowTokens()

        .effect()
        .file("jb2a.extras.tmfx.outflow.circle.04")
        .attachTo(target)
        .scaleToObject(1.35)
        .duration(5500)
        .fadeOut(500)
        .belowTokens()
        .filter("ColorMatrix", { brightness: -1 })
        .opacity(2)
        .scaleIn(0, 500, { ease: "easeOutCubic" })

        .play();

    if (effect) {
        let changes = effect.changes;
        changes[0].value = targetToken.id;
        let updates = { changes };
        await mba.updateEffect(effect, updates);
    }
}

export let hex = {
    'item': hexItem,
    'attack': hexAttack,
    'move': hexMoveItem
};