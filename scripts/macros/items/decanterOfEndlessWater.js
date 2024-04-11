async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    new Sequence()

        .effect()
        .file("animated-spell-effects-cartoon.water.79")
        .atLocation(token)
        .rotateTowards(target)
        .scale(0.5)

        .effect()
        .file("jb2a.template_line_piercing.water.01.blue")
        .atLocation(token)
        .rotateTowards(target)
        .delay(100)
        .scale(0.5)
        .repeats(6, 20)

        .play()
}
async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    await chrisPremades.helpers.addCondition(workflow.targets.first().actor, "Prone");
}

export let decanterOfEndlessWater = {
    'cast': cast,
    'item': item
}