export async function falseLife({speaker, actor, token, character, item, args, scope, workflow}) {
    let sourceActor = game.actors.get(token.document.actorId);
    if (sourceActor.system.attributes.hp.temp > 0) {
        actor.update({ "system.attributes.hp.temp": 0 })
    }
}