import { mba } from "../../../helperFunctions.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let choices = [["One Stone", 1], ["Two Stones", 2], ["Three Stones", 3]];
    let ammount = await mba.dialog("Magic Stone", choices, `<b>Choose ammount of stones:</b>`);
    if (!ammount) return;
    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Spell Features', 'Magic Stone: Throw Stone', false);
    if (!featureData) return;
    delete featureData._id;
    const modEval = await new Roll('@mod', item.getRollData()).evaluate({ async: true });
    featureData.system.attackBonus = `- @mod + ${modEval.total}`;
    featureData.system.damage.parts[0][0] = `1d6 + ${modEval.total}[bludgeoning]`;
    featureData.system.uses.max = ammount;
    featureData.system.uses.value = ammount;
    async function effectMacroDel() {
        await warpgate.revert(token.document, "Magic Stone");
    };
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You have ${ammount} pebbles imbued with magic.</p>
            <p>You can use one of the pebbles to make ranged weapon attack (60ft.) You use caster's spellcasting ability modifier for that attack roll.</p>
            <p>On a hit, target takes bludgeoning damage equal to 1d6 + caster's spellcasting ability modifier.</p>
            <p>Whether the attack hits or misses, the spell then ends on the stone.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
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
    const updates = {
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
        'name': 'Magic Stone',
        'description': 'Magic Stone'
    };
    let effect = await mba.findEffect(target.actor, "Magic Stone");
    if (effect) await mba.removeEffect(effect);
    await warpgate.mutate(target.document, updates, {}, options);
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    new Sequence()

        .effect()
        .file("jb2a.slingshot")
        .attachTo(token)
        .stretchTo(target)
        .missed(workflow.hitTargets.size === 0)
        .waitUntilFinished(-1000)

        .effect()
        .file("jb2a.impact.boulder.02")
        .attachTo(target)
        .scaleToObject(1.6 * target.document.texture.scaleX)
        .playIf(() => {
            return workflow.hitTargets.size != 0
        })

        .play()

    let effect = await mba.findEffect(workflow.actor, "Magic Stone");
    if (!effect) return;
    let [feature] = workflow.actor.items.filter(i => i.name === "Magic Stone: Throw Stone");
    if (feature.system.uses.value === 0) await mba.removeEffect(effect);
    let updates = {
        'description': `
            <p>You have ${feature.system.uses.value} pebbles imbued with magic.</p>
            <p>You can use one of the pebbles to make ranged weapon attack (60ft.) You use caster's spellcasting ability modifier for that attack roll.</p>
            <p>On a hit, target takes bludgeoning damage equal to 1d6 + caster's spellcasting ability modifier.</p>
            <p>Whether the attack hits or misses, the spell then ends on the stone.</p>
        `
    };
    await mba.updateEffect(effect, updates);
}

export let magicStone = {
    'cast': cast,
    'item': item
}