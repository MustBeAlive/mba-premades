export async function primalSavagery({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    if (!target) return;
    new Sequence()

        .effect()
        .file("jb2a.bite.400px.green")
        .attachTo(target)
        .scaleToObject(2.5)

        .effect()
        .file("jaamod.sequencer_fx_master.blood_splat.red.2")
        .attachTo(target)
        .scaleToObject(1.7)
        .delay(100)
        .duration(5000)
        .fadeOut(1000)
        .belowTokens()
        .playIf(() => {
            return workflow.hitTargets.size
        })

        .play()
}