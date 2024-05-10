import {mba} from "../../helperFunctions.js";

export async function hide({ speaker, actor, token, character, item, args, scope, workflow }) {
    let rollResult = await workflow.actor.rollSkill('ste');
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

            .thenDo(function () {
                Sequencer.EffectManager.endEffects({ name: `${token.document.name} Hide`, object: token })
            })

            .play();
    }
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `Stealth roll result: <b>${rollResult.total}</b>`,
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['1Attack', 'turnStart']
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };

    await new Sequence()

        .effect()
        .file("jb2a.smoke.puff.centered.dark_black")
        .atLocation(token)
        .scaleToObject(2.5 * token.document.texture.scaleX)
        .belowTokens()
        .opacity(0.5)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .randomRotation()

        .effect()
        .from(token)
        .atLocation(token)
        .attachTo(token)
        .tint("#6b6b6b")
        .fadeIn(1000)
        .fadeOut(1000)
        .animateProperty("alphaFilter", "alpha", { from: 0, to: -0.2, duration: 2000, delay: 1000 })
        .persist()
        .name(`${token.document.name} Hide`)

        .thenDo(function () {
            mba.createEffect(workflow.actor, effectData);
        })

        .play();
}