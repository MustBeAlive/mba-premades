import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.templateId) return;
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;
    await template.update({
        'flags': {
            'mba-premades': {
                'spell': {
                    'darkness': true
                }
            },
            'walledtemplates': {
                'hideBorder': "alwaysHide",
                'wallRestriction': 'move',
                'wallsBlock': 'recurse'
            }
        }
    });
    let attachToken = await mba.dialog('Darkness', [['Yes', true], ['No', false]], `<b>Attach template to yourself?</b>`) || false;
    if (attachToken) {
        let tokenObject = workflow.token;
        await template.update(
            {
                'x': tokenObject.center.x,
                'y': tokenObject.center.y
            }
        );
        await tokenAttacher.attachElementsToToken([template], tokenObject, false);
    }
    new Sequence()

        .effect()
        .attachTo(template)
        .file(`jb2a.magic_signs.circle.02.evocation.complete.red`)
        .size(6, { gridUnits: true })
        .fadeIn(600)
        .opacity(1)
        .rotateIn(180, 600, { ease: "easeOutCubic" })
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .belowTokens()
        .playbackRate(1.2)

        .effect()
        .file("jaamod.smoke.poison_cloud")
        .attachTo(template)
        .scaleIn(0, 1500, { ease: "easeOutCubic" })
        .scaleOut(0, 1500, { ease: "linear" })
        .fadeIn(200)
        .fadeOut(1000)
        .zIndex(2)
        .delay(1500)
        .filter("ColorMatrix", { brightness: 0 })
        .playbackRate(0.7)
        .size(6, { gridUnits: true })

        .effect()
        .delay(2500)
        .file("jb2a.darkness.black")
        .attachTo(template)
        .fadeIn(3000)
        .fadeOut(1500)
        .opacity(0.7)
        .zIndex(1)
        .randomRotation()
        .scaleOut(0, 1500, { ease: "linear" })
        .scaleIn(0, 5000, { ease: "easeOutCubic" })
        .size(6.8, { gridUnits: true })
        .persist()
        .name(`Darkness`)

        .play()
}

async function hook(workflow) {
    if (workflow.targets.size != 1) return;
    let targetDoc = workflow.targets.first().document;
    if (!targetDoc) return;
    let sourceDoc = workflow.token.document;
    let sourceTemplates = game.modules.get('templatemacro').api.findContainers(sourceDoc);
    let sourceInDarkness = false;
    for (let i = 0; sourceTemplates.length > i; i++) {
        let testTemplate = canvas.scene.collections.templates.get(sourceTemplates[i]);
        if (!testTemplate) continue;
        let darkness = testTemplate.flags['mba-premades']?.spell?.darkness;
        if (darkness) {
            sourceInDarkness = true;
            break;
        }
    }
    let targetInDarkness = false;
    let targetTemplates = game.modules.get('templatemacro').api.findContainers(targetDoc);
    for (let i = 0; targetTemplates.length > i; i++) {
        let testTemplate = canvas.scene.collections.templates.get(targetTemplates[i]);
        if (!testTemplate) continue;
        let darkness = testTemplate.flags['mba-premades']?.spell?.darkness;
        if (darkness) {
            targetInDarkness = true;
            break;
        }
    }
    if (!sourceInDarkness && !targetInDarkness) return;
    let distance = mba.getDistance(sourceDoc, targetDoc);
    let sourceCanSeeTarget = false;
    let targetCanSeeSource = false;
    let sourceActor = sourceDoc.actor;
    let targetActor = targetDoc.actor;
    let sourceDS = sourceActor.flags['mba-premades']?.feature?.devilsight;
    let targetDS = targetActor.flags['mba-premades']?.feature?.devilsight;
    let sourceSenses = sourceDoc.actor.system.attributes.senses;
    let targetSenses = targetDoc.actor.system.attributes.senses;
    if ((sourceDS && distance <= 120) || (sourceSenses.tremorsense >= distance) || (sourceSenses.blindsight >= distance) || (sourceSenses.truesight >= distance)) sourceCanSeeTarget = true;
    if ((targetDS && distance <= 120) || (targetSenses.tremorsense >= distance) || (targetSenses.blindsight >= distance) || (targetSenses.truesight >= distance)) targetCanSeeSource = true;
    if (sourceCanSeeTarget && targetCanSeeSource) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'darkness', 50);
    if (!queueSetup) return;
    if (sourceCanSeeTarget && !targetCanSeeSource) {
        workflow.advantage = true;
        workflow.advReminderAttackAdvAttribution.add("ADV:Darkness (target is unable to see you)");
    }
    if (!sourceCanSeeTarget && targetCanSeeSource) {
        workflow.disadvantage = true;
        workflow.flankingAdvantage = false;
        workflow.advReminderAttackAdvAttribution.add("DIS:Darkness (you are unable to see target)");
    }
    if (!sourceCanSeeTarget && !targetCanSeeSource) {
        //workflow.advantage = true; Homeruled, uncomment to fix
        workflow.disadvantage = true;
        workflow.advReminderAttackAdvAttribution.add("DIS:Darkness (you and target are unable to see eachother)");
    }
    queue.remove(workflow.item.uuid);
}

export let darkness = {
    'item': item,
    'hook': hook
};