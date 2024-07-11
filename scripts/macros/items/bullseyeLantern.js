import {mba} from "../../helperFunctions.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = await mba.findEffect(workflow.actor, "Bullseye Lantern");
    if (!effect) {
        let hasOil = mba.getItem(workflow.actor, "Oil Flask");
        if (!hasOil) {
            ui.notifications.warn("You don't have any oil to light up the lantern!");
            return;
        }
        let choices = [["Yes, light the lantern", "light"], ["No, cancel", false]];
        await mba.playerDialogMessage();
        let selection = await mba.dialog("Bullseye Lantern", choices, `Would you like to light the <b>Bullseye Lantern</b>?`);
        await mba.clearPlayerDialogMessage();
        if (!selection) return;
        await bullseyeLantern.light(workflow)
        return;
    }
    let choices = [["Pour more Oil (restart duration)", "renew"], ["Extinguish Lantern", "extinguish"]];
    await mba.playerDialogMessage();
    let selection = await mba.dialog("Bullseye Lantern", choices, `<b>What would you like to do?</b>`);
    await mba.clearPlayerDialogMessage();
    if (!selection) return;
    if (selection === "renew") {
        await mba.removeEffect(effect);
        await warpgate.wait(100);
        await bullseyeLantern.light(workflow)
    } 
    else if (selection === "extinguish") {
        await mba.removeEffect(effect);
    }
}

async function light(workflow) {
    async function effectMacroDel() {
        await Sequencer.EffectManager.endEffects({ name: `${token.document.name} Bullseye Lantern` })
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>A bullseye lantern casts bright light in a 60-foot cone and dim light for an additional 60 feet. Once lit, it burns for 6 hours on a flask (1 pint) of oil.</p>
        `,
        'duration': {
            'seconds': 21600
        },
        'changes': [
            {
                'key': 'ATL.light.dim',
                'mode': 4,
                'value': 120,
                'priority': 20
            },
            {
                'key': 'ATL.light.bright',
                'mode': 4,
                'value': 60,
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
                'value': "30",
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
                'value': '{type: "torch", speed: 4, intensity: 4}',
                'priority': 20
            },
            {
                'key': 'ATL.light.attenuation',
                'mode': 5,
                'value': "0.75",
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
        .file("modules/mba-premades/icons/gear/lantern_bullseye.webp")
        .atLocation(workflow.token)
        .attachTo(workflow.token, { followRotation: true, local: true })
        .scaleToObject(.7, { considerTokenScale: true })
        .scaleIn(0, 500, { ease: "easeOutElastic" })
        .scaleOut(0, 250, { ease: "easeOutCubic" })
        .spriteOffset({ x: 0.0 * workflow.token.document.width, y: 0.45 * workflow.token.document.width }, { gridUnits: true })
        .animateProperty("sprite", "rotation", { from: 15, to: -15, duration: 300, ease: "easeInOutBack" })
        .animateProperty("sprite", "rotation", { from: 0, to: 30, duration: 250, delay: 200, ease: "easeOutBack" })
        .loopProperty("sprite", "rotation", { from: 3, to: -3, duration: 1500, ease: "easeOutQuad", pingPong: true })
        .zeroSpriteRotation()
        .fadeOut(500)
        .persist()
        .name(`${workflow.token.document.name} Bullseye Lantern`)

        .thenDo(async () => {
            await mba.createEffect(workflow.actor, effectData);
        })

        .play()

    let oilFlaskItem = await mba.getItem(workflow.actor, "Oil Flask");
    if (oilFlaskItem.system.quantity > 1) {
        await oilFlaskItem.update({ "system.quantity": oilFlaskItem.system.quantity - 1 });
    } else {
        await workflow.actor.deleteEmbeddedDocuments("Item", [oilFlaskItem.id]);
    }
    let emptyFlaskItem = await mba.getItem(workflow.actor, "Empty Flask");
    if (!emptyFlaskItem) {
        const itemData = await mba.getItemFromCompendium('mba-premades.MBA Items', 'Empty Flask', false);
        if (!itemData) {
            ui.notifications.warn("Unable to find item in compendium! (Empty Flask)");
            return
        }
        await workflow.actor.createEmbeddedDocuments("Item", [itemData]);
    } else {
        await emptyFlaskItem.update({ "system.quantity": emptyFlaskItem.system.quantity + 1 });
    }
}

export let bullseyeLantern = {
    'item': item,
    'light': light
}