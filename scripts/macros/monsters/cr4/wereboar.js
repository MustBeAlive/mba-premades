import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function lycanthropy({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let target = workflow.targets.first();
    if (mba.raceOrType(target.actor) != "humanoid") return;
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Monster Features", "Wereboar Tusk: Save", false);
    if (!featureData) return;
    delete featureData._id;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([target.document.uuid]);
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (!featureWorkflow.failedSaves.size) return;
    let effectData = {
        'name': "Wereboar Curse",
        'icon': "modules/mba-premades/icons/generic/curse_orange.webp",
        'origin': workflow.item.uuid,
        'description': `
            <p>Owner of this effect is cursed with Wereboar Lycanthropy.</p>
        `,
        'flags': {
            'dae': {
                'showIcon': false
            },
            'mba-premades': {
                'greaterRestoration': true,
                'isCurse': true
            }
        }
    };
    await mba.createEffect(target.actor, effectData);
}

export let wereboar = {
    'lycanthropy': lycanthropy
}