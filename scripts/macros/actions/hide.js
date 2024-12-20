import {mba} from "../../helperFunctions.js";

export async function hide({ speaker, actor, token, character, item, args, scope, workflow }) {
    let hideRoll = await workflow.actor.rollSkill('ste');
    if (!hideRoll) {
        ui.notifications.info("Roll canceled, try again!");
        return;
    }
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
                Sequencer.EffectManager.endEffects({ name: `${token.document.name} Hide`})
            })

            .play();
    }
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `Stealth roll result: <b>${hideRoll.total}</b>`,
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
        .atLocation(workflow.token)
        .scaleToObject(2.5 * workflow.token.document.texture.scaleX)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .opacity(0.5)
        .randomRotation()
        .belowTokens()

        .effect()
        .from(workflow.token)
        .atLocation(workflow.token)
        .attachTo(workflow.token)
        .fadeIn(1000)
        .fadeOut(1000)
        .animateProperty("alphaFilter", "alpha", { from: 0, to: -0.2, duration: 2000, delay: 1000 })
        .tint("#6b6b6b")
        .persist()
        .name(`${workflow.token.document.name} Hide`)

        .thenDo(async () => {
            await mba.createEffect(workflow.actor, effectData);
        })

        .play();
}