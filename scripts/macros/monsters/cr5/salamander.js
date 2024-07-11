import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function tailCheck({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    if (!target) return false;
    if (mba.findEffect(workflow.actor, `${workflow.token.document.name}: Grapple (${target.document.name})`)) {
        let effectData = {
            'name': "Bonus: Autohit",
            'icon': "modules/mba-premades/icons/generic/generic_buff.webp",
            'origin': workflow.item.uuid,
            'changes': [
                {
                    'key': 'flags.midi-qol.success.attack.all',
                    'mode': 2,
                    'value': 1,
                    'priority': 20
                },
            ],
            'flags': {
                'dae': {
                    'showIcon': true,
                    'specialDuration': ['1Attack']
                }
            }
        };
        await mba.createEffect(workflow.actor, effectData);
    }
}


async function heatedBody({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    if (!(workflow.item.system.actionType === 'mwak' || workflow.item.system.actionType === 'msak')) return;
    if (mba.getDistance(workflow.token, token) > 5) return;
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Monster Features", "Salamander: Heated Body", false);
    if (!featureData) return;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': token.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([workflow.token.document.uuid]);
    await warpgate.wait(100);

    new Sequence()

        .effect()
        .file("jb2a.impact.fire.01.orange.0")
        .attachTo(workflow.token)
        .scaleToObject(1.5)
        .mask()
        .waitUntilFinished(-2000)

        .effect()
        .file("animated-spell-effects-cartoon.fire.19")
        .attachTo(workflow.token)
        .scaleToObject(1.8)

        .effect()
        .file("animated-spell-effects-cartoon.fire.15")
        .attachTo(workflow.token)
        .scaleToObject(1.6)
        .mask()
        .playbackRate(0.9)

        .thenDo(async () => {
            await MidiQOL.completeItemUse(feature, config, options);
        })

        .play()
}

export let salamander = {
    'tailCheck': tailCheck,
    'heatedBody': heatedBody
}