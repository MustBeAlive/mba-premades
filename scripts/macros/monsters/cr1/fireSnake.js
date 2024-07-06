import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function heatedBody({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    if (!(workflow.item.system.actionType === 'mwak' || workflow.item.system.actionType === 'msak')) return;
    if (mba.getDistance(workflow.token, token) > 5) return;
    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Monster Features', 'Fire Snake: Heated Body', false);
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

export let fireSnake = {
    'heatedBody': heatedBody
}