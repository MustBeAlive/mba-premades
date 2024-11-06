import {mba} from "../../helperFunctions.js";

export async function grapple({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.targets.size) return;
    let skipCheck = false;
    let target = workflow.targets.first();
    if (mba.getSize(target.actor) > (mba.getSize(workflow.actor) + 1)) {
        ui.notifications.info("Target is too big to attempt Grapple!");
        return;
    }
    if (mba.findEffect(target.actor, "Incapacitated")) skipCheck = true;
    if (!skipCheck) {
        let options = [
            [`Acrobatics (${target.actor.system.skills.acr.total})`, 'acr'],
            [`Athletics (${target.actor.system.skills.ath.total})`, 'ath'],
            ['Uncontested', false]
        ];
        await mba.playerDialogMessage(mba.firstOwner(target));
        let selection = await mba.remoteDialog(workflow.item.name, options, mba.firstOwner(target).id, `<b>How would you like to contest the Grapple?</b>`);
        await mba.clearPlayerDialogMessage();
        if (selection) {
            let sourceRoll = await workflow.actor.rollSkill("ath");
            let targetRoll = await mba.rollRequest(target, "skill", selection);
            if (targetRoll.total >= sourceRoll.total) return;
        }
    }
    async function effectMacroTurnStart() {
        await ChatMessage.create({
            whisper: ChatMessage.getWhisperRecipients("GM"),
            content: `
                <p>${token.document.name} is grappled and can use its action to attempt an escape.</p>
                <p>To do so, he/she must succeed on a Strength (<u>Athletics</u>) or Dexterity (<u>Acrobatics</u>) check contested by grappler's Strength (<u>Athletics</u>) check.
                <p>In case of a tie, check counts as a failed one.</p>
            `,
            speaker: { alias: "MBA Premades: Grapple Helper" }
        });
    };
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
            }
        ],
        'flags': {
            'dae': {
                'showIcon': false,
                'specialDuration': ['combatEnd']
            },
            'effectmacro': {
                'onTurnStart': {
                    'script': mba.functionToString(effectMacroTurnStart)
                },
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
        .mirrorY()
        .atLocation(workflow.token)
        .stretchTo(target)
        .playbackRate(0.9)
        .filter("ColorMatrix", { saturate: -1, brightness: 1 })
    
        .wait(150)
    
        .effect()
        .file("jb2a.markers.chain.standard.complete.02.grey")
        .attachTo(target)
        .scaleToObject(2 * target.document.texture.scaleX)
        .fadeIn(500)
        .fadeOut(1000)
        .opacity(0.8)

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectDataTarget);
            await mba.createEffect(workflow.actor, effectDataSource);
        })
    
        .play()
}