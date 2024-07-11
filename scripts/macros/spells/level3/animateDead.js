import {mba} from "../../../helperFunctions.js";
import {summons} from "../../generic/summons.js";

// To do: rework

export async function animateDead({ speaker, actor, token, character, item, args, scope, workflow }) {
    let zombieActor = game.actors.getName('MBA: Zombie');
    let skeletonActor = game.actors.getName('MBA: Skeleton');
    if (!zombieActor || !skeletonActor) {
        ui.notifications.warn('Missing required sidebar actors!');
        return;
    }
    let spellLevel = workflow.castData?.castLevel;
    if (!spellLevel) return;
    let totalSummons = 1 + (spellLevel - 3) * 2;
    if (workflow.actor.flags['mba-premades']?.feature?.undeadThralls) totalSummons += 1;
    if (!totalSummons || totalSummons < 1) return;
    await mba.playerDialogMessage();
    let sourceActors = await mba.selectDocuments('Select Summons (Max ' + totalSummons + ')', [zombieActor, skeletonActor]);
    await mba.clearPlayerDialogMessage();
    if (!sourceActors) return;
    if (sourceActors.length > totalSummons) {
        ui.notifications.info('Too many selected, try again!');
        return;
    }
    let updates = {
        'token': {
            'disposition': 1
        }
    };
    await summons.spawn(sourceActors, updates, 86400, workflow.item, undefined, undefined, 10, workflow.token, "shadow", undefined, workflow.castData?.castLevel);
    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Spell Features', 'Animate Dead: Command', false);
    if (!featureData) return;
    let updates2 = {
        'embedded': {
            'Item': {
                [featureData.name]: featureData
            }
        }
    };
    let options = {
        'permanent': false,
        'name': workflow.item.name,
        'description': featureData.name
    };
    await warpgate.mutate(workflow.token.document, updates2, {}, options);
    let effect = mba.findEffect(workflow.actor, workflow.item.name);
    if (!effect) return;
    let currentScript = effect.flags.effectmacro?.onDelete?.script;
    if (!currentScript) return;
    let effectUpdates = {
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': currentScript + '; await warpgate.revert(token.document, "' + effect.name + '");'
                }
            },
        }
    };
    await mba.updateEffect(effect, effectUpdates);
}