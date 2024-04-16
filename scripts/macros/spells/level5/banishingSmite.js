async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    async function effectMacroDel() {
        await (warpgate.wait(200));
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Banishing Smite` })
        let targetEffectUuid = effect.flags['mba-premades']?.spell?.banishingSmite?.targetEffectUuid;
        if (!targetEffectUuid) return;
        let targetEffect = await fromUuid(targetEffectUuid);
        if (!targetEffect) return;
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
                'value': 'function.mbaPremades.macros.banishingSmite.damage,postDamageRoll',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.banishingSmite.post,postActiveEffects',
                'priority': 20
            }
        ],
        'flags': {
            'mba-premades': {
                'spell': {
                    'banishingSmite': {
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
                    baseLevel: 5,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };

    await new Sequence()

        .effect()
        .delay(500)
        .file(`jb2a.particles.outward.red.02.03`)
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
        .file("jb2a.divine_smite.caster.reversed.pink")
        .atLocation(token)
        .filter("ColorMatrix", { hue: 55 })
        .scaleToObject(2.2)
        .startTime(900)
        .fadeIn(200)

        .effect()
        .file("jb2a.divine_smite.caster.pink")
        .atLocation(token)
        .filter("ColorMatrix", { hue: 55 })
        .scaleToObject(1.85)
        .belowTokens()
        .waitUntilFinished(-1200)

        .effect()
        .file("jb2a.token_border.circle.static.orange.007")
        .atLocation(token)
        .attachTo(token)
        .scaleToObject(2)
        .filter("ColorMatrix", { hue: 340 })
        .fadeOut(500)
        .persist()
        .name(`${token.document.name} Banishing Smite`)

        .play();

    let effect = await chrisPremades.helpers.createEffect(workflow.actor, effectData);
    let updates = { 'flags.mba-premades.spell.banishingSmite.targetEffectUuid': effect.uuid };
    await chrisPremades.helpers.updateEffect(effect, updates);
}

async function damage({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.hitTargets.size != 1 || !workflow.item) return;
    if (workflow.item.system.actionType != 'mwak' && workflow.item.system.actionType != 'rwak') return;
    let effect = workflow.actor.effects.find(i => i.flags['mba-premades']?.spell?.banishingSmite);
    if (!effect) return;
    let queueSetup = await chrisPremades.queue.setup(workflow.item.uuid, 'banishingSmite', 250);
    if (!queueSetup) return;
    let oldFormula = workflow.damageRoll._formula;
    let bonusDamageFormula = '5d10[force]';
    if (workflow.isCritical) bonusDamageFormula = chrisPremades.helpers.getCriticalFormula(bonusDamageFormula);
    let damageFormula = oldFormula + ' + ' + bonusDamageFormula;
    let damageRoll = await new Roll(damageFormula).roll({ async: true });
    await workflow.setDamageRoll(damageRoll);
    let target = workflow.targets.first();

    await new Sequence()

        .canvasPan()
        .delay(300)
        .shake({ duration: 1000, strength: 1, rotation: false, fadeOutDuration: 1000 })

        .effect()
        .delay(300)
        .file("jb2a.ground_cracks.blue.01")
        .atLocation(target)
        .filter("ColorMatrix", { hue: 160 })
        .size(2.3 * token.document.width, { gridUnits: true })
        .belowTokens()
        .playbackRate(0.85)
        .randomRotation()

        .effect()
        .file("jb2a.divine_smite.target.pink")
        .atLocation(target)
        .rotateTowards(token)
        .filter("ColorMatrix", { hue: 55 })
        .scaleToObject(3)
        .spriteOffset({ x: -1.5 * token.document.width, y: -0 * token.document.width }, { gridUnits: true })
        .mirrorY()
        .rotate(90)
        .zIndex(2)

        .wait(600)

        .thenDo(function () {
            Sequencer.EffectManager.endEffects({ name: `${token.document.name} Banishing Smite`, object: token })
        })

        .play()

    chrisPremades.queue.remove(workflow.item.uuid);
}

async function post({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.hitTargets.size != 1 || !workflow.item) return;
    if (workflow.item.system.actionType != 'mwak' && workflow.item.system.actionType != 'rwak') return;
    let effect = workflow.actor.effects.find(i => i.flags['mba-premades']?.spell?.banishingSmite);
    if (!effect) return;
    let target = workflow.targets.first();
    if (target.actor.system.attributes.hp.value <= 50) {
        async function effectMacroCreate() {
            await token.document.update({ hidden: true });
        };
        async function effectMacroDel() {
            await new Sequence()

                .effect()
                .file(canvas.scene.background.src)
                .filter("ColorMatrix", { brightness: 0.3 })
                .atLocation({ x: (canvas.dimensions.width) / 2, y: (canvas.dimensions.height) / 2 })
                .size({ width: canvas.scene.width / canvas.grid.size, height: canvas.scene.height / canvas.grid.size }, { gridUnits: true })
                .spriteOffset({ x: -0 }, { gridUnits: true })
                .delay(1000)
                .duration(9000)
                .fadeIn(1500)
                .fadeOut(1500)
                .belowTokens()

                .effect()
                .file("jb2a.particles.inward.red.02.01")
                .atLocation(token)
                .delay(1000)
                .duration(3000)
                .fadeIn(1000)
                .fadeOut(1000)

                .effect()
                .file("jb2a.energy_strands.in.red.01.2")
                .delay(1500)
                .atLocation(token)
                .scaleToObject(3.5)
                .playbackRate(0.8)

                .effect()
                .file("jb2a.portals.horizontal.vortex.red")
                .delay(2800)
                .atLocation(token)
                .scaleToObject(2)
                .scaleIn(0, 2000, { ease: "easeOutCubic" })
                .fadeOut(1500)
                .belowTokens()

                .play()

            await warpgate.wait(1000);

            await token.document.update({ hidden: false });
            let originEffect = await fromUuid(effect.origin);
            if (!originEffect) return;
            await chrisPremades.helpers.removeEffect(originEffect);
        }
        let effectData = {
            'name': 'Banishing Smite: Banish',
            'description': "You are banished from the material plane by Banishing Smite. If you are native to a different plane of existence than the material plane, you disappear, returning to your home plane. If you are native to the plane you're on, you vanish into a harmless demiplane. While there, you are incapacitated. You remain there until the spell ends, at which point you reappear in the space you left or in the nearest unoccupied space if that space is occupied.",
            'icon': effect.icon,
            'origin': effect.uuid,
            'duration': {
                'seconds': effect.duration.seconds
            },
            'changes': [
                {
                    'key': 'macro.CE',
                    'mode': 0,
                    'value': 'Incapacitated',
                    'priority': 20
                }
            ],
            'flags': {
                'effectmacro': {
                    'onCreate': {
                        'script': chrisPremades.helpers.functionToString(effectMacroCreate)
                    },
                    'onDelete': {
                        'script': chrisPremades.helpers.functionToString(effectMacroDel)
                    }
                },
                'midi-qol': {
                    'castData': {
                        baseLevel: 5,
                        castLevel: effect.flags['midi-qol'].castData.castLevel,
                        itemUuid: effect.uuid
                    }
                }
            }
        };

        await new Sequence()

            .effect()
            .file(canvas.scene.background.src)
            .filter("ColorMatrix", { brightness: 0.3 })
            .atLocation({ x: (canvas.dimensions.width) / 2, y: (canvas.dimensions.height) / 2 })
            .size({ width: canvas.scene.width / canvas.grid.size, height: canvas.scene.height / canvas.grid.size }, { gridUnits: true })
            .spriteOffset({ x: -0 }, { gridUnits: true })
            .delay(1000)
            .duration(9000)
            .fadeIn(1500)
            .fadeOut(1500)
            .belowTokens()

            .effect()
            .file("jb2a.particles.inward.red.02.01")
            .atLocation(target)
            .delay(1000)
            .duration(3000)
            .fadeIn(1000)
            .fadeOut(1000)

            .effect()
            .file("jb2a.energy_strands.in.red.01.2")
            .delay(1500)
            .atLocation(target)
            .scaleToObject(3.5)
            .playbackRate(0.8)

            .effect()
            .file("jb2a.portals.horizontal.vortex.red")
            .delay(2800)
            .atLocation(target)
            .scaleToObject(2)
            .scaleIn(0, 2000, { ease: "easeOutCubic" })
            .fadeOut(1500)
            .belowTokens()

            .play()

        await warpgate.wait(1000);
        let targetEffect = await chrisPremades.helpers.createEffect(target.actor, effectData);
        let updates = {
            'flags': {
                'mba-premades': {
                    'spell': {
                        'banishingSmite': {
                            'used': true,
                            'targetEffectUuid': targetEffect.uuid
                        }
                    }
                }
            }
        };
        await chrisPremades.helpers.updateEffect(effect, updates);
    } else await chrisPremades.helpers.removeEffect(effect);
}

export let banishingSmite = {
    'damage': damage,
    'item': item,
    'post': post
}