// Based on CPR Searing/Thunderous Smite
async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    async function effectMacroDel() {
        await (warpgate.wait(200));
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Wrathful Smite` })
        let targetEffectUuid = effect.flags['mba-premades']?.spell?.wrathfulSmite?.targetEffectUuid;
        if (!targetEffectUuid) return;
        let targetEffect = await fromUuid(targetEffectUuid);
        if (!targetEffect) return;
        let targetUuid = effect.flags['mba-premades']?.spell?.wrathfulSmite?.targetUuid;
        if (!targetUuid) return;
        let target = await fromUuid(targetUuid);
        await Sequencer.EffectManager.endEffects({ name: `${target.name} Wrathful Smite` })
        await chrisPremades.helpers.removeEffect(targetEffect);
    }
    let effectData = {
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'duration': {
            'seconds': 60
        },
        'name': workflow.item.name,
        'changes': [
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.wrathfulSmite.damage,postDamageRoll',
                'priority': 20
            }
        ],
        'flags': {
            'mba-premades': {
                'spell': {
                    'wrathfulSmite': {
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
        .file(`jb2a.particles.outward.purple.02.03`)
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
        .file("jb2a.divine_smite.caster.reversed.purplepink")
        .atLocation(token)
        .scaleToObject(2.2)
        .startTime(900)
        .fadeIn(200)

        .effect()
        .file("jb2a.divine_smite.caster.purplepink")
        .atLocation(token)
        .scaleToObject(1.85)
        .belowTokens()
        .waitUntilFinished(-1200)

        .effect()
        .file("jb2a.token_border.circle.static.purple.007")
        .atLocation(token)
        .attachTo(token)
        .scaleToObject(2)
        .persist()
        .name(`${token.document.name} Wrathful Smite`)

        .play();

    let effect = await chrisPremades.helpers.createEffect(workflow.actor, effectData);
    let updates = { 'flags.mba-premades.spell.wrathfulSmite.targetEffectUuid': effect.uuid };
    await chrisPremades.helpers.updateEffect(effect, updates);
}

async function damage({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size || !workflow.item) return;
    if (workflow.item.system.actionType != 'mwak') return;
    let effect = workflow.actor.effects.find(i => i.flags['mba-premades']?.spell?.wrathfulSmite);
    if (!effect) return;
    let target = workflow.targets.first();
    let queueSetup = await chrisPremades.queue.setup(workflow.item.uuid, 'wrathfulSmite', 250);
    if (!queueSetup) return;
    let oldFormula = workflow.damageRoll._formula;
    let bonusDamageFormula = '1d6[psychic]';
    if (workflow.isCritical) bonusDamageFormula = chrisPremades.helpers.getCriticalFormula(bonusDamageFormula);
    let damageFormula = oldFormula + ' + ' + bonusDamageFormula;
    let damageRoll = await new Roll(damageFormula).roll({ async: true });
    await workflow.setDamageRoll(damageRoll);
    let featureData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Spell Features', 'Wrathful Smite: Fear');
    if (!featureData) {
        chrisPremades.queue.remove(workflow.item.uuid);
        return;
    }
    delete featureData._id;
    featureData.system.save.dc = effect.flags['mba-premades'].spell.wrathfulSmite.saveDC;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
    let [config, options] = chrisPremades.constants.syntheticItemWorkflowOptions([target.document.uuid]);
    await warpgate.wait(100);
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);

    await new Sequence()

        .canvasPan()
        .delay(300)
        .shake({ duration: 1000, strength: 1, rotation: false, fadeOutDuration: 1000 })

        .effect()
        .delay(300)
        .file("jb2a.impact.ground_crack.purple.01")
        .atLocation(target)
        .size(2.3 * token.document.width, { gridUnits: true })
        .belowTokens()
        .playbackRate(0.85)
        .randomRotation()

        .effect()
        .file("jb2a.divine_smite.target.purplepink")
        .atLocation(target)
        .rotateTowards(token)
        .scaleToObject(3)
        .spriteOffset({ x: -1.5 * token.document.width, y: -0 * token.document.width }, { gridUnits: true })
        .mirrorY()
        .rotate(90)
        .zIndex(2)

        .wait(600)

        .thenDo(function () {
            Sequencer.EffectManager.endEffects({ name: `${token.document.name} Wrathful Smite`, object: token })
        })

        .play()

    if (featureWorkflow.failedSaves.size) {
        new Sequence()

            .effect()
            .file("jb2a.token_border.circle.static.purple.007")
            .atLocation(target)
            .attachTo(target)
            .scaleToObject(2)
            .scaleIn(0, 2000, { ease: "easeOutCubic" })
            .persist()
            .name(`${target.document.name} Wrathful Smite`)

            .play();

        async function effectMacroDel() {
            let originEffect = await fromUuid(effect.origin);
            if (!originEffect) return;
            await Sequencer.EffectManager.endEffects({ name: `${token.document.name} Wrathful Smite` });
            await chrisPremades.helpers.removeEffect(originEffect);
        }
        let effectData = {
            'name': 'Wrathful Smite: Fear',
            'icon': effect.icon,
            'origin': effect.uuid,
            'duration': {
                'seconds': effect.duration.seconds
            },
            'changes': [
                {
                    'key': 'flags.midi-qol.OverTime',
                    'mode': 0,
                    'value': 'actionSave=true, rollType=check, saveAbility=wis, saveDC=' + effect.flags['mba-premades'].spell.wrathfulSmite.saveDC + ', saveMagic=true, name=Wrathful Smite: Action Save',
                    'priority': 20
                },
                {
                    'key': 'macro.CE',
                    'mode': 0,
                    'value': 'Frightened',
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
        let targetEffect = await chrisPremades.helpers.createEffect(target.actor, effectData);
        let updates = {
            'flags': {
                'mba-premades': {
                    'spell': {
                        'wrathfulSmite': {
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
        return;
    }
    await chrisPremades.helpers.removeEffect(effect);
    chrisPremades.queue.remove(workflow.item.uuid);
}

export let wrathfulSmite = {
    'damage': damage,
    'item': item
}