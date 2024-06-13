import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function bite({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    if (!workflow.failedSaves.size) return;
    let target = workflow.targets.first();
    if (mba.checkTrait(target.actor, "ci", "poisoned")) return;
    if (mba.checkTrait(target.actor, "ci", "diseased")) return;
    if (mba.findEffect(target.actor, 'Otyugh: Poison')) return;
    let otyughPoison = game.Gametime.doEvery({ day: 1 }, async (actorUuid) => {
        const tokenOrActor = await fromUuid(actorUuid);
        let actor;
        if (tokenOrActor instanceof CONFIG.Actor.documentClass) actor = tokenOrActor;
        if (tokenOrActor instanceof CONFIG.Token.documentClass) actor = tokenOrActor.actor;
        if (!actor) return;
        let effect = await mbaPremades.helpers.findEffect(actor, "Otyugh: Poison");
        if (!effect) return;
        const description = [`
            <p>Every 24 hours that elapse, creature affected by Otyugh's Poison must make a Constitution saving throw, reducing its hit point maximum by 5 (1d10) on a failure.</p>
            <p>This reduction lasts until the disease is cured. The creature dies if the disease reduces its hit point maximum to 0.</p>
        `];
        const messageData = { flavor: actor.name + ' is affected by Otyugh Disease' };
        ChatMessage.applyRollMode(messageData, CONST.DICE_ROLL_MODES.PRIVATE);
        await ChatMessage.create(messageData);
        let userID = warpgate.util.firstOwner(actor).id;
        let data = {
            'targetUuid': actorUuid,
            'request': 'save',
            'ability': 'con'
        };
        let saveRoll = await MidiQOL.socket().executeAsUser('rollAbility', userID, data);
        if (saveRoll.total >= 15) {
            let eventId = effect.flags['mba-premades']?.eventId;
            game.Gametime.doIn({ second: 1 }, async () => { game.Gametime.clearTimeout(eventId) });
            await mbaPremades.helpers.removeEffect(effect);
            return;
        }
        let hpRoll = await new Roll('1d10').roll({ 'async': true });
        await hpRoll.toMessage({
            rollMode: 'roll',
            speaker: { 'alias': name },
            flavor: 'Otyugh: Poison'
        });
        let newPenalty = effect.flags['mba-premades']?.penalty + hpRoll.total;
        let updates = {
            'changes': [
                {
                    'key': 'system.attributes.hp.max',
                    'mode': 2,
                    'value': `-${newPenalty}`,
                    'priority': 20
                },
                {
                    'key': "macro.CE",
                    'mode': 0,
                    'value': "Poisoned",
                    'priority': 20
                }
            ],
            'flags': {
                'mba-premades': {
                    'isDisease': true,
                    'lesserRestoration': true,
                    'greaterRestoration': true,
                    'name': "Otyugh: Poison",
                    'description': description,
                    'healthReduction': true,
                    'penalty': newPenalty
                }
            }
        };
        await mbaPremades.helpers.updateEffect(effect, updates);
    }, target.document.uuid);
    const description = [`
        <p>Every 24 hours that elapse, creature affected by Otyugh's Poison must make a Constitution saving throw, reducing its hit point maximum by 5 (1d10) on a failure.</p>
        <p>This reduction lasts until the disease is cured. The creature dies if the disease reduces its hit point maximum to 0.</p>
    `];
    const effectData = {
        'name': "Otyugh: Poison",
        'icon': "modules/mba-premades/icons/generic/generic_poison.webp",
        'origin': workflow.item.uuid,
        'changes': [
            {
                'key': "macro.CE",
                'mode': 0,
                'value': "Poisoned",
                'priority': 20
            }
        ],
        'flags': {
            'mba-premades': {
                'actorUuid': target.document.uuid,
                'eventId': otyughPoison,
                'penalty': 0,
                'isDisease': true,
                'lesserRestoration': true,
                'greaterRestoration': true,
                'name': "Otyugh: Poison",
                'description': description
            }
        }
    };
    await mbaPremades.helpers.createEffect(target.actor, effectData);
}

async function tentacleSlam({ speaker, actor, token, character, item, args, scope, workflow }) {
    let targets = Array.from(workflow.targets);
    if (targets.length != 2) {
        ui.notifications.warn("You must select two targets!");
        return;
    }
    let grappleItem = workflow.actor.items.filter(i => i.name === `Tentacle`)[0];
    for (let target of targets) {
        let effect = mba.findEffect(target.actor, "Otyugh: Grapple")
        if (!effect) return;
        if (effect.origin != grappleItem.uuid) {
            ui.notifications.warn(`Wrong target selected (${target.document.name} is not grappled by you)`);
            return;
        }
    }
    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Monster Features', 'Otyugh: Tentacle Slam', false);
    if (!featureData) return;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
    let targetUuids = [];
    for (let target of targets) targetUuids.push(target.document.uuid);
    let [config, options] = constants.syntheticItemWorkflowOptions(targetUuids);
    await warpgate.wait(100);
    await game.messages.get(workflow.itemCardId).delete();
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (!featureWorkflow.failedSaves.size) return;
    let failedTargets = Array.from(featureWorkflow.failedSaves);
    const effectData = {
        'name': "Otyugh: Tentacle Slam",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Otyugh used it's tentacles to slam creatures it was grappling into each other.</p>
            <p>You are stunned until the end of Otyugh's next turn.</p>
        `,
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': 'Stunned',
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['turnEndSource']
            }
        }
    };
    for (let failedTarget of failedTargets) await mba.createEffect(failedTarget.actor, effectData);
}

export let otyugh = {
    'bite': bite,
    'tentacleSlam': tentacleSlam
}