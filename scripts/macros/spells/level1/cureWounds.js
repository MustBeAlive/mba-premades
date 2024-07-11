import {mba} from "../../../helperFunctions.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let type = mba.raceOrType(workflow.targets.first().actor);
    if (type === "undead" || type === "construct") {
        ui.notifications.warn("Cure Wounds fails!");
        return false;
    }
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    new Sequence()

        .wait(500)

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

export let cureWounds = {
    'cast': cast,
    'item': item
}