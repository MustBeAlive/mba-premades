export async function lesserRestoration({ speaker, actor, token, character, item, args, scope, workflow }) {
    const target = workflow.targets.first();
    let choices1 = [['Condition', 'condition'], ['Disease', 'disease']];
    let selection1 = await chrisPremades.helpers.dialog('Choose effect type:', choices1);
    if (!selection1) return;
    if (selection1 === 'condition') {
        let choices2 = [
            ['Blindned', 'Blind'],
            ['Deafened', 'Deaf'],
            ['Paralyzed', 'Paralyzed'],
            ['Poisoned', 'Poison'],
            ['Level of Exhaustion', 'Exhaust']
        ];
        let selection2 = await chrisPremades.helpers.dialog('Which condition do you wish to remove?', choices2);
        if (!selection2) {
            return;
        }
        switch (selection2) {
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
                if (matchingEffects.length) {
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
        return;
    }
    const effects = target.actor.effects.filter(e => e.flags['mba-premades']?.isDisease === true);
    if (!effects.length) {
        ui.notifications.info('Target is not affected by any disease!');
        return;
    }
    let selection = []
    for (let i = 0; i < effects.length; i++) {
        let effect = effects[i];
        let name = effect.flags['mba-premades']?.name;
        let description = effect.flags['mba-premades']?.description[0].toString();
        let icon = "assets/library/icons/sorted/conditions/nauseated.png";
        selection.push([name, description, icon]);
    }
    function generateEnergyBox(type) {
        return `
            <label class="radio-label">
            <input type="radio" name="type" value="${selection[type]}" />
            <img src="${selection[type].slice(2)}" style="border: 0px; width: 50px; height: 50px"/>
            ${selection[type].slice(0, -2)}
            </label>
        `;
    }
    const effectSelection = Object.keys(selection).map((type) => generateEnergyBox(type)).join("\n");
    const content = `
    <style>
        .lesserRestoration 
            .form-group {
                display: flex;
                flex-wrap: wrap;
                width: 100%;
                align-items: flex-start;
            }
        .lesserRestoration 
            .radio-label {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            justify-items: center;
            flex: 1 0 20%;
            line-height: normal;
            }
        .lesserRestoration 
            .radio-label input {
            display: none;
        }
        .lesserRestoration img {
            border: 0px;
            width: 50px;
            height: 50px;
            flex: 0 0 50px;
            cursor: pointer;
        }
        /* CHECKED STYLES */
        .lesserRestoration [type="radio"]:checked + img {
            outline: 2px solid #f00;
        }
    </style>
    <form class="lesserRestoration">
        <div class="form-group" id="types">
            ${effectSelection}
        </div>
    </form>
    `;
    const diseaseEffect = await new Promise((resolve) => {
        new Dialog({
            title: "Choose which disease to remove:",
            content,
            buttons: {
                ok: {
                    label: "Ok",
                    callback: async (html) => {
                        const element = html.find("input[type='radio'][name='type']:checked").val();
                        resolve(element);
                    },
                },
                cancel: {
                    label: "Stop ",
                    callback: async (html) => {
                        return;
                    }
                }
            }
        }).render(true);
    });
    let diseaseFlagName = diseaseEffect.split(",")[0];
    let diseaseToRemoveName;
    for (let i = 0; i < effects.length; i++) {
        let effect = effects[i];
        if (effect.flags['mba-premades']?.name === diseaseFlagName) diseaseToRemoveName = effect.name;;
    }
    let diseaseToRemove = await chrisPremades.helpers.findEffect(target.actor, diseaseToRemoveName);
    await chrisPremades.helpers.removeEffect(diseaseToRemove);
}