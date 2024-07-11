import {mba} from "../../../helperFunctions.js";

async function tendril({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let target = workflow.targets.first();
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
        'name': "Roper: Grapple",
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
                'value': "Restrained",
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.disadvantage.ability.check.str',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.disadvantage.ability.save.str',
                'mode': 2,
                'value': 1,
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
        let targetDoc = await fromUuid(effect.flags['mba-premades']?.feature?.roper?.grapple?.targetUuid);
        let targetEffect = await mbaPremades.helpers.findEffect(targetDoc.actor, `${token.document.name}: Grapple`);
        if (targetEffect) await mbaPremades.helpers.removeEffect(targetEffect);
    };
    let effectDataSource = {
        'name': `Roper: Grapple (${target.document.name})`,
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
                    'roper': {
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
        .file("jb2a.template_line_piercing.generic.01.orange")
        .atLocation(workflow.token)
        .stretchTo(target)
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
        let targetDoc = await fromUuid(effect.flags['mba-premades']?.feature?.roper?.grapple?.targetUuid);
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
            .file("jb2a.template_line_piercing.generic.01.orange")
            .atLocation(target)
            .stretchTo(workflow.token)
            .playbackRate(0.9)
            .filter("ColorMatrix", { saturate: -1, brightness: 1 })

            .wait(50)

            .thenDo(async () => {
                mba.pushToken(workflow.token, target, -ammount);
            })

            .play()
    }
}

export let roper = {
    'tendril': tendril,
    'reel': reel
}