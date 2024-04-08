// does not account "no speed = lose dodge" case (overkill)
export async function dodge({ speaker, actor, token, character, item, args, scope, workflow }) {
    async function effectMacroEveryTurn() {
        let effect = await chrisPremades.helpers.findEffect(actor, "Dodge");
        let isIncapacitated = await chrisPremades.helpers.findEffect(actor, "Incapacitated");
        if (!isIncapacitated) return;
        await chrisPremades.helpers.removeEffect(effect);
    }
    async function effectMacroDel() {
        await Sequencer.EffectManager.endEffects({ name: `${token.document.name} Dodge` })
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Until the start of your next turn, any attack roll made against you has disadvantage if you can see the attacker, and you make Dexterity saving throws with advantage.</p>
            <p>You lose this benefit if you are incapacitated, or if your speed drops to 0.</p>
        `,
        'changes': [
            {
                'key': 'flags.midi-qol.grants.disadvantage.attack.all',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.advantage.ability.save.dex',
                'mode': 2,
                'value': 1,
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['turnStart']
            },
            'effectmacro': {
                'onEachTurn': {
                    'script': chrisPremades.helpers.functionToString(effectMacroEveryTurn)
                },
                'onDelete': {
                    'script': chrisPremades.helpers.functionToString(effectMacroDel)
                }
            }
        }
    };

    await new Sequence()

        .effect()
        .file("jb2a.cast_shape.circle.single01.blue")
        .atLocation(token)
        .scaleToObject(1.5 * token.document.texture.scaleX)
        .filter("ColorMatrix", { hue: 145 })

        .effect()
        .file("jb2a.markers.shield_rampart.complete.01.dark_red")
        .attachTo(token)
        .scaleToObject(1.5 * token.document.texture.scaleX)
        .playbackRate(0.8)
        .delay(500)
        .persist()
        .name(`${token.document.name} Dodge`)

        .thenDo(function () {
            chrisPremades.helpers.createEffect(workflow.actor, effectData);
        })

        .play();
}