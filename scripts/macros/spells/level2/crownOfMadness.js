export async function crownOfMadness({speaker, actor, token, character, item, args, scope, workflow}) {
    if (workflow.failedSaves.size != 1) return;
    let concEffect = await chrisPremades.helpers.findEffect(workflow.actor, 'Concentrating');
    let target = workflow.targets.first();
    let type = chrisPremades.helpers.raceOrType(target.actor);
    if (type != 'humanoid') {
        ChatMessage.create({ flavor: target.name + ' is unaffected by Crown of Madness! (Target is not humanoid)', speaker: ChatMessage.getSpeaker({ actor: workflow.actor}) });
        await chrisPremades.helpers.removeCondition(workflow.actor, 'Concentrating');
        return;
    }
    let hasCharmImmunity = chrisPremades.helpers.checkTrait(target.actor, 'ci', 'charmed');
    if (hasCharmImmunity) {
        ChatMessage.create({ flavor: target.name + ' is unaffected by Crown of Madness! (Target is immune to condition: Charmed)', speaker: ChatMessage.getSpeaker({ actor: workflow.actor}) });
        await chrisPremades.helpers.removeCondition(workflow.actor, 'Concentrating');
        return;
    }
    async function effectMacro() {
        await warpgate.wait(200);
        let concEffect = await chrisPremades.helpers.findEffect(actor, 'Concentrating');
        if (!concEffect) return;
        let choices  = [
            ['Yes!', 'yes'],
            ['No, stop concentrating!', 'no']
        ];
        let selection = await chrisPremades.helpers.dialog('Use action to sustain Crown of Madness?', choices);
        if (!selection) {
            return;
        }
        switch (selection) {
            case 'yes': {
                break;
            }
            case 'no': {
                await chrisPremades.helpers.removeCondition(actor, 'Concentrating');
            }
        }
    }
    let updates = {
        'flags': {
            'effectmacro': {
                'onTurnStart': {
                    'script': chrisPremades.helpers.functionToString(effectMacro)
                }
            }
        }
    }
    await chrisPremades.helpers.updateEffect(concEffect, updates)
}