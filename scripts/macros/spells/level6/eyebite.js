import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Eyebite: Action", false);
    if (!featureData) return;
    featureData.system.save.dc = mba.getSpellDC(workflow.item);
    async function effectMacro() {
        await warpgate.revert(token.document, "Eyebite");
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'duration': {
            'seconds': 60
        },
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacro)
                }
            },
            'mba-premades': {
                'spell': {
                    'eyebite': {
                        'saveDC': mba.getSpellDC(workflow.item),
                        'name': workflow.token.document.name,
                    }
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 6,
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
                [workflow.item.name]: effectData
            }
        }
    };
    let options = {
        'permanent': false,
        'name': "Eyebite",
        'description': "Eyebite"
    };
    await warpgate.mutate(workflow.token.document, updates, {}, options);
    new Sequence()

        .effect()
        .file(`jb2a.particles.outward.red.01.03`)
        .attachTo(workflow.token)
        .scale(0.15)
        .duration(5500)
        .fadeOut(500)
        .scaleIn(0, 1000, { ease: "easeOutCubic" })
        .playbackRate(1)
        .filter("ColorMatrix", { hue: 0 })
        .zIndex(0.2)

        .effect()
        .file("animated-spell-effects-cartoon.misc.all seeing eye")
        .attachTo(workflow.token)
        .filter("ColorMatrix", { hue: 260 })
        .scaleToObject(0.85)
        .duration(5500)
        .fadeOut(1000)
        .scaleIn(0, 250, { ease: "easeOutCubic" })
        .zIndex(0.1)

        .effect()
        .file("animated-spell-effects-cartoon.simple.27")
        .attachTo(workflow.token)
        .scaleToObject(4)
        .spriteOffset({ x: 0.1, y: -0.45 }, { gridUnits: true })
        .filter("ColorMatrix", { brightness: -1 })

        .effect()
        .file("jb2a.ward.rune.dark_purple.01")
        .attachTo(workflow.token)
        .scaleToObject(1.85)
        .duration(5500)
        .fadeOut(3500)
        .scaleIn(0, 250, { ease: "easeOutCubic" })
        .opacity(1)
        .filter("ColorMatrix", { hue: 90 })
        .belowTokens()

        .effect()
        .file("jb2a.extras.tmfx.outflow.circle.04")
        .attachTo(workflow.token)
        .scaleToObject(1.35)
        .duration(5500)
        .fadeOut(500)
        .belowTokens()
        .filter("ColorMatrix", { brightness: -1 })
        .opacity(2)
        .scaleIn(0, 500, { ease: "easeOutCubic" })

        .play();
}

