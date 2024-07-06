import {mba} from "../../../helperFunctions.js";

export async function divineSense({ speaker, actor, token, character, item, args, scope, workflow }) {
    //not behind total cover
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `Divine Sense` })
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Until the end of your next turn, you know the location of any celestial, fiend, or undead within 60 feet of you that is not behind total cover.</p>
            <p>You know the type (celestial, fiend, or undead) of any being whose presence you sense, but not its identity (the vampire Count Strahd von Zarovich, for instance).</p>
            <p>Within the same radius, you also detect the presence of any place or object that has been consecrated or desecrated, as with the hallow spell.</p>
            <p><b>Celestial</b>: Yellow</p>
            <p><b>Fiend</b>: Red</p>
            <p><b>Undead</b>: Black</p>
        `,
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['turnEnd']
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };

    const aoeDistance = 60;
    const captureArea = {
        x: workflow.token.x + (canvas.grid.size * workflow.token.document.width) / 2,
        y: workflow.token.y + (canvas.grid.size * workflow.token.document.width) / 2,
        scene: canvas.scene,
        radius: aoeDistance / canvas.scene.grid.distance * canvas.grid.size
    };
    const containedTokens = warpgate.crosshairs.collect(captureArea, 'Token')
    let targets = Array.from(containedTokens);

    new Sequence()

        .effect()
        .file("jb2a.detect_magic.circle.yellow")
        .atLocation(workflow.token)
        .size(16, { gridUnits: true })
        .fadeOut(4000)
        .opacity(0.75)
        .belowTokens()

        .effect()
        .file("jb2a.token_border.circle.spinning.blue.001")
        .attachTo(workflow.token)
        .scaleToObject(2)
        .delay(1500)
        .scaleIn(0, 4000, { ease: "easeOutCubic" })
        .filter("ColorMatrix", { hue: 200 })
        .fadeOut(1000)
        .persist()
        .name(`Divine Sense`)

        .thenDo(async () => {
            await mba.createEffect(workflow.actor, effectData);
        })

        .play()

    for (let target of targets) {
        if (target.name === workflow.token.document.name) continue;
        const distance = Math.sqrt(Math.pow(target.x - workflow.token.x, 2) + Math.pow(target.y - workflow.token.y, 2));
        const gridDistance = distance / canvas.grid.size
        let [canSee] = await mba.findNearby(target, 60, "any", false, false, true, false).filter(t => t.document.uuid === workflow.token.document.uuid);
        let type = await mba.raceOrType(target.actor);
        let nystul = await mba.findEffect(target.actor, "Nystul's Magic Aura");
        if (nystul) type = nystul.flags['mba-premades']?.spell?.nystulMagicAura?.type;
        let nondetection = target.actor.flags['mba-premades']?.spell?.nondetection;

        new Sequence()

            .effect()
            .file("jb2a.markers.circle_of_stars.green")
            .attachTo(target)
            .scaleToObject(2.5)
            .delay(gridDistance * canvas.grid.size)
            .duration(5000)
            .fadeIn(1000)
            .fadeOut(1000)
            .filter("ColorMatrix", { saturate: -1, brightness: 0.8 })
            .mask(target)

            .wait(500)

            //Celestial Effect
            .effect()
            .from(target)
            .attachTo(target, { locale: true })
            .scaleToObject(1, { considerTokenScale: true })
            .delay(gridDistance * canvas.grid.size)
            .fadeIn(1000, { delay: 1000 })
            .fadeOut(3500, { ease: "easeInSine" })
            .spriteRotation(target.rotation * -1)
            .loopProperty("alphaFilter", "alpha", { values: [0.1, 0.8], duration: 1500, pingPong: true, delay: 500 })
            .filter("Glow", { color: 0xffd000, distance: 10 })
            .opacity(0.75)
            .belowTokens()
            .zIndex(0.1)
            .persist()
            .name(`Divine Sense`)
            .playIf(() => {
                if (nondetection || !canSee) return false;
                return type === "celestial";
            })

            .effect()
            .file("jb2a.extras.tmfx.outflow.circle.01")
            .attachTo(target, { locale: true })
            .scaleToObject(1.5, { considerTokenScale: false })
            .delay(gridDistance * canvas.grid.size)
            .fadeIn(4000, { delay: 0 })
            .fadeOut(3500, { ease: "easeInSine" })
            .scaleIn(0, 3500, { ease: "easeInOutCubic" })
            .tint(0xf3d877)
            .randomRotation()
            .opacity(0.75)
            .belowTokens()
            .persist()
            .name(`Divine Sense`)
            .playIf(() => {
                if (nondetection || !canSee) return false;
                return type === "celestial";
            })

            //Fiend Effect
            .effect()
            .from(target)
            .attachTo(target, { locale: true })
            .scaleToObject(1, { considerTokenScale: true })
            .delay(gridDistance * canvas.grid.size)
            .fadeIn(1000, { delay: 1000 })
            .fadeOut(3500, { ease: "easeInSine" })
            .spriteRotation(target.rotation * -1)
            .loopProperty("alphaFilter", "alpha", { values: [0.1, 0.8], duration: 1500, pingPong: true, delay: 500 })
            .filter("Glow", { color: 0x911a1a, distance: 10 })
            .belowTokens()
            .opacity(0.75)
            .zIndex(0.1)
            .persist()
            .name(`Divine Sense`)
            .playIf(() => {
                if (nondetection || !canSee) return false;
                return type === "fiend";
            })

            .effect()
            .file("jb2a.extras.tmfx.outflow.circle.01")
            .attachTo(target, { locale: true })
            .scaleToObject(1.5, { considerTokenScale: false })
            .delay(gridDistance * canvas.grid.size)
            .fadeIn(4000, { delay: 0 })
            .fadeOut(3500, { ease: "easeInSine" })
            .scaleIn(0, 3500, { ease: "easeInOutCubic" })
            .randomRotation()
            .tint(0x870101)
            .opacity(0.75)
            .belowTokens()
            .persist()
            .name(`Divine Sense`)
            .playIf(() => {
                if (nondetection || !canSee) return false;
                return type === "fiend";
            })

            //Undead Effect
            .effect()
            .from(target)
            .belowTokens()
            .attachTo(target, { locale: true })
            .scaleToObject(1, { considerTokenScale: true })
            .delay(gridDistance * canvas.grid.size)
            .fadeIn(1000, { delay: 1000 })
            .fadeOut(3500, { ease: "easeInSine" })
            .spriteRotation(target.rotation * -1)
            .loopProperty("alphaFilter", "alpha", { values: [0.1, 0.9], duration: 1500, pingPong: true, delay: 500 })
            .filter("Glow", { color: 0x111111, distance: 10 })
            .opacity(0.9)
            .zIndex(0.1)
            .persist()
            .name(`Divine Sense`)
            .playIf(() => {
                if (nondetection || !canSee) return false;
                return type === "undead";
            })

            .effect()
            .file("jb2a.extras.tmfx.outflow.circle.01")
            .attachTo(target, { locale: true })
            .scaleToObject(1.5, { considerTokenScale: false })
            .delay(gridDistance * canvas.grid.size)
            .fadeIn(4000, { delay: 0 })
            .fadeOut(3500, { ease: "easeInSine" })
            .scaleIn(0, 3500, { ease: "easeInOutCubic" })
            .randomRotation()
            .tint(0x121212)
            .opacity(0.75)
            .belowTokens()
            .persist()
            .name(`Divine Sense`)
            .playIf(() => {
                if (nondetection || !canSee) return false;
                return type === "undead";
            })

            .play()
    }
}