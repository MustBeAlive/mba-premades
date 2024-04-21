export async function invisibility({ speaker, actor, token, character, item, args, scope, workflow }) {
    let ammount = workflow.castData.castLevel - 1;
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
            <p>You are invisible until the spell ends.</p>
            <p>This effect ends early if you make an attack or cast a spell.</p>
        `,
        'duration': {
            'seconds': 3600
        },
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Invisible",
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'specialDuration': ['1Attack', '1Spell']
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
        new Sequence()

            .wait(500)

            .effect()
            .file("jb2a.particle_burst.01.circle.orangepink")
            .attachTo(target)
            .scaleToObject(2.3 * target.document.texture.scaleX)
            .duration(1300)
            .fadeOut(300)

            .effect()
            .delay(1000)
            .file("animated-spell-effects-cartoon.misc.weird.01")
            .attachTo(target)
            .scaleToObject(2 * target.document.texture.scaleX)
            .opacity(0.8)
            .filter("ColorMatrix", { hue: 100 })

            .wait(1500)

            .thenDo(function () {
                chrisPremades.helpers.createEffect(target.actor, effectData)
            })

            .play()
    }
}