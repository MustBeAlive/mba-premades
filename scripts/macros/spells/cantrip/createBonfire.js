async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let choices = [
        ['Blue', 'blue'],
        ['Green', 'green'],
        ['Orange', 'orange'],
        ['Purple', 'purple']
    ];
    let selection = await chrisPremades.helpers.dialog('Choose Bonfire color:', choices);
    if (!selection) return;

    let animation1 = "jb2a.impact.005." + selection;
    let animation2 = "jb2a.ground_cracks." + selection + ".02";
    let animation3 = "jb2a.particles.outward." + selection + ".01.03";
    if (selection === "green") animation3 = "jb2a.particles.outward.greenyellow.01.03";
    let animation4 = "jb2a.magic_signs.circle.02.conjuration.loop." + selection;
    if (selection === "orange") animation4 = "jb2a.magic_signs.circle.02.conjuration.loop.yellow";
    let animation5 = "jb2a.bonfire.02." + selection;
    let template = canvas.scene.collections.templates.get(workflow.templateId);

    new Sequence()

        .effect()
        .file(animation1)
        .atLocation(template, { offset: { y: -0 }, gridUnits: true })
        .scaleToObject(2.5)
        .fadeOut(1000, { ease: "easeInExpo" })
        .attachTo(template, { bindAlpha: false })
        .zIndex(5)

        .wait(100)

        .effect()
        .file(animation2)
        .atLocation(template)
        .fadeIn(500, { ease: "easeOutCirc" })
        .fadeOut(5000, { ease: "easeOutQuint" })
        .duration(10000)
        .opacity(1)
        .randomRotation()
        .belowTokens()
        .size(2, { gridUnits: true })
        .zIndex(0.2)

        .effect()
        .file(animation3)
        .atLocation(template)
        .fadeIn(250, { ease: "easeOutQuint" })
        .scaleIn(0, 200, { ease: "easeOutCubic" })
        .fadeOut(5000, { ease: "easeOutQuint" })
        .opacity(1)
        .filter("ColorMatrix", { saturate: 0, brightness: 1 })
        .randomRotation()
        .scaleToObject(2)
        .duration(10000)

        .effect()
        .file(animation4)
        .atLocation(template)
        .scaleIn(0, 200, { ease: "easeOutCubic" })
        .belowTokens()
        .scaleToObject(2.2)
        .duration(1200)
        .fadeIn(200, { ease: "easeOutCirc", delay: 200 })
        .fadeOut(300, { ease: "linear" })
        .filter("ColorMatrix", { saturate: -1, brightness: 2 })
        .filter("Blur", { blurX: 5, blurY: 10 })
        .zIndex(0.1)

        .effect()
        .file(animation4)
        .atLocation(template)
        .filter("ColorMatrix", { saturate: -0, brightness: 1.1 })
        .scaleIn(0, 200, { ease: "easeOutCubic" })
        .belowTokens()
        .scaleToObject(2.2)
        .fadeOut(5000, { ease: "easeOutQuint" })
        .duration(10000)

        .effect()
        .file(animation5)
        .atLocation(template)
        .size(2.2, { gridUnits: true })
        .fadeOut(1000, { ease: "easeInExpo" })
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .attachTo(template, { bindAlpha: false })
        .belowTokens()
        .zIndex(0.3)
        .persist()
        .name('Create Bonfire')

        .animation()
        .on(template)
        .fadeIn(250)

        .play()

    let level = workflow.actor.system.details.level ?? workflow.actor.system.details.cr;
    let dice = 1 + (Math.floor((level + 1) / 6));
    if (!template) return;
    await template.update({
        'flags': {
            'mba-premades': {
                'template': {
                    'name': 'createBonfire',
                    'castLevel': workflow.castData.castLevel,
                    'saveDC': chrisPremades.helpers.getSpellDC(workflow.item),
                    'macroName': 'createBonfire',
                    'templateUuid': template.uuid,
                    'turn': 'end',
                    'ignoreMove': true,
                    'dice': dice
                }
            }
        }
    });
}

async function trigger(token, trigger) {
    let template = await fromUuid(trigger.templateUuid);
    if (!template) return;
    if (chrisPremades.helpers.inCombat()) {
        let turn = game.combat.round + '-' + game.combat.turn;
        let lastTurn = template.flags['mba-premades']?.spell?.createBonfire?.[token.id]?.turn;
        if (turn === lastTurn) return;
        await template.setFlag('mba-premades', 'spell.createBonfire.' + token.id + '.turn', turn);
    }
    let originUuid = template.flags.dnd5e?.origin;
    if (!originUuid) return;
    let originItem = await fromUuid(originUuid);
    if (!originItem) return;
    let featureData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Spell Features', 'Create Bonfire: Damage', false);
    if (!featureData) return;
    featureData.system.save.dc = trigger.saveDC;
    featureData.system.damage.parts[0][0] = trigger.dice + "d8[fire]";
    delete featureData._id;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': originItem.actor });
    let [config, options] = chrisPremades.constants.syntheticItemWorkflowOptions([token.uuid]);
    await MidiQOL.completeItemUse(feature, config, options);
}

async function end(template, token) {
    if (chrisPremades.helpers.inCombat()) {
        let prev = game.combat.turn;
        if (prev != 0) prev = game.combat.turn - 1;
        else if (prev === 0) prev = game.combat.turns.length - 1;
        let turn = game.combat.round + '-' + prev;
        let lastTurn = template.flags['mba-premades']?.spell?.createBonfire?.[token.id]?.turn;
        if (turn === lastTurn) return;
    }
    let trigger = template.flags['mba-premades']?.template;
    if (!trigger) return;
    await createBonfire.trigger(token.document, trigger);
}

async function enter(template, token) {
    let trigger = template.flags['mba-premades']?.template;
    if (!trigger) return;
    await createBonfire.trigger(token.document, trigger);
}

async function del() {
    await Sequencer.EffectManager.endEffects({ name: "Create Bonfire" })
}

export let createBonfire = {
    'item': item,
    'trigger': trigger,
    'end': end,
    'enter': enter,
    'del': del
}