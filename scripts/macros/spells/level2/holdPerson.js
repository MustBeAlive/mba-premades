// Based on multiple CPR macro; Checks for right ammount of targets and checks right distance between them
async function cast({speaker, actor, token, character, item, args, scope, workflow}) {
    let ammount = workflow.castData.castLevel - 1;
    let concEffect = await chrisPremades.helpers.findEffect(workflow.actor, 'Concentrating');
    if (workflow.targets.size > ammount) {
        let selection = await chrisPremades.helpers.selectTarget(workflow.item.name, chrisPremades.constants.okCancel, Array.from(workflow.targets), false, 'multiple', undefined, false, 'Too many targets selected. Choose which targets to keep (Max: ' + ammount + ')');
        if (!selection.buttons) {
            ui.notifications.warn('Failed to select right ammount of targets, try again!')
            await chrisPremades.helpers.removeEffect(concEffect);
            return;
        }
        let newTargets = selection.inputs.filter(i => i).slice(0, ammount);
        await chrisPremades.helpers.updateTargets(newTargets);
    }
    let targets = Array.from(game.user.targets);
    const distanceArray = [];
    for (let i = 0; i < targets.length; i++) {
        for (let k = i + 1; k < targets.length; k++) {
            let target1 = fromUuidSync(targets[i].document.uuid).object;
            let target2 = fromUuidSync(targets[k].document.uuid).object;
            distanceArray.push(chrisPremades.helpers.getDistance(target1, target2));
        }
    }
    const found = distanceArray.some((distance) => distance > 30);
    if (found === true) {
        ui.notifications.warn('Targets cannot be further than 30 ft. of each other!')
        await chrisPremades.helpers.removeEffect(concEffect);
        return;
    }
    await warpgate.wait(100);
    let updates = {
        'flags': {
            'mba-premades': {
                'spell': {
                    'holdPerson': {
                        'dc': chrisPremades.helpers.getSpellDC(workflow.item),
                    }
                }
            }
        }
    };
    await chrisPremades.helpers.updateEffect(concEffect, updates);
    let featureData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Spell Features', 'Hold Person: Hold', false);
    if (!featureData) {
        ui.notifications.warn('Can\'t find item in compenidum! (Hold Person: Hold)');
        return
    }
    let originItem = workflow.item;
    if (!originItem) return;
    featureData.system.save.dc = chrisPremades.helpers.getSpellDC(originItem);
    setProperty(featureData, 'chris-premades.spell.castData.school', originItem.system.school);
    let feature = new CONFIG.Item.documentClass(featureData, {'parent': workflow.actor});
    let targetUuids = [];
    for (let i of targets) {
        targetUuids.push(i.document.uuid);
    }
    let [config, options] = chrisPremades.constants.syntheticItemWorkflowOptions(targetUuids);
    await warpgate.wait(100);
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);

    if (featureWorkflow.failedSaves.size) {
        let failTargets = Array.from(featureWorkflow.failedSaves);
        for (let t = 0; t < failTargets.length; t++) {
            let target = failTargets[t];
            const effectData = {
                'name': 'Hold Person: Hold',
                'icon': 'assets/library/icons/sorted/spells/level2/hold_person.webp',
                'origin': workflow.item.uuid,
                'duration': {
                    'seconds': 60
                },
                'changes': [
                    {
                        'key': 'flags.midi-qol.OverTime',
                        'mode': 0,
                        'value': 'turn=end, saveAbility=wis, saveDC=' + concEffect.flags['mba-premades'].spell.holdPerson.dc + ' , saveMagic=true, name=Hold Person: Hold',
                        'priority': 20
                    },
                    {
                        'key': 'macro.CE',
                        'mode': 0,
                        'value': 'Paralyzed',
                        'priority': 20
                    }
                ]
            };
            await chrisPremades.helpers.createEffect(target.actor, effectData);
            await new Sequence()
                .effect()
                .file('jb2a.markers.chain.spike.loop.02.red')
                .atLocation(target)
                .duration(8500)
                .scaleToObject(2)
                .fadeIn(500)
                .fadeOut(500)

                .sound()
                .file("modules/dnd5e-animations/assets/sounds/Damage/Lightning/electric-continuous-2.mp3")

                .play()
        }   
    } else await chrisPremades.helpers.removeEffect(concEffect);
}

async function item({speaker, actor, token, character, item, args, scope, workflow}) {
    let targets = workflow.targets;
    async function loop(targets) {
        let i = targets;
        let type = chrisPremades.helpers.raceOrType(i.actor);
        let immuneData = {  
            'name': 'Save Immunity',
            'icon': 'assets/library/icons/sorted/generic/generic_buff.png',
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
        if (type != 'humanoid') {
            ChatMessage.create({ flavor: i.name + ' is unaffected by Hold Person! (Target is not humanoid)', speaker: ChatMessage.getSpeaker({ actor: workflow.actor}) });
            await chrisPremades.helpers.createEffect(i.actor, immuneData);
            return;
        }
    }
    targets.forEach(loop);
}

export let holdPerson = {
    'cast': cast,
    'item': item
}