import {constants} from '../../generic/constants.js';
import {mba} from '../../../helperFunctions.js';

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.targets.size != 1) return;
    let weapons = workflow.actor.items.filter(i => i.type === 'weapon' && i.system.equipped && i.system.actionType === 'mwak');
    if (!weapons.length) {
        ui.notifications.info('No equipped weapons found!');
        return;
    }
    let selection;
    if (weapons.length === 1) selection = weapons[0];
    if (!selection) [selection] = await mba.selectDocument('Attack with what weapon?', weapons);
    if (!selection) return;
    let target = workflow.targets.first();
    let level = mba.levelOrCR(workflow.actor);
    let diceNumber = Math.floor((level + 1) / 6);
    let weaponData = duplicate(selection.toObject());
    delete weaponData._id;
    setProperty(weaponData, 'flags.mba-premades.spell.boomingBlade', true);
    if (level > 4) weaponData.system.damage.parts.push([diceNumber + 'd8[thunder]', 'thunder']);
    let weapon = new CONFIG.Item.documentClass(weaponData, { 'parent': workflow.actor });
    weapon.prepareData();
    weapon.prepareFinalAttributes();
    let [config, options] = constants.syntheticItemWorkflowOptions([target.document.uuid]);
    await warpgate.wait(100);
    let attackWorkflow = await MidiQOL.completeItemUse(weapon, config, options);
    if (!attackWorkflow) return;

    new Sequence()

        .effect()
        .file("animated-spell-effects-cartoon.electricity.26")
        .attachTo(target)
        .scaleToObject(1.7 * target.document.texture.scaleX)

        .effect()
        .file("animated-spell-effects-cartoon.mix.electric ball.03")
        .delay(200)
        .attachTo(target)
        .scaleToObject(1.7 * target.document.texture.scaleX)
        .fadeIn(500)
        .fadeOut(1000)
        .persist()
        .name(`${target.document.name} Booming Blade`)

        .play();

    if (!attackWorkflow.hitTargets.size) return;
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Booming Blade`, object: token })
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are sheathed in booming energy.</p>
            <p>If you willngly move for 5 feet or more before the start of the caster's next turn, you will take additional thunder damage.</p>
        `,
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['turnStartSource']
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'mba-premades': {
                'spell': {
                    'boomingBlade': {
                        'diceNumber': diceNumber + 1
                    }
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 0,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    let effect = mba.findEffect(attackWorkflow.targets.first().actor, effectData.name);
    if (effect) {
        if (effect.flags['mba-premades']?.spell?.boomingBlade?.diceNumber > diceNumber) {
            return;
        } else {
            await mba.removeEffect(effect);
        }
    }
    await mba.createEffect(attackWorkflow.targets.first().actor, effectData);
}

async function moved(token, changes) {
    if (!mba.isLastGM()) return;
    if (token.parent.id != canvas.scene.id) return;
    if (!changes.x && !changes.y && !changes.elevation) return;
    let effect = mba.getEffects(token.actor).find(i => i.flags['mba-premades']?.spell?.boomingBlade);
    if (!effect) return;
    await token.object?._animation;
    let selection = await mba.dialog(effect.name, constants.yesNo, `Did <b>${token.actor.name}</b> move willingly?`);
    if (!selection) return;
    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Spell Features', 'Booming Blade: Movement Damage', false);
    if (!featureData) return;
    delete featureData._id;
    featureData.system.damage.parts = [[effect.flags['mba-premades'].spell.boomingBlade.diceNumber + 'd8[thunder]','thunder']];
    if (!effect.origin) return;
    let originItem = await fromUuid(effect.origin);
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': originItem.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([token.uuid]);
    await MidiQOL.completeItemUse(feature, config, options);

    new Sequence()

        .effect()
        .file("animated-spell-effects-cartoon.electricity.blast.04")
        .attachTo(token)
        .scaleToObject(1.5)
        .waitUntilFinished(-2000)

        .effect()
        .file("animated-spell-effects-cartoon.energy.blast.02")
        .attachTo(token)
        .scaleToObject(1.7)

        .play()

    await mba.removeEffect(effect);
}

export let boomingBlade = {
    'item': item,
    'moved': moved
}