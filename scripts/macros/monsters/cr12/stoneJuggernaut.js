import {mba} from "../../../helperFunctions.js";

async function slam({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let targets = Array.from(workflow.failedSaves);
    for (let target of targets) {
        await new Sequence()

            .effect()
            .file("jb2a.melee_attack.05.trail.03.orangered.0")
            .size(token.document.width * 3, { gridUnits: true })
            .atLocation(token)
            .spriteOffset({ x: -1 * token.document.width }, { gridUnits: true })
            .rotateTowards(target)
            .belowTokens()
            .zIndex(1)

            .animation()
            .on(target)
            .opacity(0)
            .delay(100)

            .effect()
            .from(target)
            .atLocation(target)
            .mirrorX(target.document.data.mirrorX)
            .animateProperty("sprite", "position.y", { from: 0, to: -0.25, duration: 450, gridUnits: true, ease: "easeOutExpo", delay: 250 })
            .animateProperty("sprite", "position.y", { from: 0, to: 0.25, duration: 250, ease: "easeInOutBack", gridUnits: true, fromEnd: true })
            .scaleToObject(target.document.texture.scaleX, { considerTokenScale: true })
            .duration(950)

            .effect()
            .from(target)
            .atLocation(target)
            .scaleToObject(target.document.texture.scaleX, { considerTokenScale: true })
            .belowTokens()
            .filter("ColorMatrix", { saturate: -1, brightness: 0 })
            .filter("Blur", { blurX: 5, blurY: 10 })
            .opacity(0.5)
            .duration(500)

            .effect()
            .atLocation(target)
            .file("animated-spell-effects-cartoon.air.puff.01")
            .scaleToObject(1.75)
            .belowTokens()
            .opacity(0.35)
            .scaleIn(0, 500, { ease: "easeOutCubic" })
            .delay(750)

            .animation()
            .on(target)
            .opacity(1)
            .delay(850)

            .thenDo(async () => {
                if (mba.findEffect(target.actor, "Prone")) return;
                if (mba.getSize(target.actor) > 3) return;
                await mba.addCondition(target.actor, 'Prone', false, null);
            })

            .play();
    }
}

async function devastatingRollCast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let targets = Array.from(mba.findNearby(workflow.token.document, 1, null, false, false)).filter(i => i.actor.effects.some(e => e.name === "Prone") && !i.actor.effects.some(e => e.name === "Devastating Roll"));
    let newTargets = [];
    for (let target of targets) newTargets.push(target.document.id);
    if (!newTargets.length) ui.notifications.info("No valid targets found!");
    mba.updateTargets(newTargets);
}

async function devastatingRollItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    let targets = Array.from(workflow.targets);
    const effectData = {
        'name': "Devastating Roll",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'flags': {
            'dae': {
                'showIcon': false,
                'specialDuration': ['turnStartSource']
            }
        }
    };
    for (let target of targets) await mba.createEffect(target.actor, effectData);
}

export let stoneJuggernaut = {
    'slam': slam,
    'devastatingRollCast': devastatingRollCast,
    'devastatingRollItem': devastatingRollItem
}