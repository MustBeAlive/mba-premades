import {mba} from "../../../helperFunctions.js";

async function sleepGaze({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    const immuneData = {
        'name': "Jackalwere Sleep Gaze: Immune",
        'icon': "modules/mba-premades/icons/generic/generic_buff.webp",
        'description': `For the next 24 hours you are immune to the effects of Jackalwere's Sleep Gaze.`,
        'duration': {
            'seconds': 86400
        }
    };
    if (workflow.saves.size || mba.raceOrType(target.actor) === "undead" || mba.checkTrait(target.actor, "ci", "charmed")) {
        await mba.createEffect(target.actor, immuneData);
        return;
    }
    async function effectMacroDel() {
        const immuneData = {
            'name': "Jackalwere Sleep Gaze: Immune",
            'icon': "modules/mba-premades/icons/generic/generic_buff.webp",
            'description': `For the next 24 hours you are immune to the effects of Jackalwere's Sleep Gaze.`,
            'duration': {
                'seconds': 86400
            }
        };
        await mbaPremades.helpers.createEffect(token.actor, immuneData);
    }
    const effectData = {
        'name': "Jackalwere: Sleep Gaze",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You succumb to a magical slumber, falling @UUID[Compendium.mba-premades.MBA SRD.Item.kIUR1eRcTTtaMFao]{Unconscious} for the duration or until someone uses and action to shake you awake.</p>
            <p>After the effect ends you are immune to Jackalwere's Sleep Gaze for the next 24 hours.</p>
        `,
        'duration': {
            'seconds': 600
        },
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Unconscious",
                'priority': 20
            },
        ],
        'flags': {
            'dae': {
                'specialDuration': ['isDamaged']
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };
    await mba.createEffect(target.actor, effectData);
}

export let jackalwere = {
    'sleepGaze': sleepGaze
}