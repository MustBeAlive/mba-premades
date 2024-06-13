import {mba} from "../../../helperFunctions.js";

async function pacifyingSpores({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let target = workflow.targets.first();
    if (mba.checkTrait(target.actor, "ci", "stunned")) return;
    if (mba.findEffect(target.actor, "Pacifying Spores")) return;
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Pacifying Spores` })
    };
    const effectData = {
        'name': "Pacifying Spores",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are stunned by Myconid Adult's Pacifying Spores.</p>
            <p>You can repeat the saving throw at the end of each of your turns, ending the effect on a success.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Stunned",
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': 'turn=end, saveAbility=con, saveDC=11, saveMagic=false, name=Pacifying Spores: Turn End, killAnim=true',
                'priority': 20
            },
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };
    new Sequence()

        .effect()
        .file("jb2a.particles.outward.orange.01.02")
        .attachTo(target)
        .scaleToObject(1)
        .fadeIn(1000)
        .fadeOut(1000)
        .mask()
        .persist()
        .name(`${target.document.name} Pacifying Spores`)

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectData);
        })

        .play()
}

export let myconidAdult = {
    'pacifyingSpores': pacifyingSpores
}