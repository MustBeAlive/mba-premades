import {mba} from "../../../helperFunctions.js";

async function bite({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let target = workflow.targets.first();
    if (mba.findEffect(target.actor, "Hoard Scarab: Distracting Bite")) return;
    let effectData = {
        'name': "Hoard Scarab: Distracting Bite",
        'icon': "modules/mba-premades/icons/generic/generic_debuff.webp",
        'origin': workflow.item.uuid,
        'description': `
            <p>You have disadvantage on all attack rolls until the start of your next turn.</p>
        `,
        'changes': [
            {
                'key': 'flags.midi-qol.disadvantage.attack.all',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['turnStart', 'combatEnd']
            }
        }
    };
    await mba.createEffect(target.actor, effectData);
}

async function scaleDust({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ 'name': `${token.document.name} ScaD`});
    }
    let effectData = {
        'name': "Hoard Scarab: Scale Dust",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are outlined in blue light.</p>
            <p>While outlined this way, you shed dim light in 10-foot radius and can't benefit from being @UUID[Compendium.mba-premades.MBA SRD.Item.2dEv6KlLgFA4wOni]{Invisible}.</p>
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
    for (let target of Array.from(workflow.failedSaves)) {
        if (target.document.id === workflow.token.document.id) continue;
        new Sequence()

            .effect()
            .file('jb2a.fireflies.many.01.blue')
            .attachTo(target)
            .scaleToObject(1.4)
            .fadeIn(500, { 'delay': 500 })
            .fadeOut(1500, { 'ease': 'easeInSine' })
            .randomRotation()
            .persist()
            .name(`${target.document.name} ScaD`)

            .effect()
            .from(target)
            .attachTo(target)
            .fadeIn(1500, { 'delay': 500 })
            .fadeOut(1500, { 'ease': 'easeInSine' })
            .scaleToObject(target.document.texture.scaleX)
            .spriteRotation(target.document.texture.rotation * -1)
            .zIndex(0.1)
            .belowTokens()
            .filter('Glow', { 'color': 0x91c5d2, 'distance': 20 })
            .persist()
            .name(`${target.document.name} ScaD`)

            .thenDo(async () => {
                await mba.createEffect(target.actor, effectData)
            })

            .play();
    }
}

export let hoardScarab = {
    'bite': bite,
    'scaleDust': scaleDust
}