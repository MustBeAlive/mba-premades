// Original macro by CPR
async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Thunderous Smite` })
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
                'value': 'function.mbaPremades.macros.thunderousSmite.damage,postDamageRoll',
                'priority': 20
            }
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': chrisPremades.helpers.functionToString(effectMacroDel)
                }
            },
            'mba-premades': {
                'spell': {
                    'thunderousSmite': {
                        'saveDC': chrisPremades.helpers.getSpellDC(workflow.item)
                    }
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
        .file(`jb2a.particles.outward.blue.02.03`)
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
        .filter("ColorMatrix", { hue: 170 })
        .scaleToObject(2.2)
        .startTime(900)
        .fadeIn(200)

        .effect()
        .file("jb2a.divine_smite.caster.orange")
        .atLocation(token)
        .filter("ColorMatrix", { hue: 170 })
        .scaleToObject(1.85)
        .belowTokens()
        .waitUntilFinished(-1200)

        .effect()
        .file("jb2a.token_border.circle.static.blue.007")
        .atLocation(token)
        .attachTo(token)
        .scaleToObject(2)
        .persist()
        .name(`${token.document.name} Thunderous Smite`)

        .play();

    await chrisPremades.helpers.createEffect(workflow.actor, effectData);
}

async function damage({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size || !workflow.item) return;
    if (workflow.item.system.actionType != 'mwak') return;
    let effect = workflow.actor.effects.find(i => i.flags['mba-premades']?.spell?.thunderousSmite);
    if (!effect) return;
    let target = workflow.targets.first();
    let queueSetup = await chrisPremades.queue.setup(workflow.item.uuid, 'thunderousSmite', 250);
    if (!queueSetup) return;
    let oldFormula = workflow.damageRoll._formula;
    let bonusDamageFormula = '2d6[thunder]';
    if (workflow.isCritical) bonusDamageFormula = chrisPremades.helpers.getCriticalFormula(bonusDamageFormula);
    let damageFormula = oldFormula + ' + ' + bonusDamageFormula;
    let damageRoll = await new Roll(damageFormula).roll({ async: true });
    await workflow.setDamageRoll(damageRoll);
    let featureData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Spell Features', 'Thunderous Smite: Push');
    if (!featureData) {
        chrisPremades.queue.remove(workflow.item.uuid);
        return;
    }
    delete featureData._id;
    featureData.system.save.dc = effect.flags['mba-premades'].spell.thunderousSmite.saveDC;
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
        .file("jb2a.impact.ground_crack.01.blue")
        .atLocation(target)
        .size(2.3 * token.document.width, { gridUnits: true })
        .belowTokens()
        .playbackRate(0.85)
        .randomRotation()

        .effect()
        .file("jb2a.divine_smite.target.orange")
        .atLocation(target)
        .rotateTowards(token)
        .filter("ColorMatrix", { hue: 170 })
        .scaleToObject(3)
        .spriteOffset({ x: -1.5 * token.document.width, y: -0 * token.document.width }, { gridUnits: true })
        .mirrorY()
        .rotate(90)
        .zIndex(2)

        .wait(600)

        .thenDo(function () {
            Sequencer.EffectManager.endEffects({ name: `${token.document.name} Thunderous Smite` })
        })

        .play();

    if (featureWorkflow.failedSaves.size) {
        await chrisPremades.helpers.pushToken(workflow.token, target, 10);
        if (!chrisPremades.helpers.checkTrait(target.actor, 'ci', 'prone') && !chrisPremades.helpers.findEffect(target.actor, "Prone")) await chrisPremades.helpers.addCondition(target.actor, 'Prone');
    }
    let concEffect = chrisPremades.helpers.findEffect(workflow.actor, 'Concentrating');
    if (concEffect) await chrisPremades.helpers.removeEffect(concEffect);
    chrisPremades.queue.remove(workflow.item.uuid);
}

export let thunderousSmite = {
    'damage': damage,
    'item': item
}