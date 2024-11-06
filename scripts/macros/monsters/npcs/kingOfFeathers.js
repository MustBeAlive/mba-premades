import {mba} from "../../../helperFunctions.js";
import {socket} from "../../../module.js";

async function summonSwarm({ speaker, actor, token, character, item, args, scope, workflow }) {
    let sourceActor = game.actors.getName("Swarm of Wasps");
    if (!sourceActor) {
        ui.notifications.warn("Unale to find actor! (Swarm of Wasps)");
        return;
    }
    let updates = {
        'actor': {
            'prototypeToken': {
                'disposition': workflow.token.document.disposition,
            }
        },
        'token': {
            'disposition': workflow.token.document.disposition,
        }
    };
    await mba.gmDialogMessage();
    let [spawnedTokenId] = await mba.spawn(sourceActor, updates, {}, workflow.token, 20, "nature");
    await mba.clearGMDialogMessage();
    if (mba.inCombat()) {
        let specterDoc = canvas.scene.tokens.get(spawnedTokenId);
        let casterCombatant = game.combat.combatants.contents.find(combatant => combatant.actorId === workflow.actor.id);
        let initiative = casterCombatant.initiative - 0.01;
        await socket.executeAsGM('createCombatant', spawnedTokenId, specterDoc.actor.id, canvas.scene.id, initiative);
    }
}

export let kingOfFeathers = {
    'summonSwarm': summonSwarm
}