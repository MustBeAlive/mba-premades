import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    if (!target) return;
    let random = false;
    let animation = "jb2a.eldritch_blast.pink";
    if (random === true) {
        let colors = [
            ["dark_green"],
            ["dark_pink"],
            ["dark_purple"],
            ["dark_red"],
            ["green"],
            ["lightblue"],
            ["lightgreen"],
            ["orange"],
            ["pink"],
            ["purple"],
            ["rainbow"],
            ["yellow"]
        ];
        let animRoll = await new Roll('1d12').roll({ 'async': true });
        animation = `jb2a.eldritch_blast.${colors[animRoll.total - 1]}`
    }
    if (mba.getItem(workflow.actor, "Healing Light")) animation = "jb2a.eldritch_blast.yellow";
    if (!workflow.hitTargets.size) {
        let offsetX = Math.floor(Math.random() * (Math.floor(2) - Math.ceil(0) + 1) + Math.ceil(0));
        if (offsetX === 0) offsetX = 1;
        let offsetY = Math.floor(Math.random() * (Math.floor(2) - Math.ceil(0) + 1) + Math.ceil(0));
        if (offsetY === 0) offsetY = 1;
        new Sequence()

            .effect()
            .file(animation)
            .attachTo(workflow.token)
            .stretchTo(target, { offset: { x: offsetX, y: offsetY }, gridUnits: true })

            .play()

        return;
    };
    let push = false;
    let repellingBlast = workflow.actor.flags['mba-premades']?.feature?.repellingBlast;
    if (repellingBlast) push = await mba.dialog("Repelling Blast", constants.yesNo, `<b>Push <u>${target.document.name}</u> 10 feet in a straight line?</b>`);

    new Sequence()

        .effect()
        .file(animation)
        .attachTo(workflow.token)
        .stretchTo(target)
        .waitUntilFinished(-3100)

        .thenDo(async () => {
            if (push) await mba.pushToken(workflow.token, target, 10);
        })

        .play()
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.damageRoll) return;
    let agonizingBlast = workflow.actor.flags['mba-premades']?.feature?.agonizingBlast;
    if (!agonizingBlast) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'agonizingBlast', 50);
    if (!queueSetup) return;
    let bonusDamage = Math.max(workflow.actor.system.abilities.cha.mod, 0);
    let damageFormula = workflow.damageRoll._formula + ' + ' + bonusDamage;
    let damageRoll = await new Roll(damageFormula).roll({async: true});
    await workflow.setDamageRoll(damageRoll);
    queue.remove(workflow.item.uuid);
}

export let eldritchBlast = {
    'cast': cast,
    'item': item
}