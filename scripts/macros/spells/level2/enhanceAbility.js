import {mba} from "../../../helperFunctions.js";

export async function enhanceAbility({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let choices = [
        ["Bull's Strength (STR)", "STR", "modules/mba-premades/icons/spells/level2/enhance_ability1.webp"],
        ["Cat's Grace (DEX)", "DEX", "modules/mba-premades/icons/spells/level2/enhance_ability2.webp"],
        ["Bear's Endurance (CON)", "CON", "modules/mba-premades/icons/spells/level2/enhance_ability3.webp"],
        ["Fox's Cunning (INT)", "INT", "modules/mba-premades/icons/spells/level2/enhance_ability4.webp"],
        ["Owl's Wisdom (WIS)", "WIS", "modules/mba-premades/icons/spells/level2/enhance_ability5.webp"],
        ["Eagle's Splendor (CHA)", "CHA", "modules/mba-premades/icons/spells/level2/enhance_ability6.webp"]
    ];
    await mba.playerDialogMessage();
    let selection = await mba.selectImage("Enhance Ability", choices, `<b>Choose ability to enhance:</b>`, "both");
    await mba.clearPlayerDialogMessage();
    if (!selection.length) {
        await mba.removeCondition(workflow.actor, "Concentrating");
        return;
    }
    let effectData;
    if (selection[0] === "STR") {
        async function effectMacroDel() {
            Sequencer.EffectManager.endEffects({ name: `${token.document.name} Enhance Ability`, object: token })
        }
        effectData = {
            'name': "Enhance Ability: Bull's Strength",
            'icon': selection[1],
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
    }
    else if (selection[0] === "DEX") {
        async function effectMacroDel() {
            Sequencer.EffectManager.endEffects({ name: `${token.document.name} Enhance Ability`, object: token })
        }
        effectData = {
            'name': "Enhance Ability: Cat's Grace",
            'icon': selection[1],
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
    }
    else if (selection[0] === "CON") {
        let damageFormula = '2d6[temphp]';
        let damageRoll = await new Roll(damageFormula).roll({ 'async': true });
        await MidiQOL.displayDSNForRoll(damageRoll);
        async function effectMacroDel() {
            Sequencer.EffectManager.endEffects({ name: `${token.document.name} Enhance Ability`, object: token })
            if (actor.system.attributes.hp.temp > 0) {
                await actor.update({ "system.attributes.hp.temp": 0 })
            }
        }
        effectData = {
            'name': "Enhance Ability: Bear's Endurance",
            'icon': selection[1],
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
        await mba.applyWorkflowDamage(workflow.token, damageRoll, "temphp", [target], undefined, workflow.itemCardId);
    }
    else if (selection[0] === "INT") {
        async function effectMacroDel() {
            Sequencer.EffectManager.endEffects({ name: `${token.document.name} Enhance Ability`, object: token })
        }
        effectData = {
            'name': "Enhance Ability: Fox's Cunning",
            'icon': selection[1],
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
    }
    else if (selection[0] === "WIS") {
        async function effectMacroDel() {
            Sequencer.EffectManager.endEffects({ name: `${token.document.name} Enhance Ability`, object: token })
        }
        effectData = {
            'name': "Enhance Ability: Owl's Wisdom",
            'icon': selection[1],
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
    }
    else if (selection[0] === "CHA") {
        async function effectMacroDel() {
            Sequencer.EffectManager.endEffects({ name: `${token.document.name} Enhance Ability`, object: token })
        }
        effectData = {
            'name': "Enhance Ability: Eagle's Splendor",
            'icon': selection[1],
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
    }

    new Sequence()

        .effect()
        .file("jb2a.energy_strands.range.multiple.orange.01")
        .attachTo(token)
        .stretchTo(target)
        .filter("ColorMatrix", { hue: 40 })
        .waitUntilFinished(-1500)

        .effect()
        .file("jb2a.magic_signs.rune.transmutation.complete.yellow")
        .attachTo(target)
        .scaleToObject(1.3)
        .filter("ColorMatrix", { hue: 20 })

        .effect()
        .file("jb2a.token_border.circle.spinning.orange.009")
        .attachTo(target)
        .scaleToObject(1.95)
        .fadeIn(2500)
        .fadeOut(1000)
        .filter("ColorMatrix", { hue: 30 })
        .belowTokens()
        .persist()
        .name(`${target.document.name} Enhance Ability`)

        .wait(750)

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectData);
        })

        .play()
}