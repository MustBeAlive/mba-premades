async function animation(target, token, attackType) {
    let hitSeq = new Sequence()

        .effect()
        .from(target)
        .atLocation(target)
        .fadeIn(100)
        .fadeOut(100)
        .loopProperty('sprite', 'position.x', { 'from': -0.05, 'to': 0.05, 'duration': 75, 'pingPong': true, 'gridUnits': true })
        .scaleToObject(target.document.texture.scaleX)
        .duration(500)
        .opacity(0.15)
        .tint('#fd0706')

        .effect()
        .file('jb2a.particles.outward.red.01.04')
        .atLocation(target)
        .fadeIn(100)
        .fadeOut(400)
        .scaleIn(0, 500, { 'ease': 'easeOutCubic' })
        .scaleToObject(1.65 * target.document.texture.scaleX)
        .duration(800)
        .opacity(1)
        .randomRotation(true)
        .filter('ColorMatrix', { 'saturate': 1 })
        .belowTokens(true);

    switch (attackType) {
        case 'slashing':
            new Sequence()

                .effect()
                .file('animated-spell-effects-cartoon.water.105')
                .atLocation(token)
                .scale(0.2 * token.document.width)
                .rotateTowards(target)
                .spriteRotation(80)
                .spriteOffset({ 'x': -0.15 * token.document.width, 'y': -0.1 * token.document.width }, { 'gridUnits': true })
                .filter('ColorMatrix', { saturate: 0.75 })
                .rotateIn(-45, 250, { 'ease': 'easeOutExpo' })
                .zIndex(1)

                .effect()
                .file('jb2a.melee_generic.slashing.one_handed')
                .atLocation(token)
                .scale(0.5 * token.document.width)
                .rotateTowards(target)
                .mirrorY()
                .spriteOffset({ 'x': - 1.7 * token.document.width }, { 'gridUnits': true })
                .filter('ColorMatrix', { 'saturate': -1, 'brightness': -1 })
                .rotateIn(-90, 250, { 'ease': 'easeOutBack' })
                .zIndex(0)

                .thenDo(function () {
                    hitSeq.play();
                })
                .play();

            return;

        case 'bludgeoning':
            new Sequence()

                .effect()
                .file('animated-spell-effects-cartoon.water.115')
                .atLocation(target)
                .scale(0.17 * token.document.width)
                .rotateTowards(token)
                .spriteRotation(0)
                .spriteOffset({ 'x': -0.45 * token.document.width, 'y': 0 }, { 'gridUnits': true })
                .filter('ColorMatrix', { 'saturate': 0.75 })
                .scaleIn(0, 250, { 'ease': 'easeOutExpo' })
                .zIndex(1)

                .effect()
                .file('jb2a.melee_generic.bludgeoning.two_handed')
                .atLocation(target)
                .scale(0.4 * token.document.width)
                .rotateTowards(token)
                .spriteRotation(180)
                .spriteOffset({ 'x': -1 * token.document.width, 'y': 0 }, { 'gridUnits': true })
                .filter('ColorMatrix', { 'saturate': -1, 'brightness': -1 })
                .scaleIn(0, 250, { 'ease': 'easeOutExpo' })
                .zIndex(0)

                .thenDo(function () {
                    hitSeq.play();
                })

                .play();

            return;

        case 'ranged':
            new Sequence()

                .effect()
                .file('animated-spell-effects-cartoon.water.109')
                .atLocation(target)
                .scale(0.2 * token.document.width)
                .rotateTowards(token)
                .spriteRotation(0)
                .spriteOffset({ 'x': -0.3 * token.document.width, 'y': 0 }, { 'gridUnits': true })
                .filter('ColorMatrix', { 'saturate': 0.75 })
                .scaleIn(0, 250, { 'ease': 'easeOutExpo' })
                .zIndex(1)

                .effect()
                .file('animated-spell-effects-cartoon.water.115')
                .atLocation(target)
                .scale({ 'x': 0.1 * token.document.width, 'y': 0.2 * token.document.width })
                .rotateTowards(token)
                .spriteRotation(0)
                .spriteOffset({ 'x': -0.4 * token.document.width, 'y': 0 }, { 'gridUnits': true })
                .filter('ColorMatrix', { 'saturate': -1, 'brightness': -1 })
                .scaleIn(0, 250, { 'ease': 'easeOutExpo' })
                .zIndex(0)

                .thenDo(function () {
                    hitSeq.play();
                })
                .play();

            return;

        default:
            new Sequence()

                .effect()
                .file('animated-spell-effects-cartoon.water.107')
                .atLocation(token)
                .scale(0.25 * token.document.width)
                .rotateTowards(target)
                .spriteRotation(18)
                .spriteOffset({ 'x': -0.6 * token.document.width, 'y': -0.25 * token.document.width }, { 'gridUnits': true })
                .filter('ColorMatrix', { 'saturate': 0.75 })
                .rotateIn(-25, 250, { 'ease': 'easeOutExpo' })
                .zIndex(1)

                .effect()
                .file('jb2a.melee_generic.piercing.one_handed')
                .atLocation(token)
                .scale(0.5 * token.document.width)
                .rotateTowards(target)
                .spriteRotation(15)
                .mirrorY()
                .spriteOffset({ 'x': -1.9 * token.document.width, 'y': -0.3 * token.document.width }, { 'gridUnits': true })
                .filter('ColorMatrix', { 'saturate': -1, 'brightness': -1 })
                .rotateIn(-25, 250, { 'ease': 'easeOutExpo' })
                .zIndex(0)

                .thenDo(function () {
                    hitSeq.play();
                })

                .play();

            return;
    }
}

