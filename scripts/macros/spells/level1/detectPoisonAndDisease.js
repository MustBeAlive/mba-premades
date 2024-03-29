async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let featureData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Spell Features', 'Detect Poison and Disease: Target Creature', false);
    if (!featureData) return;
    async function effectMacroDel() {
        await Sequencer.EffectManager.endEffects({ name: `${token.document.name} Detect Poison` })
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
        .file("jb2a.detect_magic.circle.green")
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
        .filter("ColorMatrix", { hue: 285 })
        .persist()
        .name(`${token.document.name} Detect Poison`)

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
                .file("jb2a.detect_magic.circle.green")
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
                .filter("Glow", { color: 0x00bd16, distance: 15 })
                .duration(17500)
                .fadeIn(1000, { delay: 1000 })
                .fadeOut(3500, { ease: "easeInSine" })
                .opacity(0.75)
                .zIndex(0.1)
                .loopProperty("alphaFilter", "alpha", { values: [0.75, 0.1], duration: 1500, pingPong: true, delay: 500 })
                .playIf(() => {
                    if (chrisPremades.helpers.findEffect(target.actor, "Nondetection")) return false;
                    let effects = target.actor.effects.filter(e => e.flags['mba-premades']?.isDisease === true || e.name.includes("Poison") && e.name != "Poisoned");
                    return (effects.length)
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
                    if (chrisPremades.helpers.findEffect(target.actor, "Nondetection")) return false;
                    let effects = target.actor.effects.filter(e => e.flags['mba-premades']?.isDisease === true || e.name.includes("Poison") && e.name != "Poisoned");
                    return (effects.length)
                })

                .play()
        }
    })
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let effects = target.actor.effects.filter(e => e.flags['mba-premades']?.isDisease === true || e.name.includes("Poison") && e.name != "Poisoned");
    if (!effects.length) {
        new Sequence()

            .effect()
            .file("jb2a.detect_magic.circle.green")
            .atLocation(target)
            .scaleToObject(2.5)
            .mask(target)
            .opacity(0.75)

            .play()

        return;
    }
    new Sequence()

        .effect()
        .file("jb2a.detect_magic.circle.green")
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
        .filter("Glow", { color: 0x00bd16, distance: 15 })
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
        .tint(0x00bd16)
        .opacity(0.75)
        .belowTokens()

        .play()

    await warpgate.wait(500);
    let selection = [];
    for (let i = 0; i < effects.length; i++) {
        let effect = effects[i];
        let name = effect.flags['mba-premades']?.name;
        let description = effect.flags['mba-premades']?.description[0].toString();
        let icon = "assets/library/icons/sorted/conditions/nauseated.png";
        selection.push([name, description, icon]);
    }
    function generateEnergyBox(type) {
        return `
        <label class="radio-label">
        <input type="radio" name="type" value="${selection[type]}" />
        <img src="${selection[type].slice(2)}" style="border: 0px; width: 50px; height: 50px"/>
        ${selection[type].slice(0, -2)}
        </label>
    `;
    }
    const effectSelection = Object.keys(selection).map((type) => generateEnergyBox(type)).join("\n");
    const content = `
    <style>
        .detectPoison 
            .form-group {
                display: flex;
                flex-wrap: wrap;
                width: 100%;
                align-items: flex-start;
            }
        .detectPoison 
            .radio-label {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            justify-items: center;
            flex: 1 0 20%;
            line-height: normal;
            }
        .detectPoison 
            .radio-label input {
            display: none;
        }
        .detectPoison img {
            border: 0px;
            width: 50px;
            height: 50px;
            flex: 0 0 50px;
            cursor: pointer;
        }
        /* CHECKED STYLES */
        .detectPoison [type="radio"]:checked + img {
            outline: 2px solid #f00;
        }
    </style>
    <form class="detectPoison">
        <div class="form-group" id="types">
            ${effectSelection}
        </div>
    </form>
`;
    let stopper = 0;
    while (stopper < 1) {
        const poisonDiseaseEffect = await new Promise((resolve) => {
            new Dialog({
                title: "Choose Poison or Disease to find out about:",
                content,
                buttons: {
                    ok: {
                        label: "Ok",
                        callback: async (html) => {
                            const element = html.find("input[type='radio'][name='type']:checked").val();
                            resolve(element);
                        },
                    },
                    cancel: {
                        label: "Stop ",
                        callback: async (html) => {
                            stopper += 1
                            return;
                        }
                    }
                }
            }).render(true);
        });
        let poisonDiseaseEffectName = poisonDiseaseEffect.split(",")[0];
        let poisonDiseaseEffectDescription = poisonDiseaseEffect.substring(poisonDiseaseEffect.indexOf("<"), poisonDiseaseEffect.lastIndexOf(","));
        await new Promise((resolve) => {
            new Dialog({
                title: poisonDiseaseEffectName,
                content: poisonDiseaseEffectDescription,
                buttons: {
                    ok: {
                        label: "Ok",
                        callback: async (html) => {
                            resolve()
                        }
                    }
                }
            }).render(true);
        });
    }
}

export let detectPoisonAndDisease = {
    'cast': cast,
    'item': item
}