import { constants } from "../../generic/constants.js";
import { mba } from "../../../helperFunctions.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Detect Evil and Good: Ping", false);
    if (!featureData) return;
    delete featureData._id;
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} DeEaG` })
        await warpgate.revert(token.document, "Detect Evil and Good");
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
        'name': "Detect Evil and Good",
        'description': "Detect Evil and Good",
    };
    new Sequence()

        .effect()
        .file("jb2a.token_border.circle.spinning.blue.001")
        .attachTo(workflow.token)
        .scaleToObject(2)
        .delay(1500)
        .fadeOut(1000)
        .scaleIn(0, 4000, { ease: "easeOutCubic" })
        .filter("ColorMatrix", { saturate: -1 })
        .persist()
        .name(`${token.document.name} DeEaG`)

        .thenDo(async () => {
            await warpgate.mutate(workflow.token.document, updates, {}, options);
            let feature = await mba.getItem(workflow.actor, "Detect Evil and Good: Ping");
            if (!feature) return;
            let [config, options2] = constants.syntheticItemWorkflowOptions([workflow.token.document.uuid]);
            await MidiQOL.completeItemUse(feature, config, options2);
        })

        .play()
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    const aoeDistance = 30;
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
        .file("jb2a.detect_magic.circle.grey")
        .atLocation(workflow.token)
        .size(12.5, { gridUnits: true })
        .fadeOut(4000)
        .opacity(0.75)
        .belowTokens()

        .play()

    for (let target of targets) {
        if (target.uuid === workflow.token.document.uuid) continue;
        const distance = Math.sqrt(Math.pow(target.x - workflow.token.x, 2) + Math.pow(target.y - workflow.token.y, 2));
        const gridDistance = distance / canvas.grid.size;
        let type = await mba.raceOrType(target.actor);
        let nystul = await mba.findEffect(target.actor, "Nystul's Magic Aura");
        if (nystul) type = nystul.flags['mba-premades']?.spell?.nystulMagicAura?.type;
        let nondetection = target.actor.flags['mba-premades']?.spell?.nondetection;

        new Sequence()

            .effect()
            .file("jb2a.markers.circle_of_stars.green")
            .atLocation(target)
            .scaleToObject(2.5)
            .delay(gridDistance * canvas.grid.size)
            .duration(5000)
            .fadeIn(1000)
            .fadeOut(1000)
            .filter("ColorMatrix", { saturate: -1, brightness: 0.8 })
            .mask(target)

            .wait(500)

            //Aberration Effect
            .effect()
            .from(target)
            .attachTo(target, { locale: true })
            .scaleToObject(1, { considerTokenScale: true })
            .delay(gridDistance * canvas.grid.size)
            .duration(17500)
            .fadeIn(1000, { delay: 1000 })
            .fadeOut(3500, { ease: "easeInSine" })
            .loopProperty("alphaFilter", "alpha", { values: [0.1, 0.75], duration: 1500, pingPong: true, delay: 500 })
            .spriteRotation(target.rotation * -1)
            .belowTokens()
            .opacity(0.75)
            .zIndex(0.1)
            .filter("Glow", { color: 0xab00ad, distance: 10 })
            .playIf(() => {
                if (nondetection) return false;
                return type === "aberration";
            })

            .effect()
            .file("jb2a.extras.tmfx.outflow.circle.01")
            .attachTo(target, { locale: true })
            .scaleToObject(1.5, { considerTokenScale: false })
            .delay(gridDistance * canvas.grid.size)
            .duration(17500)
            .fadeIn(4000, { delay: 0 })
            .fadeOut(3500, { ease: "easeInSine" })
            .scaleIn(0, 3500, { ease: "easeInOutCubic" })
            .randomRotation()
            .belowTokens()
            .opacity(0.75)
            .tint(0xab00ad)
            .playIf(() => {
                if (nondetection) return false;
                return type === "aberration";
            })

            //Celestial Effect
            .effect()
            .from(target)
            .attachTo(target, { locale: true })
            .scaleToObject(1, { considerTokenScale: true })
            .delay(gridDistance * canvas.grid.size)
            .duration(17500)
            .fadeIn(1000, { delay: 1000 })
            .fadeOut(3500, { ease: "easeInSine" })
            .loopProperty("alphaFilter", "alpha", { values: [0.1, 0.75], duration: 1500, pingPong: true, delay: 500 })
            .spriteRotation(target.rotation * -1)
            .belowTokens()
            .opacity(0.75)
            .zIndex(0.1)
            .filter("Glow", { color: 0xffd000, distance: 10 })
            .playIf(() => {
                if (nondetection) return false;
                return type === "celestial";
            })

            .effect()
            .file("jb2a.extras.tmfx.outflow.circle.01")
            .attachTo(target, { locale: true })
            .scaleToObject(1.5, { considerTokenScale: false })
            .delay(gridDistance * canvas.grid.size)
            .duration(17500)
            .fadeIn(4000, { delay: 0 })
            .fadeOut(3500, { ease: "easeInSine" })
            .scaleIn(0, 3500, { ease: "easeInOutCubic" })
            .randomRotation()
            .belowTokens()
            .opacity(0.75)
            .tint(0xf3d877)
            .playIf(() => {
                if (nondetection) return false;
                return type === "celestial";
            })

            //Elemental Effect
            .effect()
            .from(target)
            .attachTo(target, { locale: true })
            .scaleToObject(1, { considerTokenScale: true })
            .delay(gridDistance * canvas.grid.size)
            .duration(17500)
            .fadeIn(1000, { delay: 1000 })
            .fadeOut(3500, { ease: "easeInSine" })
            .loopProperty("alphaFilter", "alpha", { values: [0.1, 0.75], duration: 1500, pingPong: true, delay: 500 })
            .spriteRotation(target.rotation * -1)
            .belowTokens()
            .opacity(0.75)
            .zIndex(0.1)
            .filter("Glow", { color: 0x008ae0, distance: 10 })
            .playIf(() => {
                if (nondetection) return false;
                return type === "elemental";
            })

            .effect()
            .file("jb2a.extras.tmfx.outflow.circle.01")
            .attachTo(target, { locale: true })
            .scaleToObject(1.5, { considerTokenScale: false })
            .delay(gridDistance * canvas.grid.size)
            .duration(17500)
            .fadeIn(4000, { delay: 0 })
            .fadeOut(3500, { ease: "easeInSine" })
            .scaleIn(0, 3500, { ease: "easeInOutCubic" })
            .randomRotation()
            .belowTokens()
            .opacity(0.75)
            .tint(0x008ae0)
            .playIf(() => {
                if (nondetection) return false;
                return type === "elemental";
            })

            //Fey Effect
            .effect()
            .from(target)
            .attachTo(target, { locale: true })
            .scaleToObject(1, { considerTokenScale: true })
            .delay(gridDistance * canvas.grid.size)
            .duration(17500)
            .fadeIn(1000, { delay: 1000 })
            .fadeOut(3500, { ease: "easeInSine" })
            .loopProperty("alphaFilter", "alpha", { values: [0.1, 0.75], duration: 1500, pingPong: true, delay: 500 })
            .spriteRotation(target.rotation * -1)
            .belowTokens()
            .opacity(0.75)
            .zIndex(0.1)
            .filter("Glow", { color: 0x00bd16, distance: 10 })
            .playIf(() => {
                if (nondetection) return false;
                return type === "fey";
            })

            .effect()
            .file("jb2a.extras.tmfx.outflow.circle.01")
            .attachTo(target, { locale: true })
            .scaleToObject(1.5, { considerTokenScale: false })
            .delay(gridDistance * canvas.grid.size)
            .duration(17500)
            .fadeIn(4000, { delay: 0 })
            .fadeOut(3500, { ease: "easeInSine" })
            .scaleIn(0, 3500, { ease: "easeInOutCubic" })
            .randomRotation()
            .belowTokens()
            .opacity(0.75)
            .tint(0x00bd16)
            .playIf(() => {
                if (nondetection) return false;
                return type === "fey";
            })

            //Fiend Effect
            .effect()
            .from(target)
            .attachTo(target, { locale: true })
            .scaleToObject(1, { considerTokenScale: true })
            .delay(gridDistance * canvas.grid.size)
            .duration(17500)
            .fadeIn(1000, { delay: 1000 })
            .fadeOut(3500, { ease: "easeInSine" })
            .loopProperty("alphaFilter", "alpha", { values: [0.1, 0.75], duration: 1500, pingPong: true, delay: 500 })
            .spriteRotation(target.rotation * -1)
            .belowTokens()
            .opacity(0.75)
            .zIndex(0.1)
            .filter("Glow", { color: 0x911a1a, distance: 10 })
            .playIf(() => {
                if (nondetection) return false;
                return type === "fiend";
            })

            .effect()
            .file("jb2a.extras.tmfx.outflow.circle.01")
            .attachTo(target, { locale: true })
            .scaleToObject(1.5, { considerTokenScale: false })
            .delay(gridDistance * canvas.grid.size)
            .duration(17500)
            .fadeIn(4000, { delay: 0 })
            .fadeOut(3500, { ease: "easeInSine" })
            .scaleIn(0, 3500, { ease: "easeInOutCubic" })
            .randomRotation()
            .belowTokens()
            .opacity(0.75)
            .tint(0x870101)
            .playIf(() => {
                if (nondetection) return false;
                return type === "fiend";
            })

            //Undead Effect
            .effect()
            .from(target)
            .attachTo(target, { locale: true })
            .scaleToObject(1, { considerTokenScale: true })
            .delay(gridDistance * canvas.grid.size)
            .duration(17500)
            .fadeIn(1000, { delay: 1000 })
            .fadeOut(3500, { ease: "easeInSine" })
            .loopProperty("alphaFilter", "alpha", { values: [0.1, 0.75], duration: 1500, pingPong: true, delay: 500 })
            .spriteRotation(target.rotation * -1)
            .belowTokens()
            .opacity(0.9)
            .zIndex(0.1)
            .filter("Glow", { color: 0x111111, distance: 10 })
            .playIf(() => {
                if (nondetection) return false;
                return type === "undead";
            })

            .effect()
            .file("jb2a.extras.tmfx.outflow.circle.01")
            .attachTo(target, { locale: true })
            .scaleToObject(1.5, { considerTokenScale: false })
            .delay(gridDistance * canvas.grid.size)
            .duration(17500)
            .fadeIn(4000, { delay: 0 })
            .fadeOut(3500, { ease: "easeInSine" })
            .scaleIn(0, 3500, { ease: "easeInOutCubic" })
            .randomRotation()
            .belowTokens()
            .opacity(0.75)
            .tint(0x121212)
            .playIf(() => {
                if (nondetection) return false;
                return type === "undead";
            })

            .play()

    }
}

export let detectEvilAndGood = {
    'cast': cast,
    'item': item
}