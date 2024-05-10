import {mba} from "../../../helperFunctions.js";

export async function regenerate({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    async function effectMacro() {
        await game.Gametime.doEvery({ second: 6 }, async () => {
            if (actor.system.attributes.hp.value < actor.system.attributes.hp.max) {
                await mbaPremades.helpers.applyDamage([token], 1, 'healing');
            }
        });
    }
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>For the duration of the spell, you regain 1 hit point at the start of each of your turns (10 hit points each minute).</p>
            <p>Your severed body members (fingers, legs, tails, and so on), if any, are restored after 2 minutes.</p>
            <p>If you have the severed part and hold it to the stump, the spell instantaneously causes the limb to knit to the stump.</p>
        `,
        'duration': {
            'seconds': 3600
        },
        'flags': {
            'effectmacro': {
                'onCreate': {
                    'script': mba.functionToString(effectMacro)
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 7,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    await mba.createEffect(target.actor, effectData);
}