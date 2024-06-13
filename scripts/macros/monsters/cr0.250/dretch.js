import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function fetidCloudCast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);

    new Sequence()

        .effect()
        .file("jaamod.smoke.poison_cloud")
        .attachTo(template)
        .scaleIn(0, 1500, { ease: "easeOutCubic" })
        .scaleOut(0, 1500, { ease: "linear" })
        .fadeIn(200)
        .fadeOut(1000)
        .zIndex(2)
        .filter("ColorMatrix", { hue: 295 })
        .playbackRate(0.7)
        .size(5.5, { gridUnits: true })

        .effect()
        .delay(1500)
        .file("jb2a.fog_cloud.02.green02")
        .attachTo(template)
        .fadeIn(1500)
        .fadeOut(1500)
        .opacity(0.7)
        .zIndex(1)
        .randomRotation()
        .scaleOut(0, 1500, { ease: "linear" })
        .scaleIn(0, 1500, { ease: "easeOutCubic" })
        .size(5.8, { gridUnits: true })
        .persist()
        .name(`Dretch Fetid Cloud`)

        .play()
}

async function fetidCloudItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;
    await template.update({
        'flags': {
            'mba-premades': {
                'template': {
                    'saveDC': 12,
                    'templateUuid': template.uuid,
                }
            }
        }
    });
}

async function fetidCloudEnter(template, token) {
    let trigger = template.flags['mba-premades']?.template;
    if (!trigger) return;
    await dretch.fetidCloudTrigger(token.document, trigger);
}

async function fetidCloudTrigger(token, trigger) {
    if (mba.checkTrait(token.actor, 'ci', 'poisoned')) return;
    let template = await fromUuid(trigger.templateUuid);
    if (!template) return;
    if (mba.inCombat()) {
        let turn = game.combat.round + '-' + game.combat.turn;
        let lastTurn = template.flags['mba-premades']?.feature?.dretchFetidCloud?.[token.id]?.turn;
        if (turn === lastTurn) return;
        await template.setFlag('mba-premades', 'feature.dretchFetidCloud.' + token.id + '.turn', turn);
    }
    let originUuid = template.flags.dnd5e?.origin;
    if (!originUuid) return;
    let originItem = await fromUuid(originUuid);
    if (!originItem) return;
    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Monster Features', 'Fetid Cloud: Nauseating Gas', false);
    if (!featureData) return;
    delete featureData._id;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': originItem.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([token.uuid]);
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (!featureWorkflow.failedSaves.size) return;
    async function effectMacroStart() {
        await new Dialog({
            title: "Fetid Cloud",
            content: `
                <p>You are nauseated by Dretch's Fetid Cloud and are poisoned until the start of your next turn.</p>
                <p>While poisoned in this way, you can take <b>either action or a bonus action, not both</b> and <b>can't take reactions.</b></p>
            `,
            buttons: {
                ok: {
                    label: "Ok 😔",
                }
            }
        }).render(true);
    }
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Fetid Cloud` })
    }
    const effectData = {
        'name': "Dretch: Fetid Cloud",
        'icon': "modules/mba-premades/icons/conditions/nauseated.webp",
        'description': `
            <p>You are nauseated by Dretch's Fetid Cloud and are poisoned until the start of your next turn.</p>
            <p>While poisoned in this way, you can take <b>either action or a bonus action, not both</b> and <b>can't take reactions.</b></p>
        `,
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Poisoned",
                'priority': 20
            },
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Reaction",
                'priority': 20
            },
        ],
        'flags': {
            'effectmacro': {
                'onCreate': {
                    'script': mba.functionToString(effectMacroStart)
                },
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'dae': {
                'showIcon': true,
                'specialDuration': ['turnStart']
            }
        }
    };
    new Sequence()

        .effect()
        .file("jb2a.smoke.puff.centered.green.2")
        .attachTo(token)
        .scaleToObject(2 * token.texture.scaleX)

        .effect()
        .file("jb2a.template_circle.symbol.normal.poison.dark_green")
        .delay(500)
        .attachTo(token)
        .fadeIn(500)
        .fadeOut(500)
        .scaleToObject(1.8 * token.texture.scaleX)
        .randomRotation()
        .mask(token)
        .persist()
        .name(`${token.name} Fetid Cloud`)

        .thenDo(async () => {
            await mba.createEffect(token.actor, effectData)
        })

        .play()
}

async function fetidCloudDel() {
    await Sequencer.EffectManager.endEffects({ name: `Dretch Fetid Cloud` })
}

export let dretch = {
    'fetidCloudCast': fetidCloudCast,
    'fetidCloudItem': fetidCloudItem,
    'fetidCloudTrigger': fetidCloudTrigger,
    'fetidCloudEnter': fetidCloudEnter,
    'fetidCloudDel': fetidCloudDel
}