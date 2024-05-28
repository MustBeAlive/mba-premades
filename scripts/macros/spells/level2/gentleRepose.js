import {mba} from "../../../helperFunctions.js";

export async function gentleRepose({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    if (!mba.findEffect(target.actor, 'Dead')) {
        ui.notifications.warn("Target is not dead!");
        return;
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>For the duration, you are protected from decay and can't become undead.</p>
            <p>The spell also effectively extends the time limit on raising from the dead, since days spent under the influence of this spell don't count against the time limit of resurrection spells.</p>
        `,
        'duration': {
            'seconds': 864000
        },
        'flags': {
            'midi-qol': {
                'castData': {
                    baseLevel: 2,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    let offset = [
        { x: 0, y: -0.55 },
        { x: -0.5, y: -0.15 },
        { x: -0.3, y: 0.45 },
        { x: 0.3, y: 0.45 },
        { x: 0.5, y: -0.15 }
    ];
    
    await new Sequence()

        .effect()
        .file("jb2a.icon.runes.yellow")
        .attachTo(target, { offset: offset[0], gridUnits: true, followRotation: false })
        .scaleToObject(0.5)
        .duration(5900)
        .fadeIn(300)
        .fadeOut(500)
        .scaleIn(0, 250, { ease: "easeOutBack" })
        .zIndex(1)
        .aboveLighting()

        .effect()
        .file("jb2a.icon.runes.yellow")
        .attachTo(target, { offset: offset[1], gridUnits: true, followRotation: false })
        .scaleToObject(0.5)
        .delay(600)
        .duration(5300)
        .fadeIn(300)
        .fadeOut(500)
        .scaleIn(0, 250, { ease: "easeOutBack" })
        .zIndex(1)
        .aboveLighting()

        .effect()
        .file("jb2a.icon.runes.yellow")
        .attachTo(target, { offset: offset[2], gridUnits: true, followRotation: false })
        .scaleToObject(0.5)
        .delay(1200)
        .duration(4700)
        .fadeIn(300)
        .fadeOut(500)
        .scaleIn(0, 250, { ease: "easeOutBack" })
        .zIndex(1)
        .aboveLighting()

        .effect()
        .file("jb2a.icon.runes.yellow")
        .attachTo(target, { offset: offset[3], gridUnits: true, followRotation: false })
        .scaleToObject(0.5)
        .delay(1800)
        .duration(4100)
        .fadeIn(300)
        .fadeOut(500)
        .scaleIn(0, 250, { ease: "easeOutBack" })
        .zIndex(1)
        .aboveLighting()

        .effect()
        .file("jb2a.icon.runes.yellow")
        .attachTo(target, { offset: offset[4], gridUnits: true, followRotation: false })
        .scaleToObject(0.5)
        .delay(2400)
        .duration(3500)
        .fadeIn(300)
        .fadeOut(500)
        .scaleIn(0, 250, { ease: "easeOutBack" })
        .zIndex(1)
        .aboveLighting()

        .effect()
        .file("jb2a.swirling_sparkles.01.greenorange")
        .atLocation(target)
        .scaleToObject(1.7 * target.document.texture.scaleX)
        .delay(3000)
        .fadeIn(500)
        .waitUntilFinished(-1100)

        .effect()
        .file("jb2a.particles.swirl.greenyellow.02.01")
        .atLocation(target)
        .scaleToObject(1.7 * target.document.texture.scaleX)
        .duration(5300)
        .fadeIn(700)
        .fadeOut(700)

        .effect()
        .file("jb2a.ui.heartbeat.02.green")
        .attachTo(target)
        .scaleToObject(1.5)
        .delay(500)
        .playbackRate(0.9)
        .filter("ColorMatrix", { hue: 270 })
        .repeats(3, 1500)
        .aboveInterface()

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectData);
        })

        .play();
}