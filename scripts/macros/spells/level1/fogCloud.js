import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let feetRadius = workflow.castData.castLevel * 20;
    let gridRadius = (workflow.castData.castLevel * 8) + 0.8;
    let templateData = {
        't': 'circle',
        'user': game.user,
        'distance': feetRadius,
        'direction': 0,
        'fillColor': game.user.color,
        'flags': {
            'dnd5e': {
                'origin': workflow.item.uuid
            },
            'midi-qol': {
                'originUuid': workflow.item.uuid
            },
            'mba-premades': {
                'spell': {
                    'fogCloud': true
                }
            },
            'walledtemplates': {
                'hideBorder': "alwaysHide",
                'wallRestriction': 'light',
                'wallsBlock': 'recurse',
            }
        },
        'angle': 0
    };
    let template = await mba.placeTemplate(templateData);
    if (!template) return;
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: "Fog Cloud" })
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'duration': {
            'seconds': mba.itemDuration(workflow.item).seconds
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
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };
    new Sequence()

        .effect()
        .file(`jb2a.magic_signs.circle.02.conjuration.complete.yellow`)
        .attachTo(template)
        .size(gridRadius, { gridUnits: true })
        .fadeIn(600)
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .rotateIn(180, 600, { ease: "easeOutCubic" })
        .opacity(1)
        .belowTokens()
        .playbackRate(1.2)

        .effect()
        .file("jaamod.smoke.top_down.white")
        .attachTo(template)
        .size(gridRadius, { gridUnits: true })
        .delay(1500)
        .fadeIn(200)
        .fadeOut(1000)
        .scaleIn(0, 1500, { ease: "easeOutCubic" })
        .scaleOut(0, 1500, { ease: "linear" })
        .zIndex(2)
        .playbackRate(0.7)

        .effect()
        .file("jb2a.smoke.puff.ring.02.white.0")
        .attachTo(template)
        .size(gridRadius, { gridUnits: true })
        .delay(6500)
        .fadeIn(200)
        .fadeOut(1000)

        .effect()
        .file("jb2a.fog_cloud.02.white")
        .attachTo(template)
        .size(gridRadius, { gridUnits: true })
        .delay(1500)
        .fadeIn(3000)
        .fadeOut(2000)
        .scaleOut(0, 1500, { ease: "linear" })
        .scaleIn(0, 5000, { ease: "easeOutCubic" })
        .opacity(0.7)
        .zIndex(1)
        .randomRotation()
        .persist()
        .name(`Fog Cloud`)

        .play()

    await mba.createEffect(workflow.actor, effectData);
}

async function hook(workflow) {
    if (workflow.targets.size != 1) return;
    let targetToken = workflow.targets.first().document;
    if (!targetToken) return;
    let sourceToken = workflow.token.document;
    let sourceTemplates = game.modules.get('templatemacro').api.findContainers(sourceToken);
    let sourceInFogCloud = false;
    for (let i = 0; sourceTemplates.length > i; i++) {
        let testTemplate = canvas.scene.collections.templates.get(sourceTemplates[i]);
        if (!testTemplate) continue;
        let fogCloud = testTemplate.flags['mba-premades']?.spell?.fogCloud;
        if (fogCloud) {
            sourceInFogCloud = true;
            break;
        }
    }
    let targetInFogCloud = false;
    let targetTemplates = game.modules.get('templatemacro').api.findContainers(targetToken);
    for (let i = 0; targetTemplates.length > i; i++) {
        let testTemplate = canvas.scene.collections.templates.get(targetTemplates[i]);
        if (!testTemplate) continue;
        let darkness = testTemplate.flags['mba-premades']?.spell?.fogCloud;
        if (darkness) {
            targetInFogCloud = true;
            break;
        }
    }
    if (!sourceInFogCloud && !targetInFogCloud) return;
    let distance = mba.getDistance(sourceToken, targetToken);
    let sourceCanSeeTarget = false;
    let targetCanSeeSource = false;
    let sourceSenses = sourceToken.actor.system.attributes.senses;
    let targetSenses = targetToken.actor.system.attributes.senses;
    if ((sourceSenses.tremorsense >= distance) || (sourceSenses.blindsight >= distance)) sourceCanSeeTarget = true;
    if ((targetSenses.tremorsense >= distance) || (targetSenses.blindsight >= distance)) targetCanSeeSource = true;
    if (sourceCanSeeTarget && targetCanSeeSource) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'fogCloud', 50);
    if (!queueSetup) return;
    if (sourceCanSeeTarget && !targetCanSeeSource) {
        workflow.advantage = true;
        //workflow.attackAdvAttribution.add("Fog Cloud: Target Can't See Source");
        workflow.advReminderAttackAdvAttribution.add("ADV:Heavily Obscured (target is unable to see you)");
    }
    if (!sourceCanSeeTarget && targetCanSeeSource) {
        workflow.disadvantage = true;
        workflow.flankingAdvantage = false;
        //workflow.attackAdvAttribution.add("Fog Cloud: Source Can't See Target");
        workflow.advReminderAttackAdvAttribution.add("DIS:Heavily Obscured (you are unable to see target)");
    }
    if (!sourceCanSeeTarget && !targetCanSeeSource) {
        //workflow.advantage = true; Homeruled, uncomment to fix
        workflow.disadvantage = true;
        //workflow.attackAdvAttribution.add('Fog Cloud: Target And Source Can\'t See Eachother');
        workflow.advReminderAttackAdvAttribution.add("DIS:Heavily Obscured (you and target are unable to see eachother)");
    }
    queue.remove(workflow.item.uuid);
}

export let fogCloud = {
    'item': item,
    'hook': hook
}