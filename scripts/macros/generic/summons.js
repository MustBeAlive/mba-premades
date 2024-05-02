import {mba} from "../../helperFunctions.js";
import {socket} from "../../module.js";

async function spawn(sourceActors, updates, duration, originItem, useActorOrigin = false, groupInitiative = false, maxRange, casterToken, spawnAnimation, callbacks, castLevel) {
    async function effectMacro() {
        let summons = effect.flags['mba-premades']?.summons?.ids[effect.name];
        if (!summons) return;
        for (let i of summons) { await warpgate.dismiss(i) };
    }
    let effect = mba.findEffect(originItem.actor, originItem.name);
    if (!effect) {
        let casterEffectData = {
            'name': originItem.name,
            'icon': originItem.img,
            'origin': originItem.uuid,
            'duration': {
                'seconds': duration
            },
            'flags': {
                'effectmacro': {
                    'onDelete': {
                        'script': mba.functionToString(effectMacro)
                    }
                },
                'midi-qol': {
                    'castData': {
                        baseLevel: originItem.system.level,
                        castLevel: castLevel,
                        itemUuid: originItem.uuid
                    }
                }
            }
        };
        if (useActorOrigin) casterEffectData.origin = originItem.actor.uuid;
        await mba.createEffect(originItem.actor, casterEffectData);
        effect = mba.findEffect(originItem.actor, originItem.name);
    }
    if (!effect) return;
    let effectData = {
        'name': `${casterToken.document.name} ${originItem.name}`,
        'icon': originItem.img,
        'origin': originItem.uuid,
        'duration': {
            'seconds': duration
        },
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': 'let effect = await fromUuid("' + effect.uuid + '"); if (effect) await mbaPremades.helpers.removeEffect(effect);'
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: originItem.system.level,
                    castLevel: castLevel,
                    itemUuid: originItem.uuid
                }
            }
        }
    };
    if (!updates) updates = {};
    setProperty(updates, 'embedded.ActiveEffect.Summoned Creature', effectData);
    let summonsIds = effect.flags['mba-premades']?.summons?.ids[originItem.name] ?? [];
    let groupInitiativeValue;
    for (let i of sourceActors) {
        let updates2 = duplicate(updates);
        if (originItem.actor.flags['mba-premades']?.feature?.undeadThralls && originItem.system.school === 'nec') { // Undead Thralls automation
            let wizardLevels = originItem.actor.classes.wizard?.system?.levels;
            if (wizardLevels) {
                setProperty(updates2, 'actor.system.attributes.hp.formula', i.system.attributes.hp.formula + ' + ' + wizardLevels);
                setProperty(updates2, 'actor.system.bonuses.mwak.damage', originItem.actor.system.attributes.prof);
                setProperty(updates2, 'actor.system.bonuses.rwak.damage', originItem.actor.system.attributes.prof);
            }
        }
        let spawnedTokens = await mba.spawn(i, updates2, callbacks, casterToken, maxRange, spawnAnimation);
        if (!spawnedTokens) return;
        let spawnedToken = game.canvas.scene.tokens.get(spawnedTokens[0]);
        if (!spawnedToken) return;
        summonsIds.push(spawnedToken.id);
        if (mba.inCombat()) {
            let casterCombatant = game.combat.combatants.contents.find(combatant => combatant.actorId === originItem.actor.id);
            if (casterCombatant) {
                let initiative;
                if (groupInitiative) {
                    if (groupInitiativeValue) {
                        await socket.executeAsGM('createCombatant', spawnedToken.id, spawnedToken.actor.id, canvas.scene.id, groupInitiativeValue);
                    } else {
                        await socket.executeAsGM('createCombatant', spawnedToken.id, spawnedToken.actor.id, canvas.scene.id, null);
                        await spawnedToken.actor.rollInitiative();
                        groupInitiativeValue = spawnedToken.actor.initiative;
                    }
                } else if (game.settings.get('mba-premades', 'Tasha Initiative')) {
                    initiative = casterCombatant.initiative - 0.01;
                    await socket.executeAsGM('createCombatant', spawnedToken.id, spawnedToken.actor.id, canvas.scene.id, initiative)
                } else {
                    await socket.executeAsGM('createCombatant', spawnedToken.id, spawnedToken.actor.id, canvas.scene.id, null);
                    await spawnedToken.actor.rollInitiative();
                }
            }
        }
    }
    let effectUpdates = {
        'flags': {
            'mba-premades': {
                'summons': {
                    'ids': {
                        [originItem.name]: summonsIds
                    }
                }
            }
        }
    }
    await mba.updateEffect(effect, effectUpdates);
}
export let summons = {
    'spawn': spawn,
};