import {mba} from "../../../helperFunctions.js";

async function etherealJaunt({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = await mba.findEffect(workflow.actor, "Ethereal Jaunt");
    if (!effect) {
        async function effectMacroDel() {
            await token.document.update({ hidden: false });
        };
        let effectData = {
            'name': "Ethereal Jaunt",
            'icon': workflow.item.img,
            'origin': workflow.item.uuid,
            'flags': {
                'dae': {
                    'showIcon': true
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
            .file("animated-spell-effects-cartoon.misc.weird.01")
            .atLocation(workflow.token)
            .scaleToObject(1.8 * workflow.token.document.texture.scaleX)
            .opacity(0.8)
            .filter("ColorMatrix", { hue: 280 })

            .wait(800)

            .thenDo(async () => {
                await mba.createEffect(workflow.actor, effectData);
                await workflow.token.document.update({ "hidden": true });
            })

            .play()

        return;
    }
    else {
        new Sequence()

        .effect()
        .file("animated-spell-effects-cartoon.misc.weird.01")
        .atLocation(workflow.token)
        .scaleToObject(1.8 * workflow.token.document.texture.scaleX)
        .opacity(0.8)
        .filter("ColorMatrix", { hue: 280 })

        .wait(800)

        .thenDo(async () => {
            await mba.removeEffect(effect);
        })

        .play()
    }
}

export let phaseSpider = {
    'etherealJaunt': etherealJaunt
}