import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;
    await template.update({
        'flags': {
            'mba-premades': {
                'template': {
                    'castLevel': workflow.castData.castLevel,
                    'itemUuid': workflow.item.uuid,
                    'saveDC': mba.getSpellDC(workflow.item),
                    'templateUuid': template.uuid,
                }
            }
        }
    });
    new Sequence()

        .effect()
        .attachTo(template)
        .file(`jb2a.cast_generic.01.blue.0`)
        .size(9, { gridUnits: true })
        .delay(500)
        .fadeIn(500)
        .opacity(1)
        .zIndex(2)
        .repeats(4, 500)
        .private()

        .effect()
        .file("jb2a.template_circle.out_pulse.02.loop.bluewhite")
        .attachTo(template)
        .size(12, { gridUnits: true })
        .delay(2500)
        .fadeIn(500)
        .fadeOut(500)
        .scaleIn(0, 1500, { ease: "easeOutCubic" })
        .belowTokens()
        .randomRotation()
        .zIndex(2)
        .private()

        .effect()
        .file("jb2a.template_circle.out_pulse.02.loop.bluewhite")
        .attachTo(template)
        .size(6, { gridUnits: true })
        .delay(2500)
        .fadeIn(500)
        .fadeOut(500)
        .scaleIn(0, 1500, { ease: "easeOutCubic" })
        .belowTokens()
        .randomRotation()
        .zIndex(2)

        .effect()
        .file("jb2a.portals.horizontal.vortex.blue")
        .attachTo(template)
        .size(8, { gridUnits: true })
        .delay(2800)
        .fadeIn(1500)
        .fadeOut(500)
        .opacity(0.95)
        .belowTokens()
        .zIndex(1.2)
        .persist()
        .name(`Maelstrom`)


        .effect()
        .file("jb2a.whirlwind.blue")
        .attachTo(template)
        .delay(2800)
        .fadeIn(1500)
        .opacity(0.85)
        .fadeOut(500)
        .size(12, { gridUnits: true })
        .belowTokens()
        .zIndex(1.3)
        .persist()
        .name(`Maelstrom`)

        .effect()
        .attachTo(template)
        .file(`jb2a.magic_signs.circle.02.evocation.complete.blue`)
        .size(13, { gridUnits: true })
        .fadeIn(600)
        .opacity(1)
        .rotateIn(180, 600, { ease: "easeOutCubic" })
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .belowTokens()
        .zIndex(1)
        .persist()
        .name(`Maelstrom`)

        .play()
}

async function enter(template, token) {
    let trigger = template.flags['mba-premades']?.template;
    if (!trigger) return;
    await maelstrom.trigger(token.document, trigger);
}

async function trigger(token, trigger) {
    let template = await fromUuid(trigger.templateUuid);
    if (!template) return;
    let originItem = await fromUuid(trigger.itemUuid);
    if (!originItem) return;
    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Spell Features', 'Maelstrom: Strong Current', false);
    if (!featureData) return;
    delete featureData._id;
    featureData.system.save.dc = trigger.saveDC;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': originItem.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([token.uuid]);
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (!featureWorkflow.failedSaves.size) return;
    let target = token.object;
    let templateCenter = { x: template.x, y: template.y };
    let ray = new Ray(templateCenter, target.center);
    let newCenter = ray.project(1 + ((canvas.dimensions.size * -2 / ray.distance)));
    newCenter = canvas.grid.getSnappedPosition(newCenter.x - target.w / 2, newCenter.y - target.h / 2, 1);
    let targetUpdate = {
        'token': {
            'x': newCenter.x,
            'y': newCenter.y
        }
    };
    let moveOptions = {
        'permanent': true,
        'name': 'Move Token',
        'description': 'Move Token'
    };
    await warpgate.mutate(target.document, targetUpdate, {}, moveOptions);
}

export let maelstrom = {
    'item': item,
    'enter': enter,
    'trigger': trigger,
}