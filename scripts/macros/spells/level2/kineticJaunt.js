import {mba} from "../../../helperFunctions.js";

export async function kineticJaunt({ speaker, actor, token, character, item, args, scope, workflow }) {
    async function effectMacroTurnEnd() {
        if (!mbaPremades.helpers.inCombat) return;
        let check = mbaPremades.helpers.findNearby(token.document, 2, undefined, false, false);
        if (!check.length) return;
        let damageRoll = await new Roll("1d8[force]").roll({ 'async': true });
        await MidiQOL.displayDSNForRoll(damageRoll);
        await mbaPremades.helpers.applyDamage([token], damageRoll.total, "force");
        ChatMessage.create({
            content: `<b>${token.document.name}</b> ends its turn in another creature's space, takes <b>${damageRoll.total}</b> force damage and is also <b>shunted to the last unoccupied space</b>.`,
            speaker: { actor: actor }
        });
    };
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You magically empowered your movement with dance-like steps, giving yourself the following benefits for the duration:</p>
            <p>Your walking speed increases by 10 feet.</p>
            <p>You don't provoke opportunity attacks.</p>
            <p>You can move through the space of another creature, and it doesn't count as difficult terrain.</p>
            <p>If you end your turn in another creature's space, you are shunted to the last unoccupied space you occupied, and you take 1d8 force damage.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'system.attributes.movement.walk',
                'mode': 2,
                'value': "+10",
                'priority': 20
            },
        ],
        'flags': {
            'effectmacro': {
                'onTurnEnd': {
                    'script': mba.functionToString(effectMacroTurnEnd)
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
    new Sequence()

        .effect()
        .file("jb2a.particles.inward.greenyellow.02.05")
        .attachTo(token)
        .scaleToObject(2 * token.document.texture.scaleX)
        .fadeIn(500)
        .fadeOut(1000)

        .effect()
        .file("jb2a.magic_signs.rune.transmutation.complete.green")
        .attachTo(token)
        .scaleToObject(1 * token.document.texture.scaleX)
        .delay(500)

        .wait(1500)

        .thenDo(async () => {
            await mba.createEffect(workflow.actor, effectData);
        })

        .play()
}