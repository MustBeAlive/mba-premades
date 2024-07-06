import {mba} from "../../../helperFunctions.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Detect Thoughts: Probe Mind", false);
    if (!featureData) return;
    delete featureData._id;
    featureData.system.save.dc = mba.getSpellDC(workflow.item);
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} DetTho` })
        await warpgate.revert(token.document, "Detect Thoughts");
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>For the duration, you can read the thoughts of certain creatures.</p>
            <p>When you cast the spell and as your action on each turn until the spell ends, you can focus your mind on any one creature that you can see within 30 feet of you.</p>
            <p>If the creature you choose has an Intelligence of 3 or lower or doesn't speak any language, the creature is unaffected.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 2,
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
        'name': "Detect Thoughts",
        'description': "Detect Thoughts"
    };
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
        .file("jb2a.detect_magic.circle.purple")
        .atLocation(workflow.token)
        .size(12.5, { gridUnits: true })
        .fadeOut(4000)
        .opacity(0.75)
        .belowTokens()

        .effect()
        .file("jb2a.token_border.circle.spinning.purple.001")
        .attachTo(workflow.token)
        .scaleToObject(2)
        .delay(1500)
        .fadeOut(1000)
        .scaleIn(0, 4000, { ease: "easeOutCubic" })
        .persist()
        .name(`${workflow.token.document.name} DetTho`)

        .thenDo(async () => {
            await warpgate.mutate(workflow.token.document, updates, {}, options);
        })

        .play()

    for (let target of targets) {
        if (target.uuid === workflow.token.document.uuid) continue;
        const distance = Math.sqrt(Math.pow(target.x - workflow.token.x, 2) + Math.pow(target.y - workflow.token.y, 2));
        const gridDistance = distance / canvas.grid.size;
        let targetIntValue = target.actor.system.abilities.int.value;
        let languages = target.actor.system.traits.languages.value;
        let nondetection = target.actor.flags['mba-premades']?.spell?.nondetection;

        new Sequence()

            .effect()
            .file("jb2a.markers.circle_of_stars.orangepurple")
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
            .opacity(0.75)
            .zIndex(0.1)
            .belowTokens()
            .filter("Glow", { color: 0xab00ad, distance: 20 })
            .playIf(() => {
                if (targetIntValue <= 3 || !languages.size || nondetection) return false;
                return true;
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
            .tint(0xab00ad)
            .opacity(0.75)
            .belowTokens()
            .playIf(() => {
                if (targetIntValue <= 3 || !languages.size || nondetection) return false;
                return true;
            })

            .play()
    }
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();

    new Sequence()

        .effect()
        .file("jb2a.markers.circle_of_stars.orangepurple")
        .atLocation(target)
        .scaleToObject(2.5)
        .duration(5000)
        .fadeIn(1000)
        .fadeOut(1000)
        .mask(target)

        .play()

    let targetIntValue = target.actor.system.abilities.int.value;
    let languages = target.actor.system.traits.languages.value;
    let nondetection = target.actor.flags['mba-premades']?.spell?.nondetection;
    if (targetIntValue <= 3 || languages.size < 1 || nondetection) {
        ui.notifications.info("Target is unaffected by Detect Thoughts!");
        return false;
    }
}

async function fail({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) {
        await mba.removeCondition(workflow.actor, 'Concentrating');
        return;
    }
    let target = workflow.targets.first();
    new Sequence()

        .effect()
        .from(target)
        .attachTo(target, { locale: true })
        .scaleToObject(1, { considerTokenScale: true })
        .duration(17500)
        .fadeIn(1000, { delay: 1000 })
        .fadeOut(3500, { ease: "easeInSine" })
        .loopProperty("alphaFilter", "alpha", { values: [0.1, 0.8], duration: 1500, pingPong: true, delay: 500 })
        .spriteRotation(target.rotation * -1)
        .opacity(0.75)
        .zIndex(0.1)
        .filter("Glow", { color: 0xab00ad, distance: 20 })
        .belowTokens()

        .effect()
        .file("jb2a.extras.tmfx.outflow.circle.01")
        .attachTo(target, { locale: true })
        .scaleToObject(1.5, { considerTokenScale: false })
        .duration(17500)
        .fadeIn(4000, { delay: 0 })
        .fadeOut(3500, { ease: "easeInSine" })
        .scaleIn(0, 3500, { ease: "easeInOutCubic" })
        .opacity(0.75)
        .belowTokens()
        .randomRotation()
        .tint(0xab00ad)

        .play()
}

export let detectThoughts = {
    'cast': cast,
    'item': item,
    'fail': fail
}