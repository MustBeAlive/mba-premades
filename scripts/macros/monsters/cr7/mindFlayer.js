import {mba} from "../../../helperFunctions.js";

async function tentacles({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let target = workflow.targets.first();
    let saveDC = workflow.item.system.save.dc;
    let grappleEffect = await mba.findEffect(target.actor, "Mind Flayer: Grapple");
    if (grappleEffect) { //fucking abomination
        let isStunned = await mba.findEffect(target.actor, "Stunned");
        if (isStunned) return;
        if (!isStunned && !workflow.failedSaves.size) return;
        async function effectMacroDelTarget() {
            let originDoc = await fromUuid(effect.changes[0].value);
            let originEffect = await mbaPremades.helpers.findEffect(originDoc.actor, `${originDoc.name}: Grapple (${token.document.name})`);
            if (originEffect) await mbaPremades.helpers.removeEffect(originEffect);
        };
        let effectDataTarget = {
            'name': `${workflow.token.document.name}: Grapple`,
            'icon': workflow.item.img,
            'origin': workflow.item.uuid,
            'changes': [
                {
                    'key': 'flags.mba-premades.feature.grapple.origin',
                    'mode': 5,
                    'value': workflow.token.document.uuid,
                    'priority': 20
                },
                {
                    'key': 'macro.CE',
                    'mode': 0,
                    'value': "Grappled",
                    'priority': 20
                },
                {
                    'key': 'macro.CE',
                    'mode': 0,
                    'value': "Stunned",
                    'priority': 20
                },
                {
                    'key': 'flags.midi-qol.OverTime',
                    'mode': 0,
                    'value': `actionSave=true, rollType=skill, saveAbility=ath|acr, saveDC=${saveDC}, saveMagic=false, name=Grapple: Action Save (DC${saveDC}), killAnim=true`,
                    'priority': 20
                }
            ],
            'flags': {
                'dae': {
                    'showIcon': false,
                    'specialDuration': ['combatEnd', 'zeroHP']
                },
                'effectmacro': {
                    'onDelete': {
                        'script': mba.functionToString(effectMacroDelTarget)
                    }
                },
                'mba-premades': {
                    'feature': {
                        'grapple': {
                            'originName': workflow.token.document.name
                        }
                    }
                }
            }
        };
        async function effectMacroDelSource() {
            let targetDoc = await fromUuid(effect.flags['mba-premades']?.feature?.grapple?.targetUuid);
            let targetEffect = await mbaPremades.helpers.findEffect(targetDoc.actor, `${token.document.name}: Grapple`);
            if (targetEffect) await mbaPremades.helpers.removeEffect(targetEffect);
            if (mbaPremades.helpers.findEffect(targetDoc.actor, "Stunned")) await mbaPremades.helpers.removeCondition(targetDoc.actor, "Stunned");
        };
        let effectDataSource = {
            'name': `${workflow.token.document.name}: Grapple (${target.document.name})`,
            'icon': workflow.item.img,
            'origin': workflow.item.uuid,
            'flags': {
                'dae': {
                    'specialDuration': ['zeroHP', 'combatEnd']
                },
                'effectmacro': {
                    'onDelete': {
                        'script': mba.functionToString(effectMacroDelSource)
                    }
                },
                'mba-premades': {
                    'feature': {
                        'grapple': {
                            'targetUuid': target.document.uuid
                        }
                    }
                }
            }
        };
        await mba.removeEffect(grappleEffect);
        await new Sequence()

            .effect()
            .file("jb2a.unarmed_strike.no_hit.01.yellow")
            .atLocation(workflow.token)
            .stretchTo(target)
            .playbackRate(0.9)
            .filter("ColorMatrix", { saturate: -1, brightness: 1 })

            .effect()
            .file("jb2a.unarmed_strike.no_hit.01.yellow")
            .atLocation(workflow.token)
            .stretchTo(target)
            .mirrorY()
            .playbackRate(0.9)
            .filter("ColorMatrix", { saturate: -1, brightness: 1 })

            .wait(150)

            .thenDo(async () => {
                await mba.createEffect(target.actor, effectDataTarget);
                await mba.createEffect(workflow.actor, effectDataSource);
            })

            .effect()
            .file("jb2a.markers.chain.standard.complete.02.grey")
            .attachTo(target)
            .scaleToObject(2 * target.document.texture.scaleX)
            .fadeIn(500)
            .fadeOut(1000)
            .opacity(0.8)

            .play()

        return;
    }
    if (mba.checkTrait(target.actor, "ci", "grappled")) return;
    let grapple = false;
    let stun = false;
    if (mba.getSize(target.actor) < 3) grapple = true;
    if (workflow.failedSaves.size) stun = true;
    if (!grapple && !stun) return;
    async function effectMacroDelTarget() {
        let originDoc = await fromUuid(effect.changes[0].value);
        let originEffect = await mbaPremades.helpers.findEffect(originDoc.actor, `${originDoc.name}: Grapple (${token.document.name})`);
        if (originEffect) await mbaPremades.helpers.removeEffect(originEffect);
    };
    let effectDataTarget = {
        'name': `${workflow.token.document.name}: Grapple`,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'changes': [
            {
                'key': 'flags.mba-premades.feature.grapple.origin',
                'mode': 5,
                'value': workflow.token.document.uuid,
                'priority': 20
            },
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Grappled",
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `actionSave=true, rollType=skill, saveAbility=ath|acr, saveDC=${saveDC}, saveMagic=false, name=Grapple: Action Save (DC${saveDC}), killAnim=true`,
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': false,
                'specialDuration': ['combatEnd', 'zeroHP']
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDelTarget)
                }
            },
            'mba-premades': {
                'feature': {
                    'grapple': {
                        'originName': workflow.token.document.name
                    }
                }
            }
        }
    };
    if (stun && !mba.checkTrait(target.actor, "ci", "stunned")) effectDataTarget.changes = effectDataTarget.changes.concat(
        {
            'key': 'macro.CE',
            'mode': 0,
            'value': "Stunned",
            'priority': 20
        },
    );
    async function effectMacroDelSource() {
        let targetDoc = await fromUuid(effect.flags['mba-premades']?.feature?.grapple?.targetUuid);
        let targetEffect = await mbaPremades.helpers.findEffect(targetDoc.actor, `${token.document.name}: Grapple`);
        if (targetEffect) await mbaPremades.helpers.removeEffect(targetEffect);
        if (mbaPremades.helpers.findEffect(targetDoc.actor, "Stunned")) await mbaPremades.helpers.removeCondition(targetDoc.actor, "Stunned");
    };
    let effectDataSource = {
        'name': `${workflow.token.document.name}: Grapple (${target.document.name})`,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'flags': {
            'dae': {
                'specialDuration': ['zeroHP', 'combatEnd']
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDelSource)
                }
            },
            'mba-premades': {
                'feature': {
                    'grapple': {
                        'targetUuid': target.document.uuid
                    }
                }
            }
        }
    };
    await new Sequence()

        .effect()
        .file("jb2a.unarmed_strike.no_hit.01.yellow")
        .atLocation(workflow.token)
        .stretchTo(target)
        .playbackRate(0.9)
        .filter("ColorMatrix", { saturate: -1, brightness: 1 })

        .effect()
        .file("jb2a.unarmed_strike.no_hit.01.yellow")
        .atLocation(workflow.token)
        .stretchTo(target)
        .mirrorY()
        .playbackRate(0.9)
        .filter("ColorMatrix", { saturate: -1, brightness: 1 })

        .wait(150)

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectDataTarget);
            await mba.createEffect(workflow.actor, effectDataSource);
        })

        .effect()
        .file("jb2a.markers.chain.standard.complete.02.grey")
        .attachTo(target)
        .scaleToObject(2 * target.document.texture.scaleX)
        .fadeIn(500)
        .fadeOut(1000)
        .opacity(0.8)

        .play()
}

