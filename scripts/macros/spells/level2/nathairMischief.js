import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;
    async function effectMacroTurnStart() {
        await mbaPremades.macros.nathairMischief.item(token, actor);
    };
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p></p>
        `,
        'duration': {
            'seconds': 60
        },
        'flags': {
            'effectmacro': {
                'onTurnStart': {
                    'script': mba.functionToString(effectMacroTurnStart)
                }
            },
            'mba-premades': {
                'spell': {
                    'nathairMischief': {
                        'castLevel': workflow.castData.castLevel,
                        'firstRound': true,
                        'originUuid': workflow.item.uuid,
                        'saveDC': mba.getSpellDC(workflow.item),
                        'templateUuid': template.uuid
                    }
                }
            }
        }
    };
    await mba.createEffect(workflow.actor, effectData);
    await nathairMischief.item(workflow.token, workflow.actor);
}

async function item(token, actor) {
    let effect = await mba.findEffect(actor, "Nathair's Mischief");
    if (!effect) {
        ui.notifications.warn("Unable to find effect! (Nathair's Mischief)");
        return;
    }
    let castLevel = effect.flags['mba-premades']?.spell?.nathairMischief?.castLevel;
    let firstRound = effect.flags['mba-premades']?.spell?.nathairMischief?.firstRound;
    let originUuid = effect.flags['mba-premades']?.spell?.nathairMischief?.originUuid;
    let saveDC = effect.flags['mba-premades']?.spell?.nathairMischief?.saveDC;
    let template = await fromUuid(effect.flags['mba-premades']?.spell?.nathairMischief?.templateUuid);
    if (firstRound === false) {
        let choices = [["Move template up to 10 feet before the roll", "move"], ["Roll on Mishievous Surge Table", "roll"]];
        await mba.playerDialogMessage();
        let movePromt = await mba.dialog("Nathair's Mischief", choices, "<b>What would you like to do?</b>");
        await mba.clearPlayerDialogMessage();
        if (movePromt === "move") {
            let templateCenter = {
                'x': template.x + (canvas.grid.size * 2),
                'y': template.y + (canvas.grid.size * 2)
            };
            let position;
            let distance = 0;
            let icon = "modules/mba-premades/icons/spells/level2/nathair_mischief.webp";
            let maxRange = 10;
            let ray;
            let checkDistance = async (crosshairs) => {
                while (crosshairs.inFlight) {
                    await warpgate.wait(100);
                    ray = new Ray(templateCenter, crosshairs);
                    distance = canvas.grid.measureDistances([{ ray }], { 'gridSpaces': true })[0];
                    if (token.checkCollision(ray.B, { 'origin': ray.A, 'type': 'move', 'mode': 'any' }) || distance > maxRange) {
                        crosshairs.icon = 'modules/mba-premades/icons/conditions/incapacitated.webp';
                    } else {
                        crosshairs.icon = icon;
                    }
                    crosshairs.draw();
                    crosshairs.label = distance + '/' + maxRange + 'ft.';
                }
            }
            let callbacks = {
                'show': checkDistance
            }
            let options = {
                'size': 5,
                'icon': icon,
                'label': '0 ft.',
                'interval': 1
            }
            if (!maxRange) position = await warpgate.crosshairs.show(options);
            position = await warpgate.crosshairs.show(options, callbacks);
            let updates = {
                'x': position.x - (canvas.grid.size * 2), //cringe?
                'y': position.y - (canvas.grid.size * 2)  //cringe?
            };
            if (position.canceled) {
                ui.notifications.warn("Failed to choose position, returning!");
                return;
            }
            await template.update(updates);
        }
    }
    else if (firstRound === true) {
        let updates = {
            'flags': {
                'mba-premades': {
                    'spell': {
                        'nathairMischief': {
                            'firstRound': false
                        }
                    }
                }
            }
        };
        await mba.updateEffect(effect, updates);
    }
    let effectRoll = await new Roll("1d4").roll({ 'async': true });
    await MidiQOL.displayDSNForRoll(effectRoll);
    let content;
    let saveAbility;
    let type;
    switch (effectRoll.total) {
        case 1: {
            content = `<p>Mischievous Surge roll: <b>${effectRoll.total}</b> (Charm)</p>`;
            saveAbility = 'wis';
            type = "charmed";
            break;
        }
        case 2: {
            content = `<p>Mischievous Surge roll: <b>${effectRoll.total}</b> (Blind)</p>`;
            saveAbility = 'dex';
            type = "blinded";
            break;
        }
        case 3: {
            content = `<p>Mischievous Surge roll: <b>${effectRoll.total}</b> (Incapacitate)</p>`;
            saveAbility = 'wis';
            type = "incapacitated";
            break;
        }
        case 4: {
            content = `<p>Mischievous Surge roll: <b>${effectRoll.total}</b> (Difficult Terrain)</p>`;
            saveAbility = 'wis';
            type = "terrain";
            break;
        }
    };
    ChatMessage.create({
        content: content,
        speaker: { actor: actor }
    });
    async function effectMacroOnCreate() {
        await mbaPremades.helpers.dialog("Nathair's Mischief", [["Ok!", "ok"]], `
            You are incapacitated from giggling and must use <b>all of your movement</b> to <b>move in a random direction</b>.
        `);
    };
    let effectData;
    if (type != "terrain") {
        let targetIDs = await game.modules.get('templatemacro').api.findContained(template);
        if (!targetIDs.length) {
            ui.notifications.info("No targets in the template!");
            return;
        }
        let targetUuids = [];
        for (let ID of targetIDs) {
            let targetDoc = canvas.scene.tokens.get(ID);
            targetUuids.push(targetDoc.uuid);
        }
        if (type === "charmed") {
            effectData = {
                'name': "Nathair's Mischief: Charm",
                'icon': "modules/mba-premades/icons/spells/level2/nathair_mischief.webp",
                'origin': originUuid,
                'description': `
                    <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.SVd8xu3mTZMqz8fL]{Charmed} until the start of Nathair's Mischief caster's next turn.</p>
                `,
                'changes': [
                    {
                        'key': "macro.CE",
                        'mode': 0,
                        'value': "Charmed",
                        'priority': 20
                    }
                ],
                'flags': {
                    'dae': {
                        'showIcon': true,
                        'specialDuration': ['turnStartSource']
                    },
                    'midi-qol': {
                        'castData': {
                            baseLevel: 2,
                            castLevel: castLevel,
                            itemUuid: originUuid
                        }
                    }
                }
            };
            Sequencer.EffectManager.endEffects({ name: `Nathair Mischief` });
            new Sequence()

                .effect()
                .file("jb2a.cast_shape.square.01.purple")
                .attachTo(template)
                .scaleToObject(1.1)
                .fadeIn(300)
                .waitUntilFinished(-1500)

                .effect()
                .file("jb2a.template_square.symbol.normal.heart.pink")
                .attachTo(template)
                .scaleToObject(1.2)
                .fadeIn(500)
                .fadeOut(1000)
                .persist()
                .name(`Nathair Mischief`)

                .play()
        }
        else if (type === "blinded") {
            effectData = {
                'name': "Nathair's Mischief: Blind",
                'icon': "modules/mba-premades/icons/spells/level2/nathair_mischief.webp",
                'origin': originUuid,
                'description': `
                    <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.3NxmNhGQQqUDnu73]{Blinded} until the start of Nathair's Mischief caster's next turn.</p>
                `,
                'changes': [
                    {
                        'key': "macro.CE",
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
                    'midi-qol': {
                        'castData': {
                            baseLevel: 2,
                            castLevel: castLevel,
                            itemUuid: originUuid
                        }
                    }
                }
            };
            Sequencer.EffectManager.endEffects({ name: `Nathair Mischief` });
            new Sequence()

                .effect()
                .file("jb2a.cast_shape.square.01.blue")
                .attachTo(template)
                .scaleToObject(1.1)
                .fadeIn(300)
                .waitUntilFinished(-1500)

                .effect()
                .file("jb2a.plant_growth.01.square.4x4.complete.bluepurple")
                .attachTo(template)
                .scaleToObject(1.3)
                .fadeIn(500)
                .fadeOut(1000)
                .belowTokens()
                .persist()
                .name(`Nathair Mischief`)

                .play()
        }
        else if (type === "incapacitated") {
            effectData = {
                'name': "Nathair's Mischief: Giggling",
                'icon': "modules/mba-premades/icons/spells/level2/nathair_mischief.webp",
                'origin': originUuid,
                'description': `
                    <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.LCcuJNMKrGouZbFJ]{Incapacitated} from giggling and must use <u>all of your movement to move in a random direction</u>.</p>
                `,
                'changes': [
                    {
                        'key': "macro.CE",
                        'mode': 0,
                        'value': "Incapacitated",
                        'priority': 20
                    }
                ],
                'flags': {
                    'dae': {
                        'showIcon': true,
                        'specialDuration': ['turnStartSource']
                    },
                    'effectmacro': {
                        'onCreate': {
                            'script': mba.functionToString(effectMacroOnCreate)
                        }
                    },
                    'midi-qol': {
                        'castData': {
                            baseLevel: 2,
                            castLevel: castLevel,
                            itemUuid: originUuid
                        }
                    }
                }
            };
            Sequencer.EffectManager.endEffects({ name: `Nathair Mischief` });
            new Sequence()

                .effect()
                .file("jb2a.cast_shape.square.01.purple")
                .attachTo(template)
                .scaleToObject(1.1)
                .fadeIn(300)
                .waitUntilFinished(-1500)

                .effect()
                .file("jb2a.template_square.symbol.normal.fear.dark_purple")
                .attachTo(template)
                .scaleToObject(1.2)
                .fadeIn(500)
                .fadeOut(1000)
                .persist()
                .name(`Nathair Mischief`)

                .play()
        }
        let featureData = await mba.getItemFromCompendium('mba-premades.MBA Spell Features', "Nathair's Mischief: Save", false);
        if (!featureData) return;
        delete featureData._id;
        featureData.system.save.ability = saveAbility;
        featureData.system.save.dc = saveDC;
        let feature = new CONFIG.Item.documentClass(featureData, { 'parent': actor });
        let [config, options] = constants.syntheticItemWorkflowOptions(targetUuids);
        let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
        if (!featureWorkflow.failedSaves.size) return;
        let failedTargets = Array.from(featureWorkflow.failedSaves);
        let concData = actor.getFlag("midi-qol", "concentration-data.removeUuids");
        for (let target of failedTargets) {
            let newEffect = await mba.createEffect(target.actor, effectData);
            concData.push(newEffect.uuid);
        }
        await actor.setFlag("midi-qol", "concentration-data.removeUuids", concData);
    }
    else {
        Sequencer.EffectManager.endEffects({ name: `Nathair Mischief` });
        new Sequence()

            .effect()
            .file("jb2a.cast_shape.square.01.yellow")
            .attachTo(template)
            .scaleToObject(1.1)
            .fadeIn(300)
            .waitUntilFinished(-1500)

            .effect()
            .file("jb2a.template_square.symbol.normal.drop.red")
            .attachTo(template)
            .scaleToObject(1.2)
            .fadeIn(500)
            .fadeOut(1000)
            .filter("ColorMatrix", { hue: 40 })
            .persist()
            .name(`Nathair Mischief`)

            .play()
    }
}

export let nathairMischief = {
    'cast': cast,
    'item': item
}