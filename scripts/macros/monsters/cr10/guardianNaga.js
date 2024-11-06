async function spitPoison({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();

    new Sequence()

        .effect()
        .file("jb2a.ranged.04.projectile.01.green")
        .atLocation(workflow.token)
        .stretchTo(target)
        .missed(!workflow.hitTargets.size)

        .play()
}

export let guardianNaga = {
    'spitPoison': spitPoison
}