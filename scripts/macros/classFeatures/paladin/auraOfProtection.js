import {mba} from "../../../helperFunctions.js";

export async function auraOfProtection(token, selectedAura) {
    let originToken = await fromUuid(selectedAura.tokenUuid);
    if (!originToken) return;
    let originActor = originToken.actor;
    let auraEffect = mba.findEffect(originActor, 'Aura of Protection: Aura');
    if (!auraEffect) return;
    let originItem = await fromUuid(auraEffect.origin);
    if (!originItem) return;
    let effectData = {
        'name': 'Aura of Protection',
        'icon': originItem.img,
        'origin': originItem.uuid,
        'description': `
            <p>You have +${selectedAura.castLevel} bonus to saving throws.</p>
            <p>Source: <b>${originToken.name}</b></p>
        `,
        'changes': [
            {
                'key': 'system.bonuses.abilities.save',
                'mode': 2,
                'value': `+ ${selectedAura.castLevel}`,
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