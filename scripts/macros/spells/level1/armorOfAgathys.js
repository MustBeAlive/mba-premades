import { constants } from "../../generic/constants.js";
import { mba } from "../../../helperFunctions.js";
import { queue } from "../../mechanics/queue.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    async function effectMacroStart() {
        await mbaPremades.macros.armorOfAgathys.start(token);
    };
    async function effectMacroEnd() {
        await mbaPremades.macros.armorOfAgathys.end(token);
    };
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>A protective magical force surrounds you, manifesting as a spectral frost that covers you and your gear.</p>
            <p>You gain ${workflow.castData.castLevel * 5} temporary hit points for the duration.</p>
            <p>If a creature hits you with a melee attack while you have these hit points, the creature takes ${workflow.castData.castLevel * 5} cold damage.</p>
        `,
        'duration': {
            'seconds': 3600
        },
        'changes': [
            {
                'key': 'flags.mba-premades.feature.onHit.armorOfAgathys',
                'mode': 5,
                'value': true,
                'priority': 20
            }
        ],
        'flags': {
            'effectmacro': {
                'onCreate': {
                    'script': mba.functionToString(effectMacroStart)
                },
                'onDelete': {
                    'script': mba.functionToString(effectMacroEnd)
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
    await mba.createEffect(workflow.actor, effectData);
}

async function onHit(workflow, targetToken) {
    if (workflow.hitTargets.size != 1) return;
    let tempHP = targetToken.actor.system.attributes.hp.temp;
    let effect = mba.findEffect(targetToken.actor, 'Armor of Agathys');
    if (!effect) return;
    if (!constants.meleeAttacks.includes(workflow.item?.system?.actionType)) {
        if (tempHP === 0) await mba.removeEffect(effect);
        return;
    }
    let damage = effect.flags['midi-qol'].castData.castLevel * 5;
    let queueSetup = await queue.setup(workflow.uuid, 'armorOfAgathys', 50);
    if (!queueSetup) return;
    if (tempHP === 0) await mba.removeEffect(effect);
    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Spell Features', 'Armor of Agathys: Damage Reflect');
    if (!featureData) {
        queue.remove(workflow.uuid);
        return;
    }
    delete featureData._id;
    featureData.system.damage.parts[0][0] = damage + '[cold]';
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': targetToken.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([workflow.token.document.uuid]);
    await warpgate.wait(100);
    await MidiQOL.completeItemUse(feature, config, options);
    queue.remove(workflow.uuid);

    new Sequence()

        .effect()
        .file('jb2a.impact.004.blue')
        .atLocation(targetToken)
        .rotateTowards(workflow.token)
        .scaleToObject(1.45)
        .spriteScale({ 'x': 0.75, 'y': 1.0 })
        .filter('ColorMatrix', { 'saturate': -0.75, 'brightness': 1.5 })
        .spriteOffset({ 'x': -0.15 }, { 'gridUnits': true })

        .effect()
        .file('jb2a.side_impact.part.fast.ice_shard.blue')
        .atLocation(targetToken)
        .rotateTowards(workflow.token)
        .scaleToObject(2)
        .randomizeMirrorY()
        .zIndex(2)

        .effect()
        .from(workflow.token)
        .atLocation(workflow.token)
        .scaleToObject(workflow.token.document.texture.scaleX)
        .duration(500)
        .fadeIn(100)
        .fadeOut(100)
        .loopProperty('sprite', 'position.x', { 'from': -0.05, 'to': 0.05, 'duration': 175, 'pingPong': true, 'gridUnits': true })
        .opacity(0.15)

        .play()
}

async function start(token) {
    new Sequence()

        .effect()
        .file('jb2a.ward.rune.dark_purple.01')
        .atLocation(token)
        .scaleToObject(1.85)
        .fadeOut(3000)
        .scaleIn(0, 500, { 'ease': 'easeOutCubic' })
        .belowTokens()
        .filter('ColorMatrix', { 'brightness': 2, 'saturate': -0.75, 'hue': -75 })

        .effect()
        .file('jb2a.magic_signs.rune.02.complete.06.blue')
        .attachTo(token)
        .scaleToObject(0.75 * token.document.texture.scaleX)
        .delay(250)
        .scaleIn(0, 500, { 'ease': 'easeOutCubic' })
        .playbackRate(2.5)
        .opacity(1)
        .zIndex(3)

        .effect()
        .file('jb2a.extras.tmfx.border.circle.inpulse.01.fast')
        .attachTo(token)
        .scaleToObject(1.5 * token.document.texture.scaleX)
        .opacity(1)
        .zIndex(3)

        .effect()
        .file('jb2a.extras.tmfx.inflow.circle.01')
        .attachTo(token)
        .scaleToObject(1 * token.document.texture.scaleX)
        .fadeIn(1500)
        .fadeOut(500)
        .extraEndDuration(1500)
        .randomRotation()
        .opacity(0.9)
        .zIndex(2)
        .persist()
        .name(`${token.document.name} Armor of Agathys`)

        .effect()
        .file('jb2a.extras.tmfx.outflow.circle.01')
        .attachTo(token)
        .scaleToObject(1.35 * token.document.texture.scaleX)
        .fadeIn(1500)
        .fadeOut(500)
        .extraEndDuration(1500)
        .scaleIn(0, 1500, { 'ease': 'easeOutCubic' })
        .randomRotation()
        .belowTokens()
        .opacity(0.9)
        .zIndex(1)
        .persist()
        .name(`${token.document.name} Armor of Agathys`)

        .effect()
        .file('jb2a.template_circle.symbol.normal.snowflake.blue')
        .attachTo(token)
        .scaleToObject(1.35 * token.document.texture.scaleX)
        .fadeIn(1500)
        .fadeOut(500)
        .extraEndDuration(1500)
        .scaleIn(0, 1500, { 'ease': 'easeOutCubic' })
        .randomRotation()
        .belowTokens()
        .opacity(0.75)
        .zIndex(2)
        .persist()
        .name(`${token.document.name} Armor of Agathys`)

        .effect()
        .file('jb2a.shield.01.loop.blue')
        .attachTo(token)
        .scaleToObject(1.5 * token.document.texture.scaleX)
        .fadeIn(1500)
        .fadeOut(500)
        .opacity(0.75)
        .zIndex(1)
        .persist()
        .name(`${token.document.name} Armor of Agathys`)

        .waitUntilFinished(-1000)

        .play();
}

async function end(token) {
    Sequencer.EffectManager.endEffects({ 'name': `${token.document.name} Armor of Agathys`, 'object': token });
    new Sequence()

        .effect()
        .attachTo(token)
        .file('jb2a.shield.01.outro_explode.blue')
        .scaleToObject(1.5 * token.document.texture.scaleX)
        .opacity(0.75)
        .fadeOut(500)
        .zIndex(1)

        .play()
        
    if (token.actor.system.attributes.hp.temp > 0) await token.actor.update({ "system.attributes.hp.temp": 0 });
}

export let armorOfAgathys = {
    'cast': cast,
    'onHit': onHit,
    'start': start,
    'end': end
}