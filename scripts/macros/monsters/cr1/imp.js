import {mba} from "../../../helperFunctions.js";

async function shapechanger({ speaker, actor, token, character, item, args, scope, workflow }) {
    let oldEffect = await mba.findEffect(workflow.actor, "Shapechanger");
    if (oldEffect) await mba.removeEffect(oldEffect);
    let choices = [
        ["Rat (20 walk)", "rat", "modules/mba-bestiary/tokens/CR____0/rat/v1/rat_tiny_beast_01.webp"],
        ["Raven (20 walk, 60 fly)", "raven", "modules/mba-bestiary/tokens/CR____0/raven/v1/raven-black-%5Bcr0%2Ctiny%2Cbeast%5D.webp"],
        ["Spider (20 walk, 20 climb)", "spider", "modules/mba-bestiary/tokens/CR____0/spider/v1/spider-%5Bcr0%2Ctiny%2Cbeast%5D.webp"]
    ];
    let selection = await mba.selectImage("Imp: Shapechanger", choices, "<b>Choose form to assume:</b>", "both");
    if (!selection) return;
    let tokenPath = selection[1];
    let changes;
    let scale;
    switch (selection[0]) {
        case "rat": {
            changes = [
                {
                    'key': 'system.attributes.movement.fly',
                    'mode': 5,
                    'value': 0,
                    'priority': 20
                },
            ];
            scale = 2;
            break;
        }
        case "raven": {
            changes = [
                {
                    'key': 'system.attributes.movement.fly',
                    'mode': 5,
                    'value': 60,
                    'priority': 20
                },
            ];
            scale = 1;
            break;
        }
        case "spider": {
            changes = [
                {
                    'key': 'system.attributes.movement.fly',
                    'mode': 5,
                    'value': 0,
                    'priority': 20
                },
                {
                    'key': 'system.attributes.movement.climb',
                    'mode': 5,
                    'value': 20,
                    'priority': 20
                },
            ];
            scale = 1.5;
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
                    'offset': 135,
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

export let imp = {
    'shapechanger': shapechanger
}