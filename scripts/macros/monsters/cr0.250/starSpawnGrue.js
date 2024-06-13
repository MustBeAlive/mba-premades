import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function auraOfShrieksSource({ speaker, actor, token, character, item, args, scope, workflow }) {
    let validTargets = Array.from(mba.findNearby(token, 20, null, false, false)).filter(i => mba.raceOrType(i.actor) != "aberration");
    if (!validTargets.length) return;
    async function effectMacroEveryTurn() {
        let effect = await mbaPremades.helpers.findEffect(actor, "Aura of Shrieks");
        let grueNearby = Array.from(mbaPremades.helpers.findNearby(token, 20, null, false, false)).filter(i => i.document.name === "Star Spawn Grue");
        if (grueNearby.length) return;
        await mbaPremades.helpers.removeEffect(effect);
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Aura of Shrieks` });
    }
    const effectData = {
        'name': "Aura of Shrieks",
        'icon': "icons/creatures/magical/construct-golem-stone-blue.webp",
        'description': `
            <p>You are affected by Star Spawn Grue's Aura of Shrieks.</p>
            <p>While inside the area of effect, you have disadvantage on saving throws, as well as on attack rolls against creatures other than a Star Spawn Grue.</p>
        `,
        'changes': [
            {
                'key': 'flags.midi-qol.disadvantage.attack.all',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.disadvantage.ability.save.all',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': "function.mbaPremades.macros.monsters.starSpawnGrue.auraOfShrieksEffect,preAttackRoll",
                'priority': 20
            },

        ],
        'flags': {
            'dae': {
                'showIcon': true,
            },
            'effectmacro': {
                'onEachTurn': {
                    'script': mba.functionToString(effectMacroEveryTurn)
                }
            }
        }
    }
    for (let target of validTargets) {
        let effect = await mba.findEffect(target.actor, "Aura of Shrieks");
        if (effect) continue;
        await mba.createEffect(target.actor, effectData);
        new Sequence()

            .effect()
            .from(target)
            .attachTo(target)
            .fadeIn(200)
            .fadeOut(500)
            .loopProperty("sprite", "position.x", { from: -0.05, to: 0.05, duration: 100, pingPong: true, gridUnits: true })
            .scaleToObject(target.document.texture.scaleX)
            .opacity(0.25)
            .filter("ColorMatrix", { saturate: 1 })
            .persist()
            .name(`${target.document.name} Aura of Shrieks`)

            .play()
    }
}

async function auraOfShrieksEffect({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    if (target.document.name != "Star Spawn Grue") return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'auraOfShrieks', 150);
    if (!queueSetup) return;
    workflow.advantage = true;
    workflow.advReminderAttackAdvAttribution.add("ADV:Aura of Shrieks");
    queue.remove(workflow.item.uuid);
}

export let starSpawnGrue = {
    'auraOfShrieksSource': auraOfShrieksSource,
    'auraOfShrieksEffect': auraOfShrieksEffect
}