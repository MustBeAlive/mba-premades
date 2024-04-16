async function sleepBreath({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let targets = Array.from(workflow.failedSaves);
    for (let target of targets) {
        async function effectMacroDel() {
            await Sequencer.EffectManager.endEffects({ name: `${token.document.name} Sleep Breath` })
        }
        const effectData = {
            'name': workflow.item.name,
            'icon': workflow.item.img,
            'origin': workflow.item.uuid,
            'description': `
                <p>You succumbed to Kamadan's sleep breath and fell asleep.</p>
                <p>You are unconscious until you take damage, or someone uses it's action to shake you awake.</p>
            `,
            'duration': {
                'seconds': 600
            },
            'changes': [
                {
                    'key': "macro.CE",
                    'mode': 0,
                    'value': "Unconscious",
                    'priority': 20
                },
            ],
            'flags': {
                'dae': {
                    'specialDuration': ["isDamaged"]
                },
                'effectmacro': {
                    'onDelete': {
                        'script': chrisPremades.helpers.functionToString(effectMacroDel)
                    }
                }
            }
        };

        await new Sequence()

            .effect()
            .file("jb2a.sleep.symbol.dark_orangepurple")
            .scaleIn(0, 500, { ease: "easeOutQuint" })
            .fadeOut(1000)
            .atLocation(target)
            .attachTo(target, { followRotation: false, bindAlpha: false })
            .scaleToObject(1.5 * target.document.texture.scaleX)
            .persist()
            .name(`${target.document.name} Sleep Breath`)

            .thenDo(function () {
                chrisPremades.helpers.createEffect(target.actor, effectData);
            })

            .play();
    }
}

export let kamadan = {
    'sleepBreath': sleepBreath
}