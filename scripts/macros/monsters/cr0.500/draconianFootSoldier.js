import {mba} from "../../../helperFunctions.js";

async function petrificationCast(token, origin) {
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
        .name(`${token.document.name} Petrification`)

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
        .name(`${token.document.name} Petrification`)

        .effect()
        .file("jaamod.smoke.poison_cloud")
        .attachTo(token)
        .scaleIn(0, 1500, { ease: "easeOutCubic" })
        .scaleOut(0, 1500, { ease: "linear" })
        .fadeIn(200)
        .fadeOut(1000)
        .zIndex(2)
        .filter("ColorMatrix", { hue: 295 })
        .playbackRate(0.7)
        .size(3.5, { gridUnits: true })

        .effect()
        .delay(1500)
        .file("jb2a.fog_cloud.02.green02")
        .attachTo(token)
        .fadeIn(1500)
        .fadeOut(1500)
        .opacity(0.7)
        .zIndex(1)
        .randomRotation()
        .scaleOut(0, 1500, { ease: "linear" })
        .scaleIn(0, 1500, { ease: "easeOutCubic" })
        .size(3.8, { gridUnits: true })
        .duration(10000)
        .name(`${token.document.name} Petrification`)

        .thenDo(async () => {
            await origin.use();
        })

        .play()
}

async function petrificationItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let targets = Array.from(workflow.failedSaves);
    for (let target of targets) {
        if (mba.checkTrait(target.actor, "ci", "petrified")) continue;
        if (mba.findEffect(target.actor, "Draconian Foot Soldier: Death Throes")) continue;
        if (mba.findEffect(target.actor, "Draconian Foot Soldier: Petrification")) continue;
        async function effectMacroTurnEnd() {
            let effect = await mbaPremades.helpers.findEffect(actor, "Draconian Foot Soldier: Death Throes");
            if (!effect) return;
            let saveRoll = await mbaPremades.helpers.rollRequest(token, "save", "con");
            if (saveRoll.total >= 11) {
                await mbaPremades.helpers.removeEffect(effect);
                return;
            }
            async function effectMacroDel() {
                Sequencer.EffectManager.endEffects({ name: `${token.document.name} DFS Petrification`, object: token })
            }
            const effectData = {
                'name': "Draconian Foot Soldier: Petrification",
                'icon': "assets/library/icons/sorted/conditions/muddy.png",
                'description': "You failed second saving throw and have turned into stone.",
                'duration': {
                    'seconds': 60
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
                .name(`${token.document.name} DFS Petrification`)

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
                .name(`${token.document.name} DFS Petrification`)

                .thenDo(async () => {
                    await mbaPremades.helpers.removeEffect(effect);
                    await mbaPremades.helpers.createEffect(actor, effectData);
                })

                .play()
        }
        const effectData = {
            'name': "Draconian Foot Soldier: Death Throes",
            'icon': "assets/library/icons/sorted/conditions/muddy.png",
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
                    'showIcon': true
                },
                'effectmacro': {
                    'onTurnEnd': {
                        'script': mba.functionToString(effectMacroTurnEnd)
                    }
                }
            }
        };
        await mba.createEffect(target.actor, effectData);
    }
}

export let draconianFootSoldier = {
    'petrificationCast': petrificationCast,
    'petrificationItem': petrificationItem
}