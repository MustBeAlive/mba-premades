import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Sanctuary` })
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are warded against attacks. Until the spell ends, any creature who targets you with an attack or a harmful spell must first make a Wisdom saving throw. On a failed save, the creature must choose a new target or lose the attack or spell.</p>
            <p>This spell doesn't protect you from area effects, such as the explosion of a fireball.</p>
            <p>If you make an attack, cast a spell that affects an enemy, or deal damage to another creature, this spell ends.</p>
        `,
        'duration': {
            'seconds': 60,
        },
        'changes': [
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.sanctuary.attack,postActiveEffects',
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
                    baseLevel: 1,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    new Sequence()

        .effect()
        .file(`jb2a.markers.light.complete.blue`)
        .attachTo(token)
        .scaleToObject(2)
        .duration(5000)
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .fadeOut(2000)
        .belowTokens()
        .zIndex(1)
        .filter("ColorMatrix", { saturate: -1, brightness: 1.5 })

        .wait(500)

        .effect()
        .attachTo(target)
        .scaleToObject(target.document.texture.scaleX)
        .duration(2000)
        .fadeIn(2000)
        .filter("ColorMatrix", { saturate: -1, brightness: 10 })
        .filter("Blur", { blurX: 5, blurY: 10 })
        .opacity(0.5)
        .waitUntilFinished(-1500)

        .effect()
        .file("jb2a.extras.tmfx.border.circle.outpulse.01.normal")
        .attachTo(target)
        .scaleToObject(3.25 * target.document.texture.scaleX)
        .delay(1200)

        .effect()
        .file("jb2a.extras.tmfx.outflow.circle.02")
        .attachTo(target)
        .scaleToObject(3 * target.document.texture.scaleX)
        .delay(1200)
        .duration(10000)
        .fadeIn(200)
        .fadeOut(500)
        .opacity(0.25)
        .belowTokens()

        .effect()
        .file("jb2a.particles.outward.blue.01.03")
        .attachTo(target)
        .scaleToObject(3 * target.document.texture.scaleX)
        .delay(1200)
        .duration(10000)
        .fadeIn(200, { ease: "easeInExpo" })
        .fadeOut(500)
        .opacity(0.25)
        .filter("ColorMatrix", { saturate: -1, brightness: 2 })
        .belowTokens()

        .effect()
        .file("jb2a.butterflies.single.blue")
        .attachTo(target, { followRotation: false })
        .scaleToObject(2 * target.document.texture.scaleX)
        .delay(1200)
        .fadeIn(2000)
        .fadeOut(1000)
        .opacity(1)
        .filter("ColorMatrix", { saturate: -1, brightness: 2 })
        .zIndex(3)
        .persist()
        .name(`${target.document.name} Sanctuary`)

        .effect()
        .file("jb2a.extras.tmfx.inflow.circle.03")
        .attachTo(target)
        .scaleToObject(target.document.texture.scaleX)
        .delay(1200)
        .fadeIn(1000)
        .fadeOut(1000)
        .opacity(0.75)
        .zIndex(1)
        .persist()
        .name(`${target.document.name} Sanctuary`)

        .effect()
        .file("jb2a.bless.200px.intro.blue")
        .attachTo(target)
        .scaleToObject(1.5 * target.document.texture.scaleX)
        .fadeIn(2000)
        .opacity(1)
        .waitUntilFinished(-500)
        .zIndex(0)

        .effect()
        .file("jb2a.bless.200px.loop.blue")
        .attachTo(target, { followRotation: false })
        .scaleToObject(1.6 * target.document.texture.scaleX)
        .fadeOut(1000)
        .opacity(0.75)
        .zIndex(0)
        .belowTokens()
        .persist()
        .name(`${target.document.name} Sanctuary`)

        .play();

    await warpgate.wait(2400);
    await mba.createEffect(target.actor, effectData)
}

async function hook(workflow) {
    if (!workflow.token) return;
    if (workflow.targets.size != 1) return;
    let invalidTypes = [
        'cone',
        'cube',
        'cylinder',
        'line',
        'radious',
        'sphere',
        'square',
        'wall'
    ];
    if (invalidTypes.includes(workflow.item.system.target?.type)) return;
    let targetToken = workflow.targets.first();
    if (targetToken.document.disposition === workflow.token.document.disposition) return;
    let targetActor = targetToken.actor;
    let targetEffect = mba.findEffect(targetActor, 'Sanctuary');
    if (!targetEffect) return;
    let targetItem = await fromUuid(targetEffect.origin);
    if (!targetItem) return;
    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Spell Features', 'Sanctuary: Save', false);
    if (!featureData) return;
    featureData.system.save.dc = mba.getSpellDC(targetItem);
    setProperty(featureData, 'flags.mba-premades.spell.sanctuary.ignore', true);
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': targetItem.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([workflow.token.document.uuid]);
    let queueSetup = await queue.setup(workflow.item.uuid, 'sanctuary', 48);
    if (!queueSetup) return;
    await warpgate.wait(100);
    let spellWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (!spellWorkflow.failedSaves.size) {
        queue.remove(workflow.item.uuid);
        return;
    }
    queue.remove(workflow.item.uuid);
    const messageData = { flavor: `<b>${workflow.token.document.name}</b> failed save against <b>Sanctuary</b> and must choose new target, or lose the attack/spell.` };
    await ChatMessage.create(messageData);
    new Sequence()

        .effect()
        .file('jb2a.bless.200px.intro.blue')
        .atLocation(workflow.token)
        .scaleToObject(1.5 * workflow.token.document.texture.scaleX)
        .fadeIn(2000)
        .fadeOut(500)
        .opacity(1)
        .zIndex(0)

        .play();

    return false;
}

async function attack({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.item.flags['mba-premades']?.spell?.sanctuary?.ignore) return;
    let remove = false;
    let defaultDamageType = workflow.defaultDamageType;
    if (workflow.damageRoll && !(defaultDamageType === 'healing' || defaultDamageType === 'temphp')) {
        remove = true;
    }
    if (!remove && constants.attacks.includes(workflow.item.system.actionType)) remove = true;
    if (!remove && workflow.item.type === 'spell') {
        for (let i of Array.from(workflow.targets)) {
            if (workflow.token.document.disposition != i.document.disposition) {
                remove = true;
                break;
            }
        }
    }
    if (!remove) return;
    let effect = mba.findEffect(workflow.actor, 'Sanctuary');
    if (!effect) return;
    await mba.removeEffect(effect);
}

export let sanctuary = {
    'item': item,
    'hook': hook,
    'attack': attack
}