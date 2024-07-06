export async function poisonSpray({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();

    new Sequence()

        .effect()
        .file("animated-spell-effects-cartoon.cantrips.poison_spray.green")
        .attachTo(workflow.token)
        .stretchTo(target)

        .effect()
        .file("jb2a.impact_themed.poison.greenyellow")
        .delay(220)
        .attachTo(target)
        .scaleToObject(1.7 * target.document.texture.scaleX)
        .playIf(() => {
            return workflow.failedSaves.size
        })

        .play()
}