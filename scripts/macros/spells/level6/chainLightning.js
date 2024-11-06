import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

export async function chainLightning({ speaker, actor, token, character, item, args, scope, workflow }) {
    new Sequence()

        .effect()
        .file("jb2a.lightning_ball.blue")
        .attachTo(workflow.token)
        .scaleToObject(2)
        .fadeIn(500)
        .persist()
        .name(`${workflow.token.document.name} CL1`)

        .play()

    let maxTargets = workflow.castData.castLevel - 3;
    let target = workflow.targets.first();
    let nearbyTokens = mba.findNearby(target, 30, "ally", true, false);
    if (!nearbyTokens.length) {
        new Sequence()

            .wait(500)

            .effect()
            .file("animated-spell-effects-cartoon.electricity.discharge.08")
            .attachTo(workflow.token)
            .scaleToObject(3.5)

            .effect()
            .file('jb2a.chain_lightning.secondary.blue')
            .attachTo(workflow.token)
            .stretchTo(target)

            .effect()
            .file("jb2a.static_electricity.03.blue")
            .attachTo(target)
            .scaleToObject(1.5)
            .fadeOut(1000)
            .playbackRate(2)
            .opacity(2)
            .randomRotation()
            .repeats(10, 500)

            .thenDo(async () => {
                Sequencer.EffectManager.endEffects({ name: `${workflow.token.document.name} CL1` })
            })

            .play();

        return;
    }
    let queueSetup = await queue.setup(workflow.item.uuid, 'chainLightning', 450);
    if (!queueSetup) return;
    let addedTargets = [];
    let addedTargetUuids = [];
    if (nearbyTokens.length > maxTargets) {
        await mba.playerDialogMessage(game.user);
        let selection = await mba.selectTarget("Chain Lightning", constants.okCancel, nearbyTokens, true, 'multiple', undefined, false, `Choose targets for the lightning to bounce to<br>Max: ${maxTargets}`);
        await mba.clearPlayerDialogMessage();
        if (!selection.buttons) {
            queue.remove(workflow.item.uuid);
            Sequencer.EffectManager.endEffects({ name: `${workflow.token.document.name} CL1` })
            return;
        }
        for (let i of selection.inputs) {
            if (i) {
                addedTargets.push(await fromUuid(i));
                addedTargetUuids.push(i);
            }
        }
        if (addedTargets.length > maxTargets) {
            ui.notifications.info('Too many targets selected!');
            queue.remove(workflow.item.uuid);
            Sequencer.EffectManager.endEffects({ name: `${workflow.token.document.name} CL1` })
            return;
        }
    }
    else {
        for (let i of nearbyTokens) {
            addedTargets.push(i);
            addedTargetUuids.push(i.document.uuid);
        }
    }
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Chain Lightning: Leap", false);
    if (!featureData) {
        queue.remove(workflow.item.uuid);
        Sequencer.EffectManager.endEffects({ name: `${workflow.token.document.name} CL1` })
        return;
    }
    featureData.system.save.dc = mba.getSpellDC(workflow.item);
    featureData.system.damage.parts = [[`${workflow.damageTotal}[lightning]`, "lightning"]];
    featureData.flags['mba-premades'] = { 'spell': { 'castData': workflow.castData } }
    featureData.flags['mba-premades'].spell.castData.school = workflow.item.system.school;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions(addedTargetUuids);
    await MidiQOL.completeItemUse(feature, config, options);
    new Sequence()

        .thenDo(async () => {
            Sequencer.EffectManager.endEffects({ name: `${workflow.token.document.name} CL1` })
        })

        .effect()
        .file("animated-spell-effects-cartoon.electricity.discharge.08")
        .attachTo(workflow.token)
        .scaleToObject(3.5)

        .effect()
        .file('jb2a.chain_lightning.secondary.blue')
        .attachTo(workflow.token)
        .stretchTo(target)

        .effect()
        .file("jb2a.static_electricity.03.blue")
        .attachTo(target)
        .scaleToObject(1.5)
        .fadeOut(1000)
        .playbackRate(2)
        .opacity(2)
        .randomRotation()
        .repeats(10, 500)


        .play();

    await warpgate.wait(200);
    let previousToken = target;
    for (let nextTarget of addedTargets) {
        new Sequence()

            .effect()
            .file('jb2a.chain_lightning.secondary.blue')
            .attachTo(previousToken)
            .stretchTo(nextTarget)

            .effect()
            .file("jb2a.static_electricity.03.blue")
            .attachTo(nextTarget)
            .scaleToObject(1.5)
            .fadeOut(1000)
            .playbackRate(2)
            .opacity(2)
            .randomRotation()
            .repeats(10, 500)

            .play();

        previousToken = nextTarget;
        await warpgate.wait(200);
    }
    queue.remove(workflow.item.uuid);
}