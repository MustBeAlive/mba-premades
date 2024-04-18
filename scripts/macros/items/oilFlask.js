async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let choices = [
        ["Splash oil on somebody (5 ft.)", "splash"],
        ["Throw flask at someone (20 ft.)", "shatter"],
        ["Pour oil on the ground (5 ft. square)", "pour"],
        ["Cancel", "cancel"]
    ];
    let selection = await chrisPremades.helpers.dialog("What would you like to do?", choices);
    if (!selection || selection === "cancel") return;
    if (selection === "splash") {
        let target = workflow.targets.first();
        if (!target) {
            ui.notifiactions.warn("No target selected!");
            return;
        }
        let featureData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Item Features', 'Oil Flask: Splash Oil', false);
        if (!featureData) {
            ui.notifications.warn('Can\'t find item in compenidum! (Oil Flask: Splash Oil)');
            return
        }
        let feature = new CONFIG.Item.documentClass(featureData, { 'parent': actor });
        let [config, options] = chrisPremades.constants.syntheticItemWorkflowOptions([target.uuid]);
        await MidiQOL.completeItemUse(feature, config, options);
    }
    if (selection === "shatter") {
        let target = workflow.targets.first();
        if (!target) {
            ui.notifiactions.warn("No target selected!");
            return;
        }
        let featureData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Item Features', 'Oil Flask: Throw Flask', false);
        if (!featureData) {
            ui.notifications.warn('Can\'t find item in compenidum! (Oil Flask: Throw Flask)');
            return
        }
        let feature = new CONFIG.Item.documentClass(featureData, { 'parent': actor });
        let [config, options] = chrisPremades.constants.syntheticItemWorkflowOptions([target.uuid]);
        await MidiQOL.completeItemUse(feature, config, options);
    }
    if (selection === "pour") {
        let templateData = {
            't': "circle",
            'user': game.user,
            'distance': 3,
            'direction': 0,
            'fillColor': game.user.color,
            'flags': {
                'dnd5e': {
                    'origin': workflow.item.uuid
                },
                'midi-qol': {
                    'originUuid': workflow.item.uuid
                },
                'walledtemplates': {
                    'wallRestriction': 'move',
                    'wallsBlock': 'recurse',
                }
            },
            'angle': 0
        };
        let template = await chrisPremades.helpers.placeTemplate(templateData);
        if (!template) return;

        new Sequence()

            .effect()
            .delay(100)
            .file('jb2a.grease.dark_brown')
            .atLocation(template)
            .size(1, { gridUnits: true })
            .fadeIn(2500)
            .fadeOut(1000)
            .scaleIn(0, 2500, { ease: "easeOutCubic" })
            .scaleOut(0, 1500, { ease: "linear" })
            .zIndex(1)
            .randomRotation()
            .belowTokens()
            .persist()
            .name(`Oil Flask`)

            .play()

        async function effectMacroDel() {
            Sequencer.EffectManager.endEffects({ name: `Oil Flask` });
        }
        let templateEffectData = {
            'name': workflow.item.name,
            'icon': workflow.item.img,
            'origin': workflow.item.uuid,
            'duration': {
                'turns': 1
            },
            'changes': [
                {
                    'key': 'flags.dae.deleteUuid',
                    'mode': 5,
                    'priority': 20,
                    'value': template.uuid
                }
            ],
            'flags': {
                'dae': {
                    'showIcon': false
                },
                'effectmacro': {
                    'onDelete': {
                        'script': chrisPremades.helpers.functionToString(effectMacroDel)
                    }
                }
            }
        };
        await chrisPremades.helpers.createEffect(workflow.actor, templateEffectData);
    }
    let oilItem = workflow.actor.items.filter(i => i.name === "Oil Flask")[0];
    if (oilItem.system.quantity > 1) {
        oilItem.update({ "system.quantity": oilItem.system.quantity - 1 });
    } else {
        workflow.actor.deleteEmbeddedDocuments("Item", [oilItem.id]);
    }
}

async function splash() {

}

async function shatter() {

}

async function pour() {

}

export let oilFlask = {
    'item': item,
    'splash': splash,
    'shatter': shatter,
    'pour': pour
}