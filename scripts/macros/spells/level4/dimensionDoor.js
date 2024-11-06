import {constants} from '../../generic/constants.js';
import {mba} from '../../../helperFunctions.js';
import {queue} from '../../mechanics/queue.js';

export async function dimensionDoor({ speaker, actor, token, character, item, args, scope, workflow }) {
    let queueSetup = await queue.setup(workflow.item.uuid, 'dimensionDoor', 450);
    if (!queueSetup) return;
    let casterSize = mba.getSize(workflow.actor);
    let nearbyTargets = mba.findNearby(workflow.token, 5, 'ally').filter(t => mba.getSize(t.actor) <= casterSize);
    let selection;
    let selectedTargets = [workflow.token];
    if (nearbyTargets.length > 0) {
        await mba.playerDialogMessage(game.user);
        selection = await mba.selectTarget("Dimension Door: Teleport Creature?", constants.okCancel, nearbyTargets, true, 'one');
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
    let position = await mba.aimCrosshair(workflow.token, 500, workflow.item.img, -1, workflow.token.document.width);
    await mba.clearPlayerDialogMessage();
    queue.remove(workflow.item.uuid);
    if (position.cancelled) return;
    let difference = { x: workflow.token.x, y: workflow.token.y };

    await new Sequence()

        .effect()
        .file("jb2a.portals.vertical.ring.purple")
        .atLocation(workflow.token)
        .scale({ x: workflow.token.data.width / 2, y: workflow.token.data.height / 2 })
        .duration(5000)
        .fadeIn(1000)
        .fadeOut(1000)
        .rotateTowards(position)
        .belowTokens()
        .scaleOut(0, 400, { ease: "easeOutQuint" })
        .rotate(-90)
        .anchor({ x: 0.5, y: 0.8 })
        .zIndex(1)

        .effect()
        .file("jb2a.fireball.beam.purple")
        .atLocation(workflow.token)
        .stretchTo(position)
        .belowTokens()
        .playbackRate(1)
        .startTime(1200)
        .opacity(0.5)
        .zIndex(0)
        .waitUntilFinished(-2800)

        .effect()
        .file("jb2a.portals.vertical.ring.purple")
        .atLocation(position)
        .rotateTowards(workflow.token)
        .scale({ x: workflow.token.data.width / 2, y: workflow.token.data.height / 2 })
        .duration(3700)
        .fadeIn(500)
        .fadeOut(1000)
        .scaleOut(0, 400, { ease: "easeOutQuint" })
        .rotate(90)
        .anchor({ x: 0.5, y: 0.2 })
        .mirrorY()
        .belowTokens()
        .zIndex(1)

        .play();

    for (let targetToken of selectedTargets) {
        await new Sequence()

            .animation()
            .on(targetToken)
            .opacity(0)

            .play()

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
            .file("jb2a.side_impact.part.slow.spiral.pinkpurple")
            .atLocation(position)
            .scale({ x: 0.125, y: 0.15 })
            .playbackRate(1.75)
            .rotateTowards(targetToken)
            .rotate(180)
            .anchor({ x: 0.9, y: 0.5 })

            .animation()
            .on(targetToken)
            .opacity(1.0)

            .play();
    }
}