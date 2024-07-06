import {mba} from "../../../helperFunctions.js";

async function poison({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    if (!workflow.failedSaves.size) return;
    let target = workflow.targets.first();
    if (mba.checkTrait(target.actor, "ci", "poisoned")) return;
    if (mba.findEffect(target.actor, "Erinyes: Poison")) return;
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} EriPoi` })
    };
    const effectData = {
        'name': `Erinyes: Poison`,
        'icon': "modules/mba-premades/icons/generic/generic_poison.webp",
        'origin': workflow.item.uuid,
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Poisoned",
                'priority': 20
            },
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };
    new Sequence()

        .effect()
        .file("jb2a.smoke.puff.centered.green.2")
        .attachTo(target)
        .scaleToObject(2 * target.document.texture.scaleX)

        .effect()
        .file("jb2a.template_circle.symbol.normal.poison.dark_green")
        .attachTo(target)
        .scaleToObject(1 * target.document.texture.scaleX)
        .delay(500)
        .fadeIn(500)
        .fadeOut(500)
        .randomRotation()
        .mask(target)
        .persist()
        .name(`${target.document.name} EriPoi`)

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectData)
        })

        .play()
}

export let erinyes = {
    'poison': poison
}