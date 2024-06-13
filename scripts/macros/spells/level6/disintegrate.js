export async function disintegrate({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let offsetX = 0;
    let offsetY = 0;
    if (!workflow.failedSaves.size) {
        offsetX = Math.floor(Math.random() * (Math.floor(2) - Math.ceil(0) + 1) + Math.ceil(0));
        if (offsetX === 0) offsetX = 1;
        offsetY = Math.floor(Math.random() * (Math.floor(2) - Math.ceil(0) + 1) + Math.ceil(0));
        if (offsetY === 0) offsetY = 1;
    }

    new Sequence()

        .wait(500)

        .effect()
        .file("jb2a.particles.outward.white.01.02")
        .scaleIn(0, 1000, { ease: "easeOutQuint" })
        .delay(500)
        .fadeOut(1000)
        .atLocation(token)
        .duration(1000)
        .size(1.75, { gridUnits: true })
        .animateProperty("spriteContainer", "position.y", { from: 0, to: -0.5, gridUnits: true, duration: 1000 })
        .zIndex(1)

        .effect()
        .file("jb2a.particles.outward.white.01.02")
        .scaleIn(0, 1000, { ease: "easeOutQuint" })
        .delay(500)
        .fadeOut(1000)
        .atLocation(token)
        .duration(1000)
        .size(1.75, { gridUnits: true })
        .animateProperty("spriteContainer", "position.y", { from: 0, to: -0.5, gridUnits: true, duration: 1000 })
        .zIndex(1)
        .mirrorX()

        .wait(1000)

        .effect()
        .file("jb2a.extras.tmfx.border.circle.inpulse.01.fast")
        .atLocation(token)
        .tint("#d9df53")
        .scaleToObject(1.5)

        .wait(500)

        .effect()
        .file("jb2a.disintegrate.green")
        .atLocation(token)
        .stretchTo(target, { offset: { x: offsetX, y: offsetY }, gridUnits: true })
        .zIndex(1)
        .playbackRate(0.9)
        .repeats(2, 1000)

        .play()

    if (target.actor.system.attributes.hp.value > 0) return;

    let centerX = target.x + canvas.grid.size / 2
    let centerY = target.y + canvas.grid.size / 2
    let updates = {
        'token': {
            'hidden': true
        }
    };
    let options = {
        'permanent': false,
        'name': 'Disintegration',
        'description': 'Disintegration'
    };

    new Sequence()

        .wait(4000)

        .animation()
        .on(target)
        .delay(1)
        .opacity(0)

        .effect()
        .file("animated-spell-effects-cartoon.smoke.97")
        .atLocation(target, { offset: { y: -0.25 }, gridUnits: true })
        .delay(500)
        .fadeIn(1000)
        .scaleIn(0, 1000, { ease: "easeOutCubic" })
        .duration(10000)
        .fadeOut(2000)
        .scaleToObject(0.8)
        .filter("ColorMatrix", { brightness: 0 })
        .zIndex(1)

        .effect()
        .atLocation({ x: centerX, y: centerY })
        .from(target)
        .scaleToObject(target.document.texture.scaleX)
        .shape("circle", {
            lineSize: 25,
            lineColor: "#FF0000",
            radius: 0.4,
            gridUnits: true,
            name: "test",
            isMask: true,
            offset: { x: canvas.grid.size * 0.1, y: -canvas.grid.size * 0.4 },
        })
        .duration(4000)
        .fadeOut(2000)
        .name(`1.2`)

        .effect()
        .atLocation({ x: centerX, y: centerY })
        .from(target)
        .scaleToObject(target.document.texture.scaleX)
        .shape("circle", {
            lineSize: 25,
            lineColor: "#FF0000",
            radius: 0.45,
            gridUnits: true,
            name: "test",
            isMask: true,
            offset: { x: -canvas.grid.size * 0.4, y: canvas.grid.size * 0.3 },
        })
        .duration(6000)
        .fadeOut(2000)
        .name(`2`)

        .effect()
        .atLocation({ x: centerX, y: centerY })
        .from(target)
        .scaleToObject(target.document.texture.scaleX)
        .shape("circle", {
            lineSize: 25,
            lineColor: "#FF0000",
            radius: 0.45,
            gridUnits: true,
            name: "test",
            isMask: true,
            offset: { x: canvas.grid.size * 0.5, y: canvas.grid.size * 0.4 },
        })
        .duration(8000)
        .fadeOut(2000)
        .name(`3`)
        .waitUntilFinished()

        .thenDo(async () => {
            await warpgate.mutate(target.document, updates, {}, options);
        })

        .wait(500)

        .animation()
        .on(target)
        .opacity(1)

        .play()
}