export async function falseLife({speaker, actor, token, character, item, args, scope, workflow}) {
    if (actor.system.attributes.hp.temp > 0) {
        actor.update({ "system.attributes.hp.temp": 0 })
    }
}