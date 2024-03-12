export async function lesserRestoration({speaker, actor, token, character, item, args, scope, workflow}) {
    const target = workflow.targets.first();
    let choices  = [
        ['Blindned', 'Blind'],
        ['Deafened', 'Deaf'],
        ['Paralyzed', 'Paralyzed'],
        ['Poisoned', 'Poison'],
        ['Level of Exhaustion', 'Exhaust']
    ];
    let selection = await chrisPremades.helpers.dialog('Which condition do you wish to remove?', choices);
    if (!selection) {
        return;
    }
    switch (selection) {
        case 'Blind': {
            await chrisPremades.helpers.removeCondition(target.actor, 'Blinded');
            break;
        }
        case 'Deaf': {
            await chrisPremades.helpers.removeCondition(target.actor, 'Deafened');
            break;
        }
        case 'Paralyzed': {
            await chrisPremades.helpers.removeCondition(target.actor, 'Paralyzed');
            break;
        }
        case 'Poison': {
            await chrisPremades.helpers.removeCondition(target.actor, 'Poisoned');
            break;
        }
        case 'Exhaust': {
            let effectNamePartial = "Exhaustion";
            let matchingEffects = target.actor.effects.filter(effect => effect.name.toLowerCase().includes(effectNamePartial.toLowerCase()));
            if (matchingEffects.length > 0) {
                let effect = matchingEffects[0];
                let exhaustLevel = effect.changes[0].value;
                switch (exhaustLevel) {
                    case '1': {
                        await chrisPremades.helpers.removeCondition(target.actor, 'Exhaustion 1');   
                        break;
                    }
                    case '2': {
                        await chrisPremades.helpers.removeCondition(target.actor, 'Exhaustion 2');
                        await chrisPremades.helpers.addCondition(target.actor, 'Exhaustion 1');
                        break;
                    }
                    case '3': {
                        await chrisPremades.helpers.removeCondition(target.actor, 'Exhaustion 3');
                        await chrisPremades.helpers.addCondition(target.actor, 'Exhaustion 2');
                        break;
                    }
                    case '4': {
                        await chrisPremades.helpers.removeCondition(target.actor, 'Exhaustion 4');
                        await chrisPremades.helpers.addCondition(target.actor, 'Exhaustion 3');
                        break;
                    }
                    case '5': {
                        await chrisPremades.helpers.removeCondition(target.actor, 'Exhaustion 5');
                        await chrisPremades.helpers.addCondition(target.actor, 'Exhaustion 4');

                    }
                }
            }
        }
    }
}