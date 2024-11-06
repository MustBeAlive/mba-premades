import {mba} from "../../../../helperFunctions.js";
import {queue} from "../../../mechanics/queue.js";

async function selector({ speaker, actor, token, character, item, args, scope, workflow }) {
    let choices = [];
    let armor1 = await mba.findEffect(workflow.actor, "Arcane Armor: Guardian Model");
    let armor2 = await mba.findEffect(workflow.actor, "Arcane Armor: Infiltrator Model");
    if (!armor1 && !armor2) choices.push(["Guardian Model", "guardian"], ["Infiltrator Model", "infiltrator"]);
    else if (!armor1) choices.push(["Guardian Model", "guardian"]);
    else if (!armor2) choices.push(["Infiltrator Model", "infiltrator"]);
    if (!choices.length) {
        ui.notifications.warn("Something went terribly wrong, damn");
        return;
    }
    await mba.playerDialogMessage(game.user);
    let selection = await mba.dialog("Arcane Armor", choices, `<b>Choose armor model:</b>`);
    await mba.clearPlayerDialogMessage();
    if (!selection) return;
    if (selection === "guardian") {
        new Sequence()

            .effect()
            .file("jb2a.magic_signs.circle.02.conjuration.complete.green")
            .attachTo(token)
            .scaleToObject(2.5)
            .filter("ColorMatrix", { hue: 40 })
            .belowTokens()

            .effect()
            .file("jb2a.impact.green.2")
            .attachTo(token)
            .scaleToObject(2)
            .delay(2800)
            .fadeOut(250)
            .repeats(3, 2400)

            .effect()
            .file("jb2a.impact.green.12")
            .attachTo(token)
            .scaleToObject(2)
            .delay(3400)
            .fadeOut(250)
            .repeats(3, 2400)

            .effect()
            .file("jb2a.impact.007.green")
            .attachTo(token)
            .scaleToObject(2)
            .delay(4000)
            .fadeOut(250)
            .repeats(3, 2400)

            .effect()
            .file("jb2a.impact.green.9")
            .attachTo(token)
            .scaleToObject(2)
            .delay(4600)
            .fadeOut(250)
            .repeats(3, 2400)

            .play()

        await guardianArmor({ speaker, actor, token, character, item, args, scope, workflow });
    }
    else if (selection === "infiltrator") {
        new Sequence()

            .effect()
            .file("jb2a.magic_signs.circle.02.conjuration.complete.red")
            .attachTo(token)
            .scaleToObject(2.5)
            .belowTokens()

            .effect()
            .file("jb2a.impact.red.2")
            .attachTo(token)
            .scaleToObject(2)
            .delay(2800)
            .fadeOut(250)
            .repeats(3, 2400)

            .effect()
            .file("jb2a.impact.011.red")
            .attachTo(token)
            .scaleToObject(2)
            .delay(3400)
            .fadeOut(250)
            .repeats(3, 2400)

            .effect()
            .file("jb2a.impact.007.red")
            .attachTo(token)
            .scaleToObject(2)
            .delay(4000)
            .fadeOut(250)
            .repeats(3, 2400)

            .effect()
            .file("jb2a.impact.010.red")
            .attachTo(token)
            .scaleToObject(2)
            .delay(4600)
            .fadeOut(250)
            .repeats(3, 2400)

            .play()

        await infiltratorArmor({ speaker, actor, token, character, item, args, scope, workflow });
    }
}

