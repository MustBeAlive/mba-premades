import {mba} from "../../../helperFunctions.js";

export async function thornWhip({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    if (workflow.hitTargets.size != 1) {
        new Sequence()

            .effect()
            .atLocation(workflow.token)
            .file('animated-spell-effects-cartoon.electricity.discharge.03')
            .stretchTo(target, { 'attachTo': true })
            .delay(0)
            .filter('ColorMatrix', { hue: 200 })
            .tint("#3d3d3d")
            .scaleIn(0, 750, { 'ease': 'easeOutQuint' })
            .repeats(2, 600, 600)

            .wait(250)

            .effect()
            .file('animated-spell-effects-cartoon.electricity.25')
            .atLocation(target)
            .scaleToObject(2 * target.document.width)
            .playbackRate(1)
            .spriteRotation(90)
            .mirrorX()
            .tint("#523000")
            .filter('ColorMatrix', { 'saturate': 1, 'hue': -15 })
            .zIndex(2)

            .play()

        return;
    }
    let size = mba.getSize(target.actor);
    let distance = mba.getDistance(workflow.token, target);
    let pullDistance = 0;
    if (distance > 5 && distance <= 10) pullDistance = -5;
    if (distance > 10) pullDistance = -10;
    if (size > 3) {
        ui.notifications.info('Target is unable to be moved!');
        pullDistance = 0;
    }
    let position = mba.getGridBetweenTokens(workflow.token, target, pullDistance);

    new Sequence()

        .effect()
        .atLocation(workflow.token)
        .file('animated-spell-effects-cartoon.electricity.discharge.03')
        .stretchTo(target, { 'attachTo': true })
        .delay(0)
        .filter('ColorMatrix', { hue: 200 })
        .tint("#3d3d3d")
        .scaleIn(0, 750, { 'ease': 'easeOutQuint' })
        .repeats(2, 600, 600)

        .wait(250)

        .effect()
        .file('animated-spell-effects-cartoon.electricity.25')
        .atLocation(target)
        .scaleToObject(2 * target.document.width)
        .playbackRate(1)
        .spriteRotation(90)
        .mirrorX()
        .tint("#523000")
        .filter('ColorMatrix', { 'saturate': 1, 'hue': -15 })
        .moveTowards({ 'x': position.x + (canvas.grid.size * target.document.width) / 2, 'y': position.y + (canvas.grid.size * target.document.height) / 2 }, { 'ease': 'easeInOutBack', 'rotate': false })
        .zIndex(2)
        .playIf(() => {
            return pullDistance != 0
        })

        .animation()
        .on(target)
        .opacity(0)
        .playIf(() => {
            return pullDistance != 0
        })

        .animation()
        .on(target)
        .moveTowards({ 'x': position.x, 'y': position.y })
        .opacity(0)
        .delay(250)
        .playIf(() => {
            return pullDistance != 0
        })

        .effect()
        .from(target)
        .atLocation(target)
        .moveTowards({ 'x': position.x + (canvas.grid.size * target.document.width) / 2, 'y': position.y + (canvas.grid.size * target.document.height) / 2 }, { 'ease': 'easeInOutBack', 'rotate': false })
        .zIndex(0.1)
        .scaleToObject(target.document.texture.scaleX * target.document.width)
        .extraEndDuration(500)
        .waitUntilFinished(-300)
        .playIf(() => {
            return pullDistance != 0
        })

        .animation()
        .on(target)
        .fadeIn(250)
        .opacity(1)
        .playIf(() => {
            return pullDistance != 0
        })

        .effect()
        .from(target)
        .atLocation(target)
        .loopProperty('sprite', 'position.x', { 'from': -0.05, 'to': 0.05, 'duration': 75, 'pingPong': true, 'gridUnits': true })
        .scaleToObject(target.document.texture.scaleX)
        .delay(250)
        .opacity(0.5)
        .playIf(() => {
            let distanceToTargetX = Math.abs(workflow.token.x - position.x);
            let distanceToTargetY = Math.abs(workflow.token.y - position.y);
            return distanceToTargetX <= canvas.grid.size && distanceToTargetY <= canvas.grid.size;
        })

        .play()
}