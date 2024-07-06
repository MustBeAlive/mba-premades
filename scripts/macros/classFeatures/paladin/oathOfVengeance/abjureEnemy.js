import { constants } from "../../../generic/constants.js";
import { mba } from "../../../../helperFunctions.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let CDItem = await mba.getItem(workflow.actor, "Channel Divinity");
    if (!CDItem) {
        ui.notifications.warn("Unable to find feature! (Channel Divinity)");
        return false;
    }
    let uses = CDItem.system.uses.value;
    if (uses < 1) {
        ui.notifications.warn("You don't have any Channel Divinity uses left!");
        return false;
    }
    let target = workflow.targets.first();
    let type = mba.raceOrType(target.actor);
    if (mba.checkTrait(target.actor, "ci", "frightened")) {
        ui.notifications.warn("Target is immune to being charmed!");
        await CDItem.update({ "system.uses.value": uses -= 1 });
        return false;
    }
    if (type === "undead" || type === "fiend") await mba.createEffect(target.actor, constants.disadvantageEffectData);
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let CDItem = await mba.getItem(workflow.actor, "Channel Divinity");
    if (!CDItem) {
        ui.notifications.warn("Unable to find feature! (Channel Divinity)");
        return false;
    }
    let uses = CDItem.system.uses.value;
    if (uses < 1) {
        ui.notifications.warn("You don't have any Channel Divinity uses left!");
        return false;
    }
    let target = workflow.targets.first();
    let changes = [
        {
            'key': 'macro.CE',
            'mode': 0,
            'value': "Frightened",
            'priority': 20
        },
        {
            'key': "system.attributes.movement.walk",
            'mode': 5,
            'value': 0,
            'priority': 100
        }
    ];
    let description = `
        <p>You are frightened by <u>${workflow.token.document.name}</u> or until you take any damage.</p>
        <p>While frightened, your speed is 0 and you can't benefit from any bonuses to your speed.</p>
    `;
    if (!workflow.failedSaves.size) {
        changes = [
            {
                'key': 'system.attributes.movement.walk',
                'mode': 1,
                'value': '*0.5',
                'priority': 20
            },
        ];
        description = `
            <p>Your speed is halved for the duration or until you take any damage.</p>
        `;
    }
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Abjure Enemy` })
    };
    let effectData = {
        'name': "Abjure Enemy",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': description,
        'duration': {
            'seconds': 60
        },
        'changes': changes,
        'flags': {
            'dae': {
                'specialDuration': ['isDamaged', 'zeroHP'],
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
        .attachTo(workflow.token)
        .file("jb2a.extras.tmfx.outflow.circle.01")
        .scaleToObject(1.5 * workflow.token.document.texture.scaleX)
        .fadeIn(500)
        .fadeOut(500)
        .opacity(1)
        .belowTokens()
        .randomRotation()
        .filter("ColorMatrix", { brightness: 0 })

        .effect()
        .file("jb2a.markers.02.purplepink")
        .atLocation(workflow.token)
        .rotateTowards(target)
        .scaleToObject(1)
        .fadeOut(1000)
        .scaleIn(0, 1500, { ease: "easeOutCubic" })
        .spriteOffset({ x: -0.2 }, { gridUnits: true })
        .spriteScale({ x: 0.8, y: 1 })
        .animateProperty("sprite", "position.x", { from: -0.5, to: 0.05, duration: 1000, gridUnits: true, ease: "easeOutBack", delay: 0 })
        .animateProperty("sprite", "width", { from: 0.8, to: 0.25, duration: 500, gridUnits: true, ease: "easeOutBack", delay: 1500 })
        .animateProperty("sprite", "height", { from: 1, to: 0.25, duration: 500, gridUnits: true, ease: "easeOutBack", delay: 1500 })
        .filter("ColorMatrix", { saturate: 0.5, hue: -2 })
        .rotate(0)
        .filter("Glow", { color: 0x000000 })
        .zIndex(1)

        .effect()
        .file("jb2a.particle_burst.01.circle.bluepurple")
        .atLocation(workflow.token)
        .rotateTowards(target)
        .scaleToObject(1)
        .scaleIn(0, 1500, { ease: "easeOutCubic" })
        .spriteOffset({ x: -0.2 }, { gridUnits: true })
        .spriteScale({ x: 0.8, y: 1 })
        .rotate(0)
        .animateProperty("sprite", "position.x", { from: -0.5, to: 0.05, duration: 1000, gridUnits: true, ease: "easeOutBack", delay: 0 })
        .zIndex(0)
        .tint("#9e19e6")
        .filter("ColorMatrix", { saturate: 0.5, hue: -2 })

        .effect()
        .file("jb2a.particles.outward.purple.01.03")
        .atLocation(workflow.token)
        .rotateTowards(target)
        .scaleToObject(2.5)
        .delay(750)
        .duration(1500)
        .fadeOut(1500)
        .scaleIn(0, 1500, { ease: "easeOutCubic" })
        .spriteOffset({ x: -0.5, y: -0.1 }, { gridUnits: true })
        .spriteScale({ x: 0.8, y: 1 })
        .tint("#9e19e6")
        .filter("ColorMatrix", { saturate: 1, hue: -2 })
        .waitUntilFinished(-1500)

        .effect()
        .file("jb2a.toll_the_dead.purple.skull_smoke")
        .attachTo(target)
        .scaleToObject(1.65, { considerTokenScale: true })
        .filter("ColorMatrix", { saturate: 0.25, hue: -5 })
        .zIndex(1)

        .effect()
        .from(target)
        .attachTo(target)
        .scaleToObject(1, { considerTokenScale: true })
        .duration(5000)
        .fadeIn(500)
        .fadeOut(2000)
        .loopProperty("sprite", "position.x", { from: -0.05, to: 0.05, duration: 55, pingPong: true, gridUnits: true })
        .filter("ColorMatrix", { saturate: -1, brightness: 0.5 })
        .opacity(0.65)
        .zIndex(0.1)

        .effect()
        .file(`jb2a.particles.outward.purple.01.03`)
        .attachTo(target, { offset: { y: 0.1 }, gridUnits: true, followRotation: false })
        .size(1 * target.document.width, { gridUnits: true })
        .duration(1000)
        .fadeOut(800)
        .scaleIn(0, 1000, { ease: "easeOutCubic" })
        .animateProperty("sprite", "width", { from: 0, to: 0.25, duration: 500, gridUnits: true, ease: "easeOutBack" })
        .animateProperty("sprite", "height", { from: 0, to: 1.0, duration: 1000, gridUnits: true, ease: "easeOutBack" })
        .animateProperty("sprite", "position.y", { from: 0, to: -0.6, duration: 1000, gridUnits: true })
        .filter("ColorMatrix", { saturate: 1, hue: 20 })
        .zIndex(0.3)

        .effect()
        .file("jb2a.template_circle.symbol.normal.fear.dark_purple")
        .attachTo(target)
        .scaleToObject(1.5)
        .delay(500)
        .fadeIn(1000)
        .fadeOut(1500)
        .mask()
        .persist()
        .name(`${target.document.name} Abjure Enemy`)

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectData);
            await CDItem.update({ "system.uses.value": uses -= 1 });
        })

        .play()
}

export let abjureEnemy = {
    'cast': cast,
    'item': item
}