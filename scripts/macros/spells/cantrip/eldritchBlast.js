import {mba} from "../../../helperFunctions.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
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
    if (!workflow.hitTargets.size) {
        let offsetX = Math.floor(Math.random() * (Math.floor(2) - Math.ceil(0) + 1) + Math.ceil(0));
        if (offsetX === 0) offsetX = 1;
        let offsetY = Math.floor(Math.random() * (Math.floor(2) - Math.ceil(0) + 1) + Math.ceil(0));
        if (offsetY === 0) offsetY = 1;
        new Sequence()

            .effect()
            .file(animation)
            .attachTo(token)
            .stretchTo(target, { offset: { x: offsetX, y: offsetY }, gridUnits: true })

            .play()

        return;
    };

    new Sequence()

        .effect()
        .file(animation)
        .attachTo(token)
        .stretchTo(target)

        .play()
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.damageRoll) return;
    let agonizingBlast = workflow.actor.flags['mba-premades']?.feature?.agonizingBlast;
    if (!agonizingBlast) return;
    let queueSetup = await chrisPremades.queue.setup(workflow.item.uuid, 'agonizingBlast', 50);
    if (!queueSetup) return;
    let bonusDamage = Math.max(workflow.actor.system.abilities.cha.mod, 0);
    let damageFormula = workflow.damageRoll._formula + ' + ' + bonusDamage;
    let damageRoll = await new Roll(damageFormula).roll({async: true});
    await workflow.setDamageRoll(damageRoll);
    chrisPremades.queue.remove(workflow.item.uuid);
}

export let eldritchBlast = {
    'cast': cast,
    'item': item
}