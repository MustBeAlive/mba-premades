import {mba} from "../../../helperFunctions.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Spell Features', 'Detect Evil and Good: Ping', false);
    if (!featureData) return;
    delete featureData._id;
    async function effectMacroDel() {
        await Sequencer.EffectManager.endEffects({ name: `${token.document.name} Detect Evil and Good` })
        await warpgate.revert(token.document, 'Detect Evil and Good: Ping');
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>For the duration, you know if there is an aberration, celestial, elemental, fey, fiend, or undead within 30 feet of you, as well as where the creature is located.</p>
            <p>Similarly, you know if there is a place or object within 30 feet of you that has been magically consecrated or desecrated.</p>
            <p>The spell can penetrate most barriers, but it is blocked by 1 foot of stone, 1 inch of common metal, a thin sheet of lead, or 3 feet of wood or dirt.</p>
            <p><b>Aberration</b>: Purple</p>
            <p><b>Celestial</b>: Yellow</p>
            <p><b>Elemental</b>: Blue</p>
            <p><b>Fey</b>: Green</p>
            <p><b>Fiend</b>: Red</p>
            <p><b>Undead</b>: Black</p>
        `,
        'duration': {
            'seconds': 600
        },
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 1,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    let updates = {
        'embedded': {
            'Item': {
                [featureData.name]: featureData
            },
            'ActiveEffect': {
                [workflow.item.name]: effectData
            }
        }
    };
    let options = {
        'permanent': false,
        'name': featureData.name,
        'description': featureData.name
    };
    await warpgate.mutate(workflow.token.document, updates, {}, options);

    const aoeDistance = 30;
    const captureArea = {
        x: token.x + (canvas.grid.size * token.document.width) / 2,
        y: token.y + (canvas.grid.size * token.document.width) / 2,
        scene: canvas.scene,
        radius: aoeDistance / canvas.scene.grid.distance * canvas.grid.size
    };
    const containedTokens = warpgate.crosshairs.collect(captureArea, 'Token')
    let targets = Array.from(containedTokens);

    new Sequence()

        .effect()
        .file("jb2a.detect_magic.circle.grey")
        .atLocation(token)
        .size(12.5, { gridUnits: true })
        .fadeOut(4000)
        .opacity(0.75)
        .belowTokens()

        .effect()
        .delay(1500)
        .file("jb2a.token_border.circle.spinning.blue.001")
        .attachTo(token)
        .scaleIn(0, 4000, { ease: "easeOutCubic" })
        .scaleToObject(2)
        .filter("ColorMatrix", { saturate: -1, brightness: 1 })
        .fadeOut(1000)
        .persist()
        .name(`${token.document.name} Detect Evil and Good`)

        .play()

    targets.forEach(target => {
        if (target.name !== token.name) {
            const distance = Math.sqrt(
                Math.pow(target.x - token.x, 2) + Math.pow(target.y - token.y, 2)
            );
            const gridDistance = distance / canvas.grid.size

            new Sequence()

                .effect()
                .file("jb2a.markers.circle_of_stars.green")
                .atLocation(target)
                .scaleToObject(2.5)
                .delay(gridDistance * 125)
                .duration(5000)
                .fadeIn(1000)
                .fadeOut(1000)
                .filter("ColorMatrix", { saturate: -1, brightness: 0.8 })
                .mask(target)

                .wait(500)

                //Aberration Effect
                .effect()
                .delay(gridDistance * 125)
                .from(target)
                .belowTokens()
                .attachTo(target, { locale: true })
                .scaleToObject(1, { considerTokenScale: true })
                .spriteRotation(target.rotation * -1)
                .filter("Glow", { color: 0xab00ad, distance: 20 })
                .duration(17500)
                .fadeIn(1000, { delay: 1000 })
                .fadeOut(3500, { ease: "easeInSine" })
                .opacity(0.75)
                .zIndex(0.1)
                .loopProperty("alphaFilter", "alpha", { values: [0.75, 0.1], duration: 1500, pingPong: true, delay: 500 })
                .playIf(() => {
                    if (mba.findEffect(target.actor, "Nondetection")) return false;
                    return target.actor.system.details.type.value == "aberration";
                })

                .effect()
                .delay(gridDistance * 125)
                .file("jb2a.extras.tmfx.outflow.circle.01")
                .attachTo(target, { locale: true })
                .scaleToObject(1.5, { considerTokenScale: false })
                .randomRotation()
                .duration(17500)
                .fadeIn(4000, { delay: 0 })
                .fadeOut(3500, { ease: "easeInSine" })
                .scaleIn(0, 3500, { ease: "easeInOutCubic" })
                .tint(0xab00ad)
                .opacity(0.75)
                .belowTokens()
                .playIf(() => {
                    if (mba.findEffect(target.actor, "Nondetection")) return false;
                    return target.actor.system.details.type.value == "aberration";
                })

                //Celestial Effect
                .effect()
                .delay(gridDistance * 125)
                .from(target)
                .belowTokens()
                .attachTo(target, { locale: true })
                .scaleToObject(1, { considerTokenScale: true })
                .spriteRotation(target.rotation * -1)
                .filter("Glow", { color: 0xffd000, distance: 20 })
                .duration(17500)
                .fadeIn(1000, { delay: 1000 })
                .fadeOut(3500, { ease: "easeInSine" })
                .opacity(0.75)
                .zIndex(0.1)
                .loopProperty("alphaFilter", "alpha", { values: [0.75, 0.1], duration: 1500, pingPong: true, delay: 500 })
                .playIf(() => {
                    if (mba.findEffect(target.actor, "Nondetection")) return false;
                    return target.actor.system.details.type.value == "celestial";
                })

                .effect()
                .delay(gridDistance * 125)
                .file("jb2a.extras.tmfx.outflow.circle.01")
                .attachTo(target, { locale: true })
                .scaleToObject(1.5, { considerTokenScale: false })
                .randomRotation()
                .duration(17500)
                .fadeIn(4000, { delay: 0 })
                .fadeOut(3500, { ease: "easeInSine" })
                .scaleIn(0, 3500, { ease: "easeInOutCubic" })
                .tint(0xf3d877)
                .opacity(0.75)
                .belowTokens()
                .playIf(() => {
                    if (mba.findEffect(target.actor, "Nondetection")) return false;
                    return target.actor.system.details.type.value == "celestial";
                })

                //Elemental Effect
                .effect()
                .delay(gridDistance * 125)
                .from(target)
                .belowTokens()
                .attachTo(target, { locale: true })
                .scaleToObject(1, { considerTokenScale: true })
                .spriteRotation(target.rotation * -1)
                .filter("Glow", { color: 0x008ae0, distance: 20 })
                .duration(17500)
                .fadeIn(1000, { delay: 1000 })
                .fadeOut(3500, { ease: "easeInSine" })
                .opacity(0.75)
                .zIndex(0.1)
                .loopProperty("alphaFilter", "alpha", { values: [0.75, 0.1], duration: 1500, pingPong: true, delay: 500 })
                .playIf(() => {
                    if (mba.findEffect(target.actor, "Nondetection")) return false;
                    return target.actor.system.details.type.value == "elemental";
                })

                .effect()
                .delay(gridDistance * 125)
                .file("jb2a.extras.tmfx.outflow.circle.01")
                .attachTo(target, { locale: true })
                .scaleToObject(1.5, { considerTokenScale: false })
                .randomRotation()
                .duration(17500)
                .fadeIn(4000, { delay: 0 })
                .fadeOut(3500, { ease: "easeInSine" })
                .scaleIn(0, 3500, { ease: "easeInOutCubic" })
                .tint(0x008ae0)
                .opacity(0.75)
                .belowTokens()
                .playIf(() => {
                    if (mba.findEffect(target.actor, "Nondetection")) return false;
                    return target.actor.system.details.type.value == "elemental";
                })

                //Fey Effect
                .effect()
                .delay(gridDistance * 125)
                .from(target)
                .belowTokens()
                .attachTo(target, { locale: true })
                .scaleToObject(1, { considerTokenScale: true })
                .spriteRotation(target.rotation * -1)
                .filter("Glow", { color: 0x00bd16, distance: 20 })
                .duration(17500)
                .fadeIn(1000, { delay: 1000 })
                .fadeOut(3500, { ease: "easeInSine" })
                .opacity(0.75)
                .zIndex(0.1)
                .loopProperty("alphaFilter", "alpha", { values: [0.75, 0.1], duration: 1500, pingPong: true, delay: 500 })
                .playIf(() => {
                    if (mba.findEffect(target.actor, "Nondetection")) return false;
                    return target.actor.system.details.type.value == "fey";
                })

                .effect()
                .delay(gridDistance * 125)
                .file("jb2a.extras.tmfx.outflow.circle.01")
                .attachTo(target, { locale: true })
                .scaleToObject(1.5, { considerTokenScale: false })
                .randomRotation()
                .duration(17500)
                .fadeIn(4000, { delay: 0 })
                .fadeOut(3500, { ease: "easeInSine" })
                .scaleIn(0, 3500, { ease: "easeInOutCubic" })
                .tint(0x00bd16)
                .opacity(0.75)
                .belowTokens()
                .playIf(() => {
                    if (mba.findEffect(target.actor, "Nondetection")) return false;
                    return target.actor.system.details.type.value == "fey";
                })

                //Fiend Effect
                .effect()
                .delay(gridDistance * 125)
                .from(target)
                .belowTokens()
                .attachTo(target, { locale: true })
                .scaleToObject(1, { considerTokenScale: true })
                .spriteRotation(target.rotation * -1)
                .filter("Glow", { color: 0x911a1a, distance: 20 })
                .duration(17500)
                .fadeIn(1000, { delay: 1000 })
                .fadeOut(3500, { ease: "easeInSine" })
                .opacity(0.75)
                .zIndex(0.1)
                .loopProperty("alphaFilter", "alpha", { values: [0.75, 0.1], duration: 1500, pingPong: true, delay: 500 })
                .playIf(() => {
                    if (mba.findEffect(target.actor, "Nondetection")) return false;
                    return target.actor.system.details.type.value == "fiend";
                })

                .effect()
                .delay(gridDistance * 125)
                .file("jb2a.extras.tmfx.outflow.circle.01")
                .attachTo(target, { locale: true })
                .scaleToObject(1.5, { considerTokenScale: false })
                .randomRotation()
                .duration(17500)
                .fadeIn(4000, { delay: 0 })
                .fadeOut(3500, { ease: "easeInSine" })
                .scaleIn(0, 3500, { ease: "easeInOutCubic" })
                .tint(0x870101)
                .opacity(0.75)
                .belowTokens()
                .playIf(() => {
                    if (mba.findEffect(target.actor, "Nondetection")) return false;
                    return target.actor.system.details.type.value == "fiend";
                })

                //Undead Effect
                .effect()
                .delay(gridDistance * 125)
                .from(target)
                .belowTokens()
                .attachTo(target, { locale: true })
                .scaleToObject(1, { considerTokenScale: true })
                .spriteRotation(target.rotation * -1)
                .filter("Glow", { color: 0x111111, distance: 20 })
                .duration(17500)
                .fadeIn(1000, { delay: 1000 })
                .fadeOut(3500, { ease: "easeInSine" })
                .opacity(0.9)
                .zIndex(0.1)
                .loopProperty("alphaFilter", "alpha", { values: [0.9, 0.1], duration: 1500, pingPong: true, delay: 500 })
                .playIf(() => {
                    if (mba.findEffect(target.actor, "Nondetection")) return false;
                    return target.actor.system.details.type.value == "undead";
                })

                .effect()
                .delay(gridDistance * 125)
                .file("jb2a.extras.tmfx.outflow.circle.01")
                .attachTo(target, { locale: true })
                .scaleToObject(1.5, { considerTokenScale: false })
                .randomRotation()
                .duration(17500)
                .fadeIn(4000, { delay: 0 })
                .fadeOut(3500, { ease: "easeInSine" })
                .scaleIn(0, 3500, { ease: "easeInOutCubic" })
                .tint(0x121212)
                .opacity(0.75)
                .belowTokens()
                .playIf(() => {
                    if (mba.findEffect(target.actor, "Nondetection")) return false;
                    return target.actor.system.details.type.value == "undead";
                })

                .play()
        }
    })
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    const aoeDistance = 30;
    const captureArea = {
        x: token.x + (canvas.grid.size * token.document.width) / 2,
        y: token.y + (canvas.grid.size * token.document.width) / 2,
        scene: canvas.scene,
        radius: aoeDistance / canvas.scene.grid.distance * canvas.grid.size
    };
    const containedTokens = warpgate.crosshairs.collect(captureArea, 'Token')
    let targets = Array.from(containedTokens);

    new Sequence()

        .effect()
        .file("jb2a.detect_magic.circle.grey")
        .atLocation(token)
        .size(12.5, { gridUnits: true })
        .fadeOut(4000)
        .opacity(0.75)
        .belowTokens()

        .play()

    targets.forEach(target => {
        if (target.name !== token.name) {
            const distance = Math.sqrt(
                Math.pow(target.x - token.x, 2) + Math.pow(target.y - token.y, 2)
            );
            const gridDistance = distance / canvas.grid.size

            new Sequence()

                .effect()
                .file("jb2a.markers.circle_of_stars.green")
                .atLocation(target)
                .scaleToObject(2.5)
                .delay(gridDistance * 125)
                .duration(5000)
                .fadeIn(1000)
                .fadeOut(1000)
                .filter("ColorMatrix", { saturate: -1, brightness: 0.8 })
                .mask(target)

                .wait(500)

                //Aberration Effect
                .effect()
                .delay(gridDistance * 125)
                .from(target)
                .belowTokens()
                .attachTo(target, { locale: true })
                .scaleToObject(1, { considerTokenScale: true })
                .spriteRotation(target.rotation * -1)
                .filter("Glow", { color: 0xab00ad, distance: 20 })
                .duration(17500)
                .fadeIn(1000, { delay: 1000 })
                .fadeOut(3500, { ease: "easeInSine" })
                .opacity(0.75)
                .zIndex(0.1)
                .loopProperty("alphaFilter", "alpha", { values: [0.75, 0.1], duration: 1500, pingPong: true, delay: 500 })
                .playIf(() => {
                    if (mba.findEffect(target.actor, "Nondetection")) return false;
                    return target.actor.system.details.type.value == "aberration";
                })

                .effect()
                .delay(gridDistance * 125)
                .file("jb2a.extras.tmfx.outflow.circle.01")
                .attachTo(target, { locale: true })
                .scaleToObject(1.5, { considerTokenScale: false })
                .randomRotation()
                .duration(17500)
                .fadeIn(4000, { delay: 0 })
                .fadeOut(3500, { ease: "easeInSine" })
                .scaleIn(0, 3500, { ease: "easeInOutCubic" })
                .tint(0xab00ad)
                .opacity(0.75)
                .belowTokens()
                .playIf(() => {
                    if (mba.findEffect(target.actor, "Nondetection")) return false;
                    return target.actor.system.details.type.value == "aberration";
                })

                //Celestial Effect
                .effect()
                .delay(gridDistance * 125)
                .from(target)
                .belowTokens()
                .attachTo(target, { locale: true })
                .scaleToObject(1, { considerTokenScale: true })
                .spriteRotation(target.rotation * -1)
                .filter("Glow", { color: 0xffd000, distance: 20 })
                .duration(17500)
                .fadeIn(1000, { delay: 1000 })
                .fadeOut(3500, { ease: "easeInSine" })
                .opacity(0.75)
                .zIndex(0.1)
                .loopProperty("alphaFilter", "alpha", { values: [0.75, 0.1], duration: 1500, pingPong: true, delay: 500 })
                .playIf(() => {
                    if (mba.findEffect(target.actor, "Nondetection")) return false;
                    return target.actor.system.details.type.value == "celestial";
                })

                .effect()
                .delay(gridDistance * 125)
                .file("jb2a.extras.tmfx.outflow.circle.01")
                .attachTo(target, { locale: true })
                .scaleToObject(1.5, { considerTokenScale: false })
                .randomRotation()
                .duration(17500)
                .fadeIn(4000, { delay: 0 })
                .fadeOut(3500, { ease: "easeInSine" })
                .scaleIn(0, 3500, { ease: "easeInOutCubic" })
                .tint(0xf3d877)
                .opacity(0.75)
                .belowTokens()
                .playIf(() => {
                    if (mba.findEffect(target.actor, "Nondetection")) return false;
                    return target.actor.system.details.type.value == "celestial";
                })

                //Elemental Effect
                .effect()
                .delay(gridDistance * 125)
                .from(target)
                .belowTokens()
                .attachTo(target, { locale: true })
                .scaleToObject(1, { considerTokenScale: true })
                .spriteRotation(target.rotation * -1)
                .filter("Glow", { color: 0x008ae0, distance: 20 })
                .duration(17500)
                .fadeIn(1000, { delay: 1000 })
                .fadeOut(3500, { ease: "easeInSine" })
                .opacity(0.75)
                .zIndex(0.1)
                .loopProperty("alphaFilter", "alpha", { values: [0.75, 0.1], duration: 1500, pingPong: true, delay: 500 })
                .playIf(() => {
                    if (mba.findEffect(target.actor, "Nondetection")) return false;
                    return target.actor.system.details.type.value == "elemental";
                })

                .effect()
                .delay(gridDistance * 125)
                .file("jb2a.extras.tmfx.outflow.circle.01")
                .attachTo(target, { locale: true })
                .scaleToObject(1.5, { considerTokenScale: false })
                .randomRotation()
                .duration(17500)
                .fadeIn(4000, { delay: 0 })
                .fadeOut(3500, { ease: "easeInSine" })
                .scaleIn(0, 3500, { ease: "easeInOutCubic" })
                .tint(0x008ae0)
                .opacity(0.75)
                .belowTokens()
                .playIf(() => {
                    if (mba.findEffect(target.actor, "Nondetection")) return false;
                    return target.actor.system.details.type.value == "elemental";
                })

                //Fey Effect
                .effect()
                .delay(gridDistance * 125)
                .from(target)
                .belowTokens()
                .attachTo(target, { locale: true })
                .scaleToObject(1, { considerTokenScale: true })
                .spriteRotation(target.rotation * -1)
                .filter("Glow", { color: 0x00bd16, distance: 20 })
                .duration(17500)
                .fadeIn(1000, { delay: 1000 })
                .fadeOut(3500, { ease: "easeInSine" })
                .opacity(0.75)
                .zIndex(0.1)
                .loopProperty("alphaFilter", "alpha", { values: [0.75, 0.1], duration: 1500, pingPong: true, delay: 500 })
                .playIf(() => {
                    if (mba.findEffect(target.actor, "Nondetection")) return false;
                    return target.actor.system.details.type.value == "fey";
                })

                .effect()
                .delay(gridDistance * 125)
                .file("jb2a.extras.tmfx.outflow.circle.01")
                .attachTo(target, { locale: true })
                .scaleToObject(1.5, { considerTokenScale: false })
                .randomRotation()
                .duration(17500)
                .fadeIn(4000, { delay: 0 })
                .fadeOut(3500, { ease: "easeInSine" })
                .scaleIn(0, 3500, { ease: "easeInOutCubic" })
                .tint(0x00bd16)
                .opacity(0.75)
                .belowTokens()
                .playIf(() => {
                    if (mba.findEffect(target.actor, "Nondetection")) return false;
                    return target.actor.system.details.type.value == "fey";
                })

                //Fiend Effect
                .effect()
                .delay(gridDistance * 125)
                .from(target)
                .belowTokens()
                .attachTo(target, { locale: true })
                .scaleToObject(1, { considerTokenScale: true })
                .spriteRotation(target.rotation * -1)
                .filter("Glow", { color: 0x911a1a, distance: 20 })
                .duration(17500)
                .fadeIn(1000, { delay: 1000 })
                .fadeOut(3500, { ease: "easeInSine" })
                .opacity(0.75)
                .zIndex(0.1)
                .loopProperty("alphaFilter", "alpha", { values: [0.75, 0.1], duration: 1500, pingPong: true, delay: 500 })
                .playIf(() => {
                    if (mba.findEffect(target.actor, "Nondetection")) return false;
                    return target.actor.system.details.type.value == "fiend";
                })

                .effect()
                .delay(gridDistance * 125)
                .file("jb2a.extras.tmfx.outflow.circle.01")
                .attachTo(target, { locale: true })
                .scaleToObject(1.5, { considerTokenScale: false })
                .randomRotation()
                .duration(17500)
                .fadeIn(4000, { delay: 0 })
                .fadeOut(3500, { ease: "easeInSine" })
                .scaleIn(0, 3500, { ease: "easeInOutCubic" })
                .tint(0x870101)
                .opacity(0.75)
                .belowTokens()
                .playIf(() => {
                    if (mba.findEffect(target.actor, "Nondetection")) return false;
                    return target.actor.system.details.type.value == "fiend";
                })

                //Undead Effect
                .effect()
                .delay(gridDistance * 125)
                .from(target)
                .belowTokens()
                .attachTo(target, { locale: true })
                .scaleToObject(1, { considerTokenScale: true })
                .spriteRotation(target.rotation * -1)
                .filter("Glow", { color: 0x111111, distance: 20 })
                .duration(17500)
                .fadeIn(1000, { delay: 1000 })
                .fadeOut(3500, { ease: "easeInSine" })
                .opacity(0.9)
                .zIndex(0.1)
                .loopProperty("alphaFilter", "alpha", { values: [0.9, 0.1], duration: 1500, pingPong: true, delay: 500 })
                .playIf(() => {
                    if (mba.findEffect(target.actor, "Nondetection")) return false;
                    return target.actor.system.details.type.value == "undead";
                })

                .effect()
                .delay(gridDistance * 125)
                .file("jb2a.extras.tmfx.outflow.circle.01")
                .attachTo(target, { locale: true })
                .scaleToObject(1.5, { considerTokenScale: false })
                .randomRotation()
                .duration(17500)
                .fadeIn(4000, { delay: 0 })
                .fadeOut(3500, { ease: "easeInSine" })
                .scaleIn(0, 3500, { ease: "easeInOutCubic" })
                .tint(0x121212)
                .opacity(0.75)
                .belowTokens()
                .playIf(() => {
                    if (mba.findEffect(target.actor, "Nondetection")) return false;
                    return target.actor.system.details.type.value == "undead";
                })

                .play()
        }
    })
}

export let detectEvilAndGood = {
    'cast': cast,
    'item': item
}