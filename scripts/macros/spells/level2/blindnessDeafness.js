async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let ammount = workflow.castData.castLevel - 1;
    if (workflow.targets.size <= ammount) return;
    let selection = await chrisPremades.helpers.selectTarget(workflow.item.name, chrisPremades.constants.okCancel, Array.from(workflow.targets), false, 'multiple', undefined, false, 'Too many targets selected. Choose which targets to keep (Max: ' + ammount + ')');
    if (!selection.buttons) return;
    let newTargets = selection.inputs.filter(i => i).slice(0, ammount);
    chrisPremades.helpers.updateTargets(newTargets);
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let targets = Array.from(workflow.failedSaves);
    for (let i = 0; i < targets.length; i++) {
        let target = fromUuidSync(targets[i].document.uuid).object;
        let choices = [['Blindness', 'blind'], ['Deafness', 'deaf']];
        let selection = await chrisPremades.helpers.dialog('Choose condition for ' + target.document.name, choices);
        if (!selection) return;
        let name;
        let description;
        let CE;
        switch (selection) {
            case 'blind': {
                name = "Blindness";
                description = "You are blinded for the duration. At the end of each of your turns, you can make a Constitution saving throw. On a success, the spell ends.";
                CE = 'Blinded';
                break;
            }
            case 'deaf': {
                name = "Deafness";
                description = "You are deafened for the duration. At the end of each of your turns, you can make a Constitution saving throw. On a success, the spell ends.";
                CE = 'Deafened';
                break;
            }
        }
        const effectData = {
            'name': name,
            'icon': 'assets/library/icons/sorted/spells/level2/Blindness.webp',
            'origin': workflow.item.uuid,
            'description': description,
            'duration': {
                'seconds': 60
            },
            'changes': [
                {
                    'key': 'flags.midi-qol.OverTime',
                    'mode': 0,
                    'value': 'turn=end, saveAbility=con, saveDC=' + chrisPremades.helpers.getSpellDC(workflow.item) + ' , saveMagic=true, name=Blindness',
                    'priority': 20
                },
                {
                    'key': 'macro.CE',
                    'mode': 0,
                    'value': CE,
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
        await chrisPremades.helpers.createEffect(target.actor, effectData);
    }
}

export let blindnessDeafness = {
    'cast': cast,
    'item': item,
}