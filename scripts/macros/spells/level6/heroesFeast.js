import {mba} from "../../../helperFunctions.js";

// To do: animations

export async function heroesFeast({speaker, actor, token, character, item, args, scope, workflow}) {
    let targets = Array.from(workflow.targets);
    let hpRoll = await new Roll("2d10[temphp]").roll({async: true});
    await MidiQOL.displayDSNForRoll(hpRoll);
    async function effectMacroDel() {
        if (actor.system.attributes.hp.value <= actor.system.attributes.hp.max) return; 
        await actor.update({ "system.attributes.hp.value": actor.system.attributes.hp.max })
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>As soon as you are affected by Heroes' Feast, you are cured of all diseases and poisons.</p>
            <p>You also become immune to being @UUID[Compendium.mba-premades.MBA SRD.Item.pAjPUbk2oPUTfva2]{Poisoned} and @UUID[Compendium.mba-premades.MBA SRD.Item.oR1wUvem3zVVUv5Q]{Frightened} and gain advantage on all Wisdom saving throws.</p>
            <p>For the next 24 hours, your hit point maximum is increases by 2d10, and you gain the same number of hit points.
        `,
        'duration': {
            'seconds': 86400
        },
        'changes': [
            {
                'key': 'system.traits.ci.value',
                'mode': 2,
                'value': "poisoned",
                'priority': 20
            },
            {
                'key': 'system.traits.ci.value',
                'mode': 2,
                'value': "frightened",
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.advantage.ability.save.wis',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
            {
                'key': 'system.attributes.hp.tempmax',
                'mode': 2,
                'value': hpRoll.total,
                'priority': 20
            }
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 6,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    for (let target of targets) {
        let diseases = target.actor.effects.filter(e => e.flags['mba-premades']?.isDisease === true);
        if (diseases.length) {
            for (let disease of diseases) await mba.removeEffect(disease);
        }
        let poisons = target.actor.effects.filter(e => e.name.includes("Poison"));
        if (poisons.length) {
            for (let poison of poisons) await mba.removeEffect(poison);
        }
        await mba.createEffect(target.actor, effectData);
    }
    await mba.applyWorkflowDamage(workflow.token, hpRoll, "temphp", targets, undefined, workflow.itemCardId);
}