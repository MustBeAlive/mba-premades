async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    await new Sequence()

        .effect()
        .file('jb2a.cone_of_cold.blue')
        .attachTo(template, { offset: { x: 1.5 }, local: true, gridUnits: true })
        .scaleToObject(1)
        .scale({ x: 1.25, y: 1.5 })
        .playbackRate(.7)
        .belowTokens()

        .play();

    for (let target of workflow.targets) {
        new Sequence()

            .effect()
            .file('jb2a.markers.snowflake.blue.01')
            .atLocation(target)
            .scaleToObject(1.5)
            .delay(150)
            .fadeIn(500)
            .fadeOut(500)
            .playbackRate(2)

            .play();
    }
}
async function item({ speaker, actor, token, character, item, args, scope, workflow }) {

    for (let i of workflow.failedSaves) {

        new Sequence()

            .effect()
            .file('jb2a.impact_themed.ice_shard.blue')
            .atLocation(i)
            .scaleToObject(1.5)
            .delay(200)
            .playbackRate(0.75)

            .play();
    }
    for (let i of workflow.saves) {
        new Sequence()

            .effect()
            .file('jb2a.energy_field.02.above.blue')
            .duration(3000)
            .startTime(1200)
            .atLocation(i)
            .scaleToObject(1)
            .playbackRate(2)

            .play();
    }

}

export let frostFingers = {
    'cast': cast,
    'item': item
}