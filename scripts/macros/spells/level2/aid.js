export async function aid({ speaker, actor, token, character, item, args, scope, workflow }) {
    let level = workflow.castData.castLevel;
    let healAmmount = (5 * (level - 1));
    let targets = Array.from(workflow.targets);
    async function effectMacroDel() {
        let maxHP = actor.system.attributes.hp.max;
        let currentHP = actor.system.attributes.hp.value;
        if (currentHP > maxHP) {
            await actor.update({ "system.attributes.hp.value": maxHP })
        }
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `Your hit point maximum and current hit points are increased by <b>${healAmmount}</b> for the duration.`,
        'duration': {
            'seconds': 28800
        },
        'changes': [
            {
                'key': 'system.attributes.hp.tempmax',
                'mode': 2,
                'value': healAmmount,
                'priority': 20
            },
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': chrisPremades.helpers.functionToString(effectMacroDel)
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 2,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    for (let target of targets) {
        let delay1 = 100 + Math.floor(Math.random() * (Math.floor(1000) - Math.ceil(100)) + Math.ceil(100));

        new Sequence()

            .effect()
            .file("animated-spell-effects-cartoon.magic.helix")
            .delay(delay1)
            .attachTo(token)
            .stretchTo(target)
            .filter("ColorMatrix", { hue: 140 })
            .waitUntilFinished(-800)

            .thenDo(function () {
                chrisPremades.helpers.createEffect(target.actor, effectData);
            })

            .effect()
            .file("animated-spell-effects-cartoon.level 01.cure wounds.blue")
            .attachTo(target)
            .scaleToObject(1.8 * target.document.texture.scaleX)

            .effect()
            .file("animated-spell-effects-cartoon.misc.symbol.05")
            .attachTo(target)
            .scaleToObject(2.5 * target.document.texture.scaleX)
            .playbackRate(0.8)

            .effect()
            .delay(700)
            .file("animated-spell-effects-cartoon.level 01.divine favour.blue")
            .attachTo(target)
            .scaleToObject(1.3 * target.document.texture.scaleX)
            .playbackRate(0.8)
            .repeats(3, 1200)

            .thenDo(function () {
                chrisPremades.helpers.applyDamage([target], healAmmount, 'healing');
            })

            .play()
    }
}