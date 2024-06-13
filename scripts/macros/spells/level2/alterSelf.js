import {mba} from "../../../helperFunctions.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let choices = [
        ['Aquatic Adaptation', 'aquatic'],
        ['Change Appearance', 'change'],
        ['Natural Weapons', 'natural']
    ];
    let selection = await mba.dialog("Alter Self", choices, `<b>Choose transformation type:</b>`);
    if (!selection) return;
    let effectData;
    let updates;
    let options;
    if (selection === "aquatic") {
        effectData = {
            'name': workflow.item.name,
            'icon': workflow.item.img,
            'origin': workflow.item.uuid,
            'description': 'You adapt your body to an aquatic environment, sprouting gills and growing webbing between your fingers. You can breathe underwater and gain a swimming speed equal to your walking speed.',
            'duration': {
                'seconds': 3600
            },
            'changes': [
                {
                    'key': 'system.attributes.movement.swim',
                    'mode': 4,
                    'value': '@attributes.movement.walk',
                    'priority': 20
                }
            ],
            'flags': {
                'midi-qol': {
                    'castData': {
                        baseLevel: 2,
                        castLevel: workflow.castData.castLevel,
                        itemUuid: workflow.item.uuid
                    }
                }
            }
        };
    }
    else if (selection === "change") {
        effectData = {
            'name': workflow.item.name,
            'icon': workflow.item.img,
            'origin': workflow.item.uuid,
            'description': 'You transform your appearance. You decide what you look like, including your height, weight, facial features, sound of your voice, hair length, coloration, and distinguishing characteristics, if any. You can make yourself appear as a member of another race, though none of your statistics change. You also can\'t appear as a creature of a different size than you, and your basic shape stays the same; if you are bipedal, you can\'t use this spell to become quadrupedal, for instance. At any time for the duration of the spell, you can use your action to change your appearance in this way again.',
            'duration': {
                'seconds': 3600
            },
            'flags': {
                'midi-qol': {
                    'castData': {
                        baseLevel: 2,
                        castLevel: workflow.castData.castLevel,
                        itemUuid: workflow.item.uuid
                    }
                }
            }
        };
    }
    else if (selection === "natural") {
        let featureData = await mba.getItemFromCompendium('mba-premades.MBA Spell Features', 'Alter Self: Unarmed Strike', false);
        if (!featureData) {
            ui.notifications.warn('Missing item in the compendium! (Alter Self: Unarmed Strike)');
            return;
        }
        delete featureData._id;
        let damageTypes = [['Piercing', 'piercing'], ['Slashing', 'slashing'], ['Bludgeoning', 'bludgeoning']];
        let chooseDamage = await mba.dialog("Alter Self: Damage Type", damageTypes, `<b>Choose damage type:</b>`);
        if (!chooseDamage) {
            ui.notifications.warn('Failed to choose damage type, try again');
            return;
        }
        let damageParts = [[`1d6 + @mod + 1`, `${chooseDamage}`]];
        featureData.system.damage.parts = damageParts;
        async function effectMacroDel() {
            await warpgate.revert(token.document, 'Alter Self: Unarmed Strike');
        }
        effectData = {
            'name': workflow.item.name,
            'icon': workflow.item.img,
            'origin': workflow.item.uuid,
            'description': `
                    <p>You grow claws, fangs, spines, horns, or a different natural weapon of your choice.</p>
                    <p>Your unarmed strikes deal 1d6 ${chooseDamage} damage and you are proficient with your unarmed strikes.</p>
                    <p>Finally, the natural weapon is magic and you have a +1 bonus to the attack and damage rolls you make using it.</p>`
            ,
            'duration': {
                'seconds': 3600
            },
            'flags': {
                'effectmacro': {
                    'onDelete': {
                        'script': mba.functionToString(effectMacroDel)
                    }
                },
                'flags': {
                    'midi-qol': {
                        'castData': {
                            baseLevel: 2,
                            castLevel: workflow.castData.castLevel,
                            itemUuid: workflow.item.uuid
                        }
                    }
                }
            }
        };
        updates = {
            'embedded': {
                'Item': {
                    [featureData.name]: featureData,
                },
                'ActiveEffect': {
                    [effectData.label]: effectData
                }
            }
        };
        options = {
            'permanent': false,
            'name': 'Alter Self: Unarmed Strike',
            'description': 'Alter Self: Unarmed Strike'
        };
    }

    new Sequence()

        .effect()
        .file("jb2a.extras.tmfx.outflow.circle.01")
        .attachTo(token)
        .scaleToObject(1.5)
        .duration(5000)
        .fadeIn(500)
        .fadeOut(500)
        .scaleIn(0, 750, { ease: "easeOutSine" })
        .randomRotation()
        .filter("ColorMatrix", { saturate: -0, brightness: 0 })
        .animateProperty("sprite", "scale.x", { from: 0, to: 0.25 * token.document.texture.scaleX, duration: 500, gridUnits: true, ease: "easeOutCubic", delay: 2600 })
        .animateProperty("sprite", "scale.y", { from: 0, to: 0.25 * token.document.texture.scaleX, duration: 500, gridUnits: true, ease: "easeOutCubic", delay: 2600 })
        .belowTokens()

        .effect()
        .file("jb2a.template_circle.vortex.loop.green")
        .attachTo(token)
        .scaleToObject(1.55, { considerTokenScale: true })
        .delay(400)
        .duration(4000)
        .fadeIn(500)
        .fadeOut(500)
        .scaleIn(0, 2400, { ease: "easeOutSine" })
        .randomRotation()
        .filter("ColorMatrix", { saturate: -0, brightness: 0 })
        .belowTokens()

        .effect()
        .from(token)
        .attachTo(token)
        .fadeIn(500)
        .fadeOut(500)
        .scaleToObject(token.document.texture.scaleX)
        .animateProperty("sprite", "width", { from: (token.document.width * 1) * token.document.texture.scaleX, to: (token.document.width * 1.06) * token.document.texture.scaleX, duration: 500, gridUnits: true, ease: "easeInOutBack" })
        .animateProperty("sprite", "height", { from: (token.document.width) * token.document.texture.scaleX, to: (token.document.width * 1.06) * token.document.texture.scaleX, duration: 750, gridUnits: true, ease: "easeOutBack" })
        .loopProperty("sprite", "position.x", { from: -0.005, to: 0.005, duration: 100, pingPong: true, gridUnits: true })
        .opacity(0.65)
        .repeats(3, 800, 800)

        .effect()
        .file("jb2a.eyes.01.dark_yellow.single.0")
        .attachTo(token)
        .scaleToObject(1.15)
        .delay(3000)
        .duration(1250)
        .fadeOut(500)
        .filter("ColorMatrix", { hue: 80 })
        .zIndex(1)

        .effect()
        .from(token)
        .attachTo(token)
        .scaleToObject(token.document.texture.scaleX)
        .delay(2400)
        .duration(2000)
        .fadeIn(750)
        .fadeOut(500)
        .animateProperty("sprite", "width", { from: (token.document.width * 1) * token.document.texture.scaleX, to: (token.document.width * 1.06) * token.document.texture.scaleX, duration: 500, gridUnits: true, ease: "easeInOutBack" })
        .animateProperty("sprite", "height", { from: (token.document.width) * token.document.texture.scaleX, to: (token.document.width * 1.06) * token.document.texture.scaleX, duration: 750, gridUnits: true, ease: "easeOutBack" })
        .loopProperty("sprite", "position.x", { from: -0.005, to: 0.005, duration: 100, pingPong: true, gridUnits: true })
        .opacity(1)
        .filter("ColorMatrix", { brightness: 0 })
        .filter("Blur", { blurX: 5, blurY: 5 })
        .zIndex(0)
        .waitUntilFinished(-500)

        .thenDo(async () => {
            if (selection === "natural") await warpgate.mutate(workflow.token.document, updates, {}, options);
            else if (selection === "aquatic" || selection === "change") await mba.createEffect(workflow.actor, effectData);
        })

        .effect()
        .file("jb2a.claws.200px.bright_green")
        .atLocation(token)
        .scaleToObject(2.15)
        .fadeOut(500)
        .playbackRate(1.5)
        .belowTokens()
        .zIndex(1)

        .effect()
        .file("jb2a.impact.004.green")
        .atLocation(token)
        .scaleToObject(2.75)
        .belowTokens()
        .fadeOut(500)
        .filter("ColorMatrix", { brightness: 0 })
        .opacity(0.85)

        .play()
}

