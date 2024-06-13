import {mba} from "../../../helperFunctions.js";

async function bite({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    if (!workflow.failedSaves.size) return;
    let target = workflow.targets.first();
    if (mba.checkTrait(target.actor, "ci", "poisoned")) return;
    if (mba.checkTrait(target.actor, "ci", "diseased")) return;
    if (mba.findEffect(target.actor, 'Death Dog: Poison')) return;
    let deathDogPoison = game.Gametime.doEvery({ day: 1 }, async (actorUuid) => {
        const tokenOrActor = await fromUuid(actorUuid);
        let actor;
        if (tokenOrActor instanceof CONFIG.Actor.documentClass) actor = tokenOrActor;
        if (tokenOrActor instanceof CONFIG.Token.documentClass) actor = tokenOrActor.actor;
        if (!actor) return;
        let effect = await mbaPremades.helpers.findEffect(actor, "Death Dog: Poison");
        if (!effect) return;
        let description = [`
                <p>Every 24 hours that elapse, creature affected by Death Dog's Poison must make a Constitution saving throw, reducing its hit point maximum by 5 (1d10) on a failure.</p>
                <p>This reduction lasts until the disease is cured. The creature dies if the disease reduces its hit point maximum to 0.</p>
        `];
        const messageData = { flavor: actor.name + ' is affected by Death Dog Disease' };
        ChatMessage.applyRollMode(messageData, CONST.DICE_ROLL_MODES.PRIVATE);
        await ChatMessage.create(messageData);
        let userID = warpgate.util.firstOwner(actor).id;
        let data = {
            'targetUuid': actorUuid,
            'request': 'save',
            'ability': 'con'
        };
        let saveRoll = await MidiQOL.socket().executeAsUser('rollAbility', userID, data);
        if (saveRoll.total >= 12) return;
        let hpRoll = await new Roll('1d10').roll({ 'async': true });
        await hpRoll.toMessage({
            rollMode: 'roll',
            speaker: { 'alias': name },
            flavor: 'Death Dog: Poison'
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
                    'actorUuid': target.document.uuid,
                    'eventId': deathDogPoison,
                    'isDisease': true,
                    'lesserRestoration': true,
                    'greaterRestoration': true,
                    'name': "Death Dog: Poison",
                    'description': description,
                    'healthReduction': true,
                    'penalty': newPenalty
                }
            }
        };
        await mbaPremades.helpers.updateEffect(effect, updates);
    }, target.document.uuid);
    const description = [`
        <p>Every 24 hours that elapse, creature affected by Death Dog's Poison must make a Constitution saving throw, reducing its hit point maximum by 5 (1d10) on a failure.</p>
        <p>This reduction lasts until the disease is cured. The creature dies if the disease reduces its hit point maximum to 0.</p>
    `];
    const effectData = {
        'name': "Death Dog: Poison",
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
                'isDisease': true,
                'lesserRestoration': true,
                'greaterRestoration': true,
                'name': "Death Dog: Poison",
                'description': description,
                'penalty': 0
            }
        }
    };
    await mba.createEffect(target.actor, effectData);
}

export let deathDog = {
    'bite': bite
}