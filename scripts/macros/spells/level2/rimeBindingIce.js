import {mba} from "../../../helperFunctions.js";

export async function rimeBindingIce({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId)?.object;
    if (!template) return;

    new Sequence()

        .effect()
        .file('jb2a.magic_signs.circle.02.evocation.loop.blue')
        .atLocation(token)
        .scaleToObject(1.25)
        .fadeOut(2000)
        .rotateIn(180, 600, { 'ease': 'easeOutCubic' })
        .scaleIn(0, 600, { 'ease': 'easeOutCubic' })
        .loopProperty('sprite', 'rotation', { 'from': 0, 'to': -360, 'duration': 10000 })
        .belowTokens()
        .zIndex(0)

        .effect()
        .file('jb2a.magic_signs.circle.02.evocation.loop.blue')
        .atLocation(token)
        .scaleToObject(1.25)
        .duration(1200)
        .fadeIn(200, { 'ease': 'easeOutCirc', 'delay': 500 })
        .fadeOut(300, { 'ease': 'linear' })
        .scaleIn(0, 600, { 'ease': 'easeOutCubic' })
        .rotateIn(180, 600, { 'ease': 'easeOutCubic' })
        .loopProperty('sprite', 'rotation', { 'from': 0, 'to': -360, 'duration': 10000 })
        .belowTokens(true)
        .filter('ColorMatrix', { 'saturate': -1, 'brightness': 2 })
        .filter('Blur', { 'blurX': 5, 'blurY': 10 })
        .zIndex(1)

        .effect()
        .file('jb2a.particles.outward.white.01.02')
        .atLocation(token)
        .size(1.75, { 'gridUnits': true })
        .delay(500)
        .fadeOut(1000)
        .duration(1000)
        .scaleIn(0, 500, { 'ease': 'easeOutQuint' })
        .animateProperty('spriteContainer', 'position.y', { 'from': 0, 'to': -0.5, 'gridUnits': true, 'duration': 1000 })
        .zIndex(1)
        .waitUntilFinished(250)

        .effect()
        .file('jb2a.dancing_light.blueteal')
        .atLocation(token)
        .rotateTowards(template)
        .size(0.9 * workflow.token.document.width, { 'gridUnits': true })
        .duration(5000)
        .fadeIn(500)
        .fadeOut(1000)
        .scaleIn(0, 500, { 'ease': 'easeOutCubic' })
        .spriteScale({ 'x': 0.5, 'y': 1.0 })
        .spriteOffset({ 'x': 0.25 }, { 'gridUnits': true })
        .filter('ColorMatrix', { 'hue': 10, 'saturate': -0.5, 'brightness': 1.5 })

        .effect()
        .file('jb2a.extras.tmfx.border.circle.outpulse.01.fast')
        .atLocation(token)
        .rotateTowards(template)
        .size(0.9 * workflow.token.document.width, { 'gridUnits': true })
        .spriteScale({ 'x': 0.5, 'y': 1.0 })
        .spriteOffset({ 'x': 0.25 }, { 'gridUnits': true })

        .effect()
        .file('jb2a.particles.outward.white.02.03')
        .atLocation(token, { 'cacheLocation': true })
        .moveTowards(template)
        .size({ 'width': 6, 'height': 6 }, { 'gridUnits': true })
        .delay(250)
        .duration(1500)
        .fadeIn(250)
        .fadeOut(1250)
        .scaleIn(0, 1500, { 'ease': 'easeOutSine' })
        .randomizeMirrorY()
        .filter('ColorMatrix', { 'hue': 10, 'saturate': -1, 'brightness': 2 })
        .zIndex(2)
        .repeats(7, 500, 500)

        .effect()
        .file('jb2a.breath_weapons.poison.cone.blue')
        .atLocation(token, { 'cacheLocation': true })
        .rotateTowards(template, { 'cacheLocation': true })
        .size(6.5, { 'gridUnits': true })
        .duration(5000)
        .fadeIn(1100)
        .fadeOut(1100)
        .startTime(3000)
        .belowTokens()
        .opacity(0.8)
        .playbackRate(0.9)
        .zIndex(1)
        .filter('ColorMatrix', { 'hue': 10, 'saturate': -1, 'brightness': 1.8 })

        .effect()
        .file('jb2a.breath_weapons.poison.cone.blue')
        .atLocation(token, { 'cacheLocation': true })
        .rotateTowards(template, { 'cacheLocation': true })
        .size(6.5, { 'gridUnits': true })
        .fadeOut(1100)
        .startTime(3000)
        .mirrorY()
        .zIndex(1)
        .opacity(0.1)
        .playbackRate(0.9)
        .filter('ColorMatrix', { 'saturate': -1, 'brightness': 1.1 })

        .play();

    async function effectMacroDel() {
        new Sequence()

            .effect()
            .file('jb2a.impact_themed.ice_shard.blue')
            .atLocation(token)
            .scaleToObject(token.document.texture.scaleX * 2)
            .belowTokens()

            .wait(300)

            .thenDo(async () => {
                Sequencer.EffectManager.endEffects({ 'name': `${token.document.name} RBI`, 'object': token });
            })

            .play();
    };
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are hindered by ice formation for the duration, or until you or another creature uses its action to break away the ice.</p>
            <p>While hindered by ice, your speed is reduced to 0.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'system.attributes.movement.all',
                'mode': 0,
                'value': "*0",
                'priority': 20
            },
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 2,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    if (!workflow.failedSaves.size) return;
    let targets = Array.from(workflow.failedSaves);
    for (let target of targets) {
        new Sequence()

            .effect()
            .file('jb2a.extras.tmfx.outflow.circle.02')
            .attachTo(target)
            .scaleToObject(target.document.texture.scaleX * 1.55)
            .delay(1250)
            .fadeIn(6000, { 'delay': 1000, 'ease': 'easeOutExpo' })
            .scaleIn(0, 6000, { 'ease': 'easeOutExpo' })
            .belowTokens()
            .opacity(0.45)
            .persist()
            .name(`${target.document.name} RBI`)

            .effect()
            .file('jb2a.spirit_guardians.blue.particles')
            .attachTo(target)
            .scaleToObject(target.document.texture.scaleX * 1.3)
            .delay(1250)
            .fadeIn(6000, { 'delay': 1000, 'ease': 'easeOutExpo' })
            .scaleIn(0, 6000, { 'ease': 'easeOutExpo' })
            .opacity(0.55)
            .filter('ColorMatrix', { 'saturate': -0.35, 'brightness': 1.2 })
            .persist()
            .name(`${target.document.name} RBI`)

            .effect()
            .file('jb2a.celestial_bodies.asteroid.single.ice.blue.02')
            .attachTo(target)
            .scaleToObject(target.document.texture.scaleX * 1.5)
            .delay(1250)
            .fadeIn(6000, { 'delay': 1000, 'ease': 'easeOutExpo' })
            .scaleIn(0, 6000, { 'ease': 'easeOutExpo' })
            .endTime(19950)
            .spriteOffset({ 'x': -0.05 }, { 'gridUnits': true })
            .opacity(0.5)
            .randomRotation()
            .repeats(1, 100, 100)
            .noLoop()
            .filter('ColorMatrix', { 'contrast': 0 })
            .shape('circle', {
                'lineSize': canvas.grid.size / 2.5,
                'lineColor': '#FF0000',
                'radius': 0.55,
                'gridUnits': true,
                'name': name,
                'isMask': true
            })
            .persist()
            .name(`${target.document.name} RBI`)

            .thenDo(async () => {
                await mba.createEffect(target.actor, effectData);
            })

            .play();
    }
}