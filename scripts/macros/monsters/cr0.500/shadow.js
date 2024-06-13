import {mba} from "../../../helperFunctions.js";

async function strengthDrain({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let target = workflow.targets.first();
    let strRoll = await new Roll("1d4").roll({ 'async': true });
    await MidiQOL.displayDSNForRoll(strRoll, 'damageRoll');
    strRoll.toMessage({
        rollMode: 'roll',
        speaker: { 'alias': name },
        flavor: "Shadow: Strength Drain"
    });
    let currentStr = target.actor.system.abilities.str.value;
    if (currentStr - strRoll.total < 1) {
        let currentHP = target.actor.system.attributes.hp.value;
        await mba.applyDamage(target, currentHP, 'force');
        await warpgate.wait(100);
        if (target.actor.type === "character") {
            await mba.removeCondition(target.actor, "Unconscious");
            await mba.addCondition(target.actor, "Dead");
        }
        return;
    }
    let effect = await mba.findEffect(target.actor, "Shadow: Strength Drain");
    if (effect) {
        let newStr = effect.flags['mba-premades']?.penalty + strRoll.total;
        let updates = {
            'description': `
                <p>Shadow is draining your strength.</p>
                <p>If your strength score becomes 0, you will die.</p>
                <p>Reduction lasts until you finish a short or a long rest.</p>
                <p>Current Penalty: <b>${newStr}</b></p>
            `,
            'changes': [
                {
                    'key': 'system.abilities.str.value',
                    'mode': 2,
                    'value': '-' + newStr,
                    'priority': 20
                }
            ],
            'flags': {
                'mba-premades': {
                    'abilityReduction': true,
                    'penalty': newStr
                }
            }
        };
        await mba.updateEffect(effect, updates);
        if (currentStr - newStr < 1) {
            let currentHP = target.actor.system.attributes.hp.value;
            await mba.applyDamage(target, currentHP, 'force');
            return;
        }
        return;
    }
    const effectData = {
        'name': "Shadow: Strength Drain",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
                <p>Shadow is draining your strength.</p>
                <p>If your strength score becomes 0, you will die.</p>
                <p>Reduction lasts until you finish a short or a long rest.</p>
                <p>Current Penalty: <b>${strRoll.total}</b></p>
            `,
        'changes': [
            {
                'key': 'system.abilities.str.value',
                'mode': 2,
                'value': '-' + strRoll.total,
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['shortRest', 'longRest']
            },
            'mba-premades': {
                'abilityReduction': true,
                'penalty': strRoll.total
            }
        }
    };
    await mba.createEffect(target.actor, effectData);

}

export let shadow = {
    'strengthDrain': strengthDrain
}