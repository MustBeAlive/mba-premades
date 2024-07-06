import {mba} from "../../../helperFunctions.js";

async function consumeLifeCheck({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    if (mba.findEffect(target.actor, "Dead")) {
        ui.notifications.warn("Target is dead!");
        return false;
    }
    if (target.actor.system.attributes.hp.value > 0) {
        ui.notifications.warn("Target must have 0 HP!");
        return false;
    }
}

async function consumeLifeEffect({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let healingRoll = await new Roll(`3d6[healing]`).roll({ 'async': true });
    await MidiQOL.displayDSNForRoll(healingRoll);
    await mba.applyWorkflowDamage(workflow.token, healingRoll, "healing", [workflow.token], undefined, workflow.itemCardId);
    await mba.addCondition(workflow.targets.first().actor, "Dead", true);
}

async function variableIllumination({ speaker, actor, token, character, item, args, scope, workflow }) {
    let oldEffect = await mba.findEffect(workflow.actor, "Variable Illumination");
    let choices = [["5 feet", 5], ["10 feet", 10], ["15 feet", 15], ["20 feet", 20], ["Remove Light", "remove"]];
    let selection = await mba.dialog("Variable Illumination", choices, "<b>Select light radius</b>");
    if (!selection) return;
    if (selection === "remove") {
        if (oldEffect) await mba.removeEffect(oldEffect);
        return;
    }
    let effectData = {
        'name': "Variable Illumination",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'changes': [
            {
                'key': 'ATL.light.dim',
                'mode': 4,
                'value': `${selection * 2}`,
                'priority': 20
            },
            {
                'key': 'ATL.light.bright',
                'mode': 4,
                'value': `${selection}`,
                'priority': 20
            },
            {
                'key': 'ATL.light.alpha',
                'mode': 5,
                'value': "0.25",
                'priority': 20
            },
            {
                'key': 'ATL.light.angle',
                'mode': 5,
                'value': "360",
                'priority': 20
            },
            {
                'key': 'ATL.light.luminosity',
                'mode': 5,
                'value': "0.5",
                'priority': 20
            },
            {
                'key': 'ATL.light.animation',
                'mode': 5,
                'value': '{type: "smokepatch", speed: 5, intensity: 1, reverse: false }',
                'priority': 20
            },
            {
                'key': 'ATL.light.attenuation',
                'mode': 5,
                'value': "0.8",
                'priority': 20
            },
            {
                'key': 'ATL.light.contrast',
                'mode': 5,
                'value': "0.15",
                'priority': 20
            },
            {
                'key': 'ATL.light.shadows',
                'mode': 5,
                'value': "0.2",
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': false
            }
        }
    };
    if (oldEffect) await mba.removeEffect(oldEffect);
    await warpgate.wait(100);
    await mba.createEffect(workflow.actor, effectData)
}

export let willOWisp = {
    'consumeLifeCheck': consumeLifeCheck,
    'consumeLifeEffect': consumeLifeEffect,
    'variableIllumination': variableIllumination
}