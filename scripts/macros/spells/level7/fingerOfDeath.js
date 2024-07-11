import {mba} from "../../../helperFunctions.js";
import {tashaSummon} from "../../generic/tashaSummon.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    new Sequence()

        .effect()
        .file("jb2a.extras.tmfx.border.circle.outpulse.01.fast")
        .atLocation(workflow.token)
        .scaleToObject(3)
        .fadeIn(1000)
        .fadeOut(2000)
        .opacity(0.75)
        .zIndex(1)
        .belowTokens()
        .filter("ColorMatrix", { saturate: 0, brightness: 0 })
        .persist()
        .name(`${workflow.token.document.name} FoDC1`)

        .effect()
        .file("jb2a.extras.tmfx.outflow.circle.04")
        .attachTo(workflow.token)
        .scaleToObject(3)
        .fadeIn(1000)
        .fadeOut(2000)
        .opacity(1.2)
        .zIndex(1)
        .randomRotation()
        .belowTokens()
        .filter("ColorMatrix", { saturate: 0, brightness: 0 })
        .persist()
        .name(`${workflow.token.document.name} FoDC1`)

        .effect()
        .file(canvas.scene.background.src)
        .atLocation({ x: (canvas.dimensions.width) / 2, y: (canvas.dimensions.height) / 2 })
        .size({ width: canvas.scene.width / canvas.grid.size, height: canvas.scene.height / canvas.grid.size }, { gridUnits: true })
        .duration(20000)
        .fadeIn(1000)
        .fadeOut(2000)
        .spriteOffset({ x: -0.5 }, { gridUnits: true })
        .filter("ColorMatrix", { brightness: 0.3 })
        .belowTokens()
        .persist()
        .name(`${workflow.token.document.name} FoDC2`)

        .effect()
        .file("jb2a.impact.010.green")
        .atLocation(workflow.token)
        .rotateTowards(target)
        .scaleToObject(0.4)
        .fadeOut(750)
        .spriteOffset({ x: -0.2 }, { gridUnits: true })
        .zIndex(1)

        .wait(50)

        .effect()
        .file("jb2a.twinkling_stars.points04.orange")
        .atLocation(workflow.token)
        .rotateTowards(target)
        .scaleToObject(0.4)
        .fadeOut(750)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .animateProperty("sprite", "rotation", { from: 0, to: 360, duration: 1000, ease: "easeOutCubic" })
        .animateProperty("sprite", "position.x", { from: -0.2, to: 0.25, duration: 1500, gridUnits: true, ease: "easeOutBack", delay: 1500 })
        .animateProperty("sprite", "rotation", { from: 0, to: 360, duration: 4042, ease: "easeOutSine" })
        .spriteOffset({ x: -0.2 }, { gridUnits: true })
        .rotate(0)
        .zIndex(1)
        .filter("ColorMatrix", { hue: 70 })
        .persist()
        .name(`${workflow.token.document.name} FoDC1`)

        .effect()
        .file("jb2a.extras.tmfx.outpulse.circle.03.normal")
        .atLocation(workflow.token)
        .rotateTowards(target)
        .scaleToObject(0.35)
        .duration(4042)
        .fadeOut(750)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .animateProperty("sprite", "rotation", { from: 0, to: 360, duration: 1000, ease: "easeOutCubic" })
        .animateProperty("sprite", "position.x", { from: -0.2, to: 0.275, duration: 1500, gridUnits: true, ease: "easeOutBack", delay: 1500 })
        .spriteOffset({ x: -0.175 }, { gridUnits: true })
        .rotate(0)
        .opacity(0.8)
        .zIndex(0)
        .tint("#89eb34")
        .persist()
        .name(`${workflow.token.document.name} FoDC1`)

        .play()
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    async function effectMacroTurnStart() {
        await mbaPremades.macros.fingerOfDeath.zombie(token);
    };
    let effectData = {
        'name': "Finger of Death: Zombie",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'flags': {
            'effectmacro': {
                'onTurnStart': {
                    'script': mba.functionToString(effectMacroTurnStart)
                }
            },
            'mba-premades': {
                'spell': {
                    'fingerOfDeath': {
                        'castLevel': workflow.castData.castLevel,
                        'originItem': workflow.item.uuid
                    }
                }
            }
        }
    };
    new Sequence()

        .thenDo(async () => {
            Sequencer.EffectManager.endEffects({ name: `${workflow.token.document.name} FoDC1` })
        })

        .effect()
        .file("jb2a.fireball.beam.dark_red")
        .atLocation(workflow.token)
        .stretchTo(target)
        .scale(1)
        .playbackRate(1.75)
        .filter("ColorMatrix", { hue: -285 })
        .startTime(2000)
        .waitUntilFinished(-2100)

        .effect()
        .file("jb2a.impact.004.dark_red")
        .atLocation(target)
        .scaleToObject(2.5)
        .fadeOut(1167)
        .scaleIn(0, 1167, { ease: "easeOutCubic" })
        .opacity(0.45)
        .filter("ColorMatrix", { hue: -285 })

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
        .filter("ColorMatrix", { saturate: -1, brightness: 0 })
        .repeats(10, 250, 250)

        .effect()
        .attachTo(target)
        .scaleToObject(1, { considerTokenScale: true })
        .duration(10000)
        .fadeIn(5000)
        .fadeOut(5000)
        .filter("ColorMatrix", { saturate: -1, brightness: 0.5 })

        .effect()
        .file("jb2a.token_border.circle.static.blue.009")
        .attachTo(target)
        .scaleToObject(1.8, { considerTokenScale: true })
        .duration(10000)
        .fadeIn(1000)
        .fadeOut(6000)
        .belowTokens()
        .filter("ColorMatrix", { saturate: -1, brightness: 0 })

        .effect()
        .from(target)
        .attachTo(target)
        .scaleToObject(1, { considerTokenScale: true })
        .duration(5000)
        .fadeIn(100)
        .fadeOut(1000)
        .loopProperty("sprite", "position.x", { from: -0.1, to: 0.1, duration: 55, pingPong: true, gridUnits: true })
        .playbackRate(4)
        .opacity(0.15)
        .zIndex(0.1)

        .effect()
        .file("jb2a.static_electricity.03.blue")
        .attachTo(target)
        .scaleToObject(1.25)
        .delay(2000)
        .fadeOut(1000)
        .opacity(0.75)
        .zIndex(1)
        .playbackRate(2)
        .randomRotation()
        .filter("ColorMatrix", { saturate: -1, brightness: 0 })
        .repeats(3, 2000, 4000)

        .thenDo(async () => {
            Sequencer.EffectManager.endEffects({ name: `${workflow.token.document.name} FoDC2` })
            if (target.actor.system.attributes.hp.value > 1 || mba.raceOrType(target.actor) != "humanoid") return;
            await mba.createEffect(workflow.actor, effectData);
        })

        .play()
}

async function zombie(token) {
    let effect = await mba.findEffect(token.actor, "Finger of Death: Zombie");
    if (!effect) return;
    let originItem = await fromUuid(effect.flags['mba-premades']?.spell?.fingerOfDeath?.originItem);
    if (!originItem) return;
    let sourceActor = game.actors.getName("MBA: Zombie");
    if (!sourceActor) {
        ui.notifications.warn("Missing actor in the side panel! (MBA: Zombie)");
        return;
    }
    let tokenName = `${token.document.name} Zombie`;
    let updates = {
        'actor': {
            'name': tokenName,
            'prototypeToken': {
                'name': tokenName,
                'disposition': token.document.disposition,
            }
        },
        'token': {
            'disposition': token.document.disposition,
            'name': tokenName,
        }
    };
    await tashaSummon.spawn(sourceActor, updates, 31104000, originItem, 5, token, "shadow", {}, effect.flags['mba-premades']?.spell?.fingerOfDeath?.castLevel);
}

export let fingerOfDeath = {
    'cast': cast,
    'item': item,
    'zombie': zombie
}