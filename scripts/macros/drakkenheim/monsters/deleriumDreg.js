import {constants} from "../../generic/constants.js";
import {contamination} from "../contamination.js";
import {mba} from "../../../helperFunctions.js";

async function bileSprayCast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;

    new Sequence()

        .effect()
        .file("jb2a.breath_weapons02.burst.cone.fire.green.01")
        .atLocation(workflow.token)
        .rotateTowards(template)
        .scaleToObject(1.5)
        .fadeIn(1500)
        .playbackRate(1.4)

        .play()
}

async function bileSprayItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let saveDC = workflow.item.system.save.dc;
    let targets = Array.from(workflow.targets);
    for (let i = 0; i < workflow.hitTargets.size; i++) {
        if ((workflow.saveResults[i].total + 5) >= saveDC) continue;
        let target = targets[i];
        await contamination.addContamination(target);
        continue;
    }
}

async function psychicShriekCast({ speaker, actor, token, character, item, args, scope, workflow }) {
    new Sequence()

        .effect()
        .file("jb2a.extras.tmfx.inpulse.circle.01.normal")
        .attachTo(workflow.token, { bindAlpha: false })
        .scaleToObject(1.75)
        .randomRotation()
        .fadeIn(1000, { delay: 0 })
        .opacity(1)
        .aboveLighting()

        .effect()
        .file("jb2a.particles.inward.white.01.02")
        .atLocation(workflow.token)
        .scaleToObject(2)
        .duration(500)
        .fadeOut(400)
        .scaleOut(0, 750, { ease: "easeOutCubic" })
        .opacity(0.5)
        .zIndex(1)
        .randomRotation()
        .aboveLighting()
        .repeats(4, 150, 150)
        .waitUntilFinished()

        .effect()
        .file("jb2a.impact.004.blue")
        .atLocation(workflow.token)
        .scaleToObject(6)
        .fadeIn(700)
        .fadeOut(1000)
        .scaleIn(0, 3000, { ease: "easeOutExpo" })
        .loopProperty("sprite", "position.x", { from: 0.01, to: -0.01, gridUnits: true, pingPong: true, duration: 50 })
        .opacity(0.4)
        .zIndex(1)
        .filter("ColorMatrix", { saturate: -1, brightness: 1.1 })
        .randomRotation()
        .aboveLighting()
        .repeats(8, 450, 450)

        .effect()
        .file("jb2a.extras.tmfx.outpulse.circle.01.fast")
        .attachTo(workflow.token, { bindAlpha: false })
        .size(12, { gridUnits: true })
        .loopProperty("sprite", "position.x", { from: 0.01, to: -0.01, gridUnits: true, pingPong: true, duration: 50 })
        .opacity(0.5)
        .zIndex(0)
        .aboveLighting()
        .filter("ColorMatrix", { saturate: -1 })
        .repeats(8, 450, 450)

        .canvasPan()
        .delay(100)
        .shake({ duration: 3600, strength: 2, rotation: false, fadeOut: 1000 })

        .play()
}

