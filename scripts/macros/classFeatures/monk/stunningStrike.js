import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function trigger({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.hitTargets.size != 1 || workflow.item?.system?.actionType != 'mwak') return;
    let target = workflow.targets.first();
    if (target.actor.system.attributes.hp.value < 1) return;
    //if (mba.findEffect(target.actor, "Stunning Strike")) return; // leave the promt in case "I want to update the duration" or somewhat
    let feature = mba.getItem(workflow.actor, 'Stunning Strike');
    if (!feature) return;
    let kiItem = mba.getItem(workflow.actor, 'Ki Points');
    if (!kiItem) return;
    let kiPoints = kiItem.system.uses.value;
    if (kiPoints < 1) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'stunningStrike', 450);
    if (!queueSetup) return;
    await mba.playerDialogMessage(game.user);
    let selection = await mba.dialog("Stunning Strike", constants.yesNo, `<b>Use Stunning Strike? (Ki Points left: ${kiPoints})</b>`);
    await mba.clearPlayerDialogMessage();
    if (!selection) {
        queue.remove(workflow.item.uuid);
        return;
    }
    await warpgate.wait(100);
    let options = {
        'targetUuids': [target.document.uuid]
    };
    await kiItem.update({ 'system.uses.value': kiPoints -= 1 });
    await MidiQOL.completeItemUse(feature, {}, options);
    queue.remove(workflow.item.uuid);
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let oldEffect = await mba.findEffect(target.actor, "Stunning Strike");
    if (oldEffect && workflow.failedSaves.size) await mba.removeEffect(oldEffect);
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Stunning Strike` })
    };
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are stunned until the end of Monk's next turn.</p>
        `,
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Stunned",
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['turnEndSource']
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };
    let monkLevel = workflow.actor.classes.monk?.system?.levels;
    if (!monkLevel) {
        ui.notifications.warn("Actor has no Monk levels!");
        return;
    }
    let animation1 = "jb2a.unarmed_strike.physical.01.yellow";
    if (monkLevel >= 6) animation1 = "jb2a.unarmed_strike.physical.01.yellow"
    new Sequence()

        .effect()
        .file(animation1)
        .attachTo(token)
        .stretchTo(target)
        .filter("ColorMatrix", { hue: 325 })
        .waitUntilFinished(-500)

        .effect()
        .file("jb2a.dizzy_stars.400px.red")
        .attachTo(target)
        .scaleToObject(1.6)
        .playbackRate(0.9)
        .playIf(() => {
            return workflow.failedSaves.size
        })

        .effect()
        .file("jb2a.icon.stun.purple")
        .attachTo(target)
        .scaleToObject(1.2)
        .fadeIn(1000)
        .fadeOut(200)
        .filter("ColorMatrix", { hue: 80 })
        .playbackRate(0.85)
        .persist()
        .name(`${target.document.name} Stunning Strike`)
        .playIf(() => {
            return workflow.failedSaves.size
        })

        .thenDo(async () => {
            if (workflow.failedSaves.size) {
                await mba.createEffect(target.actor, effectData);
            }
        })

        .play()
}

export let stunningStrike = {
    'trigger': trigger,
    'item': item
}