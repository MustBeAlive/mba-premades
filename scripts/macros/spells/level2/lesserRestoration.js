export async function lesserRestoration({ speaker, actor, token, character, item, args, scope, workflow }) {
    const target = workflow.targets.first();
    let choices1 = [['Condition', 'condition'], ['Disease', 'disease']];
    let selection1 = await chrisPremades.helpers.dialog('Choose effect type:', choices1);
    if (!selection1) return;
    if (selection1 === 'condition') {
        let choices2 = [
            ['Blindned', 'blindness'],
            ['Deafened', 'deafness'],
            ['Paralyzed', 'paralyzed'],
            ['Poisoned', 'poisoned'],
            ['Level of Exhaustion', 'exhaustion']
        ];
        let selection2 = await chrisPremades.helpers.dialog('Which condition do you wish to remove?', choices2);
        if (!selection2) {
            return;
        }
        switch (selection2) {
            case 'blindness': {
                await chrisPremades.helpers.removeCondition(target.actor, 'Blinded');
                break;
            }
            case 'deafness': {
                await chrisPremades.helpers.removeCondition(target.actor, 'Deafened');
                break;
            }
            case 'paralyzed': {
                await chrisPremades.helpers.removeCondition(target.actor, 'Paralyzed');
                break;
            }
            case 'poisoned': {
                await chrisPremades.helpers.removeCondition(target.actor, 'Poisoned');
                break;
            }
            case 'exhaustion': {
                let exhaustion = target.actor.effects.filter(e => e.name.toLowerCase().includes("Exhaustion".toLowerCase()));
                if (!exhaustion.length) {
                    ui.notifications.warn("Target has no levels of Exhaustion!");
                    return;
                }
                let level = +exhaustion[0].name.slice(-1);
                if (level === 1) {
                    await chrisPremades.helpers.removeCondition(target.actor, "Exhaustion 1");
                    return;
                }
                level -= 1;
                await chrisPremades.helpers.addCondition(target.actor, "Exhaustion " + level);
            }
        }
        return;
    }
    let curable = target.actor.effects.filter(e => e.flags['mba-premades']?.isDisease === true).filter(e => e.flags['mba-premades']?.lesserRestoration === true);
    if (!curable.length) {
        let uncurable = target.actor.effects.filter(e => e.flags['mba-premades']?.isDisease === true).filter(e => !e.flags['mba-premades']?.lesserRestoration === true);
        if (!uncurable.length) {
            ui.notifications.info('Target is not affected by any disease!');
            return;
        }
        ui.notifications.info('Targeted creature is affected by a disease which can not be cured with Lesser Restoration!');
        return;
    }
    let selection = []
    for (let i = 0; i < curable.length; i++) {
        let effect = curable[i];
        let name = effect.flags['mba-premades']?.name;
        let description = effect.flags['mba-premades']?.description[0].toString();
        let icon = "modules/mba-premades/icons/conditions/nauseated.webp";
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
                    label: "Cancel",
                    callback: async (html) => {
                        return;
                    }
                }
            }
        }).render(true);
    });
    let diseaseFlagName = diseaseEffect.split(",")[0];
    let diseaseToRemoveName;
    for (let i = 0; i < curable.length; i++) {
        let effect = curable[i];
        if (effect.flags['mba-premades']?.name === diseaseFlagName) diseaseToRemoveName = effect.name;
    }
    let diseaseToRemove = await chrisPremades.helpers.findEffect(target.actor, diseaseToRemoveName);
    await chrisPremades.helpers.removeEffect(diseaseToRemove);
}