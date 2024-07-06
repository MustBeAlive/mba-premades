export async function iceStorm({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId)?.object;
    if (!template) return;

    await new Sequence()

        .effect()
        .file('jb2a.magic_signs.circle.02.evocation.loop.blue')
        .atLocation(template)
        .size(9, { 'gridUnits': true })
        .scaleIn(0, 500, { 'ease': 'easeOutCubic' })
        .duration(11000)
        .zIndex(0.1)
        .fadeIn(750)
        .fadeOut(1000)
        .belowTokens()

        .effect()
        .file('jb2a.magic_signs.circle.02.evocation.loop.blue')
        .atLocation(template)
        .size(9, { 'gridUnits': true })
        .duration(1000)
        .fadeIn(150, { 'delay': 500 })
        .fadeOut(250)
        .scaleIn(0, 500, { 'ease': 'easeOutCubic' })
        .zIndex(0.11)
        .belowTokens()
        .filter('ColorMatrix', { 'saturate': -1, 'brightness': 2 })
        .filter('Blur', { 'blurX': 5, 'blurY': 10 })

        .effect()
        .file('jb2a.extras.tmfx.border.circle.outpulse.01.fast')
        .atLocation(template)
        .size(12, { 'gridUnits': true })
        .delay(400)
        .duration(1000)
        .fadeOut(1000)
        .scaleIn(0, 500, { 'ease': 'easeOutQuint' })
        .zIndex(1)

        .wait(1000)

        .play();

    new Sequence()

        .effect()
        .file('jb2a.sleet_storm.blue')
        .atLocation(template)
        .size(9.5, { 'gridUnits': true })
        .attachTo(template)
        .delay(500)
        .fadeIn(6000)
        .fadeOut(1000)
        .belowTokens()
        .persist()

        .effect()
        .file('jb2a.smoke.ring.01.white')
        .atLocation(template)
        .size(12, { 'gridUnits': true })
        .delay(500)
        .duration(6000)
        .fadeIn(4000)
        .fadeOut(1000)
        .playbackRate(0.75)
        .opacity(0.2)
        .zIndex(1)

        .effect()
        .file('jb2a.magic_signs.circle.02.evocation.loop.blue')
        .atLocation(template)
        .attachTo(template)
        .size(9, { 'gridUnits': true })
        .delay(500)
        .fadeIn(6000)
        .fadeOut(1000)
        .opacity(0.2)
        .zIndex(0.1)
        .belowTokens()
        .filter('ColorMatrix', { 'saturate': -1, 'brightness': 0 })
        .persist()

        .play();

    for (let e = 0; e < 44; e++) {
        let offsetX = (Math.random() * (3.5 + 3.5) - 3.5) * canvas.grid.size;
        let offsetY = (Math.random() * (3.5 + 3.5) - 3.5) * canvas.grid.size;
        new Sequence()
            .wait(150 * e + 1)

            .effect()
            .file('jb2a.spell_projectile.ice_shard')
            .atLocation({ 'x': template.x + offsetX, 'y': template.y + offsetY }, { 'offset': { 'y': -7 }, 'gridUnits': true })
            .stretchTo({ 'x': template.x + offsetX, 'y': template.y + offsetY }, { 'offset': { 'y': 0 }, 'gridUnits': true })
            .scale(1)
            .zIndex(6)

            .play();
    }
    for (let target of Array.from(workflow.targets)) {
        new Sequence()

            .wait(1150)

            .effect()
            .from(target)
            .atLocation(target)
            .scaleToObject(target.document.scale)
            .duration(500)
            .fadeIn(100)
            .fadeOut(400)
            .loopProperty('sprite', 'position.x', { 'from': -0.025, 'to': 0.025, 'duration': 75, 'pingPong': true, 'gridUnits': true })
            .opacity(0.5)
            .repeats(22, 300, 300)

            .effect()
            .file('jb2a.impact.008.blue')
            .atLocation(target, { 'randomOffset': 1 })
            .scaleToObject(2)
            .randomRotation()
            .filter('ColorMatrix', { 'saturate': -0.75, 'brightness': 1.5 })
            .repeats(22, 300, 300)

            .play();
    };
}