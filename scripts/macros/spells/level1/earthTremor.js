import {mba} from "../../../helperFunctions.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);

    new Sequence()

        .wait(500)

        .effect()
        .file("jb2a.cast_generic.earth.01.browngreen.0")
        .attachTo(token)
        .scaleToObject(2 * token.document.texture.scaleX)
        .waitUntilFinished(-1000)

        .effect()
        .file("jaamod.spells_effects.earth_tremor")
        .attachTo(template)
        .size(6, { gridUnits: true })
        .duration(10000)
        .fadeIn(500)
        .fadeOut(1000)
        .opacity(0.85)
        .shape("circle", {
            lineSize: 4,
            lineColor: "#FF0000",
            fillColor: "#FF0000",
            radius: 2.6,
            gridUnits: true,
            name: "tremor",
            isMask: true
        })
        .belowTokens()
        .zIndex(1.2)

        .effect()
        .file("jb2a.scorched_earth.black")
        .attachTo(template)
        .size(5.4, { gridUnits: true })
        .delay(3000)
        .fadeIn(4000)
        .fadeOut(2000)
        .opacity(0.8)
        .belowTokens()
        .persist()
        .name(`Earth Tremor`)

        .play()
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let targets = Array.from(workflow.failedSaves);
    for (let target of targets) {
        if (mba.findEffect(target.actor, "Prone")) continue;
        await mba.addCondition(target.actor, "Prone");
    }
}

export let earthTremor = {
    'cast': cast,
    'item': item
}