import {constants} from '../../generic/constants.js';
import {mba} from '../../../helperFunctions.js';

// To do: animations

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.targets.size != 1) {
        ui.notifications.warn("No target selected!");
        return;
    }
    let target = workflow.targets.first();
    let effect = mba.findEffect(target.actor, 'Warding Bond: Target');
    if (effect) return;
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Warding Bond: Dismiss", false);
    if (!featureData) return;
    featureData.name = `Warding Bond: Dismiss (${target.document.name})`;
    setProperty(featureData, 'flags.mba-premades.spell.wardingBond.targetUuid', target.document.uuid);
    async function effectMacroDel() {
        await warpgate.revert(token.document, `Warding Bond`);
        let target = await fromUuid(effect.flags['mba-premades']?.spell?.wardingBond?.targetUuid);
        if (!target) return;
        let effectTarget = await mbaPremades.helpers.findEffect(target.actor, "Warding Bond: Target");
        if (effectTarget) await mbaPremades.helpers.removeEffect(effectTarget);
    };
    let effectData = {
        'name': `Warding Bond`,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p><b>Target: ${target.document.name}</b></p>
            <p>This spell wards a willing creature you touch and creates a mystic connection between you and the target until the spell ends.</p>
            <p>While the target is within 60 feet of you, it gains a +1 bonus to AC and saving throws, and it has resistance to all damage. Also, each time it takes damage, you take the same amount of damage.</p>
            <p>The spell ends if you drop to 0 hit points or if you and the target become separated by more than 60 feet. It also ends if the spell is cast again on either of the connected creatures.</p>
            <p>You can also dismiss the spell as an action.</p>
        `,
        'duration': {
            'seconds': 3600
        },
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'mba-premades': {
                'spell': {
                    'wardingBond': {
                        'targetUuid': target.document.uuid
                    }
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 2,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    let updates = {
        'embedded': {
            'Item': {
                [featureData.name]: featureData
            },
            'ActiveEffect': {
                [effectData.name]: effectData
            }
        }
    };
    let options = {
        'permanent': false,
        'name': "Warding Bond",
        'description': featureData.name
    };
    let effectDataTarget = {
        'name': 'Warding Bond: Target',
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p><b>Source: ${workflow.token.document.name}</b></p>
            <p>While the source of the spell is within 60 feet of you, you gain a +1 bonus to AC and saving throws, and you have resistance to all damage. Also, each time you take damage, spell source takes the same amount of damage.</p>
            <p>The spell ends if source drops to 0 hit points or if you and the source become separated by more than 60 feet. It also ends if the spell is cast again on either of the connected creatures.</p>
        `,
        'duration': {
            'seconds': 3600
        },
        'changes': [
            {
                'key': 'system.attributes.ac.bonus',
                'mode': 2,
                'value': '+1',
                'priority': 20
            },
            {
                'key': 'system.bonuses.abilities.save',
                'mode': 2,
                'value': '+1',
                'priority': 20
            },
            {
                'key': 'system.traits.dr.all',
                'mode': 0,
                'value': '1',
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.spell.wardingBond.sourceUuid',
                'mode': 5,
                'value': workflow.token.document.uuid,
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.feature.onHit.wardingBond',
                'mode': 5,
                'value': true,
                'priority': 20
            }
        ],
        'flags': {
            'midi-qol': {
                'castData': {
                    baseLevel: 2,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    new Sequence()

        .wait(500)

        .effect()
        .file("jb2a.icon.shield.yellow")
        .attachTo(token, { followRotation: false })
        .scaleToObject(1.25)
        .duration(4000)
        .fadeIn(1000)
        .fadeOut(1000)

        .effect()
        .file("jb2a.energy_beam.normal.yellow.02")
        .attachTo(token)
        .stretchTo(target)
        .fadeOut(1000)
        .scaleIn(0, 2000, { ease: "easeOutSine" })
        .playbackRate(0.8)
        .waitUntilFinished(-3000)

        .effect()
        .file("jb2a.icon.shield.yellow")
        .attachTo(target, { followRotation: false })
        .scaleToObject(1.25)
        .duration(4000)
        .fadeIn(1000)
        .fadeOut(1000)

        .thenDo(async () => {
            await warpgate.mutate(workflow.token.document, updates, {}, options);
            await mba.createEffect(target.actor, effectDataTarget);
        })

        .play()
}

async function dismiss({ speaker, actor, token, character, item, args, scope, workflow }) {
    let targetUuid = workflow.item.flags['mba-premades']?.spell?.wardingBond?.targetUuid;
    if (!targetUuid) return;
    let targetDoc = await fromUuid(targetUuid);
    if (!targetDoc) return;
    let effectTarget = mba.findEffect(targetDoc.actor, 'Warding Bond: Target');
    if (effectTarget) await mba.removeEffect(effectTarget);
    let effectSource = mba.findEffect(workflow.actor, `Warding Bond`);
    if (!effectSource) return;
    await mba.removeEffect(effectSource);
}

async function onHit(workflow, targetToken) {
    if (workflow.hitTargets.size === 0 || !workflow.damageList) return;
    let effect = mba.findEffect(targetToken.actor, 'Warding Bond: Target');
    if (!effect) return;
    let bondTokenUuid = targetToken.actor.flags['mba-premades']?.spell?.wardingBond?.sourceUuid;
    if (!bondTokenUuid) return;
    let damageInfo = workflow.damageList.find(list => list.actorId === targetToken.actor.id);
    if (!damageInfo) return;
    if (damageInfo.appliedDamage === 0) return;
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Warding Bond: Damage Transfer", false);
    if (!featureData) return;
    featureData.system.damage.parts = [[damageInfo.appliedDamage + '[none]', 'none']];
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': targetToken.actor });
    let sourceToken = await fromUuid(bondTokenUuid);
    if (!sourceToken) return;
    let [config, options] = constants.syntheticItemWorkflowOptions([sourceToken.uuid]);
    let damageWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    new Sequence()

        .effect()
        .file("jb2a.icon.shield.yellow")
        .attachTo(targetToken, { followRotation: false })
        .scaleToObject(1.25)
        .duration(4000)
        .fadeIn(1000)
        .fadeOut(1000)

        .effect()
        .file("jb2a.energy_beam.normal.yellow.02")
        .attachTo(targetToken)
        .stretchTo(sourceToken)
        .fadeOut(1000)
        .scaleIn(0, 2000, { ease: "easeOutSine" })
        .playbackRate(0.8)
        .waitUntilFinished(-3000)

        .effect()
        .file("jb2a.icon.shield.yellow")
        .attachTo(sourceToken, { followRotation: false })
        .scaleToObject(1.25)
        .duration(4000)
        .fadeIn(1000)
        .fadeOut(1000)

        .play()

    if (damageWorkflow.targets.first().actor.system.attributes.hp.value != 0) return;
    await mba.removeEffect(effect);
    let sourceEffect = mba.getEffects(sourceToken.actor).find(eff => eff.flags['mba-premades']?.spell?.wardingBond?.targetUuid === targetToken.document.uuid);
    if (!sourceEffect) return;
    await mba.removeEffect(sourceEffect);
}

async function moveTarget(token, changes) {
    if (!mba.isLastGM()) return;
    if (token.parent.id != canvas.scene.id) return;
    if (!changes.x && !changes.y && !changes.elevation) return;
    let effect = mba.findEffect(token.actor, 'Warding Bond: Target');
    if (!effect) return;
    let bondTokenUuid = token.actor.flags['mba-premades']?.spell?.wardingBond?.sourceUuid;
    if (!bondTokenUuid) return;
    let sourceToken = await fromUuid(bondTokenUuid);
    if (!sourceToken) return;
    await token.object?._animation;
    let distance = mba.getDistance(token, sourceToken);
    if (distance <= 60) return;
    await mba.playerDialogMessage(mba.firstOwner(token));
    let selection = await mba.dialog("Warding Bond", constants.yesNo, `<b>Distance from caster is over 60 feet, remove effect?</b>`);
    await mba.clearPlayerDialogMessage();
    if (!selection) return;
    await mba.removeEffect(effect);
    let sourceEffect = mba.getEffects(sourceToken.actor).find(eff => eff.flags['mba-premades']?.spell?.wardingBond?.targetUuid === token.uuid);
    if (!sourceEffect) return;
    await mba.removeEffect(sourceEffect);
}

async function moveSource(token, changes) {
    if (game.settings.get('mba-premades', 'LastGM') != game.user.id) return;
    if (!changes.x && !changes.y && !changes.elevation) return;
    let effects = mba.getEffects(token.actor).filter(i => i.flags['mba-premades']?.spell?.wardingBond?.targetUuid);
    if (effects.length === 0) return;
    for (let i of effects) {
        let targetToken = await fromUuid(i.flags['mba-premades']?.spell?.wardingBond?.targetUuid);
        if (!targetToken) continue;
        let distance = mba.getDistance(token, targetToken);
        if (distance <= 60) continue;
        await mba.playerDialogMessage(mba.firstOwner(token));
        let selection = await mba.dialog("Warding Bond", constants.yesNo, `<b>Distance from caster is over 60 feet, remove effect?</b>`);
        await mba.clearPlayerDialogMessage();
        if (!selection) continue;
        await mba.removeEffect(i);
        let effectTarget = mba.findEffect(targetToken.actor, 'Warding Bond: Target');
        if (!effectTarget) continue;
        await mba.removeEffect(effectTarget);
    }
}

export let wardingBond = {
    'item': item,
    'onHit': onHit,
    'moveTarget': moveTarget,
    'moveSource': moveSource,
    'dismiss': dismiss
}