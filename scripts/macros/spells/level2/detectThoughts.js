async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let featureData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Spell Features', 'Detect Thoughts: Probe Mind', false);
    if (!featureData) return;
    featureData.system.save.dc = chrisPremades.helpers.getSpellDC(workflow.item);
    async function effectMacroDel() {
        await Sequencer.EffectManager.endEffects({ name: `${token.document.name} Detect Thoughts` })
        await warpgate.revert(token.document, 'Detect Thoughts: Probe Mind');
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': "<p>For the duration, you can read the thoughts of certain creatures. When you cast the spell and as your action on each turn until the spell ends, you can focus your mind on any one creature that you can see within 30 feet of you. If the creature you choose has an Intelligence of 3 or lower or doesn't speak any language, the creature is unaffected.</p>",
        'duration': {
            'seconds': 60
        },
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': chrisPremades.helpers.functionToString(effectMacroDel)
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
        .file("jb2a.detect_magic.circle.purple")
        .atLocation(token)
        .size(12.5, { gridUnits: true })
        .fadeOut(4000)
        .opacity(0.75)
        .belowTokens()

        .effect()
        .delay(1500)
        .file("jb2a.token_border.circle.spinning.purple.001")
        .attachTo(token)
        .scaleIn(0, 4000, { ease: "easeOutCubic" })
        .scaleToObject(2)
        .persist()
        .name(`${token.document.name} Detect Thoughts`)

        .play()

    targets.forEach(target => {
        if (target.name !== token.name) {
            const distance = Math.sqrt(
                Math.pow(target.x - token.x, 2) + Math.pow(target.y - token.y, 2)
            );
            const gridDistance = distance / canvas.grid.size

            new Sequence()

                .effect()
                .delay(gridDistance * 125)
                .file("jb2a.detect_magic.circle.purple")
                .atLocation(target)
                .scaleToObject(2.5)
                .mask(target)
                .opacity(0.75)

                .wait(500)

                .effect()
                .delay(gridDistance * 125)
                .from(target)
                .belowTokens()
                .attachTo(target, { locale: true })
                .scaleToObject(1, { considerTokenScale: true })
                .spriteRotation(target.rotation * -1)
                .filter("Glow", { color: 0xab00ad, distance: 15 })
                .duration(17500)
                .fadeIn(1000, { delay: 1000 })
                .fadeOut(3500, { ease: "easeInSine" })
                .opacity(0.75)
                .zIndex(0.1)
                .loopProperty("alphaFilter", "alpha", { values: [0.75, 0.1], duration: 1500, pingPong: true, delay: 500 })
                .playIf(() => {
                    let targetIntValue = target.actor.system.abilities.int.value;
                    let languages = target.actor.system.traits.languages.value;
                    if (targetIntValue <= 3 || !languages.size || chrisPremades.helpers.findEffect(target.actor, "Nondetection")) return false;
                    return true;
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
                    let targetIntValue = target.actor.system.abilities.int.value;
                    let languages = target.actor.system.traits.languages.value;
                    if (targetIntValue <= 3 || !languages.size || chrisPremades.helpers.findEffect(target.actor, "Nondetection")) return false;
                    return true;
                })

                .play()
        }
    })
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();

    new Sequence()

        .effect()
        .file("jb2a.detect_magic.circle.purple")
        .atLocation(target)
        .scaleToObject(2.5)
        .mask(target)
        .opacity(0.75)

        .play()

    let targetIntValue = target.actor.system.abilities.int.value;
    let languages = target.actor.system.traits.languages.value;
    if (targetIntValue <= 3 || languages.size < 1 || chrisPremades.helpers.findEffect(target.actor, "Nondetection")) {
        ui.notifications.info('Target is unaffected by Detect Thoughts!');
        return false;
    }
}

async function fail({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) {
        await chrisPremades.helpers.removeCondition(workflow.actor, 'Concentrating');
        return;
    }
    let target = workflow.targets.first();
    new Sequence()

        .effect()
        .from(target)
        .belowTokens()
        .attachTo(target, { locale: true })
        .scaleToObject(1, { considerTokenScale: true })
        .spriteRotation(target.rotation * -1)
        .filter("Glow", { color: 0xab00ad, distance: 15 })
        .duration(17500)
        .fadeIn(1000, { delay: 1000 })
        .fadeOut(3500, { ease: "easeInSine" })
        .opacity(0.75)
        .zIndex(0.1)
        .loopProperty("alphaFilter", "alpha", { values: [0.75, 0.1], duration: 1500, pingPong: true, delay: 500 })

        .effect()
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

        .play()
}

export let detectThoughts = {
    'cast': cast,
    'item': item,
    'fail': fail
}