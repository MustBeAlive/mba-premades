import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let nearbyAllies = Array.from(mba.findNearby(workflow.token.document, 100, 'ally', false, true));
    await mba.playerDialogMessage(game.user);
    let selection = await mba.selectTarget(workflow.item.name, constants.okCancel, nearbyAllies, true, 'multiple', undefined, false, "Choose creatures that won't trigger the alarm:");
    await mba.clearPlayerDialogMessage();
    if (!selection.buttons) return;
    let ignoreUuids = selection.inputs.filter(i => i).slice(0);
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;
    await template.update({
        'flags': {
            'mba-premades': {
                'template': {
                    'ignoreUuids': ignoreUuids,
                    'sourceUuid': workflow.token.document.uuid,
                    'templateUuid': template.uuid,
                }
            }
        }
    });
    new Sequence()

        .effect()
        .file("jb2a.magic_signs.circle.02.abjuration.complete.blue")
        .attachTo(template)
        .size(4, { gridUnits: true })

        .effect()
        .file("jaamod.spells_effects.alarm")
        .attachTo(template)
        .size(4.2, { gridUnits: true })
        .delay(2500)
        .fadeIn(1000)
        .fadeOut(2000)
        .persist()
        .name("Alarm")

        .play()
}

async function enter(template, token) {
    let trigger = template.flags['mba-premades']?.template;
    if (!trigger) return;
    await alarm.trigger(token.document, trigger);
}

async function trigger(token, trigger) {
    let template = await fromUuid(trigger.templateUuid);
    if (!template) return;
    let ignoreUuids = template.flags['mba-premades']?.template?.ignoreUuids;
    let ally = ignoreUuids.filter(i => i === token.uuid);
    if (ally.length) return;
    let sourceToken = await fromUuid(template.flags['mba-premades']?.template?.sourceUuid);
    await mba.playerDialogMessage(mba.firstOwner(sourceToken));
    await mba.remoteDialog("Alarm!", [["Ok!", "ok"]], mba.firstOwner(sourceToken).id, '<b>Someone entered the Alarm zone!</b>');
    await mba.clearPlayerDialogMessage();
}

export let alarm = {
    'cast': cast,
    'trigger': trigger,
    'enter': enter
}