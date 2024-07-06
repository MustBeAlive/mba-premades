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
                    'saveDC': mbaPremades.helpers.getSpellDC(workflow.item),
                    'templateUuid': template.uuid,
                }
            }
        }
    });

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
        .name('Stinking Cloud')

        .play()
}

async function enter(template, token) {
    let trigger = template.flags['mba-premades']?.template;
    if (!trigger) return;
    await stinkingCloud.trigger(token.document, trigger);
}

async function trigger(token, trigger) {
    if (mba.checkTrait(token.actor, 'ci', 'poisoned')) return;
    let template = await fromUuid(trigger.templateUuid);
    if (!template) return;
    if (mba.inCombat()) {
        let turn = game.combat.round + '-' + game.combat.turn;
        let lastTurn = template.flags['mba-premades']?.spell?.stinkingCloud?.[token.id]?.turn;
        if (turn === lastTurn) return;
        await template.setFlag('mba-premades', 'spell.stinkingCloud.' + token.id + '.turn', turn);
    }
    let originUuid = template.flags.dnd5e?.origin;
    if (!originUuid) return;
    let originItem = await fromUuid(originUuid);
    if (!originItem) return;
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Stinking Cloud: Nauseating Gas", false);
    if (!featureData) return;
    featureData.system.save.dc = trigger.saveDC;
    delete featureData._id;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': originItem.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([token.uuid]);
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (!featureWorkflow.failedSaves.size) return;
    async function effectMacroStart() {
        await new Dialog({
            title: "Stinking Cloud",
            content: "You are nauseated by Stinking Cloud and must spend your action retching and reeling.",
            buttons: {
                ok: {
                    label: "Ok 😔",
                }
            }
        }).render(true);
    }
    const effectData = {
        'name': "Nauseated",
        'icon': "modules/mba-premades/icons/conditions/nauseated.webp",
        'description': "You are nauseated by Stinking Cloud and must spend your action retching and reeling.",
        'flags': {
            'effectmacro': {
                'onCreate': {
                    'script': mba.functionToString(effectMacroStart)
                }
            },
            'dae': {
                'showIcon': true,
                'specialDuration': ['turnStart']
            }
        }
    };
    await mba.createEffect(token.actor, effectData)
}

export let stinkingCloud = {
    'item': item,
    'trigger': trigger,
    'enter': enter
}