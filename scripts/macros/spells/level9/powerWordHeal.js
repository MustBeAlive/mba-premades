export async function powerWordHeal({speaker, actor, token, character, item, args, scope, workflow}) {
    let target = workflow.targets.first();
    let type = chrisPremades.helpers.raceOrType(target.actor);
    if (type === 'undead' || type === 'construct') {
        ui.notifications.warn('Power Word: Heal has no effect on undead and construct creatures!');
        return false;
    }
    new Sequence()
        .effect()
        .file("jb2a.sacred_flame.source.green")
        .atLocation(target)
        .anchor(0.5)
        .scaleToObject(1.5)
        .fadeIn(250)
        .fadeOut(500)

        .effect()
        .file("jb2a.sacred_flame.target.green")
        .atLocation(target)
        .scaleToObject(2.5)
        .anchor(0.5)
        .fadeIn(250)
        .fadeOut(500)
        .delay(1500)

        .play();
    let diff = target.actor.system.attributes.hp.max - target.actor.system.attributes.hp.value;
    await chrisPremades.helpers.applyDamage([target], diff, 'healing');

    let isCharmed = await chrisPremades.helpers.findEffect(target.actor, 'Charmed');
    if (isCharmed) await chrisPremades.helpers.removeCondition(target.actor, 'Charmed');
    let isFrightened = await chrisPremades.helpers.findEffect(target.actor, 'Frightened');
    if (isFrightened) await chrisPremades.helpers.removeCondition(target.actor, 'Frightened');
    let isParalyzed = await chrisPremades.helpers.findEffect(target.actor, 'Paralyzed');
    if (isParalyzed) await chrisPremades.helpers.removeCondition(target.actor, 'Paralyzed');
    let isStunned = await chrisPremades.helpers.findEffect(target.actor, 'Stunned');
    if (isStunned) await chrisPremades.helpers.removeCondition(target.actor, 'Stunned');
    let reaction = chrisPremades.helpers.findEffect(target.actor, 'Reaction');
    if (!reaction) {
        let isProne = await chrisPremades.helpers.findEffect(target.actor, 'Prone');
        if (isProne){
            async function effectMacro() {
                let effect = chrisPremades.helpers.findEffect(actor, 'Power Word: Heal');
                await new Dialog({
                    title: "Power Word: Heal",
                    content: "<p>Do you wish to spend your reaction to stand up?</p>",
                    buttons: {
                        yes: {
                            label: "Yes",
                            callback: async (html) => {
                                await chrisPremades.helpers.removeCondition(actor, 'Prone');
                                await chrisPremades.helpers.addCondition(actor, 'Reaction');
                                await chrisPremades.helpers.removeEffect(effect);
                                return;                            
                            },
                        },
                        no: {
                            label: "No",
                            callback: async (html) => {
                                await chrisPremades.helpers.removeEffect(effect);
                                return;
                            }
                        }
                    },
                    default: "Yes"
                }).render(true);
            }
            let effectData = {
                'name': 'Power Word: Heal',
                'flags': {
                    'effectmacro': {
                        'onCreate': {
                            'script': chrisPremades.helpers.functionToString(effectMacro)
                        }
                    }
                }

            }
            await chrisPremades.helpers.createEffect(target.actor, effectData);
        }
    }
}