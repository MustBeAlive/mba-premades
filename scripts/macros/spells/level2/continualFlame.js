import {mba} from "../../../helperFunctions.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Continual Flame: Torch", false);
    if (!featureData) return;
    delete featureData._id;
    let choicesColor = [
        ["Amber (Orange)", "#9e5c00"],
        ["Amethyst (Purple)", "#4f009e"],
        ["Emerald/Jade (Green)", "#229e00"],
        ["Ruby (Red)", "#9e0000"],
        ["Pearl (White)", "#ffffff"],
        ["Sapphire (Blue)", "#00d5ff"],
    ];
    let selectionColor = await mba.dialog("Continual Flame", choicesColor, "<b>What type of gemstone are you using?</b>");
    if (!selectionColor) return;
    let animation1;
    let hue;
    let saturate;
    switch (selectionColor) {
        case "#9e5c00": {
            animation1 = "jb2a.markers.light.complete.yellow02";
            hue = 0;
            break;
        }
        case "#4f009e": {
            animation1 = "jb2a.markers.light.complete.purple";
            hue = 240;
            break;
        }
        case "#229e00": {
            animation1 = "jb2a.markers.light.complete.green02";
            hue = 70;
            break;
        }
        case "#9e0000": {
            animation1 = "jb2a.markers.light.complete.red";
            hue = 340;
            break;
        }
        case "#ffffff": {
            animation1 = "jb2a.markers.light.complete.yellow";
            hue = 0;
            saturate = -1;
            break;
        }
        case "#00d5ff": {
            animation1 = "jb2a.markers.light.complete.blue02";
            hue = 170;
            break;
        }
    };
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} ConFla` })
        await warpgate.revert(token.document, "Continual Flame");
    };
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'changes': [
            {
                'key': 'ATL.light.dim',
                'mode': 4,
                'value': '40',
                'priority': 20
            },
            {
                'key': 'ATL.light.bright',
                'mode': 4,
                'value': '20',
                'priority': 20
            },
            {
                'key': 'ATL.light.color',
                'mode': 5,
                'value': selectionColor,
                'priority': 20
            },
            {
                'key': 'ATL.light.animation',
                'mode': 5,
                'value': '{type: "torch", speed: 3, intensity: 3, reverse: false }',
                'priority': 20
            },
            {
                'key': 'ATL.light.alpha',
                'mode': 5,
                'value': "0.25",
                'priority': 20
            },
        ],
        'flags': {
            'dae': {
                'showIcon': false,
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'mba-premades': {
                'spell': {
                    'continualFlame': {
                        'color': selectionColor,
                        'state': "exposed"
                    }
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 2,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    let updates = {
        'embedded': {
            'Item': {
                [featureData.name]: featureData
            },
            'ActiveEffect': {
                [effectData.name]: effectData
            }
        }
    };
    let options = {
        'permanent': false,
        'name': "Continual Flame",
        'description': "Continual Flame"
    };

    new Sequence()

        .wait(500)

        .effect()
        .file(animation1)
        .attachTo(target)
        .fadeOut(1000)
        
        .effect()
        .file("jaamod.fire.candle_flame.1")
        .attachTo(target, { offset: { x: 0.4 * target.document.width }, gridUnits: true, followRotation: false })
        .scaleToObject(0.8, { considerTokenScale: true })
        .delay(1500)
        .fadeIn(500)
        .fadeOut(1000)
        .filter("ColorMatrix", { hue: hue, saturate: saturate })
        .persist()
        .name(`${target.document.name} ConFla`)

        .thenDo(async () => {
            await warpgate.mutate(target.document, updates, {}, options);
        })

        .play()
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = await mba.findEffect(workflow.actor, "Continual Flame");
    if (!effect) return;
    let state = effect.flags['mba-premades']?.spell?.continualFlame?.state;
    let color = effect.flags['mba-premades']?.spell?.continualFlame?.color;
    let hue;
    let saturate;
    switch (color) {
        case "#9e5c00": {
            hue = 0;
            break;
        }
        case "#4f009e": {
            hue = 240;
            break;
        }
        case "#229e00": {
            hue = 70;
            break;
        }
        case "#9e0000": {
            hue = 340;
            break;
        }
        case "#ffffff": {
            hue = 0;
            saturate = -1;
            break;
        }
        case "#00d5ff": {
            hue = 170;
            break;
        }
    };
    let choices = [];
    if (state === "exposed") choices.push([`Hide "Torch"`, "hide"]);
    else if (state === "hidden") choices.push([`Show "Torch"`, "show"]);
    if (!choices.length) return;
    choices.push(["Cancel", false]);
    let selection = await mba.dialog("Continual Flame", choices, "What would you like to do?");
    if (!selection) return;
    let updates;
    if (selection === "hide") {
        updates = {
            'changes': [
            ],
            'flags': {
                'mba-premades': {
                    'spell': {
                        'continualFlame': {
                            'state': "hidden"
                        }
                    }
                }
            }
        };
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} ConFla` })
        await mba.updateEffect(effect, updates);
        return;
    }
    else if (selection === "show") {
        updates = {
            'changes': [
                {
                    'key': 'ATL.light.dim',
                    'mode': 4,
                    'value': '40',
                    'priority': 20
                },
                {
                    'key': 'ATL.light.bright',
                    'mode': 4,
                    'value': '20',
                    'priority': 20
                },
                {
                    'key': 'ATL.light.color',
                    'mode': 5,
                    'value': color,
                    'priority': 20
                },
                {
                    'key': 'ATL.light.animation',
                    'mode': 5,
                    'value': '{type: "torch", speed: 3, intensity: 3, reverse: false }',
                    'priority': 20
                },
                {
                    'key': 'ATL.light.alpha',
                    'mode': 5,
                    'value': "0.25",
                    'priority': 20
                },
            ],
            'flags': {
                'mba-premades': {
                    'spell': {
                        'continualFlame': {
                            'state': "exposed"
                        }
                    }
                }
            }
        };
        new Sequence()

            .effect()
            .file("jaamod.fire.candle_flame.1")
            .attachTo(token, { offset: { x: 0.4 * token.document.width }, gridUnits: true, followRotation: false })
            .scaleToObject(0.8, { considerTokenScale: true })
            .fadeIn(500)
            .fadeOut(1000)
            .filter("ColorMatrix", { hue: hue, saturate: saturate })
            .persist()
            .name(`${token.document.name} ConFla`)

            .thenDo(async () => {
                await mba.updateEffect(effect, updates);
            })

            .play()
    }
}

export let continualFlame = {
    'cast': cast,
    'item': item
}