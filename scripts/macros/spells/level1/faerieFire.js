import {mba} from "../../../helperFunctions.js";

export async function faerieFire({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.templateUuid) return;
    let choices = [["Blue", "blue"], ["Green", "green"], ["Purple", "purple"]];
    let color = await mba.dialog("Choose color:", choices);
    if (!color) color = "purple";
    let tintColor;
    let hue;
    switch (color) {
        case 'blue':
            tintColor = '0x91c5d2';
            hue = '160';
            break;
        case 'green':
            tintColor = '0xd3eb6a';
            hue = '45';
            break;
        case 'purple':
            tintColor = '0xdcace3';
            hue = '250';
    }
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ 'name': `${token.document.name} Faerie Fire`, object: token });
    };
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p></p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'flags.midi-qol.grants.advantage.attack.all',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
            {
                'key': 'system.traits.ci.value',
                'mode': 0,
                'value': "invisible",
                'priority': 20
            },
            {
                'key': 'ATL.light.dim',
                'mode': 4,
                'value': 10,
                'priority': 20
            }
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    }
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    //let position = template.ray.project(0.5);

    new Sequence()

        .effect()
        .file('animated-spell-effects-cartoon.flash.25')
        .atLocation(template)
        .scale(0.05)
        .playbackRate(1)
        .duration(1500)
        .opacity(0.75)
        .scaleIn(0, 1000, { 'ease': 'easeOutCubic' })
        .filter('ColorMatrix', { 'brightness': 0, 'hue': hue })
        .filter('Blur', { 'blurX': 5, 'blurY': 10 })
        .animateProperty('sprite', 'width', { 'from': 0, 'to': -0.25, 'duration': 2500, 'gridUnits': true, 'ease': 'easeInOutBack' })
        .animateProperty('sprite', 'height', { 'from': 0, 'to': -0.25, 'duration': 2500, 'gridUnits': true, 'ease': 'easeInOutBack' })
        .belowTokens()

        .effect()
        .file('jb2a.particles.outward.white.01.03')
        .atLocation(template)
        .scale(0.025)
        .playbackRate(1)
        .duration(1500)
        .fadeIn(1500)
        .scaleIn(0, 1500, { 'ease': 'easeOutCubic' })
        .filter('ColorMatrix', { 'hue': hue })
        .animateProperty('sprite', 'width', { 'from': 0, 'to': 0.5, 'duration': 2500, 'gridUnits': true, 'ease': 'easeOutBack' })
        .animateProperty('sprite', 'height', { 'from': 0, 'to': 1, 'duration': 2500, 'gridUnits': true, 'ease': 'easeOutBack' })
        .animateProperty('sprite', 'position.y', { 'from': 0, 'to': -0.45, 'duration': 2500, 'gridUnits': true })

        .effect()
        .file('jb2a.sacred_flame.target.' + color)
        .atLocation(template)
        .scale(0.05)
        .playbackRate(1)
        .duration(1500)
        .scaleIn(0, 1500, { 'ease': 'easeOutCubic' })
        .animateProperty('sprite', 'width', { 'from': 0, 'to': 0.5, 'duration': 2500, 'gridUnits': true, 'ease': 'easeOutBack' })
        .animateProperty('sprite', 'height', { 'from': 0, 'to': 0.5, 'duration': 2500, 'gridUnits': true, 'ease': 'easeOutBack' })
        .animateProperty('sprite', 'position.y', { 'from': 0, 'to': -0.25, 'duration': 2500, 'gridUnits': true, 'ease': 'easeOutBack' })
        .waitUntilFinished(-200)

        .effect()
        .file('jb2a.impact.010.' + color)
        .atLocation(template, { 'offset': { 'y': -0.25 }, 'gridUnits': true })
        .scale(0.45)
        .randomRotation()
        .zIndex(1)

        .effect()
        .file('jb2a.particles.outward.white.01.03')
        .atLocation(template, { 'offset': { 'y': -0.25 }, 'gridUnits': true })
        .size(3, { 'gridUnits': true })
        .scaleIn(0, 500, { 'ease': 'easeOutQuint' })
        .duration(2500)
        .fadeOut(1000)
        .randomRotation()
        .filter('Glow', { 'color': tintColor, 'distance': 10 })
        .zIndex(2)

        .effect()
        .file('jb2a.fireflies.{{Pfew}}.02.' + color)
        .atLocation(template, { 'randomOffset': 0.25 })
        .scaleToObject(1.8)
        .randomRotation()
        .duration(750)
        .fadeOut(500)
        .setMustache({
            'Pfew': () => {
                let Pfews = ['few', 'many'];
                return Pfews[Math.floor(Math.random() * Pfews.length)];
            }
        })
        .repeats(10, 75, 75)
        .zIndex(1)

        .effect()
        .file('animated-spell-effects-cartoon.energy.pulse.yellow')
        .atLocation(template, { 'offset': { 'y': -0.25 }, 'gridUnits': true })
        .size(5, { 'gridUnits': true })
        .fadeOut(250)
        .filter('ColorMatrix', { 'saturate': -1, 'brightness': 2, 'hue': hue })
        .filter('Blur', { 'blurX': 10, 'blurY': 10 })
        .zIndex(0.5)

        .effect()
        .file('animated-spell-effects-cartoon.energy.pulse.yellow')
        .atLocation(template, { 'offset': { 'y': -0.25 }, 'gridUnits': true })
        .size(5, { 'gridUnits': true })
        .delay(50)
        .filter('ColorMatrix', { 'hue': hue })
        .zIndex(0.5)

        .play();

    if (!workflow.failedSaves.size) {
        await canvas.scene.templates.find(t => t.id === template.id)?.delete();
        return;
    }
    await warpgate.wait(1300);
    for (let target of workflow.failedSaves) {

        await mba.createEffect(target.actor, effectData);
        new Sequence()

            .effect()
            .file('jb2a.fireflies.many.01.' + color)
            .attachTo(target)
            .scaleToObject(1.4)
            .randomRotation()
            .fadeIn(500, { 'delay': 500 })
            .fadeOut(1500, { 'ease': 'easeInSine' })
            .persist()
            .name(`${target.document.name} Faerie Fire`)

            .effect()
            .from(target)
            .attachTo(target)
            .belowTokens()
            .scaleToObject(target.document.texture.scaleX)
            .spriteRotation(target.document.texture.rotation * -1)
            .filter('Glow', { 'color': tintColor, 'distance': 20 })
            .fadeIn(1500, { 'delay': 500 })
            .fadeOut(1500, { 'ease': 'easeInSine' })
            .zIndex(0.1)
            .persist()
            .name(`${target.document.name} Faerie Fire`)

            .play();
    }
    await warpgate.wait(500);
    await canvas.scene.templates.find(t => t.id === template.id)?.delete();
}