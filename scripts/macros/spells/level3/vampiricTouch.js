import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Vampiric Touch: Attack", false);
    if (!featureData) return;
    let spellLevel = workflow.castData.castLevel;
    featureData.system.damage.parts = [[`${spellLevel}d6[necrotic]`, "necrotic"]];
    featureData.flags['mba-premades'] = {
        'spell': {
            'castData': workflow.castData,
            'vampiricTouchAttack': true,
        }
    };
    featureData.flags['mba-premades'].spell.castData.school = workflow.item.system.school;
    async function effectMacroDel() {
        await warpgate.revert(token.document, 'Vampiric Touch');
    }
    let effectData = {
        'name': "Vampiric Touch",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
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
                    baseLevel: 3,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    let updates = {
        'embedded': {
            'Item': {
                [featureData.name]: featureData
            },
            'ActiveEffect': {
                [workflow.item.name]: effectData
            }
        }
    };
    let options = {
        'permanent': false,
        'name': "Vampiric Touch",
        'description': "Vampiric Touch"
    };
    await warpgate.mutate(workflow.token.document, updates, {}, options);
    let feature = await mba.getItem(workflow.actor, "Vampiric Touch: Attack");
    if (!feature) return;
    if (!workflow.targets.size) return;
    let [config, options2] = constants.syntheticItemWorkflowOptions([workflow.targets.first().document.uuid]);
    await MidiQOL.completeItemUse(feature, config, options2);
}

async function attack({ speaker, actor, token, character, item, args, scope, workflow }) {
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

    if (!workflow.hitTargets.size) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'vampiricTouch', 450);
    if (!queueSetup) return;
    let damage = mba.totalDamageType(target.actor, workflow.damageDetail, 'necrotic');
    if (!damage) {
        queue.remove(workflow.item.uuid);
        return;
    }
    damage = Math.floor(damage / 2);
    await mba.applyDamage([workflow.token], damage, 'healing');
    queue.remove(workflow.item.uuid);
}

export let vampiricTouch = {
    'item': item,
    'attack': attack
}