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
                Sequencer.EffectManager.endEffects({ name: `${token.document.name} FadAwa` })
            })

            .play();
    };
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.2dEv6KlLgFA4wOni]{Invisible} until the end of your next turn or until you attack, deal damage or force someone to make a saving throw.</p>
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
        .name(`${workflow.token.document.name} FadAwa`)

        .wait(500)

        .thenDo(async () => {
            await mba.createEffect(workflow.actor, effectData);
        })

        .play()
}