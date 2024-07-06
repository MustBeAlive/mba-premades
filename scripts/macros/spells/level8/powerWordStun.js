import {mba} from "../../../helperFunctions.js";

export async function powerWordStun({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let saveDC = mba.getSpellDC(workflow.item);
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} PWS` })
    };
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are stunned by a Power Word.</p>
            <p>At the end of each of your turns, you can make a Constitution Saving Throw. On a successful save, this stun ends.</p>
        `,
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': 'Stunned',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `turn=end, saveAbility=con, saveDC=${saveDC}, saveMagic=true, name=Stun: Turn End (DC${saveDC}), killAnim=true`,
                'priority': 20
            },
        ],
        'flags': {
            'dae': {
                'showIcon': true,
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 8,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    new Sequence()

        .effect()
        .file("jb2a.extras.tmfx.border.circle.outpulse.01.fast")
        .attachTo(workflow.token)
        .scaleToObject(3)
        .opacity(0.75)
        .zIndex(1)
        .belowTokens()
        .filter("ColorMatrix", { saturate: 0, brightness: 0 })
        .repeats(3, 1000, 1000)

        .effect()
        .file("jb2a.extras.tmfx.outflow.circle.04")
        .attachTo(workflow.token)
        .scaleToObject(2.8)
        .fadeIn(1000)
        .fadeOut(1000)
        .opacity(1.2)
        .zIndex(1)
        .randomRotation()
        .belowTokens()
        .filter("ColorMatrix", { saturate: 0, brightness: 0 })
        .repeats(3, 1000, 1000)

        .effect()
        .file(canvas.scene.background.src)
        .atLocation({ x: (canvas.dimensions.width) / 2, y: (canvas.dimensions.height) / 2 })
        .size({ width: canvas.scene.width / canvas.grid.size, height: canvas.scene.height / canvas.grid.size }, { gridUnits: true })
        .duration(9500)
        .fadeIn(1000)
        .fadeOut(1000)
        .spriteOffset({ x: -0.5 }, { gridUnits: true })
        .filter("ColorMatrix", { brightness: 0.3 })
        .belowTokens()

        .wait(1000)

        .effect()
        .file("jb2a.magic_signs.rune.02.loop.05.blue")
        .attachTo(workflow.token, { offset: { x: -0.5, y: -0.5 }, gridUnits: true })
        .scaleToObject(0.8)
        .duration(8000)
        .fadeIn(1000)
        .fadeOut(1000)

        .effect()
        .file("jb2a.magic_signs.rune.02.loop.02.blue")
        .attachTo(workflow.token, { offset: { x: -0.1, y: -0.5 }, gridUnits: true })
        .scaleToObject(0.8)
        .delay(1000)
        .duration(7000)
        .fadeIn(1000)
        .fadeOut(1000)

        .effect()
        .file("jb2a.magic_signs.rune.02.loop.02.blue")
        .attachTo(workflow.token, { offset: { x: 0.1, y: -0.5 }, gridUnits: true })
        .scaleToObject(0.8)
        .delay(1000)
        .duration(7000)
        .fadeIn(1000)
        .fadeOut(1000)
        .mirrorX()

        .effect()
        .file("jb2a.magic_signs.rune.02.loop.05.blue")
        .attachTo(workflow.token, { offset: { x: 0.5, y: -0.5 }, gridUnits: true })
        .scaleToObject(0.8)
        .delay(2000)
        .duration(6000)
        .fadeIn(1000)
        .fadeOut(1000)
        .mirrorX()

        .wait(3500)

        .effect()
        .file("jb2a.cast_generic.dark.side01.red")
        .atLocation(workflow.token)
        .rotateTowards(target)
        .size(1.5 * workflow.token.document.width, { gridUnits: true })
        .zIndex(2)
        .filter("ColorMatrix", { hue: 205 })
        .waitUntilFinished(-1500)

        .effect()
        .file("jb2a.impact.004.blue")
        .atLocation(target)
        .scaleToObject(3)
        .fadeOut(1167)
        .scaleIn(0, 1167, { ease: "easeOutCubic" })
        .opacity(0.45)

        .canvasPan()
        .shake({ duration: 100, strength: 25, rotation: false })

        .effect()
        .file("jb2a.static_electricity.03.blue")
        .attachTo(target)
        .scaleToObject(1.25)
        .fadeOut(1000)
        .opacity(0.75)
        .zIndex(1)
        .playbackRate(4)
        .randomRotation()
        .repeats(10, 250, 250)

        .thenDo(async () => {
            if (target.actor.system.attributes.hp.value <= 150 && !mba.checkTrait(target.actor, "ci", "stunned")) await mba.createEffect(target.actor, effectData);
            else ui.notifications.info("Target either has more than 150 HP or is immune to being Stunned!");
        })

        .effect()
        .file("jb2a.template_circle.symbol.normal.stun.purple")
        .attachTo(target)
        .scaleToObject(1)
        .fadeIn(3000)
        .fadeOut(1000)
        .filter("ColorMatrix", { hue: 290 })
        .mask()
        .persist()
        .name(`${target.document.name} PWS`)
        .playIf(() => {
            return (target.actor.system.attributes.hp.value <= 150 && !mba.checkTrait(target.actor, "ci", "stunned"));
        })

        .play();
}