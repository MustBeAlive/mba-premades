export async function regenerate({speaker, actor, token, character, item, args, scope, workflow}) {
    let target = workflow.targets.first();
    async function effectMacro() {
        await game.Gametime.doEvery({seconds:6}, async () => {
            if (actor.system.attributes.hp.value < actor.system.attributes.hp.max) {
                await chrisPremades.helpers.applyDamage([token], 1, 'healing');
            }
        });
    }
    let effectData = {
        'name': "Regenerate",
        'icon': "assets/library/icons/sorted/spells/level7/regenerate.webp",
        'description': 'For the duration of the spell, you regain 1 hit point at the start of each of your turns (10 hit points each minute). Your severed body members (fingers, legs, tails, and so on), if any, are restored after 2 minutes. If you have the severed part and hold it to the stump, the spell instantaneously causes the limb to knit to the stump.',
        'duration': {
            'seconds': 3600
        },
        'flags': {
            'effectmacro': {
                'onCreate': {
                    'script': chrisPremades.helpers.functionToString(effectMacro)
                }
            }
        }
    };
    await chrisPremades.helpers.createEffect(target.actor, effectData);
}