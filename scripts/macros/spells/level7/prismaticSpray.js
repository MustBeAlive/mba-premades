import {mba} from "../../../helperFunctions.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let targets = Array.from(workflow.targets);
    let saves = Array.from(workflow.saves);
    for (let target of targets) {
        let saved = saves.includes(target);
        let typeRoll = [(await new Roll("1d8").roll({ 'async': true })).total];
        if (typeRoll === 8) { typeRoll = [(await new Roll("1d7").roll({ 'async': true })).total, (await new Roll("1d7").roll({ 'async': true })).total]; };
        for (let type of typeRoll) {
            switch (type) {
                case 1:
                    await damageRay(workflow, target, saved, "fire", "jb2a.scorching_ray.01.red", "Red");
                    break;
                case 2:
                    await damageRay(workflow, target, saved, "acid", "jb2a.scorching_ray.01.orange", "Orange");
                    break;
                case 3:
                    await damageRay(workflow, target, saved, "lightning", "jb2a.scorching_ray.01.yellow", "Yellow");
                    break;
                case 4:
                    await damageRay(workflow, target, saved, "poison", "jb2a.scorching_ray.01.green", "Green");
                    break;
                case 5:
                    await damageRay(workflow, target, saved, "cold", "jb2a.scorching_ray.01.blue", "Blue");
                    break;
                case 6:
                    if (saved || mba.checkTrait(target.actor, "ci", "petrified")) break;
                    await indigoRay(workflow, target);
                    break;
                case 7:
                    await violetRay(workflow, target);
                    break;
            }
        }
    }
}

async function damageRay(workflow, target, saved, damageType, animation, rayColor) {
    // To do: округление в нижнюю
    let damageRoll = await new Roll(`10d6[${damageType}]`).roll({ 'async': true });
    if (saved) damageRoll = await new Roll(`10d6/2[${damageType}]`).roll({ 'async': true });
    new Sequence()

        .effect()
        .file(animation)
        .attachTo(workflow.token)
        .stretchTo(target)
        .zIndex(1)
        .repeats(4, 500)

        .thenDo(async () => {
            await mba.applyWorkflowDamage(workflow.token, damageRoll, `${damageType}`, [target], undefined, workflow.itemCardId);
            ChatMessage.create({
                flavor: `Prismatic spray (${rayColor}) damaged ${target.document.name} for ${damageRoll.total} ${damageType} damage.`,
                speaker: ChatMessage.getSpeaker({ actor: target.actor })
            });
        })

        .play()
}

