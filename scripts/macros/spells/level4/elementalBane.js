async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let ammount = workflow.castData.castLevel - 3;
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
                    'elementalBane': {
                        'dc': chrisPremades.helpers.getSpellDC(workflow.item),
                        'sourceEffectUuid': concEffect.uuid
                    }
                }
            }
        }
    };
    await chrisPremades.helpers.updateEffect(concEffect, updates);
    let featureData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Spell Features', 'Elemental Bane: Bane', false);
    if (!featureData) {
        ui.notifications.warn('Can\'t find item in compenidum! (Elemental Bane: Bane)');
        return
    }
    let originItem = workflow.item;
    if (!originItem) return;
    featureData.system.save.dc = chrisPremades.helpers.getSpellDC(originItem);
    setProperty(featureData, 'chris-premades.spell.castData.school', originItem.system.school);
    let feature = new CONFIG.Item.documentClass(featureData, {
        'parent': workflow.actor
    });
    let targetUuids = [];
    for (let i of targets) {
        targetUuids.push(i.document.uuid);
    }
    let [config, options] = chrisPremades.constants.syntheticItemWorkflowOptions(targetUuids);
    await warpgate.wait(100);
    await game.messages.get(workflow.itemCardId).delete();
    await MidiQOL.completeItemUse(feature, config, options);
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let concEffect = chrisPremades.helpers.findEffect(workflow.actor, 'Concentrating');
    let targets = Array.from(workflow.failedSaves);
    for (let i = 0; i < targets.length; i++) {
        let target = fromUuidSync(targets[i].document.uuid).object;
        let selection = await chrisPremades.helpers.dialog('Choose damage type for ' + target.document.name, [['Acid 🧪', 'acid'], ['Cold ❄️', 'cold'], ['Fire 🔥', 'fire'], ['Lightning ⚡', 'lightning'], ['Thunder ☁️', 'thunder']]);
        if (!selection)
            return;
        async function effectMacro() {
            let effect = chrisPremades.helpers.findEffect(actor, 'Elemental Bane');
            let updates = {
                'flags': {
                    'mba-premades': {
                        'spell': {
                            'elementalBane': {
                                'used': false
                            }
                        }
                    }
                }
            };
            await chrisPremades.helpers.updateEffect(effect, updates);
        }
        const effectData = {
            'name': 'Elemental Bane',
            'icon': 'assets/library/icons/sorted/spells/level4/elemental_bane.webp',
            'origin': concEffect.origin,
            'duration': {
                'seconds': 60
            },
            'changes': [
                {
                    'key': 'flags.midi-qol.onUseMacroName',
                    'mode': 0,
                    'value': 'function.mbaPremades.macros.elementalBane.damage,preTargetDamageApplication',
                    'priority': 20
                },
                {
                    'key': 'system.traits.dr.value',
                    'mode': 0,
                    'value': '-' + selection,
                    'priority': 20
                }
            ],
            'flags': {
                'mba-premades': {
                    'spell': {
                        'elementalBane': {
                            'type': selection,
                            'used': false
                        }
                    }
                },
                'effectmacro': {
                    'onEachTurn': {
                        'script': chrisPremades.helpers.functionToString(effectMacro)
                    }
                },
                'midi-qol': {
                    'castData': {
                        baseLevel: 4,
                        castLevel: workflow.castData.castLevel,
                        itemUuid: workflow.item.uuid
                    }
                }
            }
        }
        await chrisPremades.helpers.createEffect(target.actor, effectData);
    }
}

async function damage({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = await chrisPremades.helpers.findEffect(actor, 'Elemental Bane');
    if (effect.flags['mba-premades']?.spell?.elementalBane?.used === true) return;
    let type = effect.flags['mba-premades']?.spell?.elementalBane?.type;
    let typeCheck = workflow.damageDetail?.some(d => d.type === type);
    if (!typeCheck) return;
    let damageFormula = '2d6[' + type + ']';
    if (workflow.damageItem.critical === true) damageFormula = '4d6[' + type + ']';
    let damageRoll = await new Roll(damageFormula).roll({ 'async': true });
    await MidiQOL.displayDSNForRoll(damageRoll, 'damageRoll');
    damageRoll.toMessage({
        rollMode: 'roll',
        speaker: { 'alias': name },
        flavor: '<b>Elemental Bane: Bonus Damage</b>'
    });
    let damageTotal = damageRoll.total;
    workflow.damageItem.damageDetail[0].push({
        'damage': damageTotal,
        'type': type
    });
    workflow.damageItem.totalDamage += damageTotal;
    workflow.damageItem.appliedDamage += damageTotal;
    workflow.damageItem.hpDamage += damageTotal;
    let updates = {
        'flags': {
            'mba-premades': {
                'spell': {
                    'elementalBane': {
                        'used': true
                    }
                }
            }
        }
    };
    await chrisPremades.helpers.updateEffect(effect, updates);
}

export let elementalBane = {
    'cast': cast,
    'item': item,
    'damage': damage
}