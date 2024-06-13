import {mba} from "../../../helperFunctions.js";

async function psychicCrush({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let target = workflow.targets.first();
    let saveDC = workflow.item.system.save.dc;
    const effectData = {
        'name': "Su-monster: Psychic Crush",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are stunned by Su-monster's Psychic Crush.</p>
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
                'value': `turn=end, saveAbility=wis, saveDC=${saveDC}, saveMagic=false, name=Psychic Crush: Turn End (DC${saveDC}), killAnim=true`,
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': false
            }
        }
    };
    await mba.createEffect(target.actor, effectData);
}

export let suMonster = {
    'psychicCrush': psychicCrush
}