async function guardianArmor({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = await mba.findEffect(workflow.actor, "Arcane Armor: Guardian Model");
    if (effect) return;
    let oldFeature = mba.getItem(workflow.actor, "Lightning Launcher");
    if (oldFeature) await oldFeature.delete();
    let fieldUses = workflow.actor.system.attributes.prof;
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Class Feature Items", "Guardian Armor: Defensive Field", false);
    let featureData2 = await mba.getItemFromCompendium("mba-premades.MBA Class Feature Items", "Guardian Armor: Thunder Gauntlets", false);
    if (!featureData || !featureData2) return;
    featureData.system.uses.value = fieldUses;
    featureData.system.uses.max = workflow.actor.system.attributes.prof;
    featureData.name = "Defensive Field";
    featureData2.name = "Thunder Gauntlets";
    await workflow.actor.createEmbeddedDocuments('Item', [featureData, featureData2]);
    let effectData = {
        'name': "Arcane Armor: Guardian Model",
        'icon': "modules/mba-premades/icons/class/artificer/guardian_model.webp",
        'origin': workflow.item.uuid
    };
    await mba.createEffect(workflow.actor, effectData);
    let oldEffect = mba.findEffect(workflow.actor, "Arcane Armor: Infiltrator Model");
    if (oldEffect) await oldEffect.delete();
}

async function thunderGauntletsOrigin({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let target = workflow.targets.first();
    const effectData = {
        'name': "Thunder Gauntlets: Disadvantage",
        'icon': "modules/mba-premades/icons/class/artificer/thunder_gauntlets_disadvantage.webp",
        'origin': workflow.item.uuid,
        'description': `
            <p><b>${workflow.token.document.name}</b>'s Arcane Armor emits a distracting pulse, which grants you disadvantage on all attack rolls, if they are not made against him.</p>
        `,
        'changes': [
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.arcaneArmor.thunderGauntletsTarget,preAttackRoll',
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['turnStartSource']
            }
        }
    };
    new Sequence()

        .effect()
        .file("jb2a.chain_lightning.secondary.blue")
        .attachTo(token)
        .stretchTo(target)
        .missed(workflow.hitTargets.size === 0)

        .effect()
        .file("jb2a.static_electricity.03.blue")
        .delay(300)
        .attachTo(target)
        .scaleToObject(1.5 * target.document.texture.scaleX)
        .repeats(2, 2500)
        .playIf(() => {
            return workflow.hitTargets.size != 0
        })

        .play()

    await mba.createEffect(target.actor, effectData);
}

async function thunderGauntletsTarget({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.targets.size != 1 || workflow.disadvantage) return;
    let effect = mba.findEffect(workflow.actor, "Thunder Gauntlets: Disadvantage");
    if (!effect) return;
    let origin = await fromUuid(effect.origin);
    if (!origin) return;
    if (origin.actor.uuid === workflow.targets.first().actor.uuid) return;
    let queueSetup = await queue.setup(workflow.item.uuid, "thunderGauntlets", 50);
    if (!queueSetup) return;
    workflow.disadvantage = true;
    workflow.advReminderAttackAdvAttribution.add("DIS: Thunder Gauntlets");
    queue.remove(workflow.item.uuid);
}

async function defensiveField({ speaker, actor, token, character, item, args, scope, workflow }) {
    new Sequence()

        .effect()
        .file("jb2a.shield.03.intro.blue")
        .attachTo(token)
        .scaleToObject(1.7 * token.document.texture.scaleX)
        .opacity(0.8)
        .playbackRate(0.8)

        .effect()
        .file("jb2a.shield.03.loop.blue")
        .delay(600)
        .fadeIn(500)
        .fadeOut(1000)
        .attachTo(token)
        .scaleToObject(1.7 * token.document.texture.scaleX)
        .opacity(0.8)
        .playbackRate(0.8)

        .play()
}

async function infiltratorArmor({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = mba.findEffect(workflow.actor, "Arcane Armor: Infiltrator Model");
    if (effect) return;
    let oldFeature = mba.getItem(workflow.actor, "Defensive Field");
    if (oldFeature) await oldFeature.delete();
    let oldFeature2 = workflow.actor.items.getName("Thunder Gauntlets");
    if (oldFeature2) await oldFeature2.delete();
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Class Feature Items", "Infiltrator Armor: Lightning Launcher", false);
    if (!featureData) return;
    featureData.name = "Lightning Launcher";
    await workflow.actor.createEmbeddedDocuments('Item', [featureData]);
    let effectData = {
        'name': "Arcane Armor: Infiltrator Model",
        'icon': "modules/mba-premades/icons/class/artificer/infiltrator_model.webp",
        'origin': workflow.item.uuid,
        'changes': [
            {
                'key': 'system.attributes.movement.walk',
                'value': '+5',
                'mode': 2,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.advantage.skill.ste',
                'value': 1,
                'mode': 0,
                'priority': 20
            }
        ]
    };
    await mba.createEffect(workflow.actor, effectData);
    let oldEffect = mba.findEffect(workflow.actor, "Arcane Armor: Guardian Model");
    if (oldEffect) await oldEffect.delete();
}

async function lightningLauncher({ speaker, actor, token, character, item, args, scope, workflow }) {
    new Sequence()

        .effect()
        .file("jb2a.lightning_bolt.wide.blue")
        .attachTo(token)
        .stretchTo(workflow.targets.first())
        .missed(workflow.hitTargets.size === 0)

        .play()

    if (workflow.hitTargets.size != 1 || workflow.isFumble) return;
    let queueSetup = await queue.setup(workflow.item.uuid, "lightningLauncher", 50);
    if (!queueSetup) return;
    let doExtraDamage = mba.perTurnCheck(workflow.item, 'feature', 'lightningLauncher', true, workflow.token.id);
    if (!doExtraDamage) {
        queue.remove(workflow.item.uuid);
        return;
    }
    let selection = await mba.dialog("Lightning Launcher", [["Yes", true], ["No", false]], "<b>Would you like to apply extra lightning damage? (1d6 lightning)</b>");
    if (!selection) {
        queue.remove(workflow.item.uuid);
        return;
    }
    if (mba.inCombat()) await workflow.item.setFlag('mba-premades', 'feature.lightningLauncher.turn', game.combat.round + '-' + game.combat.turn);
    let bonusDamageFormula = '1d6[lightning]';
    if (workflow.isCritical) bonusDamageFormula = mba.getCriticalFormula(bonusDamageFormula);
    let damageFormula = workflow.damageRoll._formula + ' + ' + bonusDamageFormula;
    let damageRoll = await new Roll(damageFormula).roll({ async: true });
    await workflow.setDamageRoll(damageRoll);
    queue.remove(workflow.item.uuid);
}

export let arcaneArmor = {
    'selector': selector,
    'guardianArmor': guardianArmor,
    'thunderGauntletsOrigin': thunderGauntletsOrigin,
    'thunderGauntletsTarget': thunderGauntletsTarget,
    'defensiveField': defensiveField,
    'infiltratorArmor': infiltratorArmor,
    'lightningLauncher': lightningLauncher
}