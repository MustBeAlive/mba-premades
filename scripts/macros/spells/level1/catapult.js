export async function catapult({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();

    new Sequence()

        .wait(200)

        .effect()
        .file("jb2a.boulder.toss.01.02")
        .attachTo(workflow.token)
        .stretchTo(target)
        .playbackRate(0.9)
        .waitUntilFinished(-2000)

        .effect()
        .file("jb2a.impact.ground_crack.white.01")
        .attachTo(target)
        .scaleToObject(2.5 * target.document.texture.scaleX)
        .belowTokens()
        .playIf(() => {
            return (workflow.failedSaves.size === 1);
        })

        .play()
}