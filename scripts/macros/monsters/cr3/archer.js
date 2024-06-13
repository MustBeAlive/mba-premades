import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function archerEyeAttack({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = await mba.findEffect(workflow.actor, "Archer's Eye");
    if (!effect || effect.flags['mba-premades']?.feature?.archer?.archerEye?.used === true) return;
    let [feature] = workflow.actor.items.filter(i => i.name === "Archer's Eye");
    if (!feature) return;
    let featureUses = feature.system.uses.value;
    if (!featureUses || featureUses === 0) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'archerEye', 151);
    if (!queueSetup) return;
    let target = workflow.targets.first();
    let targetAC = target.actor.system.attributes.ac.value;
    let attackTotal = workflow.attackTotal;
    if (targetAC <= attackTotal) {
        queue.remove(workflow.item.uuid);
        return;
    }
    let choices = [["Yes, roll 1d10 and add to attack", "yes"], ["No, cancel", false]];
    let selection = await mba.dialog("Use Archer Eye?", choices);
    if (!selection) {
        queue.remove(workflow.item.uuid);
        return;
    }

    new Sequence()

        .effect()
        .file("jb2a.ui.indicator.redyellow.02.01")
        .attachTo(target)
        .scaleToObject(1.3 * target.document.texture.scaleX)
        .opacity(0.7)
        .repeats(3, 1300)

        .play()

    let roll = await new Roll('1d10').roll({ 'async': true });
    await MidiQOL.displayDSNForRoll(roll, 'damageRoll');
    roll.toMessage({
        rollMode: 'roll',
        speaker: { 'alias': name },
        flavor: "Archer: Archer's Eye"
    });
    let updateRoll = await mba.addToRoll(workflow.attackRoll, roll.total);
    await workflow.setAttackRoll(updateRoll);
    await feature.update({ 'system.uses.value': featureUses -= 1 });
    let updates = {
        'flags': {
            'mba-premades': {
                'feature': {
                    'archer': {
                        'archerEye': {
                            'used': true
                        }
                    }
                }
            }
        }
    };
    await mba.updateEffect(effect, updates);
    queue.remove(workflow.item.uuid);
}

async function archerEyeDamage({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = await mba.findEffect(workflow.actor, "Archer's Eye");
    if (!effect || effect.flags['mba-premades']?.feature?.archer?.archerEye?.used === true) return;
    let [feature] = workflow.actor.items.filter(i => i.name === "Archer's Eye");
    if (!feature) return;
    let featureUses = feature.system.uses.value;
    if (!featureUses || featureUses === 0) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'archerEye', 250);
    if (!queueSetup) return;
    let choices = [["Yes, roll 1d10 and add to damage roll", "yes"], ["No, cancel", false]];
    let selection = await mba.dialog("Use Archer Eye?", choices);
    if (!selection) {
        queue.remove(workflow.item.uuid);
        return;
    }
    new Sequence()

        .effect()
        .file("jb2a.ui.indicator.redyellow.02.01")
        .attachTo(workflow.targets.first())
        .scaleToObject(1.3 * workflow.targets.first().document.texture.scaleX)
        .opacity(0.7)
        .repeats(3, 1300)

        .play()

    let oldFormula = workflow.damageRoll._formula;
    let bonusDamageFormula = '1d10';
    if (workflow.isCritical) bonusDamageFormula = mba.getCriticalFormula(bonusDamageFormula);
    let damageFormula = oldFormula + ' + ' + bonusDamageFormula;
    let damageRoll = await new Roll(damageFormula).roll({ async: true });
    await workflow.setDamageRoll(damageRoll);
    await feature.update({ 'system.uses.value': featureUses -= 1 })
    let updates = {
        'flags': {
            'mba-premades': {
                'feature': {
                    'archer': {
                        'archerEye': {
                            'used': true
                        }
                    }
                }
            }
        }
    };
    await mba.updateEffect(effect, updates);
    queue.remove(workflow.item.uuid);
}

async function archerEyeReset(actor) {
    let effect = await mba.findEffect(actor, "Archer's Eye");
    if (!effect) return;
    let updates = {
        'flags': {
            'mba-premades': {
                'feature': {
                    'archer': {
                        'archerEye': {
                            'used': false
                        }
                    }
                }
            }
        }
    };
    await mba.updateEffect(effect, updates);
}

export let archer = {
    'archerEyeAttack': archerEyeAttack,
    'archerEyeDamage': archerEyeDamage,
    'archerEyeReset': archerEyeReset
}