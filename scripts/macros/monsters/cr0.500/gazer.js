import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function rayRoll({ speaker, actor, token, character, item, args, scope, workflow }) {
    const target = workflow.targets.first();
    let rollFormula = "1d4";
    if (mba.getSize(target.actor) > 2) rollFormula = "1d3";
    let rayRoll = await new Roll(rollFormula).roll({ 'async': true });
    await MidiQOL.displayDSNForRoll(rayRoll, 'damageRoll');
    rayRoll.toMessage({
        rollMode: 'roll',
        speaker: { 'alias': name },
        flavor: "Gazer: Ray Randomiser"
    });
    let featureData;
    let animation;
    let ray = rayRoll.total;
    if (ray === 1) {
        featureData = await mba.getItemFromCompendium('mba-premades.MBA Monster Features', 'Gazer: Dazing Ray', false);
        if (!featureData) {
            ui.notifications.warn("Unable to find item in the compenidum! (Gazer: Dazing Ray)");
            return
        }
        animation = "jb2a.scorching_ray.01.pink";
    }
    if (ray === 2) {
        featureData = await mba.getItemFromCompendium('mba-premades.MBA Monster Features', 'Gazer: Fear Ray', false);
        if (!featureData) {
            ui.notifications.warn("Unable to find item in the compenidum! (Gazer: Fear Ray)");
            return
        }
        animation = "jb2a.scorching_ray.01.green";
    }
    if (ray === 3) {
        featureData = await mba.getItemFromCompendium('mba-premades.MBA Monster Features', 'Gazer: Frost Ray', false);
        if (!featureData) {
            ui.notifications.warn("Unable to find item in the compenidum! (Gazer: Frost Ray)");
            return
        }
        animation = "jb2a.scorching_ray.blue.01";
    }
    if (ray === 4) {
        featureData = await mba.getItemFromCompendium('mba-premades.MBA Monster Features', 'Gazer: Telekinetic Ray', false);
        if (!featureData) {
            ui.notifications.warn("Unable to find item in the compenidum! (Gazer: Telekinetic Ray)");
            return
        }
        animation = "jb2a.scorching_ray.01.red";
    }
    delete featureData._id;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([target.document.uuid]);
    await MidiQOL.completeItemUse(feature, config, options);
    new Sequence()

        .effect()
        .file(animation)
        .atLocation(token)
        .stretchTo(target)
        .repeats(3, 600, 600)

        .play();
}

async function rayDazing({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let target = workflow.targets.first();
    const effectData = {
        'name': "Gazer: Dazing Ray",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are charmed by Gazer's Dazing Ray until the start of it's next turn.</p>
            <p>While charmed in this way, your speed is halved and you have disadvantage on attack rolls.</p>
        `,
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': 'Charmed',
                'priority': 20
            },
            {
                'key': 'system.attributes.movement.walk',
                'mode': 2,
                'value': '*0.5',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.disadvantage.attack.all',
                'mode': 2,
                'value': 1,
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['turnStartSource']
            }
        }
    };
    await mba.createEffect(target.actor, effectData);
}

async function rayFear({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let target = workflow.targets.first();
    const effectData = {
        'name': "Gazer: Fear Ray",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are frightened by Gazer's Fear Ray until the start of it's next turn.</p>
        `,
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': 'Frightened',
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['turnStartSource']
            }
        }
    };
    await mba.createEffect(target.actor, effectData);
}

async function rayTelekinetic({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let target = workflow.targets.first();
    new Sequence()

        .effect()
        .file("jb2a.scorching_ray.01.red")
        .atLocation(token)
        .stretchTo(target)
        .repeats(3, 600, 600)

        .play();

    await mba.pushToken(workflow.token, target, 30);
}

export let gazer = {
    'rayRoll': rayRoll,
    'rayDazing': rayDazing,
    'rayFear': rayFear,
    'rayTelekinetic': rayTelekinetic
}