import {mba} from "../../helperFunctions.js";

// does not account "no speed = lose dodge" case (overkill?)
export async function dodge({ speaker, actor, token, character, item, args, scope, workflow }) {
    async function effectMacroEveryTurn() {
        let effect = await mbaPremades.helpers.findEffect(actor, "Dodge");
        if (!mbaPremades.helpers.findEffect(actor, "Incapacitated")) return;
        await mbaPremades.helpers.removeEffect(effect);
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
                    'script': mba.functionToString(effectMacroEveryTurn)
                },
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };

    await new Sequence()

        .effect()
        .file("jb2a.cast_shape.circle.single01.blue")
        .atLocation(token)
        .scaleToObject(1.5 * token.document.texture.scaleX)
        .filter("ColorMatrix", { hue: 140 })

        .effect()
        .file("jb2a.template_circle.symbol.normal.shield.green")
        .attachTo(token)
        .scaleToObject(1.5 * token.document.texture.scaleX)
        .playbackRate(0.8)
        .delay(500)
        .filter("ColorMatrix", { hue: 260 })
        .mask()
        .persist()
        .name(`${token.document.name} Dodge`)

        .thenDo(function () {
            mba.createEffect(workflow.actor, effectData);
        })

        .play();
}