async function extractBrainCheck({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let type = await mba.raceOrType(target.actor);
    let grappled = await mba.findEffect(target.actor, "Mind Flayer: Grapple");
    let incapacitated = await mba.findEffect(target.actor, "Incapacitated");
    if (type != "humanoid") {
        ui.notifications.warn("Target is not humanoid!");
        return false
    }
    if (!grappled) {
        ui.notifications.warn("Target must be Grappled by Mindflayer!");
        return false
    }
    if (!incapacitated) {
        ui.notifications.warn("Target must be Incapacitated!");
        return false
    }
}

async function extractBrainItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    new Sequence()

        .effect()
        .file("jb2a.energy_attack.01.dark_purple")
        .attachTo(target)
        .scaleToObject(2.5)
        .playbackRate(1.5)
        .waitUntilFinished(-1500)

        .effect()
        .file("jaamod.sequencer_fx_master.blood_splat.red.2")
        .attachTo(target)
        .scaleToObject(1.8)
        .duration(5000)
        .fadeOut(1000)
        .scaleIn(0, 500, { 'ease': 'easeOutCubic' })
        .randomRotation()
        .belowTokens()

        .thenDo(async () => {
            if (target.actor.system.attributes.hp.value < 1) {
                if (mba.findEffect(target.actor, "Unconscious")) await mba.removeCondition(target.actor, 'Unconscious');
                await mba.addCondition(target.actor, 'Dead', true);
            }
        })

        .play();
}

async function mindBlastCast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;
    let targets = Array.from(workflow.targets);

    new Sequence()

        .effect()
        .file("jb2a.detect_magic.cone.purple")
        .attachTo(workflow.token)
        .stretchTo(template)
        .playbackRate(1.5)
        .repeats(5, 200)

        .play()

    for (let target of targets) {
        new Sequence()

            .effect()
            .from(target)
            .attachTo(target)
            .scaleToObject(1, { considerTokenScale: true })
            .duration(5000)
            .fadeIn(100)
            .fadeOut(1000)
            .loopProperty("sprite", "position.x", { from: -0.1, to: 0.1, duration: 55, pingPong: true, gridUnits: true })
            .playbackRate(4)
            .opacity(0.15)
            .zIndex(0.1)

            .play()
    }
}

async function mindBlastItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    async function effectMacroDel() {

    };
    let effectData = {
        'name': "Mind Flayer: Mind Blast",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You were hit by Mind Flayer's Mind Blast and are @UUID[Compendium.mba-premades.MBA SRD.Item.O1gS8bqw9PJTuCAh]{Stunned} for the duration.</p>
            <p>You can repeat the saving throw at the end of each of your turns, ending the effect on a success.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': 'Stunned',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `turn=end, saveAbility=int, saveDC=15, saveMagic=false, name=Stun: Turn End (DC15), killAnim=true`,
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'specialDuration': ['zeroHP']
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };
    for (let target of Array.from(workflow.failedSaves)) {
        new Sequence()

            .thenDo(async () => {
                await mba.createEffect(target.actor, effectData);
            })

            .play()
    }
}

export let mindFlayer = {
    'tentacles': tentacles,
    'extractBrainCheck': extractBrainCheck,
    'extractBrainItem': extractBrainItem,
    'mindBlastCast': mindBlastCast,
    'mindBlastItem': mindBlastItem
}