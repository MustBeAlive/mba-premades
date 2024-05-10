import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function item({speaker, actor, token, character, item, args, scope, workflow}) {
    let target = workflow.targets.first();

    new Sequence()

        .wait(500)

        .effect()
        .file("jb2a.impact_themed.heart.pinkyellow")
        .attachTo(target)
        .scaleToObject(1.7 * target.document.texture.scaleX)
        .playbackRate(0.9)

        .play()

    if (mba.raceOrType(target.actor) != "beast") {
        await mba.removeCondition(workflow.actor, 'Concentrating');
        ui.notifications.info('Beast Bond can only affect beasts!');
        return;
    }
    if (target.actor.system.abilities.int.value > 4) {
        await mba.removeCondition(workflow.actor, 'Concentrating');
        ui.notifications.info('Beast Bond can only affect creatures with Intelligence score of 4 or lower!');
        return;
    }
    let casterDisposition = token.document.disposition;
    let targetDisposition = target.document.disposition;
    let isCharmed = mba.findEffect(target.actor, 'Charmed');
    if (casterDisposition < 0) {
        if (targetDisposition > 0 && !isCharmed) {
            await mba.removeCondition(workflow.actor, 'Concentrating');
            ui.notifications.warn('Beast Bond only affects friendly, neutral or charmed creatures!');
            return;
        }
    }
    if (casterDisposition >= 0) {
        if (targetDisposition < 0 && !isCharmed) {
            await mba.removeCondition(workflow.actor, 'Concentrating');
            ui.notifications.warn('Beast Bond only affects friendly, neutral or charmed creatures!');
            return;
        }
    }
    async function effectMacroDel() {
        await Sequencer.EffectManager.endEffects({ name: `${token.document.name} Beast Bond`, object: token })
    };
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Until the spell ends, the link is active while caster of the spell and you are within line of sight of each other.</p>
            <p>Through the link, you can understand caster's telepathic messages, and you can telepathically communicate simple emotions and concepts back to him.</p>
            <p>While the link is active, you have advantage on attack rolls against any creature within 5 feet of caster.</p>
        `,
        'duration': {
            'seconds': 600
        },
        'changes': [
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.beastBond.bonus,preAttackRoll',
                'priority': 20
            }
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 1,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            },
            'mba-premades': {
                'spell': {
                    'beastBond': {
                        'sourceUuid': workflow.token.document.uuid
                    }
                }
            }
        }
    };

    new Sequence()

        .wait(1000)

        .effect()
        .file("animated-spell-effects-cartoon.misc.heart.purple")
        .attachTo(target)
        .scaleToObject(1.7 * target.document.texture.scaleX)

        .effect()
        .file("jb2a.template_circle.symbol.normal.heart.pink")
        .attachTo(target)
        .scaleToObject(1.4 * target.document.texture.scaleX)
        .delay(500)
        .fadeIn(500)
        .fadeOut(1000)
        .mask()
        .persist()
        .name(`${target.document.name} Beast Bond`)

        .thenDo(function () {
            mba.createEffect(target.actor, effectData);
        })

        .play()
}


async function bonus({speaker, actor, token, character, item, args, scope, workflow}) {
    let effect = await mba.findEffect(workflow.actor, "Beast Bond");
    if (!effect) return;
    let sourceUuid = effect.flags['mba-premades']?.spell?.beastBond?.sourceUuid;
    let casterNearby = mba.findNearby(workflow.targets.first(), 5, null, false).filter(i => i.document.uuid === sourceUuid);
    if (!casterNearby.length) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'beastBond', 70);
    if (!queueSetup) return;
    workflow.advantage = true;
    workflow.advReminderAttackAdvAttribution.add("ADV:Beast Bond");
    queue.remove(workflow.item.uuid);
}

export let beastBond = {
    'item': item,
    'bonus': bonus
}