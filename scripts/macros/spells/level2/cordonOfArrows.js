// To do: cast animation
async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let tokenDoc = workflow.token.document;
    let tokens = await chrisPremades.helpers.findNearby(tokenDoc, 300, "ally", false, false);
    let selection = await chrisPremades.helpers.selectTarget(workflow.item.name, chrisPremades.constants.okCancel, tokens, false, 'multiple', undefined, false, 'Choose targets to be ignored by Cordon of Arrows:');
    if (!selection.buttons) return;
    let newTargets = selection.inputs.filter(i => i);
    chrisPremades.helpers.updateTargets(newTargets);
    let ignoreIds = [];
    ignoreIds.push(workflow.token.id);
    for (let i of Array.from(game.user.targets)) ignoreIds.push(i.id);
    let ammount = workflow.castData.castLevel * 2;
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;
    await template.update({
        'flags': {
            'mba-premades': {
                'template': {
                    'name': 'cordonOfArrows',
                    'castLevel': workflow.castData.castLevel,
                    'saveDC': chrisPremades.helpers.getSpellDC(workflow.item),
                    'macroName': 'cordonOfArrows',
                    'templateUuid': template.uuid,
                    'turn': 'end',
                    'ignoreMove': true,
                    'ammount': ammount,
                    'ignoreIds': ignoreIds
                }
            }
        }
    });
}

async function trigger(token, trigger) {
    let template = await fromUuid(trigger.templateUuid);
    if (!template) return;
    if (template.flags['mba-premades']?.template?.ignoreIds.includes(token.id)) return;
    if (chrisPremades.helpers.inCombat()) {
        let turn = game.combat.round + '-' + game.combat.turn;
        let lastTurn = template.flags['mba-premades']?.spell?.cordonOfArrows?.[token.id]?.turn;
        if (turn === lastTurn) return;
        await template.setFlag('mba-premades', 'spell.cordonOfArrows.' + token.id + '.turn', turn);
    }
    let originUuid = template.flags.dnd5e?.origin;
    if (!originUuid) return;
    let originItem = await fromUuid(originUuid);
    if (!originItem) return;
    let featureData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Spell Features', 'Cordon of Arrows: Arrow Strike', false);
    if (!featureData) return;
    featureData.system.save.dc = trigger.saveDC;
    delete featureData._id;
    let ammount = template.flags['mba-premades']?.template?.ammount;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': originItem.actor });
    let [config, options] = chrisPremades.constants.syntheticItemWorkflowOptions([token.uuid]);
    await MidiQOL.completeItemUse(feature, config, options);

    new Sequence()
        .effect()
        .atLocation(template)
        .stretchTo(token, { attachTo: true })
        .file("jb2a.arrow.physical.blue")

        .play();

    await template.update({
        'flags': {
            'mba-premades': {
                'template': {
                    'ammount': ammount - 1,
                }
            }
        }
    });
    if (template.flags['mba-premades']?.template?.ammount < 1) {
        let effect = await chrisPremades.helpers.findEffect(originItem.actor, "Cordon of Arrows Template");
        if (!effect) return;
        await chrisPremades.helpers.removeEffect(effect);
    }
}

async function end(template, token) {
    if (chrisPremades.helpers.inCombat()) {
        let prev = game.combat.turn;
        if (prev != 0 ) prev = game.combat.turn - 1;
        else if (prev === 0) prev = game.combat.turns.length - 1;
        let turn = game.combat.round + '-' + prev;
        let lastTurn = template.flags['mba-premades']?.spell?.cordonOfArrows?.[token.id]?.turn;
        if (turn === lastTurn) return;
    }
    let trigger = template.flags['mba-premades']?.template;
    if (!trigger) return;
    await cordonOfArrows.trigger(token.document, trigger);
}

async function enter(template, token) {
    let trigger = template.flags['mba-premades']?.template;
    if (!trigger) return;
    await cordonOfArrows.trigger(token.document, trigger);
}

export let cordonOfArrows = {
    'item': item,
    'trigger': trigger,
    'end': end,
    'enter': enter
}