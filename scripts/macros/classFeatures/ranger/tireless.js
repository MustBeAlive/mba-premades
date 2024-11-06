import {mba} from "../../../helperFunctions.js";

export async function tireless(actor, token) {
    let exhaustion = actor.effects.find(e => e.name.toLowerCase().includes("Exhaustion".toLowerCase()));
    if (!exhaustion) return;
    let level = +exhaustion.name.slice(-1);
    if (level === 0) level = 10;
    new Sequence()

        .effect()
        .file("jb2a.healing_generic.03.burst.green")
        .attachTo(token)
        .scaleToObject(2 * token.document.texture.scaleX)

        .wait(1000)

        .thenDo(async () => {
            await ChatMessage.create({
                flavor: `<h2>Deft Explorer: Tireless</h2>${token.document.name} loses level of exhaustion.`,
                speaker: ChatMessage.getSpeaker({ actor: actor })
            });
            if (level === 1) await mba.removeCondition(actor, "Exhaustion 1");
            else {
                await mba.removeCondition(actor, `Exhaustion ${level}`);
                await mba.addCondition(actor, `Exhaustion ${level - 1}`);
            }
        })

        .play()
}