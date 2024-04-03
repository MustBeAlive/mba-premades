// Update when move to 3.1.0+ (armor now has mgc property);

// Token border animation will play on tokens inside initial 30 ft. range and on feature use on targeted token with:
// Weapon that has "mgc" property;
// Ammo that has "mgc" property;
// Any Weapon/Armor/Ammo that has '+1/+2/+3' in its name;
// Any item that requires attunement

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let featureData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Spell Features', 'Detect Magic: Target Creature', false);
    if (!featureData) return;
    async function effectMacroDel() {
        await Sequencer.EffectManager.endEffects({ name: `${token.document.name} Detect Magic` })
        await warpgate.revert(token.document, 'Detect Magic: Target Creature');
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': "<p>For the duration, you sense the presence of magic within 30 feet of you. If you sense magic in this way, you can use your action to see a faint aura around any visible creature or object in the area that bears magic, and you learn its school of magic, if any.</p><p>The spell can penetrate most barriers, but it is blocked by 1 foot of stone, 1 inch of common metal, a thin sheet of lead, or 3 feet of wood or dirt.</p>",
        'duration': {
            'seconds': 600
        },
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': chrisPremades.helpers.functionToString(effectMacroDel)
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
        .file("jb2a.detect_magic.circle.blue")
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
        .persist()
        .name(`${token.document.name} Detect Magic`)

        .play()

    targets.forEach(target => {
        if (target.name !== token.name) {
            const distance = Math.sqrt(Math.pow(target.x - token.x, 2) + Math.pow(target.y - token.y, 2));
            const gridDistance = distance / canvas.grid.size;

            new Sequence()

                .effect()
                .delay(gridDistance * 125)
                .file("jb2a.detect_magic.circle.blue")
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
                .filter("Glow", { color: 0x008ae0, distance: 15 })
                .duration(17500)
                .fadeIn(1000, { delay: 1000 })
                .fadeOut(3500, { ease: "easeInSine" })
                .opacity(0.75)
                .zIndex(0.1)
                .loopProperty("alphaFilter", "alpha", { values: [0.75, 0.1], duration: 1500, pingPong: true, delay: 500 })
                .playIf(() => {
                    if (chrisPremades.helpers.findEffect(target.actor, "Nondetection")) return false;
                    let validItems = target.actor.items.filter(i => i.type === 'weapon').concat(target.actor.items.filter(i => i.type === 'equipment'), target.actor.items.filter(i => i.type === 'consumable'));
                    let hasMagicItems = validItems.filter(i => i.system.properties?.mgc === true || i.system.attunement != 0 || i.name.includes("+1") || i.name.includes("+2") || i.name.includes("+3"));
                    return (hasMagicItems.length);
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
                    if (chrisPremades.helpers.findEffect(target.actor, "Nondetection")) return;
                    let validItems = target.actor.items.filter(i => i.type === 'weapon').concat(target.actor.items.filter(i => i.type === 'equipment'), target.actor.items.filter(i => i.type === 'consumable'));
                    let hasMagicItems = validItems.filter(i => i.system.properties?.mgc === true || i.system.attunement != 0 || i.name.includes("+1") || i.name.includes("+2") || i.name.includes("+3"));
                    return (hasMagicItems.length);
                })

                .play()
        }
    })
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let validItems = target.actor.items.filter(i => i.type === 'weapon').concat(target.actor.items.filter(i => i.type === 'equipment'), target.actor.items.filter(i => i.type === 'consumable'));
    let hasMagicItems = validItems.filter(i => i.system.properties?.mgc === true || i.system.attunement != 0 || i.name.includes("+1") || i.name.includes("+2") || i.name.includes("+3"));
    if (!hasMagicItems.length || chrisPremades.helpers.findEffect(target.actor, "Nondetection")) {
        new Sequence()

            .effect()
            .file("jb2a.detect_magic.circle.blue")
            .atLocation(target)
            .scaleToObject(2.5)
            .mask(target)
            .opacity(0.75)

            .play()

        return;
    }
    new Sequence()

        .effect()
        .file("jb2a.detect_magic.circle.blue")
        .atLocation(target)
        .scaleToObject(2.5)
        .mask(target)
        .opacity(0.75)

        .wait(500)

        .effect()
        .from(target)
        .belowTokens()
        .attachTo(target, { locale: true })
        .scaleToObject(1, { considerTokenScale: true })
        .spriteRotation(target.rotation * -1)
        .filter("Glow", { color: 0x008ae0, distance: 15 })
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
        .tint(0x008ae0)
        .opacity(0.75)
        .belowTokens()

        .play()
}

export let detectMagic = {
    'cast': cast,
    'item': item
}