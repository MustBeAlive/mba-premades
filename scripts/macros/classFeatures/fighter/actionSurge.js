import {mba} from "../../../helperFunctions.js";

export async function actionSurge({ speaker, actor, token, character, item, args, scope, workflow }) {
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ 'name': `${token.document.name} ActSur` });
    };
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You can take one additional action.</p>
        `,
        'duration': {
            'turns': 1
        },
        'flags': {
            'dae': {
                'specialDuation': ['combatEnd', 'zeroHP']
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };
    new Sequence()

        .effect()
        .file('jb2a.extras.tmfx.outpulse.circle.02.normal')
        .atLocation(workflow.token)
        .size(4, { 'gridUnits': true })
        .opacity(0.25)

        .effect()
        .file('jb2a.impact.ground_crack.orange.02')
        .atLocation(workflow.token)
        .size(3.5, { 'gridUnits': true })
        .belowTokens()
        .filter('ColorMatrix', { 'hue': 340, 'saturate': 1 })
        .zIndex(1)

        .effect()
        .file('jb2a.impact.ground_crack.still_frame.02')
        .atLocation(workflow.token)
        .size(3.5, { 'gridUnits': true })
        .duration(8000)
        .fadeOut(3000)
        .fadeIn(2000)
        .belowTokens()
        .filter('ColorMatrix', { 'hue': 340, 'saturate': 1 })
        .zIndex(0)

        .effect()
        .file('jb2a.wind_stream.white')
        .atLocation(workflow.token, { 'offset': { 'y': 75 } })
        .size(1.75, { 'gridUnits': true })
        .duration(6000)
        .fadeOut(3000)
        .rotate(90)
        .opacity(1)
        .loopProperty('sprite', 'position.y', { 'from': -5, 'to': 5, 'duration': 50, 'pingPong': true })
        .tint('#ff0000')
        .mask()

        .effect()
        .file('jb2a.particles.outward.red.01.03')
        .atLocation(workflow.token)
        .scaleToObject(2.5)
        .duration(6000)
        .fadeIn(200)
        .fadeOut(3000)
        .loopProperty('sprite', 'position.x', { 'from': -5, 'to': 5, 'duration': 50, 'pingPong': true })
        .animateProperty('sprite', 'position.y', { 'from': 0, 'to': -100, 'duration': 6000, 'pingPong': true, 'delay': 2000 })
        .opacity(1)
        .mask()

        .effect()
        .file('jb2a.wind_stream.white')
        .attachTo(workflow.token)
        .scaleToObject()
        .rotate(90)
        .opacity(1)
        .filter('ColorMatrix', { 'saturate': 1 })
        .tint('#ff0000')
        .fadeOut(500)
        .persist()
        .name(`${workflow.token.document.name} ActSur`)

        .effect()
        .file('jb2a.token_border.circle.static.orange.012')
        .attachTo(token)
        .scaleToObject(1.9)
        .opacity(0.7)
        .filter('ColorMatrix', { 'hue': 355, 'saturate': 1, 'contrast': 0, 'brightness': 1 })
        .fadeOut(500)
        .mask()
        .persist()
        .name(`${workflow.token.document.name} ActSur`)

        .thenDo(async () => {
            await mba.createEffect(workflow.actor, effectData);
        })

        .play();
}