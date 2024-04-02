async function cast({speaker, actor, token, character, item, args, scope, workflow}) {
    let ammount = workflow.castData.castLevel;
    if (workflow.targets.size > ammount) {
        let selection = await chrisPremades.helpers.selectTarget(workflow.item.name, chrisPremades.constants.okCancel, Array.from(workflow.targets), false, 'multiple', undefined, false, 'Too many targets selected. Choose which targets to keep (Max: ' + ammount + ')');
        if (!selection.buttons) {
            ui.notifications.warn('Failed to select right ammount of targets, try again!')
            return;
        }
        let newTargets = selection.inputs.filter(i => i).slice(0, ammount);
        await chrisPremades.helpers.updateTargets(newTargets);
    }
    await warpgate.wait(100);
    let featureData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Spell Features', 'Charm Person: Charm', false);
    if (!featureData) {
        ui.notifications.warn('Can\'t find item in compenidum! (Charm Person: Charm)');
        return
    }
    let originItem = workflow.item;
    if (!originItem) return;
    featureData.system.save.dc = chrisPremades.helpers.getSpellDC(originItem);
    setProperty(featureData, 'chris-premades.spell.castData.school', originItem.system.school);
    let feature = new CONFIG.Item.documentClass(featureData, {'parent': workflow.actor});
    let targets = Array.from(game.user.targets);
    let targetUuids = [];
    for (let i of targets) {
        targetUuids.push(i.document.uuid);
    }
    let [config, options] = chrisPremades.constants.syntheticItemWorkflowOptions(targetUuids);
    await game.messages.get(workflow.itemCardId).delete();
    await MidiQOL.completeItemUse(feature, config, options);
}

async function save({speaker, actor, token, character, item, args, scope, workflow}) {
    let targets = workflow.targets;
    async function loop(targets) {
        let i = targets;
        let type = chrisPremades.helpers.raceOrType(i.actor);
        let immuneData = {  
            'name': 'Save Immunity',
            'icon': 'assets/library/icons/sorted/generic/generic_buff.webp',
            'description': "You succeed on the next save you make",
            'duration': {
                'turns': 1  
            },
            'changes': [
                {
                    'key': 'flags.midi-qol.min.ability.save.wis',
                    'value': '40',
                    'mode': 2,
                    'priority': 120
                }
            ],
            'flags': {
                'dae': {
                    'specialDuration': ['isSave']
                },
                'chris-premades': {
                    'effect': {
                        'noAnimation': true
                    }
                }
            }
        };
        if (type != 'humanoid') {
            ChatMessage.create({ flavor: i.name + ' is unaffected by Charm Person! (Target is not humanoid)', speaker: ChatMessage.getSpeaker({ actor: workflow.actor}) });
            await chrisPremades.helpers.createEffect(i.actor, immuneData);
            return;
        }
        let hasCharmImmunity = chrisPremades.helpers.checkTrait(i.actor, 'ci', 'charmed');
        if (hasCharmImmunity) {
            ChatMessage.create({ flavor: i.name + ' is unaffected by Charm Person! (Target is immune to condition: Charmed)', speaker: ChatMessage.getSpeaker({ actor: workflow.actor}) });
            await chrisPremades.helpers.createEffect(i.actor, immuneData);
            return;
        }
        if (chrisPremades.helpers.inCombat()) {
            let effectData = {
                'name': 'Save Advantage',
                'icon': 'assets/library/icons/sorted/generic/generic_buff.webp',
                'description': "You have advantage on the next save you make",
                'duration': {
                    'turns': 1
                },
                'changes': [
                    {
                        'key': 'flags.midi-qol.advantage.ability.save.all',
                        'value': '1',
                        'mode': 5,
                        'priority': 120
                    }
                ],
                'flags': {
                    'dae': {
                        'specialDuration': [
                            'isSave'
                        ]
                    },
                    'chris-premades': {
                        'effect': {
                            'noAnimation': true
                        }
                    }
                }
            };
            await chrisPremades.helpers.createEffect(i.actor, effectData);
        }
    }
    targets.forEach(loop);
    await warpgate.wait(100);
}

export let charmPerson = {
    'cast': cast,
    'save': save
}