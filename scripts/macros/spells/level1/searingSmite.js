async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    async function effectMacroDel() {
        await (warpgate.wait(200));
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Searing Smite` });
        let targetEffectUuid = effect.flags['mba-premades']?.spell?.searingSmite?.targetEffectUuid;
        if (!targetEffectUuid) return;
        let targetEffect = await fromUuid(targetEffectUuid);
        if (!targetEffect) return;
        let targetUuid = effect.flags['mba-premades']?.spell?.searingSmite?.targetUuid;
        if (!targetUuid) return;
        let target = await fromUuid(targetUuid);
        await Sequencer.EffectManager.endEffects({ name: `${target.name} Searing Smite` })
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
                'value': 'function.mbaPremades.macros.searingSmite.damage,postDamageRoll',
                'priority': 20
            }
        ],
        'flags': {
            'mba-premades': {
                'spell': {
                    'searingSmite': {
                        'saveDC': chrisPremades.helpers.getSpellDC(workflow.item),
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
            'midi-qol': {
                'castData': {
                    baseLevel: 1,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };

    await new Sequence()

        .effect()
        .delay(500)
        .file(`jb2a.particles.outward.orange.02.03`)
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
        .file("jb2a.divine_smite.caster.reversed.orange")
        .atLocation(token)
        .scaleToObject(2.2)
        .startTime(900)
        .fadeIn(200)

        .effect()
        .file("jb2a.divine_smite.caster.orange")
        .atLocation(token)
        .scaleToObject(1.85)
        .belowTokens()
        .waitUntilFinished(-1200)

        .effect()
        .file("jb2a.token_border.circle.static.orange.007")
        .atLocation(token)
        .attachTo(token)
        .scaleToObject(2)
        .persist()
        .name(`${token.document.name} Searing Smite`)

        .play();

    let effect = await chrisPremades.helpers.createEffect(workflow.actor, effectData);
    let updates = { 'flags.mba-premades.spell.searingSmite.targetEffectUuid': effect.uuid };
    await chrisPremades.helpers.updateEffect(effect, updates);
}

async function damage({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size || !workflow.item) return;
    if (workflow.item.system.actionType != 'mwak') return;
    let effect = workflow.actor.effects.find(i => i.flags['mba-premades']?.spell?.searingSmite);
    if (!effect) return;
    if (effect.flags['mba-premades'].spell.searingSmite.used) return;
    let queueSetup = await chrisPremades.queue.setup(workflow.item.uuid, 'searingSmite', 250);
    if (!queueSetup) return;
    let oldFormula = workflow.damageRoll._formula;
    let bonusDamageFormula = effect.flags['mba-premades']?.spell?.searingSmite?.level + 'd6[fire]';
    if (workflow.isCritical) bonusDamageFormula = chrisPremades.helpers.getCriticalFormula(bonusDamageFormula);
    let damageFormula = oldFormula + ' + ' + bonusDamageFormula;
    let damageRoll = await new Roll(damageFormula).roll({ async: true });
    await workflow.setDamageRoll(damageRoll);
    async function effectMacroDel() {
        let originEffect = await fromUuid(effect.origin);
        if (!originEffect) return;
        await Sequencer.EffectManager.endEffects({ name: `${token.document.name} Searing Smite`, object: token });
        await chrisPremades.helpers.removeEffect(originEffect);
    }
    let effectData = {
        'name': 'Searing Smite: Burn',
        'description': "You are burning. Until the spell ends, you must make a Constitution saving throw at the start of each of your turns. On a failed save, you take 1d6 fire damage. On a successful save, the spell ends. If you or a creature within 5 feet of you uses its action to put out the flames, or if some other effect douses the flames (such as being submerged in water), the spell ends.",
        'icon': effect.icon,
        'origin': effect.uuid,
        'duration': {
            'seconds': effect.duration.seconds
        },
        'changes': [
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': 'turn=start, saveAbility=con, saveDC=' + effect.flags['mba-premades'].spell.searingSmite.saveDC + ', saveMagic=true, damageRoll=1d6[fire], damageType=fire, name=Searing Smite: Burn',
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
                    baseLevel: 1,
                    castLevel: effect.flags['midi-qol'].castData.castLevel,
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
        .file("jb2a.impact.ground_crack.orange.01")
        .atLocation(target)
        .size(2.3 * token.document.width, { gridUnits: true })
        .belowTokens()
        .playbackRate(0.85)
        .randomRotation()

        .effect()
        .file("jb2a.divine_smite.target.orange")
        .atLocation(target)
        .rotateTowards(token)
        .scaleToObject(3)
        .spriteOffset({ x: -1.5 * token.document.width, y: -0 * token.document.width }, { gridUnits: true })
        .mirrorY()
        .rotate(90)
        .zIndex(2)

        .wait(600)

        .thenDo(function () {
            Sequencer.EffectManager.endEffects({ name: `${token.document.name} Searing Smite`, object: token })
        })

        .effect()
        .file("jb2a.token_border.circle.static.orange.007")
        .atLocation(target)
        .attachTo(target)
        .scaleToObject(2)
        .scaleIn(0, 2000, { ease: "easeOutCubic" })
        .persist()
        .name(`${target.document.name} Searing Smite`)

        .play();

    let targetEffect = await chrisPremades.helpers.createEffect(target.actor, effectData);
    let updates = {
        'flags': {
            'mba-premades': {
                'spell': {
                    'searingSmite': {
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

export let searingSmite = {
    'damage': damage,
    'item': item
}