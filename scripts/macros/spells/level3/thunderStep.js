import {constants} from '../../generic/constants.js';
import {mba} from '../../../helperFunctions.js';
import {queue} from '../../mechanics/queue.js';

export async function thunderStep({ speaker, actor, token, character, item, args, scope, workflow }) {
    let queueSetup = await queue.setup(workflow.item.uuid, 'thunderStep', 450);
    if (!queueSetup) return;
    let casterSize = mba.getSize(workflow.actor);
    let nearbyTargets = mba.findNearby(workflow.token, 5, 'ally').filter(t => mba.getSize(t.actor) <= casterSize);
    let selection;
    let selectedTargets = [workflow.token];
    if (nearbyTargets.length > 0) {
        await mba.playerDialogMessage(game.user);
        selection = await mba.selectTarget("Thunder Step: Teleport Creature?", constants.okCancel, nearbyTargets, true, 'one');
        await mba.clearPlayerDialogMessage();
        if (selection.buttons) {
            let selectedTarget = selection.inputs.find(id => id != false);
            if (selectedTarget) {
                mba.updateTargets(Array.from(workflow.targets).filter(t => t.document.uuid != selectedTarget).map(t => t.id));
                selectedTargets.push((await fromUuid(selectedTarget)).object);
            }
        }
    }
    await mba.playerDialogMessage(game.user);
    let position = await mba.aimCrosshair(workflow.token, 90, workflow.item.img, -1, workflow.token.document.width);
    await mba.clearPlayerDialogMessage();
    queue.remove(workflow.item.uuid);
    if (position.cancelled) return;
    let difference = { x: workflow.token.x, y: workflow.token.y };
    async function teleport(targetToken) {
        await new Sequence()

            .effect()
            .file("animated-spell-effects-cartoon.electricity.09")
            .atLocation(targetToken)
            .scaleToObject(1.75, { considerTokenScale: true })
            .playbackRate(1)
            .filter("ColorMatrix", { hue: -20, saturate: 1 })
            .waitUntilFinished(-200)

            .animation()
            .on(targetToken)
            .opacity(0)

            .effect()
            .file("jb2a.impact.ground_crack.blue.01")
            .atLocation(targetToken)
            .belowTokens()
            .filter("ColorMatrix", { saturate: -0.5 })
            .size(3, { gridUnits: true })
            .zIndex(1)

            .effect()
            .file("jb2a.impact.ground_crack.still_frame.01")
            .atLocation(targetToken)
            .belowTokens()
            .size(3, { gridUnits: true })
            .fadeOut(500)
            .zIndex(0)

            .effect()
            .file("animated-spell-effects-cartoon.electricity.bolt.01")
            .atLocation(targetToken, { offset: { y: -1.25 }, gridUnits: true })
            .rotate(90)
            .scale(0.25)

            .effect()
            .file("animated-spell-effects-cartoon.electricity.05")
            .atLocation(targetToken)
            .scaleToObject(1.75, { considerTokenScale: true })
            .filter("ColorMatrix", { hue: -20, saturate: 1 })

            .effect()
            .file("jb2a.extras.tmfx.outpulse.circle.02.normal")
            .atLocation(targetToken)
            .size(4, { gridUnits: true })
            .opacity(0.5)
            .fadeOut(500)

            .effect()
            .file("jb2a.extras.tmfx.outpulse.circle.02.fast")
            .atLocation(targetToken)
            .size(4, { gridUnits: true })
            .opacity(0.5)
            .fadeOut(500)

            .canvasPan()
            .shake({ duration: 750, strength: 4, rotation: false })

            .wait(1000)

            .play();

        let diffX = targetToken.x - difference.x;
        let diffY = targetToken.y - difference.y;
        let newCenter = canvas.grid.getSnappedPosition(position.x - targetToken.w / 2, position.y - targetToken.h / 2, 1);
        let targetUpdate = {
            'token': {
                'x': newCenter.x + diffX,
                'y': newCenter.y + diffY
            }
        };
        let options = {
            'permanent': true,
            'name': workflow.item.name,
            'description': workflow.item.name,
            'updateOpts': { 'token': { 'animate': false } }
        };
        await warpgate.mutate(targetToken.document, targetUpdate, {}, options);
        await new Sequence()

            .effect()
            .file("animated-spell-effects-cartoon.electricity.bolt.01")
            .atLocation(position, { offset: { y: -1.25 }, gridUnits: true })
            .rotate(-90)
            .scale(0.25)

            .animation()
            .on(targetToken)
            .opacity(1)

            .canvasPan()
            .shake({ duration: 300, strength: 2, rotation: false })

            .effect()
            .file("jb2a.impact.ground_crack.blue.01")
            .atLocation(position)
            .belowTokens()
            .filter("ColorMatrix", { saturate: -0.5 })
            .size(3, { gridUnits: true })
            .zIndex(1)

            .effect()
            .file("jb2a.impact.ground_crack.still_frame.01")
            .atLocation(position)
            .belowTokens()
            .size(3, { gridUnits: true })
            .fadeOut(500)
            .zIndex(0)

            .play();
    }
    for (let i = 0; selectedTargets.length > i; i++) {
        let targetToken = selectedTargets[i];
        teleport(targetToken);
    }
}