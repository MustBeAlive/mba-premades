import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;
    let choices = [["Radiant", "radiant"], ["Necrotic", "necrotic"]];
    await mba.playerDialogMessage(game.user);
    let selection = await mba.dialog("Choose damage type:", choices);
    await mba.clearPlayerDialogMessage();
    if (!selection) return;
    let animation1 = "jb2a.divine_smite.caster.blueyellow";
    let animation2 = "jb2a.markers.light.complete.yellow02"
    let animation3 = "jb2a.spirit_guardians.blueyellow.ring";
    if (selection === "necrotic") {
        animation1 = "jb2a.divine_smite.caster.purplepink";
        animation2 = "jb2a.markers.light.complete.purple";
        animation3 = "jb2a.spirit_guardians.dark_purple.ring";
    }

    new Sequence()

        .wait(500)

        .effect()
        .file(animation1)
        .attachTo(token)
        .scaleToObject(1.85)
        .fadeIn(200)

        .effect()
        .file(animation2)
        .delay(1800)
        .attachTo(template)
        .fadeIn(3000)
        .fadeOut(1500)
        .scaleOut(0, 1500, { ease: "linear" })
        .scaleIn(0, 5000, { ease: "easeOutCubic" })
        .size(7.5, { gridUnits: true })

        .effect()
        .file(animation3)
        .delay(1800)
        .attachTo(template)
        .fadeIn(3000)
        .fadeOut(1500)
        .scaleOut(0, 1500, { ease: "linear" })
        .scaleIn(0, 5000, { ease: "easeOutCubic" })
        .size(7.5, { gridUnits: true })
        .playbackRate(0.9)
        .persist()
        .name(`SpiGua`)

        .play()

    await template.update({
        'flags': {
            'mba-premades': {
                'template': {
                    'castLevel': workflow.castData.castLevel,
                    'damageType': selection,
                    'disposition': workflow.token.document.disposition,
                    'saveDC': mba.getSpellDC(workflow.item),
                    'templateUuid': template.uuid
                }
            },
            'walledtemplates': {
                'hideBorder': "alwaysHide",
                'wallRestriction': 'light',
                'wallsBlock': 'walled'
            },
            'x': workflow.token.center.x,
            'y': workflow.token.center.y
        }
    });
    await tokenAttacher.attachElementsToToken([template], workflow.token, false);
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': ``,
        'duration': {
            'seconds': 600
        },
        'flags': {
            'mba-premades': {
                'spell': {
                    'sanctuary': {
                        'ignore': true
                    }
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 3,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    await mba.createEffect(workflow.actor, effectData);
}

async function trigger(template, token) {
    let trigger = template.flags['mba-premades']?.template;
    if (!trigger) return;
    if (token.document.disposition === trigger.disposition) return;
    if (mba.inCombat()) {
        let turn = game.combat.round + '-' + game.combat.turn;
        let lastTurn = template.flags['mba-premades']?.spell?.spiritGuardians?.[token.id]?.turn;
        if (turn === lastTurn) return;
        await template.setFlag('mba-premades', 'spell.spiritGuardians.' + token.id + '.turn', turn);
    }
    let originUuid = template.flags.dnd5e?.origin;
    if (!originUuid) return;
    let originItem = await fromUuid(originUuid);
    if (!originItem) return;
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Spirit Guardians: Damage", false);
    if (!featureData) return;
    featureData.flags['mba-premades'] = {
        'spell': {
            'sanctuary': {
                'ignore': true
            }
        }
    };
    featureData.system.save.dc = trigger.saveDC;
    featureData.system.damage.parts = [[`${trigger.castLevel}d8[${trigger.damageType}]`, trigger.damageType]];
    delete featureData._id;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': originItem.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([token.document.uuid]);
    await MidiQOL.completeItemUse(feature, config, options);
}


export let spiritGuardians = {
    'cast': cast,
    'trigger': trigger
}