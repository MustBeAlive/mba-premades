export async function locateAnimalsOrPlants({ speaker, actor, token, character, item, args, scope, workflow }) {
    let location = {
        x: workflow.token.center.x,
        y: workflow.token.center.y
    }

    new Sequence()

        .wait(1000)

        //First Wave

        .effect()
        .file("jb2a.detect_magic.cone.green")
        .atLocation(location, { offset: { x: 3 }, gridUnits: true })
        .scaleToObject(12)
        .fadeOut(4000)
        .opacity(0.9)
        .playbackRate(0.75)
        .spriteRotation(0)
        .name(`right`)

        .effect()
        .file("jb2a.detect_magic.cone.yellow")
        .atLocation(location, { offset: { y: 3 }, gridUnits: true })
        .scaleToObject(12)
        .fadeOut(4000)
        .opacity(0.9)
        .playbackRate(0.75)
        .spriteRotation(90)
        .name(`bottom`)

        .effect()
        .file("jb2a.detect_magic.cone.green")
        .atLocation(location, { offset: { x: -3 }, gridUnits: true })
        .scaleToObject(12)
        .fadeOut(4000)
        .opacity(0.9)
        .playbackRate(0.75)
        .spriteRotation(180)
        .name(`left`)

        .effect()
        .file("jb2a.detect_magic.cone.yellow")
        .atLocation(location, { offset: { y: -3 }, gridUnits: true })
        .scaleToObject(12)
        .fadeOut(4000)
        .opacity(0.9)
        .playbackRate(0.75)
        .spriteRotation(270)
        .name(`top`)

        //Second Wave

        .effect()
        .file("jb2a.detect_magic.cone.green")
        .atLocation(location, { offset: { x: 3 }, gridUnits: true })
        .scaleToObject(12)
        .delay(750)
        .fadeOut(4000)
        .opacity(0.9)
        .playbackRate(0.75)
        .spriteRotation(45)
        .name(`right`)

        .effect()
        .file("jb2a.detect_magic.cone.yellow")
        .atLocation(location, { offset: { y: 3 }, gridUnits: true })
        .scaleToObject(12)
        .delay(750)
        .fadeOut(4000)
        .opacity(0.9)
        .playbackRate(0.75)
        .spriteRotation(135)
        .name(`bottom`)

        .effect()
        .file("jb2a.detect_magic.cone.green")
        .atLocation(location, { offset: { x: -3 }, gridUnits: true })
        .scaleToObject(12)
        .delay(750)
        .fadeOut(4000)
        .opacity(0.9)
        .playbackRate(0.75)
        .spriteRotation(225)
        .name(`left`)

        .effect()
        .file("jb2a.detect_magic.cone.yellow")
        .atLocation(location, { offset: { y: -3 }, gridUnits: true })
        .scaleToObject(12)
        .delay(750)
        .fadeOut(4000)
        .opacity(0.9)
        .playbackRate(0.75)
        .spriteRotation(315)
        .name(`top`)

        .play()
}