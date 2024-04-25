export async function longstrider({ speaker, actor, token, character, item, args, scope, workflow }) {
    let ammount = workflow.castData.castLevel;
    if (workflow.targets.size > ammount) {
        let selection = await chrisPremades.helpers.selectTarget(workflow.item.name, chrisPremades.constants.okCancel, Array.from(workflow.targets), false, 'multiple', undefined, false, 'Too many targets selected. Choose which targets to keep (Max: ' + ammount + ')');
        if (!selection.buttons) return;
        let newTargets = selection.inputs.filter(i => i).slice(0, ammount);
        chrisPremades.helpers.updateTargets(newTargets);
    }
    await warpgate.wait(100);
    let targets = Array.from(game.user.targets);
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>For the duration, your movement speed is increased by 10 feet.</p>
        `,
        'duration': {
            'seconds': 3600
        },
        'changes': [
            {
                'key': 'system.attributes.movement.walk',
                'mode': 2,
                'value': '+10',
                'priority': 50
            }
        ],
        'flags': {
            'midi-qol': {
                'castData': {
                    baseLevel: 1,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    for (let target of targets) {
        new Sequence()

            .wait(500)

            .effect()
            .file("jb2a.energy_beam.normal.yellow.03")
            .attachTo(token)
            .stretchTo(target)
            .scaleIn(0, 2000, { ease: "easeOutExpo" })
            .opacity(0.7)
            .fadeIn(1000)
            .fadeOut(2000)
            .duration(10500)

            .effect()
            .file("jb2a.energy_field.01.yellow")
            .delay(500)
            .attachTo(target)
            .scaleIn(0, 3500, { ease: "easeOutBack" })
            .scaleOut(0, 3500, { ease: "easeInSine" })
            .scaleToObject(2 * target.document.texture.scaleX)
            .belowTokens()
            .playbackRate(0.9)
            .duration(10000)
            .name(`${target.document.name} Longstrider`)

            .effect()
            .file("jb2a.energy_field.02.below.yellow")
            .delay(4000)
            .attachTo(target)
            .fadeIn(1000)
            .fadeOut(1000)
            .scaleToObject(1.55 * target.document.texture.scaleX)
            .playbackRate(0.9)
            .name(`${target.document.name} Longstrider`)

            .wait(2000)

            .thenDo(function () {
                chrisPremades.helpers.createEffect(target.actor, effectData);
            })

            .play()
    }
}