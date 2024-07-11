import { mba } from "../../../../helperFunctions.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let wildShapeItem = await mba.getItem(workflow.actor, "Wild Shape");
    if (!wildShapeItem) return;
    let uses = wildShapeItem.system.uses.value;
    if (uses < 1) {
        ui.notifications.warn("You don't have any wild shape uses left!");
        return;
    }
    let druidLevel = workflow.actor.classes.druid?.system?.levels;
    if (!druidLevel) {
        ui.notifications.warn("Actor has no Druid levels!");
        return;
    }
    let choices = [
        ["Archer", "archer", "modules/mba-premades/icons/class/druid/starry_form_archer.webp"],
        ["Chalice", "chalice", "modules/mba-premades/icons/class/druid/starry_form_chalice.webp"],
        ["Dragon", "dragon", "modules/mba-premades/icons/class/druid/starry_form_dragon.webp"],
        ["Cancel", false, "modules/mba-premades/icons/conditions/incapacitated.webp"],
    ];
    await mba.playerDialogMessage();
    let selection = await mba.selectImage("Starry Form", choices, "<b>Choose constellation:</b>", "both");
    await mba.clearPlayerDialogMessage();
    if (!selection) return;
    let oldEffect = await mba.findEffect(workflow.actor, "Starry Form");
    let diceNumber = 1;
    if (druidLevel >= 10) diceNumber = 2;
    if (selection[0] === "archer") {
        let featureData = await mba.getItemFromCompendium('mba-premades.MBA Class Feature Items', 'Starry Form: Archer', false);
        if (!featureData) return;
        featureData.system.damage.parts[0][0] = `${diceNumber}d8 + @abilities.wis.mod`;
        async function effectMacroEveryTurn() {
            let effect = await mbaPremades.helpers.findEffect(actor, "Starry Form");
            if (effect && mbaPremades.helpers.findEffect(actor, "Incapacitated")) await mbaPremades.helpers.removeEffect(effect);
        };
        async function effectMacroDel() {
            Sequencer.EffectManager.endEffects({ name: `${token.document.name} Starry Form` });
            await warpgate.revert(token.document, 'Starry Form: Archer');
        };
        let effectData = {
            'name': "Starry Form",
            'icon': selection[1],
            'origin': workflow.item.uuid,
            'description': `
                <p>A constellation of an archer appears on you.</p>
                <p>When you activate this form, and as a bonus action on your subsequent turns while it lasts, you can make a ranged spell attack, hurling a luminous arrow that targets one creature within 60 feet of you.</p>
                <p>On a hit, the attack deals radiant damage equal to ${diceNumber}d8 + your Wisdom modifier.</p>
            `,
            'duration': {
                'seconds': 600
            },
            'changes': [
                {
                    'key': 'ATL.light.dim',
                    'mode': 4,
                    'value': 20,
                    'priority': 20
                },
                {
                    'key': 'ATL.light.bright',
                    'mode': 4,
                    'value': 10,
                    'priority': 20
                },
                {
                    'key': 'ATL.light.alpha',
                    'mode': 5,
                    'value': "0.25",
                    'priority': 20
                },
                {
                    'key': 'ATL.light.angle',
                    'mode': 5,
                    'value': "360",
                    'priority': 20
                },
                {
                    'key': 'ATL.light.luminosity',
                    'mode': 5,
                    'value': "0.5",
                    'priority': 20
                },
                {
                    'key': 'ATL.light.color',
                    'mode': 5,
                    'value': "#2b58bf",
                    'priority': 20
                },
                {
                    'key': 'ATL.light.animation',
                    'mode': 5,
                    'value': '{type: "smokepatch", speed: 5, intensity: 1, reverse: false }',
                    'priority': 20
                },
                {
                    'key': 'ATL.light.attenuation',
                    'mode': 5,
                    'value': "0.8",
                    'priority': 20
                },
                {
                    'key': 'ATL.light.contrast',
                    'mode': 5,
                    'value': "0.15",
                    'priority': 20
                },
                {
                    'key': 'ATL.light.shadows',
                    'mode': 5,
                    'value': "0.2",
                    'priority': 20
                }
            ],
            'flags': {
                'effectmacro': {
                    'onEachTurn': {
                        'script': mba.functionToString(effectMacroEveryTurn)
                    },
                    'onDelete': {
                        'script': mba.functionToString(effectMacroDel)
                    }
                }
            }
        };
        if (druidLevel >= 14) {
            effectData.changes = effectData.changes.concat(
                {
                    'key': 'system.traits.dr.value',
                    'mode': 2,
                    'value': "bludgeoning",
                    'priority': 20
                },
                {
                    'key': 'system.traits.dr.value',
                    'mode': 2,
                    'value': "slashing",
                    'priority': 20
                },
                {
                    'key': 'system.traits.dr.value',
                    'mode': 2,
                    'value': "piercing",
                    'priority': 20
                },
            );
        }
        let updates = {
            'embedded': {
                'Item': {
                    [featureData.name]: featureData,
                },
                'ActiveEffect': {
                    [effectData.name]: effectData
                }
            }
        };
        let options = {
            'permanent': false,
            'name': 'Starry Form: Archer',
            'description': 'Starry Form: Archer'
        };
        if (!oldEffect) await wildShapeItem.update({ "system.uses.value": uses -= 1 });
        else if (oldEffect && druidLevel < 11) {
            await mba.removeEffect(oldEffect);
            await wildShapeItem.update({ "system.uses.value": uses -= 1 });
        }
        else if (oldEffect) await mba.removeEffect(oldEffect);
        await warpgate.wait(100);
        await warpgate.mutate(workflow.token.document, updates, {}, options);
    }
    else if (selection[0] === "chalice") {
        let featureData = await mba.getItemFromCompendium('mba-premades.MBA Class Feature Items', 'Starry Form: Chalice', false);
        if (!featureData) return;
        featureData.system.damage.parts[0][0] = `${diceNumber}d8 + @abilities.wis.mod`;
        async function effectMacroEveryTurn() {
            let effect = await mbaPremades.helpers.findEffect(actor, "Starry Form");
            if (effect && mbaPremades.helpers.findEffect(actor, "Incapacitated")) await mbaPremades.helpers.removeEffect(effect);
        };
        async function effectMacroDel() {
            Sequencer.EffectManager.endEffects({ name: `${token.document.name} Starry Form` });
            await warpgate.revert(token.document, 'Starry Form: Chalice');
        };
        let effectData = {
            'name': "Starry Form",
            'icon': selection[1],
            'origin': workflow.item.uuid,
            'description': `
                <p>A constellation of a life-giving goblet appears on you.</p>
                <p>Whenever you cast a spell using a spell slot that restores hit points to a creature, you or another creature within 30 feet of you can regain hit points equal to ${diceNumber}d8 + your Wisdom modifier.</p>
            `,
            'duration': {
                'seconds': 600
            },
            'changes': [
                {
                    'key': 'ATL.light.dim',
                    'mode': 4,
                    'value': 20,
                    'priority': 20
                },
                {
                    'key': 'ATL.light.bright',
                    'mode': 4,
                    'value': 10,
                    'priority': 20
                },
                {
                    'key': 'ATL.light.alpha',
                    'mode': 5,
                    'value': "0.25",
                    'priority': 20
                },
                {
                    'key': 'ATL.light.angle',
                    'mode': 5,
                    'value': "360",
                    'priority': 20
                },
                {
                    'key': 'ATL.light.luminosity',
                    'mode': 5,
                    'value': "0.5",
                    'priority': 20
                },
                {
                    'key': 'ATL.light.color',
                    'mode': 5,
                    'value': "#2b58bf",
                    'priority': 20
                },
                {
                    'key': 'ATL.light.animation',
                    'mode': 5,
                    'value': '{type: "smokepatch", speed: 5, intensity: 1, reverse: false }',
                    'priority': 20
                },
                {
                    'key': 'ATL.light.attenuation',
                    'mode': 5,
                    'value': "0.8",
                    'priority': 20
                },
                {
                    'key': 'ATL.light.contrast',
                    'mode': 5,
                    'value': "0.15",
                    'priority': 20
                },
                {
                    'key': 'ATL.light.shadows',
                    'mode': 5,
                    'value': "0.2",
                    'priority': 20
                }
            ],
            'flags': {
                'effectmacro': {
                    'onEachTurn': {
                        'script': mba.functionToString(effectMacroEveryTurn)
                    },
                    'onDelete': {
                        'script': mba.functionToString(effectMacroDel)
                    }
                }
            }
        };
        if (druidLevel >= 14) {
            effectData.changes = effectData.changes.concat(
                {
                    'key': 'system.traits.dr.value',
                    'mode': 2,
                    'value': "bludgeoning",
                    'priority': 20
                },
                {
                    'key': 'system.traits.dr.value',
                    'mode': 2,
                    'value': "slashing",
                    'priority': 20
                },
                {
                    'key': 'system.traits.dr.value',
                    'mode': 2,
                    'value': "piercing",
                    'priority': 20
                },
            );
        }
        let updates = {
            'embedded': {
                'Item': {
                    [featureData.name]: featureData,
                },
                'ActiveEffect': {
                    [effectData.name]: effectData
                }
            }
        };
        let options = {
            'permanent': false,
            'name': 'Starry Form: Chalice',
            'description': 'Starry Form: Chalice'
        };
        if (!oldEffect) await wildShapeItem.update({ "system.uses.value": uses -= 1 });
        else if (oldEffect && druidLevel < 11) {
            await mba.removeEffect(oldEffect);
            await wildShapeItem.update({ "system.uses.value": uses -= 1 });
        }
        else if (oldEffect) await mba.removeEffect(oldEffect);
        await warpgate.wait(100);
        await warpgate.mutate(workflow.token.document, updates, {}, options);
    }
    else if (selection[0] === "dragon") {
        async function effectMacroEveryTurn() {
            let effect = await mbaPremades.helpers.findEffect(actor, "Starry Form");
            if (effect && mbaPremades.helpers.findEffect(actor, "Incapacitated")) await mbaPremades.helpers.removeEffect(effect);
        };
        async function effectMacroDel() {
            Sequencer.EffectManager.endEffects({ name: `${token.document.name} Starry Form` });
        };
        let effectData = {
            'name': "Starry Form",
            'icon': selection[1],
            'origin': workflow.item.uuid,
            'description': `
                <p>A constellation of a wise dragon appears on you.</p>
                <p>When you make an Intelligence or a Wisdom check or a Constitution saving throw to maintain concentration on a spell, you can treat a roll of 9 or lower on the d20 as a 10.</p>
            `,
            'duration': {
                'seconds': 600
            },
            'changes': [
                {
                    'key': 'ATL.light.dim',
                    'mode': 4,
                    'value': 20,
                    'priority': 20
                },
                {
                    'key': 'ATL.light.bright',
                    'mode': 4,
                    'value': 10,
                    'priority': 20
                },
                {
                    'key': 'ATL.light.alpha',
                    'mode': 5,
                    'value': "0.25",
                    'priority': 20
                },
                {
                    'key': 'ATL.light.angle',
                    'mode': 5,
                    'value': "360",
                    'priority': 20
                },
                {
                    'key': 'ATL.light.luminosity',
                    'mode': 5,
                    'value': "0.5",
                    'priority': 20
                },
                {
                    'key': 'ATL.light.color',
                    'mode': 5,
                    'value': "#2b58bf",
                    'priority': 20
                },
                {
                    'key': 'ATL.light.animation',
                    'mode': 5,
                    'value': '{type: "smokepatch", speed: 5, intensity: 1, reverse: false }',
                    'priority': 20
                },
                {
                    'key': 'ATL.light.attenuation',
                    'mode': 5,
                    'value': "0.8",
                    'priority': 20
                },
                {
                    'key': 'ATL.light.contrast',
                    'mode': 5,
                    'value': "0.15",
                    'priority': 20
                },
                {
                    'key': 'ATL.light.shadows',
                    'mode': 5,
                    'value': "0.2",
                    'priority': 20
                },
                {
                    'key': 'flags.midi-qol.min.ability.check.int',
                    'mode': 4,
                    'value': 10,
                    'priority': 20
                },
                {
                    'key': 'flags.midi-qol.min.ability.check.wis',
                    'mode': 4,
                    'value': 10,
                    'priority': 20
                },
                {
                    'key': 'flags.midi-qol.min.ability.save.con',
                    'mode': 4,
                    'value': 10,
                    'priority': 20
                },
            ],
            'flags': {
                'effectmacro': {
                    'onEachTurn': {
                        'script': mba.functionToString(effectMacroEveryTurn)
                    },
                    'onDelete': {
                        'script': mba.functionToString(effectMacroDel)
                    }
                }
            }
        };
        if (druidLevel >= 10) {
            effectData.changes = effectData.changes.concat(
                {
                    'key': 'system.attributes.movement.fly',
                    'mode': 4,
                    'value': 20,
                    'priority': 20
                },
            );
        }
        if (druidLevel >= 14) {
            effectData.changes = effectData.changes.concat(
                {
                    'key': 'system.traits.dr.value',
                    'mode': 2,
                    'value': "bludgeoning",
                    'priority': 20
                },
                {
                    'key': 'system.traits.dr.value',
                    'mode': 2,
                    'value': "slashing",
                    'priority': 20
                },
                {
                    'key': 'system.traits.dr.value',
                    'mode': 2,
                    'value': "piercing",
                    'priority': 20
                },
            );
        }
        if (!oldEffect) await wildShapeItem.update({ "system.uses.value": uses -= 1 });
        else if (oldEffect && druidLevel < 11) {
            await mba.removeEffect(oldEffect);
            await wildShapeItem.update({ "system.uses.value": uses -= 1 });
        }
        else if (oldEffect) await mba.removeEffect(oldEffect);
        await warpgate.wait(100);
        await mba.createEffect(workflow.actor, effectData);
    }

    new Sequence()

        .effect()
        .file(selection[1])
        .attachTo(workflow.token, { followRotation: false })
        .scaleToObject(1)
        .duration(4500)
        .fadeIn(500)
        .fadeOut(1000)
        .aboveLighting()

        .effect()
        .file("jb2a.particles.inward.blue.02.02")
        .attachTo(workflow.token)
        .scaleToObject(1.5)
        .fadeIn(1000)
        .fadeOut(1000)

        .effect()
        .file("jb2a.markers.circle_of_stars.blue")
        .attachTo(workflow.token)
        .scaleToObject(1)
        .fadeIn(2000)
        .fadeOut(1000)
        .mask()
        .persist()
        .name(`${workflow.token.document.name} Starry Form`)

        .play()
}