async function attack({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let target = workflow.targets.first();
    let damageType = workflow.item.system.damage.parts[0][1];
    if (damageType === "piercing") {
        new Sequence()

            .effect()
            .file("jb2a.bite.400px.green")
            .attachTo(target)
            .scaleToObject(2.5 * target.document.texture.scaleX)

            .effect()
            .file("jaamod.sequencer_fx_master.blood_splat.red.2")
            .delay(200)
            .attachTo(target)
            .scaleIn(0, 500, { 'ease': 'easeOutCubic' })
            .scaleToObject(1.65 * target.document.texture.scaleX)
            .duration(2500)
            .fadeOut(1000)
            .belowTokens()

            .play()
    }
    else if (damageType === "slashing") {
        new Sequence()

            .effect()
            .file("jb2a.claws.400px.bright_green")
            .attachTo(target)
            .scaleToObject(2 * target.document.texture.scaleX)

            .effect()
            .file("jaamod.sequencer_fx_master.blood_splat.red.2")
            .delay(200)
            .attachTo(target)
            .scaleIn(0, 500, { 'ease': 'easeOutCubic' })
            .scaleToObject(1.65 * target.document.texture.scaleX)
            .duration(2500)
            .fadeOut(1000)
            .belowTokens()

            .play()
    }
    else if (damageType === "bludgeoning") {
        new Sequence()

            .effect()
            .file("jb2a.unarmed_strike.magical.02.green")
            .attachTo(token)
            .stretchTo(target)

            .effect()
            .file("jaamod.sequencer_fx_master.blood_splat.red.2")
            .delay(600)
            .attachTo(target)
            .scaleIn(0, 500, { 'ease': 'easeOutCubic' })
            .scaleToObject(1.65 * target.document.texture.scaleX)
            .duration(2500)
            .fadeOut(1000)
            .belowTokens()

            .play()
    }
}

export let alterSelf = {
    'item': item,
    'attack': attack
}