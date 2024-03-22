async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let featureData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Spell Features', 'Telekinesis: Push Creature', false);
    if (!featureData) return;
    async function effectMacroDel() {
        await warpgate.revert(token.document, 'Telekinesis: Push Creature');
    }
    async function effectMacroStart() {
        let effect = chrisPremades.helpers.findEffect(actor, "Telekinesis");
        let targetEffectUuid = effect.flags['mba-premades']?.spell?.telekinesis?.targetEffectUuid;
        if (!targetEffectUuid) return;
        let targetEffect = await fromUuid(targetEffectUuid);
        if (!targetEffect) return;
        let choices = [
            ['Yes', 'yes'],
            ['No', 'no']
        ];
        let selection = await chrisPremades.helpers.dialog('Use action to keep the creature restrained?', choices);
        if (!selection) return;
        switch (selection) {
            case 'yes': {
                let targetUuid = effect.flags['mba-premades']?.spell?.telekinesis?.targetUuid;
                let target = await fromUuidSync(targetUuid).object;
                let spellAbility = actor.system.attributes.spellcasting;
                let casterRoll = await chrisPremades.helpers.rollRequest(token, 'abil', spellAbility);
                let targetRoll = await chrisPremades.helpers.rollRequest(target, 'abil', 'str');
                if (casterRoll.total <= targetRoll.total) {
                    let updates = {
                        'flags': {
                            'dae': {
                                'specialDuration': ['turnEndSource']
                            }
                        }
                    };
                    await chrisPremades.helpers.updateEffect(targetEffect, updates)
                }
                break;
            }
            case 'no': {
                let updates = {
                    'flags': {
                        'dae': {
                            'specialDuration': ['turnEndSource']
                        }
                    }
                };
                await chrisPremades.helpers.updateEffect(targetEffect, updates)
            }
        }
    };
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'duration': {
            'seconds': 600
        },
        'origin': workflow.item.uuid,
        'flags': {
            'effectmacro': {
                'onTurnStart': {
                    'script': chrisPremades.helpers.functionToString(effectMacroStart)
                },
                'onDelete': {
                    'script': chrisPremades.helpers.functionToString(effectMacroDel)
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
        'name': featureData.name,
        'description': featureData.name
    };
    await warpgate.mutate(workflow.token.document, updates, {}, options);
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let effect = chrisPremades.helpers.findEffect(workflow.actor, "Telekinesis");
    let size = await chrisPremades.helpers.getSize(target.actor);
    if (size > 4) {
        ui.notifications.warn("Target is too big to push!");
        return;
    }
    let spellAbility = workflow.actor.system.attributes.spellcasting;
    let casterRoll = await chrisPremades.helpers.rollRequest(workflow.token, 'abil', spellAbility);
    let targetRoll = await chrisPremades.helpers.rollRequest(target, 'abil', 'str');
    if (casterRoll.total <= targetRoll.total) return;
    let distance = 30;
    while (distance > 0) {
        let choices = [["Distance left: " + distance + " ft.", 'nope'], ['Horisontally', 'hor'], ['Vertically', 'ver'], ['Stop Moving', 'stop']];
        let selection = await chrisPremades.helpers.dialog('Which way do you wish move the target?', choices);
        if (!selection) return;
        switch (selection) {
            case 'hor': {
                let maxRange = distance;
                let icon = target.document.texture.src;
                let interval = target.document.width % 2 === 0 ? 1 : -1;
                let oldCenter = target.center;
                let position = await chrisPremades.helpers.aimCrosshair(target, maxRange, icon, interval, target.document.width);
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
                    'updateOpts': { 'token': { 'animate': true } }
                };
                let diff = canvas.grid.measureDistance(oldCenter, newCenter, { 'gridSpaces': true });
                await warpgate.mutate(target.document, targetUpdate, {}, options);
                distance -= diff;
                if (distance < 5) distance = 0;
                break;
            }
            case 'ver': {
                await new Promise((resolve) => {
                    new Dialog({
                        title: `Set elevation (Max: ${distance})`,
                        content: `<input id="ammount" type="number" value=""/>`,
                        buttons: {
                            up: {
                                label: "Up",
                                callback: async (html) => {
                                    let targetElevation = target.document.elevation;
                                    let change = +Math.abs(ammount.value);
                                    if (change > distance) resolve(distance);
                                    let newElevation = targetElevation + change;
                                    let elevationUpdate = {
                                        'token': {
                                            'elevation': newElevation
                                        }
                                    };
                                    distance -= change;
                                    if (distance < 5) distance = 0;
                                    await warpgate.mutate(target.document, elevationUpdate, {}, { permanent: true });
                                    resolve(distance);
                                },
                            },
                            down: {
                                label: "Down",
                                callback: async (html) => {
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
                                    distance -= change;
                                    if (distance < 5) distance = 0;
                                    await warpgate.mutate(target.document, elevationUpdate, {}, { permanent: true });
                                    resolve(distance);
                                },
                            },
                            cancel: {
                                label: "Cancel",
                                callback: async (html) => {
                                    resolve(distance);
                                },
                            },
                        },
                        default: "Apply"
                    }).render(true);
                });
                break;
            }
            case 'stop': {
                distance = 0;
                break;
            }
        }
    }
    async function effectMacroElev() {
        const tokenDoc = token.document;
        let elevation = tokenDoc.elevation;
        if (elevation <= 0) return;
        let calc = Math.floor(elevation / 10);
        console.log(calc);
        if (calc < 1) {
            tokenDoc.update({ "elevation": 0 })
            await chrisPremades.helpers.addCondition(actor, 'Prone');
            return;
        }
        let damageFormula = calc + "d6[bludgeoning]";
        let damageRoll = await new Roll(damageFormula).roll({ async: true });
        damageRoll.toMessage({ rollMode: 'roll', speaker: { 'alias': name }, flavor: 'Fall Damage' });
        await chrisPremades.helpers.applyDamage([token], damageRoll.total, 'bludgeoning');
        await chrisPremades.helpers.addCondition(actor, 'Prone');
        tokenDoc.update({ "elevation": 0 })
    }
    let effectData = {
        'name': "Telekinesis: Restrained",
        'icon': "assets/library/icons/sorted/spells/level5/telekinesis.webp",
        'description': "You are restrained by telekinetic power.",
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
            'midi-qol': {
                'castData': {
                    baseLevel: 5,
                    castLevel: effect.flags['midi-qol'].castData.castLevel,
                    itemUuid: effect.flags['midi-qol'].castData.itemUuid
                }
            },
            'effectmacro': {
                'onDelete': {
                    'script': chrisPremades.helpers.functionToString(effectMacroElev)
                }
            }
        }
    };
    let targetEffect = await chrisPremades.helpers.createEffect(target.actor, effectData);
    let updates = {
        'flags': {
            'mba-premades': {
                'spell': {
                    'telekinesis': {
                        'targetEffectUuid': targetEffect.uuid,
                        'targetUuid': target.document.uuid
                    }
                }
            },
            'effectMacro': {
                'onDelete': {
                    'script': ""
                }
            }
        }
    }
    await chrisPremades.helpers.updateEffect(effect, updates)
}

export let telekinesis = {
    'cast': cast,
    'item': item
}