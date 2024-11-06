import {mba} from "../../../helperFunctions.js";
import {socket} from "../../../module.js";
import {summons} from "../../generic/summons.js";

async function disgorgeActive({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect1 = workflow.actor.effects.find(e => e.name.includes("Tyrannosaurus Zombie: Grapple") && e.name != "Grappled");
    if (effect1) {
        ui.notifications.warn("Tyrannosaurus Zombie is unable to disgorge Zombies while grappling someone!");
        await game.messages.get(workflow.itemCardId).delete();
        return;
    }
    let effect2 = await mba.findEffect(workflow.actor, "Disgorge: Out of Zombies");
    if (effect2) {
        ui.notifications.warn("Tyrannosaurus Zombie is out of Zombies!");
        await game.messages.get(workflow.itemCardId).delete();
        return;
    }
    let sourceActor = game.actors.getName("Zombie");
    if (!sourceActor) {
        ui.notifications.warn("Unable to find actor! (Zombie)");
        await game.messages.get(workflow.itemCardId).delete();
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
    let [spawnedTokenId] = await mba.spawn(sourceActor, updates, {}, workflow.token, 10, "undead");
    await mba.clearGMDialogMessage();
    if (mba.inCombat()) {
        let zombieDoc = canvas.scene.tokens.get(spawnedTokenId);
        let casterCombatant = game.combat.combatants.contents.find(combatant => combatant.actorId === workflow.actor.id);
        let initiative = casterCombatant.initiative - 0.01;
        await socket.executeAsGM('createCombatant', spawnedTokenId, zombieDoc.actor.id, canvas.scene.id, initiative);
    }
    let zombieRoll = await new Roll("1d6").roll({ 'async': true });
    await MidiQOL.displayDSNForRoll(zombieRoll);
    if (zombieRoll.total > 1) return;
    let effectData = {
        'name': "Disgorge: Out of Zombies",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Tyrranosaurus Rex Zombie is out of zombies to disgorge!</p>
        `,
        'flags': {
            'dae': {
                'showIcon': true
            }
        }
    };
    await mba.createEffect(workflow.actor, effectData);
}

async function disgorgeDeath(token, origin) {
    console.log(origin);
    let effect = await mba.findEffect(token.actor, "Disgorge: Out of Zombies");
    if (effect) return;
    let sourceActor = game.actors.getName("Zombie");
    if (!sourceActor) {
        ui.notifications.warn("Unable to find actor! (Zombie)");
        return;
    }
    let sourceActors = [];
    let zombieRoll = await new Roll("1d4").roll({ 'async': true });
    await MidiQOL.displayDSNForRoll(zombieRoll);
    zombieRoll.toMessage({
        'rollMode': 'roll',
        'speaker': { 'alias': name },
        'flavor': 'Disgorge Zombie'
    });
    for (let i = 0; i < zombieRoll.total; i++) sourceActors.push(sourceActor);
    let updates = {
        'actor': {
            'prototypeToken': {
                'disposition': token.document.disposition,
            }
        },
        'token': {
            'disposition': token.document.disposition,
        }
    };
    await mba.gmDialogMessage();
    await summons.spawn(sourceActors, updates, 864000, origin, undefined, undefined, 10, token, "undead");
    await mba.clearGMDialogMessage();
}

export let tyrannosaurusZombie = {
    'disgorgeActive': disgorgeActive,
    'disgorgeDeath': disgorgeDeath
}