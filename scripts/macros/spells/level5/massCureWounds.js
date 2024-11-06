import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

export async function massCureWounds({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.targets.size) {
        ui.notifications.warn("No targets found!");
        return;
    }
    let validTargets = [];
    let sourceDisposition = workflow.token.document.disposition;
    for (let target of workflow.targets) {
        let type = await mba.raceOrType(target.actor);
        if (type != "undead" && type != "construct" && target.document.disposition === sourceDisposition) validTargets.push(target);
    }
    if (!validTargets.length) return;
    mba.updateTargets(Array.from(validTargets).map(t => t.id));
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;
    let effect = await mba.findEffect(workflow.actor, "Mass Cure Wounds Template");

    new Sequence()

        .effect()
        .file(`jb2a.magic_signs.circle.02.evocation.complete.red`)
        .attachTo(template)
        .scaleToObject(1)
        .belowTokens()
        .filter("ColorMatrix", { hue: 130 })
        .persist()
        .name(`${workflow.token.document.name} MaCuWo`)

        .play()

    let finalTargets = Array.from(validTargets);
    let ammount = 6;
    let wait = 2000;
    if (validTargets.length > 6) {
        wait = 10;
        await mba.playerDialogMessage(game.user);
        let selection = await mba.selectTarget(workflow.item.name, constants.okCancel, validTargets, false, 'multiple', undefined, false, 'Choose which targets to keep (Max: ' + ammount + ')');
        await mba.clearPlayerDialogMessage();
        if (!selection.buttons) {
            if (effect) await mba.removeEffect(effect);
            return;
        }
        let targetIds = selection.inputs.filter(i => i).slice(0, ammount);
        finalTargets = [];
        for (let id of targetIds) {
            let targetToken = canvas.scene.tokens.get(id);
            if (targetToken) finalTargets.push(targetToken);
        }
        mba.updateTargets(targetIds);
        await warpgate.wait(100);
    }
    let targets = Array.from(game.user.targets);
    let formula = `${workflow.castData.castLevel - 2}d8 + ${mba.getSpellMod(workflow.item)}`;
    let healingRoll = await new Roll(formula).roll({ 'async': true });
    await warpgate.wait(wait);
    await MidiQOL.displayDSNForRoll(healingRoll);
    for (let target of targets) {
        new Sequence()

            .effect()
            .file("jb2a.bless.200px.intro.green")
            .attachTo(target)
            .scaleToObject(1.75)
            .playbackRate(1)
            .belowTokens()

            .effect()
            .file("jb2a.healing_generic.03.burst.green")
            .scaleToObject(1.75)
            .attachTo(target)

            .effect()
            .file(`jb2a.fireflies.many.01.green`)
            .attachTo(target, { followRotation: false })
            .scaleToObject(1.5)
            .delay(1000)
            .duration(5000)
            .fadeIn(500)
            .fadeOut(1000)

            .play();
    }
    await warpgate.wait(1000);
    await mba.applyWorkflowDamage(workflow.token, healingRoll, "healing", finalTargets, "Mass Cure Wounds", workflow.itemCardId);
    await warpgate.wait(2500);
    if (effect) await mba.removeEffect(effect);
}