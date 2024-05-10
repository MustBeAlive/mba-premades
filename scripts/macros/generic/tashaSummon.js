import {mba} from "../../helperFunctions.js";
import {socket} from "../../module.js";
import {queue} from "../mechanics/queue.js";

async function setupFolder() {
    let folder = game.folders.find(i => i.name === 'MBA Summons' && i.type === 'Actor');
    if (!folder) {
        folder = await Folder.create({
            'name': 'MBA Summons',
            'type': 'Actor',
            'color': '#005c8a'
        });
    }
    let summonsCompendium = game.packs.get('mba-premades.MBA Summons');
    if (!summonsCompendium) return;
    let documents = await summonsCompendium.getDocuments();
    if (documents.length === 0) return;
    for (let actor of documents) {
        let folderActor = folder.contents.find(act => act.name === actor.name);
        let avatarImg;
        let tokenImg;
        let imageFlags;
        if (folderActor) {
            let folderVersion = folderActor.flags['mba-premades']?.version;
            let documentVersion = actor.flags['mba-premades']?.version;
            if (folderVersion && folderVersion === documentVersion) continue;
            avatarImg = folderActor.img;
            tokenImg = folderActor.prototypeToken.texture.src;
            imageFlags = folderActor.flags['mba-premades']?.summon;
            await folderActor.delete();
        }
        let actorData = actor.toObject();
        actorData.folder = folder.id;
        if (avatarImg) actorData.img = avatarImg;
        if (tokenImg) actorData.prototypeToken.texture.src = tokenImg;
        if (imageFlags) actorData.flags['mba-premades'].summon = imageFlags;
        await Actor.create(actorData);
    }
}

function getCR(prof) {
    switch (prof) {
        case 2:
            return 0;
        case 3:
            return 5;
        case 4:
            return 9;
        case 5:
            return 13;
        case 6:
            return 17;
        case 7:
            return 21;
        case 8:
            return 25;
        case 9:
            return 29;
    }
}

async function spawn(sourceActor, updates = {}, duration, originItem, maxRange, casterToken, spawnAnimation, callbacks, castLevel) {
    async function effectMacroDel() {
        let originActor = origin.actor;
        await warpgate.dismiss(token.id);
        let castEffect = mbaPremades.helpers.findEffect(originActor, origin.name);
        if (castEffect) await mbaPremades.helpers.removeEffect(castEffect);
    }
    let effectData = {
        'name': `${casterToken.document.name} ${originItem.name}`,
        'icon': originItem.img,
        'duration': {
            'seconds': duration
        },
        'origin': originItem.uuid,
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
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
    let spawnedTokens = await mba.spawn(sourceActor, updates, callbacks, casterToken, maxRange, spawnAnimation);
    if (!spawnedTokens) return;
    let spawnedToken = game.canvas.scene.tokens.get(spawnedTokens[0]);
    if (!spawnedToken) return;
    let targetEffect = mba.findEffect(spawnedToken.actor, `${casterToken.document.name} ${originItem.name}`);
    if (!targetEffect) return;
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
                    'script': 'let effect = await fromUuid("' + targetEffect.uuid + '"); if (effect) await mbaPremades.helpers.removeEffect(effect);'
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
    await mba.createEffect(originItem.actor, casterEffectData);
    if (mba.inCombat()) {
        let casterCombatant = game.combat.combatants.contents.find(combatant => combatant.actorId === originItem.actor.id);
        if (casterCombatant) {
            let initiative = casterCombatant.initiative - 0.01;
            await socket.executeAsGM('createCombatant', spawnedToken.id, spawnedToken.actor.id, canvas.scene.id, initiative);
        }
    }
    return spawnedToken;
}

async function createCombatant(tokenId, actorId, sceneId, initiative) {
    await game.combat.createEmbeddedDocuments('Combatant', [{
        'tokenId': tokenId,
        'sceneId': sceneId,
        'actorId': actorId,
        'hidden': false,
        'initiative': initiative
    }]);
}

async function meleeAttack({ speaker, actor, token, character, item, args, scope, workflow }) {
    let attackBonus = workflow.actor.flags['mba-premades']?.summon?.attackBonus?.melee;
    if (!attackBonus) return;
    if (workflow.item.flags['mba-premades']?.attackRoll?.enabled) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'tashaMeleeAttack', 50);
    if (!queueSetup) return;
    let attackRoll = await mba.addToRoll(workflow.attackRoll, attackBonus);
    await workflow.setAttackRoll(attackRoll);
    queue.remove(workflow.item.uuid);
}

async function rangedAttack({ speaker, actor, token, character, item, args, scope, workflow }) {
    let attackBonus = workflow.actor.flags['mba-premades']?.summon?.attackBonus?.ranged;
    if (!attackBonus) return;
    if (workflow.item.flags['mba-premades']?.attackRoll?.enabled) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'tashaRangedAttack', 50);
    if (!queueSetup) return;
    let attackRoll = await mba.addToRoll(workflow.attackRoll, attackBonus);
    await workflow.setAttackRoll(attackRoll);
    queue.remove(workflow.item.uuid);
}

function updateSummonInitiative(actor, [combatant]) {
    for (let c of combatant?.parent?.combatants?.contents.filter(i => i.actorId != actor.id).filter(i => i.actor.flags?.warpgate?.control?.actor === actor?.uuid) ?? []) {
        if (c.initiative === null) {
            if (game.user.isGM) c.update({ 'initiative': combatant.initiative - 0.01 });
            else socket.executeAsGM('updateInitiative', c.uuid, combatant.initiative - 0.01);
        }
    }
}

function updateCompanionInitiative(actor, [combatant]) {
    let validIds = [];
    for (let [key, value] of Object.entries(actor.ownership)) {
        if (key === 'default' && value === 3) return;
        if (key === 'default') continue;
        if (value === 3 && game.users.get(key).isGM === false) validIds.push(key);
    }
    if (!validIds) return;
    for (let i of validIds) {
        for (let c of combatant.parent.combatants.contents.filter(c => c.actorId != actor.id).filter(c => c.actor.ownership[i] === 3)) {
            if (c.initiative === null) {
                if (game.user.isGM) c.update({ 'initiative': combatant.initiative - 0.01 });
                else socket.executeAsGM('updateInitiative', c.uuid, combatant.initiative - 0.01);
            }
        }
    }
}

export let tashaSummon = {
    'setupFolder': setupFolder,
    'getCR': getCR,
    'spawn': spawn,
    'createCombatant': createCombatant,
    'meleeAttack': meleeAttack,
    'rangedAttack': rangedAttack,
    'updateSummonInitiative': updateSummonInitiative,
    'updateCompanionInitiative': updateCompanionInitiative
};