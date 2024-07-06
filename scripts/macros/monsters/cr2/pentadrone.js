import {mba} from "../../../helperFunctions.js";

async function paralysisGas({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
	if (!template) return;

    new Sequence()

        .effect()
        .file("jb2a.breath_weapons02.burst.cone.holy.yellow.01")
        .attachTo(workflow.token)
        .stretchTo(template)

        .play()

    let effectData = {
        'name': "Paralysis Gas",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.jooSbuYlWEhaNpIi]{Paralyzed} by Pentadrone's Paralysis Gas for the duration.</p>
            <p>You can repeat the saving throw at the end of each of your turns, ending the effect on on a success.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': "macro.CE",
                'mode': 0,
                'value': "Paralyzed",
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': 'turn=end, saveAbility=con, saveDC=11, saveMagic=false, name=Paralysis Gas: Turn End (DC11), killAnim=true',
                'priority': 20
            },
        ],
        'flags': {

        }
    };
    if (!workflow.failedSaves.size) return;
    for (let target of Array.from(workflow.failedSaves)) {
        if (!mba.checkTrait(target.actor, "ci", "paralyzed") && !mba.findEffect(target.actor, "Paralysis Gas")) await mba.createEffect(target.actor, effectData);
    }
}

export let pentadrone = {
    'paralysisGas': paralysisGas
}