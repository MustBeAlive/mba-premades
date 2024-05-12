import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let ammount = workflow.castData.castLevel - 1;
    let concEffect = await mba.findEffect(workflow.actor, 'Concentrating');
    if (workflow.targets.size > ammount) {
        let selection = await mba.selectTarget(workflow.item.name, constants.okCancel, Array.from(workflow.targets), false, 'multiple', undefined, false, 'Too many targets selected. Choose which targets to keep (Max: ' + ammount + ')');
        if (!selection.buttons) {
            ui.notifications.warn('Failed to select right ammount of targets, try again!')
            await mba.removeEffect(concEffect);
            return;
        }
        let newTargets = selection.inputs.filter(i => i).slice(0, ammount);
        mba.updateTargets(newTargets);
        if (Array.from(game.user.targets).length > ammount) {
            ui.notifications.warn("Too many targets selected, try again!");
            await mba.removeEffect(concEffect);
            return;
        }
    }
    let targets = Array.from(game.user.targets);
    if (mba.within30(targets) === false) {
        ui.notifications.warn('Targets cannot be further than 30 ft. of each other!')
        await mba.removeEffect(concEffect);
        return;
    }
    await warpgate.wait(100);
    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Spell Features', 'Hold Person: Hold', false);
    if (!featureData) {
        ui.notifications.warn("Unable to find item in the compenidum! (Hold Person: Hold)");
        return
    }
    delete featureData._id;
    featureData.system.save.dc = mba.getSpellDC(originItem);
    let originItem = workflow.item;
    if (!originItem) return;
    setProperty(featureData, 'mba-premades.spell.castData.school', originItem.system.school);
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
    let targetUuids = [];
    for (let i of targets) {
        targetUuids.push(i.document.uuid);
    }
    let [config, options] = constants.syntheticItemWorkflowOptions(targetUuids);
    await warpgate.wait(100);
    await game.messages.get(workflow.itemCardId).delete();
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);

    if (!featureWorkflow.failedSaves.size) {
        await mba.removeEffect(concEffect);
        return;
    }
    let failTargets = Array.from(featureWorkflow.failedSaves);
    for (let target of failTargets) {
        async function effectMacroDel() {
            await Sequencer.EffectManager.endEffects({ name: `${token.document.name} Hold Person`})
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
                    'key': 'flags.midi-qol.OverTime',
                    'mode': 0,
                    'value': 'turn=end, saveAbility=wis, saveDC=' + mba.getSpellDC(workflow.item) + ' , saveMagic=true, name=Hold Person: Hold, killAnim=true',
                    'priority': 20
                },
                {
                    'key': 'macro.CE',
                    'mode': 0,
                    'value': 'Paralyzed',
                    'priority': 20
                }
            ],
            'flags': {
                'effectmacro': {
                    'onDelete': {
                        'script': mba.functionToString(effectMacroDel)
                    }
                },
                'midi-qol': {
                    'castData': {
                        baseLevel: 2,
                        castLevel: workflow.castData.castLevel,
                        itemUuid: workflow.item.uuid
                    }
                }
            }
        };
        await new Sequence()

            .effect()
            .atLocation(token)
            .file(`jb2a.magic_signs.circle.02.enchantment.loop.pink`)
            .scaleToObject(1.5)
            .rotateIn(180, 600, { ease: "easeOutCubic" })
            .scaleIn(0, 600, { ease: "easeOutCubic" })
            .loopProperty("sprite", "rotation", { from: 0, to: -360, duration: 10000 })
            .belowTokens()
            .fadeOut(2000)
            .zIndex(0)

            .effect()
            .atLocation(token)
            .file(`jb2a.magic_signs.circle.02.enchantment.loop.pink`)
            .scaleToObject(1.5)
            .rotateIn(180, 600, { ease: "easeOutCubic" })
            .scaleIn(0, 600, { ease: "easeOutCubic" })
            .loopProperty("sprite", "rotation", { from: 0, to: -360, duration: 10000 })
            .belowTokens(true)
            .filter("ColorMatrix", { saturate: -1, brightness: 2 })
            .filter("Blur", { blurX: 5, blurY: 10 })
            .zIndex(1)
            .duration(1200)
            .fadeIn(200, { ease: "easeOutCirc", delay: 500 })
            .fadeOut(300, { ease: "linear" })

            .effect()
            .file("jb2a.energy_strands.range.multiple.purple.01")
            .attachTo(token)
            .stretchTo(target)

            .wait(1500)

            .effect()
            .file("animated-spell-effects-cartoon.level 01.bless.blue")
            .atLocation(target, { randomOffset: 1.2, gridUnits: true })
            .scaleToObject(0.5)
            .repeats(8, 100, 100)
            .filter("ColorMatrix", { saturate: 1, hue: 80 })
            .zIndex(1)

            .effect()
            .file("animated-spell-effects-cartoon.cantrips.mending.purple")
            .atLocation(target)
            .scaleToObject(3)
            .opacity(0.75)
            .filter("ColorMatrix", { saturate: 1, brightness: 1.3, hue: -5 })
            .zIndex(0)
            .waitUntilFinished(-500)

            .effect()
            .delay(300)
            .file("jb2a.impact.002.pinkpurple")
            .atLocation(target)
            .scaleToObject(2)
            .opacity(1)
            .filter("ColorMatrix", { hue: 6 })
            .zIndex(0)

            .effect()
            .file("jb2a.particles.inward.white.02.03")
            .scaleIn(0, 500, { ease: "easeOutQuint" })
            .delay(300)
            .fadeOut(1000)
            .atLocation(target)
            .duration(1000)
            .size(1.75, { gridUnits: true })
            .animateProperty("spriteContainer", "position.y", { from: 0, to: -0.5, gridUnits: true, duration: 1000 })
            .zIndex(1)

            .effect()
            .file("animated-spell-effects-cartoon.magic.impact.01")
            .atLocation(target)
            .scaleToObject(2)
            .opacity(1)
            .filter("ColorMatrix", { saturate: 1, brightness: 1.3 })
            .zIndex(0)
            .belowTokens()
            .waitUntilFinished(-1600)

            .thenDo(function () {
                mba.createEffect(target.actor, effectData);
            })

            .effect()
            .file("jb2a.markers.chain.spectral_standard.loop.02.purple")
            .attachTo(target)
            .scaleIn(0, 1500, { ease: "easeOutCubic" })
            .scaleToObject(2 * target.document.texture.scaleX)
            .playbackRate(0.8)
            .opacity(0.8)
            .private()
            .fadeOut(500)
            .persist()
            .name(`${target.document.name} Hold Person`)

            .play();
    }
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let targets = Array.from(workflow.targets);
    for (let target of targets) {
        if (mba.raceOrType(target.actor) != 'humanoid') {
            ChatMessage.create({ flavor: target.name + ' is unaffected by Hold Person! (Target is not humanoid)', speaker: ChatMessage.getSpeaker({ actor: workflow.actor }) });
            await mba.createEffect(target.actor, constants.immunityEffectData);
            return;
        }
    }
}

export let holdPerson = {
    'cast': cast,
    'item': item
}