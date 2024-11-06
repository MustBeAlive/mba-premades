import {mba} from "../../../helperFunctions.js";


async function auraOfMagicResistance(token, selectedAura) {
    let originToken = await fromUuid(selectedAura.tokenUuid);
    if (!originToken) return;
    let originActor = originToken.actor;
    let auraEffect = mba.findEffect(originActor, 'Aura of Magic Resistance: Aura');
    if (!auraEffect) return;
    let originItem = await fromUuid(auraEffect.origin);
    if (!originItem) return;
    let effectData = {
        'name': 'Aura of Magic Resistance',
        'icon': originItem.img,
        'origin': originItem.uuid,
        'description': `
                <p>You have have advantage on saving throws against spells and other magical effects.</p>
                <p>Source: <b>${originToken.name}</b></p>
            `,
        'changes': [
            {
                'key': 'flags.midi-qol.magicResistance.all',
                'mode': 2,
                'value': 1,
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true
            },
            'mba-premades': {
                'aura': true,
                'effect': {
                    'noAnimation': true
                }
            }
        }
    };
    let effect = mba.findEffect(token.actor, effectData.name);
    if (effect?.origin === effectData.origin) return;
    if (effect) mba.removeEffect(effect);
    await mba.createEffect(token.actor, effectData);
}

async function senseAlignment({ speaker, actor, token, character, item, args, scope, workflow }) {
    new Sequence()

        .effect()
        .file("jb2a.detect_magic.cone.yellow")
        .atLocation(workflow.token)
        .stretchTo(workflow.targets.first())
        .size(8, { gridUnits: true })
        .fadeOut(4000)
        .belowTokens()

        .play()
}

export let dragonbait = {
    'auraOfMagicResistance': auraOfMagicResistance,
    'senseAlignment': senseAlignment
}