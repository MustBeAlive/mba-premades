import {mba} from "../../../helperFunctions.js";

// To do: fix distance calculation (horisonal movement); animations;

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let featureData = await mbaPremades.helpers.getItemFromCompendium('mba-premades.MBA Spell Features', 'Telekinesis: Move Creature', false);
    if (!featureData) return;
    async function effectMacroDel() {
        await warpgate.revert(token.document, "Telekinesis");
    }
    async function effectMacroStart() {
        let effect = mbaPremades.helpers.findEffect(actor, "Telekinesis");
        let targetEffect = await fromUuid(effect.flags['mba-premades']?.spell?.telekinesis?.targetEffectUuid);
        if (!targetEffect) return;
        let selection = await mbaPremades.helpers.dialog('Use action to keep the creature restrained?', mbaPremades.constants.yesNo, "<b></b>");
        if (!selection) {
            let updates = {
                'flags': {
                    'dae': {
                        'specialDuration': ['turnEndSource']
                    }
                }
            };
            await mbaPremades.helpers.updateEffect(targetEffect, updates)
        }
        let targetUuid = effect.flags['mba-premades']?.spell?.telekinesis?.targetUuid;
        let target = await fromUuidSync(targetUuid).object;
        let spellAbility = token.actor.system.attributes.spellcasting;
        let casterRoll = await mbaPremades.helpers.rollRequest(token, 'abil', spellAbility);
        let targetRoll = await mbaPremades.helpers.rollRequest(target, 'abil', 'str');
        if (casterRoll.total > targetRoll.total) return;
        let updates = {
            'flags': {
                'dae': {
                    'specialDuration': ['turnEndSource']
                }
            }
        };
        await mbaPremades.helpers.updateEffect(targetEffect, updates)
    };
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'duration': {
            'seconds': 600
        },
        'flags': {
            'effectmacro': {
                'onTurnStart': {
                    'script': mba.functionToString(effectMacroStart)
                },
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 5,
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
        'name': "Telekinesis",
        'description': "Telekinesis"
    };
    await warpgate.mutate(workflow.token.document, updates, {}, options);
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let effect = mba.findEffect(workflow.actor, "Telekinesis");
    if (mba.getSize(target.actor) > 4) {
        ui.notifications.warn("Target is too big to push!");
        return;
    }
    let spellAbility = workflow.actor.system.attributes.spellcasting;
    let casterRoll = await mba.rollRequest(workflow.token, 'abil', spellAbility);
    let targetRoll = await mba.rollRequest(target, 'abil', 'str');
    if (casterRoll.total <= targetRoll.total) return;
    let distance = 30;
    while (distance > 0) {
        let choices = [
            ['Horisontally', 'hor'],
            ['Vertically', 'ver'],
            ['Stop Moving', 'stop']
        ];
        await mba.playerDialogMessage(game.user);
        let selection = await mba.dialog("Telekinesis", choices, `<p>Which way would you like to move the <u>${target.document.name}</u>?</p><p>Distance left: ${distance} feet</p>`);
        await mba.clearPlayerDialogMessage();
        if (!selection) return;
        if (selection === "hor") {
            let oldCenter = target.center;
            let interval = target.document.width % 2 === 0 ? 1 : -1;
            await mba.playerDialogMessage(game.user);
            let position = await mba.aimCrosshair(target, distance, workflow.item.img, interval, target.document.width);
            await mba.clearPlayerDialogMessage();
            if (position.cancelled) return;
            let newCenter = canvas.grid.getSnappedPosition(position.x - target.w / 2, position.y - target.h / 2, 1);
            let targetUpdate = {
                'token': {
                    'x': newCenter.x,
                    'y': newCenter.y
                }
            };
            let options = {
                'permanent': true,
                'name': workflow.item.name,
                'description': workflow.item.name,
            };
            //let diff = canvas.grid.measureDistance(oldCenter, newCenter, { 'gridSpaces': true });
            let ray = new Ray(oldCenter, newCenter);
            let diff = canvas.grid.measureDistances([{ ray }], { 'gridSpaces': true });//[0];
            console.log(diff);
            await warpgate.mutate(target.document, targetUpdate, {}, options);
            //distance -= diff; debugging
            if (distance < 5) distance = 0;
        }
        else if (selection === "ver") {
            await mba.playerDialogMessage(game.user);
            await new Promise((resolve) => {
                new Dialog({
                    title: `Set elevation (Max: ${distance})`,
                    content: `<input id="ammount" type="number" value=""/>`,
                    buttons: {
                        up: {
                            label: "Up",
                            callback: async () => {
                                let targetElevation = target.document.elevation;
                                let change = +Math.abs(ammount.value);
                                if (change > distance) resolve(distance);
                                let newElevation = targetElevation + change;
                                let elevationUpdate = {
                                    'token': {
                                        'elevation': newElevation
                                    }
                                };
                                //distance -= change; debugging
                                if (distance < 5) distance = 0;
                                await warpgate.mutate(target.document, elevationUpdate, {}, { permanent: true });
                                await mba.clearPlayerDialogMessage();
                                resolve(distance);
                            },
                        },
                        down: {
                            label: "Down",
                            callback: async () => {
                                let targetElevation = target.document.elevation;
                                let change = +Math.abs(ammount.value);
                                if (change > distance) resolve(distance);
                                let newElevation = targetElevation - change;
                                if (newElevation < 0) resolve(distance);
                                let elevationUpdate = {
                                    'token': {
                                        'elevation': newElevation
                                    }
                                };
                                //distance -= change; debugging
                                if (distance < 5) distance = 0;
                                await warpgate.mutate(target.document, elevationUpdate, {}, { permanent: true });
                                await mba.clearPlayerDialogMessage();
                                resolve(distance);
                            },
                        },
                        cancel: {
                            label: "Cancel",
                            callback: async () => {
                                await mba.clearPlayerDialogMessage();
                                resolve(distance);
                            },
                        },
                    },
                    default: "Apply"
                }).render(true);
            });
        }
        else if (selection === "stop") distance = 0;
    }
    async function effectMacroElev() {
        let elevation = token.document.elevation;
        if (elevation <= 0) return;
        let calc = Math.floor(elevation / 10);
        if (calc < 1) {
            token.document.update({ "elevation": 0 })
            if (!mbaPremades.helpers.findEffect(token.actor, "Prone")) await mbaPremades.helpers.addCondition(token.actor, 'Prone');
            return;
        }
        let damageFormula = calc + "d6[bludgeoning]";
        let damageRoll = await new Roll(damageFormula).roll({ async: true });
        damageRoll.toMessage({ 
            rollMode: 'roll',
            speaker: { 'alias': name },
            flavor: 'Fall Damage'
        });
        await mbaPremades.helpers.applyDamage([token], damageRoll.total, 'bludgeoning');
        if (!mbaPremades.helpers.findEffect(actor, "Prone")) await mbaPremades.helpers.addCondition(actor, 'Prone');
        token.document.update({ "elevation": 0 })
    }
    let effectData = {
        'name': "Telekinesis: Restrained",
        'icon': "modules/mba-premades/icons/spells/level5/telekinesis.webp",
        'description': `
            <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.gfRbTxGiulUylAjE]{Restrained} by telekinetic power.</p>
        `,
        'origin': effect.flags['midi-qol'].castData.itemUuid,
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': 'Restrained',
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroElev)
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 5,
                    castLevel: effect.flags['midi-qol'].castData.castLevel,
                    itemUuid: effect.flags['midi-qol'].castData.itemUuid
                }
            },
        }
    };
    let targetEffect = await mba.createEffect(target.actor, effectData);
    let updates = {
        'flags': {
            'mba-premades': {
                'spell': {
                    'telekinesis': {
                        'targetEffectUuid': targetEffect.uuid,
                        'targetUuid': target.document.uuid
                    }
                }
            }
        }
    }
    await mba.updateEffect(effect, updates)
}

export let telekinesis = {
    'cast': cast,
    'item': item
}