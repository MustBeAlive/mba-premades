export async function ceremony({speaker, actor, token, character, item, args, scope, workflow}) {
    const target = workflow.targets.first();
    const targets = workflow.targets;
    const source = workflow.actor;
    let choices  = [
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
            const saveRollData =  {
                request: "skill",
                targetUuid: token.actor.uuid,
                ability: "ins",
                options: {
                    chatMessage: true,
                    flavor: `DC${spellDC} vs Atonement (Insight)`,
                },
            };
            const userID = MidiQOL.playerForActor(workflow.actor).id;
            const save = await MidiQOL.socket().executeAsUser('rollAbility', userID, saveRollData);      
            break;
        }
        case 'Water': {
            let haveVial = actor.items
                .filter(item => item.type === 'backpack')
                .filter(item => item.name === "Vial")
                .filter(item => item.system.equipped === true);
            if (haveVial.length != 1) {
                ui.notifications.warn('Не экипирован подходящий сосуд с водой! (Нужен "Vial")');
                return;
            }
            let holyWater = actor.items.find(i => i.name === "Holy Water (Vial)");
            if (holyWater) {
                let holyWaterNewAmmount = holyWater.system.quantity + 1;
                await holyWater.update({ "system.quantity": holyWaterNewAmmount })
            } else {
                let holyWaterData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Items', 'Holy Water (Vial)', false);
                let updates = {
                    'embedded': {
                        'Item': {
                            [holyWaterData.name]: holyWaterData
                        }
                    }
                }
                await warpgate.mutate(token.document, updates);
            }

            let vial = actor.items.find(i => i.name === "Vial");
            let vialNewAmmount = vial.system.quantity - 1;
            await vial.update({ "system.quantity": vialNewAmmount })
            if (vial.system.quantity < 1) {
                await vial.delete();
            }
            break;
        }
        case 'Age': {
            const effectData = {
                'name': "Ceremony: Coming of Age",
                'icon': "assets/library/icons/sorted/spells/level1/ceremony.webp",
                'description': "For the next 24 hours, whenever you make an ability check, you can roll a d4 and add the number rolled to the ability check.",
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
                ]
            };
            await chrisPremades.helpers.createEffect(target.actor, effectData);
            break;
        }
        case 'Dedication': {
            const effectData = {
                'name': "Ceremony: Dedication",
                'icon': "assets/library/icons/sorted/spells/level1/ceremony.webp",
                'description': "For the next 24 hours, whenever you make a saving throw, you can roll a d4 and add the number rolled to the save.",
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
                ]
            };
            await chrisPremades.helpers.createEffect(target.actor, effectData);
            break;
        }
        case 'Funeral': {
            const effectData = {
                'name': "Ceremony: Funeral Rite",
                'icon': "assets/library/icons/sorted/spells/level1/ceremony.webp",
                'description': "For the next 7 days you can't become undead",
                'duration': {
                    'seconds': 604800
                }
            };
            await chrisPremades.helpers.createEffect(target.actor, effectData);
            break;
        }
        case 'Wedding': {
            if (targets.size != 2) {
                ui.notifications.warn('Wrong ammount of targets!');
                return;
            }
            async function loop(targets) {
                let target = targets;
                const effectData = {
                    'name': "Ceremony: Wedding",
                    'icon': "assets/library/icons/sorted/spells/level1/ceremony.webp",
                    'description': "For the next 7 days, you have a +2 bonus to AC while you are within 30 feet of your partner.",
                    'duration': {
                        'seconds': 604800
                    },
                    'changes': [
                        {
                            'key': 'system.attributes.ac.bonus',
                            'mode': 2,
                            'value': "+2",
                            'priority': 20
                        }
                    ]
                };
                await chrisPremades.helpers.createEffect(target.actor, effectData);
            }
            targets.forEach(loop);
        }
    }
}