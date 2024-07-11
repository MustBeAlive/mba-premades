import { constants } from "./constants.js";
import { diseases } from "./diseases.js";
import { jumping } from "./jumping.js";
import { mba } from "../../helperFunctions.js";
import { seanse } from "./ouija.js";
import { weather } from "./weather.js";

export async function gameMasterHelper() {
    let choices = [
        ["Art Shower", "art"],
        ["Disease Creator", "disease"],
        ["Disposition Changer", "disposition"],
        ["Jumping Helper", "jump"],
        ["GM Inspiration Distributor", "inspiration"],
        ["Mass Token Show/Hide", "showhide"],
        ["Money Manager", "money"],
        ["Ouija Board Seanse", "seanse"],
        ["Surprised Condition Distributor", "surprise"],
        ["Weather Selector", "weather"]
    ];
    let helperType = await mba.dialog("GM Helper: Type", choices, `<b>What would you like to do?</b>`);
    if (!helperType) return;
    let sceneTokens = [];
    if (helperType === "art") {
        let target;
        if (!game.user._lastSelected) target = game.user.targets.first();
        else target = await fromUuidSync(game.user._lastSelected).object;
        if (!target) {
            ui.notifications.warn("Need to select or target token!");
            return;
        }
        const artImage = target.actor.img;
        const tokenImage = target.document.texture.src;
        let artSelection = await new Promise(async (resolve) => {
            let buttons = {
                "Art": {
                    label: `<img src='${artImage}' width='75' height='100' style='border: 0px; float: left'><p style='padding: 1%; font-size: 25px'> Art</p>`,
                    callback: () => {
                        resolve(artImage)
                    }
                },
                "Token": {
                    label: `<img src='${tokenImage}' width='100' height='100' style='border: 0px; float: left'><p style='padding: 1%; font-size: 25px'> Token</p>`,
                    callback: () => {
                        resolve(tokenImage)
                    }
                }
            };
            let height = (Object.keys(buttons).length * 85);
            let dialog = new Dialog(
                {
                    title: "GM Helper: Art Shower",
                    buttons,
                    close: () => resolve(false)
                },
                {
                    height: height
                }
            );
            await dialog._render(true);
        });
        if (artSelection === false) return;
        const show = new ImagePopout(artSelection);
        show.render(true);
        show.shareImage();
    }
    else if (helperType === "disease") {
        await diseases.creator();
    }
    else if (helperType === "disposition") {
        let oldDisp = await mba.dialog("GM Helper: Disposition", [["Ally", 1], ["Neutral", 0], ["Enemy", -1], ["Secret", -2]], `Choose <b>CURRENT</b> disposition of tokens you would like to change:</b>`);
        if (!oldDisp) return;
        for (let i of game.canvas.scene.tokens) {
            if (i.disposition === oldDisp) sceneTokens.push(i.object);
        }
        if (!sceneTokens.length) {
            ui.notifications.warn("No tokens of chose disposition found!");
            return;
        }
        let selection = await mba.selectTarget("GM Helper: Disposition", constants.okCancel, sceneTokens, false, "multiple", undefined, false, "Choose tokens to change disposition:");
        if (!selection.buttons) return;
        let newDisp = await mba.dialog("GM Helper: Disposition", [["Ally", 1], ["Neutral (BORKED?)", 0], ["Enemy", -1], ["Secret", -2]], `Choose <b>NEW</b> disposition:</b>`);
        if (!newDisp) return;
        let newTargets = selection.inputs.filter(i => i).slice(0);
        mba.updateTargets(newTargets);
        await warpgate.wait(100)
        let targets = Array.from(game.user.targets);
        for (let target of targets) {
            if (newDisp === 1) await target.document.update({ disposition: 1 });
            else if (newDisp === 0) await target.document.update({ disposition: 0 });
            else if (newDisp === -1) await target.document.update({ disposition: -1 });
            else if (newDisp === -2) await target.document.update({ disposition: -2 });
        }
    }
    else if (helperType === "jump") {
        await jumping();
    }
    else if (helperType === "inspiration") {
        const playerCharacterIDs = game.users.players.filter(u => u.character).map(u => u.character.id);
        const playerOwnedTokens = canvas.tokens.placeables.filter(t => playerCharacterIDs.includes(t.actor.id));
        if (!playerOwnedTokens.length) {
            ui.notifications.info("Current scene does not contain any player owned tokens!");
            return;
        }
        let selection = await mba.selectTarget("GM Helper: Inspiration", constants.okCancel, playerOwnedTokens, false, 'multiple', undefined, false, `<b>Choose player to give inspiration to:</b>`);
        if (!selection.buttons) return;
        let newTargets = selection.inputs.filter(i => i).slice(0);
        mba.updateTargets(newTargets);
        await warpgate.wait(100)
        let targets = Array.from(game.user.targets);
        const effectData = {
            "name": "GM Inspiration",
            "icon": "modules/mba-premades/icons/generic/gm_inspiration.webp",
            'description': `
                <p>You can spend GM Inspiration Token on any roll to give yourself advantage in that particular roll.</p>
                <p>Жетон вдохновения от ГМа — его можно потратить на один любой бросок (до конца сессии), чтобы получить в нем преимущество.</p>
            `,
            'changes': [
                {
                    'key': 'flags.midi-qol.optional.inspirationGM.label',
                    'mode': 5,
                    'value': 'GM Inspiration',
                    'priority': 20
                },
                {
                    'key': 'flags.midi-qol.optional.inspirationGM.check.all',
                    'mode': 5,
                    'value': "reroll",
                    'priority': 20
                },
                {
                    'key': 'flags.midi-qol.optional.inspirationGM.skill.all',
                    'mode': 5,
                    'value': "reroll",
                    'priority': 20
                },
                {
                    'key': 'flags.midi-qol.optional.inspirationGM.save.all',
                    'mode': 5,
                    'value': "reroll",
                    'priority': 20
                },
                {
                    'key': 'flags.midi-qol.optional.inspirationGM.attack.all',
                    'mode': 5,
                    'value': "reroll",
                    'priority': 20
                },
                {
                    'key': 'flags.midi-qol.optional.inspirationGM.count',
                    'mode': 5,
                    'value': 1,
                    'priority': 20
                },
            ],
            'flags': {
                'dae': {
                    'showIcon': true
                }
            }
        };
        for (let target of targets) {
            new Sequence()

                .effect()
                .file("jb2a.bardic_inspiration.blueyellow")
                .attachTo(target)
                .scaleToObject(2)
                .zIndex(2)
                .fadeOut(1000)

                .effect()
                .file("jb2a.markers.music.blueyellow")
                .attachTo(target)
                .scaleToObject(1.2)
                .delay(500)
                .fadeIn(1000)
                .fadeOut(1000)
                .zIndex(1)

                .thenDo(async () => {
                    await mba.createEffect(target.actor, effectData);
                })

                .play()
        }

    }
    else if (helperType === "money") {
        let selection = await mba.dialog("GM Helper: Money Manager", [["Single Target Edit", "single"], ["Mass Money Edit", "mass"]], "<b></b>");
        if (!selection) return;
        if (selection === "single") {
            const playerCharacterIDs = game.users.players.filter(u => u.character).map(u => u.character.id);
            const playerOwnedTokens = canvas.tokens.placeables.filter(t => playerCharacterIDs.includes(t.actor.id));
            if (!playerOwnedTokens.length) {
                ui.notifications.info("Current scene does not contain any player owned tokens!");
                return;
            }
            let selection = await mba.selectTarget("GM Helper: Money Manager", constants.okCancel, playerOwnedTokens, false, 'one', undefined, false, `<b>Choose character:</b>`);
            if (!selection.buttons) return;
            let newTargets = selection.inputs.filter(i => i).slice(0);
            let target = await canvas.scene.tokens.get(newTargets[0]);
            let choicesMoney = [
                [`<b>Copper</b> (Current: ${target.actor.system.currency.cp})`, "cp"],
                [`<b>Silver</b> (Current: ${target.actor.system.currency.sp})`, "sp"],
                [`<b>Gold</b> (Current: ${target.actor.system.currency.gp})`, "gp"],
                [`<b>Platinum</b> (Current: ${target.actor.system.currency.pp})`, "pp"],
            ];
            let selectionMoney = await mba.dialog("GM Helper: Money Manager", choicesMoney, "<b>Select type:</b>");
            if (!selectionMoney) return;
            let path = `system.currency.${selectionMoney}`;
            let oldValue = foundry.utils.getProperty(target.actor, path);
            const formula = await warpgate.menu({
                inputs: [{
                    type: `text`,
                    label: `Input formula<br>(+20 or -20 or similar)`,
                    options: ``
                }],
                buttons: [{
                    label: `Ok`,
                    value: 1
                }]
            }, { title: `GM Helper: Money Manager` }
            );
            let input = +formula.inputs[0];
            if ((oldValue + input) < 0) {
                ui.notifications.warn("Wrong input!");
                return;
            }
            await target.actor.update({ [path]: oldValue + input });
        }
        else if (selection === "mass") {
            ui.notifications.info("Under Construction!");
        }
    }
    else if (helperType === "seanse") {
        await seanse();
    }
    else if (helperType === "showhide") {
        let type = await mba.dialog("GM Helper: Hide/Show", [["Show Tokens", "show"], ["Hide Tokens", "hide"]], "<b>Choose one:</b>");
        if (!type) return;
        let hidden = true;
        if (type === "hide") hidden = false;
        for (let i of game.canvas.scene.tokens) {
            if (i.hidden === hidden) sceneTokens.push(i.object);
        }
        if (!sceneTokens.length) {
            ui.notifications.warn("Unable to find tokens!");
            return;
        }
        let selection = await mba.selectTarget("GM Helper: Show/Hide", constants.okCancel, sceneTokens, false, "multiple", undefined, false, `Choose tokens to <b>${type}</b>:`);
        if (!selection.buttons) return;
        let newTargets = selection.inputs.filter(i => i).slice(0);
        mba.updateTargets(newTargets);
        await warpgate.wait(100)
        let targets = Array.from(game.user.targets);
        for (let target of targets) {
            if (type === "show") await target.document.update({ "hidden": false });
            else await target.document.update({ "hidden": true })
        }
    }
    else if (helperType === "surprise") {
        for (let i of game.canvas.scene.tokens) {
            if (i.hidden === true) continue;
            sceneTokens.push(i.object);
        }
        if (!sceneTokens.length) {
            ui.notifications.warn("Unable to find tokens (are they all hidden?)");
            return;
        }
        let selection = await mba.selectTarget("GM Helper: Surprise", constants.okCancel, sceneTokens, false, "multiple", undefined, false, "Choose tokens to add <b>Surprised</b> condition to:");
        if (!selection.buttons) return;
        let newTargets = selection.inputs.filter(i => i).slice(0);
        mba.updateTargets(newTargets);
        await warpgate.wait(100)
        let targets = Array.from(game.user.targets);
        if (!targets.length) return;
        async function effectMacroDel() {
            Sequencer.EffectManager.endEffects({ name: `${token.document.name} SPRS` })
        };
        let effectData = {
            'name': "Surprised",
            'icon': "modules/mba-premades/icons/conditions/surprised.webp",
            'description': `
                <p>If you're surprised, you can't move or take an action on your first turn of the combat, and you can't take a reaction until that turn ends. A member of a group can be surprised even if the other members aren't.</p>
                <p>Существо, оказавшееся захваченным врасплох, не может перемещаться и совершать действия в первом ходу сражения, и, пока это состояние не окончится, не может совершать реакции.</p>
            `,
            'duration': {
                'rounds': 1
            },
            'flags': {
                'dae': {
                    'showIcon': true,
                },
                'effectmacro': {
                    'onDelete': {
                        'script': mba.functionToString(effectMacroDel)
                    }
                }
            }
        };
        for (let target of targets) {
            if (mba.findEffect(target.actor, "Foresight")) continue;
            new Sequence()

                .effect()
                .name("Surprise")
                .file("modules/mba-premades/icons/conditions/overlay/surprise1.webp")
                .attachTo(target, { bindAlpha: false })
                .scaleToObject(0.6)
                .anchor({ x: 0.5, y: 1.55 })
                .scaleIn(0, 1000, { ease: "easeOutElastic" })
                .scaleOut(0, 1000, { ease: "easeOutExpo" })
                .loopProperty("sprite", "position.y", { from: 0, to: -15, duration: 1500, pingPong: true })
                .persist()
                .name(`${target.document.name} SPRS`)

                .effect()
                .name("Surprise")
                .file("modules/mba-premades/icons/conditions/overlay/surprise2.webp")
                .attachTo(target, { bindAlpha: false })
                .scaleToObject(0.45)
                .scaleIn(0, 1000, { ease: "easeOutElastic" })
                .scaleOut(0, 1000, { ease: "easeOutExpo" })
                .anchor({ x: -0.3, y: 1.25 })
                .loopProperty("sprite", "position.y", { from: 0, to: -15, duration: 1500, pingPong: true })
                .persist()
                .name(`${target.document.name} SPRS`)

                .thenDo(async () => {
                    await mba.createEffect(target.actor, effectData);
                })

                .play();
        }
    }
    else if (helperType === "weather") {
        await weather();
    }
}