import { constants } from '../../generic/constants.js';
import { mba } from '../../../helperFunctions.js';
import { enlargeReduce } from '../../spells/level2/enlargeReduce.js';

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.actor || !workflow.token) return;
    let effect = mba.findEffect(workflow.actor, 'Concentrating');
    if (effect) mba.removeEffect(effect);
    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Class Feature Items', 'Rage: End', false);
    if (!featureData) return;
    async function effectMacro() {
        if (mbaPremades.helpers.getItem(actor, 'Call the Hunt')) await mbaPremades.macros.callTheHunt.rageEnd(effect);
        await warpgate.revert(token.document, 'Rage');
        await mbaPremades.macros.rage.animationEnd(token);
        if (mbaPremades.helpers.getItem(actor, 'Giant\'s Havoc: Giant Stature')) await warpgate.revert(token.document, 'Giant Stature');
        let effect2 = mbaPremades.helpers.findEffect(actor, 'Elemental Cleaver');
        if (effect2) await mbaPremades.helpers.removeEffect(effect2);
    };
    async function effectMacro2() {
        await mbaPremades.macros.rage.animationStart(token);
    };
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': ``,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'flags.midi-qol.advantage.ability.check.str',
                'mode': 0,
                'value': '1',
                'priority': 0
            },
            {
                'key': 'flags.midi-qol.advantage.ability.save.str',
                'mode': 0,
                'value': '1',
                'priority': 0
            },
            {
                'key': 'system.traits.dr.value',
                'mode': 0,
                'value': 'slashing',
                'priority': 20
            },
            {
                'key': 'system.traits.dr.value',
                'mode': 0,
                'value': 'piercing',
                'priority': 20
            },
            {
                'key': 'system.traits.dr.value',
                'mode': 0,
                'value': 'bludgeoning',
                'priority': 20
            },
            {
                'key': 'system.bonuses.mwak.damage',
                'mode': 2,
                'value': '+ @scale.barbarian.rage-damage',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.fail.spell.vocal',
                'value': '1',
                'mode': 0,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.fail.spell.somatic',
                'value': '1',
                'mode': 0,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.fail.spell.material',
                'value': '1',
                'mode': 0,
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'specialDuration': ['zeroHP']
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacro)
                },
                'onCreate': {
                    'script': mba.functionToString(effectMacro2)
                }
            }
        }
    };
    if (!mba.getItem(actor, 'Persistent Rage')) {
        effectData.changes = effectData.changes.concat([
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.rage.attack,postActiveEffects',
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.feature.onHit.rage',
                'mode': 5,
                'value': true,
                'priority': 20
            }
        ]);
        effectData.flags.effectmacro.onTurnEnd = {
            'script': 'await mbaPremades.macros.rage.turnEnd(effect, actor);'
        }
        effectData.flags.effectmacro.onCombatStart = {
            'script': 'await mbaPremades.macros.rage.combatStart(effect);'
        }
        if (mba.inCombat()) setProperty(effectData, 'flags.mba-premades.feature.rage.attackOrAttacked', { 'turn': game.combat.turn, 'round': game.combat.round });
    }
    let totemBear = mba.getItem(workflow.actor, 'Totem Spirit: Bear');
    if (totemBear) {
        effectData.changes = effectData.changes.concat([
            {
                'key': 'system.traits.dr.value',
                'mode': 0,
                'value': 'acid',
                'priority': 20
            },
            {
                'key': 'system.traits.dr.value',
                'mode': 0,
                'value': 'cold',
                'priority': 20
            },
            {
                'key': 'system.traits.dr.value',
                'mode': 0,
                'value': 'fire',
                'priority': 20
            },
            {
                'key': 'system.traits.dr.value',
                'mode': 0,
                'value': 'force',
                'priority': 20
            },
            {
                'key': 'system.traits.dr.value',
                'mode': 0,
                'value': 'lightning',
                'priority': 20
            },
            {
                'key': 'system.traits.dr.value',
                'mode': 0,
                'value': 'necrotic',
                'priority': 20
            },
            {
                'key': 'system.traits.dr.value',
                'mode': 0,
                'value': 'poison',
                'priority': 20
            },
            {
                'key': 'system.traits.dr.value',
                'mode': 0,
                'value': 'radiant',
                'priority': 20
            },
            {
                'key': 'system.traits.dr.value',
                'mode': 0,
                'value': 'thunder',
                'priority': 20
            }
        ]);
    };
    let crushingThrow = mba.getItem(workflow.actor, 'Giant\'s Havoc: Crushing Throw');
    if (crushingThrow) {
        effectData.changes = effectData.changes.concat([
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.crushingThrow,postDamageRoll',
                'priority': 20
            }
        ]);
    };
    let giantStature = mba.getItem(workflow.actor, 'Giant\'s Havoc: Giant Stature');
    let demiurgicColossus = mba.getItem(workflow.actor, 'Demiurgic Colossus');
    if (giantStature && mba.getSize(workflow.actor) < (demiurgicColossus ? 4 : 3)) {
        let lrgRoom = mba.checkForRoom(workflow.token, 1);
        let lrgDirection = mba.findDirection(lrgRoom);
        if (lrgDirection != 'none') {
            let hgRoom;
            let hgDirection;
            let dCSelection = 'lg';
            if (demiurgicColossus) {
                hgRoom = mba.checkForRoom(workflow.token, 2);
                if (!lrgRoom.n && !lrgRoom.e && !lrgRoom.s && !lrgRoom.w) hgDirection = 'outward';
                if (hgDirection != 'outward') hgDirection = mba.findDirection(hgRoom);
                if (hgDirection != 'none') dCSelection = await mba.dialog(demiurgicColossus.name, [['Large', 'lg'], ['Huge', 'huge']], 'What size?') ?? 'lg';
            }
            if (dCSelection === 'huge') await demiurgicColossus.displayCard();
            let updates2 = {
                'token': {
                    'width': dCSelection === 'lg' ? 2 : 3,
                    'height': dCSelection === 'lg' ? 2 : 3
                },
                'actor': {
                    'system': {
                        'traits': {
                            'size': dCSelection
                        }
                    }
                }
            }
            let direction = dCSelection === 'lg' ? lrgDirection : hgDirection;
            let scale = dCSelection === 'lg' ? 1 : 2;
            switch (direction) {
                case 'none':
                    break;
                case 'ne':
                    setProperty(updates2.token, 'y', workflow.token.y - canvas.grid.size * scale);
                    break;
                case 'sw':
                    setProperty(updates2.token, 'x', workflow.token.x - canvas.grid.size * scale);
                    break;
                case 'outward':
                    scale = 1;
                case 'nw':
                    setProperty(updates2.token, 'x', workflow.token.x - canvas.grid.size * scale);
                    setProperty(updates2.token, 'y', workflow.token.y - canvas.grid.size * scale);
                    break;
            }
            let callbacks = {
                'delta': (delta, tokenDoc) => {
                    if ('x' in delta.token) delete delta.token.x;
                    if ('y' in delta.token) delete delta.token.y;
                }
            };
            if (mba.jb2aCheck() === 'patreon') {
                await enlargeReduce.enlargeAnimation(workflow.token, updates2, 'Giant Stature', callbacks);
            } else {
                let options = {
                    'permanent': false,
                    'name': 'Giant Stature',
                    'description': 'Giant Stature'
                };
                await warpgate.mutate(workflow.token.document, updates2, callbacks, options);
            }
            effectData.changes = effectData.changes.concat([
                {
                    'key': 'flags.midi-qol.range.mwak',
                    'mode': 2,
                    'value': (demiurgicColossus ? 10 : 5),
                    'priority': 20
                }
            ]);
            await giantStature.displayCard();
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
    let formOfBeastFeature = mba.getItem(workflow.actor, 'Form of the Beast');
    if (formOfBeastFeature) {
        let selection = await mba.dialog(formOfBeastFeature.name, [['Bite', 'Form of the Beast: Bite'], ['Claws', 'Form of the Beast: Claws'], ['Tail', 'Form of the Beast: Tail'], ['None', false]], 'Manifest a natural weapon?');
        if (selection) {
            let featureData2 = await mba.getItemFromCompendium('mba-premades.MBA Class Feature Items', selection);
            if (!featureData2) return;
            if (mba.getItem(workflow.actor, 'Bestial Soul')) setProperty(featureData2, 'flags.midiProperties.magicdam', true);
            setProperty(featureData2, 'flags.mba-premades.feature.formOfTheBeast.natural', true);
            updates.embedded.Item[selection] = featureData2;
            if (selection === 'Form of the Beast: Tail') {
                let featureData3 = await mba.getItemFromCompendium('mba-premades.MBA Class Feature Items', 'Form of the Beast: Tail Reaction');
                if (!featureData3) return;
                updates.embedded.Item[featureData3.name] = featureData3;
            }
            await formOfBeastFeature.use();
        }
    };
    let options = {
        'permanent': false,
        'name': 'Rage',
        'description': featureData.name
    };
    await warpgate.mutate(workflow.token.document, updates, {}, options);
    let callTheHunt = mba.getItem(workflow.actor, 'Call the Hunt');
    if (callTheHunt) {
        if (callTheHunt.system.uses.value) {
            let selection = await mba.dialog(callTheHunt.name, constants.yesNo, 'Use ' + callTheHunt.name + '?');
            if (selection) await callTheHunt.use();
        }
    };
    let wildSurge = mba.getItem(workflow.actor, 'Wild Surge');
    if (wildSurge) await wildSurge.use();
    let elementalCleaver = mba.getItem(workflow.actor, 'Elemental Cleaver');
    if (elementalCleaver) await elementalCleaver.use();
}

async function end({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.actor) return;
    let effect = mba.findEffect(workflow.actor, 'Rage');
    if (!effect) return;
    await mba.removeEffect(effect);
}

async function attack({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = mba.findEffect(workflow.actor, 'Rage');
    if (!effect) return;
    if (!mba.inCombat()) return;
    if (!constants.attacks.includes(workflow.item.system.actionType)) return;
    await effect.setFlag('mba-premades', 'feature.rage.attackOrAttacked', { 'turn': game.combat.turn, 'round': game.combat.round });
}

async function attacked(workflow, token) {
    let effect = mba.findEffect(token.actor, 'Rage');
    if (!effect) return;
    if (!mba.inCombat()) return;
    if (!workflow.damageRoll) return;
    let damageItem = workflow.damageList.find(i => i.tokenId === token.id);
    if (!damageItem) return;
    if (damageItem.newHP >= damageItem.oldHP) return;
    let updates = {
        'flags': {
            'mba-premades': {
                'feature': {
                    'rage': {
                        'attackOrAttacked': {
                            'turn': game.combat.turn,
                            'round': game.combat.round
                        }
                    }
                }
            }
        }
    };
    await mba.updateEffect(effect, updates);
}

async function turnEnd(effect, actor) {
    let lastRound = effect.flags['mba-premades']?.feature?.rage?.attackOrAttacked?.round;
    let lastTurn = effect.flags['mba-premades']?.feature?.rage?.attackOrAttacked?.turn;
    if (lastRound === undefined || lastTurn === undefined) return;
    let currentRound = game.combat.previous.round;
    let currentTurn = game.combat.previous.turn;
    let roundDiff = currentRound - lastRound;
    if (roundDiff >= 1) {
        if (currentTurn >= lastTurn) {
            let userId = mba.lastGM();
            let selection = await mba.remoteDialog('Rage', constants.yesNo, userId, actor.name + ' has not attacked an enemy or taken damage since their last turn. Remove Rage?');
            if (!selection) return;
            await mba.removeEffect(effect);
        }
    }
}

async function combatStart(effect) {
    await effect.setFlag('mba-premades', 'feature.rage.attackOrAttacked', { 'turn': 0, 'round': 0 });
}

async function animationStart(token) {
    let choices = [["Default", "default"], ["Lightning", "lightning"]];
    let animation = await mba.dialog("Choose animation:", choices);
    if (!animation) animation = "default";
    switch (animation) {
        case 'default':
            new Sequence()

                .effect()
                .file('jb2a.extras.tmfx.outpulse.circle.02.normal')
                .atLocation(token)
                .size(4, { 'gridUnits': true })
                .opacity(0.25)

                .effect()
                .file('jb2a.impact.ground_crack.orange.02')
                .atLocation(token)
                .belowTokens()
                .filter('ColorMatrix', { 'hue': 20, 'saturate': 1 })
                .size(3.5, { 'gridUnits': true })
                .zIndex(1)

                .effect()
                .file('jb2a.impact.ground_crack.still_frame.02')
                .atLocation(token)
                .belowTokens()
                .fadeIn(2000)
                .filter('ColorMatrix', { 'hue': -15, 'saturate': 1 })
                .size(3.5, { 'gridUnits': true })
                .duration(8000)
                .fadeOut(3000)
                .zIndex(0)

                .effect()
                .file('jb2a.wind_stream.white')
                .atLocation(token, { 'offset': { 'y': 75 } })
                .size(1.75, { 'gridUnits': true })
                .rotate(90)
                .opacity(1)
                .loopProperty('sprite', 'position.y', { 'from': -5, 'to': 5, 'duration': 50, 'pingPong': true })
                .duration(8000)
                .fadeOut(3000)
                .tint('#FFDD00')

                .effect()
                .file('jb2a.particles.outward.orange.01.03')
                .atLocation(token)
                .scaleToObject(2.5)
                .opacity(1)
                .fadeIn(200)
                .fadeOut(3000)
                .loopProperty('sprite', 'position.x', { 'from': -5, 'to': 5, 'duration': 50, 'pingPong': true })
                .animateProperty('sprite', 'position.y', { 'from': 0, 'to': -100, 'duration': 6000, 'pingPong': true, 'delay': 2000 })
                .duration(8000)

                .effect()
                .file('jb2a.wind_stream.white')
                .attachTo(token)
                .scaleToObject()
                .rotate(90)
                .opacity(1)
                .filter('ColorMatrix', { 'saturate': 1 })
                .tint('#FFDD00')
                .fadeOut(500)
                .persist()
                .private()
                .name(`${token.document.name} Rage`)

                .effect()
                .file('jb2a.token_border.circle.static.orange.012')
                .attachTo(token)
                .opacity(0.7)
                .scaleToObject(1.9)
                .filter('ColorMatrix', { 'hue': 30, 'saturate': 1, 'contrast': 0, 'brightness': 1 })
                .fadeOut(500)
                .mask()
                .persist()
                .name(`${token.document.name} Rage`)

                .play();
            break;
        case 'lightning':
            new Sequence()

                .effect()
                .file('jb2a.extras.tmfx.outpulse.circle.02.normal')
                .atLocation(token)
                .size(4, { 'gridUnits': true })
                .opacity(0.25)

                .effect()
                .file('jb2a.impact.ground_crack.purple.02')
                .atLocation(token)
                .belowTokens()
                .filter('ColorMatrix', { 'hue': -15, 'saturate': 1 })
                .size(3.5, { 'gridUnits': true })
                .zIndex(1)

                .effect()
                .file('jb2a.impact.ground_crack.still_frame.02')
                .atLocation(token)
                .belowTokens()
                .fadeIn(1000)
                .filter('ColorMatrix', { 'hue': -15, 'saturate': 1 })
                .size(3.5, { 'gridUnits': true })
                .duration(8000)
                .fadeOut(3000)
                .zIndex(0)

                .effect()
                .file('jb2a.static_electricity.03.purple')
                .atLocation(token)
                .size(3, { 'gridUnits': true })
                .rotate(90)
                .randomRotation()
                .opacity(0.75)
                .belowTokens()
                .duration(8000)
                .fadeOut(3000)

                .effect()
                .file('jb2a.particles.outward.purple.01.03')
                .atLocation(token)
                .scaleToObject(2.5)
                .opacity(1)
                .fadeIn(200)
                .fadeOut(3000)
                .loopProperty('sprite', 'position.x', { 'from': -5, 'to': 5, 'duration': 50, 'pingPong': true })
                .animateProperty('sprite', 'position.y', { 'from': 0, 'to': -100, 'duration': 6000, 'pingPong': true, 'delay': 2000 })
                .duration(8000)

                .effect()
                .file('jb2a.static_electricity.03.purple')
                .attachTo(token)
                .scaleToObject()
                .rotate(90)
                .opacity(1)
                .fadeOut(500)
                .persist()
                .private()
                .name(`${token.document.name} Rage`)

                .effect()
                .file('jb2a.token_border.circle.static.purple.009')
                .attachTo(token)
                //.belowTokens()
                .opacity(1)
                .scaleToObject(1.9)
                //.zIndex(5)
                .fadeOut(500)
                .mask()
                .persist()
                .name(`${token.document.name} Rage`)

                .play()
            break;
    }
}

async function animationEnd(token) {
    await Sequencer.EffectManager.endEffects({ 'name': `${token.document.name} Rage`, 'object': token });
    new Sequence()

        .animation()
        .on(token)
        .opacity(1)

        .play();
}

export let rage = {
    'item': item,
    'end': end,
    'animationStart': animationStart,
    'animationEnd': animationEnd,
    'attack': attack,
    'attacked': attacked,
    'turnEnd': turnEnd,
    'combatStart': combatStart
}