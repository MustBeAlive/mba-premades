import {mba} from "../../../helperFunctions.js";

async function sleepBreath({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} KamSle` })
    }
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You succumbed to Kamadan's sleep breath and fell asleep.</p>
            <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.kIUR1eRcTTtaMFao]{Unconscious} until you take damage, or someone uses it's action to shake you awake.</p>
        `,
        'duration': {
            'seconds': 600
        },
        'changes': [
            {
                'key': "macro.CE",
                'mode': 0,
                'value': "Unconscious",
                'priority': 20
            },
        ],
        'flags': {
            'dae': {
                'specialDuration': ["isDamaged"]
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };
    for (let target of Array.from(workflow.failedSaves)) {
        await new Sequence()

            .effect()
            .file("jb2a.sleep.symbol.dark_orangepurple")
            .atLocation(target)
            .attachTo(target, { followRotation: false, bindAlpha: false })
            .scaleToObject(1.5 * target.document.texture.scaleX)
            .fadeOut(1000)
            .scaleIn(0, 500, { ease: "easeOutQuint" })
            .persist()
            .name(`${target.document.name} KamSle`)

            .thenDo(async () => {
                await mba.createEffect(target.actor, effectData);
            })

            .play();
    }
}

export let kamadan = {
    'sleepBreath': sleepBreath
}