async function attack({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.hitTargets.size != 1) return;
    if (!(workflow.item.system.actionType === 'rwak' || workflow.item.system.properties.fin === true)) return;
    let originFeature = workflow.actor.items.find(i => i.name === "Sneak Attack");
    if (!originFeature) return;
    let currentTurn = game.combat.round + '-' + game.combat.turn;
    if (currentTurn === originFeature.flags['mba-premades']?.feature?.sneakAttack?.turn) return;
    let doSneak = false;
    let displayRakish = false;
    if (workflow.advantage) doSneak = true;
    let target = workflow.targets.first();
    if (!doSneak && !workflow.disadvantage) {
        let nearbyTokens = await chrisPremades.helpers.findNearby(target, 5, 'enemy').filter(i => i.id != workflow.token.id);
        if (nearbyTokens.length > 0) doSneak = true;
    }
    let rakishAudacity = chrisPremades.helpers.getItem(workflow.actor, 'Rakish Audacity');
    if (rakishAudacity && !workflow.disadvantage && !doSneak && (chrisPremades.helpers.getDistance(workflow.token, target) <= 5)) {
        let rNearbyTokens = await chrisPremades.helpers.findNearby(workflow.token, 5, 'all', true).filter(t => t.id != target.id);
        if (rNearbyTokens.length === 0) {
            doSneak = true;
            displayRakish = true;
        }
    }
    let insightfulFighting = chrisPremades.helpers.findEffect(workflow.actor, 'Insightful Fighting');
    let iTarget = false;
    if (insightfulFighting) {
        let effectTarget = insightfulFighting.changes[0].value;
        if (effectTarget === target.document.uuid) {
            doSneak = true;
            iTarget = true;
        }
    }
    if (!doSneak) return;
    let queueSetup = await chrisPremades.queue.setup(workflow.item.uuid, 'sneakAttack', 215);
    if (!queueSetup) return;
    let sneakDialog = true;
    if (sneakDialog === true) {
        let selection = await chrisPremades.helpers.dialog(originFeature.name, chrisPremades.constants.yesNo, 'Use ' + originFeature.name + '?');
        if (!selection) {
            chrisPremades.queue.remove(workflow.item.uuid);
            return;
        }
    }
    //await chrisPremades.helpers.setTurnCheck(originFeature, 'feature', 'sneakAttack');
    let defaultDamageType = workflow.defaultDamageType;
    let oldFormula = workflow.damageRoll._formula;
    let bonusDamageFormula;
    let number;
    if (workflow.actor.type === 'character') {
        let scale = workflow.actor.system.scale?.rogue?.['sneak-attack'];
        if (!scale) {
            ui.notifications.warn('Actor does not appear to have a Sneak Attack scale!');
            queue.remove(workflow.item.uuid);
            return;
        }
        number = scale.number;
        bonusDamageFormula = number + 'd' + scale.faces + '[' + defaultDamageType + ']';
    } else if (workflow.actor.type === 'npc') {
        number = 2;
        if (workflow.actor.system.details.cr > 3) number = 4;
        bonusDamageFormula = number + 'd6[' + defaultDamageType + ']';
    }
    let eyeFeature = chrisPremades.helpers.getItem(workflow.actor, 'Eye for Weakness');
    if (iTarget && eyeFeature) bonusDamageFormula += ' + 3d6[' + defaultDamageType + ']';
    if (workflow.isCritical) bonusDamageFormula = chrisPremades.helpers.getCriticalFormula(bonusDamageFormula);
    let damageFormula = oldFormula + ' + ' + bonusDamageFormula;
    let damageRoll = await new Roll(damageFormula).roll({ async: true });
    await workflow.setDamageRoll(damageRoll);
    if (workflow.item.system.actionType === 'rwak') originFeature.img = "modules/mba-premades/icons/class/rogue/sneak_attack_ranged.webp";
    await originFeature.use();
    if (displayRakish) await rakishAudacity.use();
    if (iTarget) {
        let iFeature = chrisPremades.helpers.getItem(workflow.actor, 'Insightful Fighting');
        if (iFeature) await iFeature.displayCard();
        if (eyeFeature) await eyeFeature.use();
    }
    chrisPremades.queue.remove(workflow.item.uuid);
    let animationType;
    if (chrisPremades.helpers.getDistance(workflow.token, target) > 5) animationType = 'ranged';
    if (!animationType) animationType = defaultDamageType;
    await animation(target, workflow.token, animationType);
    await originFeature.setFlag('mba-premades', 'feature.sneakAttack.turn', game.combat.round + '-' + game.combat.turn);
}

async function combatEnd(origin) {
    await origin.setFlag('mba-premades', 'feature.sneakAttack.turn', '');
}

export let sneakAttack = {
    'animation': animation,
    'attack': attack,
    'combatEnd': combatEnd
}