async function psychicShriekItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    async function effectMacroTurnEnd() {
        await mbaPremades.macros.monsters.deleriumDreg.psychicScreamTurnEnd(token);
    };
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} DelDFe` });
    };
    let effectData = {
        'name': "Delerium Dreg: Fear",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.oR1wUvem3zVVUv5Q]{Frightened} by Delerium Dreg's Psychic Shriek for the duration.</p>
            <p>At the end of each of your turns, you can repeat the save, ending the effect on a success.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Frightened",
                'priority': 20
            },
        ],
        'flags': {
            'effectmacro': {
                'onTurnEnd': {
                    'script': mba.functionToString(effectMacroTurnEnd)
                },
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };
    for (let target of Array.from(workflow.failedSaves)) {
        new Sequence()

            .effect()
            .file("jb2a.icon.fear.dark_purple")
            .attachTo(target)
            .scaleToObject(1)
            .duration(2000)
            .fadeOut(1000)
            .scaleIn(0, 500, { ease: "easeOutQuint" })
            .playbackRate(1)

            .effect()
            .file("jb2a.icon.fear.dark_purple")
            .attachTo(target)
            .scaleToObject(3)
            .fadeOut(1000)
            .duration(1000)
            .anchor({ y: 0.45 })
            .scaleIn(0, 500, { ease: "easeOutQuint" })
            .playbackRate(1)
            .opacity(0.5)

            .effect()
            .file("jb2a.extras.tmfx.border.circle.outpulse.01.fast")
            .attachTo(target)
            .scaleToObject(2)

            .effect()
            .file("jb2a.markers.fear.dark_purple.03")
            .attachTo(target)
            .scaleToObject(2)
            .delay(500)
            .fadeIn(1000)
            .fadeOut(1000)
            .center()
            .playbackRate(1)
            .persist()
            .name(`${target.document.name} DelDFe`)

            .thenDo(async () => {
                await mba.createEffect(target.actor, effectData);
            })

            .play()
    }
}

async function psychicScreamTurnEnd(token) {
    let effect = await mba.findEffect(token.actor, "Delerium Dreg: Fear");
    if (!effect) return;
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Monster Features", "Banshee Fear: Save", false);
    if (!featureData) return;
    delete featureData._id;
    featureData.name = "Delerim Dreg Fear: Save (DC10)";
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': token.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([token.document.uuid]);
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (featureWorkflow.failedSaves.size) return;
    await mba.removeEffect(effect);
}

async function displacement(token) {
    if (mba.findEffect(token.actor, "Incapacitated")) return;
    if (mba.findEffect(token.actor, "Displacement")) return;
    let effectData = {
        'name': "Displacement",
        'icon': "modules/mba-premades/icons/generic/displacer_beast.webp",
        'description': `
            <p>Attack rolls against a displaced dreg have disadvantage.</p>
            <p>If it is hit by an attack, this trait is disrupted until the end of its next turn.</p>
            <p>This trait is also disrupted while the displaced dreg is @UUID[Compendium.mba-premades.MBA SRD.Item.LCcuJNMKrGouZbFJ]{Incapacitated} or has a speed of 0.</p>
        `,
        'changes': [
            {
                'key': 'flags.midi-qol.grants.disadvantage.attack.all',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
            {
                'key': 'macro.tokenMagic',
                'mode': 0,
                'value': "blur",
                'priority': 20
            },
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['isDamaged', 'zeroHP']
            }
        }
    };
    await mba.createEffect(token.actor, effectData);
}

async function displacedTeleportCast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let choices = [
        [`Bonus <u>BEFORE</u> teleport`, "before"],
        [`Bonus <u>AFTER</u> teleport`, "after"]
    ];
    await mba.gmDialogMessage();
    let selection = await mba.dialog("Teleport: Damage Bonus", choices, `<p>When would you like to receive the damage bonus to 1 mwak?</p>`);
    await mba.clearGMDialogMessage();
    if (!selection || selection === "after") return;
    let effectData = {
        'name': "Teleport: Damage Bonus",
        'icon': 'modules/mba-premades/icons/generic/generic_buff.webp',
        'description': "Next melee attack you hit will deal additional 2d6 damage.",
        'duration': {
            'turns': 1
        },
        'changes': [
            {
                'key': 'system.bonuses.mwak.damage',
                'value': '+2d6',
                'mode': 2,
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'specialDuration': ['turnEnd', '1Attack:mwak']
            },
            'mba-premades': {
                'effect': {
                    'noAnimation': true
                },
            }
        }
    };
    await mba.createEffect(workflow.actor, effectData);
    let effect = await mba.findEffect(workflow.actor, "Teleport: Passive");
    if (!effect) {
        ui.notifications.warn("Unable to find effect! (Teleport: Passive)");
        return;
    }
    let updates = {
        'flags': {
            'mba-premades': {
                'feature': {
                    'teleport': 1
                }
            }
        }
    };
    await mba.updateEffect(effect, updates);
}

async function displacedTeleportItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = await mba.findEffect(workflow.actor, "Teleport: Passive");
    let check = effect.flags['mba-premades']?.feature?.teleport;
    let interval = workflow.token.document.width % 2 === 0 ? 1 : -1;
    await mba.gmDialogMessage();
    let position = await mba.aimCrosshair(workflow.token, 60, workflow.item.img, interval, workflow.token.document.width);
    await mba.clearGMDialogMessage();
    if (position.cancelled) return;
    new Sequence()

        .animation()
        .delay(800)
        .on(workflow.token)
        .fadeOut(200)

        .effect()
        .file("jb2a.misty_step.01.purple")
        .atLocation(workflow.token)
        .scaleToObject(2)
        .waitUntilFinished(-2000)

        .animation()
        .on(workflow.token)
        .teleportTo(position)
        .snapToGrid()
        .offset({ x: -1, y: -1 })
        .waitUntilFinished(200)

        .effect()
        .file("jb2a.misty_step.02.purple")
        .atLocation(workflow.token)
        .scaleToObject(2)

        .animation()
        .delay(1400)
        .on(workflow.token)
        .fadeIn(200)

        .thenDo(async () => {
            if (check === 1) return;
            let effectData = {
                'name': "Teleport: Damage Bonus",
                'icon': 'modules/mba-premades/icons/generic/generic_buff.webp',
                'description': "Next melee attack you hit will deal additional 2d6 damage.",
                'duration': {
                    'turns': 1
                },
                'changes': [
                    {
                        'key': 'system.bonuses.mwak.damage',
                        'value': '+2d6',
                        'mode': 2,
                        'priority': 20
                    }
                ],
                'flags': {
                    'dae': {
                        'specialDuration': ['turnEnd', '1Attack:mwak']
                    },
                    'mba-premades': {
                        'effect': {
                            'noAnimation': true
                        },
                    }
                }
            };
            await mba.createEffect(workflow.actor, effectData);
            let updates = {
                'flags': {
                    'mba-premades': {
                        'feature': {
                            'teleport': 1
                        }
                    }
                }
            };
            await mba.updateEffect(effect, updates);
        })

        .play();
}

async function displacedTeleportReset(token) {
    let effect = await mba.findEffect(token.actor, "Teleport: Passive");
    if (!effect) return;
    let updates = {
        'flags': {
            'mba-premades': {
                'feature': {
                    'teleport': 0
                }
            }
        }
    };
    await mba.updateEffect(effect, updates);
}

async function octarineBeam({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    if (!target) return;

    new Sequence()

        .effect()
        .file("jb2a.scorching_ray.01.yellow")
        .attachTo(workflow.token)
        .stretchTo(target)
        .repeats(3, 600, 600)
        .waitUntilFinished(-3600)

        .thenDo(async () => {
            if (!workflow.failedSaves.size) return;
            let saveDC = workflow.item.system.save.dc;
            if ((workflow.saveResults[0].total + 5) >= saveDC) return;
            await contamination.addContamination(target);
        })

        .play()
}

async function drainCheck({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = await mba.findEffect(workflow.actor, "Leeching Dreg: Blood Drain");
    if (effect) {
        let targetName = effect.flags['mba-premades']?.feature?.bloodDrain?.targetName;
        ui.notifications.warn(`Leeching Dreg is attached to ${targetName} and can't use it's attack!`);
        return false;
    }
}

async function drainAttach({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    new Sequence()

        .effect()
        .file("jb2a.energy_strands.range.multiple.dark_purple02.01")
        .attachTo(target)
        .stretchTo(workflow.token)
        .repeats(2, 1500)

        .effect()
        .file("jb2a.divine_smite.caster.dark_purple")
        .attachTo(workflow.token)
        .scaleToObject(1.5)
        .fadeIn(500)
        .belowTokens()

        .play()

    if (!workflow.hitTargets.size) return;
    if (mba.findEffect(workflow.actor, `Leeching Dreg: Blood Drain`)) return;
    async function effectMacroStart() {
        await mbaPremades.macros.monsters.deleriumDreg.drainItem(token);
    }
    let effectData = {
        'name': "Leeching Dreg: Blood Drain",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Target: <u>${target.document.name}</u></p>
        `,
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['zeroHP']
            },
            'effectmacro': {
                'onTurnStart': {
                    'script': mba.functionToString(effectMacroStart)
                }
            },
            'mba-premades': {
                'feature': {
                    'bloodDrain': {
                        'targetName': target.document.name,
                        'targetUuid': target.document.uuid,
                    }
                }
            }
        }
    };
    await mba.createEffect(workflow.actor, effectData);
}

