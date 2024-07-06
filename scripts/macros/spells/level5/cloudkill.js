import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;
    await template.update({
        'flags': {
            'mba-premades': {
                'spell': {
                    'fogCloud': true
                },
                'template': {
                    'castLevel': workflow.castData.castLevel,
                    'itemUuid': workflow.item.uuid,
                    'saveDC': mba.getSpellDC(workflow.item),
                    'templateUuid': template.uuid,
                }
            }
        }
    });
    async function effectMacro() {
        await mbaPremades.macros.cloudkill.move(effect, token);
    }
    let effectData = {
        'name': 'Cloudkill',
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'duration': {
            'seconds': 600
        },
        'flags': {
            'effectmacro': {
                'onTurnStart': {
                    'script': mba.functionToString(effectMacro)
                }
            },
            'mba-premades': {
                'spell': {
                    'cloudkill': {
                        'templateUuid': template.uuid
                    }
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 5,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    await mba.createEffect(workflow.actor, effectData);

    new Sequence()

        .effect()
        .attachTo(template)
        .file(`jb2a.magic_signs.circle.02.conjuration.complete.green`)
        .size(6, { gridUnits: true })
        .fadeIn(600)
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .rotateIn(180, 600, { ease: "easeOutCubic" })
        .opacity(1)
        .belowTokens()
        .playbackRate(1.2)

        .effect()
        .file("jaamod.smoke.poison_cloud")
        .attachTo(template)
        .size(6, { gridUnits: true })
        .delay(1500)
        .fadeIn(200)
        .fadeOut(1000)
        .scaleIn(0, 1500, { ease: "easeOutCubic" })
        .scaleOut(0, 1500, { ease: "linear" })
        .zIndex(2)
        .filter("ColorMatrix", { hue: 295 })
        .playbackRate(0.7)

        .effect()
        .file("jb2a.fog_cloud.02.green02")
        .attachTo(template)
        .size(8.8, { gridUnits: true })
        .delay(2500)
        .fadeIn(5000)
        .fadeOut(1500)
        .scaleOut(0, 1500, { ease: "linear" })
        .scaleIn(0, 5000, { ease: "easeOutCubic" })
        .opacity(0.7)
        .zIndex(1)
        .randomRotation()
        .persist()
        .name('Cloudkill')

        .play()
}

async function enter(template, token) {
    let trigger = template.flags['mba-premades']?.template;
    if (!trigger) return;
    await cloudkill.trigger(token.document, trigger);
}

async function trigger(token, trigger) {
    let template = await fromUuid(trigger.templateUuid);
    if (!template) return;
    if (mba.inCombat()) {
        let turn = game.combat.round + '-' + game.combat.turn;
        let lastTurn = template.flags['mba-premades']?.spell?.cloudkill?.[token.id]?.turn;
        if (turn === lastTurn) return;
        await template.setFlag('mba-premades', 'spell.cloudkill.' + token.id + '.turn', turn);
    }
    let originItem = await fromUuid(trigger.itemUuid);
    if (!originItem) return;
    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Spell Features', 'Cloudkill: Damage', false);
    if (!featureData) return;
    delete featureData._id;
    featureData.system.save.dc = trigger.saveDC;
    featureData.system.damage.parts = [[`${trigger.castLevel}d8[poison]`, "poison"]];
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': originItem.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([token.uuid]);
    await MidiQOL.completeItemUse(feature, config, options);
}

async function move(effect, token) {
    function getAllowedMoveLocation(casterToken, template, maxSquares) {
        for (let i = maxSquares; i > 0; i--) {
            let movePixels = i * canvas.grid.size;
            let ray = new Ray(casterToken.center, template.object.center);
            let newCenter = ray.project((ray.distance + movePixels) / ray.distance);
            let isAllowedLocation = canvas.effects.visibility.testVisibility({ 'x': newCenter.x, 'y': newCenter.y }, { 'object': template.Object });
            if (isAllowedLocation) return newCenter;
        }
        return false;
    }
    let templateUuid = effect.flags['mba-premades']?.spell?.cloudkill?.templateUuid;
    if (!templateUuid) return;
    let template = await fromUuid(templateUuid);
    if (!template) return;
    let newCenter = getAllowedMoveLocation(token, template, 2);
    if (!newCenter) {
        ui.notifications.info('No room to move cloudkill!');
        return;
    }
    newCenter = canvas.grid.getSnappedPosition(newCenter.x, newCenter.y, 1);
    await template.update({ x: newCenter.x, y: newCenter.y });
}

export let cloudkill = {
    'item': item,
    'enter': enter,
    'trigger': trigger,
    'move': move
}