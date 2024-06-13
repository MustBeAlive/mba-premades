import {mba} from "../../../helperFunctions.js";

export async function autoGrapple({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let targets = Array.from(workflow.targets);
    let saveDC = workflow.item.system.save.dc;
    let effectDataTarget = {
        'name': `${workflow.token.document.name}: Grapple`,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Grappled",
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `actionSave=true, rollType=skill, saveAbility=ath|acr, saveDC=${saveDC}, saveMagic=false, name=Grapple: Action Save (DC${saveDC}), killAnim=true`,
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': false
            }
        }
    };
    for (let target of targets) {
        if (mba.findEffect(target.actor, "Grappled")) continue;
        await new Sequence()

            .effect()
            .file("jb2a.unarmed_strike.no_hit.01.yellow")
            .atLocation(token)
            .stretchTo(target)
            .playbackRate(0.9)
            .filter("ColorMatrix", { saturate: -1, brightness: 1 })

            .effect()
            .file("jb2a.unarmed_strike.no_hit.01.yellow")
            .mirrorY()
            .atLocation(token)
            .stretchTo(target)
            .playbackRate(0.9)
            .filter("ColorMatrix", { saturate: -1, brightness: 1 })

            .wait(150)

            .thenDo(async () => {
                await mba.createEffect(target.actor, effectDataTarget);
            })

            .effect()
            .file("jb2a.markers.chain.standard.complete.02.grey")
            .attachTo(target)
            .scaleToObject(2 * target.document.texture.scaleX)
            .fadeIn(500)
            .fadeOut(1000)
            .opacity(0.8)

            .play()
    }
}