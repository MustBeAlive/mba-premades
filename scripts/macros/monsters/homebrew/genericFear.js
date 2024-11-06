import { mba } from "../../../helperFunctions.js";

export async function genericFear({ speaker, actor, token, character, item, args, scope, workflow }) {
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} UnsVis` })
    };
    let effectData = {
        'name': "Unsettling Visage",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.oR1wUvem3zVVUv5Q]{Frightened} by Changeling's Unsettling Visage for the duration.</p>
            <p>You can repeat the saving throw at the end of each of your turns, ending the effect on a success.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': 'Frightened',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `turn=end, saveAbility=wis, saveDC=13, saveMagic=false, name=Fear: Turn End (DC 13), killAnim=true`,
                'priority': 20
            },
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };
    if (!workflow.failedSaves.size) return;
    for (let target of Array.from(workflow.failedSaves)) {
        new Sequence()

        new Sequence()

            .effect()
            .file("animated-spell-effects-cartoon.misc.fiery eyes.04")
            .atLocation(workflow.token)
            .size(0.9, { gridUnits: true })
            .anchor({ x: 0.5, y: 0.5 })
            .duration(6000)
            .fadeIn(200)
            .fadeOut(500)

            .effect()
            .file("animated-spell-effects-cartoon.misc.fiery eyes.04")
            .atLocation(workflow.token)
            .size(0.9, { gridUnits: true })
            .anchor({ x: 0.5, y: 0.5 })
            .filter("Blur", { blurX: 5, blurY: 10 })
            .opacity(1)
            .filter("ColorMatrix", { saturate: -1, brightness: 2 })
            .duration(6000)
            .fadeIn(200)
            .fadeOut(500)

            .effect()
            .file("jb2a.extras.tmfx.outflow.circle.02")
            .atLocation(workflow.token)
            .belowTokens()
            .opacity(0.25)
            .size(3, { gridUnits: true })
            .duration(5000)
            .fadeIn(1000)
            .fadeOut(500)

            .effect()
            .file("animated-spell-effects-cartoon.misc.fiery eyes.04")
            .atLocation(workflow.token)
            .scale({ x: 0.1, y: 1.25 })
            .anchor({ x: 0.5, y: 0.35 })
            .opacity(0.5)
            .rotate(90)
            .rotateTowards(target)
            .belowTokens()
            .duration(5000)
            .fadeIn(500)
            .fadeOut(500)

            .effect()
            .file("animated-spell-effects-cartoon.misc.fiery eyes.04")
            .atLocation(workflow.token)
            .scale({ x: 0.1, y: 1.25 })
            .anchor({ x: 0.5, y: 0.35 })
            .opacity(0.2)
            .filter("ColorMatrix", { saturate: -1, brightness: 2 })
            .rotate(90)
            .rotateTowards(target)
            .duration(5000)
            .fadeIn(500)
            .fadeOut(500)

            .effect()
            .file("jb2a.wind_stream.white")
            .atLocation(workflow.token)
            .stretchTo(target, { onlyX: false })
            .filter("Blur", { blurX: 10, blurY: 20 })
            .loopProperty("sprite", "position.y", { from: -5, to: 5, duration: 100, pingPong: true })
            .opacity(0.3)

            .effect()
            .from(target)
            .attachTo(target)
            .fadeIn(100)
            .fadeOut(1000)
            .playbackRate(4)
            .loopProperty("sprite", "position.x", { from: -0.05, to: 0.05, duration: 55, pingPong: true, gridUnits: true })
            .scaleToObject(1, { considerTokenScale: true })
            .duration(5000)
            .opacity(0.15)
            .zIndex(0.1)

            .effect()
            .file("jb2a.icon.fear.dark_orange")
            .attachTo(target)
            .scaleIn(0, 500, { ease: "easeOutQuint" })
            .fadeOut(1000)
            .scaleToObject(1)
            .duration(2000)
            .filter("ColorMatrix", { hue: 120 })
            .playbackRate(1)

            .effect()
            .file("jb2a.extras.tmfx.border.circle.outpulse.01.fast")
            .attachTo(target)
            .scaleToObject(2)

            .thenDo(async () => {
                if (!mba.checkTrait(target.actor, "ci", "frightened")) await mba.createEffect(target.actor, effectData);
            })

            .effect()
            .file("jb2a.markers.fear.dark_orange.03")
            .attachTo(target)
            .scaleToObject(2)
            .delay(500)
            .center()
            .fadeIn(1000)
            .fadeOut(1000)
            .playbackRate(1)
            .filter("ColorMatrix", { hue: 130 })
            .persist()
            .name(`${target.document.name} UnsVis`)
            .playIf(() => {
                return (!mba.checkTrait(target.actor, "ci", "frightened"));
            })

            .play()
    }
}