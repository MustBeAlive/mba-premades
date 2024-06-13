import {mba} from "../../../helperFunctions.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    async function effectMacroDel() {
        new Sequence()

            .effect()
            .file("jb2a.shield.01.outro_explode.yellow")
            .attachTo(token)
            .scaleToObject(1.7 * token.document.texture.scaleX)
            .waitUntilFinished(-500)

            .thenDo(async () => {
                Sequencer.EffectManager.endEffects({ name: `${token.document.name} Blade Ward`, object: token })
            })

            .play()
    };
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Until the end of your next turn, you have resistance against bludgeoning, piercing, and slashing damage dealt by weapon attacks.</p>
        `,
        'changes': [
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.bladeWard.item,preTargetDamageApplication',
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
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 0,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };

    new Sequence()

        .wait(500)

        .effect()
        .file("jb2a.shield.01.intro.yellow")
        .attachTo(token)
        .scaleToObject(1.7 * token.document.texture.scaleX)
        .opacity(0.8)
        .playbackRate(0.8)

        .effect()
        .file("jb2a.shield.01.loop.yellow")
        .attachTo(token)
        .scaleToObject(1.7 * token.document.texture.scaleX)
        .delay(600)
        .fadeIn(500)
        .fadeOut(500)
        .opacity(0.8)
        .playbackRate(0.8)
        .persist()
        .name(`${token.document.name} Blade Ward`)

        .thenDo(async () => {
            await mba.createEffect(workflow.actor, effectData)
        })

        .play()
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.item.type != "weapon") return;
    if (workflow.item.system.actionType != 'mwak' && workflow.item.system.actionType != 'rwak') return;
    let type = workflow.item.system.damage.parts[0][1];
    if (type != "piercing" && type != "slashing" && type != "bludgeoning") return;
    let damageTotal = Math.floor(workflow.damageItem.totalDamage / 2);
    workflow.damageItem.appliedDamage = damageTotal;
    workflow.damageItem.hpDamage = damageTotal;
}

export let bladeWard = {
    'cast': cast,
    'item': item
}