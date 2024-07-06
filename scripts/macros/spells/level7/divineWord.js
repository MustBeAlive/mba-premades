import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

//To do: check fo bugs, animations

async function cast({speaker, actor, token, character, item, args, scope, workflow}) {
    let selection = await mba.selectTarget(workflow.item.name, constants.okCancel, Array.from(workflow.targets), false, 'multiple', undefined, false, 'Choose which targets to keep');
    let newTargets = selection.inputs.filter(i => i).slice(0);
    mba.updateTargets(newTargets);
}

async function item({speaker, actor, token, character, item, args, scope, workflow}) {
    let targets = Array.from(workflow.failedSaves);
    for (let target of targets) {
        let type = await mba.raceOrType(target.actor);
        if (type === 'celestial' || type === 'elemental' || type === 'fey' || type === 'fiend') {
            async function effectMacroCreate() {
                await token.document.update({ hidden: true });
            };
            async function effectMacroEnd() {
                await token.document.update({ hidden: false});
            };
            const effectData = {
                'name': 'Banishment',
                'icon': 'modules/mba-premades/icons/spells/level4/banishment.webp',
                'origin': workflow.item.uuid,
                'description': "For the next 24 hours, you are banished to your plane of origin.",
                'duration': {
                    'seconds': 86400
                },
                'flags': {
                    'effectmacro': {
                        'onCreate': {
                            'script': mba.functionToString(effectMacroCreate)
                        },
                        'onDelete': {
                            'script': mba.functionToString(effectMacroEnd)
                        }
                    },
                    'midi-qol': {
                        'castData': {
                            baseLevel: 7,
                            castLevel: workflow.castData.castLevel,
                            itemUuid: workflow.item.uuid
                        }
                    }
                }
            };
            await mba.createEffect(target.actor, effectData);
            continue;
        }
        let currentHP = target.actor.system.attributes.hp.value;
        if (currentHP > 50) continue;
        else if (currentHP > 40 && currentHP <= 50) {
            const effectData = {
                'name': workflow.item.name,
                'icon': workflow.item.img,
                'origin': workflow.item.uuid,
                'description': "You heard a divine word imbued with the power that shaped the world at the dawn of creation and are deafened for the next minute.",
                'duration': {
                    'seconds': 60
                },
                'changes': [
                    {
                        'key': 'macro.CE',
                        'mode': 0,
                        'value': 'Deafened',
                        'priority': 20
                    }
                ],
                'flags': {
                    'midi-qol': {
                        'castData': {
                            baseLevel: 7,
                            castLevel: workflow.castData.castLevel,
                            itemUuid: workflow.item.uuid
                        }
                    }
                }
            };
            await mba.createEffect(target.actor, effectData);
        }
        else if (currentHP > 30 && currentHP <= 40) {
            const effectData = {
                'name': workflow.item.name,
                'icon': workflow.item.img,
                'origin': workflow.item.uuid,
                'description': "You heard a divine word imbued with the power that shaped the world at the dawn of creation and are blinded and deafened for the next 10 minutes.",
                'duration': {
                    'seconds': 600
                },
                'changes': [
                    {
                        'key': 'macro.CE',
                        'mode': 0,
                        'value': 'Blinded',
                        'priority': 20
                    },
                    {
                        'key': 'macro.CE',
                        'mode': 0,
                        'value': 'Deafened',
                        'priority': 20
                    }
                ],
                'flags': {
                    'midi-qol': {
                        'castData': {
                            baseLevel: 7,
                            castLevel: workflow.castData.castLevel,
                            itemUuid: workflow.item.uuid
                        }
                    }
                }
            };
            await mba.createEffect(target.actor, effectData);
        }
        else if (currentHP > 20 && currentHP <= 30) {
            const effectData = {
                'name': workflow.item.name,
                'icon': workflow.item.img,
                'origin': workflow.item.uuid,
                'description': "You heard a divine word, imbued with the power that shaped the world at the dawn of creation and are blinded, deafened and stunned for the next hour.",
                'duration': {
                    'seconds': 3600
                },
                'changes': [
                    {
                        'key': 'macro.CE',
                        'mode': 0,
                        'value': 'Blinded',
                        'priority': 20
                    },
                    {
                        'key': 'macro.CE',
                        'mode': 0,
                        'value': 'Deafened',
                        'priority': 20
                    },
                    {
                        'key': 'macro.CE',
                        'mode': 0,
                        'value': 'Stunned',
                        'priority': 20
                    }
                ],
                'flags': {
                    'midi-qol': {
                        'castData': {
                            baseLevel: 7,
                            castLevel: workflow.castData.castLevel,
                            itemUuid: workflow.item.uuid
                        }
                    }
                }
            };
            await mba.createEffect(target.actor, effectData);
        }
        else if (currentHP <= 20) {
            await mba.applyDamage([target], 20, 'none');
        }
    }
}

export let divineWord = {
    'cast': cast,
    'item': item
}