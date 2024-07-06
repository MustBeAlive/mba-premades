import {mba} from "../../../helperFunctions.js";

export async function poi60({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let target = workflow.targets.first();
    if (target.actor.system.attributes.hp.value > 0) return;
    if (mba.checkTrait(target.actor, "ci", "poisoned")) return;
    if (mba.findEffect(target.actor, `${workflow.token.document.name}: Poison`)) return;
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Poison` })
    };
    let effectData = {
        'name': `${workflow.token.document.name}: Poison`,
        'icon': "modules/mba-premades/icons/generic/generic_poison.webp",
        'origin': workflow.item.uuid,
        'description': `
            <p>You've been @UUID[Compendium.mba-premades.MBA SRD.Item.pAjPUbk2oPUTfva2]{Poisoned} by ${workflow.token.document.name}.</p>
            <p>You are stable, but @UUID[Compendium.mba-premades.MBA SRD.Item.pAjPUbk2oPUTfva2]{Poisoned} for the duration (even after regaining hit points) and are @UUID[Compendium.mba-premades.MBA SRD.Item.jooSbuYlWEhaNpIi]{Paralyzed} while @UUID[Compendium.mba-premades.MBA SRD.Item.pAjPUbk2oPUTfva2]{Poisoned} in this way.</p>
        `,
        'duration': {
            'seconds': 3600
        },
        'changes': [
            {
                'key': "macro.CE",
                'mode': 0,
                'value': "Poisoned",
                'priority': 20
            },
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Paralyzed",
                'priority': 20
            },
            {
                'key': 'system.attributes.death.success',
                'mode': 5,
                'value': 3,
                'priority': 20
            }
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
        .name(`${target.document.name} Poison`)

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectData)
        })

        .play()
}