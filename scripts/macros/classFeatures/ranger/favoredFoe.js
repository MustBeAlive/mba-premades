import { constants } from "../../generic/constants.js";
import { mba } from "../../../helperFunctions.js";
import { queue } from "../../mechanics/queue.js";

async function trigger({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    if (!constants.attacks.includes(workflow.item.system.actionType)) return;
    let originItem = mba.getItem(workflow.actor, "Favored Foe");
    if (!originItem) {
        ui.notifications.warn("Unable to find feature! (Favored Foe)");
        return;
    }
    let turnCheck = mba.perTurnCheck(originItem, "feature", "favoredFoe", true, workflow.token.id);
    if (!turnCheck) return;
    let target = workflow.targets.first();
    let effect = await mba.getEffects(target.actor).find(e => e.name === "Favored Foe" && e.origin === originItem.uuid);
    let queueSetup = await queue.setup(workflow.item.uuid, "favoredFoe", 250);
    if (!queueSetup) return;
    if (effect) {
        await favoredFoe.damage(workflow);
        if (mba.inCombat()) await mba.setTurnCheck(originItem, "feature", "favoredFoe");
        queue.remove(workflow.item.uuid);
        return;
    }
    let uses = originItem.system.uses.value;
    let max = originItem.system.uses.max;
    if (!uses) return;
    await mba.playerDialogMessage();
    let selection = await mba.dialog(originItem.name, constants.yesNo, `Use Favored Foe? (Uses left: ${uses}/${max})`);
    await mba.clearPlayerDialogMessage();
    if (!selection) {
        queue.remove(workflow.item.uuid);
        return;
    }
    let [config, options] = constants.syntheticItemWorkflowOptions([target.document.uuid]);
    await warpgate.wait(100);
    await MidiQOL.completeItemUse(originItem, config, options);
    await originItem.update({ 'system.uses.value': uses - 1 });
    await favoredFoe.damage(workflow);
    if (mba.inCombat()) await mba.setTurnCheck(originItem, "feature", "favoredFoe");
    queue.remove(workflow.item.uuid);
}

async function damage(workflow) {
    let size = 4;
    let rangerLevel = workflow.actor.classes.ranger?.system?.levels;
    if (rangerLevel >= 6 && rangerLevel < 14) size = 6;
    else if (rangerLevel >= 14) size = 8;
    let oldFormula = workflow.damageRoll._formula;
    let bonusDamageFormula = `1d${size}[${workflow.defaultDamageType}]`;
    if (workflow.isCritical) bonusDamageFormula = mba.getCriticalFormula(bonusDamageFormula);
    let damageFormula = oldFormula + ' + ' + bonusDamageFormula;
    let damageRoll = await new Roll(damageFormula).roll({ async: true });
    await workflow.setDamageRoll(damageRoll);

    let targetToken = workflow.hitTargets.first();

    new Sequence()

        .effect()
        .file(`jb2a.particles.outward.orange.01.03`)
        .attachTo(targetToken)
        .scale(0.15)
        .duration(5500)
        .fadeOut(500)
        .scaleIn(0, 1000, { ease: "easeOutCubic" })
        .zIndex(0.2)
        .filter("ColorMatrix", { hue: 0 })

        .effect()
        .file("jb2a.hunters_mark.loop.01.red")
        .attachTo(targetToken)
        .scaleToObject(0.9)
        .duration(5500)
        .fadeOut(1000)
        .scaleIn(0, 250, { ease: "easeOutCubic" })
        .zIndex(0.1)
        .filter("ColorMatrix", { hue: 25 })

        .effect()
        .file("animated-spell-effects-cartoon.simple.27")
        .attachTo(targetToken)
        .scaleToObject(4)
        .spriteOffset({ x: 0.1, y: -0.45 }, { gridUnits: true })
        .filter("ColorMatrix", { brightness: -1 })
        .belowTokens()

        .effect()
        .from(targetToken)
        .attachTo(targetToken)
        .scaleToObject(targetToken.document.texture.scaleX)
        .duration(500)
        .fadeOut(300)
        .loopProperty("sprite", "position.x", { from: -0.05, to: 0.05, duration: 175, pingPong: true, gridUnits: true })
        .tint("#bd7800")
        .opacity(0.45)

        .play()
}

export let favoredFoe = {
    'trigger': trigger,
    'damage': damage
}