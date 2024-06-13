import {mba} from "../../helperFunctions.js";
import {queue} from "../mechanics/queue.js";

export async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let types = [["Weapon (Slashing or Piercing)", "weapon"], ["Ammo (3 pieces)", "ammo"], ["Cancel", false]];
    let typeSelection = await mba.dialog("Basic Poison", types, `<b>What would you like to coat with Basic Poison?</b>`);
    if (!typeSelection) return;
    if (typeSelection === "weapon") {
        let weapons = workflow.actor.items.filter(i => i.type === 'weapon' && i.system.equipped && i.system.actionType === 'mwak' && i.system.damage.parts[0][1] != 'bludgeoning');
        if (!weapons.length) {
            ui.notifications.warn("No valid weapons equppied!");
            return;
        }
        let [weaponSelection] = await mba.selectDocument('Coat which weapon?', weapons);
        if (!weaponSelection) return;
        let weaponData = duplicate(weaponSelection);
        delete weaponData._id;
        let midiFlags = weaponData.flags['midi-qol'] ?? { 'onUseMacroName': '' };
        if (!midiFlags.onUseMacroName) midiFlags.onUseMacroName = '';
        midiFlags.onUseMacroName += ',[postDamageRoll]function.mbaPremades.macros.basicPoison.weaponDamage';
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
                        'script': mba.functionToString(effectMacroDel)
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
        new Sequence()

            .effect()
            .file("animated-spell-effects-cartoon.water.05")
            .atLocation(token, { offset: { x: 0.2, y: -0.5 }, gridUnits: true })
            .scaleToObject(1.4)
            .opacity(0.9)
            .rotate(90)
            .filter("ColorMatrix", { saturate: 1, hue: -105 })
            .zIndex(1)

            .wait(200)

            .effect()
            .file(`jb2a.sacred_flame.source.green`)
            .attachTo(token, { offset: { y: 0.15 }, gridUnits: true, followRotation: false })
            .startTime(3400)
            .scaleToObject(2.2)
            .fadeOut(500)
            .animateProperty("sprite", "position.y", { from: 0, to: -0.4, duration: 1000, gridUnits: true })
            .filter("ColorMatrix", { hue: 0 })
            .zIndex(1)

            .effect()
            .from(token)
            .scaleToObject(token.document.texture.scaleX)
            .opacity(0.3)
            .duration(1250)
            .fadeIn(100)
            .fadeOut(600)
            .filter("Glow", { color: "0xbbf000" })
            .tint("0xbbf000")

            .effect()
            .file(`jb2a.particles.outward.greenyellow.01.03`)
            .attachTo(token, { offset: { y: 0.1 }, gridUnits: true, followRotation: false })
            .scale(0.6)
            .duration(1000)
            .fadeOut(800)
            .scaleIn(0, 1000, { ease: "easeOutCubic" })
            .animateProperty("sprite", "width", { from: 0, to: 0.25, duration: 500, gridUnits: true, ease: "easeOutBack" })
            .animateProperty("sprite", "height", { from: 0, to: 1.0, duration: 1000, gridUnits: true, ease: "easeOutBack" })
            .animateProperty("sprite", "position.y", { from: 0, to: -0.6, duration: 1000, gridUnits: true })
            .zIndex(0.3)
            .waitUntilFinished(-500)

            .effect()
            .file("jb2a.icon.poison.dark_green")
            .attachTo(token)
            .scaleToObject(1.4)
            .fadeIn(500)
            .fadeOut(1000)

            .thenDo(async () => {
                await warpgate.mutate(workflow.token.document, updates, {}, options);
            })

            .play()
    }
    else if (typeSelection === "ammo") {
        ui.notifications.info("Under construction, sorry");
        return;
        let ammo = workflow.actor.items.filter(i => i.type === "consumable" && i.system.equipped && i.system.quantity >= 3 && i.system.consumableType === "ammo" && !i.system.damage.parts.includes('bludgeoning'));
        if (!ammo.length) {
            ui.notifications.warn("No valid ammunition equppied!");
            return;
        }
        let [ammoSelection] = await mba.selectDocument('Coat which ammo?', ammo);
        if (!ammoSelection) return;
        let ammoData = duplicate(ammoSelection);
        delete ammoData._id;
        let midiFlags = ammoData.flags['midi-qol'] ?? { 'onUseMacroName': '' };
        if (!midiFlags.onUseMacroName) midiFlags.onUseMacroName = '';
        midiFlags.onUseMacroName += ',[postDamageRoll]function.mbaPremades.macros.basicPoison.ammoDamage';
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
                        'script': mba.functionToString(effectMacroDel)
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
    }

    let vialItem = mba.getItem(workflow.actor, workflow.item.name);
    if (vialItem.system.quantity > 1) {
        await vialItem.update({ "system.quantity": vialItem.system.quantity - 1 });
    } else {
        await workflow.actor.deleteEmbeddedDocuments("Item", [vialItem.id]);
    }
    let emptyVialItem = mba.getItem(workflow.actor, "Empty Vial");
    if (!emptyVialItem) {
        const itemData = await mba.getItemFromCompendium('mba-premades.MBA Items', 'Empty Vial', false);
        if (!itemData) {
            ui.notifications.warn("Unable to find item in compenidum! (Empty Vial)");
            return
        }
        await workflow.actor.createEmbeddedDocuments("Item", [itemData]);
    } else {
        await emptyVialItem.update({ "system.quantity": emptyVialItem.system.quantity + 1 });
    }
}

async function weaponDamage({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let effect = await mba.findEffect(workflow.actor, "Basic Poison");
    if (!effect) return;
    let target = workflow.targets.first();
    if (mba.checkTrait(target.actor, 'di', 'poison')) {
        ui.notifications.info("Target is immune to poison damage!");
        return;
    }
    let queueSetup = await queue.setup(workflow.item.uuid, 'basicPoison', 255);
    if (!queueSetup) return;
    let saveRoll = await mba.rollRequest(target, 'save', 'con');
    if (saveRoll.total >= 10) {
        queue.remove(workflow.item.uuid);
        return;
    }
    let oldFormula = workflow.damageRoll._formula;
    let bonusDamageFormula = '1d4[poison]';
    if (workflow.isCritical) bonusDamageFormula = mba.getCriticalFormula(bonusDamageFormula);
    let damageFormula = oldFormula + ' + ' + bonusDamageFormula;
    let damageRoll = await new Roll(damageFormula).roll({ async: true });
    await workflow.setDamageRoll(damageRoll);
    new Sequence()

        .effect()
        .file("jb2a.impact_themed.poison.greenyellow")
        .attachTo(target)
        .scaleToObject(1.6)

        .play()

    queue.remove(workflow.item.uuid);
}

async function ammoDamage({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let effect = await mba.findEffect(workflow.actor, "Basic Poison");
    if (!effect) return;
    let target = workflow.targets.first();
    if (mba.checkTrait(target.actor, 'di', 'poison')) {
        ui.notifications.warn("target is immune to poison, returning"); // remove afterwards
        return;
    }
    let saveRoll = await mba.rollRequest(target, 'save', 'con');
    if (saveRoll.total >= 10) return;
    let damageFormula = '1d4[poison]';
    let damageRoll = await new Roll(damageFormula).roll({ 'async': true });
    await damageRoll.toMessage({
        rollMode: 'roll',
        speaker: { 'alias': name },
        flavor: 'Basic Poison'
    });
    let damageTotal = damageRoll.total;
    let hasDR = mba.checkTrait(actor, "dr", "poison");
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