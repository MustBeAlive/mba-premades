import {mba} from "../../helperFunctions.js";

export async function fadeAway({ speaker, actor, token, character, item, args, scope, workflow }) {
    async function effectMacroDel() {
        new Sequence()

            .effect()
            .file("jb2a.smoke.puff.centered.dark_black")
            .atLocation(token)
            .scaleToObject(2.5 * token.document.texture.scaleX)
            .belowTokens()
            .opacity(0.5)
            .scaleIn(0, 500, { ease: "easeOutCubic" })
            .randomRotation()

            .wait(500)

            .thenDo(async () => {
                Sequencer.EffectManager.endEffects({ name: `${token.document.name} Fade Away`, object: token })
            })

            .play();
    }
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are invisible until the end of your next turn or until you attack, deal damage or force someon to make a saving throw.</p>
        `,
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
                'showIcon': true,
                'specialDuration': ['1Attack', '1Spell', 'turnEnd']
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };

    new Sequence()

        .effect()
        .file("jb2a.smoke.puff.centered.dark_black")
        .atLocation(token)
        .scaleToObject(2.5 * token.document.texture.scaleX)
        .belowTokens()
        .opacity(0.5)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .randomRotation()

        .wait(500)

        .thenDo(async () => {
            await mba.createEffect(workflow.actor, effectData);
        })

        .play()
}