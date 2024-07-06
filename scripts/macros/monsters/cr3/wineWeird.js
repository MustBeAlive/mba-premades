import {mba} from "../../../helperFunctions.js";

async function autoGrapple({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let target = workflow.targets.first();
    if (mba.findEffect(target.actor, "Grappled")) return;
    if (mba.getSize(target.actor) > 2) return;
    let distance = await mba.getDistance(workflow.token, target, true);
    await mba.pushToken(workflow.token, target, -distance);
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} WinWe` })
    }
    let effectData = {
        'name': "Wine Weird: Constrict",
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
                'value': 'actionSave=true, rollType=skill, saveAbility=ath|acr, saveDC=13, saveMagic=false, name=Constrict: Action Save (DC 13), killAnim=true',
                'priority': 20
            },
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
        .file("jb2a.unarmed_strike.no_hit.01.blue")
        .atLocation(workflow.token)
        .stretchTo(target)
        .playbackRate(0.9)
        .filter("ColorMatrix", { hue: 70 })

        .effect()
        .file("jb2a.unarmed_strike.no_hit.01.blue")
        .mirrorY()
        .atLocation(workflow.token)
        .stretchTo(target)
        .playbackRate(0.9)
        .filter("ColorMatrix", { hue: 70 })

        .wait(150)

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectData);
        })

        .effect()
        .file("jb2a.markers.chain.standard.complete.02.purple")
        .attachTo(target)
        .scaleToObject(2 * target.document.texture.scaleX)
        .fadeIn(500)
        .fadeOut(1000)
        .opacity(0.6)
        .persist()
        .name(`${target.document.name} WinWe`)

        .play()
}

export let wineWeird = {
    'autoGrapple': autoGrapple
}