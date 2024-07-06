import {mba} from "../../../helperFunctions.js";

// To do: better implementation (3d party reaction leggo?), animations

async function cast({speaker, actor, token, character, item, args, scope, workflow}) {
    let effectData = {
        'name': "Primordial Ward",
        'icon': workflow.item.img,
        'description': `
            <p>You have resistance to acid, cold, fire, lightning, and thunder damage for the spell's duration.</p>
            <p>When you take damage of one of those types, you can use your reaction to gain immunity to that type of damage, including against the triggering damage.</p>
            <p>If you do so, the resistances end, and you have the immunity until the end of your next turn, at which time the spell ends.</p>`
        ,
        'origin': workflow.item.uuid,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.primordialWard.item,isHit',
                'priority': 20
            },
            {
                'key': 'system.traits.dr.value',
                'mode': 0,
                'value': "acid",
                'priority': 20
            },
            {
                'key': 'system.traits.dr.value',
                'mode': 0,
                'value': "cold",
                'priority': 20
            },
            {
                'key': 'system.traits.dr.value',
                'mode': 0,
                'value': "fire",
                'priority': 20
            },
            {
                'key': 'system.traits.dr.value',
                'mode': 0,
                'value': "lightning",
                'priority': 20
            },
            {
                'key': 'system.traits.dr.value',
                'mode': 0,
                'value': "thunder",
                'priority': 20
            }
        ],
        'flags': {
            'midi-qol': {
                'castData': {
                    baseLevel: 6,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    await mba.createEffect(workflow.actor, effectData)
}

async function item({speaker, actor, token, character, item, args, scope, workflow}) {
    let source = workflow.targets.first();
    let type = workflow.item.system.damage.parts[0][1];
    if (type != "acid" && type != "cold" && type != "fire" && type != "lightning" && type != "thunder") return;
    let effect = mba.findEffect(source.actor, "Primordial Ward");
    await new Dialog({
        title: "Primodial Ward",
        content: `
            <p>You are about to be damaged by ${type} damage.</p>
            <p>Do you wish to use your reaction to gain immunity to this damage type?</p>
            <p>(this will end concentration and remove initial effect)</p>
        `,
        buttons: {
            yes: {
                label: "Yes",
                callback: async () => {
                    await mba.removeEffect(effect);
                    let icon;
                    switch (type) {
                        case "acid": {
                            icon = "modules/mba-premades/icons/spells/level6/primordial_ward_acid.webp";
                            break;
                        }
                        case "cold": {
                            icon = "modules/mba-premades/icons/spells/level6/primordial_ward_cold.webp";
                            break;
                        }
                        case "fire": {
                            icon = "modules/mba-premades/icons/spells/level6/primordial_ward_fire.webp";
                            break;
                        }
                        case "lightning": {
                            icon = "modules/mba-premades/icons/spells/level6/primordial_ward_lightning.webp";
                            break;
                        }
                        case "thunder": {
                            icon = "modules/mba-premades/icons/spells/level6/primordial_ward_thunder.webp";
                            break;
                        }
                    };
                    let effectData = {
                        'name': "Primordial Ward: Immunity",
                        'icon': icon,
                        'description': `You have immunity to ${type} damage until the end of your next turn.`,
                        'origin': effect.flags['midi-qol']?.castData?.itemUuid,
                        'changes': [
                            {
                                'key': 'system.traits.di.value',
                                'mode': 0,
                                'value': type,
                                'priority': 20
                            },
                            {
                                'key': 'macro.CE',
                                'mode': 0,
                                'value': "Reaction",
                                'priority': 20
                            }
                        ],
                        'flags': {
                            'dae': {
                                'showIcon': true,
                                'specialDuration': ['turnEndSource']
                            },
                            'midi-qol': {
                                'castData': {
                                    baseLevel: effect.flags['midi-qol']?.castData?.baseLevel,
                                    castLevel: effect.flags['midi-qol']?.castData?.castLevel
                                }
                            }
                        }
                    };
                    await mba.createEffect(source.actor, effectData);
                },
            },
            no: {
                label: "No",
                callback: async () => {
                    return;
                }
            }
        }
    }).render(true);
}

export let primordialWard = {
    'cast': cast,
    'item': item
}