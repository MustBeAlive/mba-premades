// Based on CPR Searing/Thunderous Smite
async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    async function effectMacroDel() {
        await (warpgate.wait(200));
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Branding Smite` })
        let targetEffectUuid = effect.flags['mba-premades']?.spell?.brandingSmite?.targetEffectUuid;
        if (!targetEffectUuid) return;
        let targetEffect = await fromUuid(targetEffectUuid);
        if (!targetEffect) return;
        let targetUuid = effect.flags['mba-premades']?.spell?.brandingSmite?.targetUuid;
        if (!targetUuid) return;
        let target = await fromUuid(targetUuid);
        await Sequencer.EffectManager.endEffects({ name: `${target.name} Branding Smite` })
        await chrisPremades.helpers.removeEffect(targetEffect);
    }
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
                'value': 'function.mbaPremades.macros.brandingSmite.damage,postDamageRoll',
                'priority': 20
            }
        ],
        'flags': {
            'mba-premades': {
                'spell': {
                    'brandingSmite': {
                        'level': workflow.castData.castLevel,
                        'used': false
                    }
                }
            },
            'effectmacro': {
                'onDelete': {
                    'script': chrisPremades.helpers.functionToString(effectMacroDel)
                }
            },
            'flags': {
                'midi-qol': {
                    'castData': {
                        baseLevel: 2,
                        castLevel: workflow.castData.castLevel,
                        itemUuid: workflow.item.uuid
                    }
                }
            }
        }
    };

    await new Sequence()

        .effect()
        .delay(500)
        .file(`jb2a.particles.outward.white.02.03`)
        .attachTo(token, { offset: { y: -0.25 }, gridUnits: true, followRotation: false })
        .scaleToObject(1.2)
        .playbackRate(2)
        .duration(2000)
        .fadeOut(800)
        .fadeIn(1000)
        .animateProperty("sprite", "height", { from: 0, to: 2, duration: 3000, gridUnits: true, ease: "easeOutBack" })
        .filter("Blur", { blurX: 0, blurY: 15 })
        .opacity(2)
        .zIndex(0.2)

        .effect()
        .delay(1050)
        .file("jb2a.divine_smite.caster.reversed.yellowwhite")
        .atLocation(token)
        .scaleToObject(2.2)
        .startTime(900)
        .fadeIn(200)

        .effect()
        .file("jb2a.divine_smite.caster.yellowwhite")
        .atLocation(token)
        .scaleToObject(1.85)
        .belowTokens()
        .waitUntilFinished(-1200)

        .effect()
        .file("jb2a.token_border.circle.static.blue.007")
        .atLocation(token)
        .attachTo(token)
        .scaleToObject(2)
        .filter("ColorMatrix", { saturate: -1, brightness: 0.8 })
        .persist()
        .name(`${token.document.name} Branding Smite`)

        .play();

    let effect = await chrisPremades.helpers.createEffect(workflow.actor, effectData);
    let updates = { 'flags.mba-premades.spell.brandingSmite.targetEffectUuid': effect.uuid };
    await chrisPremades.helpers.updateEffect(effect, updates);
}

async function damage({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size || !workflow.item) return;
    if (workflow.item.system.actionType != 'mwak' && workflow.item.system.actionType != 'rwak') return;
    let effect = workflow.actor.effects.find(i => i.flags['mba-premades']?.spell?.brandingSmite);
    if (!effect) return;
    let queueSetup = await chrisPremades.queue.setup(workflow.item.uuid, 'brandingSmite', 250);
    if (!queueSetup) return;
    let oldFormula = workflow.damageRoll._formula;
    let bonusDamageFormula = effect.flags['mba-premades']?.spell?.brandingSmite?.level + 'd6[radiant]';
    if (workflow.isCritical) bonusDamageFormula = chrisPremades.helpers.getCriticalFormula(bonusDamageFormula);
    let damageFormula = oldFormula + ' + ' + bonusDamageFormula;
    let damageRoll = await new Roll(damageFormula).roll({ async: true });
    await workflow.setDamageRoll(damageRoll);
    async function effectMacroDel() {
        let originEffect = await fromUuid(effect.origin);
        if (!originEffect) return;
        await Sequencer.EffectManager.endEffects({ name: `${token.document.name} Branding Smite` });
        await chrisPremades.helpers.removeEffect(originEffect);
    }
    let effectData = {
        'name': 'Branding Smite: Brand',
        'icon': effect.icon,
        'description': "You are branded by Branding Smite. Until the spell ends, you can't become invisible and shed dim light in a 5-foot radius.",
        'origin': effect.uuid,
        'duration': {
            'seconds': effect.duration.seconds
        },
        'changes': [
            {
                'key': 'system.traits.ci.value',
                'mode': 0,
                'value': 'invisible',
                'priority': 20
            },
            {
                'key': 'ATL.light.dim',
                'mode': 4,
                'value': '5',
                'priority': 20
            }
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': chrisPremades.helpers.functionToString(effectMacroDel)
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 2,
                    castLevel: effect.flags['mba-premades']?.spell?.brandingSmite?.level,
                    itemUuid: effect.uuid
                }
            }
        }
    };
    let target = workflow.targets.first();
    await new Sequence()

        .canvasPan()
        .delay(300)
        .shake({ duration: 1000, strength: 1, rotation: false, fadeOutDuration: 1000 })

        .effect()
        .delay(300)
        .file("jb2a.impact.ground_crack.01.blue")
        .atLocation(target)
        .size(2.3 * token.document.width, { gridUnits: true })
        .filter("ColorMatrix", { saturate: -0.5, hue: -160 })
        .belowTokens()
        .playbackRate(0.85)
        .randomRotation()

        .effect()
        .file("jb2a.divine_smite.target.yellowwhite")
        .atLocation(target)
        .rotateTowards(token)
        .scaleToObject(3)
        .spriteOffset({ x: -1.5 * token.document.width, y: -0 * token.document.width }, { gridUnits: true })
        .mirrorY()
        .rotate(90)
        .zIndex(2)

        .wait(600)

        .thenDo(function () {
            Sequencer.EffectManager.endEffects({ name: `${token.document.name} Branding Smite`, object: token })
        })

        .effect()
        .file("jb2a.token_border.circle.static.blue.007")
        .atLocation(target)
        .attachTo(target)
        .scaleToObject(2)
        .scaleIn(0, 2000, { ease: "easeOutCubic" })
        .filter("ColorMatrix", { saturate: -1, brightness: 0.8 })
        .persist()
        .name(`${target.document.name} Branding Smite`)

        .play();

    let targetEffect = await chrisPremades.helpers.createEffect(target.actor, effectData);
    let updates = {
        'flags': {
            'mba-premades': {
                'spell': {
                    'brandingSmite': {
                        'used': true,
                        'targetUuid': target.document.uuid,
                        'targetEffectUuid': targetEffect.uuid
                    }
                }
            }
        }
    };
    await chrisPremades.helpers.updateEffect(effect, updates);
    chrisPremades.queue.remove(workflow.item.uuid);
}

export let brandingSmite = {
    'damage': damage,
    'item': item
}