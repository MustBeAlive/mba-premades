async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;
    new Sequence()

        .wait(500)

        .effect()
        .attachTo(template)
        .file(`jb2a.magic_signs.circle.02.conjuration.complete.dark_yellow`)
        .size(8, { gridUnits: true })
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
        .file("jb2a.darkness.black")
        .attachTo(template)
        .delay(2500)
        .fadeIn(3000)
        .fadeOut(1500)
        .opacity(0.7)
        .zIndex(3)
        .randomRotation()
        .scaleOut(0, 1500, { ease: "linear" })
        .scaleIn(0, 5000, { ease: "easeOutCubic" })
        .size(8.8, { gridUnits: true })
        .persist()
        .name(`Hunger of Hadar`)

        .effect()
        .file("jb2a.template_circle.aura.01.loop.large.bluepurple")
        .attachTo(template)
        .delay(2500)
        .fadeIn(3000)
        .fadeOut(1500)
        .scaleOut(0, 1500, { ease: "linear" })
        .scaleIn(0, 5000, { ease: "easeOutCubic" })
        .size(8.8, { gridUnits: true })
        .opacity(0.5)
        .playbackRate(1)
        .zIndex(2)
        .persist()
        .name(`Hunger of Hadar`)

        .effect()
        .file("jaamod.spells_effects.tentacles_black2")
        .attachTo(template)
        .delay(2500)
        .fadeIn(3000)
        .fadeOut(1500)
        .scaleOut(0, 1500, { ease: "linear" })
        .scaleIn(0, 5000, { ease: "easeOutCubic" })
        .size(8.8, { gridUnits: true })
        .opacity(0.5)
        .playbackRate(0.8)
        .zIndex(1)
        .persist()
        .name(`Hunger of Hadar`)

        .effect()
        .file("jb2a.impact.ground_crack.frost.01.white")
        .attachTo(template)
        .delay(2500)
        .fadeIn(3000)
        .fadeOut(1500)
        .opacity(0.5)
        .zIndex(0)
        .randomRotation()
        .scaleOut(0, 1500, { ease: "linear" })
        .scaleIn(0, 5000, { ease: "easeOutCubic" })
        .size(8.8, { gridUnits: true })
        .persist()
        .endTime(3400)
        .noLoop()
        .name(`Hunger of Hadar`)

        .play()

    await template.update({
        'flags': {
            'mba-premades': {
                'template': {
                    'name': 'hungerOfHadar',
                    'castLevel': workflow.castData.castLevel,
                    'saveDC': chrisPremades.helpers.getSpellDC(workflow.item),
                    'templateUuid': template.uuid
                }
            },
            'walledtemplates': {
                'wallRestriction': 'move',
                'wallsBlock': 'walled'
            }
        }
    });
    if (!game.modules.get("ActiveAuras")?.active) {
        ui.notifications.warn("ActiveAuras is not enabled!");
        return;
    }
    AAhelpers.applyTemplate(args);
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': ``,
        'duration': {
            'seconds': 60
        },
        'flags': {
            'midi-qol': {
                'castData': {
                    baseLevel: 3,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    await chrisPremades.helpers.createEffect(workflow.actor, effectData);
}

async function turnStart(template, token) {
    let trigger = template.flags['mba-premades']?.template;
    if (!trigger) return;
    let originUuid = template.flags.dnd5e?.origin;
    if (!originUuid) return;
    let originItem = await fromUuid(originUuid);
    if (!originItem) return;
    let featureData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Spell Features', 'Hunger of Hadar: Bitter Cold', false);
    if (!featureData) return;
    featureData.system.save.dc = trigger.saveDC;
    delete featureData._id;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': originItem.actor });
    let [config, options] = chrisPremades.constants.syntheticItemWorkflowOptions([token.document.uuid]);
    await MidiQOL.completeItemUse(feature, config, options);
}

async function turnEnd(template, token) {
    let trigger = template.flags['mba-premades']?.template;
    if (!trigger) return;
    let originUuid = template.flags.dnd5e?.origin;
    if (!originUuid) return;
    let originItem = await fromUuid(originUuid);
    if (!originItem) return;
    let featureData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Spell Features', 'Hunger of Hadar: Milky Tentacles', false);
    if (!featureData) return;
    featureData.system.save.dc = trigger.saveDC;
    delete featureData._id;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': originItem.actor });
    let [config, options] = chrisPremades.constants.syntheticItemWorkflowOptions([token.document.uuid]);
    await MidiQOL.completeItemUse(feature, config, options);
}

export let hungerOfHadar = {
    'cast': cast,
    'turnStart': turnStart,
    'turnEnd': turnEnd
}