import {mba} from "../../../helperFunctions.js";

export async function sorcerousRestoration({ speaker, actor, token, character, item, args, scope, workflow }) {
    let pointsItem = await mba.getItem(actor, "Sorcery Points");
    if (!pointsItem) return;
    let value = pointsItem.system.uses.value;
    let max = pointsItem.system.uses.max;
    if (max === value) return;
    if (max > (value + 4)) value += 4;
    else if (max <= (value + 4)) value = max;

    new Sequence()

        .effect()
        .file("jb2a.dodecahedron.rune.below.blueyellow")
        .attachTo(token)
        .scaleToObject(2.5 * token.document.texture.scaleX)
        .duration(4000)
        .fadeIn(1000)
        .fadeOut(500)
        .belowTokens()

        .effect()
        .file("jb2a.particle_burst.01.rune.yellow")
        .attachTo(token)
        .scaleToObject(2 * token.document.texture.scaleX)
        .delay(2000)
        .fadeIn(1000)
        .playbackRate(0.9)

        .wait(1500)

        .thenDo(async () => {
            await pointsItem.update({ "system.uses.value": value });
        })

        .play()
}