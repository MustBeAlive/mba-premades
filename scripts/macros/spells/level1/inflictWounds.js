export async function inflictWounds({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let target = workflow.targets.first()

    new Sequence()

        .effect()
        .file("jb2a.unarmed_strike.magical.01.green")
        .attachTo(token)
        .stretchTo(target)

        .effect()
        .file("jb2a.impact.green.9")
        .delay(800)
        .atLocation(target)
        .scaleToObject(2 * target.document.texture.scaleX)

        .effect()
        .file("animated-spell-effects-cartoon.misc.blood splatter")
        .delay(950)
        .atLocation(target)
        .scaleToObject(2.5 * target.document.texture.scaleX)
        .duration(3500)
        .noLoop(true)
        .fadeOut(500)
        .belowTokens()

        .play()
}