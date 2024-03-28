async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    new Sequence()

        .effect()
        .atLocation(token)
        .file(`jb2a.magic_signs.circle.02.conjuration.loop.green`)
        .scaleToObject(1.5)
        .rotateIn(180, 600, { ease: "easeOutCubic" })
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .loopProperty("sprite", "rotation", { from: 0, to: -360, duration: 10000 })
        .belowTokens()
        .fadeOut(2000)
        .zIndex(0)

        .effect()
        .atLocation(token)
        .file(`jb2a.magic_signs.circle.02.conjuration.complete.green`)
        .scaleToObject(2)
        .rotateIn(180, 600, { ease: "easeOutCubic" })
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .loopProperty("sprite", "rotation", { from: 0, to: -360, duration: 10000 })
        .belowTokens(true)
        .filter("ColorMatrix", { saturate: -1, brightness: 2 })
        .filter("Blur", { blurX: 5, blurY: 10 })
        .zIndex(1)
        .duration(1200)
        .fadeIn(200, { ease: "easeOutCirc", delay: 500 })
        .fadeOut(300, { ease: "linear" })

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
        .opacity(0.7)
        .zIndex(1)
        .randomRotation()
        .scaleOut(0, 1500, { ease: "linear" })
        .fadeOut(1000)
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
                    'saveDC': chrisPremades.helpers.getSpellDC(workflow.item),
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
    if (chrisPremades.helpers.checkTrait(token.actor, 'ci', 'poisoned')) return;
    let template = await fromUuid(trigger.templateUuid);
    if (!template) return;
    if (chrisPremades.helpers.inCombat()) {
        let turn = game.combat.round + '-' + game.combat.turn;
        let lastTurn = template.flags['mba-premades']?.spell?.stinkingCloud?.[token.id]?.turn;
        if (turn === lastTurn) return;
        await template.setFlag('mba-premades', 'spell.stinkingCloud.' + token.id + '.turn', turn);
    }
    let originUuid = template.flags.dnd5e?.origin;
    if (!originUuid) return;
    let originItem = await fromUuid(originUuid);
    if (!originItem) return;
    let featureData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Spell Features', 'Stinking Cloud: Nauseating Gas', false);
    if (!featureData) return;
    featureData.system.save.dc = trigger.saveDC;
    delete featureData._id;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': originItem.actor });
    let [config, options] = chrisPremades.constants.syntheticItemWorkflowOptions([token.uuid]);
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (!featureWorkflow.failedSaves.size) return;
    async function effectMacroStart() {
        await new Dialog({
            title: "Stinking Cloud",
            content: "You are nauseated by Stinking Cloud and must spend your action retching and reeling.",
            buttons: {
                ok: {
                    label: "Ok 😔",
                    callback: async (html) => {
                        return;
                    }
                }
            }
        }).render(true);
    }
    const effectData = {
        'name': "Nauseated",
        'icon': "assets/library/icons/sorted/conditions/nauseated.png",
        'description': "You are nauseated by Stinking Cloud and must spend your action retching and reeling.",
        'flags': {
            'effectmacro': {
                'onCreate': {
                    'script': chrisPremades.helpers.functionToString(effectMacroStart)
                }
            },
            'dae': {
                'showIcon': true,
                'specialDuration': ['turnStart']
            }
        }
    };
    await chrisPremades.helpers.createEffect(token.actor, effectData)
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