async function cast({speaker, actor, token, character, item, args, scope, workflow}) {
    let selection = await chrisPremades.helpers.selectTarget(workflow.item.name, chrisPremades.constants.okCancel, Array.from(workflow.targets), false, 'multiple', undefined, false, 'Choose which targets to keep');
    let newTargets = selection.inputs.filter(i => i).slice(0);
    chrisPremades.helpers.updateTargets(newTargets);
}

async function item({speaker, actor, token, character, item, args, scope, workflow}) {
    let targets = Array.from(workflow.failedSaves);
    for (let i = 0; i < targets.length; i++) {
        let target = fromUuidSync(targets[i].document.uuid).object;
        let type = await chrisPremades.helpers.raceOrType(target.actor);
        if (type === 'celestial' || type === 'elemental' || type === 'fey' || type === 'fiend') {
            async function effectMacroCreate() {
                await token.document.update({ hidden: true });
            };
            async function effectMacroEnd() {
                await token.document.update({ hidden: false});
            };
            const effectData = {
                'name': 'Banishment',
                'description': "For the next 24 hours, you are banished to your plane of origin.",
                'icon': 'assets/library/icons/sorted/spells/level4/banishment.webp',
                'origin': workflow.item.uuid,
                'duration': {
                    'seconds': 86400
                },
                'flags': {
                    'effectmacro': {
                        'onCreate': {
                            'script': chrisPremades.helpers.functionToString(effectMacroCreate)
                        },
                        'onDelete': {
                            'script': chrisPremades.helpers.functionToString(effectMacroEnd)
                        }
                    }
                }
            };
            await chrisPremades.helpers.createEffect(target.actor, effectData);
            return;
        }
        let currentHP = target.actor.system.attributes.hp.value;
        if (currentHP > 50) return;
        else if (currentHP > 40 && currentHP <= 50) {
            const effectData = {
                'name': "Divine Word",
                'icon': "assets/library/icons/sorted/spells/level7/divine_word.webp",
                'origin': workflow.item.uuid,
                'description': "You heard a divine word, imbued with the power that shaped the world at the dawn of creation and are deafened for the next minute.",
                'duration': {
                    'seconds': 60
                },
                'changes': [
                    {
                        'key': 'macro.CE',
                        'mode': 0,
                        'value': 'Deafened',
                        'priority': 20
                    }
                ]
            };
            await chrisPremades.helpers.createEffect(target.actor, effectData);
        }
        else if (currentHP > 30 && currentHP <= 40) {
            const effectData = {
                'name': "Divine Word",
                'icon': "assets/library/icons/sorted/spells/level7/divine_word.webp",
                'origin': workflow.item.uuid,
                'description': "You heard a divine word, imbued with the power that shaped the world at the dawn of creation and are blinded and deafened for the next 10 minutes.",
                'duration': {
                    'seconds': 600
                },
                'changes': [
                    {
                        'key': 'macro.CE',
                        'mode': 0,
                        'value': 'Blinded',
                        'priority': 20
                    },
                    {
                        'key': 'macro.CE',
                        'mode': 0,
                        'value': 'Deafened',
                        'priority': 20
                    }
                ]
            };
            await chrisPremades.helpers.createEffect(target.actor, effectData);
        }
        else if (currentHP > 20 && currentHP <= 30) {
            const effectData = {
                'name': "Divine Word",
                'icon': "assets/library/icons/sorted/spells/level7/divine_word.webp",
                'origin': workflow.item.uuid,
                'description': "You heard a divine word, imbued with the power that shaped the world at the dawn of creation and are blinded, deafened and stunned for the next hour.",
                'duration': {
                    'seconds': 3600
                },
                'changes': [
                    {
                        'key': 'macro.CE',
                        'mode': 0,
                        'value': 'Blinded',
                        'priority': 20
                    },
                    {
                        'key': 'macro.CE',
                        'mode': 0,
                        'value': 'Deafened',
                        'priority': 20
                    },
                    {
                        'key': 'macro.CE',
                        'mode': 0,
                        'value': 'Stunned',
                        'priority': 20
                    }
                ]
            };
            await chrisPremades.helpers.createEffect(target.actor, effectData);
        }
        else if (currentHP <= 20) {
            await chrisPremades.helpers.applyDamage([target], 20, 'none');
        }
    }
}

export let divineWord = {
    'cast': cast,
    'item': item
}