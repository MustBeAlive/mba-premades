import {mba} from "../../../helperFunctions.js";

async function illumination({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = await mba.findEffect(workflow.actor, "Illumination");
    if (!effect) {
        ui.notifications.warn("Unable to find effect! (Illumination)");
        return;
    }
    let choices = [["Dim 15", "dim"],["Dim 30 Bright 15", "bright"]];
    let selection = await mba.dialog("Illumination", choices, "Choose ammount of light:");
    if (!selection) return;
    let updates;
    if (selection === "dim") {
        updates = {
            'changes': [
                {
                    'key': 'ATL.light.dim',
                    'mode': 4,
                    'value': 15,
                    'priority': 20
                },
                {
                    'key': 'ATL.light.bright',
                    'mode': 4,
                    'value': 0,
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
                    'key': 'ATL.light.color',
                    'mode': 5,
                    'value': "#d24b4b",
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
        }
    }
    else if (selection === "bright") {
        updates = {
            'changes': [
                {
                    'key': 'ATL.light.dim',
                    'mode': 4,
                    'value': 30,
                    'priority': 20
                },
                {
                    'key': 'ATL.light.bright',
                    'mode': 4,
                    'value': 15,
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
                    'key': 'ATL.light.color',
                    'mode': 5,
                    'value': "#d24b4b",
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
            ]
        }
    }
    await mba.updateEffect(effect, updates);
}

export let flameskull = {
    'illumination': illumination
}