import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let radius = (workflow.castData.castLevel - 2) * 5;
    let templateData = {
        't': 'circle',
        'user': game.user,
        'distance': radius,
        'direction': 0,
        'fillColor': game.user.color,
        'flags': {
            'dnd5e': {
                'origin': workflow.item.uuid
            },
            'midi-qol': {
                'originUuid': workflow.item.uuid
            },
            'walledtemplates': {
                'hideBorder': "alwaysHide",
                'wallRestriction': 'light',
                'wallsBlock': 'recurse',
            }
        },
        'angle': 0
    };
    let template = await mba.placeTemplate(templateData);
    if (!template) return;

    new Sequence()

        .effect()
        .file("jb2a.magic_signs.circle.02.enchantment.complete.pink")
        .attachTo(template)
        .scaleToObject(1)
        .persist()
        .name(`${workflow.token.document.name} Confus`)

        .effect()
        .file("jb2a.sleep.cloud.01.yellow")
        .attachTo(template)
        .scaleToObject(2)
        .delay(2000)
        .fadeOut(2000)
        .scaleIn(0, 1500, { ease: "easeOutCubic" })
        .opacity(0.8)
        .persist()
        .name(`${workflow.token.document.name} Confus`)

        .play()

    let targetUuids = Array.from(game.user.targets).map(t => t.document.uuid);
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Confusion: Save", false);
    if (!featureData) {
        Sequencer.EffectManager.endEffects({ name: `${workflow.token.document.name} Confus` })
        await mba.removeCondition(workflow.actor, "Concentrating");
        return;
    }
    delete featureData._id;
    let saveDC = mba.getSpellDC(workflow.item);
    featureData.system.save.dc = saveDC;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions(targetUuids);
    await game.messages.get(workflow.itemCardId).delete();
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (!featureWorkflow.failedSaves.size) {
        Sequencer.EffectManager.endEffects({ name: `${workflow.token.document.name} Confus` })
        await mba.removeCondition(workflow.actor, "Concentrating");
        return;
    }
    async function effectMacroTurnStart() {
        await mbaPremades.macros.confusion.item(token);
    }
    async function effectMacroConfusionDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} ConfTa` })
        let effect = await mbaPremades.helpers.findEffect(actor, "Reaction");
        if (effect) await mbaPremades.helpers.removeEffect(effect);
    }
    let effectData = {
        'name': "Confusion",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are affected by delusions, which provoke uncontrolled action. You can't take reactions and must roll a d10 at the start of each of your turns to determine your behaviour:</p>
            <p><b>1:</b> You use all of your movement to move in a random direction, which will be determined by a d8 roll. You don't take any other actions this turn.</p>
            <p><b>2-6:</b> You don't move or take actions this turn.</p>
            <p><b>7-8:</b> You must use your action to make a melee attack against a randomly determined target within your reach. If there is no targets within your reach, you do nothing this turn.</p>
            <p><b>9-10</b> You can act normally.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `turn=end, saveAbility=wis, saveDC=${saveDC}, saveMagic=true, name=Confusion: Turn End (DC${saveDC}), killAnim=true`,
                'priority': 20
            }
        ],
        'flags': {
            'effectmacro': {
                'onTurnStart': {
                    'script': mba.functionToString(effectMacroTurnStart)
                },
                'onDelete': {
                    'script': mba.functionToString(effectMacroConfusionDel)
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 4,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    for (let target of featureWorkflow.failedSaves) {
        new Sequence()

            .thenDo(async () => {
                let reaction = await mba.findEffect(target.actor, "Reaction");
                if (!reaction) await mba.addCondition(target.actor, "Reaction");
                let newEffect = await mba.createEffect(target.actor, effectData);
                let concData = workflow.actor.getFlag("midi-qol", "concentration-data.removeUuids");
                concData.push(newEffect.uuid);
                await workflow.actor.setFlag("midi-qol", "concentration-data.removeUuids", concData);
            })

            .effect()
            .file("jaamod.spells_effects.confusion")
            .attachTo(target)
            .scaleToObject(1)
            .fadeIn(1000)
            .fadeOut(1000)
            .waitUntilFinished(-500)

            .effect()
            .file("jb2a.template_circle.symbol.normal.stun.purple")
            .attachTo(target)
            .scaleToObject(1.5)
            .fadeIn(500)
            .fadeOut(2000)
            .filter("ColorMatrix", { hue: 140 })
            .mask()
            .persist()
            .name(`${target.document.name} ConfTa`)

            .play()
    }
    Sequencer.EffectManager.endEffects({ name: `${workflow.token.document.name} Confus` });
    await template.delete();
}

async function item(token) {
    if (mba.findEffect(token.actor, "Confusion")) {
        let reaction = await mba.findEffect(token.actor, "Reaction");
        if (!reaction) await mba.addCondition(token.actor, "Reaction");
    }
    let confusionRoll = await new Roll("1d10").roll({ 'async': true });
    await MidiQOL.displayDSNForRoll(confusionRoll);
    let result = confusionRoll.total;
    if (result === 1) {
        new Sequence()

            .effect()
            .file("jaamod.spells_effects.confusion")
            .attachTo(token)
            .scaleToObject(1)
            .fadeIn(500)
            .fadeOut(1000)

            .play()

        let directionRoll = await new Roll("1d8").roll({ 'async': true });
        await MidiQOL.displayDSNForRoll(directionRoll);
        const directions = ["", "North", "North-East", "East", "South-East", "South", "South-West", "West", "North-West"];
        const directionContent = directions[directionRoll.total];
        const walkSpeedFeet = token.actor.system.attributes.movement.walk;
        const gridDistance = canvas.dimensions.distance;
        const pixelsPerFoot = canvas.scene.grid.size / gridDistance;
        const moveDistancePixels = walkSpeedFeet * pixelsPerFoot;
        const diagonalMultiplier = Math.SQRT2;
        let moveX = 0;
        let moveY = 0;
        switch (directionContent) {
            case "North":
                moveY = -moveDistancePixels;
                break;
            case "North-East":
                moveX = moveDistancePixels / diagonalMultiplier;
                moveY = -moveDistancePixels / diagonalMultiplier;
                break;
            case "East":
                moveX = moveDistancePixels;
                break;
            case "South-East":
                moveX = moveDistancePixels / diagonalMultiplier;
                moveY = moveDistancePixels / diagonalMultiplier;
                break;
            case "South":
                moveY = moveDistancePixels;
                break;
            case "South-West":
                moveX = -moveDistancePixels / diagonalMultiplier;
                moveY = moveDistancePixels / diagonalMultiplier;
                break;
            case "West":
                moveX = -moveDistancePixels;
                break;
            case "North-West":
                moveX = -moveDistancePixels / diagonalMultiplier;
                moveY = -moveDistancePixels / diagonalMultiplier;
                break;
        }
        const position = {
            x: token.center.x + moveX,
            y: token.center.y + moveY
        }
        new Sequence()

            .effect()
            .file("jb2a.zoning.inward.indicator.loop.redyellow.01.02")
            .atLocation(position)
            .size(1.5, { gridUnits: true })
            .duration(7000)
            .fadeIn(1000)
            .fadeOut(1000)

            .effect()
            .file("jb2a.zoning.directional.loop.redyellow.line400.02")
            .attachTo(token)
            .stretchTo(position)
            .duration(7000)
            .fadeIn(1000)
            .fadeOut(1000)

            .thenDo(async () => {
                ChatMessage.create({
                    content: `
                            <p>Roll result: <b>${result}</b></p>
                            <p>Direction roll: <b>${directionRoll.total}</b></p>
                            <p><b>${token.document.name}</b> uses all its movement to move in <u>${directionContent}</u> direction.</p>
                        `,
                    speaker: { actor: token.actor }
                });
            })

            .play()
    }
    else if (result > 1 && result < 7) {
        new Sequence()

            .effect()
            .file("jaamod.spells_effects.confusion")
            .attachTo(token)
            .scaleToObject(1)
            .fadeIn(500)
            .fadeOut(1000)

            .thenDo(async () => {
                ChatMessage.create({
                    content: `
                        <p>Roll result: <b>${result}</b></p>
                        <p><b>${token.document.name}</b> doesn't move or take actions this turn.</p>
                    `,
                    speaker: { actor: token.actor }
                });
            })

            .play()
    }
    else if (result > 6 && result < 9) {
        new Sequence()

            .effect()
            .file("jaamod.spells_effects.confusion")
            .attachTo(token)
            .scaleToObject(1)
            .fadeIn(500)
            .fadeOut(1000)

            .play()

        let weapons = token.actor.items.filter(i => i.type === "weapon" && i.system.equipped && i.system.actionType === "mwak");
        let range = 5;
        if (weapons.length) {
            for (let weapon of weapons) {
                let weaponRange = weapon.system.range.value;
                if (weaponRange > range) range = weaponRange;
            }
        }
        let nearbyTargets = await mba.findNearby(token, range, "any", false, false, true, true);
        if (!nearbyTargets.length) {
            ChatMessage.create({
                content: `
                    <p>Roll result: <b>${result}</b></p>
                    <p><b>${token.document.name}</b> doesn't move or take actions this turn (no available targets).</p>
                `,
                speaker: { actor: token.actor }
            });
            return;
        }
        let target;
        if (nearbyTargets.length === 1) target = nearbyTargets[0];
        else {
            let targetRoll = await new Roll(`1d${nearbyTargets.length}`).roll({ 'async': true });
            await MidiQOL.displayDSNForRoll(targetRoll);
            target = nearbyTargets[targetRoll.total - 1];
        }
        new Sequence()

            .thenDo(async () => {
                ChatMessage.create({
                    content: `
                        <p>Roll result: <b>${result}</b></p>
                        <p><b>${token.document.name}</b> must attack <u>${target.document.name}</u> with a melee attack.</p>`,
                    speaker: { actor: token.actor }
                });
            })

            .effect()
            .file("jb2a.ui.indicator.redyellow.02.01")
            .attachTo(target)
            .scaleToObject(1.25)
            .duration(5000)
            .fadeOut(500)
            .scaleIn(0.5, 300, { ease: "easeOutCubic" })
            .loopProperty("sprite", "position.x", { values: [-50, 50, 0, 0, 0, 0, 0], duration: 1000, ease: "easeInOutCubic" })
            .loopProperty("sprite", "position.y", { values: [-100, 100, 0, 0, 0, 0, 0], duration: 1000, ease: "easeInOutCubic" })
            .zIndex(1)

            .effect()
            .file("jb2a.token_stage.round.red.02.01")
            .attachTo(target)
            .scaleToObject(1.25)
            .delay(2000)
            .duration(5000)
            .fadeOut(2000)
            .opacity(0.75)

            .play()
    }
    else if (result > 8) {
        ChatMessage.create({
            content: `
                <p>Roll result: <b>${result}</b></p>
                <p><b>${token.document.name}</b> can act normally.</p>
            `,
            speaker: { actor: token.actor }
        });
    }
}

export let confusion = {
    'cast': cast,
    'item': item
}