async function drainItem(token) {
    let effect = await mba.findEffect(token.actor, "Leeching Dreg: Blood Drain");
    if (!effect) return;
    let targetDoc = await fromUuid(effect.flags['mba-premades']?.feature?.bloodDrain?.targetUuid);
    let target = targetDoc.object;
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Monster Features", "Blood Drain: Turn Start", false);
    if (!featureData) return;
    featureData.img = "modules/mba-premades/icons/drakkenheim/mutation20_arcane_blood.webp";
    featureData.system.damage.parts[0][0] = '2d6[necrotic]';
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': token.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([targetDoc.uuid]);
    new Sequence()

        .effect()
        .file("jb2a.energy_strands.range.multiple.dark_red.01")
        .attachTo(target)
        .stretchTo(token)
        .repeats(2, 1500)

        .effect()
        .file("jb2a.divine_smite.caster.dark_red")
        .attachTo(token)
        .scaleToObject(1.5)
        .fadeIn(500)
        .belowTokens()

        .thenDo(async () => {
            await MidiQOL.completeItemUse(feature, config, options);
        })

        .play()
}

async function drainDetach({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = await mba.findEffect(workflow.actor, `Leeching Dreg: Blood Drain`);
    if (effect) await mba.removeEffect(effect);
}

export let deleriumDreg = {
    'bileSprayCast': bileSprayCast,
    'bileSprayItem': bileSprayItem,
    'psychicShriekCast': psychicShriekCast,
    'psychicShriekItem': psychicShriekItem,
    'psychicScreamTurnEnd': psychicScreamTurnEnd,
    'displacement': displacement,
    'displacedTeleportCast': displacedTeleportCast,
    'displacedTeleportItem': displacedTeleportItem,
    'displacedTeleportReset': displacedTeleportReset,
    'octarineBeam': octarineBeam,
    'drainCheck': drainCheck,
    'drainAttach': drainAttach,
    'drainItem': drainItem,
    'drainDetach': drainDetach
}