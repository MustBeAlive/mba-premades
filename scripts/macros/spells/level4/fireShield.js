import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let queueSetup = queue.setup(workflow.item.uuid, 'fireShield', 50);
    if (!queueSetup) return;
    let choices = [
        ["Warm Shield", "fire", "modules/mba-premades/icons/spells/level4/fire_shield_warm.webp"],
        ["Cold Shield", "cold", "modules/mba-premades/icons/spells/level4/fire_shield_chill.webp"]
    ];
    let selection = await mba.selectImage ("Fire Shield", choices, "<b>Choose shield type:</b>", "both");
    if (!selection.length) {
        queue.remove(workflow.item.uuid);
        return;
    }
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Fire Shield: Dismiss", false);
    if (!featureData) {
        queue.remove(workflow.item.uuid);
        return;
    }
    async function effectMacroDel() {
        await mbaPremades.macros.fireShield.end(token, origin);
    }
    let resistance = {
        'fire': 'cold',
        'cold': 'fire'
    };
    let effectData = {
        'name': workflow.item.name,
        'icon': selection[1],
        'origin': workflow.item.uuid,
        'description': `
            <p>Thin and wispy flames wreathe your body for the duration, shedding bright light in a 10-foot radius and dim light for an additional 10 feet. You can end the spell early by using an action to dismiss it.</p>
            <p>The flames provide you with a warm shield or a chill shield, as you choose. The warm shield grants you resistance to cold damage, and the chill shield grants you resistance to fire damage.</p>
            <p>In addition, whenever a creature within 5 feet of you hits you with a melee attack, the shield erupts with flame.</p>
            <p>The attacker takes 2d8 fire damage from a warm shield, or 2d8 cold damage from a cold shield.</p>
        `,
        'duration': {
            'seconds': 600
        },
        'changes': [
            {
                'key': 'system.traits.dr.value',
                'mode': 0,
                'value': resistance[selection[0]],
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.feature.onHit.fireShield',
                'mode': 5,
                'value': true,
                'priority': 20
            },
            {
                'key': 'ATL.light.bright',
                'mode': 4,
                'value': '10',
                'priority': 20
            },
            {
                'key': 'ATL.light.dim',
                'mode': 4,
                'value': '20',
                'priority': 20
            },
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'mba-premades': {
                'spell': {
                    'fireShield': selection[0]
                },
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 4,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    let updates = {
        'embedded': {
            'Item': {
                [featureData.name]: featureData
            },
            'ActiveEffect': {
                [effectData.name]: effectData
            }
        }
    };
    let options = {
        'permanent': false,
        'name': 'Fire Shield',
        'description': 'Fire Shield'
    };
    await warpgate.mutate(workflow.token.document, updates, {}, options);
    queue.remove(workflow.item.uuid);
    await animation(workflow.token, selection[0], `${workflow.token.document.name} FS`);
}

async function animation(token, selection, name) {
    let colors = {
        'fire': 'orange',
        'cold': 'blue'
    };
    let altColors = {
        'fire': 'yellow',
        'cold': 'blue'
    };

    new Sequence()

        .effect()
        .file('jb2a.impact.ground_crack.' + colors[selection] + '.01')
        .atLocation(token)
        .scaleToObject(3)
        .belowTokens()

        .effect()
        .file('jb2a.particles.outward.' + colors[selection] + '.01.03')
        .atLocation(token)
        .scaleToObject(2.75)
        .duration(15000)
        .delay(200)
        .fadeOut(3000)
        .scaleIn(0.5, 250)
        .playbackRate(1)
        .zIndex(2)

        .effect()
        .file('jb2a.energy_strands.in.' + altColors[selection] + '.01.2')
        .atLocation(token)
        .scaleToObject(2.75)
        .delay(200)
        .scaleIn(0.5, 250)
        .duration(2000)
        .belowTokens()
        .playbackRate(1)
        .zIndex(1)

        .effect()
        .file('jb2a.token_border.circle.spinning.' + colors[selection] + '.004')
        .atLocation(token)
        .attachTo(token)
        .scaleToObject(2.2)
        .fadeOut(1000)
        .playbackRate(1)
        .persist()
        .name(name)

        .effect()
        .file('jb2a.shield_themed.below.fire.03.' + colors[selection])
        .atLocation(token)
        .attachTo(token)
        .scaleToObject(1.7)
        .delay(1000)
        .fadeIn(500)
        .fadeOut(1000)
        .belowTokens()
        .playbackRate(1)
        .persist()
        .name(name)

        .effect()
        .file('jb2a.shield_themed.above.fire.03.' + colors[selection])
        .atLocation(token)
        .attachTo(token)
        .scaleToObject(1.7)
        .fadeIn(3500)
        .fadeOut(1000)
        .zIndex(0)
        .playbackRate(1)
        .persist()
        .name(name)

        .play();
}

async function end(token, origin) {
    Sequencer.EffectManager.endEffects({ 'name': `${token.document.name} FS`});
    await warpgate.revert(token.document, 'Fire Shield');
}

async function stop({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = mba.getEffects(workflow.actor).find(i => i.flags['mba-premades']?.spell?.fireShield);
    if (!effect) return;
    await mba.removeEffect(effect);
}

async function onHit(workflow, targetToken) {
    if (!workflow.hitTargets.size) return;
    let distance = mba.getDistance(workflow.token, targetToken);
    if (distance > 5) return;
    if (!constants.meleeAttacks.includes(workflow.item.system.actionType)) return;
    let effect = mba.getEffects(targetToken.actor).find(i => i.flags['mba-premades']?.spell?.fireShield);
    if (!effect) return;
    let type = effect.flags['mba-premades'].spell.fireShield;
    let featureNames = {
        'cold': 'Fire Shield: Chill Shield',
        'fire': 'Fire Shield: Warm Shield'
    };
    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Spell Features', featureNames[type], false);
    if (!featureData) return;
    delete featureData._id;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': targetToken.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([workflow.token.document.uuid]);
    let queueSetup = await queue.setup(workflow.item.uuid, 'fireShield', 50);
    if (!queueSetup) return;
    await warpgate.wait(100);
    await MidiQOL.completeItemUse(feature, config, options);
    queue.remove(workflow.item.uuid);
}

export let fireShield = {
    'item': item,
    'animation': animation,
    'end': end,
    'stop': stop,
    'onHit': onHit,
};