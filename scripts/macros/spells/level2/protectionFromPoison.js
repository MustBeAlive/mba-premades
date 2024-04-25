export async function protectionFromPoison({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let poisoned = chrisPremades.helpers.findEffect(target.actor, 'Poisoned');
    if (poisoned) {
        await chrisPremades.helpers.removeCondition(target.actor, 'Poisoned');
    }
    /*
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Protection from Poison` });
    };
    */
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': "You have advantage on saving throws against being poisoned and have resistance to poison damage.",
        'duration': {
            'seconds': 3600
        },
        'changes': [
            {
                'key': 'system.traits.dr.value',
                'mode': 0,
                'value': 'poison',
                'priority': 20
            },
            {
                'key': 'flags.adv-reminder.message.ability.save.con',
                'mode': 0,
                'value': 'You have advantage on saving throws against being poisoned.',
                'priority': 20
            },
            {
                'key': 'flags.chris-premades.CR.poisoned',
                'mode': 2,
                'value': 1,
                'priority': 20
            }
        ],
        'flags': {
            //'effectmacro': {
            //'onDelete': {
            //'script': chrisPremades.helpers.functionToString(effectMacroDel)
            //}
            //},
            'midi-qol': {
                'castData': {
                    baseLevel: 2,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };

    new Sequence()

        .wait(1000)

        .effect()
        .file("jb2a.energy_field.01.green")
        .attachTo(target)
        .scaleIn(0, 3500, { ease: "easeOutBack" })
        .scaleOut(0, 3500, { ease: "easeInSine" })
        .tint("#1fdaff")
        .scaleToObject(2 * target.document.texture.scaleX)
        .belowTokens()
        .playbackRate(0.9)
        .duration(10000)
        .name(`${target.document.name} Protection from Poison`)

        .effect()
        .file("jb2a.energy_field.02.below.green")
        .delay(3500)
        .attachTo(target)
        .fadeIn(1000)
        .fadeOut(1000)
        .scaleToObject(1.55 * target.document.texture.scaleX)
        .playbackRate(0.9)
        .name(`${target.document.name} Protection from Poison`)

        .thenDo(function () {
            chrisPremades.helpers.createEffect(target.actor, effectData);
        })

        .play()

    await chrisPremades.helpers.createEffect(target.actor, effectData);
}