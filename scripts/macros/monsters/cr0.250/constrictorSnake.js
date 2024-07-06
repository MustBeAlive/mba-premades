import {mba} from "../../../helperFunctions.js";

async function constrict({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let target = workflow.targets.first();
    if (mba.checkTrait(target.actor, "ci", "grappled")) return;
    if (mba.findEffect(target.actor, "Grappled")) return;
    let saveDC = workflow.item.system.save.dc;
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} ConS` })
    }
    let effectData = {
        'name': "Constrictor Snake: Constrict",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': 'Grappled',
                'priority': 20
            },
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': 'Restrained',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `actionSave=true, rollType=skill, saveAbility=ath|acr, saveDC=${saveDC}, saveMagic=false, name=Constrict: Action Save (DC${saveDC}), killAnim=true`,
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': false
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };

    await new Sequence()

        .effect()
        .file("jb2a.melee_generic.slashing.two_handed")
        .atLocation(workflow.token)
        .stretchTo(target)
        .playbackRate(0.9)

        .wait(150)

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectData);
        })

        .effect()
        .file("jb2a.markers.chain.standard.complete.02.grey")
        .attachTo(target)
        .scaleToObject(2 * target.document.texture.scaleX)
        .fadeIn(500)
        .fadeOut(1000)
        .opacity(0.6)
        .persist()
        .name(`${target.document.name} ConS`)

        .play()
}

export let constrictorSnake = {
    'constrict': constrict
}