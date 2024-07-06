import {mba} from "../../../helperFunctions.js";

async function claws({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    if (!workflow.failedSaves.size) return;
    let target = workflow.targets.first();
    if (mba.checkTrait(target.actor, "ci", "paralyzed")) return;
    if (mba.raceOrType(target.actor) === 'undead' || target.actor.system.details.type.subtype === "elf") return;
    const effectData = {
        'name': "Ghoul: Paralyzing Claws",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.jooSbuYlWEhaNpIi]{Paralyzed} by Ghoul's Claws.</p>
            <p>You can repeat the saving throw at the end of each of your turns, ending the effect on a success.</p>
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
                'value': `turn=end, saveAbility=con, saveDC=10, saveMagic=false, name=Paralyze: Turn End (DC10), killAnim=true`,
                'priority': 20
            }
        ],
    };
    await mba.createEffect(target.actor, effectData);
}

export let ghoul = {
    'claws': claws
}