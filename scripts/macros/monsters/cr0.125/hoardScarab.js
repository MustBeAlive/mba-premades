import {mba} from "../../../helperFunctions.js";

export async function scaleDust({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let targets = Array.from(workflow.failedSaves);
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ 'name': 'Scale Dust', object: token });
    }
    let effectData = {
        'name': `${workflow.token.document.name}: Scale Dust`,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are outlined in blue light.</p>
            <p>While outlined this way, you shed dim light in 10-foot radius and can't benefit from being invisible.</p>
        `,
        'duration': {
            'seconds': 600
        },
        'changes': [
            {
                'key': 'system.traits.ci.value',
                'mode': 2,
                'value': "Invisible",
                'priority': 20
            },
            {
                'key': 'ATL.light.dim',
                'mode': 2,
                'value': 10,
                'priority': 20
            },
            {
                'key': 'ATL.light.animation',
                'mode': 5,
                'value': `{intensity: 3, reverse: true, speed: 5, type: "ghost"}`,
                'priority': 20
            },
            {
                'key': 'ATL.light.color',
                'mode': 5,
                'value': "#3075c0",
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
    };
    for (let target of targets) {
        if (target.document.id === workflow.token.document.id) continue;
        new Sequence()

            .effect()
            .file('jb2a.fireflies.many.01.blue')
            .attachTo(target)
            .scaleToObject(1.4)
            .randomRotation()
            .fadeIn(500, { 'delay': 500 })
            .fadeOut(1500, { 'ease': 'easeInSine' })
            .persist()
            .name('Scale Dust')

            .effect()
            .from(target)
            .belowTokens()
            .attachTo(target)
            .scaleToObject(target.document.texture.scaleX)
            .spriteRotation(target.document.texture.rotation * -1)
            .filter('Glow', { 'color': 0x91c5d2, 'distance': 20 })
            .fadeIn(1500, { 'delay': 500 })
            .fadeOut(1500, { 'ease': 'easeInSine' })
            .zIndex(0.1)
            .persist()
            .name('Scale Dust')

            .thenDo(async () => {
                await mba.createEffect(target.actor, effectData)
            })

            .play();
    }
}

export let hoardScarab = {
    'scaleDust': scaleDust
}