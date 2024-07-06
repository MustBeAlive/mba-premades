import {mba} from "../../../helperFunctions.js";

async function poison({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let target = workflow.targets.first();
    if (mba.checkTrait(target.actor, "ci", "poisoned")) return;
    if (mba.findEffect(target.actor, "Quasit: Poison")) return;
    let saveDC = workflow.item.system.save.dc;
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Quasit Poison` })
    };
    const effectData = {
        'name': `Quasit: Poison`,
        'icon': "modules/mba-premades/icons/generic/generic_poison.webp",
        'origin': workflow.item.uuid,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Poisoned",
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `turn=end, saveAbility=con, saveDC=${saveDC}, saveMagic=false, name=Poison: Turn End (DC${saveDC}), killAnim=true`,
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': false
            },
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
        .name(`${target.document.name} Quasit Poison`)

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectData)
        })

        .play()
}

async function scare({ speaker, actor, token, character, item, args, scope, workflow }) { // FIX: does not make the save at disadvantage if quasit is within line of sight
    if (!workflow.failedSaves.size) return;
    let target = workflow.targets.first();
    if (mba.checkTrait(target.actor, "ci", "frightened")) return;
    if (mba.findEffect(target.actor, "Quasit: Scare")) return;
    let effectData = {
        'name': "Quasit: Scare",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.oR1wUvem3zVVUv5Q]{Frightened} by Quasit's scary presence for the duration.</p>
            <p>At the end of each of your turns, you can repeat the save, with disadvantage if the Quasit is within your line of sight.</p>
            <p>On a success, the effect ends.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Frightened",
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `turn=end, saveAbility=wis, saveDC=10, saveMagic=false, name=Fear: Turn End (DC 10), killAnim=true`,
                'priority': 20
            }
        ],
    };
    await mba.createEffect(target.actor, effectData);
}


async function shapechanger({ speaker, actor, token, character, item, args, scope, workflow }) {
    let oldEffect = await mba.findEffect(workflow.actor, "Shapechanger");
    if (oldEffect) await mba.removeEffect(oldEffect);
    let choices = [
        ["Bat (10 walk, 40 fly)", "bat", "modules/mba-bestiary/tokens/CR____0/bat/v1/bat_tiny_beast_01.webp"],
        ["Centipede (40 walk, 40 climb", "centipede", "modules/mba-bestiary/tokens/CR__0.25/giant%20centipede/v1/giant_centipede_small_beast_01.webp"],
        ["Toad (40 walk, 40 swim)", "toad", "modules/mba-bestiary/tokens/CR____0/frog/v1/frog_tiny_beast_01.webp"]
    ];
    let selection = await mba.selectImage("Quasit: Shapechanger", choices, "<b>Choose form to assume:</b>", "both");
    if (!selection) return;
    let tokenPath = selection[1];
    let changes;
    let offset;
    let scale;
    switch (selection[0]) {
        case "bat": {
            changes = [
                {
                    'key': 'system.attributes.movement.walk',
                    'mode': 5,
                    'value': 10,
                    'priority': 20
                },
                {
                    'key': 'system.attributes.movement.fly',
                    'mode': 5,
                    'value': 40,
                    'priority': 20
                },
            ];
            offset = 135;
            scale = 1.3;
            break;
        }
        case "centipede": {
            changes = [
                {
                    'key': 'system.attributes.movement.climb',
                    'mode': 5,
                    'value': 40,
                    'priority': 20
                },
            ];
            offset = 45;
            scale = 1;
            break;
        }
        case "toad": {
            changes = [
                {
                    'key': 'system.attributes.movement.swim',
                    'mode': 5,
                    'value': 40,
                    'priority': 20
                },
            ];
            offset = 135;
            scale = 3;
            break;
        }
    }
    async function effectMacroDel() {
        new Sequence()

            .animation()
            .on(token)
            .opacity(1)

            .play();

        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Shapechanger`, object: token })
        await warpgate.revert(token.document, "Shapechanger");
    };
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'changes': changes,
        'flags': {
            'dae': {
                'showIcon': true
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
        }
    };
    let updates = {
        'token': {
            'flags': {
                'autorotate': {
                    'enabled': true,
                    'offset': offset,
                },
                'image-hover': {
                    'specificArt': tokenPath
                }
            },
        },
        'embedded': {
            'ActiveEffect': {
                [effectData.name]: effectData
            }
        },
    };
    let options = {
        'permanent': false,
        'name': 'Shapechanger',
        'description': 'Shapechanger'
    };
    new Sequence()

        .effect()
        .file("jb2a.markers.circle_of_stars.blue")
        .atLocation(workflow.token)
        .delay(200)
        .duration(7500)
        .fadeOut(7500)
        .scaleToObject(1.3)
        .attachTo(workflow.token, { bindAlpha: false })
        .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 60000 })
        .filter("ColorMatrix", { hue: 170 })
        .zIndex(1)

        .effect()
        .file("jb2a.sneak_attack.dark_red")
        .attachTo(workflow.token, { followRotation: false })
        .delay(200)
        .startTime(450)
        .scaleToObject(2)
        .playbackRate(1)
        .zIndex(2)
        .waitUntilFinished(-1000)

        .animation()
        .on(workflow.token)
        .opacity(0)

        .effect()
        .file(tokenPath)
        .atLocation(workflow.token)
        .attachTo(workflow.token, { bindAlpha: false })
        .scaleToObject(scale)
        .fadeOut(2000, { ease: "easeOutCubic" })
        .scaleOut(0.5, 3000, { ease: "easeOutCubic" })
        .persist()
        .name(`${workflow.token.document.name} Shapechanger`)

        .effect()
        .file("jb2a.sleep.cloud.01.blue")
        .atLocation(workflow.token)
        .scaleToObject(2)
        .delay(200)
        .duration(1000)
        .fadeOut(1000)
        .scaleOut(0.5, 1000, { ease: "easeOutCubic" })
        .opacity(0.5)
        .belowTokens()
        .filter("ColorMatrix", { hue: 170 })

        .thenDo(async () => {
            await warpgate.mutate(workflow.token.document, updates, {}, options);
        })

        .effect()
        .file("jb2a.particles.outward.red.02.03")
        .atLocation(workflow.token)
        .attachTo(workflow.token, { bindAlpha: false })
        .scaleToObject(1.5)
        .delay(200)
        .fadeIn(760)
        .fadeOut(2500)
        .scaleIn(0, 200, { ease: "easeOutCubic" })
        .zIndex(2)
        .name(`${workflow.token.document.name} Shapechanger`)

        .play();
}

export let quasit = {
    'poison': poison,
    'scare': scare,
    'shapechanger': shapechanger
}