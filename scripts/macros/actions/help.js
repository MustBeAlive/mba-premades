import {mba} from "../../helperFunctions.js";

export async function help({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    if (target.id === workflow.token.id) {
        ui.notifications.warn("You can't help yourself!");
        await game.messages.get(workflow.itemCardId).delete();
        return;
    }
    let effect = await mba.findEffect(target.actor, "Help");
    if (effect) {
        ui.notifications.info("Someone is already helping/distracting targeted creature!");
        await game.messages.get(workflow.itemCardId).delete();
        return;
    }
    let originDisposition = workflow.token.document.disposition;
    let animation;
    let changes;
    let description;
    let specialDuration;
    if (originDisposition === target.document.disposition) {
        animation = "jb2a.ui.indicator.green.01.01";
        changes = [
            {
                'key': 'flags.midi-qol.advantage.ability.check.all',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
        ];
        description = "You have advantage on the next ability check you make.";
        specialDuration = ['isCheck', 'isSkill', 'turnStartSource'];
    }
    else {
        animation = "jb2a.ui.indicator.bluegreen.02.01";
        changes = [
            {
                'key': 'flags.midi-qol.grants.advantage.attack.all',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
        ];
        description = "You are distracted. Until the start of distraction source's next turn, first attack roll against you will be made with advantage.";
        specialDuration = ['isAttacked', 'turnStartSource'];
    }
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Help` })
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': description,
        'changes': changes,
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': specialDuration
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };
    new Sequence()

        .effect()
        .file(animation)
        .attachTo(target, { followRotation: false })
        .scaleToObject(1.3 * target.document.texture.scaleX)
        .fadeIn(1000)
        .fadeOut(500)
        .opacity(0.66)
        .playbackRate(0.8)
        .persist()
        .name(`${target.document.name} Help`)

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectData);
        })

        .play();
}