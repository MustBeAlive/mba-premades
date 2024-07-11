import {mba} from "../../../helperFunctions.js";

export async function blessingOfTheRavenQueen({ speaker, actor, token, character, item, args, scope, workflow }) {
    let icon = workflow.token.document.texture.src;
    let interval = workflow.token.document.width % 2 === 0 ? 1 : -1;
    await mba.playerDialogMessage();
    let position = await mba.aimCrosshair(workflow.token, 30, icon, interval, workflow.token.document.width);
    await mba.clearPlayerDialogMessage();
    if (position.cancelled) return;
    let level = workflow.actor.system.details.level;
    async function effectMacroDel() {
        new Sequence()

            .animation()
            .on(token)
            .opacity(1)

            .thenDo(async () => {
                Sequencer.EffectManager.endEffects({ name: `${token.document.name} BotRQ`, object: token });
            })

            .play();
    };
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You have resistance to all damage until the start of your next turn.</p>
        `,
        'changes': [
            {
                'key': `system.traits.dr.all`,
                'mode': 0,
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
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };

    new Sequence()

        .animation()
        .on(workflow.token)
        .delay(800)
        .fadeOut(200)

        .effect()
        .file("jb2a.misty_step.01.dark_black")
        .atLocation(workflow.token)
        .scaleToObject(2)
        .waitUntilFinished(-2000)

        .animation()
        .on(workflow.token)
        .teleportTo(position)
        .snapToGrid()
        .offset({ x: -1, y: -1 })
        .waitUntilFinished(200)

        .effect()
        .file("jb2a.misty_step.02.dark_black")
        .atLocation(workflow.token)
        .scaleToObject(2)

        .animation()
        .on(workflow.token)
        .delay(1400)
        .fadeIn(200)

        .wait(1300)

        .effect()
        .file("jb2a.smoke.puff.centered.grey")
        .atLocation(workflow.token)
        .scaleToObject(2, { considerTokenScale: true })
        .opacity(0.5)
        .filter("ColorMatrix", { saturate: 0, brightness: 1.5 })
        .tint("#6ff087")

        .effect()
        .file("jb2a.extras.tmfx.outflow.circle.01")
        .attachTo(workflow.token, { cacheLocation: true, offset: { y: 0 }, gridUnits: true, bindAlpha: false })
        .scaleToObject(1.45, { considerTokenScale: true })
        .fadeOut(1000)
        .loopProperty("alphaFilter", "alpha", { from: 0.75, to: 1, duration: 1500, pingPong: true, ease: "easeOutSine" })
        .randomRotation()
        .belowTokens()
        .opacity(0.45)
        .tint("#6ff087")
        .filter("ColorMatrix", { saturate: -0.2, brightness: 1.2 })
        .persist()
        .name(`${workflow.token.document.name} BotRQ`)

        .effect()
        .from(workflow.token)
        .attachTo(workflow.token, { bindAlpha: false })
        .scaleToObject(1, { considerTokenScale: true })
        .fadeOut(1000)
        .loopProperty("alphaFilter", "alpha", { from: 0.75, to: 1, duration: 1500, pingPong: true, ease: "easeOutSine" })
        .loopProperty("sprite", "position.x", { from: 0.025, to: -0.025, duration: 5000, gridUnits: true, pingPong: true, ease: "easeOutSine" })
        .loopProperty("sprite", "position.y", { from: 0, to: -0.03, duration: 2500, gridUnits: true, pingPong: true })
        .opacity(0.65)
        .tint("#6ff087")
        .filter("Glow", { color: "#6ff087", distance: 5, outerStrength: 4, innerStrength: 0 })
        .filter("ColorMatrix", { saturate: -0.2, brightness: 1.2 })
        .filter("Blur", { blurX: 0, blurY: 0.8 })
        .persist()
        .name(`${workflow.token.document.name} BotRQ`)

        .thenDo(async () => {
            if (level >= 3) {
                let oldEffect = await mba.findEffect(workflow.actor, "Blessing of the Raven Queen");
                if (oldEffect) await mba.removeEffect(oldEffect);
                await mba.createEffect(workflow.actor, effectData);
            }
        })

        .play();
}