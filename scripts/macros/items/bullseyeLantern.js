async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = await chrisPremades.helpers.findEffect(workflow.actor, "Bullseye Lantern");
    if (!effect) {
        let hasOil = workflow.actor.items.filter(i => i.name === "Oil Flask");
        if (!hasOil.length) {
            ui.notifications.warn("You don't have any oil to light up the lantern!");
            return;
        }
        let choices = [["Yes, light the lantern", "light"], ["No, cancel", "cancel"]];
        let selection = await chrisPremades.helpers.dialog("Would you like to light a Bullseye Lantern?", choices);
        if (!selection || selection === "cancel") return;
        await mbaPremades.macros.bullseyeLantern.light({ speaker, actor, token, character, item, args, scope, workflow })
        return;
    }
    let choices = [["Pour more Oil (restart duration)", "renew"], ["Extinguish Lantern", "extinguish"]];
    let selection = await chrisPremades.helpers.dialog("What would you like to do?", choices);
    if (!selection) return;
    if (selection === "renew") {
        await chrisPremades.helpers.removeEffect(effect);
        await warpgate.wait(100);
        await mbaPremades.macros.bullseyeLantern.light({ speaker, actor, token, character, item, args, scope, workflow })
    } else {
        await chrisPremades.helpers.removeEffect(effect);
    }
}

async function light({ speaker, actor, token, character, item, args, scope, workflow }) {
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
                    'script': chrisPremades.helpers.functionToString(effectMacroDel)
                }
            }
        }
    };
    new Sequence()

        .effect()
        .file("modules/mba-premades/icons/gear/lantern_bullseye.webp")
        .atLocation(token)
        .attachTo(token, { followRotation: true, local: true })
        .scaleToObject(.7, { considerTokenScale: true })
        .scaleIn(0, 500, { ease: "easeOutElastic" })
        .scaleOut(0, 250, { ease: "easeOutCubic" })
        .spriteOffset({ x: 0.0 * token.document.width, y: 0.45 * token.document.width }, { gridUnits: true })
        .animateProperty("sprite", "rotation", { from: 15, to: -15, duration: 300, ease: "easeInOutBack" })
        .animateProperty("sprite", "rotation", { from: 0, to: 30, duration: 250, delay: 200, ease: "easeOutBack" })
        .loopProperty("sprite", "rotation", { from: 3, to: -3, duration: 1500, ease: "easeOutQuad", pingPong: true })
        .zeroSpriteRotation()
        .fadeOut(500)
        .persist()
        .name(`${workflow.token.document.name} Bullseye Lantern`)

        .thenDo(function () {
            chrisPremades.helpers.createEffect(workflow.actor, effectData);
        })

        .play()

    let oilFlaskItem = workflow.actor.items.filter(i => i.name === "Oil Flask")[0];
    if (oilFlaskItem.system.quantity > 1) {
        oilFlaskItem.update({ "system.quantity": oilFlaskItem.system.quantity - 1 });
    } else {
        workflow.actor.deleteEmbeddedDocuments("Item", [oilFlaskItem.id]);
    }
    let emptyFlaskItem = workflow.actor.items.filter(i => i.name === "Empty Flask");
    if (!emptyFlaskItem.length) {
        const itemData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Items', 'Empty Flask', false);
        if (!itemData) {
            ui.notifications.warn("Unable to find item in compenidum! (Empty Flask)");
            return
        }
        await workflow.actor.createEmbeddedDocuments("Item", [itemData]);
    } else {
        emptyFlaskItem[0].update({ "system.quantity": emptyFlaskItem[0].system.quantity + 1 });
    }
}

export let bullseyeLantern = {
    'item': item,
    'light': light
}