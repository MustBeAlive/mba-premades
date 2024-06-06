export async function inflictWounds({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first()

    new Sequence()

        .effect()
        .file("jb2a.unarmed_strike.magical.01.green")
        .attachTo(token)
        .stretchTo(target)

        .effect()
        .file("jb2a.impact.green.9")
        .atLocation(target)
        .scaleToObject(2 * target.document.texture.scaleX)
        .delay(800)
        .playIf(() => {
            return workflow.hitTargets.size
        })

        .effect()
        .file("jaamod.sequencer_fx_master.blood_splat.red.2")
        .attachTo(target)
        .scaleToObject(1.7)
        .delay(900)
        .duration(5000)
        .fadeOut(1000)
        .belowTokens()
        .playIf(() => {
            return workflow.hitTargets.size
        })

        .play()
}