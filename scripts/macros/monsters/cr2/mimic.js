import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function adhesive({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let target = workflow.targets.first();
    let grappled = await mba.findEffect(target.actor, "Grappled");
    let effectDataTarget = {
        'name': `Mimic: Grapple`,
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
                'value': `actionSave=true, rollType=skill, saveAbility=ath|acr, saveDC=13, saveMagic=false, name=Grapple: Action Save (DC13), killAnim=true`,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.disadvantage.skill.ath',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.disadvantage.skill.acr',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
        ],
        'flags': {
            'dae': {
                'showIcon': false
            }
        }
    };
    await new Sequence()

        .effect()
        .file("jb2a.unarmed_strike.magical.02.green")
        .atLocation(workflow.token)
        .stretchTo(target)
        .playbackRate(0.9)

        .effect()
        .file("jb2a.unarmed_strike.magical.02.green")
        .atLocation(workflow.token)
        .stretchTo(target)
        .mirrorY()
        .playbackRate(0.9)

        .wait(150)

        .thenDo(async () => {
            if (!grappled && mba.getSize(target.actor) <= 4) await mba.createEffect(target.actor, effectDataTarget);
        })

        .effect()
        .file("jb2a.markers.chain.spectral_standard.complete.02.green")
        .attachTo(target)
        .scaleToObject(2 * target.document.texture.scaleX)
        .fadeIn(500)
        .fadeOut(1000)
        .opacity(0.8)

        .play()
}

async function grappler({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!mba.findEffect(workflow.targets.first().actor, "Mimic: Grapple")) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'grappler', 150);
    if (!queueSetup) return;
    workflow.advantage = true;
    workflow.advReminderAttackAdvAttribution.add("ADV:Grappler");
    queue.remove(workflow.item.uuid);
}

export let mimic = {
    'adhesive': adhesive,
    'grappler': grappler
}