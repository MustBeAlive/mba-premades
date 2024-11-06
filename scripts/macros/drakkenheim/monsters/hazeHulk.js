import {mba} from "../../../helperFunctions.js";

async function hurlFlesh({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;

    new Sequence()

        .effect()
        .file("jb2a.fireball.beam.dark_purple")
        .attachTo(workflow.token)
        .stretchTo(template)

        .effect()
        .file("jb2a.particles.outward.purple.01.04")
        .atLocation(workflow.token)
        .rotateTowards(template, { cacheLocation: true })
        .scaleToObject(2)
        .duration(5000)
        .fadeIn(500)
        .fadeOut(500)
        .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 3000 })
        .scaleOut(0, 5000, { ease: "easeOutQuint", delay: -3000 })
        .anchor({ x: 0.5 })
        .zIndex(1)

        .sound()
        .file("modules/dnd5e-animations/assets/sounds/Damage/Fire/fire-blast-binaural-1.mp3")
        .fadeInAudio(500)
        .fadeOutAudio(500)
        .volume(0.4)
        .waitUntilFinished()

        .effect()
        .file("jb2a.fireball.explosion.dark_purple")
        .attachTo(template)
        .size(4.8, { gridUnits: true })
        .scaleIn(0, 500, { ease: "easeOutQuint" })
        .zIndex(2)

        .sound()
        .file("modules/dnd5e-animations/assets/sounds/Damage/Fire/fire-flamethrower-2.mp3")
        .fadeInAudio(500)
        .fadeOutAudio(1000)
        .volume(0.2)

        .effect()
        .file("jb2a.ground_cracks.purple.01")
        .attachTo(template)
        .size(4, { gridUnits: true })
        .delay(1400)
        .duration(5000)
        .fadeOut(3000)
        .zIndex(0.1)
        .randomRotation()
        .belowTokens()
        .persist()

        .play();
}

async function lashingTendril({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let target = workflow.targets.first();
    if (mba.getSize(target.actor) > 3) return;
    if (mba.checkTrait(target.actor, "ci", "grappled")) return;
    if (mba.findEffect(target.actor, "Grappled")) return;
    if (mba.findEffect(target.actor, `${workflow.token.document.name}: Grapple`)) return; //overly cautious
    let saveDC = workflow.item.system.save.dc;
    async function effectMacroDelTarget() {
        let originDoc = await fromUuid(effect.changes[0].value);
        let originEffect = await mbaPremades.helpers.findEffect(originDoc.actor, `${originDoc.name}: Grapple (${token.document.name})`);
        if (originEffect) await mbaPremades.helpers.removeEffect(originEffect);
    };
    let effectDataTarget = {
        'name': "Haze Hulk: Grapple",
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
                'specialDuration': ['combatEnd']
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
        let targetDoc = await fromUuid(effect.flags['mba-premades']?.feature?.hazeHulk?.grapple?.targetUuid);
        let targetEffect = await mbaPremades.helpers.findEffect(targetDoc.actor, `${token.document.name}: Grapple`);
        if (targetEffect) await mbaPremades.helpers.removeEffect(targetEffect);
    };
    let effectDataSource = {
        'name': `Haze Hulk: Grapple (${target.document.name})`,
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
                    'hazeHulk': {
                        'grapple': {
                            'targetUuid': target.document.uuid
                        }
                    }
                }
            }
        }
    };
    await new Sequence()

        .effect()
        .file("jb2a.template_line_piercing.void.01.purple")
        .atLocation(workflow.token)
        .stretchTo(target)
        .playbackRate(0.9)

        .wait(150)

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectDataTarget);
            await mba.createEffect(workflow.actor, effectDataSource);
        })

        .effect()
        .file("jb2a.markers.chain.standard.complete.02.purple")
        .attachTo(target)
        .scaleToObject(2)
        .fadeIn(500)
        .fadeOut(1000)
        .opacity(0.8)

        .play()
}

async function reel({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effects = workflow.actor.effects.filter(i => i.name.includes("Grapple"));
    if (!effects.length) {
        ui.notifications.warn("Unable to find grapple origin effects!");
        return;
    }
    let targets = [];
    for (let effect of effects) {
        let targetDoc = await fromUuid(effect.flags['mba-premades']?.feature?.hazeHulk?.grapple?.targetUuid);
        targets.push(targetDoc.object);
    }
    if (!targets.length) return;
    for (let target of targets) {
        let ammount;
        let distance = await mba.getDistance(workflow.token, target, true);
        if (distance >= 30) ammount = 25;
        else ammount = distance - 5;
        new Sequence()

            .effect()
            .file("jb2a.template_line_piercing.void.01.purple")
            .atLocation(target)
            .stretchTo(workflow.token)
            .playbackRate(0.9)

            .wait(50)

            .thenDo(async () => {
                mba.pushToken(workflow.token, target, -ammount);
            })

            .play()
    }
}

export let hazeHulk = {
    'hurlFlesh': hurlFlesh,
    'lashingTendril': lashingTendril,
    'reel': reel
}