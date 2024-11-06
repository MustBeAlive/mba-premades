import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

//for now don't want (or know how to) implement "enlarging" part of the spell

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;
    await template.update({
        'flags': {
            'mba-premades': {
                'template': {
                    'castLevel': workflow.castData.castLevel,
                    'icon': workflow.item.img,
                    'itemUuid': workflow.item.uuid,
                    'saveDC': mba.getSpellDC(workflow.item),
                    'templateUuid': template.uuid,
                }
            }
        }
    });
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Dust Devil: Move", false);
    if (!featureData) return;
    async function effectMacroDel() {
        await warpgate.revert(token.document, "Dust Devil");
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
                    'dustDevil': {
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
        .file("jb2a.whirlwind.bluegrey")
        .attachTo(template)
        .scaleToObject(1.3)
        .fadeIn(500)
        .fadeOut(1000)
        .filter("ColorMatrix", { hue: 200 })
        .persist()
        .name(`Dust Devil`)

        .thenDo(async () => {
            await warpgate.mutate(workflow.token.document, updates, {}, options);
        })

        .play()
}

async function enter(template, token) {
    let trigger = template.flags['mba-premades']?.template;
    if (!trigger) return;
    await dustDevil.trigger(token.document, trigger);
}

async function trigger(token, trigger) {
    let template = await fromUuid(trigger.templateUuid);
    if (!template) {
        ui.notifications.warn("Unable to find template!");
        return;
    }
    if (mba.inCombat()) {
        let turn = game.combat.round + '-' + game.combat.turn;
        let lastTurn = template.flags['mba-premades']?.spell?.dustDevil?.[token.id]?.turn;
        if (turn === lastTurn) return;
        await template.setFlag('mba-premades', 'spell.dustDevil.' + token.id + '.turn', turn);
    }
    let originItem = await fromUuid(trigger.itemUuid);
    if (!originItem) return;
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Dust Devil: Damage", false);
    if (!featureData) return;
    delete featureData._id;
    featureData.system.save.dc = trigger.saveDC;
    featureData.system.damage.parts = [[`${trigger.castLevel - 1}d8[bludgeoning]`, 'bludgeoning']];
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': originItem.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([token.uuid]);
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (!featureWorkflow.failedSaves.size) return;
    let templateCenter = template._object.ray.bounds.center; // goddamn those rects
    let target = token.object;
    let ray = new Ray(templateCenter, target.center);
    await mba.pushTokenAlongRay(target, ray, 10);
}

async function move({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = await mba.findEffect(workflow.actor, "Dust Devil");
    if (!effect) {
        ui.notifications.warn("Unable to find effect!");
        return;
    }
    let template = await fromUuid(effect.flags['mba-premades']?.spell?.dustDevil?.templateUuid);
    if (!template) {
        ui.notifications.warn("Unable to find template!");
        return;
    }
    await mba.playerDialogMessage(game.user);
    let position = await mba.aimCrosshair(workflow.token, 30, workflow.item.img, 2, 3);
    await mba.clearPlayerDialogMessage();
    if (position.canceled) {
        ui.notifications.warn("Failed to choose position, returning!");
        return;
    }
    let updates = {
        'x': position.x - (canvas.grid.size * 1.5), //cringe?
        'y': position.y - (canvas.grid.size * 1.5)  //cringe?
    };
    await template.update(updates);
}

export let dustDevil = {
    'item': item,
    'trigger': trigger,
    'enter': enter,
    'move': move
}