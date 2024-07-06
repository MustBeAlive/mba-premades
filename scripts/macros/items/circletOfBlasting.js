import {constants} from "../generic/constants.js";
import {mba} from "../../helperFunctions.js";
import {queue} from "../mechanics/queue.js";

export async function circletOfBlasting({ speaker, actor, token, character, item, args, scope, workflow }) {
    let maxRays = 3;
    let circletItem = await mba.getItem(workflow.actor, "Circlet of Blasting");
    if (!circletItem) {
        ui.notifications.warn("Unable to find item! (Circlet of Blasting)");
        return;
    }
    if (circletItem.system.uses.value < 1) {
        ui.notifications.warn("Circler of Blasting is out of charges!");
        return;
    }
    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Spell Features', 'Scorching Ray: Bolt', false);
    if (!featureData) return;
    delete featureData._id;
    featureData.system.formula = `1d20 + 5`;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
    feature.prepareData();
    feature.prepareFinalAttributes();
    let [config, options] = constants.syntheticItemWorkflowOptions([]);
    new Sequence()

        .effect()
        .file('jb2a.magic_signs.circle.02.evocation.loop.red')
        .atLocation(workflow.token)
        .attachTo(workflow.token)
        .scaleToObject(1.25)
        .fadeOut(2000)
        .scaleIn(0, 600, { 'ease': 'easeOutCubic' })
        .rotateIn(180, 600, { 'ease': 'easeOutCubic' })
        .loopProperty('sprite', 'rotation', { 'from': 0, 'to': -360, 'duration': 10000 })
        .belowTokens()
        .zIndex(0)
        .persist()
        .name('Circlet of Blasting')

        .effect()
        .file('jb2a.magic_signs.circle.02.evocation.loop.red')
        .atLocation(workflow.token)
        .attachTo(workflow.token)
        .scaleToObject(1.25)
        .duration(1200)
        .fadeIn(200, { 'ease': 'easeOutCirc', 'delay': 500 })
        .fadeOut(300, { 'ease': 'linear' })
        .scaleIn(0, 600, { 'ease': 'easeOutCubic' })
        .rotateIn(180, 600, { 'ease': 'easeOutCubic' })
        .loopProperty('sprite', 'rotation', { 'from': 0, 'to': -360, 'duration': 10000 })
        .belowTokens(true)
        .filter('ColorMatrix', { 'saturate': -1, 'brightness': 2 })
        .filter('Blur', { 'blurX': 5, 'blurY': 10 })
        .zIndex(1)
        .persist()
        .name('Circlet of Blasting')

        .effect()
        .file('jb2a.particles.outward.white.01.02')
        .atLocation(workflow.token)
        .size(1.75 * workflow.token.document.width, { 'gridUnits': true })
        .delay(500)
        .duration(1000)
        .fadeOut(1000)
        .scaleIn(0, 500, { 'ease': 'easeOutQuint' })
        .animateProperty('spriteContainer', 'position.y', { 'from': 0, 'to': -0.5, 'gridUnits': true, 'duration': 1000 })
        .zIndex(1)
        .waitUntilFinished(-200)

        .play();

    let queueSetup = await queue.setup(workflow.item.uuid, 'circletOfBlasting', 50);
    if (!queueSetup) return;
    while (maxRays > 0) {
        let targets = Array.from(workflow.targets);
        if (!targets.length) {
            ui.notifications.warn("No targets selected, try again!");
            return;
        }
        let selection = await mba.selectTarget("Circlet of Blasting", constants.okCancel, targets, true, 'number', null, false, `Select your targets: (Total Rays: ${maxRays})`);
        if (!selection.buttons) {
            queue.remove(workflow.item.uuid);
            await Sequencer.EffectManager.endEffects({ 'name': 'Circlet of Blasting', 'object': workflow.token });
            return;
        }
        let total = 0;
        for (let i = 0; i < (selection.inputs.length); i++) {
            if (!isNaN(selection.inputs[i])) total += selection.inputs[i];
        }
        if (total > maxRays) {
            ui.notifications.warn("You can't use that many rays, try again!");
            continue;
        }
        for (let i = 0; i < selection.inputs.length; i++) {
            let target = fromUuidSync(targets[i].document.uuid).object;
            if (isNaN(selection.inputs[i]) || selection.inputs[i] === 0) continue;
            options.targetUuids = [target.document.uuid];
            for (let j = 0; j < selection.inputs[i]; j++) {
                await warpgate.wait(100);
                maxRays -= 1;
                let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
                let tokenCenter = workflow.token.center;
                let targetCenter = target.center;
                let directionVector = {
                    x: targetCenter.x - tokenCenter.x,
                    y: targetCenter.y - tokenCenter.y,
                };
                let distance = Math.sqrt(directionVector.x ** 2 + directionVector.y ** 2);
                let normalizedDirectionVector = {
                    x: directionVector.x / distance,
                    y: directionVector.y / distance,
                };
                let magicCircleDistance = canvas.grid.size / 3;
                let magicCircle = {
                    x: tokenCenter.x + normalizedDirectionVector.x * magicCircleDistance,
                    y: tokenCenter.y + normalizedDirectionVector.y * magicCircleDistance,
                };
                new Sequence()

                    .wait(150)

                    .effect()
                    .file("jb2a.scorching_ray.01.orange")
                    .atLocation(magicCircle)
                    .stretchTo(target, { 'randomOffset': 0.75 })
                    .zIndex(1)
                    .missed(!featureWorkflow.hitTargets.size)
                    .playIf(() => {
                        return !featureWorkflow.hitTargets.size
                    })

                    .effect()
                    .file("jb2a.scorching_ray.01.orange")
                    .atLocation(magicCircle)
                    .stretchTo(target)
                    .zIndex(1)
                    .repeats(4, 500)
                    .waitUntilFinished(-3000)
                    .playIf(() => {
                        return featureWorkflow.hitTargets.size
                    })

                    .effect()
                    .from(target)
                    .attachTo(target)
                    .scaleToObject(target.document.texture.scaleX)
                    .delay(200)
                    .duration(1800)
                    .fadeIn(200)
                    .fadeOut(500)
                    .loopProperty('sprite', 'position.x', { 'from': -0.05, 'to': 0.05, 'duration': 50, 'pingPong': true, 'gridUnits': true })
                    .opacity(0.25)
                    .tint('#fb8b23')
                    .playIf(() => {
                        return featureWorkflow.hitTargets.size
                    })

                    .effect()
                    .file("jb2a.particles.outward.orange.01.03")
                    .attachTo(target, { 'randomOffset': 0.2 })
                    .scaleToObject(1.5)
                    .delay(200, 500)
                    .duration(4500)
                    .fadeIn(500)
                    .fadeOut(1200)
                    .zIndex(1)
                    .randomRotation()
                    .playIf(() => {
                        return featureWorkflow.hitTargets.size
                    })

                    .play();
            }
        }
    }
    queue.remove(workflow.item.uuid);
    await warpgate.wait(1500);
    await Sequencer.EffectManager.endEffects({ 'name': 'Circlet of Blasting', 'object': workflow.token });
    await circletItem.update({ "system.uses.value": 0 });
}