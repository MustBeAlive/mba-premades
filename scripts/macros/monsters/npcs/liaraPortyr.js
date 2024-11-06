import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function flamingFury({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size || !constants.meleeAttacks.includes(workflow.item.system.actionType)) return;
    if (mba.findEffect(workflow.actor, "Flaming Fury: Used")) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'flamingFury', 250);
    if (!queueSetup) return;
    await mba.gmDialogMessage();
    let selection = await mba.dialog("Flaming Fury", constants.yesNo, "Use ability? (+3d6[fire])");
    await mba.clearGMDialogMessage();
    if (!selection) {
        queue.remove(workflow.item.uuid);
        return;
    }
    let oldFormula = workflow.damageRoll._formula;
    let bonusDamageFormula = `3d6[fire]`;
    if (workflow.isCritical) bonusDamageFormula = mba.getCriticalFormula(bonusDamageFormula);
    let damageFormula = oldFormula + ' + ' + bonusDamageFormula;
    let damageRoll = await new Roll(damageFormula).roll({ async: true });
    await workflow.setDamageRoll(damageRoll);
    let effectData = {
        'name': "Flaming Fury: Used",
        'icon': "modules/mba-premades/icons/generic/generic_fire.webp",
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['turnStart']
            }
        }
    };
    new Sequence()

        .effect()
        .file("animated-spell-effects-cartoon.fire.19")
        .attachTo(workflow.token)
        .scaleToObject(1.8)

        .wait(300)

        .effect()
        .file("animated-spell-effects-cartoon.fire.15")
        .attachTo(workflow.token)
        .scaleToObject(1.5)
        .repeats(2, 100)

        .thenDo(async () => {
            await mba.createEffect(workflow.actor, effectData);
            queue.remove(workflow.item.uuid);
        })

        .play()
}

export let liaraPortyr = {
    'flamingFury': flamingFury
}