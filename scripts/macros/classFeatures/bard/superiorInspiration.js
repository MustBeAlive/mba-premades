import {mba} from "../../../helperFunctions.js";

export async function superiorInspiration(actor, token) {
    let inspirationItem = await mba.getItem(actor, "Bardic Inspiration");
    if (!inspirationItem) return;
    let uses = inspirationItem.system.uses.value;
    if (uses > 0) return;
    let feature = await mba.getItem(actor, "Superior Inspiration");
    if (!feature) return;

    new Sequence()

        .effect()
        .file("jb2a.markers.music.pink")
        .attachTo(token)
        .scaleToObject(1.2)
        .fadeIn(1000)
        .fadeOut(1000)

        .wait(750)

        .thenDo(async () => {
            await feature.displayCard();
            await inspirationItem.update({ "system.uses.value": 1 });
        })

        .play()
}