async function indigoRay(workflow, target) {
    async function effectMacroEnd() {
        let effect = await mbaPremades.helpers.findEffect(actor, "Prismatic Spray: Indigo");
        if (!effect) return;
        let success = effect.flags['mba-premades']?.spell?.prismaticSpray?.success;
        let fail = effect.flags['mba-premades']?.spell?.prismaticSpray?.fail;
        let featureData = await mbaPremades.helpers.getItemFromCompendium("mba-premades.MBA Spell Features", "Prismatic Spray: Save", false);
        if (!featureData) return;
        delete featureData._id;
        featureData.system.save.dc = effect.flags['mba-premades']?.spell?.prismaticSpray?.saveDC;
        let feature = new CONFIG.Item.documentClass(featureData, { 'parent': token.actor });
        let [config, options] = mbaPremades.constants.syntheticItemWorkflowOptions([token.document.uuid]);
        let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
        if (featureWorkflow.failedSaves.size) fail += 1;
        else success += 1;
        let updates = {
            'flags': {
                'mba-premades': {
                    'spell': {
                        'prismaticSpray': {
                            'success': success,
                            'fail': fail
                        }
                    }
                }
            }
        };
        await mbaPremades.helpers.updateEffect(effect, updates);
        mbaPremades.helpers.dialog("Flesh to Stone: Progress", [["Ok", true]], `<p><b>Success:</b> ${success}</p><p><b>Fails:</b> ${fail}</p>`);
        if (effect.flags['mba-premades']?.spell?.prismaticSpray?.success > 2) await mbaPremades.helpers.removeEffect(effect);
        if (effect.flags['mba-premades']?.spell?.prismaticSpray?.fail > 2) {
            async function effectMacroDel() {
                Sequencer.EffectManager.endEffects({ name: `${token.document.name} PSVP` })
            }
            let effectData = {
                'name': "Prismatic Spray: Petrification",
                'icon': "modules/mba-premades/icons/conditions/muddy.webp",
                'origin': effect.flags['mba-premades']?.spell?.prismaticSpray?.itemUuid,
                'description': "You failed the saving throw 3 times and have turned into stone.",
                'changes': [
                    {
                        'key': 'macro.CE',
                        'mode': 0,
                        'value': "Petrified",
                        'priority': 20
                    }
                ],
                'flags': {
                    'dae': {
                        'showIcon': true,
                    },
                    'effectmacro': {
                        'onDelete': {
                            'script': mbaPremades.helpers.functionToString(effectMacroDel)
                        }
                    },
                    'midi-qol': {
                        'castData': {
                            baseLevel: 7,
                            castLevel: effect.flags['mba-premades']?.spell?.prismaticSpray?.castLevel,
                            itemUuid: effect.flags['mba-premades']?.spell?.prismaticSpray?.itemUuid
                        }
                    }
                }
            };
            new Sequence()

                .effect()
                .from(token)
                .atLocation(token)
                .attachTo(token)
                .duration(5000)
                .fadeIn(3000)
                .fadeOut(1000)
                .opacity(0.4)
                .zIndex(1)
                .filter("ColorMatrix", { contrast: 1, saturate: -1 })
                .filter("Glow", { color: 0x000000, distance: 3, outerStrength: 4 })
                .mask(token)
                .persist()
                .name(`${token.document.name} PSVP`)

                .effect()
                .file("modules/mba-premades/icons/conditions/overlay/pertrification.webp")
                .atLocation(token)
                .attachTo(token)
                .fadeIn(3000)
                .fadeOut(1000)
                .duration(5000)
                .opacity(1)
                .zIndex(0)
                .filter("Glow", { color: 0x000000, distance: 3, outerStrength: 4 })
                .mask(token)
                .persist()
                .name(`${token.document.name} PSVP`)

                .thenDo(async () => {
                    await mbaPremades.helpers.createEffect(actor, effectData);
                    await mbaPremades.helpers.removeEffect(effect);
                })

                .play()
        }
    }
    let effectData = {
        'name': "Prismatic Spray: Indigo",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are affected by Indigo Ray of Prismatic Spray and begin to turn into stone.</p>
            <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.gfRbTxGiulUylAjE]{Restrained} for the duration and must make another Constitution saving throw at the end of each of your turns.</p>
            <p>If you successfuly save against this spell three times, the spell ends.</p>
            <p>If you fail your save three times, you turn into stone and are subjected to the @UUID[Compendium.mba-premades.MBA SRD.Item.rrTzCb9szWTmyXwH]{Petrified} condition for the duration.</p>
        `,
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Restrained",
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true
            },
            'effectmacro': {
                'onTurnEnd': {
                    'script': mba.functionToString(effectMacroEnd)
                }
            },
            'mba-premades': {
                'spell': {
                    'prismaticSpray': {
                        'castLevel': workflow.castData.castLevel,
                        'fail': 0,
                        'itemUuid': workflow.item.uuid,
                        'saveDC': mba.getSpellDC(workflow.item),
                        'success': 0,
                    }
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 7,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    new Sequence()

        .effect()
        .file("jb2a.scorching_ray.01.pink")
        .attachTo(workflow.token)
        .stretchTo(target)
        .zIndex(1)
        .repeats(4, 500)

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectData);
        })

        .play()
}

async function violetRay(workflow, target) {
    async function effectMacroDel() {
        let castLevel = effect.flags['mba-premades']?.spell?.prismaticSpray?.castLevel;
        let itemUuid = effect.flags['mba-premades']?.spell?.prismaticSpray?.itemUuid;
        let saveDC = effect.flags['mba-premades']?.spell?.prismaticSpray?.saveDC;
        let featureData = await mbaPremades.helpers.getItemFromCompendium("mba-premades.MBA Spell Features", "Prismatic Spray: Save", false);
        if (!featureData) return;
        delete featureData._id;
        featureData.system.save.ability = "wis";
        featureData.system.save.dc = saveDC;
        let feature = new CONFIG.Item.documentClass(featureData, { 'parent': token.actor });
        let [config, options] = mbaPremades.constants.syntheticItemWorkflowOptions([token.document.uuid]);
        let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
        if (!featureWorkflow.failedSaves.size) return;
        async function effectMacroCreate() {
            await token.document.update({ hidden: true });
        };
        async function effectMacroDel() {
            await token.document.update({ hidden: false });
        };
        let effectDataBanish = {
            'name': "Prismatic Spray: Banishment",
            'icon': "modules/mba-premades/icons/spells/level4/banishment.webp",
            'description': `
                <p>You were banished from the material plane.</p>
            `,
            'flags': {
                'dae': {
                    'showIcon': true
                },
                'effectmacro': {
                    'onCreate': {
                        'script': mbaPremades.helpers.functionToString(effectMacroCreate)
                    },
                    'onDelete': {
                        'script': mbaPremades.helpers.functionToString(effectMacroDel)
                    }
                },
                'midi-qol': {
                    'castData': {
                        baseLevel: 7,
                        castLevel: castLevel,
                        itemUuid: itemUuid
                    }
                }
            }
        };
        new Sequence()

            .effect()
            .file("jb2a.magic_signs.circle.02.abjuration.intro.dark_blue")
            .atLocation(token)
            .scaleToObject(2)
            .belowTokens()

            .effect()
            .file("jb2a.magic_signs.circle.02.abjuration.loop.dark_blue")
            .atLocation(token)
            .scaleToObject(2)
            .belowTokens()
            .delay(3000)
            .duration(13000)
            .fadeOut(1000)

            .effect()
            .file("jb2a.magic_signs.rune.abjuration.complete.blue")
            .atLocation(token, { offset: { x: 70, y: 22 } })
            .scaleToObject(0.5)
            .delay(3750)
            .playbackRate(0.65)
            .animateProperty("sprite", "position.x", { from: 0, to: -70, duration: 500, delay: 4000, ease: "easeInBack" })
            .animateProperty("sprite", "position.y", { from: 0, to: -97, duration: 500, delay: 4000, ease: "easeInBack" })
            .duration(4500)

            .effect()
            .file("jb2a.magic_signs.rune.abjuration.complete.blue")
            .atLocation(token, { offset: { x: 45, y: -61 } })
            .scaleToObject(0.5)
            .delay(4250)
            .playbackRate(0.65)
            .animateProperty("sprite", "position.x", { from: 0, to: -45, duration: 500, delay: 3500, ease: "easeInBack" })
            .animateProperty("sprite", "position.y", { from: 0, to: -14, duration: 500, delay: 3500, ease: "easeInBack" })
            .duration(4000)

            .effect()
            .file("jb2a.magic_signs.rune.abjuration.complete.blue")
            .atLocation(token, { offset: { x: -45, y: -61 } })
            .scaleToObject(0.5)
            .delay(4750)
            .playbackRate(0.65)
            .animateProperty("sprite", "position.x", { from: 0, to: 45, duration: 500, delay: 3000, ease: "easeInBack" })
            .animateProperty("sprite", "position.y", { from: 0, to: -14, duration: 500, delay: 3000, ease: "easeInBack" })
            .zIndex(0.9)
            .duration(3500)

            .effect()
            .file("jb2a.magic_signs.rune.abjuration.complete.blue")
            .atLocation(token, { offset: { x: -70, y: 22 } })
            .scaleToObject(0.5)
            .delay(5250)
            .playbackRate(0.65)
            .animateProperty("sprite", "position.x", { from: 0, to: 70, duration: 500, delay: 2500, ease: "easeInBack" })
            .animateProperty("sprite", "position.y", { from: 0, to: -97, duration: 500, delay: 2500, ease: "easeInBack" })
            .zIndex(0.9)
            .duration(3000)

            .effect()
            .file("jb2a.magic_signs.rune.abjuration.complete.blue")
            .atLocation(token, { offset: { x: 0, y: 75 } })
            .scaleToObject(0.5)
            .delay(5750)
            .playbackRate(0.65)
            .animateProperty("sprite", "position.x", { from: 0, to: 0, duration: 500, delay: 2000, ease: "easeInBack" })
            .animateProperty("sprite", "position.y", { from: 0, to: -150, duration: 500, delay: 2000, ease: "easeInBack" })
            .zIndex(0.9)
            .duration(2500)

            .effect()
            .file("jb2a.explosion.01.blue")
            .atLocation(token, { offset: { x: 5, y: -75 } })
            .scaleToObject(1.5)
            .delay(8250)
            .zIndex(1)

            .effect()
            .file("jb2a.portals.vertical.vortex.blue")
            .atLocation(token, { offset: { x: 0, y: -75 } })
            .scaleToObject(2)
            .duration(6000)
            .scaleIn({ x: 0, y: 0.8 }, 500)
            .scaleOut({ x: 0, y: 0.4 }, 500, { ease: "easeInBack" })
            .fadeOut(250)
            .delay(8250)
            .zIndex(0.7)
            .belowTokens()
            .waitUntilFinished(-5750)

            .effect()
            .file("jb2a.wind_stream.1200.white")
            .atLocation(token)
            .scaleToObject(1.03)
            .rotate(90)
            .duration(6000)
            .fadeIn(250)
            .fadeOut(750)

            .effect()
            .file("jb2a.wind_stream.1200.white")
            .atLocation(token, { offset: { x: 0, y: 100 } })
            .scaleToObject(1.03)
            .rotate(90)
            .duration(6000)
            .fadeIn(250)
            .fadeOut(750)

            .effect()
            .file("jb2a.energy_beam.normal.bluepink.03") // check
            .atLocation(token, { offset: { x: 0, y: 50 } })
            .rotate(90)
            .size({ width: 400, height: 350 })
            .opacity(0.2)
            .duration(6000)
            .playbackRate(1.6)
            .fadeIn(250)
            .fadeOut(750)

            .animation()
            .on(token)
            .opacity(0)
            .waitUntilFinished(-500)

            .effect()
            .from(token)
            .atLocation(token)
            .animateProperty("sprite", "position.y", { from: 0, to: -15, duration: 250, ease: "easeInOutBack" })
            .waitUntilFinished(-100)

            .effect()
            .from(token)
            .atLocation(token)
            .animateProperty("sprite", "position.y", { from: -15, to: 0, duration: 2000, ease: "easeInOutBack" })
            .animateProperty("sprite", "rotation", { from: 0, to: 8, duration: 500, ease: "easeOutCubic" })
            .animateProperty("sprite", "rotation", { from: 0, to: -16, duration: 500, delay: 500, ease: "easeOutCubic" })
            .animateProperty("sprite", "rotation", { from: 0, to: 16, duration: 500, delay: 1000, ease: "easeOutCubic" })
            .animateProperty("sprite", "rotation", { from: 0, to: -16, duration: 500, delay: 1500, ease: "easeInCubic" })
            .waitUntilFinished(-100)

            .effect()
            .from(token)
            .atLocation(token)
            .animateProperty("sprite", "position.y", { from: 0, to: -40, duration: 500, ease: "easeInOutBack" })
            .waitUntilFinished(-100)

            .effect()
            .from(token)
            .atLocation(token)
            .animateProperty("sprite", "position.y", { from: -40, to: -15, duration: 2000, ease: "easeInOutBack" })
            .animateProperty("sprite", "rotation", { from: 0, to: 8, duration: 500, ease: "easeOutCubic" })
            .animateProperty("sprite", "rotation", { from: 0, to: -16, duration: 500, delay: 500, ease: "easeOutCubic" })
            .animateProperty("sprite", "rotation", { from: 0, to: 16, duration: 500, delay: 1000, ease: "easeOutCubic" })
            .animateProperty("sprite", "rotation", { from: 0, to: -16, duration: 500, delay: 1500, ease: "easeInCubic" })
            .waitUntilFinished(-100)

            .effect()
            .from(token)
            .atLocation(token)
            .animateProperty("sprite", "position.y", { from: -15, to: -200, duration: 750, ease: "easeInOutBack" })
            .scaleOut(0, 750)
            .duration(375)
            .waitUntilFinished(-150)

            .thenDo(async () => {
                await mbaPremades.helpers.createEffect(token.actor, effectDataBanish);
            })

            .effect()
            .file("animated-spell-effects-cartoon.flash.01")
            .atLocation(token, { offset: { x: 0, y: -85 } })
            .scaleToObject(0.5)
            .filter("ColorMatrix", { hue: 15 })
            .zIndex(0.9)

            .effect()
            .file("jb2a.detect_magic.cone.blue")
            .rotateTowards(token)
            .atLocation(token, { offset: { x: 0, y: -110 } })
            .scaleToObject(1)
            .playbackRate(1.5)
            .zIndex(1)

            .effect()
            .file("jb2a.template_circle.out_pulse.02.loop.bluewhite")
            .atLocation(token, { offset: { x: 0, y: -75 } })
            .scaleToObject(1.75)
            .delay(1000)
            .fadeOut(1000)
            .waitUntilFinished(-1500)

            .effect()
            .file("jb2a.fireflies.many.02.blue")
            .atLocation(token, { offset: { x: 0, y: -75 } })
            .scaleToObject(0.75)
            .duration(2000)
            .fadeIn(500)
            .fadeOut(750)
            .animateProperty("sprite", "position.y", { from: 0, to: 75, duration: 3000 })

            .animation()
            .on(token)
            .opacity(1)

            .play();
    };
    let effectData = {
        'name': "Prismatic Spray: Violet",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p></p>
        `,
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Blinded",
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['turnStartSource']
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'mba-premades': {
                'spell': {
                    'prismaticSpray': {
                        'castLevel': workflow.castData.castLevel,
                        'itemUuid': workflow.item.uuid,
                        'saveDC': mba.getSpellDC(workflow.item),
                    }
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 7,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    new Sequence()

        .effect()
        .file("jb2a.scorching_ray.01.purple")
        .attachTo(workflow.token)
        .stretchTo(target)
        .zIndex(1)
        .repeats(4, 500)

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectData);
        })

        .play()
}

export let prismaticSpray = {
    'item': item,
    'damageRay': damageRay,
    'indigoRay': indigoRay,
    'violetRay': violetRay
}