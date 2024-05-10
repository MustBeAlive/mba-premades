import {mba} from "../../helperFunctions.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = await mba.findEffect(workflow.actor, "Torch");
    if (!effect) {
        let choices = [["Yes, light the torch", "light"], ["No, cancel", "cancel"]];
        let selection = await mba.dialog("Would you like to light a torch?", choices);
        if (!selection || selection === "cancel") return;
        await mbaPremades.macros.torch.light({speaker, actor, token, character, item, args, scope, workflow})
        return;
    }
    let choices = [["Light new Torch", "light"], ["Extinguish Torch", "extinguish"]];
    let selection = await mba.dialog("What would you like to do?", choices);
    if (!selection) return;
    switch (selection) {
        case "light": {
            await mba.removeEffect(effect);
            await warpgate.wait(100);
            await mbaPremades.macros.torch.light({speaker, actor, token, character, item, args, scope, workflow})
            break;
        }
        case "extinguish": {
            await mba.removeEffect(effect);
        }
    }
}

async function light({ speaker, actor, token, character, item, args, scope, workflow }) {
    async function effectMacroDel() {
        await Sequencer.EffectManager.endEffects({ name: `${token.document.name} Torch` })
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>A torch burns for 1 hour, providing bright light in a 20-foot radius and dim light for an additional 20 feet.</p>
            <p>If you make a melee attack with a burning torch and hit, it deals 1 fire damage.</p>
        `,
        'duration': {
            'seconds': 3600
        },
        'changes': [
            {
                'key': 'ATL.light.dim',
                'mode': 4,
                'value': 40,
                'priority': 20
            },
            {
                'key': 'ATL.light.bright',
                'mode': 4,
                'value': 20,
                'priority': 20
            },
            {
                'key': 'ATL.light.alpha',
                'mode': 5,
                'value': "0.25",
                'priority': 20
            },
            {
                'key': 'ATL.light.angle',
                'mode': 5,
                'value': "360",
                'priority': 20
            },
            {
                'key': 'ATL.light.luminosity',
                'mode': 5,
                'value': "0.5",
                'priority': 20
            },
            {
                'key': 'ATL.light.color',
                'mode': 5,
                'value': "#ffb433",
                'priority': 20
            },
            {
                'key': 'ATL.light.animation',
                'mode': 5,
                'value': '{type: "torch", speed: 3, intensity: 3 }',
                'priority': 20
            },
            {
                'key': 'ATL.light.attenuation',
                'mode': 5,
                'value': "0.8",
                'priority': 20
            },
            {
                'key': 'ATL.light.contrast',
                'mode': 5,
                'value': "0.15",
                'priority': 20
            },
            {
                'key': 'ATL.light.shadows',
                'mode': 5,
                'value': "0.2",
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
        .file("jb2a.impact.002.orange")
        .delay(150)
        .atLocation(token)
        .attachTo(token, { followRotation: true, local: true })
        .scaleToObject(0.9, { considerTokenScale: true })
        .spriteOffset({ x: 0.525 * token.document.width, y: -0.05 * token.document.width }, { gridUnits: true })
        .spriteRotation(45)
        .zIndex(0.1)
        .name(`${workflow.token.document.name} Torch`)

        .effect()
        .file("modules/mba-premades/icons/gear/torch.webp")
        .atLocation(token)
        .attachTo(token, { followRotation: true, local: true })
        .scaleToObject(1.2, { considerTokenScale: true })
        .scaleIn(0, 500, { ease: "easeOutElastic" })
        .scaleOut(0, 250, { ease: "easeOutCubic" })
        .spriteOffset({ x: 0.35 * token.document.width, y: 0.1 * token.document.width }, { gridUnits: true })
        .animateProperty("sprite", "rotation", { from: 15, to: -15, duration: 300, ease: "easeInOutBack" })
        .animateProperty("sprite", "rotation", { from: 0, to: 30, duration: 250, delay: 200, ease: "easeOutBack" })
        .zeroSpriteRotation()
        .fadeOut(1000)
        .persist()
        .name(`${workflow.token.document.name} Torch`)

        .effect()
        .file("jb2a.flames.01.orange")
        .delay(250)
        .atLocation(token)
        .attachTo(token, { followRotation: true, local: true })
        .scaleToObject(1, { considerTokenScale: true })
        .spriteOffset({ x: 0.5 * token.document.width, y: -0.05 * token.document.width }, { gridUnits: true })
        .spriteRotation(45)
        .zIndex(0.1)
        .fadeOut(1000)
        .persist()
        .name(`${workflow.token.document.name} Torch`)

        .wait(250)

        .thenDo(function () {
            mba.createEffect(workflow.actor, effectData);
            if (workflow.item.system.quantity > 1) {
                workflow.item.update({ "system.quantity": workflow.item.system.quantity - 1});
            } else {
                workflow.actor.deleteEmbeddedDocuments("Item", [workflow.item.id]);
            }
        })

        .play()
}


export let torch = {
    'item': item,
    'light': light
}