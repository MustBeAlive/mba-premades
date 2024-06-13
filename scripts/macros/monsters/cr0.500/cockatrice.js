import {mba} from "../../../helperFunctions.js";

async function petrification({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let target = workflow.targets.first();
    if (mba.checkTrait(target.actor, "ci", "petrified")) return;
    if (mba.findEffect(target.actor, "Petrified")) return; //just overly cautious
    if (mba.findEffect(target.actor, "Cockatrice: Petrifying Bite")) return;
    if (mba.findEffect(target.actor, "Cockatrice: Petrification")) return;
    async function effectMacroDel() {
        let saveRoll = await mbaPremades.helpers.rollRequest(token, "save", "con");
        if (saveRoll.total >= 11) {
            await mbaPremades.helpers.removeEffect(effect);
            return;
        }
        async function effectMacroDel() {
            Sequencer.EffectManager.endEffects({ name: `${token.document.name} Cockatrice Petrification`, object: token })
        }
        const effectData = {
            'name': "Cockatrice: Petrification",
            'icon': "modules/mba-premades/icons/conditions/muddy.webp",
            'description': "You failed second saving throw and have turned into stone.",
            'duration': {
                'seconds': 86400
            },
            'changes': [
                {
                    'key': 'macro.CE',
                    'mode': 0,
                    'value': "Petrified",
                    'priority': 20
                }
            ],
            'flags': {
                'effectmacro': {
                    'onDelete': {
                        'script': mbaPremades.helpers.functionToString(effectMacroDel)
                    }
                }
            }
        };
        new Sequence()

            .effect()
            .from(token)
            .atLocation(token)
            .mask(token)
            .opacity(0.4)
            .filter("ColorMatrix", { contrast: 1, saturate: -1 })
            .filter("Glow", { color: 0x000000, distance: 3, outerStrength: 4 })
            .attachTo(token)
            .fadeIn(3000)
            .fadeOut(1000)
            .duration(5000)
            .zIndex(1)
            .persist()
            .name(`${token.document.name} Cockatrice Petrification`)

            .effect()
            .file("https://i.imgur.com/4P2tITB.png")
            .atLocation(token)
            .mask(token)
            .opacity(1)
            .filter("Glow", { color: 0x000000, distance: 3, outerStrength: 4 })
            .zIndex(0)
            .fadeIn(3000)
            .fadeOut(1000)
            .duration(5000)
            .attachTo(token)
            .persist()
            .name(`${token.document.name} Cockatrice Petrification`)

            .thenDo(async () => {
                await mbaPremades.helpers.createEffect(actor, effectData);
            })

            .play()
    }
    const effectData = {
        'name': "Cockatrice: Petrifying Bite",
        'icon': "modules/mba-premades/icons/conditions/muddy.webp",
        'description': `
            <p>You are restrained as you begin to magically turn into stone.</p>
            <p>At the end of your next turn you must repeat the saving throw.</p>
            <p>On a success, the effect ends. On a failure, you are petrified.</p>
        `,
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Restrained",
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['turnEnd']
            },
            'effectmacro': {
                'onTurnEnd': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };
    await mba.createEffect(target.actor, effectData);
}

export let cockatrice = {
    'petrification': petrification
}