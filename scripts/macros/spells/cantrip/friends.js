import {mba} from "../../../helperFunctions.js";

export async function friends({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    if (!target) return;
    const effectDataSource = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>For the duration, you have advantage on all Charisma checks directed at ${target.document.name}.</p>
            <p>When the spell ends, the creature realizes that you used magic to influence its mood and becomes hostile toward you.</p>
            <p>A creature prone to violence might attack you. Another creature might seek retribution in other ways (at the DM's discretion), depending on the nature of your interaction with it.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': "flags.midi-qol.advantage.ability.check.cha",
                'mode': 2,
                'value': 1,
                'priority': 20
            }
        ]
    };
    async function effectMacroDelTarget() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Friends` })
    };
    const effectDataTarget = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'duration': {
            'seconds': 60
        },
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDelTarget)
                }
            }
        }
    };

    new Sequence()

        .wait(500)

        .effect()
        .file("jb2a.icon.heart.pink")
        .attachTo(target)
        .scaleToObject(1)
        .fadeIn(1000)
        .fadeOut(1000)
        .waitUntilFinished(-1000)

        .effect()
        .file("jb2a.template_circle.symbol.normal.heart.pink")
        .attachTo(target)
        .fadeIn(500)
        .fadeOut(1000)
        .scaleToObject(1.3)
        .mask()
        .persist()
        .name(`${target.document.name} Friends`)

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectDataTarget);
            await mba.createEffect(workflow.actor, effectDataSource);
        })

        .play()
}