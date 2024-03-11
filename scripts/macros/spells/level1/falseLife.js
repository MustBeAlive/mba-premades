export async function falseLife(actor) {
    await actor.update({ "system.attributes.hp.temp": 0 })
}