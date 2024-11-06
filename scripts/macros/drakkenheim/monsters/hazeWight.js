import {contamination} from "../contamination.js";
import {mba} from "../../../helperFunctions.js";
import {socket} from "../../../module.js";

async function contaminatedTouch({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    new Sequence()

        .effect()
        .file("jb2a.energy_strands.range.multiple.dark_purple02.01")
        .attachTo(target)
        .stretchTo(workflow.token)
        .repeats(2, 1500)

        .effect()
        .file("jb2a.divine_smite.caster.dark_purple")
        .attachTo(workflow.token)
        .fadeIn(500)
        .scaleToObject(1.5)
        .belowTokens()

        .play()
    if (!workflow.failedSaves.size) return;
    await contamination.addContamination(target);
}

async function createHusk({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    if (!mba.findEffect(target.actor, "Dead")) {
        ui.notifications.warn("Target is not dead!");
        return;
    }
    if (mba.raceOrType(target.actor) != "humanoid") {
        ui.notifications.warn("Target is not humanoid!");
        return;
    }
    let sourceActor = game.actors.getName("Haze Husk");
    if (!sourceActor) {
        ui.notifications.warn("Unable to find actor! (Haze Husk)");
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
    let [spawnedTokenId] = await mba.spawn(sourceActor, updates, {}, target, 10, "shadow");
    await mba.clearGMDialogMessage();
    if (mba.inCombat()) {
        let specterDoc = canvas.scene.tokens.get(spawnedTokenId);
        let casterCombatant = game.combat.combatants.contents.find(combatant => combatant.actorId === workflow.actor.id);
        let initiative = casterCombatant.initiative - 0.01;
        await socket.executeAsGM('createCombatant', spawnedTokenId, specterDoc.actor.id, canvas.scene.id, initiative);
    }
}

export let hazeWight = {
    'contaminatedTouch': contaminatedTouch,
    'createHusk': createHusk
}