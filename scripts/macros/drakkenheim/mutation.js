import {constants} from "../generic/constants.js";
import {mba} from "../../helperFunctions.js";

async function bellyMawAttack({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    new Sequence()

        .effect()
        .file("jb2a.bite.400px.purple")
        .attachTo(target)
        .scaleToObject(2.5 * target.document.texture.scaleX)

        .effect()
        .file("jaamod.sequencer_fx_master.blood_splat.red.2")
        .delay(200)
        .attachTo(target)
        .scaleIn(0, 500, { 'ease': 'easeOutCubic' })
        .scaleToObject(1.65 * target.document.texture.scaleX)
        .duration(2500)
        .fadeOut(1000)
        .belowTokens()
        .playIf(() => {
            return workflow.hitTargets.size
        })

        .play()
}

async function cyclopeanVision({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    new Sequence()

        .effect()
        .file("jb2a.scorching_ray.01.yellow")
        .attachTo(workflow.token)
        .stretchTo(target)
        .missed(!workflow.hitTargets.size)
        .playIf(() => {
            return !workflow.hitTargets.size
        })

        .effect()
        .file("jb2a.scorching_ray.01.yellow")
        .attachTo(workflow.token)
        .stretchTo(target)
        .repeats(3, 600, 600)
        .playIf(() => {
            return workflow.hitTargets.size
        })

        .play()
}

async function spikedGrowths(token) {
    let effect = token.actor.effects.find(e => e.name.includes(`${token.document.name}: Grapple`) && e.name != "Grappled");
    if (!effect) return;
    let targetUuid = effect.flags['mba-premades']?.feature?.grapple?.targetUuid;
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Features", "Spiked Growths: Damage", false);
    if (!featureData) return;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': token.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([targetUuid]);
    await MidiQOL.completeItemUse(feature, config, options);
}

export let mutation = {
    'bellyMawAttack': bellyMawAttack,
    'cyclopeanVision': cyclopeanVision,
    'spikedGrowths': spikedGrowths,
}