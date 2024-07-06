import {mba} from "../../../helperFunctions.js";

// To do: squash animation (bulette jump for inspo)

async function squashCast({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (mba.getSize(workflow.targets.first().actor) > 2) {
        ui.notifications.warn("Target must be medium or smaller!");
        return false
    }
}
async function squashItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let target = workflow.targets.first();
    if (mba.findEffect(target.actor, "Grappled")) return;
    let effectData = {
        'name': `${workflow.token.document.name}: Squash`,
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
                'key': 'macro.CE',
                'mode': 0,
                'value': "Prone",
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `actionSave=true, rollType=skill, saveAbility=ath|acr, saveDC=15, saveMagic=false, name=Grapple: Action Save (DC15), killAnim=true`,
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': false
            }
        }
    };

    await new Sequence()

        .effect()
        .file("jb2a.unarmed_strike.no_hit.01.yellow")
        .atLocation(workflow.token)
        .stretchTo(target)
        .playbackRate(0.9)
        .filter("ColorMatrix", { saturate: -1, brightness: 1 })

        .effect()
        .file("jb2a.unarmed_strike.no_hit.01.yellow")
        .mirrorY()
        .atLocation(workflow.token)
        .stretchTo(target)
        .playbackRate(0.9)
        .filter("ColorMatrix", { saturate: -1, brightness: 1 })

        .wait(150)

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectData);
            await mba.pushToken(target, workflow.token, -5);
            await mba.addCondition(workflow.actor, "Prone");
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

export let hillGiant = {
    'squashCast': squashCast,
    'squashItem': squashItem
}