//Animation by EskieMoh#2969
//Adjusted; Original macro by CPR
async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    new Sequence()

        .effect()
        .atLocation(token)
        .file(`jb2a.magic_signs.circle.02.conjuration.loop.yellow`)
        .scaleToObject(1.25)
        .rotateIn(180, 600, { ease: "easeOutCubic" })
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .loopProperty("sprite", "rotation", { from: 0, to: -360, duration: 10000 })
        .belowTokens()
        .fadeOut(2000)
        .zIndex(0)

        .effect()
        .atLocation(token)
        .file(`jb2a.magic_signs.circle.02.conjuration.complete.dark_yellow`)
        .scaleToObject(1.25)
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
        .file(`jb2a.magic_signs.circle.02.conjuration.complete.dark_yellow`)
        .size(2.2, { gridUnits: true })
        .fadeIn(600)
        .opacity(1)
        .rotateIn(180, 600, { ease: "easeOutCubic" })
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .belowTokens()

        .effect()
        .file("jb2a.particles.outward.white.01.02")
        .scaleIn(0, 500, { ease: "easeOutQuint" })
        .delay(500)
        .fadeOut(1000)
        .atLocation(token)
        .duration(1000)
        .size(1.75, { gridUnits: true })
        .animateProperty("spriteContainer", "position.y", { from: 0, to: -0.5, gridUnits: true, duration: 1000 })
        .zIndex(1)
        .waitUntilFinished(500)

        .effect()
        .file("jb2a.water_splash.circle.01.black")
        .atLocation(template)
        .scaleIn(0, 1500, { ease: "easeOutCubic" })
        .scaleOut(0, 1500, { ease: "linear" })
        .fadeIn(500)
        .fadeOut(1000)
        .belowTokens()
        .zIndex(2)
        .size(1.5, { gridUnits: true })

        .effect()
        .delay(100)
        .file('jb2a.grease.dark_brown')
        .atLocation(template)
        .belowTokens()
        .fadeIn(5000)
        .zIndex(1)
        .randomRotation()
        .scaleOut(0, 1500, { ease: "linear" })
        .fadeOut(1000)
        .scaleIn(0, 5000, { ease: "easeOutCubic" })
        .size(2.2, { gridUnits: true })
        .persist()
        .name('Grease')

        .play()
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;
    await template.update({
        'flags': {
            'mba-premades': {
                'template': {
                    'name': 'grease',
                    'castLevel': workflow.castData.castLevel,
                    'saveDC': chrisPremades.helpers.getSpellDC(workflow.item),
                    'macroName': 'grease',
                    'templateUuid': template.uuid,
                    'turn': 'end',
                    'ignoreMove': true
                }
            }
        }
    });
    if (!workflow.failedSaves.size) return;
    for (let i of Array.from(workflow.failedSaves)) {
        await chrisPremades.helpers.addCondition(i.actor, 'Prone');
    }
}

async function trigger(token, trigger) {
    if (chrisPremades.helpers.checkTrait(token.actor, 'ci', 'prone')) return;
    if (chrisPremades.helpers.findEffect(token.actor, "Prone")) return;
    let template = await fromUuid(trigger.templateUuid);
    if (!template) return;
    if (chrisPremades.helpers.inCombat()) {
        let turn = game.combat.round + '-' + game.combat.turn;
        let lastTurn = template.flags['mba-premades']?.spell?.grease?.[token.id]?.turn;
        if (turn === lastTurn) return;
        await template.setFlag('mba-premades', 'spell.grease.' + token.id + '.turn', turn);
    }
    let originUuid = template.flags.dnd5e?.origin;
    if (!originUuid) return;
    let originItem = await fromUuid(originUuid);
    if (!originItem) return;
    let featureData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Spell Features', 'Grease: Fall', false);
    if (!featureData) return;
    featureData.system.save.dc = trigger.saveDC;
    delete featureData._id;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': originItem.actor });
    let [config, options] = chrisPremades.constants.syntheticItemWorkflowOptions([token.uuid]);
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (!featureWorkflow.failedSaves.size) return;
    await chrisPremades.helpers.addCondition(token.actor, "Prone");
}

async function end(template, token) {
    if (chrisPremades.helpers.inCombat()) {
        let prev = game.combat.turn;
        if (prev != 0) prev = game.combat.turn - 1;
        else if (prev === 0) prev = game.combat.turns.length - 1;
        let turn = game.combat.round + '-' + prev;
        let lastTurn = template.flags['mba-premades']?.spell?.grease?.[token.id]?.turn;
        if (turn === lastTurn) return;
    }
    let trigger = template.flags['mba-premades']?.template;
    if (!trigger) return;
    await grease.trigger(token.document, trigger);
}

async function enter(template, token) {
    let trigger = template.flags['mba-premades']?.template;
    if (!trigger) return;
    await grease.trigger(token.document, trigger);
}

async function del() {
    await Sequencer.EffectManager.endEffects({ name: "Grease" })
}

export let grease = {
    'cast': cast,
    'item': item,
    'end': end,
    'trigger': trigger,
    'enter': enter,
    'del': del
}