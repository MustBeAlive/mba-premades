// Original macro by MISC (Quinn Dexter)
async function trigger({speaker, actor, token, character, item, args, scope, workflow}) {
    //If the entering event has been triggered by a forced move, when walking through the template, do not execute this macro again
    if (template.getFlag("world", "snareTrapTriggered")) {
        return
    }

    const sourceActor = getSourceActor(template);
    const targetActor = token.actor;

    //Create a chat message for flair
    let cMessage = targetActor?.name + " stepped on the magical trap " + sourceActor?.name + "! Let's find out what happens.";
    ChatMessage.create({ content: cMessage });

    // Do the dexterity save check
    let saveRollResult = await targetActor.rollAbilitySave('dex');
    let spellDCCheckPassed = (saveRollResult.total >= getSpellDC(sourceActor));

    //If saved, nothing happens only a nice chate message. If not, target is set to prone and restrained,
    //moved 3 feetd higher and the trap is removed
    if (spellDCCheckPassed) {
        let cMessage = targetActor?.name + " saved and walks therefore elegantly over the trap."
        ChatMessage.create({ content: cMessage });
    } else {
        let cMessage = targetActor?.name + " did not achieve to pass the trap safely, falls prone and is pulled into the air."
        ChatMessage.create({ content: cMessage });
        //Uncomment this line for the "wentThrough" hook
        //await moveTokenToTemplate (token, template);
        await addCondition(targetActor, "Prone");
        await addCondition(targetActor, "Restrained");
        const newElevation = token.document.elevation + 3;
        await token.document.update({ elevation: newElevation });
    }

    // Adds a condition to an actor
    async function addCondition(actor, name, overlay, origin) {
        if (!(await game.dfreds.effectInterface.hasEffectApplied(name, actor.uuid))) {
            await game.dfreds.effectInterface.addEffect(
                {
                    'effectName': name,
                    'uuid': actor.uuid,
                    'origin': origin,
                    'overlay': overlay
                }
            )
        }
    }

    //ONly calles in the 
    async function moveTokenToTemplate(tokenToMove, targetTemplate) {
        await targetTemplate.setFlag('world', 'snareTrapTriggered', true);
        const newTokenPos = { x: targetTemplate.x - (canvas.grid.size * tokenToMove.document.width / 2), y: targetTemplate.y - (canvas.grid.size * tokenToMove.document.height / 2) };
        await token.document.update(newTokenPos);
    }

    //Get spell dc of the avtor
    function getSpellDC(sourceActor) {
        const spellDC = sourceActor?.system.attributes.spelldc;
        return spellDC;
    }

    //Get the actor responsible for the template
    function getSourceActor(sourceTemplate) {
        let sourceActor;
        let sourceUuid = sourceTemplate?.getFlag("midi-qol", "originUuid").split(".");
        //Just a fallback, if the midi-oql flag is not found
        if (!sourceUuid) {
            sourceUuid = sourceTemplate?.getFlag("dnd5e", "origin").split(".");
        }

        //hoping, that the actor id is on position 1 in the array
        if (sourceUuid[0] === "Actor") {

            sourceActor = game.actors.get(sourceUuid[1]);
        }
        return sourceActor;
    }

}

async function end({speaker, actor, token, character, item, args, scope, workflow}) {
    /*This Macro makes an automated dexterity saving throw at the end of the token effected. If the saving throw is successful, the
    condition restrained is removed and the template is removed**/

    //if game is not in comabt the dexterity roll needs to be done manually.
    if (!game.combat) {
        console.log("Game not in combat mode. Disabling Turn End Macro.");
        return;
    }

    const sourceActor = getSourceActor(template);
    const targetActor = token.actor;

    //Create a chat message for flair
    let cMessage = targetActor?.name + " tries to get out of the trap.";
    ChatMessage.create({ content: cMessage });

    // Do the dexterity save check
    let saveRollResult = await targetActor.rollAbilitySave('dex');
    let spellDCCheckPassed = (saveRollResult.total >= getSpellDC(sourceActor));

    //Checks whether the dexterity saving throw was successful
    if (spellDCCheckPassed) {
        //Only the condition "restrained" is removed, as the character is still prone when the trap has been disabled.
        await removeCondition(targetActor, "Restrained");
        await removeTrap(sourceActor, template);
        const newElevation = token.document.elevation - 3;
        await token.document.update({ elevation: newElevation });
        let cMessage = targetActor?.name + " achieved to get out of the magical trap of " + sourceActor.name + " and falls prone to the ground.";
        ChatMessage.create({ content: cMessage });
    } else {
        let cMessage = targetActor?.name + " did not acieve to get out of the magical trap of " + sourceActor.name + " and still hangs in the air.";
        ChatMessage.create({ content: cMessage });
    }

    // Removes a condition to an actor. Parameters overlay and orogin are not used, but keep them for further implementations
    async function removeCondition(actor, name, overlay, origin) {
        if (await game.dfreds.effectInterface.hasEffectApplied(name, actor.uuid)) {
            await game.dfreds.effectInterface.removeEffect(
                {
                    'effectName': name,
                    'uuid': actor.uuid,
                    'origin': origin,
                    'overlay': overlay
                }
            )
        }
    }

    //Get spell dc of the avtor
    function getSpellDC(sourceActor) {
        const spellDC = sourceActor?.system.attributes.spelldc;
        return spellDC;
    }

    //Get the actor responsible for the template
    function getSourceActor(sourceTemplate) {
        let sourceActor;
        let sourceUuid = sourceTemplate?.getFlag("midi-qol", "originUuid").split(".");
        //Just a fallback, if the midi-oql flag is not found
        if (!sourceUuid) {
            sourceUuid = sourceTemplate?.getFlag("dnd5e", "origin").split(".");
        }

        //hoping, that the actor id is on position 1 in the array
        if (sourceUuid[0] === "Actor") {

            sourceActor = game.actors.get(sourceUuid[1]);
        }
        return sourceActor;
    }

    //Removes the Snare active effect from the caster
    async function removeTrap(trapActor, trapTemplate) {
        const activeEffects = trapActor.effects;
        let activeEffectsToDelete = [];

        let sourceUuid = trapTemplate?.getFlag("midi-qol", "originUuid");
        //Just a fallback, if the midi-oql flag is not found
        if (!sourceUuid) {
            sourceUuid = trapTemplate?.getFlag("dnd5e", "origin");
        }

        const activeSnareEffects = activeEffects.filter(effectOrigin => effectOrigin.origin === sourceUuid);
        for (let i = 0; i < activeSnareEffects.length; i++) {
            activeEffectsToDelete.push(activeSnareEffects[i].id);
        }
        await trapActor.deleteEmbeddedDocuments("ActiveEffect", activeEffectsToDelete);
    }
}

export let snare = {
    'trigger': trigger,
    'end': end
}