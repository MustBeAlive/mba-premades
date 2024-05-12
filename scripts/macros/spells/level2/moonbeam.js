import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;
    await template.update({
        'flags': {
            'mba-premades': {
                'template': {
                    'name': 'moonbeam',
                    'castLevel': workflow.castData.castLevel,
                    'saveDC': mba.getSpellDC(workflow.item),
                    'macroName': 'moonbeam',
                    'templateUuid': template.uuid,
                }
            }
        }
    });
    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Spell Features', 'Moonbeam: Move', false);
    if (!featureData) {
        ui.notifications.warn("Unable to find item in the compendium! (Moonbeam: Move)")
    }
    async function effectMacroDel() {
        await warpgate.revert(token.document, 'Moonbeam');
    }
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'duration': {
            'seconds': 60
        },
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'mba-premades': {
                'spell': {
                    'moonbeam': {
                        'templateUuid': template.uuid
                    }
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 2,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    let updates = {
        'embedded': {
            'Item': {
                [featureData.name]: featureData
            },
            'ActiveEffect': {
                [effectData.name]: effectData
            }
        }
    };
    let options = {
        'permanent': false,
        'name': effectData.name,
        'description': effectData.name
    };

    new Sequence()

        .effect()
        .file("jb2a.magic_signs.circle.02.evocation.complete.dark_yellow")
        .attachTo(template)
        .scaleToObject(1.2)
        .zIndex(1)
        .waitUntilFinished(-9000)

        .effect()
        .file("jaamod.spells_effects.moonbeam.1")
        .attachTo(token)
        .scaleToObject(2)
        .duration(6000)
        .fadeIn(1000)
        .fadeOut(1000)
        .opacity(1)
        .filter("ColorMatrix", { brightness: 1 })
        .zIndex(50)

        .effect()
        .file("jb2a.energy_beam.normal.yellow.02")
        .attachTo(token)
        .stretchTo(template)
        .delay(2000)
        .scaleIn(0, 3000, { ease: "easeInOutSine" })
        .fadeOut(500)
        .playbackRate(0.8)
        .zIndex(50)
        .waitUntilFinished(-1500)

        .effect()
        .file("jb2a.moonbeam.01.intro.yellow")
        .attachTo(template)
        .scaleToObject(1.2)
        .zIndex(2)

        .effect()
        .file("jb2a.moonbeam.01.loop.yellow")
        .attachTo(template)
        .scaleToObject(1.2)
        .delay(2000)
        .fadeIn(1000)
        .fadeOut(2000)
        .zIndex(3)
        .persist()
        .name(`Moonbeam`)

        .thenDo(function () {
            warpgate.mutate(workflow.token.document, updates, {}, options);
        })

        .play()
}

async function enter(template, token) {
    let trigger = template.flags['mba-premades']?.template;
    if (!trigger) return;
    await moonbeam.trigger(token.document, trigger);
}

async function trigger(token, trigger) {
    let template = await fromUuid(trigger.templateUuid);
    if (!template) {
        ui.notifications.warn("Unable to find template!");
        return;
    }
    if (mba.inCombat()) {
        let turn = game.combat.round + '-' + game.combat.turn;
        let lastTurn = template.flags['mba-premades']?.spell?.moonbeam?.[token.id]?.turn;
        if (turn === lastTurn) return;
        await template.setFlag('mba-premades', 'spell.moonbeam.' + token.id + '.turn', turn);
    }
    let originUuid = template.flags.dnd5e?.origin;
    if (!originUuid) return;
    let originItem = await fromUuid(originUuid);
    if (!originItem) return;
    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Spell Features', 'Moonbeam: Damage', false);
    if (!featureData) return;
    delete featureData._id;
    featureData.system.save.dc = trigger.saveDC;
    featureData.system.damage.parts = [[trigger.castLevel + 'd10[radiant]', 'radiant']];
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': originItem.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([token.uuid]);
    let changeShape = token.actor.items.getName('Change Shape');
    let shapechanger = token.actor.items.getName('Shapechanger');
    if (changeShape || shapechanger) await mba.createEffect(token.actor, constants.disadvantageEffectData);
    await MidiQOL.completeItemUse(feature, config, options);
}

async function damage({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    new Sequence()

        .effect()
        .file("jb2a.sacred_flame.target.white")
        .attachTo(target)
        .scaleToObject(1.7 * target.document.texture.scaleX)
        .playbackRate(2)

        .play()
}

async function move({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = await mba.findEffect(workflow.actor, "Moonbeam");
    if (!effect) {
        ui.notifications.warn("Unable to find effect!");
        return;
    }
    let template = await fromUuid(effect.flags['mba-premades']?.spell?.moonbeam?.templateUuid);
    if (!template) {
        ui.notifications.warn("Unable to find template!");
        return;
    }
    let interval = 2;
    if (game.modules.get('walledtemplates')?.active) {
        if (game.settings.get('walledtemplates', 'snapGrid')) interval = 1;
    }
    let position = await mba.aimCrosshair(workflow.token, 60, workflow.item.img, interval, 2);
    if (position.canceled) {
        ui.notifications.warn("Failed to choose position, returning!");
        return;
    }
    let updates = {
        'x': position.x,
        'y': position.y
    };
    await template.update(updates);
}



export let moonbeam = {
    'item': item,
    'enter': enter,
    'trigger': trigger,
    'damage': damage,
    'move': move
}