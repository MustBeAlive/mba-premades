import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Mirror Image` })
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Three illusory duplicates of yourself appear in your space. Until the spell ends, the duplicates move with you and mimic your actions, shifting position so it's impossible to track which image is real. You can use your action to dismiss the illusory duplicates.</p>
            <p>Each time a creature targets you with an attack during the spell's duration, roll a d20 to determine whether the attack instead targets one of your duplicates.</p>
            <p>If you have three duplicates, you must roll a 6 or higher to change the attack's target to a duplicate. With two duplicates, you must roll an 8 or higher. With one duplicate, you must roll an 11 or higher.</p>
            <p>A duplicate's AC equals 10 + your Dexterity modifier. If an attack hits a duplicate, the duplicate is destroyed. A duplicate can be destroyed only by an attack that hits it. It ignores all other damage and effects. The spell ends when all three duplicates are destroyed.</p>
            <p>A creature is unaffected by this spell if it can't see, if it relies on senses other than sight, such as blindsight, or if it can perceive illusions as false, as with truesight.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'flags.mba-premades.spell.mirrorImage',
                'mode': 5,
                'value': 3,
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
    new Sequence()

        .effect()
        .file("jb2a.shimmer.01.purple")
        .opacity(0.5)
        .rotate(-90)
        .scaleToObject(1.25)
        .atLocation(token)

        .animation()
        .on(token)
        .opacity(0)

        .effect()
        .file("jb2a.particles.outward.purple.02.03")
        .scaleToObject(2.5)
        .atLocation(token)
        .attachTo(token)
        .fadeIn(1000)
        .duration(4000)
        .fadeOut(2000)
        .randomRotation()

        .effect()
        .from(token)
        .atLocation(token)
        .belowTokens()
        .animateProperty("sprite", "position.x", { from: -80, to: 80, duration: 1500, pingPong: true })
        .duration(1500)
        .opacity(0.75)
        .tint("#d0c2ff")
        .loopProperty("alphaFilter", "alpha", { from: 0.75, to: 0.5, duration: 2000, pingPong: true })

        .effect()
        .from(token)
        .atLocation(token)
        .belowTokens()
        .animateProperty("sprite", "position.x", { from: 80, to: -80, duration: 1500, pingPong: true })
        .duration(1500)
        .opacity(0.75)
        .tint("#d0c2ff")
        .loopProperty("alphaFilter", "alpha", { from: 0.75, to: 0.5, duration: 2000, pingPong: true })

        .wait(500)

        .effect()
        .from(token)
        .atLocation(token)
        .scale(1)
        .anchor({ x: 0.9 + (1 * 0.05) })
        .belowTokens()
        .attachTo(token, { bindAlpha: false, followRotation: false })
        .animateProperty("spriteContainer", "rotation", { from: 180, to: -10, duration: 500 })
        .loopProperty("sprite", "position.x", { from: -5, to: 5, duration: 2500, pingPong: true })
        .zeroSpriteRotation()
        .opacity(0.75)
        .tint("#d0c2ff")
        .loopProperty("alphaFilter", "alpha", { from: 0.75, to: 0.5, duration: 2000, pingPong: true })
        .zIndex(4)
        .fadeOut(500)
        .persist()
        .name(`${token.document.name} Mirror Image 1`)

        .effect()
        .from(token)
        .atLocation(token)
        .anchor({ x: 0.9 + (2 * 0.05) })
        .belowTokens()
        .attachTo(token, { bindAlpha: false, followRotation: false })
        .animateProperty("spriteContainer", "rotation", { from: 0, to: 190, duration: 500 })
        .loopProperty("sprite", "position.x", { from: -5, to: 5, duration: 2500, pingPong: true, delay: 250 })
        .zeroSpriteRotation()
        .opacity(0.75)
        .tint("#d0c2ff")
        .loopProperty("alphaFilter", "alpha", { from: 0.75, to: 0.5, duration: 2000, pingPong: true })
        .zIndex(4)
        .fadeOut(500)
        .persist()
        .name(`${token.document.name} Mirror Image 2`)

        .effect()
        .from(token)
        .atLocation(token)
        .anchor({ x: 0.9 + (3 * 0.05) })
        .belowTokens()
        .attachTo(token, { bindAlpha: false, followRotation: false })
        .animateProperty("spriteContainer", "rotation", { from: 0, to: 90, duration: 250 })
        .loopProperty("sprite", "position.x", { from: -5, to: 5, duration: 2500, pingPong: true })
        .zeroSpriteRotation()
        .opacity(0.75)
        .tint("#d0c2ff")
        .loopProperty("alphaFilter", "alpha", { from: 0.75, to: 0.5, duration: 2000, pingPong: true })
        .delay(100)
        .zIndex(4)
        .fadeOut(500)
        .persist()
        .name(`${token.document.name} Mirror Image 3`)

        .wait(200)

        .thenDo(function () {
            mba.createEffect(workflow.actor, effectData);
        })

        .effect()
        .file("jb2a.shimmer.01.purple")
        .opacity(0.5)
        .rotate(90)
        .scaleToObject(1.25)
        .atLocation(token)

        .animation()
        .on(token)
        .fadeIn(1000)
        .opacity(1)

        .play();
}

async function hook(workflow) {
    if (workflow.targets.size != 1) return;
    if (workflow.isFumble === true) return;
    let targetToken = workflow.targets.first();
    let targetActor = targetToken.actor;
    let targetEffect = mba.findEffect(targetActor, 'Mirror Image');
    if (!targetEffect) return;
    let attackingToken = workflow.token;
    if (!MidiQOL.canSee(attackingToken, targetToken)) return;
    if (MidiQOL.canSense(attackingToken, targetToken, ['blindsight', 'seeAll'])) return;
    let duplicates = targetActor.flags['mba-premades']?.spell?.mirrorImage;
    if (!duplicates) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'mirrorImage', 49);
    if (!queueSetup) return;
    let roll = await new Roll('1d20').roll({ 'async': true });
    roll.toMessage({
        'rollMode': 'roll',
        'speaker': { 'alias': name },
        'flavor': 'Mirror Image'
    });
    let rollTotal = roll.total;
    let rollNeeded;
    switch (duplicates) {
        case 3:
            rollNeeded = 6;
            break;
        case 2:
            rollNeeded = 8;
            break;
        case 1:
            rollNeeded = 11;
            break;
    }
    if (rollTotal < rollNeeded) {
        queue.remove(workflow.item.uuid);
        ChatMessage.create({
            'speaker': { 'alias': name },
            'content': `<b>${workflow.token.document.name}</b> finds real instance of <b>${targetToken.document.name}!</b>.`
        });
        return;
    }
    let duplicateAC = 10 + targetActor.system.abilities.dex.mod;
    if (workflow.attackTotal >= duplicateAC) {
        workflow.hitTargets.delete(workflow.targets.first());
        ChatMessage.create({
            'speaker': { 'alias': name },
            'content': `<b>${workflow.token.document.name}'s</b> attack hit a duplicate and destroyed it.`
        });
        if (duplicates === 3) Sequencer.EffectManager.endEffects({ name: `${targetToken.document.name} Mirror Image 3` })
        if (duplicates === 2) Sequencer.EffectManager.endEffects({ name: `${targetToken.document.name} Mirror Image 2` })
        if (duplicates === 1) {
            await mba.removeEffect(targetEffect);
            return;
        }
        let updates = {
            'changes': [
                {
                    'key': 'flags.mba-premades.spell.mirrorImage',
                    'mode': 5,
                    'value': duplicates - 1,
                    'priority': 20
                }
            ]
        };
        await mba.updateEffect(targetEffect, updates);

    } else {
        ChatMessage.create({
            'speaker': { 'alias': name },
            'content': `<b>${workflow.token.document.name}'s</b> attack targeted a duplicate and missed.`
        });
    }
    queue.remove(workflow.item.uuid);
}

export let mirrorImage = {
    'item': item,
    'hook': hook
}