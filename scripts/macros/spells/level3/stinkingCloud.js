async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    new Sequence()

        .wait(1000)

        .effect()
        .atLocation(template)
        .file(`jb2a.magic_signs.circle.02.conjuration.complete.green`)
        .size(6, { gridUnits: true })
        .fadeIn(600)
        .opacity(1)
        .rotateIn(180, 600, { ease: "easeOutCubic" })
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .belowTokens()
        .playbackRate(1.2)

        .effect()
        .file("jaamod.smoke.poison_cloud")
        .atLocation(template)
        .scaleIn(0, 1500, { ease: "easeOutCubic" })
        .scaleOut(0, 1500, { ease: "linear" })
        .fadeIn(200)
        .fadeOut(1000)
        .zIndex(2)
        .delay(1500)
        .filter("ColorMatrix", { hue: 295 })
        .playbackRate(0.7)
        .size(6, { gridUnits: true })

        .effect()
        .delay(2500)
        .file("jb2a.fog_cloud.02.green02")
        .atLocation(template)
        .fadeIn(5000)
        .fadeOut(1500)
        .opacity(0.7)
        .zIndex(1)
        .randomRotation()
        .scaleOut(0, 1500, { ease: "linear" })
        .scaleIn(0, 5000, { ease: "easeOutCubic" })
        .size(8.8, { gridUnits: true })
        .persist()
        .name('Stinking Cloud')

        .play()
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;
    await template.update({
        'flags': {
            'mba-premades': {
                'template': {
                    'name': 'stinkingCloud',
                    'castLevel': workflow.castData.castLevel,
                    'saveDC': mbaPremades.helpers.getSpellDC(workflow.item),
                    'macroName': 'stinkingCloud',
                    'templateUuid': template.uuid,
                    'turn': 'end',
                    'ignoreMove': true,
                }
            }
        }
    });
}

async function trigger(token, trigger) {
    if (mbaPremades.helpers.checkTrait(token.actor, 'ci', 'poisoned')) return;
    let template = await fromUuid(trigger.templateUuid);
    if (!template) return;
    if (mbaPremades.helpers.inCombat()) {
        let turn = game.combat.round + '-' + game.combat.turn;
        let lastTurn = template.flags['mba-premades']?.spell?.stinkingCloud?.[token.id]?.turn;
        if (turn === lastTurn) return;
        await template.setFlag('mba-premades', 'spell.stinkingCloud.' + token.id + '.turn', turn);
    }
    let originUuid = template.flags.dnd5e?.origin;
    if (!originUuid) return;
    let originItem = await fromUuid(originUuid);
    if (!originItem) return;
    let featureData = await mbaPremades.helpers.getItemFromCompendium('mba-premades.MBA Spell Features', 'Stinking Cloud: Nauseating Gas', false);
    if (!featureData) return;
    featureData.system.save.dc = trigger.saveDC;
    delete featureData._id;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': originItem.actor });
    let [config, options] = mbaPremades.constants.syntheticItemWorkflowOptions([token.uuid]);
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
                    'script': mbaPremades.helpers.functionToString(effectMacroStart)
                }
            },
            'dae': {
                'showIcon': true,
                'specialDuration': ['turnStart']
            }
        }
    };
    await mbaPremades.helpers.createEffect(token.actor, effectData)
}

async function enter(template, token) {
    let trigger = template.flags['mba-premades']?.template;
    if (!trigger) return;
    await stinkingCloud.trigger(token.document, trigger);
}

async function del() {
    await Sequencer.EffectManager.endEffects({ name: "Stinking Cloud" })
}

export let stinkingCloud = {
    'cast': cast,
    'item': item,
    'trigger': trigger,
    'enter': enter,
    'del': del
}