async function save({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    new Sequence()

        .effect()
        .file(`jb2a.particles.outward.red.01.03`)
        .attachTo(target)
        .scale(0.15)
        .duration(5500)
        .fadeOut(500)
        .scaleIn(0, 1000, { ease: "easeOutCubic" })
        .playbackRate(1)
        .filter("ColorMatrix", { hue: 0 })
        .zIndex(0.2)

        .effect()
        .file("animated-spell-effects-cartoon.misc.all seeing eye")
        .attachTo(target)
        .filter("ColorMatrix", { hue: 260 })
        .scaleToObject(0.85)
        .duration(5500)
        .fadeOut(1000)
        .scaleIn(0, 250, { ease: "easeOutCubic" })
        .zIndex(0.1)

        .effect()
        .file("animated-spell-effects-cartoon.simple.27")
        .attachTo(target)
        .scaleToObject(4)
        .spriteOffset({ x: 0.1, y: -0.45 }, { gridUnits: true })
        .filter("ColorMatrix", { brightness: -1 })

        .effect()
        .file("jb2a.ward.rune.dark_purple.01")
        .attachTo(target)
        .scaleToObject(1.85)
        .duration(5500)
        .fadeOut(3500)
        .scaleIn(0, 250, { ease: "easeOutCubic" })
        .opacity(1)
        .filter("ColorMatrix", { hue: 90 })
        .belowTokens()

        .effect()
        .file("jb2a.extras.tmfx.outflow.circle.04")
        .attachTo(target)
        .scaleToObject(1.35)
        .duration(5500)
        .fadeOut(500)
        .belowTokens()
        .filter("ColorMatrix", { brightness: -1 })
        .opacity(2)
        .scaleIn(0, 500, { ease: "easeOutCubic" })

        .play();

    let effect = mba.findEffect(target.actor, "Eyebite: Immunity");
    if (!effect) return;
    await mba.createEffect(target.actor, constants.immunityEffectData);
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    const target = workflow.targets.first();
    async function effectMacroImm() {
        let effectData = {
            'name': 'Eyebite: Immunity',
            'icon': 'modules/mba-premades/icons/spells/level6/eyebite_immune.webp',
            'duration': {
                seconds: 60
            },
            'description': 'You succesfully saved against one of the Eyebite effects and are immune to any further attempts to cast it on you.',
            'flags': {
                'dae': {
                    'specialDuration': ['combatEnd']
                }
            }
        }
        await mbaPremades.helpers.createEffect(actor, effectData);
    }
    let effectDataImmune = {
        'name': 'Eyebite: Immunity',
        'icon': 'modules/mba-premades/icons/spells/level6/eyebite_immune.webp',
        'duration': {
            seconds: 60
        },
        'description': `
            <p>You succesfully saved against one of the Eyebite effects and are immune to any further attempts to cast it on you.</p>
        `,
        'flags': {
            'dae': {
                'specialDuration': ['combatEnd']
            }
        }
    }
    if (!workflow.failedSaves.size) {
        await mba.createEffect(target.actor, effectDataImmune);
        return;
    }
    const effect = mba.findEffect(workflow.actor, 'Eyebite');
    let choices = [
        ["Asleep", "sleep", "modules/mba-premades/icons/spells/level6/eyebite_asleep.webp"],
        ["Panicked", "panic", "modules/mba-premades/icons/spells/level6/eyebite_panicked.webp"],
        ["Sickened", "sick", "modules/mba-premades/icons/spells/level6/eyebite_sickened.webp"]
    ];
    let selection = await mba.selectImage("Eyebite", choices, "<b>Choose effect:</b>", "value");
    if (!selection) return;
    if (selection === "sleep") {
        let effectData = {
            'name': "Eyebite: Asleep",
            'icon': "modules/mba-premades/icons/spells/level6/eyebite_asleep.webp",
            'description': `
                <p>You fall unconscious.</p>
                <p>You wake up if you take any damage or if another creature uses its action to shake you awake.</p>
            `,
            'duration': {
                'seconds': 60
            },
            'changes': [
                {
                    'key': 'macro.CE',
                    'mode': 0,
                    'value': "Unconscious",
                    'priority': 20
                }
            ],
            'flags': {
                'dae': {
                    'showIcon': true,
                    'specialDuration': ['isDamaged']
                },
                'effectmacro': {
                    'onDelete': {
                        'script': mba.functionToString(effectMacroImm)
                    }
                }
            }
        };
        if (mba.getItem(target.actor, "Fey Ancestry")) {
            await mba.createEffect(target.actor, effectDataImmune);
            return;
        }
        let newEffect = await mba.createEffect(target.actor, effectData);
        let concData = workflow.actor.getFlag("midi-qol", "concentration-data.removeUuids");
        concData.push(newEffect.uuid);
        await workflow.actor.setFlag("midi-qol", "concentration-data.removeUuids", concData);
    }
    else if (selection === "panic") {
        async function effectMacroStart() {
            await mbaPremades.helpers.dialog("Eyebite: Panic", [["Ok!", true]], `
                <p>You are frightened.</p>
                <p>On each of your turns you must take the <u>Dash</u> action and move away from the caster of the Eyebite spell by the safest and shortest available route, unless there is nowhere to move.</p>
                <p>If you move to a place at least 60 feet away from the caster of the Eyebite spell where it can no longer see you, this effect ends.</p>
            `);
        };
        async function effectMacroEnd() {
            let effect = mbaPremades.helpers.findEffect(actor, 'Eyebite: Panicked');
            let casterNearby = await mbaPremades.helpers.findNearby(token, 60, "any", false, false, true, true).filter(t => t.document.uuid === effect.flags['mba-premades']?.spell?.eyebite?.originUuid);
            console.log(casterNearby);
            if (casterNearby.length) return;
            await mbaPremades.helpers.removeEffect(effect);
        };
        let effectData = {
            'name': "Eyebite: Panicked",
            'icon': "modules/mba-premades/icons/spells/level6/eyebite_panicked.webp",
            'description': "You are frightened. On each of your turns you must take the Dash action and move away from the caster of the Eyebite spell by the safest and shortest available route, unless there is nowhere to move. If you move to a place at least <b>60 feet</b> away from the caster of the Eyebite spell where it <b>can no longer see you</b>, this effect ends.",
            'duration': {
                'seconds': 60
            },
            'changes': [
                {
                    'key': 'macro.CE',
                    'mode': 0,
                    'value': "Frightened",
                    'priority': 20
                }
            ],
            'flags': {
                'dae': {
                    'showIcon': true
                },
                'effectmacro': {
                    'onTurnStart': {
                        'script': mba.functionToString(effectMacroStart)
                    },
                    'onTurnEnd': {
                        'script': mba.functionToString(effectMacroEnd)
                    },
                    'onDelete': {
                        'script': mba.functionToString(effectMacroImm)
                    }
                },
                'mba-premades': {
                    'spell': {
                        'eyebite': {
                            'originUuid': workflow.token.document.uuid
                        }
                    }
                }
            }
        };
        if (mba.checkTrait(target.actor, "ci", "frightened")) return;
        let newEffect = await mba.createEffect(target.actor, effectData);
        let concData = workflow.actor.getFlag("midi-qol", "concentration-data.removeUuids");
        concData.push(newEffect.uuid);
        await workflow.actor.setFlag("midi-qol", "concentration-data.removeUuids", concData);
    }
    else if (selection === "sick") {
        let saveDC = effect.flags['mba-premades']?.spell?.eyebite?.saveDC;
        let effectData = {
            'name': "Eyebite: Sickened",
            'icon': "modules/mba-premades/icons/spells/level6/eyebite_sickened.webp",
            'description': `
                <p>You have disadvantage on all attack rolls and ability checks.</p>
                <p>At the end of each of your turns, you can repeat the Wisdom saving throw.</p>
                <p>If it succeeds, the effect ends.</p>
            `,
            'duration': {
                'seconds': 60
            },
            'changes': [
                {
                    'key': 'flags.midi-qol.disadvantage.attack.all',
                    'mode': 2,
                    'value': 1,
                    'priority': 20
                },
                {
                    'key': 'flags.midi-qol.disadvantage.ability.check.all',
                    'mode': 2,
                    'value': 1,
                    'priority': 20
                },
                {
                    'key': 'flags.midi-qol.OverTime',
                    'mode': 0,
                    'value': `turn=end, saveAbility=wis, saveDC=${saveDC}, saveMagic=true, name=Eyebite: Sickened (DC${saveDC}), killAnim=true`,
                    'priority': 20
                }
            ],
            'flags': {
                'dae': {
                    'showIcon': true
                },
                'effectmacro': {
                    'onDelete': {
                        'script': mba.functionToString(effectMacroImm)
                    }
                }
            }
        };
        let newEffect = await mba.createEffect(target.actor, effectData);
        let concData = workflow.actor.getFlag("midi-qol", "concentration-data.removeUuids");
        concData.push(newEffect.uuid);
        await workflow.actor.setFlag("midi-qol", "concentration-data.removeUuids", concData);
    }
}

export let eyebite = {
    'cast': cast,
    'save': save,
    'item': item
}