import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let ammount = workflow.castData.castLevel - 2;
    if (workflow.targets.size <= ammount) return;
    let selection = await mba.selectTarget(workflow.item.name, constants.okCancel, Array.from(workflow.targets), false, 'multiple', undefined, false, 'Too many targets selected. Choose which targets to keep (Max: ' + ammount + ')');
    if (!selection.buttons) return;
    let newTargets = selection.inputs.filter(i => i).slice(0, ammount);
    mba.updateTargets(newTargets);
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Fly` })

        new Sequence()

            .animation()
            .on(token)
            .opacity(1)
            .fadeIn(1000)

            .play();
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You have flying speed of 60 feet for the duration.</p>
            <p>When the spell ends, you instantly fall if you are still aloft, unless you can stop the fall.
        `,
        'duration': {
            'seconds': 600
        },
        'changes': [
            {
                'key': 'system.attributes.movement.fly',
                'mode': 2,
                'value': 60,
                'priority': 20
            }
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 3,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    for (let target of Array.from(workflow.targets)) {
        await new Sequence()

            .effect()
            .file("animated-spell-effects-cartoon.energy.pulse.yellow")
            .atLocation(target, { offset: { y: 0.2 }, gridUnits: true })
            .size({ width: target.document.width * 1.5, height: target.document.width * 1.45 }, { gridUnits: true })
            .zIndex(1)
            .belowTokens()
            .filter("ColorMatrix", { hue: -10 })

            .effect()
            .file("animated-spell-effects-cartoon.smoke.105")
            .atLocation(target, { offset: { y: 0.05 }, gridUnits: true })
            .scaleToObject(2)
            .opacity(1)
            .belowTokens()
            .tint("#FFd129")

            .animation()
            .on(target)
            .opacity(0)

            .effect()
            .from(target)
            .attachTo(target, { bindAlpha: false, followRotation: true, locale: false })
            .scaleToObject(1, { considerTokenScale: true })
            .duration(800)
            .fadeOut(1000)
            .animateProperty("sprite", "position.y", { from: 50, to: -10, duration: 500, ease: "easeOutBack" })
            .loopProperty("sprite", "position.y", { from: 0, to: -50, duration: 2500, pingPong: true, delay: 1000 })
            .opacity(1)
            .zIndex(2)
            .filter("Glow", { color: 0xFFd129, distance: 10, outerStrength: 4, innerStrength: 0 })
            .persist()
            .name(`${target.document.name} Fly`)

            .effect()
            .file("jb2a.particles.outward.orange.02.04")
            .attachTo(target, { bindAlpha: false })
            .scaleToObject(1.35, { considerTokenScale: true })
            .duration(800)
            .fadeIn(1000)
            .fadeOut(1000)
            .animateProperty("sprite", "position.y", { from: 50, to: -10, duration: 500, ease: "easeOutBack" })
            .loopProperty("sprite", "position.y", { from: 0, to: -50, duration: 2500, pingPong: true, delay: 1000 })
            .zIndex(2.2)
            .persist()
            .name(`${target.document.name} Fly`)

            .effect()
            .from(target)
            .atLocation(target)
            .attachTo(target, { bindAlpha: false })
            .scaleToObject(0.9)
            .duration(1000)
            .fadeOut(1000)
            .opacity(0.5)
            .zIndex(1)
            .belowTokens()
            .filter("ColorMatrix", { brightness: -1 })
            .filter("Blur", { blurX: 5, blurY: 10 })
            .persist()
            .name(`${target.document.name} Fly`)

            .thenDo(async () => {
                await mba.createEffect(target.actor, effectData)
            })

            .play();
    }
}

export let fly = {
    'cast': cast,
    'item': item
}