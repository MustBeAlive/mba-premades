import {mba} from "../../helperFunctions.js";
import {queue} from "../mechanics/queue.js";

async function damage({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size || !workflow.item) return;
    let target = workflow.targets.first();
    let type = await mba.raceOrType(target.actor);
    if (type != "undead" && type != "fiend") return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'holyAvenger', 250);
    if (!queueSetup) return;
    let oldFormula = workflow.damageRoll._formula;
    let bonusDamageFormula = '2d10[radiant]';
    if (workflow.isCritical) bonusDamageFormula = mba.getCriticalFormula(bonusDamageFormula);
    let damageFormula = oldFormula + ' + ' + bonusDamageFormula;
    let damageRoll = await new Roll(damageFormula).roll({ async: true });
    await workflow.setDamageRoll(damageRoll);
    queue.remove(workflow.item.uuid);
}

async function attack({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    await new Sequence()

        .effect()
        .file("jb2a.greatsword.melee.fire.yellow")
        .attachTo(workflow.token)
        .stretchTo(target)
        .mirrorY()
        .size(1.2)
        .missed(!workflow.hitTargets.size)
        .waitUntilFinished(-1000)

        .effect()
        .file("jb2a.impact.yellow.3")
        .attachTo(target)
        .scaleToObject(2 * target.document.texture.scaleX)
        .missed(!workflow.hitTargets.size)

        .play()
}

export let holyAvenger = {
    "damage": damage,
    "attack": attack
}