// Original macro by MISC (Elwin#1410, based on Crymic's Goodberry macro)
export async function goodberry({ speaker, actor, token, character, item, args, scope, workflow }) {
    const DEFAULT_ITEM_NAME = "Goodberry";
    const SPELL_DURATION = 60 * 60 * 24;
    const SATED_TYPE = "food";
    const ALLOW_DISCIPLE_OF_LIFE_EXTRA_HEALING = true;
    const DISCIPLE_OF_LIFE_ITEM_NAME = "Disciple of Life";

    const debug = false;
    const dependencies = ["dae", "midi-qol"];
    if (!requirementsSatisfied(DEFAULT_ITEM_NAME, dependencies)) {
        return;
    }

    /**
     * If the requirements are met, returns true, false otherwise.
     *
     * @param {string} name - The name of the item for which to check the dependencies.
     * @param {Array} dependencies - The array of module ids which are required.
     *
     * @returns {boolean} true if the requirements are met, false otherwise.
     */
    function requirementsSatisfied(name, dependencies) {
        let missingDep = false;
        dependencies.forEach((dep) => {
            if (!game.modules.get(dep)?.active) {
                const errorMsg = `${name}: ${dep} must be installed and active.`;
                ui.notifications.error(errorMsg);
                console.warn(errorMsg);
                missingDep = true;
            }
        });
        return !missingDep;
    }

    if (debug) {
        console.warn(DEFAULT_ITEM_NAME, arguments);
    }

    if (args[0].tag === "OnUse" && args[0].macroPass === "postActiveEffects") {
        const macroData = args[0];
        const i18nGoodberry = initLocalization();
        const tokenActor = actor;
        const expirationTime = game.time.worldTime + SPELL_DURATION;
        let batchId = expirationTime;
        if (game.modules.get("foundryvtt-simple-calendar")?.active) {
            const result = SimpleCalendar.api.formatTimestamp(expirationTime);
            batchId = `${result.date} - ${result.time}`;
        }
        let healingValue = 1;
        if (ALLOW_DISCIPLE_OF_LIFE_EXTRA_HEALING && tokenActor.items.getName(DISCIPLE_OF_LIFE_ITEM_NAME)) {
            healingValue += 2 + workflow.itemLevel;
            const chatMessage = game.messages.get(workflow.itemCardId);
            let content = deepClone(chatMessage.content);
            const searchRegex = /(<\/div>)(\s*<div class="card-buttons">)/m;
            const replaceString = `$1\n\n<br/><p>Your ${DISCIPLE_OF_LIFE_ITEM_NAME} feature enhances the berries effectiveness.</p>\n$2`;
            content = content.replace(searchRegex, replaceString);
            await chatMessage.update({ content: content });
        }
        const newItemData = {
            name: `${workflow.item.name} (${batchId})`,
            type: "consumable",
            img: "modules/mba-premades/icons/spells/level1/goodberry.webp",
            system: {
                description: {
                    value: game.i18n.localize(i18nGoodberry.description),
                },
                quantity: 10,
                weight: 0.002,
                rarity: "common",
                activation: {
                    type: "action",
                    cost: 1,
                },
                target: { value: 1, type: "creature" },
                range: { units: "touch" },
                uses: {
                    value: 1,
                    max: "1",
                    per: "charges",
                    autoDestroy: true,
                },
                actionType: "heal",
                chatFlavor: game.i18n.localize(i18nGoodberry.chatFlavor),
                damage: { parts: [[healingValue, "healing"]] },
                consumableType: "food",
            },
            flags: {
                "midi-qol": {
                    onUseMacroName: "[preTargeting]ItemMacro,[preItemRoll]ItemMacro,[postActiveEffects]ItemMacro",
                },
                "mba-premades": { spell: { goodberry: { expirationTime: expirationTime } } },
                itemacro: {
                    macro: {
                        data: {
                            _id: null,
                            name: workflow.item.name,
                            type: "script",
                            scope: "global",
                            command: getConsumableMacro(),
                        },
                    },
                },
            },
        };
        if (game.modules.get("rest-recovery")?.active) {
            setProperty(newItemData.flags, "rest-recovery.data.consumable", {
                enabled: true,
                dayWorth: true,
                type: SATED_TYPE,
            });
        }
        
        new Sequence()

            .wait(500)

            .effect()
            .file("modules/mba-premades/icons/spells/level1/goodberry.webp")
            .from(token, { cacheLocation: true })
            .attachTo(token)
            .scale(0.4)
            .duration(10000)
            .fadeIn(500)
            .fadeOut(1000)
            .aboveLighting()
            .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 10000, delay: 500 })
            .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: 8000 })
            .spriteOffset({ x: 0.5 }, { gridUnits: true })
            .rotate((360 / 10) * 1)

            .effect()
            .file("modules/mba-premades/icons/spells/level1/goodberry.webp")
            .from(token, { cacheLocation: true })
            .attachTo(token)
            .scale(0.4)
            .duration(10000)
            .fadeIn(500)
            .fadeOut(1000)
            .aboveLighting()
            .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 10000, delay: 500 })
            .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: 8000 })
            .spriteOffset({ x: 0.5 }, { gridUnits: true })
            .rotate((360 / 10) * 2)

            .effect()
            .file("modules/mba-premades/icons/spells/level1/goodberry.webp")
            .from(token, { cacheLocation: true })
            .attachTo(token)
            .scale(0.4)
            .duration(10000)
            .fadeIn(500)
            .fadeOut(1000)
            .aboveLighting()
            .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 10000, delay: 500 })
            .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: 8000 })
            .spriteOffset({ x: 0.5 }, { gridUnits: true })
            .rotate((360 / 10) * 3)

            .effect()
            .file("modules/mba-premades/icons/spells/level1/goodberry.webp")
            .from(token, { cacheLocation: true })
            .attachTo(token)
            .scale(0.4)
            .duration(10000)
            .fadeIn(500)
            .fadeOut(1000)
            .aboveLighting()
            .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 10000, delay: 500 })
            .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: 8000 })
            .spriteOffset({ x: 0.5 }, { gridUnits: true })
            .rotate((360 / 10) * 4)

            .effect()
            .file("modules/mba-premades/icons/spells/level1/goodberry.webp")
            .from(token, { cacheLocation: true })
            .attachTo(token)
            .scale(0.4)
            .duration(10000)
            .fadeIn(500)
            .fadeOut(1000)
            .aboveLighting()
            .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 10000, delay: 500 })
            .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: 8000 })
            .spriteOffset({ x: 0.5 }, { gridUnits: true })
            .rotate((360 / 10) * 5)

            .effect()
            .file("modules/mba-premades/icons/spells/level1/goodberry.webp")
            .from(token, { cacheLocation: true })
            .attachTo(token)
            .scale(0.4)
            .duration(10000)
            .fadeIn(500)
            .fadeOut(1000)
            .aboveLighting()
            .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 10000, delay: 500 })
            .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: 8000 })
            .spriteOffset({ x: 0.5 }, { gridUnits: true })
            .rotate((360 / 10) * 6)

            .effect()
            .file("modules/mba-premades/icons/spells/level1/goodberry.webp")
            .from(token, { cacheLocation: true })
            .attachTo(token)
            .scale(0.4)
            .duration(10000)
            .fadeIn(500)
            .fadeOut(1000)
            .aboveLighting()
            .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 10000, delay: 500 })
            .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: 8000 })
            .spriteOffset({ x: 0.5 }, { gridUnits: true })
            .rotate((360 / 10) * 7)

            .effect()
            .file("modules/mba-premades/icons/spells/level1/goodberry.webp")
            .from(token, { cacheLocation: true })
            .attachTo(token)
            .scale(0.4)
            .duration(10000)
            .fadeIn(500)
            .fadeOut(1000)
            .aboveLighting()
            .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 10000, delay: 500 })
            .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: 8000 })
            .spriteOffset({ x: 0.5 }, { gridUnits: true })
            .rotate((360 / 10) * 8)

            .effect()
            .file("modules/mba-premades/icons/spells/level1/goodberry.webp")
            .from(token, { cacheLocation: true })
            .attachTo(token)
            .scale(0.4)
            .duration(10000)
            .fadeIn(500)
            .fadeOut(1000)
            .aboveLighting()
            .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 10000, delay: 500 })
            .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: 8000 })
            .spriteOffset({ x: 0.5 }, { gridUnits: true })
            .rotate((360 / 10) * 9)

            .effect()
            .file("modules/mba-premades/icons/spells/level1/goodberry.webp")
            .from(token, { cacheLocation: true })
            .attachTo(token)
            .scale(0.4)
            .duration(10000)
            .fadeIn(500)
            .fadeOut(1000)
            .aboveLighting()
            .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 10000, delay: 500 })
            .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: 8000 })
            .spriteOffset({ x: 0.5 }, { gridUnits: true })
            .rotate((360 / 10) * 10)

            .play();

        const [newItem] = await tokenActor.createEmbeddedDocuments("Item", [newItemData]);
        if (game.modules.get("about-time")?.active) {
            const eventId = game.Gametime.doAt(
                expirationTime,
                deleteGoodberries,
                macroData.actorUuid,
                game.i18n.format(i18nGoodberry.expirationEventWarn, { actorName: tokenActor.name })
            );
            const goodberryEvent = {
                expirationTime: expirationTime,
                eventId: eventId,
                actorUuid: macroData.actorUuid,
            };
            await newItem.setFlag("mba-premades", "spell.goodberry", goodberryEvent);
        }
    }

    /**
     * Initializes the i18n texts used by this item.
     *
     * @returns {object} The i18n keys to use with `game.i18n.localize` and `game.i18n.format`.
     */
    function initLocalization() {
        const i18nPrefix = "world.dnd5e.spells.goodberry";
        const i18nKeys = {
            description: i18nPrefix + ".description",
            chatFlavor: i18nPrefix + ".chatFlavor",
            expirationOnUseWarn: i18nPrefix + ".expirationOnUseWarn",
            expirationEventWarn: i18nPrefix + ".expirationEventWarn",
        };
        if (getProperty(globalThis, i18nPrefix + ".i18n")) {
            return i18nKeys;
        }
        const i18nData = {
            description:
                "<p>Eating a berry restores 1 hit point, and the berry provides enough nourishment to sustain a creature for one day.</p>",
            chatFlavor: "[healing] 10 Berries (1 can be eaten per action)",
            expirationOnUseWarn: "The berries lost their potency and vanish",
            expirationEventWarn: "Some berries lost their potency and vanish from {actorName}:",
        };

        const existingData = getProperty(game.i18n.translations, i18nPrefix) ?? {};
        setProperty(game.i18n.translations, i18nPrefix, mergeObject(existingData, i18nData, { overwrite: false }));
        setProperty(globalThis, i18nPrefix + ".i18n", true);

        return i18nKeys;
    }

    function getConsumableMacro() {
        return `
    // Default name of the item
    const DEFAULT_ITEM_NAME = "${DEFAULT_ITEM_NAME}";
    const debug = ${debug};

    if (debug) {
    console.warn(DEFAULT_ITEM_NAME, arguments);
    }

    if (args[0].tag === "OnUse" && args[0].macroPass === "preTargeting") {
    return await handleGoodBerryPreTargeting(workflow);
    } else if (args[0].tag === "OnUse" && args[0].macroPass === "preItemRoll") {
    await handleGoodBerryPreItemRoll(workflow);
    } else if (args[0].tag === "OnUse" && args[0].macroPass === "postActiveEffects") {
    await handleGoodBerryPostActiveEffects(workflow);
    }

    ${initLocalization.toString()}

    ${handleGoodBerryPreTargeting.toString()}

    ${handleGoodBerryPreItemRoll.toString()}

    ${handleGoodBerryPostActiveEffects.toString()}

    ${deleteGoodberries.toString()}

    ${getActorConsumableValues.toString()}

    ${isRealNumber.toString()}
    `;
    }

    /**
     * Handles the preTrageting phase of the workflow. Validates that the good berries are not expired, when expired the workflow
     * is cancelled and the berries are delete. If About Time is active, it registers a call back to delete the berries when they expire.
     * If there are no selected targets and the current midi setting does not allow late targeting, it selects the actor's token and
     * setup a hook on midi-qol.RollComplete to unselect it after.
     *
     * @param {*} gbWorkflow The current workflow.
     * @returns {boolean} true if the workflow should continue, false otherwise.
     */
    async function handleGoodBerryPreTargeting(gbWorkflow) {
        if (gbWorkflow.item.system.target.type !== "creature") {
            const newTarget = deepClone(gbWorkflow.item.system.target);
            newTarget.value = 1;
            newTarget.type = "creature";
            gbWorkflow.item.system.target = newTarget;
        }

        const i18nGoodberry = initLocalization();
        const expirationTime = getProperty(gbWorkflow.item, "flags.mba-premades.spell.goodberry.expirationTime") ?? 0;
        if (game.time.worldTime >= expirationTime) {
            ui.notifications.warn(game.i18n.localize(i18nGoodberry.expirationOnUseWarn));
            await gbWorkflow.item.delete();
            return false;
        }
        if (game.modules.get("about-time")?.active) {
            if (gbWorkflow.item.getFlag("mba-premades", "spell.goodberry")?.actorUuid !== gbWorkflow.actor.uuid) {
                const eventId = game.Gametime.doAt(
                    expirationTime,
                    deleteGoodberries,
                    gbWorkflow.actor.uuid,
                    game.i18n.format(i18nGoodberry.expirationEventWarn, { actorName: gbWorkflow.actor.name })
                );
                const goodberryEvent = { expirationTime: expirationTime, eventId: eventId, actorUuid: gbWorkflow.actor.uuid };
                await gbWorkflow.item.setFlag("mba-premades", "spell.goodberry", goodberryEvent);
            }
        }
        if (game.user?.targets?.size === 0) {
            const midiUtils = await import("/modules/midi-qol/src/module/utils.js");
            if ((midiUtils?.getLateTargeting() ?? "none") === "none") {
                const newTarget = deepClone(gbWorkflow.item.system.target);
                newTarget.value = null;
                newTarget.type = "self";
                gbWorkflow.item.system.target = newTarget;
                Hooks.once(`midi-qol.RollComplete.${gbWorkflow.itemUuid}`, (_) => {
                    if (gbWorkflow.item.system.target.type !== "self") {
                        console.warn(`${DEFAULT_ITEM_NAME} | Target type already reset.`);
                        return;
                    }
                    const newTarget = deepClone(gbWorkflow.item.system.target);
                    newTarget.value = 1;
                    newTarget.type = "creature";
                    gbWorkflow.item.system.target = newTarget;
                });
            }
        }
        return true;
    }

    /**
     * Handles the preItemRoll phase of the workflow. If the target is not the one that used the item and
     * Rest Recovery is active, sets the proper hooks to handle the benefits of the consumption on the target.
     *
     * @param {MidiQOL.Workflow} gbWorkflow The current workflow.
     */
    async function handleGoodBerryPreItemRoll(gbWorkflow) {
        setProperty(gbWorkflow, "workflowOptions.fastForwardDamage", true);
        setProperty(gbWorkflow, "workflowOptions.autoRollDamage", "always");
        const consumable = getProperty(gbWorkflow.item, "flags.rest-recovery.data.consumable");
        if (consumable) {
            consumable.enabled = true;
        }

        if (gbWorkflow.targets.first()?.id !== gbWorkflow.token.id) {
            if (
                game.modules.get("rest-recovery")?.active &&
                consumable &&
                game.settings.get("rest-recovery", "enable-food-and-water")
            ) {
                gbWorkflow.customUniqueId = randomID();
                consumable.enabled = false;
                Hooks.once("dnd5e.itemUsageConsumption", (item, _, __, usage) => {
                    const itemWorkflow = MidiQOL.Workflow.getWorkflow(item?.uuid);
                    if (gbWorkflow.customUniqueId !== itemWorkflow?.customUniqueId) {
                        console.warn(
                            `${DEFAULT_ITEM_NAME} | dnd5e.itemUsageConsumption hook called for a different workflow, expected ${gbWorkflow.id} but was ${itemWorkflow?.id}`
                        );
                        return;
                    }
                    gbWorkflow.goodberryItem = { usage: usage, origUsage: deepClone(item.system?.uses ?? {}) };
                });
            }
        }
    }

    /**
     * Handles postActiveEffects phase of the workflow. If Rest Recovery is active and food and water setting is enabled,
     * also handles food or food and water consumption for an actor other than the owner of the good berry.
     * This duplicates some code from Rest Recovery because it doesn't currently support it.
     *
     * @param {MidiQOL.Workflow} gbWorkflow The current workflow.
     * @returns {void}
     */
    async function handleGoodBerryPostActiveEffects(gbWorkflow) {
        const consumable = getProperty(gbWorkflow.item, "flags.rest-recovery.data.consumable");
        if (consumable) {
            consumable.enabled = true;
        }
        const targetToken = gbWorkflow.targets?.first();
        if (!targetToken) {
            return;
        }
        if (
            !(
                targetToken.id !== gbWorkflow.token.id &&
                game.modules.get("rest-recovery")?.active &&
                consumable &&
                game.settings.get("rest-recovery", "enable-food-and-water")
            )
        ) {
            return;
        }

        const actorUpdates = {};
        let { actorRequiredFood, actorRequiredWater, actorFoodSatedValue, actorWaterSatedValue } = getActorConsumableValues(
            targetToken.actor
        );

        const currCharges = gbWorkflow.goodberryItem?.origUsage?.value;
        const newCharges =
            getProperty(gbWorkflow.goodberryItem?.usage?.itemUpdates, "system.uses.value") ?? currCharges - 1.0;
        const chargesUsed = currCharges < newCharges ? currCharges : currCharges - newCharges;

        let message;

        if (consumable.type === "both") {
            actorUpdates["flags.rest-recovery.data.sated.food"] = consumable.dayWorth
                ? 100000000000
                : actorFoodSatedValue + chargesUsed;
            actorUpdates["flags.rest-recovery.data.sated.water"] = consumable.dayWorth
                ? 100000000000
                : actorWaterSatedValue + chargesUsed;

            const localize = "REST-RECOVERY.Chat.ConsumedBoth" + (consumable.dayWorth ? "DayWorth" : "");
            message =
                "<p>" +
                game.i18n.format(localize, {
                    actorName: targetToken.name,
                    itemName: item.name,
                    charges: chargesUsed,
                }) +
                "</p>";

            if (!consumable.dayWorth) {
                message +=
                    actorUpdates["flags.rest-recovery.data.sated.food"] >= actorRequiredFood
                        ? "<p>" + game.i18n.localize("REST-RECOVERY.Chat.SatedFood") + "</p>"
                        : "<p>" +
                        game.i18n.format("REST-RECOVERY.Chat.RequiredSatedFood", {
                            units: actorRequiredFood - actorUpdates["flags.rest-recovery.data.sated.food"],
                        }) +
                        "</p>";
                message +=
                    actorUpdates["flags.rest-recovery.data.sated.water"] >= actorRequiredWater
                        ? "<p>" + game.i18n.localize("REST-RECOVERY.Chat.SatedWater") + "</p>"
                        : "<p>" +
                        game.i18n.format("REST-RECOVERY.Chat.RequiredSatedWater", {
                            units: actorRequiredWater - actorUpdates["flags.rest-recovery.data.sated.water"],
                        }) +
                        "</p>";
            }
        } else if (consumable.type === "food") {
            actorUpdates["flags.rest-recovery.data.sated.food"] = consumable.dayWorth
                ? 100000000000
                : actorFoodSatedValue + chargesUsed;

            const localize = "REST-RECOVERY.Chat.ConsumedFood" + (consumable.dayWorth ? "DayWorth" : "");
            message =
                "<p>" +
                game.i18n.format(localize, {
                    actorName: targetToken.name,
                    itemName: item.name,
                    charges: chargesUsed,
                }) +
                "</p>";

            message +=
                actorUpdates["flags.rest-recovery.data.sated.food"] >= actorRequiredFood
                    ? "<p>" + game.i18n.localize("REST-RECOVERY.Chat.SatedFood") + "</p>"
                    : "<p>" +
                    game.i18n.format("REST-RECOVERY.Chat.RequiredSatedFood", {
                        units: actorRequiredFood - actorUpdates["flags.rest-recovery.data.sated.food"],
                    }) +
                    "</p>";
        }

        if (!foundry.utils.isEmpty(actorUpdates)) {
            const daeGmAction = await import("/modules/dae/module/GMAction.js");
            await daeGmAction?.socketlibSocket.executeAsGM("_updateActor", {
                actorUuid: targetToken.actor.uuid,
                update: actorUpdates,
            });
        }

        if (message) {
            await ChatMessage.create({
                flavor: "Rest Recovery",
                user: game.user.id,
                speaker: ChatMessage.getSpeaker({ actor: gbWorkflow.actor }),
                content: message,
            });
        }
    }

    /**
     * Deletes expired good berries from an actor.
     *
     * @param {String} actorUuid UUID of actor for which to process expired good berries.
     * @param {*} goodberryExpirationEventWarn Warning message to be displayed in chat if some berries were deleted.
     * @returns {void}
     */
    async function deleteGoodberries(actorUuid, goodberryExpirationEventWarn) {
        const tokenOrActor = await fromUuid(actorUuid);
        let actor;
        if (tokenOrActor instanceof CONFIG.Token.documentClass) {
            actor = tokenOrActor.actor;
        }
        if (tokenOrActor instanceof CONFIG.Actor.documentClass) {
            actor = tokenOrActor;
        }
        if (!actor) {
            return;
        }
        const now = game.time.worldTime;
        const itemsToDelete = actor.itemTypes.consumable.filter(
            (it) =>
                getProperty(it, "flags.mba-premades.spell.goodberry.expirationTime") &&
                now >= getProperty(it, "flags.mba-premades.spell.goodberry.expirationTime")
        );
        if (itemsToDelete.length > 0) {
            const deletedItems = await actor.deleteEmbeddedDocuments(
                "Item",
                itemsToDelete.map((it) => it.id)
            );
            let whisperTo = [];
            const player = MidiQOL.playerForActor(actor);
            if (player) {
                whisperTo.push(player);
            }
            await ChatMessage.create({
                user: game.user?.id,
                speaker: { scene: game.canvas.scene?.id, alias: game.user?.name, user: game.user?.id },
                content: goodberryExpirationEventWarn + " " + deletedItems.map((it) => it.name).join(),
                whisper: whisperTo.map((u) => u.id),
                type: CONST.CHAT_MESSAGE_TYPES.OTHER,
            });
        }
    }

    function getActorConsumableValues(actor) {
        const actorFoodSatedValue = getProperty(actor, "flags.rest-recovery.data.sated.food") ?? 0;
        const actorWaterSatedValue = getProperty(actor, "flags.rest-recovery.data.sated.water") ?? 0;
        const actorNeedsNoFoodWater = getProperty(actor, "flags.dnd5e.noFoodWater");
        const actorNeedsNoFood = getProperty(actor, "flags.dae.rest-recovery.force.noFood");
        const actorNeedsNoWater = getProperty(actor, "flags.dae.rest-recovery.force.noWater");
        const foodUnitsSetting = game.settings.get("rest-recovery", "food-units-per-day");
        const actorRequiredFoodUnits =
            getProperty(actor, "flags.dae.rest-recovery.require.food") ?? getProperty(actor, "flags.dnd5e.foodUnits");
        let actorRequiredFood =
            isRealNumber(actorRequiredFoodUnits) && foodUnitsSetting !== 0 ? actorRequiredFoodUnits : foodUnitsSetting;
        const waterUnitsSetting = game.settings.get("rest-recovery", "water-units-per-day");
        const actorRequiredWaterUnits =
            getProperty(actor, "flags.dae.rest-recovery.require.water") ?? getProperty(actor, "flags.dnd5e.waterUnits");
        let actorRequiredWater =
            isRealNumber(actorRequiredWaterUnits) && waterUnitsSetting !== 0 ? actorRequiredWaterUnits : waterUnitsSetting;
        actorRequiredFood = actorNeedsNoFoodWater || actorNeedsNoFood ? 0 : actorRequiredFood;
        actorRequiredWater = actorNeedsNoFoodWater || actorNeedsNoWater ? 0 : actorRequiredWater;
        return {
            actorRequiredFood,
            actorRequiredWater,
            actorFoodSatedValue,
            actorWaterSatedValue,
        };
    }

    function isRealNumber(inNumber) {
        return !isNaN(inNumber) && typeof inNumber === "number" && isFinite(inNumber);
    }
}