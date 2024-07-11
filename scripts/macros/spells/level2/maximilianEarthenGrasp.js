import {mba} from "../../../helperFunctions.js";
import {tashaSummon} from "../../generic/tashaSummon.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let sourceActor = game.actors.getName("MBA: Maximilian's Earthen Grasp");
    if (!sourceActor) {
        ui.notifications.warn("Missing actor in the side panel! (MBA: Maximilian's Earthen Grasp)");
        return;
    }
    let tokenName = `${workflow.token.document.name} Maximilian's Earthen Grasp`;
    let crushData = await mba.getItemFromCompendium('mba-premades.MBA Summon Features', 'MEG: Crush', false);
    if (!crushData) {
        ui.notifications.warn('Missing summon feature in the module compendium! (MEG: Crush)');
        return;
    }
    crushData.system.save.dc = mba.getSpellDC(workflow.item);
    let updates = {
        'actor': {
            'prototypeToken': {
                'disposition': workflow.token.document.disposition,
                'name': tokenName,
            },
        },
        'token': {
            'disposition': workflow.token.document.disposition,
            'name': tokenName,
        },
        'embedded': {
            'Item': {
                [crushData.name]: crushData,
            }
        }
    };
    await tashaSummon.spawn(sourceActor, updates, 60, workflow.item, 30, workflow.token, "earth", {}, workflow.castData.castLevel);
}

async function attack({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = await mba.findEffect(workflow.actor, "MEG: Holding Creature")
    if (effect) {
        let oldTarget = await fromUuid(effect.flags['mba-premades']?.spell?.maximilianEarthenGrasp?.targetUuid);
        let targetEffect = await mba.findEffect(oldTarget.actor, "MEG: Restrained");
        if (targetEffect) {
            await mba.removeEffect(effect);
            await mba.removeEffect(targetEffect);
        }
    }
    let target = workflow.targets.first();
    async function effectMacroEveryTurn() {
        if (origin) return;
        let restEffect = await mbaPremades.helpers.findEffect(actor, "MEG: Restrained");
        await mbaPremades.helpers.removeEffect(restEffect);
    };
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} MEG` })
    };
    const effectDataTarget = {
        'name': "MEG: Restrained",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are restrained by a hand made from soil.</p>
            <p>You can use your action to make a Strength ability check. On a success, you escape and is no longer restrained by the hand.</p>
        `,
        'changes': [
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `actionSave=true, rollType=check, saveAbility=str, saveDC=${workflow.item.system.save.dc}, saveMagic=true, name=Restain: Action Save, killAnim=true`,
                'priority': 20
            },
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Restrained",
                'priority': 20
            },
        ],
        'flags': {
            'dae': {
                'showIcon': true
            },
            'effectmacro': {
                'onEachTurn': {
                    'script': mba.functionToString(effectMacroEveryTurn)
                },
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };
    const effectDataSource = {
        'name': "MEG: Holding Creature",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'flags': {
            'mba-premades': {
                'spell': {
                    'maximilianEarthenGrasp': {
                        'targetUuid': target.document.uuid
                    }
                }
            }
        }
    };

    new Sequence()

        .effect()
        .file("jb2a.impact.earth.01.browngreen.0")
        .attachTo(target)
        .scaleToObject(1.7 * target.document.texture.scaleX)

        .thenDo(async () => {
            if (workflow.failedSaves.size) {
                await mba.createEffect(target.actor, effectDataTarget);
                await mba.createEffect(workflow.actor, effectDataSource);
            }
        })

        .effect()
        .file("jb2a.markers.chain.standard.loop.02.yellow")
        .attachTo(target)
        .scaleToObject(2 * target.document.texture.scaleX)
        .fadeIn(500)
        .fadeOut(1000)
        .filter("ColorMatrix", { hue: 350 })
        .playbackRate(0.9)
        .persist()
        .name(`${target.document.name} MEG`)
        .playIf(() => {
            return workflow.failedSaves.size
        })

        .play()
}

export let maximilianEarthenGrasp = {
    'item': item,
    'attack': attack
}