async function archer({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    new Sequence()

        .effect()
        .file("modules/mba-premades/icons/class/druid/starry_form_archer.webp")
        .attachTo(workflow.token)
        .scaleToObject(1)
        .duration(3500)
        .fadeIn(500)
        .fadeOut(1000)

        .effect()
        .file("jb2a.arrow.cold.blue")
        .attachTo(workflow.token)
        .stretchTo(target)
        .delay(1000)
        .filter("ColorMatrix", { hue: 10 })
        .missed(!workflow.hitTargets.size)

        .play()
}

async function chalice({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();

    new Sequence()

        .effect()
        .file("modules/mba-premades/icons/class/druid/starry_form_chalice.webp")
        .attachTo(workflow.token, { followRotation: false })
        .scaleToObject(1)
        .duration(3500)
        .fadeIn(500)
        .fadeOut(1000)
        .aboveLighting()

        .effect()
        .file("jb2a.healing_generic.03.burst.bluepurple")
        .attachTo(target)
        .scaleToObject(1.65)
        .delay(1000)
        .filter("ColorMatrix", { hue: 310 })
        .playbackRate(0.9)
        
        .effect()
        .file(`jb2a.particles.outward.blue.02.03`)
        .attachTo(target, { followRotation: false })
        .scaleToObject(1.1 * target.document.texture.scaleX)
        .delay(600)
        .duration(1000)
        .fadeOut(800)
        .scaleIn(0, 1000, { ease: "easeOutCubic" })
        .animateProperty("sprite", "width", { from: 0, to: 0.5, duration: 500, gridUnits: true, ease: "easeOutBack" })
        .animateProperty("sprite", "height", { from: 0, to: 1.5, duration: 1000, gridUnits: true, ease: "easeOutBack" })
        .animateProperty("sprite", "position.y", { from: 0, to: -0.6, duration: 1000, gridUnits: true })
        .zIndex(0.2)

        .play()
}

export let starryForm = {
    'item': item,
    'chalice': chalice,
    'archer': archer
}