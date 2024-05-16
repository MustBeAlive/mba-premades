import {mba} from "../../../helperFunctions.js";

export async function enhanceAbility({ speaker, actor, token, character, item, args, scope, workflow }) {
    const target = workflow.targets.first();
    let choices = [
        ["Bull's Strength (STR)", 'STR'],
        ["Cat's Grace (DEX)", 'DEX'],
        ["Bear's Endurance (CON)", 'CON'],
        ["Fox's Cunning (INT)", 'INT'],
        ["Owl's Wisdom (WIS)", 'WIS'],
        ["Eagle's Splendor (CHA)", 'CHA']
    ];
    let selection = await mba.dialog("Enhance Ability", choices, `<b>Choose ability to enhance:</b>`);
    if (!selection) {
        await mba.removeCondition(workflow.actor, "Concentrating");
        return;
    }
    let effectData;
    if (selection === "STR") {
        effectData = {
            'name': "Enhance Ability: Bull's Strength",
            'icon': "modules/mba-premades/icons/spells/level2/enhance_ability1.webp",
            'origin': workflow.item.uuid,
            'description': "You have advantage on Strength checks and your carrying capacity doubles",
            'duration': {
                'seconds': 3600
            },
            'changes': [
                {
                    'key': 'flags.midi-qol.advantage.ability.check.str',
                    'mode': 2,
                    'value': "1",
                    'priority': 20
                },
                {
                    'key': 'flags.dnd5e.powerfulBuild',
                    'mode': 2,
                    'value': "1",
                    'priority': 20
                }
            ],
            'flags': {
                'midi-qol': {
                    'castData': {
                        baseLevel: 2,
                        castLevel: workflow.castData.castLevel,
                        itemUuid: workflow.item.uuid
                    }
                }
            }
        };
    }
    else if (selection === "DEX") {
        effectData = {
            'name': "Enhance Ability: Cat's Grace",
            'icon': "modules/mba-premades/icons/spells/level2/enhance_ability2.webp",
            'origin': workflow.item.uuid,
            'description': "You have advantage on Dexterity checks and you don't take damage from falling 20 feet or less if you are not incapacitated",
            'duration': {
                'seconds': 3600
            },
            'changes': [
                {
                    'key': 'flags.midi-qol.advantage.ability.check.dex',
                    'mode': 2,
                    'value': "1",
                    'priority': 20
                }
            ],
            'flags': {
                'midi-qol': {
                    'castData': {
                        baseLevel: 2,
                        castLevel: workflow.castData.castLevel,
                        itemUuid: workflow.item.uuid
                    }
                }
            }
        };
    }
    else if (selection === "CON") {
        let damageFormula = '2d6[temphp]';
        let damageRoll = await new Roll(damageFormula).roll({ 'async': true });
        await MidiQOL.displayDSNForRoll(damageRoll, 'damageRoll');
        damageRoll.toMessage({
            rollMode: 'roll',
            speaker: { 'alias': name },
            flavor: "Enhance Ability: Bear's Endurance"
        });
        async function effectMacroDel() {
            if (actor.system.attributes.hp.temp > 0) {
                await actor.update({ "system.attributes.hp.temp": 0 })
            }
        }
        effectData = {
            'name': "Enhance Ability: Bear's Endurance",
            'icon': "modules/mba-premades/icons/spells/level2/enhance_ability3.webp",
            'origin': workflow.item.uuid,
            'description': "You have advantage on Constitution checks and you gain 2d6 temporary hit points, which are lost when the spell ends",
            'duration': {
                'seconds': 3600
            },
            'changes': [
                {
                    'key': 'flags.midi-qol.advantage.ability.check.con',
                    'mode': 2,
                    'value': "1",
                    'priority': 20
                }
            ],
            'flags': {
                'effectmacro': {
                    'onDelete': {
                        'script': mba.functionToString(effectMacroDel)
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
        if (target.actor.system.attributes.hp.temp < damageRoll.total) {
            await mba.applyDamage([target.actor], damageRoll.total, 'temphp');
        }
    }
    else if (selection === "INT") {
        effectData = {
            'name': "Enhance Ability: Fox's Cunning",
            'icon': "modules/mba-premades/icons/spells/level2/enhance_ability4.webp",
            'origin': workflow.item.uuid,
            'description': "You have advantage on Intelligence checks",
            'duration': {
                'seconds': 3600
            },
            'changes': [
                {
                    'key': 'flags.midi-qol.advantage.ability.check.int',
                    'mode': 2,
                    'value': "1",
                    'priority': 20
                }
            ],
            'flags': {
                'midi-qol': {
                    'castData': {
                        baseLevel: 2,
                        castLevel: workflow.castData.castLevel,
                        itemUuid: workflow.item.uuid
                    }
                }
            }
        };
    }
    else if (selection === "WIS") {
        effectData = {
            'name': "Enhance Ability: Owl's Wisdom",
            'icon': "modules/mba-premades/icons/spells/level2/enhance_ability5.webp",
            'origin': workflow.item.uuid,
            'description': "You have advantage on Wisdom checks",
            'duration': {
                'seconds': 3600
            },
            'changes': [
                {
                    'key': 'flags.midi-qol.advantage.ability.check.wis',
                    'mode': 2,
                    'value': "1",
                    'priority': 20
                }
            ],
            'flags': {
                'midi-qol': {
                    'castData': {
                        baseLevel: 2,
                        castLevel: workflow.castData.castLevel,
                        itemUuid: workflow.item.uuid
                    }
                }
            }
        };
    }
    else if (selection === "CHA") {
        effectData = {
            'name': "Enhance Ability: Eagle's Splendor",
            'icon': "modules/mba-premades/icons/spells/level2/enhance_ability6.webp",
            'origin': workflow.item.uuid,
            'description': "You have advantage on Charisma checks",
            'duration': {
                'seconds': 3600
            },
            'changes': [
                {
                    'key': 'flags.midi-qol.advantage.ability.check.cha',
                    'mode': 2,
                    'value': "1",
                    'priority': 20
                }
            ],
            'flags': {
                'midi-qol': {
                    'castData': {
                        baseLevel: 2,
                        castLevel: workflow.castData.castLevel,
                        itemUuid: workflow.item.uuid
                    }
                }
            }
        };
    }
    await mba.createEffect(target.actor, effectData);
}