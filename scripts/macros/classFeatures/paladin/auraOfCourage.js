import {mba} from "../../../helperFunctions.js";

export async function auraOfCourage(token, selectedAura) {
    let originToken = await fromUuid(selectedAura.tokenUuid);
    let originActor = originToken.actor;
    if (!originActor) return;
    let auraEffect = mba.findEffect(originActor, 'Aura of Courage: Aura');
    if (!auraEffect) return;
    let originItem = await fromUuid(auraEffect.origin);
    if (!originItem) return;
    let effectData = {
        'name': 'Aura of Courage',
        'icon': originItem.img,
        'origin': originItem.uuid,
        'description': `
            <p>You cannot be frightened.</p>
            <p>Source: <b>${originToken.name}</b></p>
        `,
        'changes': [
            {
                'key': 'system.traits.ci.value',
                'mode': 0,
                'value': 'frightened',
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
    }
    let effect = mba.findEffect(token.actor, effectData.name);
    if (effect?.origin === effectData.origin) return;
    if (effect) mba.removeEffect(effect);
    await mba.createEffect(token.actor, effectData);
    let frightenedEffect = mba.findEffect(token.actor, 'Frightened');
    if (frightenedEffect) mba.removeEffect(frightenedEffect);
}