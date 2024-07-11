import {mba} from "../../../helperFunctions.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    async function effectMacroDel() {
        new Sequence()

            .effect()
            .file("jb2a.shield.01.outro_explode.blue")
            .attachTo(token)
            .scaleToObject(1.7 * token.document.texture.scaleX)
            .waitUntilFinished(-500)

            .thenDo(async () => {
                Sequencer.EffectManager.endEffects({ name: `${token.document.name} Shield` });
            })

            .play()
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Until the start of your next turn, you have a +5 bonus to AC and you take no damage from Magic Missile.</p>
        `,
        'changes': [
            {
                'key': 'system.attributes.ac.bonus',
                'mode': 2,
                'value': '+5',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.shield.trigger,preTargetDamageApplication',
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['turnStart', 'combatEnd']
            },
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
            }
        }
    };
    new Sequence()

        .wait(500)

        .effect()
        .file("jb2a.shield.01.intro.blue")
        .attachTo(workflow.token)
        .scaleToObject(1.7 * workflow.token.document.texture.scaleX)
        .opacity(0.8)
        .playbackRate(0.8)

        .effect()
        .file("jb2a.shield.01.loop.blue")
        .attachTo(workflow.token)
        .scaleToObject(1.7 * workflow.token.document.texture.scaleX)
        .delay(600)
        .fadeIn(500)
        .opacity(0.8)
        .playbackRate(0.8)
        .persist()
        .name(`${workflow.token.document.name} Shield`)

        .thenDo(async () => {
            await mba.createEffect(workflow.actor, effectData)
        })

        .play()
}

async function trigger({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.item.name.includes("Magic Missile: Bolt")) return;
    workflow.damageItem.hpDamage = 0;
}

export let shield = {
    'item': item,
    'trigger': trigger
}