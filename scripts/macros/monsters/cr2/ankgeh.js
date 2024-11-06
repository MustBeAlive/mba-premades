import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function biteCheck({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let effects = workflow.actor.effects.filter(e => e.name.includes("Ankheg: Grapple") && e.name != "Grappled");
    if (!effects.length) return;
    if (!mba.findEffect(workflow.actor, `${workflow.token.document.name}: Grapple (${target.document.name})`)) {
        ui.notifications.warn("You can only attack grappled target!");
        return false;
    }
    let queueSetup = await queue.setup(workflow.item.uuid, 'ankhegGrapple', 150);
    if (!queueSetup) return;
    workflow.advantage = true;
    workflow.advReminderAttackAdvAttribution.add("ADV: Ankheg Grapple");
    queue.remove(workflow.item.uuid);
}

async function biteItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let target = workflow.targets.first();
    if (mba.findEffect(workflow.actor, `${workflow.token.document.name}: Grapple (${target.document.name})`)) return;
    if (mba.checkTrait(target.actor, "ci", "grappled")) return;
    if (mba.findEffect(target.actor, "Grappled")) return;
    if (mba.findEffect(target.actor, `${workflow.token.document.name}: Grapple`)) return; //overly cautious
    if (mba.getSize(target.actor) > 3) return;
    let saveDC = workflow.item.system.save.dc;
    async function effectMacroDel() {
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
        let targetDoc = await fromUuid(effect.flags['mba-premades']?.feature?.ankheg?.grapple?.targetUuid);
        let targetEffect = await mbaPremades.helpers.findEffect(targetDoc.actor, "Ankheg: Grapple");
        if (targetEffect) await mbaPremades.helpers.removeEffect(targetEffect);
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
                    'ankheg': {
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
        .file("jb2a.bite.400px.red")
        .attachTo(target)
        .scaleToObject(2.5 * target.document.texture.scaleX)

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

async function acidSprayCheck({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effects = workflow.actor.effects.filter(e => e.name.includes("Ankheg: Grapple") && e.name != "Grappled");
    if (effects.length) {
        ui.notifications.warn("You can't use acid spray while grappling someone!");
        return false;
    }
}

async function acidSprayItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;

    new Sequence()

        .effect()
        .file("jb2a.breath_weapons.acid.line.green")
        .attachTo(workflow.token)
        .stretchTo(template)
        .playbackRate(1.6)
        .repeats(2, 700)

        .play()
}

export let ankheg = {
    'biteCheck': biteCheck,
    'biteItem': biteItem,
    'acidSprayCheck': acidSprayCheck,
    'acidSprayItem': acidSprayItem
}