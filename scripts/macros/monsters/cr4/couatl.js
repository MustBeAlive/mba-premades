import {mba} from "../../../helperFunctions.js";

async function poi24({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    if (!workflow.failedSaves.size) return;
    let target = workflow.targets.first();
    if (mba.checkTrait(target.actor, "ci", "poisoned")) return;
    if (mba.findEffect(target.actor, "Couatl: Poison")) return;
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} CouPo` })
    };
    const effectData = {
        'name': "Couatl: Poison",
        'icon': "modules/mba-premades/icons/generic/generic_poison.webp",
        'origin': workflow.item.uuid,
        'description': `
            <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.pAjPUbk2oPUTfva2]{Poisoned} by Couatl and are @UUID[Compendium.mba-premades.MBA SRD.Item.kIUR1eRcTTtaMFao]{Unconscious} for the duration, or until another creature uses an action to shake you awake.</p>
        `,
        'duration': {
            'seconds': 86400
        },
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
        .name(`${target.document.name} CouPo`)

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectData);
            await mba.addCondition(target.actor, "Unconscious");
            let effect = await mba.findEffect(target.actor, "Unconscious");
            if (!effect) return;
            let updates = {
                'flags': {
                    'dae': {
                        'specialDuration': ['isDamaged']
                    }
                }
            };
            await mba.updateEffect(effect, updates);
        })

        .play()
}

export let couatl = {
    'poi24': poi24
}