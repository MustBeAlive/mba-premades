//To do: animations
export async function ceremony({ speaker, actor, token, character, item, args, scope, workflow }) {
    const target = workflow.targets.first();
    let choices = [
        ['Atonement', 'Atonement'],
        ['Bless Water', 'Water'],
        ['Coming of Age', 'Age'],
        ['Dedication', 'Dedication'],
        ['Funeral Rite', 'Funeral'],
        ['Wedding', 'Wedding']
    ];
    let selection = await chrisPremades.helpers.dialog('Choose one of the following rites:', choices);
    if (!selection) {
        return;
    }
    switch (selection) {
        case 'Atonement': {
            let spellDC = 20;
            await chrisPremades.helpers.rollRequest(workflow.token, 'skill', 'ins');
            break;
        }
        case 'Water': {
            let waterFlask = workflow.actor.items.filter(i => i.name === "Water Flask")[0];
            if (waterFlask.system.quantity > 1) {
                waterFlask.update({ "system.quantity": waterFlask.system.quantity - 1 });
            } else {
                workflow.actor.deleteEmbeddedDocuments("Item", [waterFlask.id]);
            }
            let holyWater = workflow.actor.items.filter(i => i.name === "Holy Water")[0];
            if (!holyWater) {
                const itemData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Items', 'Holy Water', false);
                if (!itemData) {
                    ui.notifications.warn("Unable to find item in compenidum! (Holy Water)");
                    return
                }
                await workflow.actor.createEmbeddedDocuments("Item", [itemData]);
            } else {
                holyWater.update({ "system.quantity": emptyFlaskItem.system.quantity + 1 });
            }
            break;
        }
        case 'Age': {
            const effectData = {
                'name': "Ceremony: Coming of Age",
                'icon': workflow.item.img,
                'origin': workflow.item.uuid,
                'description': "Whenever you make an ability check, you can roll a d4 and add the number rolled to the ability check.",
                'duration': {
                    'seconds': 86400
                },
                'changes': [
                    {
                        'key': 'system.bonuses.abilities.check',
                        'mode': 2,
                        'value': "+1d4",
                        'priority': 20
                    }
                ],
                'flags': {
                    'midi-qol': {
                        'castData': {
                            baseLevel: 1,
                            castLevel: workflow.castData.castLevel,
                            itemUuid: workflow.item.uuid
                        }
                    }
                }
            };
            await chrisPremades.helpers.createEffect(target.actor, effectData);
            break;
        }
        case 'Dedication': {
            const effectData = {
                'name': "Ceremony: Dedication",
                'icon': workflow.item.img,
                'origin': workflow.item.uuid,
                'description': "Whenever you make a saving throw, you can roll a d4 and add the number rolled to the save.",
                'duration': {
                    'seconds': 86400
                },
                'changes': [
                    {
                        'key': 'system.bonuses.abilities.save',
                        'mode': 2,
                        'value': "+1d4",
                        'priority': 20
                    }
                ],
                'flags': {
                    'midi-qol': {
                        'castData': {
                            baseLevel: 1,
                            castLevel: workflow.castData.castLevel,
                            itemUuid: workflow.item.uuid
                        }
                    }
                }
            };
            await chrisPremades.helpers.createEffect(target.actor, effectData);
            break;
        }
        case 'Funeral': {
            const effectData = {
                'name': "Ceremony: Funeral Rite",
                'icon': workflow.item.img,
                'origin': workflow.item.uuid,
                'description': "For the next 7 days you can't become undead",
                'duration': {
                    'seconds': 604800
                },
                'flags': {
                    'midi-qol': {
                        'castData': {
                            baseLevel: 1,
                            castLevel: workflow.castData.castLevel,
                            itemUuid: workflow.item.uuid
                        }
                    }
                }
            };
            await chrisPremades.helpers.createEffect(target.actor, effectData);
            break;
        }
        case 'Wedding': {
            let targets = Array.from(workflow.targets);
            if (targets.length != 2) {
                ui.notifications.warn('Wrong ammount of targets!');
                return;
            }
            for (let target of targets) {
                let type = chrisPremades.helpers.raceOrType(target.actor);
                if (type != 'humanoid') {
                    ui.notifications.warn('One of the targets is not human!');
                    return;
                }
            }

            let t1 = targets[0];
            let t2 = targets[1];

            async function effectMacro() {
                let effect = chrisPremades.helpers.findEffect(actor, 'Ceremony: Wedding');
                let partnerName = effect.flags['mba-premades']?.spell?.ceremony?.name;
                let nearbyPartner = await MidiQOL.findNearby(null, token, 30, { includeIncapacitated: true }).filter(i => i.name === partnerName);
                if (!nearbyPartner.length) return;
                const effectData = {
                    'name': "Ceremony: AC bonus",
                    'icon': "modules/mba-premades/icons/spells/level1/ceremony3.webp",
                    'duration': {
                        turns: 1,
                    },
                    'changes': [
                        {
                            'key': 'system.attributes.ac.bonus',
                            'mode': 2,
                            'value': "+2",
                            'priority': 20
                        }
                    ],
                    'flags': {
                        'midi-qol': {
                            'castData': {
                                baseLevel: 1,
                                castLevel: workflow.castData.castLevel,
                                itemUuid: workflow.item.uuid
                            }
                        }
                    }
                }
                await chrisPremades.helpers.createEffect(actor, effectData);
            }
            const effectData1 = {
                'name': "Ceremony: Wedding",
                'icon': "modules/mba-premades/icons/spells/level1/ceremony2.webp",
                'description': "For the next 7 days, you have a +2 bonus to AC while you are within 30 feet of your partner.",
                'duration': {
                    'seconds': 604800
                },
                'flags': {
                    'mba-premades': {
                        'spell': {
                            'ceremony': {
                                'name': t2.document.name
                            }
                        }
                    },
                    'effectmacro': {
                        'onEachTurn': {
                            'script': chrisPremades.helpers.functionToString(effectMacro)
                        }
                    }
                }
            };
            const effectData2 = {
                'name': "Ceremony: Wedding",
                'icon': "modules/mba-premades/icons/spells/level1/ceremony2.webp",
                'description': "For the next 7 days, you have a +2 bonus to AC while you are within 30 feet of your partner.",
                'duration': {
                    'seconds': 604800
                },
                'flags': {
                    'mba-premades': {
                        'spell': {
                            'ceremony': {
                                'name': t1.document.name
                            }
                        }
                    },
                    'effectmacro': {
                        'onEachTurn': {
                            'script': chrisPremades.helpers.functionToString(effectMacro)
                        }
                    }
                }
            };
            await chrisPremades.helpers.createEffect(t1.actor, effectData1);
            await chrisPremades.helpers.createEffect(t2.actor, effectData2);
        }
    }
}