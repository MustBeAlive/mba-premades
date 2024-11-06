import {mba} from "../../../helperFunctions.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Spell Features', 'Detect Poison and Disease: Target Creature', false);
    if (!featureData) return;
    delete featureData._id;
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} DePaD` })
        await warpgate.revert(token.document, 'Detect Poison and Disease: Target Creature');
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': "<p>For the duration, you can sense the presence and location of poisons, poisonous creatures, and diseases within 30 feet of you. You also identify the kind of poison, poisonous creature, or disease in each case.</p><p>The spell can penetrate most barriers, but it is blocked by 1 foot of stone, 1 inch of common metal, a thin sheet of lead, or 3 feet of wood or dirt.</p>",
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
        x: workflow.token.x + (canvas.grid.size * workflow.token.document.width) / 2,
        y: workflow.token.y + (canvas.grid.size * workflow.token.document.width) / 2,
        scene: canvas.scene,
        radius: aoeDistance / canvas.scene.grid.distance * canvas.grid.size
    };
    const containedTokens = warpgate.crosshairs.collect(captureArea, 'Token')
    let targets = Array.from(containedTokens);

    new Sequence()

        .effect()
        .file("jb2a.detect_magic.circle.green")
        .atLocation(workflow.token)
        .size(12.5, { gridUnits: true })
        .fadeOut(4000)
        .opacity(0.75)
        .belowTokens()

        .effect()
        .file("jb2a.token_border.circle.spinning.blue.001")
        .attachTo(workflow.token)
        .scaleToObject(2)
        .delay(1500)
        .fadeOut(1000)
        .scaleIn(0, 4000, { ease: "easeOutCubic" })
        .filter("ColorMatrix", { hue: 285 })
        .persist()
        .name(`${workflow.token.document.name} DePaD`)

        .play()

    for (let target of targets) {
        const distance = Math.sqrt(Math.pow(target.x - token.x, 2) + Math.pow(target.y - token.y, 2));
        const gridDistance = distance / canvas.grid.size;
        let effects = target.actor.effects.filter(e => e.flags['mba-premades']?.isDisease === true || e.name.includes("Poison") && e.name != "Poisoned" && e.name != "Detect Poison and Disease");
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
            .mask(target)

            .wait(500)

            .effect()
            .from(target)
            .attachTo(target, { locale: true })
            .scaleToObject(1, { considerTokenScale: true })
            .delay(gridDistance * canvas.grid.size)
            .duration(17500)
            .fadeIn(1000, { delay: 1000 })
            .fadeOut(3500, { ease: "easeInSine" })
            .loopProperty("alphaFilter", "alpha", { values: [0.1, 0.8], duration: 1500, pingPong: true, delay: 500 })
            .spriteRotation(target.rotation * -1)
            .belowTokens()
            .opacity(0.75)
            .zIndex(0.1)
            .filter("Glow", { color: 0x00bd16, distance: 20 })
            .playIf(() => {
                if (nondetection) return false;
                return (effects.length)
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
                return (effects.length)
            })

            .play();
    }
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let effects = target.actor.effects.filter(e => e.flags['mba-premades']?.isDisease === true /*|| e.name.includes("Poison") && e.name != "Poisoned" && e.name != "Detect Poison and Disease"*/);
    if (!effects.length) {
        new Sequence()

            .effect()
            .file("jb2a.markers.circle_of_stars.green")
            .atLocation(target)
            .scaleToObject(2.5)
            .duration(5000)
            .fadeIn(1000)
            .fadeOut(1000)
            .mask(target)

            .play()

        ui.notifications.info("Target is not affected by any poison or disease");
        return;
    }
    new Sequence()

        .effect()
        .file("jb2a.markers.circle_of_stars.green")
        .atLocation(target)
        .scaleToObject(2.5)
        .duration(5000)
        .fadeIn(1000)
        .fadeOut(1000)
        .mask(target)

        .wait(500)

        .effect()
        .from(target)
        .attachTo(target, { locale: true })
        .scaleToObject(1, { considerTokenScale: true })
        .duration(17500)
        .fadeIn(1000, { delay: 1000 })
        .fadeOut(3500, { ease: "easeInSine" })
        .loopProperty("alphaFilter", "alpha", { values: [0.1, 0.8], duration: 1500, pingPong: true, delay: 500 })
        .spriteRotation(target.rotation * -1)
        .belowTokens()
        .opacity(0.75)
        .zIndex(0.1)
        .filter("Glow", { color: 0x00bd16, distance: 20 })

        .effect()
        .file("jb2a.extras.tmfx.outflow.circle.01")
        .attachTo(target, { locale: true })
        .scaleToObject(1.5, { considerTokenScale: false })
        .duration(17500)
        .fadeIn(4000, { delay: 0 })
        .fadeOut(3500, { ease: "easeInSine" })
        .scaleIn(0, 3500, { ease: "easeInOutCubic" })
        .randomRotation()
        .belowTokens()
        .opacity(0.75)
        .tint(0x00bd16)

        .play()

    let stopper = false;
    let choices = [];
    for (let effect of effects) choices.push([effect.flags['mba-premades']?.name, effect.flags['mba-premades']?.description[0].toString(), "modules/mba-premades/icons/conditions/nauseated.webp"]);
    if (!choices.length) {
        stopper = true;
        return;
    }
    choices.push(["Cancel", false, "modules/mba-premades/icons/conditions/incapacitated.webp"]);
    await mba.playerDialogMessage(game.user);
    while (!stopper) {
        let selection = await mba.selectImage("Detect Poison & Disease", choices, "Select effect:", "value");
        if (!selection) {
            stopper = true;
            return;
        }
        await mba.dialog("Detect Poison & Disease", [["Ok!", false]], selection);
    }
    await mba.clearPlayerDialogMessage();
}

export let detectPoisonAndDisease = {
    'cast': cast,
    'item': item
}