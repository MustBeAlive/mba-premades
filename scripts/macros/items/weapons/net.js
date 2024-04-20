export async function net({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first()
    if (!workflow.hitTargets.size) return;
    if (chrisPremades.helpers.getSize(target.actor) > 3) {
        ui.notifications.warn("Target is to big to be caught in the Net!");
        return;
    }
    async function effectMacroDel() {
        await Sequencer.EffectManager.endEffects({ name: `${token.document.name} Net` });
    }
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
        <p>You are restrained by the Net.</p>
        <p>You can attempt to free yourself by making a Strength Ability Check (DC10).</p>
        <p>Another creature can make this check for you, or can deal at least 5 slashing damage to the net (AC10) to achieve same goal.</p>
    `,
        'changes': [
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `actionSave=true, rollType=check, saveAbility=str, saveDC=10, saveMagic=false, name=Net: Action Save, killAnim=true`,
                'priority': 20
            },
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': 'Restraineddw',
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true
            },
            'effectmacro': {
                'onDelete': {
                    'script': chrisPremades.helpers.functionToString(effectMacroDel)
                }
            }
        }
    };
    new Sequence()

        .effect()
        .file("jaamod.traps.trap_net")
        .attachTo(target)
        .scaleToObject(1.5 * target.document.texture.scaleX)
        .fadeOut(500)
        .persist()
        .noLoop()
        .name(`${target.document.name} Net`)

        .wait(1000)

        .thenDo(function () {
            chrisPremades.helpers.createEffect(target.actor, effectData)
        })

        .play()
}