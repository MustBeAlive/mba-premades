import {mba} from "../../../helperFunctions.js";

export async function divineIntervention({ speaker, actor, token, character, item, args, scope, workflow }) {
    let clericLevels = workflow.actor.classes.cleric?.system?.levels;
    let subClassIdentifier = workflow.actor.classes.cleric?.subclass?.identifier;
    if (workflow.damageTotal > clericLevels && clericLevels != 20) {
        ChatMessage.create({
            content: `Your call on your deity to intervene on your behalf was <b>unsuccessful</b>.`,
            speaker: { actor: workflow.actor }
        });
        return;
    }
    else if (workflow.damageTotal <= clericLevels || clericLevels === 20) {
        let animationLight = "jb2a.markers.light.loop.yellow02";
        let animationParticles = "jb2a.particles.outward.orange.01.03";
        switch (subClassIdentifier) {
            case 'death-domain':
                animationLight = "jb2a.markers.light.loop.green";
                animationParticles = "jb2a.particles.outward.greenyellow.01.03";
                break;
            case 'forge-domain':
                animationLight = "jb2a.markers.light.loop.red";
                animationParticles = "jb2a.particles.outward.red.01.03";
                break;
            case 'light-domain':
                animationLight = "jb2a.markers.light.loop.yellow02";
                animationParticles = "jb2a.particles.outward.orange.01.03";
                break;
            case 'nature-domain':
                animationLight = "jb2a.markers.light.loop.green02";
                animationParticles = "jb2a.particles.outward.greenyellow.01.03";
                break;
            case 'order-domain':
                animationLight = "jb2a.markers.light.loop.purple";
                animationParticles = "jb2a.particles.outward.purple.01.03";
                break;
            case 'tempest-domain':
                animationLight = "jb2a.markers.light.loop.blue02";
                animationParticles = "jb2a.particles.outward.blue.01.03";
                break;
            case 'trickery-domain':
                animationLight = "jb2a.markers.light.loop.green";
                animationParticles = "jb2a.particles.outward.greenyellow.01.03";
                break;
            case 'war-domain':
                animationLight = "jb2a.markers.light.loop.red02";
                animationParticles = "jb2a.particles.outward.orange.01.03";
                break;
        }
        ChatMessage.create({
            content: `Your call on your deity to intervene on your behalf <b>was successful</b>!`,
            speaker: { actor: workflow.actor }
        });
        new Sequence()

            .effect()
            .file(canvas.scene.background.src)
            .atLocation({ x: (canvas.dimensions.width) / 2, y: (canvas.dimensions.height) / 2 })
            .size({ width: canvas.scene.width / canvas.grid.size, height: canvas.scene.height / canvas.grid.size }, { gridUnits: true })
            .duration(7000)
            .fadeIn(500)
            .fadeOut(1000)
            .filter("ColorMatrix", { brightness: 1.5 })
            .spriteOffset({ x: -0 }, { gridUnits: true })
            .belowTokens()

            .effect()
            .file(animationParticles)
            .attachTo(token, { offset: { y: 0.1 }, gridUnits: true, followRotation: false })
            .size(0.5 * token.document.width, { gridUnits: true })
            .duration(1000)
            .fadeOut(800)
            .scaleIn(0, 1000, { ease: "easeOutCubic" })
            .animateProperty("sprite", "width", { from: 0, to: 0.25, duration: 500, gridUnits: true, ease: "easeOutBack" })
            .animateProperty("sprite", "height", { from: 0, to: 1.0, duration: 1000, gridUnits: true, ease: "easeOutBack" })
            .animateProperty("sprite", "position.y", { from: 0, to: -0.6, duration: 1000, gridUnits: true })
            .filter("ColorMatrix", { saturate: 1, hue: 30 })
            .zIndex(0.3)

            .effect()
            .file(animationLight)
            .attachTo(token, { offset: { y: 0 }, gridUnits: true, followRotation: true })
            .size(10, { gridUnits: true })
            .duration(10000)
            .scaleIn(0, 250, { ease: "easeOutBack" })
            .scaleOut(0, 3500, { ease: "easeInSine" })
            .randomRotation()
            .belowTokens()
            .zIndex(1)

            .effect()
            .file("jb2a.extras.tmfx.outflow.circle.02")
            .attachTo(token, { offset: { y: 0 }, gridUnits: true, followRotation: true })
            .size(13, { gridUnits: true })
            .duration(10000)
            .scaleIn(0, 250, { ease: "easeOutBack" })
            .scaleOut(0, 3500, { ease: "easeInSine" })
            .opacity(0.65)
            .filter("ColorMatrix", { brightness: 1 })
            .belowTokens()
            .zIndex(0.2)

            .effect()
            .file("jb2a.extras.tmfx.outflow.circle.01")
            .attachTo(token, { offset: { y: 0 }, gridUnits: true, followRotation: true })
            .size(13, { gridUnits: true })
            .duration(10000)
            .scaleIn(0, 250, { ease: "easeOutBack" })
            .scaleOut(0, 3500, { ease: "easeInSine" })
            .opacity(0.7)
            .filter("ColorMatrix", { brightness: 1 })
            .rotate(90)
            .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 20000 })
            .belowTokens()
            .zIndex(0.3)

            .play()
    }
}