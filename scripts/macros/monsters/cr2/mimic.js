import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function adhesive({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let target = workflow.targets.first();
    if (mba.findEffect(workflow.actor, `${workflow.token.document.name}: Grapple (${target.document.name})`)) return;
    if (mba.checkTrait(target.actor, "ci", "grappled")) return;
    if (mba.findEffect(target.actor, "Grappled")) return;
    if (mba.findEffect(target.actor, `${workflow.token.document.name}: Grapple`)) return; //overly cautious
    if (mba.getSize(target.actor) > 4) return;
    async function effectMacroDel() {
        let originDoc = await fromUuid(effect.changes[0].value);
        let originEffect = await mbaPremades.helpers.findEffect(originDoc.actor, `${originDoc.name}: Grapple (${token.document.name})`);
        if (originEffect) await mbaPremades.helpers.removeEffect(originEffect);
    };
    let effectDataTarget = {
        'name': `Mimic: Grapple`,
        'icon': "modules/mba-premades/icons/generic/adhesive.webp",
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
                'value': `actionSave=true, rollType=skill, saveAbility=ath|acr, saveDC=13, saveMagic=false, name=Grapple: Action Save (DC13), killAnim=true`,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.disadvantage.skill.ath',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.disadvantage.skill.acr',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
        ],
        'flags': {
            'dae': {
                'showIcon': false,
                'specialDuration': ['combatEnd']
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };
    async function effectMacroDelSource() {
        let targetDoc = await fromUuid(effect.flags['mba-premades']?.feature?.mimic?.grapple?.targetUuid);
        let targetEffect = await mbaPremades.helpers.findEffect(targetDoc.actor, `${token.document.name}: Grapple`);
        if (targetEffect) await mbaPremades.helpers.removeEffect(targetEffect);
    };
    let effectDataSource = {
        'name': `${workflow.token.document.name}: Grapple (${target.document.name})`,
        'icon': "modules/mba-premades/icons/generic/adhesive.webp",
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
                    'mimic': {
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
        .file("jb2a.unarmed_strike.magical.02.green")
        .atLocation(workflow.token)
        .stretchTo(target)
        .playbackRate(0.9)

        .effect()
        .file("jb2a.unarmed_strike.magical.02.green")
        .atLocation(workflow.token)
        .stretchTo(target)
        .mirrorY()
        .playbackRate(0.9)

        .wait(150)

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectDataTarget);
            await mba.createEffect(workflow.actor, effectDataSource);
        })

        .effect()
        .file("jb2a.markers.chain.spectral_standard.complete.02.green")
        .attachTo(target)
        .scaleToObject(2 * target.document.texture.scaleX)
        .fadeIn(500)
        .fadeOut(1000)
        .opacity(0.8)

        .play()
}

async function adhesivePassive(workflow) {
    if (!constants.meleeAttacks.includes(workflow.item.system.actionType)) return;
    if (!workflow.hitTargets.size) return;
    if (mba.findEffect(workflow.actor, "Mimic: Grapple")) return;
    if (workflow.targets.first().name != "Mimic") return;
    if (mba.checkTrait(workflow.actor, "ci", "grappled")) return;
    if (mba.findEffect(workflow.actor, "Grappled")) return;
    if (mba.getSize(workflow.actor) > 4) return;
    let mimic = workflow.targets.first();
    async function effectMacroDel() {
        let originDoc = await fromUuid(effect.changes[0].value);
        let originEffect = await mbaPremades.helpers.findEffect(originDoc.actor, `${originDoc.name}: Grapple (${token.document.name})`);
        if (originEffect) await mbaPremades.helpers.removeEffect(originEffect);
    };
    let effectDataTarget = {
        'name': `Mimic: Grapple`,
        'icon': "modules/mba-premades/icons/generic/adhesive.webp",
        'changes': [
            {
                'key': 'flags.mba-premades.feature.grapple.origin',
                'mode': 5,
                'value': mimic.document.uuid,
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
                'value': `actionSave=true, rollType=skill, saveAbility=ath|acr, saveDC=13, saveMagic=false, name=Grapple: Action Save (DC13), killAnim=true`,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.disadvantage.skill.ath',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.disadvantage.skill.acr',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
        ],
        'flags': {
            'dae': {
                'showIcon': false,
                'specialDuration': ['combatEnd']
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };
    async function effectMacroDelSource() {
        let targetDoc = await fromUuid(effect.flags['mba-premades']?.feature?.mimic?.grapple?.targetUuid);
        let targetEffect = await mbaPremades.helpers.findEffect(targetDoc.actor, `${token.document.name}: Grapple`);
        if (targetEffect) await mbaPremades.helpers.removeEffect(targetEffect);
    };
    let effectDataSource = {
        'name': `${mimic.document.name}: Grapple (${workflow.token.document.name})`,
        'icon': "modules/mba-premades/icons/generic/adhesive.webp",
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
                    'mimic': {
                        'grapple': {
                            'targetUuid': workflow.token.document.uuid
                        }
                    }
                }
            }
        }
    };
    await new Sequence()

        .effect()
        .file("jb2a.unarmed_strike.magical.02.green")
        .atLocation(mimic)
        .stretchTo(workflow.token)
        .playbackRate(0.9)

        .effect()
        .file("jb2a.unarmed_strike.magical.02.green")
        .atLocation(mimic)
        .stretchTo(workflow.token)
        .mirrorY()
        .playbackRate(0.9)

        .wait(150)

        .thenDo(async () => {
            await mba.createEffect(workflow.actor, effectDataTarget);
            await mba.createEffect(mimic.actor, effectDataSource);
        })

        .effect()
        .file("jb2a.markers.chain.spectral_standard.complete.02.green")
        .attachTo(workflow.token)
        .scaleToObject(2 * workflow.token.document.texture.scaleX)
        .fadeIn(500)
        .fadeOut(1000)
        .opacity(0.8)

        .play()
}

async function grappler({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!mba.findEffect(workflow.targets.first().actor, "Mimic: Grapple")) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'grappler', 150);
    if (!queueSetup) return;
    workflow.advantage = true;
    workflow.advReminderAttackAdvAttribution.add("ADV:Grappler");
    queue.remove(workflow.item.uuid);
}

export let mimic = {
    'adhesive': adhesive,
    'adhesivePassive': adhesivePassive,
    'grappler': grappler
}