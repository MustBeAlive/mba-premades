import {mba} from "../../../helperFunctions.js";

export async function speakWithAnimals({ speaker, actor, token, character, item, args, scope, workflow }) {
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You gain the ability to comprehend and verbally communicate with beasts for the duration.</p>
            <p>The knowledge and awareness of many beasts is limited by their intelligence, but at minimum, beasts can give you information about nearby locations and monsters, including whatever they can perceive or have perceived within the past day.</p>
            <p>You might be able to persuade a beast to perform a small favor for you, at the DM's discretion.</p>
        `,
        'duration': {
            'seconds': 600
        },
        'flags': {
            'midi-qol': {
                'castData': {
                    baseLevel: 1,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };

    new Sequence()

        .wait(500)

        .effect()
        .file("jb2a.markers.light.nopulse.blue")
        .attachTo(workflow.token)
        .size(4, { gridUnits: true })
        .fadeIn(500)
        .fadeOut(1500)
        .duration(7000)
        .scaleIn(0, 3000, { ease: "easeOutCubic" })
        .belowTokens()

        .effect()
        .file("jb2a.hunters_mark.loop.02.blue")
        .delay(1000)
        .attachTo(workflow.token)
        .scaleToObject(1)
        .scaleIn(0, 3000, { ease: "easeOutCubic" })
        .zIndex(0.1)
        .fadeOut(1500)
        .duration(6000)
        .filter("ColorMatrix", { hue: 350 })

        .wait(1000)

        .thenDo(async () => {
            await mba.createEffect(workflow.actor, effectData);
        })

        .play()
}