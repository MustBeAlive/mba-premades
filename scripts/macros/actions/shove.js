export async function shove({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.targets.size) return;
    let skipCheck = false;
    let target = workflow.targets.first();
    if (workflow.actor.uuid === target.actor.uuid) return;
    if ((chrisPremades.helpers.getSize(target.actor)) > (chrisPremades.helpers.getSize(actor) + 1)) {
        ui.notifications.info('Target is too big to shove!');
        return;
    }
    let effect = chrisPremades.helpers.findEffect(target.actor, 'Incapacitated');
    if (effect) skipCheck = true;
    if (!skipCheck) {
        let options = [
            [`Acrobatics (${target.actor.system.skills.acr.total})`, 'acr'],
            [`Athletics (${target.actor.system.skills.ath.total})`, 'ath'],
            ['Uncontested', false]
        ];
        let selection = await chrisPremades.helpers.remoteDialog(workflow.item.name, options, chrisPremades.helpers.firstOwner(target).id, 'How would you like to contest the shove?');
        if (selection) {
            let sourceRoll = await workflow.actor.rollSkill('ath');
            let targetRoll = await chrisPremades.helpers.rollRequest(target, 'skill', selection);
            if (targetRoll.total >= sourceRoll.total) return;
        }
    }
    let selection = await chrisPremades.helpers.dialog('What do you want to do?', [['Push 5 ft.', 'move'], ['Knock Prone', 'prone']]);
    if (!selection) return;
    if (selection === 'prone') {

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

            .thenDo(function () {
                chrisPremades.helpers.addCondition(target.actor, 'Prone', false, null);
            })

            .play();

        return;
    }
    let distance = 5;
    let knockBackFactor;
    let ray;
    let newCenter;
    let hitsWall = true;
    while (hitsWall) {
        knockBackFactor = distance / canvas.dimensions.distance;
        ray = new Ray(workflow.token.center, target.center);
        if (ray.distance === 0) {
            ui.notifications.info('Unable to push target! (hits wall)');
            queue.remove(workflow.item.uuid);
            return;
        }
        newCenter = ray.project(1 + ((canvas.dimensions.size * knockBackFactor) / ray.distance));
        hitsWall = target.checkCollision(newCenter, { 'origin': ray.A, 'type': 'move', 'mode': 'any' });
        if (hitsWall) {
            distance -= 5;
            if (distance === 0) {
                ui.notifications.info('Unable to push target! (hits wall)');
                return;
            }
        }
    }
    const targetCenter = {
        x: target.x + canvas.grid.size * target.document.width / 2,
        y: target.y + canvas.grid.size * target.document.width / 2,
    };
    const tokenCenter = {
        x: token.x + canvas.grid.size * token.document.width / 2,
        y: token.y + canvas.grid.size * token.document.width / 2,
    };
    const position = {
        x: targetCenter.x - (canvas.grid.size * 1 * Math.sign(tokenCenter.x - targetCenter.x)),
        y: targetCenter.y - (canvas.grid.size * 1 * Math.sign(tokenCenter.y - targetCenter.y))
    };
    const backposition = {
        x: (targetCenter.x - tokenCenter.x) * -0.1,
        y: (targetCenter.y - tokenCenter.y) * -0.1,
    };
    const middleposition = {
        x: (targetCenter.x - tokenCenter.x) * 0.26,
        y: (targetCenter.y - tokenCenter.y) * 0.26,
    };
    const distanceX = Math.abs(tokenCenter.x - targetCenter.x);
    const distanceY = Math.abs(tokenCenter.y - targetCenter.y);
    if (distanceY < distanceX) {
        position.y = targetCenter.y;
        middleposition.y = 0;
        backposition.y = 0;
    } else if (distanceX < distanceY) {
        position.x = targetCenter.x;
        middleposition.x = 0;
        backposition.x = 0;
    }

    await new Sequence()

        .animation()
        .on(token)
        .opacity(0)
        .delay(100)

        .effect()
        .file("jb2a.impact.ground_crack.orange.03")
        .atLocation({ x: tokenCenter.x - backposition.x, y: tokenCenter.y - backposition.y })
        .rotateTowards(target)
        .size(token.document.width * 2.15, { gridUnits: true })
        .spriteOffset({ x: -0.75 }, { gridUnits: true })
        .belowTokens()
        .mirrorX()
        .delay(150)
        .filter("ColorMatrix", { hue: -17, saturate: 1 })

        .canvasPan()
        .delay(250)
        .shake({ duration: 250, strength: 2, rotation: false })

        .effect()
        .from(token)
        .atLocation(token)
        .mirrorX(token.document.data.mirrorX)
        .animateProperty("sprite", "position.x", { from: 0, to: backposition.x, duration: 250, ease: "easeOutExpo", delay: 200 })
        .animateProperty("sprite", "position.y", { from: 0, to: backposition.y, duration: 250, ease: "easeOutExpo", delay: 200 })
        .animateProperty("sprite", "position.x", { from: 0, to: middleposition.x, duration: 150, ease: "easeOutExpo", delay: 1000 })
        .animateProperty("sprite", "position.y", { from: 0, to: middleposition.y, duration: 150, ease: "easeOutExpo", delay: 1000 })
        .animateProperty("sprite", "position.x", { from: 0, to: -middleposition.x, duration: 450, ease: "easeOutQuad", fromEnd: true })
        .animateProperty("sprite", "position.y", { from: 0, to: -middleposition.y, duration: 450, ease: "easeOutQuad", fromEnd: true })
        .scaleToObject(1, { considerTokenScale: true })
        .duration(1600)

        .effect()
        .file("jb2a.melee_attack.03.trail.02.orangered.0")
        .atLocation({ x: tokenCenter.x + middleposition.x, y: tokenCenter.y + middleposition.y })
        .rotateTowards(target)
        .size(3 * token.document.width, { gridUnits: true })
        .spriteOffset({ x: -1 * token.document.width }, { gridUnits: true })
        .zIndex(2)
        .delay(500)

        .effect()
        .file("jb2a.gust_of_wind.veryfast")
        .atLocation(token)
        .stretchTo(position, { onlyX: true })
        .scale(0.5)
        .opacity(0.15)
        .belowTokens()
        .fadeOut(1000)
        .delay(1000)

        .wait(1000)

        .effect()
        .file("jb2a.impact.009.orange")
        .atLocation(token)
        .rotateTowards(target)
        .size(token.document.width * 2.5, { gridUnits: true })
        .spriteOffset({ x: 0.05 }, { gridUnits: true })
        .filter("ColorMatrix", { hue: -17, saturate: 1 })

        .animation()
        .on(target)
        .opacity(0)
        .delay(100)

        .effect()
        .file("animated-spell-effects-cartoon.smoke.01")
        .atLocation(token)
        .rotateTowards(position)
        .size(2 * token.document.width, { gridUnits: true })
        .belowTokens()
        .opacity(0.4)
        .spriteRotation(-90)
        .spriteOffset({ x: -1.25 * token.document.width }, { gridUnits: true })

        .animation()
        .on(token)
        .opacity(1)
        .delay(500)

        .effect()
        .delay(150)
        .from(target)
        .atLocation(target)
        .moveTowards(position, { rotate: false, ease: "easeOutCirc" })
        .moveSpeed(1250)
        .size(target.document.width * target.document.texture.scaleX, { gridUnits: true })
        .waitUntilFinished(-200)

        .animation()
        .on(target)
        .teleportTo(position)
        .snapToGrid()
        .offset({ x: -1, y: -1 })
        .opacity(1)

        .play()
}