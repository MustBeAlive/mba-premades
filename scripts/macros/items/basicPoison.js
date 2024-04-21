//think of a way to implement ammo coating
export async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let types = [["Weapon (Slashing or Piercing)", "weapon"], ["Ammo (3 pieces)", "ammo"], ["Cancel", "cancel"]];
    let typeSelection = await chrisPremades.helpers.dialog("What would you like to coat with poison?", types);
    if (!typeSelection || typeSelection === "cancel") return;
    if (typeSelection === "weapon") {
        let weapons = workflow.actor.items.filter(i => i.type === 'weapon' && i.system.equipped && i.system.actionType === 'mwak' && i.system.damage.parts[0][1] != 'bludgeoning');
        if (!weapons.length) {
            ui.notifications.warn("No valid weapons equppied!");
            return;
        }
        let [weaponSelection] = await chrisPremades.helpers.selectDocument('Coat which weapon?', weapons);
        if (!weaponSelection) return;
        let weaponData = duplicate(weaponSelection);
        delete weaponData._id;
        let midiFlags = weaponData.flags['midi-qol'] ?? { 'onUseMacroName': '' };
        if (!midiFlags.onUseMacroName) midiFlags.onUseMacroName = '';
        midiFlags.onUseMacroName += ',[preDamageApplication]function.mbaPremades.macros.basicPoison.weaponDamage';
        setProperty(weaponData, 'flags.midi-qol', midiFlags);
        async function effectMacroDel() {
            await warpgate.revert(token.document, 'Basic Poison');
        }
        const effectData = {
            'name': workflow.item.name,
            'icon': workflow.item.img,
            'origin': workflow.item.uuid,
            'description': `
                <p>You applied basic poison to <b>${weaponSelection.name}</b>.</p>
                <p>Any creature hit by the poisoned weapon must make a DC 10 Constitution Saving throw or take 1d4 poison damage.</p>
                <p>Poison retains potency for duration before drying off.</p>
            `,
            'duration': {
                'seconds': 60
            },
            'flags': {
                'effectmacro': {
                    'onDelete': {
                        'script': chrisPremades.helpers.functionToString(effectMacroDel)
                    }
                }
            }
        };
        let updates = {
            'embedded': {
                'Item': {
                    [weaponSelection.name]: weaponData
                },
                'ActiveEffect': {
                    [effectData.name]: effectData
                }
            }
        };
        let options = {
            'permanent': false,
            'name': 'Basic Poison',
            'description': 'Basic Poison'
        };
        await warpgate.mutate(workflow.token.document, updates, {}, options);
    }
    if (typeSelection === "ammo") {
        ui.notifications.info("Анлаки, я пока не придумал как это реализовать");
        return
        /*
        let ammo = workflow.actor.items.filter(i => i.type === "consumable" && i.system.equipped && i.system.quantity >= 3 && i.system.consumableType === "ammo" && !i.system.damage.parts.includes('bludgeoning'));
        if (!ammo.length) {
            ui.notifications.warn("No valid ammunition equppied!");
            return;
        }
        let [ammoSelection] = await chrisPremades.helpers.selectDocument('Coat which ammo?', ammo);
        if (!ammoSelection) return;
        let ammoData = duplicate(ammoSelection);
        delete ammoData._id;
        let midiFlags = ammoData.flags['midi-qol'] ?? { 'onUseMacroName': '' };
        if (!midiFlags.onUseMacroName) midiFlags.onUseMacroName = '';
        midiFlags.onUseMacroName += ',[preDamageApplication]function.mbaPremades.macros.basicPoison.ammoDamage';
        setProperty(ammoData, 'flags.midi-qol', midiFlags);
        async function effectMacroDel() {
            await warpgate.revert(token.document, 'Basic Poison');
        }
        const effectData = {
            'name': workflow.item.name,
            'icon': workflow.item.img,
            'origin': workflow.item.uuid,
            'description': `
                <p>You applied basic poison to <b>${ammoSelection.name} (3)</b>.</p>
                <p>Any creature hit by the poisoned weapon must make a DC 10 Constitution Saving throw or take 1d4 poison damage.</p>
                <p>Poison retains potency for duration before drying off.</p>
            `,
            'duration': {
                'seconds': 60
            },
            'flags': {
                'effectmacro': {
                    'onDelete': {
                        'script': chrisPremades.helpers.functionToString(effectMacroDel)
                    }
                },
                'mba-premades': {
                    'item': {
                        'basicPoison': {
                            'ammo': 3
                        }
                    }
                }
            }
        };
        let updates = {
            'embedded': {
                'Item': {
                    [ammoSelection.name]: ammoData
                },
                'ActiveEffect': {
                    [effectData.name]: effectData
                }
            }
        };
        let options = {
            'permanent': false,
            'name': 'Basic Poison',
            'description': 'Basic Poison'
        };
        await warpgate.mutate(workflow.token.document, updates, {}, options);

        if (ammoSelection.system.quantity === 3) {
            workflow.actor.deleteEmbeddedDocuments("Item", [ammoSelection.id]);
        }
        ammoSelection.update({ "system.quantity": ammoSelection.system.quantity - 3 });
        */
    }
    
    let vialItem = workflow.actor.items.filter(i => i.name === workflow.item.name)[0];
    if (vialItem.system.quantity > 1) {
        vialItem.update({ "system.quantity": vialItem.system.quantity - 1 });
    } else {
        workflow.actor.deleteEmbeddedDocuments("Item", [vialItem.id]);
    }
    let emptyVialItem = workflow.actor.items.filter(i => i.name === "Empty Vial")[0];
    if (!emptyVialItem) {
        const itemData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Items', 'Empty Vial', false);
        if (!itemData) {
            ui.notifications.warn("Unable to find item in compenidum! (Empty Vial)");
            return
        }
        await workflow.actor.createEmbeddedDocuments("Item", [itemData]);
    } else {
        emptyVialItem.update({ "system.quantity": emptyVialItem.system.quantity + 1 });
    }
}

