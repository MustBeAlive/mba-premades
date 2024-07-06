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
                    'icon': workflow.item.img,
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
        .file(`jb2a.magic_signs.circle.02.conjuration.complete.green`)
        .size(4.4, { gridUnits: true })
        .fadeIn(600)
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .rotateIn(180, 600, { ease: "easeOutCubic" })
        .opacity(1)
        .zIndex(1)
        .belowTokens()
        .playbackRate(1.2)

        .effect()
        .file("jb2a.black_tentacles.dark_purple")
        .attachTo(template)
        .scaleToObject(1.5)
        .delay(1500)
        .fadeIn(1000)
        .fadeOut(1000)
        .scaleOut(0, 1500, { ease: "linear" })
        .scaleIn(0, 5000, { ease: "easeOutCubic" })
        .opacity(0.7)
        .zIndex(2)
        .persist()
        .name(`Evard's Black Tentacles`)

        .play()
}

async function enter(template, token) {
    let trigger = template.flags['mba-premades']?.template;
    if (!trigger) return;
    await evardBlackTentacles.trigger(token.document, trigger);
}

async function trigger(token, trigger) {
    if (mba.findEffect(token.actor, "Evard's Black Tentacles: Restrain")) return;
    let template = await fromUuid(trigger.templateUuid);
    if (!template) return;
    if (mba.inCombat()) {
        let turn = game.combat.round + '-' + game.combat.turn;
        let lastTurn = template.flags['mba-premades']?.spell?.evardBlackTentacles?.[token.id]?.turn;
        if (turn === lastTurn) return;
        await template.setFlag('mba-premades', 'spell.evardBlackTentacles.' + token.id + '.turn', turn);
    }
    let effectData = {
        'name': "Evard's Black Tentacles: Restrain",
        'icon': trigger.icon,
        'origin': trigger.itemUuid,
        'description': `
            <p>You are restrained by Black Tentacles until the spell ends and take 3d6 bludgeoning at the start of each of your turns.</p>
            <p>You can use your action to make a Strength or Dexterity check against spell save DC. On a success, the restraining effect ends.</p>
        `,
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': 'Restrained',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `turn=start, damageType=bludgeoning, damageRoll=3d6, name=Black Tentacles: Turn Start, killAnim=true, fastForwardDamage=true`,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `actionSave=true, rollType=check, saveAbility=str|dex, saveDC=${trigger.saveDC}, saveMagic=true, name=Black Tentacles: Action Save, killAnim=true`,
                'priority': 20
            },
        ],
        'flags': {
            'dae': {
                'showIcon': true
            },
            'castData': {
                baseLevel: 4,
                castLevel: trigger.castLevel,
                itemUuid: trigger.itemUuid
            }
        }
    };
    let originItem = await fromUuid(trigger.itemUuid);
    if (!originItem) return;
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Evard's Black Tentacles: Damage", false);
    if (!featureData) return;
    delete featureData._id;
    featureData.system.save.dc = trigger.saveDC;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': originItem.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([token.uuid]);
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (!featureWorkflow.failedSaves.size) return;
    let newEffect = await mba.createEffect(token.actor, effectData);
    let concData = originItem.actor.getFlag("midi-qol", "concentration-data.removeUuids");
    concData.push(newEffect.uuid);
    await originItem.actor.setFlag("midi-qol", "concentration-data.removeUuids", concData);
}

export let evardBlackTentacles = {
    'item': item,
    'enter': enter,
    'trigger': trigger
}