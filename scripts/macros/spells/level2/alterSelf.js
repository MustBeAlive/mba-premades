export async function alterSelf({ speaker, actor, token, character, item, args, scope, workflow }) {
    let source = workflow.actor;
    let effectData;
    let choices = [
        ['Aquatic Adaptation', 'aquatic'],
        ['Change Appearance', 'change'],
        ['Natural Weapons', 'natural']
    ];
    let selection = await chrisPremades.helpers.dialog('Choose command:', choices);
    if (!selection) {
        return;
    }
    switch (selection) {
        case 'aquatic': {
            effectData = {
                'name': 'Alter Self',
                'icon': 'assets/library/icons/sorted/spells/level2/alter_self.webp',
                'description': 'You adapt your body to an aquatic environment, sprouting gills and growing webbing between your fingers. You can breathe underwater and gain a swimming speed equal to your walking speed.',
                'origin': workflow.item.uuid,
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
            await chrisPremades.helpers.createEffect(source, effectData);
            break;
        }
        case 'change': {
            effectData = {
                'name': 'Alter Self',
                'icon': 'assets/library/icons/sorted/spells/level2/alter_self.webp',
                'description': 'You transform your appearance. You decide what you look like, including your height, weight, facial features, sound of your voice, hair length, coloration, and distinguishing characteristics, if any. You can make yourself appear as a member of another race, though none of your statistics change. You also can\'t appear as a creature of a different size than you, and your basic shape stays the same; if you are bipedal, you can\'t use this spell to become quadrupedal, for instance. At any time for the duration of the spell, you can use your action to change your appearance in this way again.',
                'origin': workflow.item.uuid,
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
            await chrisPremades.helpers.createEffect(source, effectData);
            break;
        }
        case 'natural': {
            let featureData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Spell Features', 'Alter Self: Unarmed Strike', false);
            if (!featureData) {
                ui.notifications.warn('Missing item in the compendium! (Alter Self: Unarmed Strike)');
                return;
            }
            let damageTypes = [
                ['Piercing', 'piercing'],
                ['Slashing', 'slashing'],
                ['Bludgeoning', 'bludgeoning']
            ];
            let chooseDamage = await chrisPremades.helpers.dialog('Choose damage type:', damageTypes);
            if (!chooseDamage) {
                ui.notifications.warn('Failed to choose damage type, try again');
                return;
            }
            let damageParts;
            switch (chooseDamage) {
                case 'piercing': {
                    damageParts = [["1d6 + @mod + 1", "piercing"]];
                    break;
                }
                case 'slashing': {
                    damageParts = [["1d6 + @mod + 1", "slashing"]];
                    break;
                }
                case 'bludgeoning': {
                    damageParts = [["1d6 + @mod + 1", "bludgeoning"]];
                }
            }
            featureData.system.damage.parts = damageParts;
            async function effectMacro() {
                await warpgate.revert(token.document, 'Alter Self: Unarmed Strike');
            }
            effectData = {
                'label': 'Alter Self',
                'icon': 'assets/library/icons/sorted/spells/level2/alter_self.webp',
                'description': 'You grow claws, fangs, spines, horns, or a different natural weapon of your choice. Your unarmed strikes deal 1d6 piercing, slashing or bludgeoning damage, as appropriate to the natural weapon you chose, and you are proficient with your unarmed strikes. Finally, the natural weapon is magic and you have a +1 bonus to the attack and damage rolls you make using it.',
                'origin': workflow.item.uuid,
                'duration': {
                    'seconds': 3600
                },
                'flags': {
                    'effectmacro': {
                        'onDelete': {
                            'script': chrisPremades.helpers.functionToString(effectMacro)
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
            let updates = {
                'embedded': {
                    'Item': {
                        [featureData.name]: featureData,
                    },
                    'ActiveEffect': {
                        [effectData.label]: effectData
                    }
                }
            };
            let options = {
                'permanent': false,
                'name': 'Alter Self: Unarmed Strike',
                'description': 'Alter Self: Unarmed Strike'
            };
            await warpgate.mutate(workflow.token.document, updates, {}, options);
        }
    }
}