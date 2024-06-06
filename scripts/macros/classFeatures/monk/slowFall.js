export async function slowFall({ speaker, actor, token, character, item, args, scope, workflow }) {
    new Sequence()

        .effect()
        .file("jb2a.swirling_feathers.outburst.01.blue.1")
        .atLocation(workflow.token)
        .scaleToObject(2 * workflow.token.document.texture.scaleX)

        .play()
}