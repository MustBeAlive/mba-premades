import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;
    new Sequence()

        .effect()
        .file("jb2a.magic_signs.circle.02.necromancy.complete.dark_green")
        .attachTo(template)
        .scaleToObject(1)
        .belowTokens()
        .waitUntilFinished(-8742)

        .effect()
        .file("jb2a.aura_themed.01.inward.complete.nature.01.green")
        .attachTo(template)
        .scaleToObject(1.5)
        .fadeIn(1000)
        .waitUntilFinished(-5700)

        .effect()
        .file("animated-spell-effects-cartoon.energy.quickburst")
        .attachTo(template)
        .scaleToObject(1.2)

        .effect()
        .file("jb2a.plant_growth.01.ring.4x4.pulse.bluepurple")
        .attachTo(template)
        .scaleToObject(1)
        .filter("ColorMatrix", { hue: 220 })

        .effect()
        .file("jb2a.toll_the_dead.green.skull_smoke")
        .attachTo(template)
        .scaleToObject(1.5)

        .play()
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.targets.size === 0) return;
    let healTargets = [];
    for (let target of workflow.damageList) {
        let targetToken = await fromUuid(target.tokenUuid);
        if (workflow.token.document.disposition != targetToken.disposition) continue;
        target.damageDetail = [{ 'damage': 0, 'type': 'necrotic' }];
        target.totalDamage = 0;
        target.newHP = target.oldHP;
        target.hpDamage = 0;
        target.appliedDamage = 0;
        healTargets.push(targetToken.object);
    }
    if (healTargets.length === 0) return;
    await mba.playerDialogMessage(game.user);
    let selection = await mba.selectTarget('Wither and Bloom', constants.yesNoButton, healTargets, true, 'one', undefined, false, "Heal a target?");
    await mba.clearPlayerDialogMessage();
    if (!selection.buttons) return;
    let targetTokenUuid = selection.inputs.find(id => id != false);
    if (!targetTokenUuid) return;
    async function effectMacroCreate() {
        if (actor.type != 'character') {
            effect.delete();
            return;
        }
        let classDice = [];
        let classes = actor.classes;
        for (let [key, value] of Object.entries(classes)) {
            let hitDiceAvailable = value.system.levels - value.system.hitDiceUsed;
            if (hitDiceAvailable != 0) classDice.push({
                'class': key,
                'hitDice': value.system.hitDice,
                'available': hitDiceAvailable,
                'max': value.system.levels
            });
        }
        if (classDice.length === 0) {
            effect.delete();
            return;
        }
        let inputs = [];
        let outputs = [];
        for (let i of classDice) {
            inputs.push(i.class + ' (' + i.hitDice + ') [' + i.available + '/' + i.max + ']:');
            outputs.push(
                {
                    'class': i.class,
                    'dice': i.hitDice
                }
            );
        }
        let maxHitDice = effect.flags['mba-premades'].spell.witherAndBloom.castLevel;
        await mbaPremades.helpers.playerDialogMessage(mbaPremades.helpers.firstOwner(token));
        let selection = await mbaPremades.helpers.numberDialog(`Heal using hit dice? Max: ${maxHitDice}`, mbaPremades.constants.yesNoButton, inputs);
        await mbaPremades.helpers.clearPlayerDialogMessage();
        if (!selection.buttons) {
            effect.delete();
            return;
        }
        let selectedTotal = 0;
        let healingFormula = '';
        for (let i = 0; selection.inputs.length > i; i++) {
            if (isNaN(selection.inputs[i])) continue;
            selectedTotal += selection.inputs[i];
            healingFormula = healingFormula + selection.inputs[i] + outputs[i].dice + '[healing] + ';
        }
        if (selectedTotal > maxHitDice) {
            ui.notifications.info('Too many hit dice selected!');
            effect.delete();
            return;
        }
        let conMod = actor.system.abilities.con.mod;
        let spellcastingMod = mbaPremades.helpers.getSpellMod(origin);
        healingFormula = `${healingFormula} + (${selectedTotal} * ${conMod}) + ${spellcastingMod}`;
        let healingRoll = await new Roll(healingFormula).roll({ 'async': true });
        let itemCardId = effect.flags['mba-premades'].spell.witherAndBloom.itemCardId;
        new Sequence()

            .effect()
            .file("animated-spell-effects-cartoon.energy.10")
            .attachTo(token)
            .scaleToObject(1.4)
            .filter("ColorMatrix", { hue: 280 })
            .waitUntilFinished(-700)

            .effect()
            .file("jb2a.healing_generic.burst.yellowwhite")
            .attachTo(token)
            .scaleToObject(1.35)
            .filter("ColorMatrix", { hue: 80 })
            .playbackRate(0.9)

            .thenDo(async () => {
                await mbaPremades.helpers.applyWorkflowDamage(token, healingRoll, 'healing', [token], origin.name, itemCardId);
                for (let i = 0; selection.inputs.length > i; i++) {
                    if (isNaN(selection.inputs[i])) continue;
                    await actor.classes[outputs[i].class].update({
                        'system.hitDiceUsed': actor.classes[outputs[i].class].system.hitDiceUsed + selection.inputs[i]
                    });
                }
                effect.delete();
            })

            .play()
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'flags': {
            'dae': {
                'showIcon': true
            },
            'effectmacro': {
                'onCreate': {
                    'script': mba.functionToString(effectMacroCreate)
                }
            },
            'mba-premades': {
                'spell': {
                    'witherAndBloom': {
                        'castLevel': workflow.castData.castLevel - 1,
                        'itemCardId': workflow.itemCardId
                    }
                }
            }
        }
    };
    let targetToken = await fromUuid(targetTokenUuid);
    await mba.createEffect(targetToken.actor, effectData);
}

export let witherAndBloom = {
    'cast': cast,
    'item': item
}