async function weaponDamage({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let effect = await chrisPremades.helpers.findEffect(workflow.actor, "Basic Poison");
    if (!effect) return;
    let target = workflow.targets.first();
    if (chrisPremades.helpers.checkTrait(target.actor, 'di', 'poison')) return;
    let saveRoll = await chrisPremades.helpers.rollRequest(target, 'save', 'con');
    if (saveRoll.total >= 10) return;
    let damageFormula = '1d4[poison]';
    let damageRoll = await new Roll(damageFormula).roll({ 'async': true });
    await damageRoll.toMessage({
        rollMode: 'roll',
        speaker: { 'alias': name },
        flavor: 'Basic Poison'
    });
    let damageTotal = damageRoll.total;
    let hasDR = chrisPremades.helpers.checkTrait(actor, "dr", "poison");
    if (hasDR) damageTotal = Math.floor(damageTotal / 2);
    workflow.damageItem.damageDetail[0].push({
        'damage': damageTotal,
        'type': "poison"
    });
    workflow.damageItem.totalDamage += damageTotal;
    workflow.damageItem.appliedDamage += damageTotal;
    workflow.damageItem.hpDamage += damageTotal;
}

async function ammoDamage({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let effect = await chrisPremades.helpers.findEffect(workflow.actor, "Basic Poison");
    if (!effect) return;
    let target = workflow.targets.first();
    if (chrisPremades.helpers.checkTrait(target.actor, 'di', 'poison')) {
        ui.notifications.warn("target is immune to poison, returning"); // remove afterwards
        return;
    }
    let saveRoll = await chrisPremades.helpers.rollRequest(target, 'save', 'con');
    if (saveRoll.total >= 10) return;
    let damageFormula = '1d4[poison]';
    let damageRoll = await new Roll(damageFormula).roll({ 'async': true });
    await damageRoll.toMessage({
        rollMode: 'roll',
        speaker: { 'alias': name },
        flavor: 'Basic Poison'
    });
    let damageTotal = damageRoll.total;
    let hasDR = chrisPremades.helpers.checkTrait(actor, "dr", "poison");
    if (hasDR) damageTotal = Math.floor(damageTotal / 2);
    workflow.damageItem.damageDetail[0].push({
        'damage': damageTotal,
        'type': "poison"
    });
    workflow.damageItem.totalDamage += damageTotal;
    workflow.damageItem.appliedDamage += damageTotal;
    workflow.damageItem.hpDamage += damageTotal;
}

export let basicPoison = {
    'item': item,
    'weaponDamage': weaponDamage,
    'ammoDamage': ammoDamage
}