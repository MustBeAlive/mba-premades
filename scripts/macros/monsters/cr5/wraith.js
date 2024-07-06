import {mba} from "../../../helperFunctions.js";
import {socket} from "../../../module.js";

async function lifeDrain({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    new Sequence()

        .effect()
        .file("jb2a.energy_strands.range.multiple.dark_purple02.01")
        .attachTo(target)
        .stretchTo(workflow.token)
        .repeats(2, 1500)

        .effect()
        .file("jb2a.divine_smite.caster.dark_purple")
        .attachTo(workflow.token)
        .fadeIn(500)
        .scaleToObject(1.5)
        .belowTokens()

        .play()

    if (!workflow.failedSaves.size) return;
    let damageRoll = workflow.damageRoll.total;
    let effect = await mba.findEffect(target.actor, "Wraith: Life Drain");
    if (effect) {
        let originalMax = effect.flags['mba-premades']?.originalMax;
        let newPenalty = effect.flags['mba-premades']?.penalty + damageRoll;
        let updates = {
            'description': `
                <p>Your hit point maximum (<b>${originalMax}</b>) is reduced by (<b>${newPenalty}</b>).</p>
                <p>You will die if this effect reduces your hit point maximum to 0.</p>
            `,
            'changes': [
                {
                    'key': 'system.attributes.hp.max',
                    'mode': 2,
                    'value': `-${newPenalty}`,
                    'priority': 20
                },
            ],
            'flags': {
                'dae': {
                    'showIcon': true,
                    'specialDuration': ['longRest']
                },
                'mba-premades': {
                    'healthReduction': true,
                    'penalty': newPenalty
                }
            }
        };
        await mba.updateEffect(effect, updates);
        return;
    }
    const effectData = {
        'name': "Wraith: Life Drain",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Your hit point maximum (<b>${target.actor.system.attributes.hp.max}</b>) is reduced by (<b>${damageRoll}</b>).</p>
            <p>You will die if this effect reduces your hit point maximum to 0.</p>
        `,
        'changes': [
            {
                'key': 'system.attributes.hp.max',
                'mode': 2,
                'value': `-${damageRoll}`,
                'priority': 20
            },
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['longRest']
            },
            'mba-premades': {
                'greaterRestoration': true,
                'healthReduction': true,
                'originalMax': target.actor.system.attributes.hp.max,
                'penalty': damageRoll,
            }
        }
    };
    await mba.createEffect(target.actor, effectData);
}

async function createSpecter({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    if (mba.raceOrType(target.actor) != "humanoid") {
        ui.notifications.warn("Target is no humanoid!");
        return;
    }
    if (!mba.findEffect(target.actor, "Dead")) {
        ui.notifications.warn("Target is not dead!");
        return;
    }
    let sourceActor = game.actors.getName("Specter");
    if (!sourceActor) {
        ui.notifications.warn("Unale to find actor! (Specter)");
        return;
    }
    let updates = {
        'actor': {
            'prototypeToken': {
                'disposition': workflow.token.document.disposition,
            }
        },
        'token': {
            'disposition': workflow.token.document.disposition,
        }
    };
    let [spawnedTokenId] = await mba.spawn(sourceActor, updates, {}, workflow.token, 10, "shadow");
    if (mba.inCombat()) {
        let specterDoc = canvas.scene.tokens.get(spawnedTokenId);
        let casterCombatant = game.combat.combatants.contents.find(combatant => combatant.actorId === workflow.actor.id);
        let initiative = casterCombatant.initiative - 0.01;
        await socket.executeAsGM('createCombatant', spawnedTokenId, specterDoc.actor.id, canvas.scene.id, initiative);
    }
}

export let wraith = {
    'lifeDrain': lifeDrain,
    'createSpecter': createSpecter
}