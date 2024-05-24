import {mba} from "../../../helperFunctions.js"

export async function locateObject({ speaker, actor, token, character, item, args, scope, workflow }) {
    let location = {
        x: workflow.token.center.x,
        y: workflow.token.center.y
    }

    new Sequence()

        .wait(1000)

        //First Wave

        .effect()
        .file("jb2a.detect_magic.cone.purple")
        .atLocation(location, { offset: { x: 3 }, gridUnits: true })
        .scaleToObject(12)
        .fadeOut(4000)
        .opacity(0.9)
        .playbackRate(0.75)
        .spriteRotation(0)
        .name(`right`)

        .effect()
        .file("jb2a.detect_magic.cone.blue")
        .atLocation(location, { offset: { y: 3 }, gridUnits: true })
        .scaleToObject(12)
        .fadeOut(4000)
        .opacity(0.9)
        .playbackRate(0.75)
        .spriteRotation(90)
        .name(`bottom`)

        .effect()
        .file("jb2a.detect_magic.cone.purple")
        .atLocation(location, { offset: { x: -3 }, gridUnits: true })
        .scaleToObject(12)
        .fadeOut(4000)
        .opacity(0.9)
        .playbackRate(0.75)
        .spriteRotation(180)
        .name(`left`)

        .effect()
        .file("jb2a.detect_magic.cone.blue")
        .atLocation(location, { offset: { y: -3 }, gridUnits: true })
        .scaleToObject(12)
        .fadeOut(4000)
        .opacity(0.9)
        .playbackRate(0.75)
        .spriteRotation(270)
        .name(`top`)

        //Second Wave

        .effect()
        .file("jb2a.detect_magic.cone.purple")
        .atLocation(location, { offset: { x: 3 }, gridUnits: true })
        .scaleToObject(12)
        .delay(750)
        .fadeOut(4000)
        .opacity(0.9)
        .playbackRate(0.75)
        .spriteRotation(45)
        .name(`right`)

        .effect()
        .file("jb2a.detect_magic.cone.blue")
        .atLocation(location, { offset: { y: 3 }, gridUnits: true })
        .scaleToObject(12)
        .delay(750)
        .fadeOut(4000)
        .opacity(0.9)
        .playbackRate(0.75)
        .spriteRotation(135)
        .name(`bottom`)

        .effect()
        .file("jb2a.detect_magic.cone.purple")
        .atLocation(location, { offset: { x: -3 }, gridUnits: true })
        .scaleToObject(12)
        .delay(750)
        .fadeOut(4000)
        .opacity(0.9)
        .playbackRate(0.75)
        .spriteRotation(225)
        .name(`left`)

        .effect()
        .file("jb2a.detect_magic.cone.blue")
        .atLocation(location, { offset: { y: -3 }, gridUnits: true })
        .scaleToObject(12)
        .delay(750)
        .fadeOut(4000)
        .opacity(0.9)
        .playbackRate(0.75)
        .spriteRotation(315)
        .name(`top`)

        .play()

    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Describe or name an object that is familiar to you.</p>
            <p>You sense the direction to the object's location, as long as that object is within 1,000 feet of you. If the object is in motion, you know the direction of its movement</p>
            <p>The spell can locate a specific object known to you, as long as you have seen it up close (within 30 feet) at least once.</p>
            <p>Alternatively, the spell can locate the nearest object of a particular kind, such as a certain kind of apparel, jewelry, furniture, tool, or weapon.</p>
            <p>This spell can't locate an object if any thickness of lead, even a thin sheet, blocks a direct path between you and the object.</p>
        `,
        'duration': {
            'seconds': 600
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
    await mba.createEffect(workflow.actor, effectData);
}