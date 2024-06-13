import {mba} from "../../helperFunctions.js";

async function createActor(actorData) {
    return await Actor.create(actorData);
}

async function createEffect(actorUuid, effectData) {
    let actor = await fromUuid(actorUuid);
    if (!actor) return;
    if (actor instanceof TokenDocument) actor = actor.actor;
    if (!actor) return;
    let effects = await actor.createEmbeddedDocuments('ActiveEffect', [effectData]);
    return effects[0].uuid;
}

async function createFolder(folderData) {
    return await Folder.create(folderData);
}

async function createScene(sceneData) {
    return await Scene.create(sceneData);
}

async function createTile(tileData) {
    return canvas.scene.createEmbeddedDocuments("Tile", tileData);
}

async function deleteScene(sceneIds) {
    return await Scene.deleteDocuments(sceneIds);
}

async function deleteTile(tileUuid) {
    let tile = await fromUuid(tileUuid);
    if (!tile) return;
    await tile.delete();
}

async function removeEffect(effectUuid) {
    let effect = await fromUuid(effectUuid);
    if (!effect) return;
    await effect.delete();
}

async function updateCombatant(uuid, updates) {
    let combatant = await fromUuid(uuid);
    if (!combatant) return;
    await combatant.update(updates);
}

async function updateDoc(docUuid, updates) {
    let doc = await fromUuid(docUuid);
    if (!doc) return;
    await doc.update(updates);
}

async function updateEffect(effectUuid, updates) {
    let effect = await fromUuid(effectUuid);
    if (!effect) return;
    await effect.update(updates);
}

function updateInitiative(combatantUuid, initiative) {
    let combatant = fromUuidSync(combatantUuid);
    if (!combatant) return;
    combatant.update({ 'initiative': initiative });
}

export let runAsGM = {
    'createActor': createActor,
    'createEffect': createEffect,
    'createFolder': createFolder,
    'createScene': createScene,
    'createTile': createTile,
    'deleteScene': deleteScene,
    'deleteTile': deleteTile,
    'removeEffect': removeEffect,
    'updateCombatant': updateCombatant,
    'updateEffect': updateEffect,
    'updateInitiative': updateInitiative,
    'updateDoc': updateDoc
}

async function rollItem(itemUuid, config, options) {
    let item = await fromUuid(itemUuid);
    if (!item) return;
    return await mba.rollItem(item, config, options);
}

export let runAsUser = {
    'rollItem': rollItem
};