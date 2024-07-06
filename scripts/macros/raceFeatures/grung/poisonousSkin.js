import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    if (mba.checkTrait(target.actor, "ci", "poisoned")) return;
    if (mba.findEffect(target.actor, "Grung: Poison")) return;
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Race Feature Items", "Poisonous Skin: Save", false);
    if (!featureData) {
        queue.remove(workflow.item.uuid);
        return;
    }
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([target.document.uuid]);
    await game.messages.get(workflow.itemCardId).delete();
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} GrunPo` })
    };
    let effectData = {
        'name': "Grung: Poison",
        'icon': "modules/mba-premades/icons/generic/generic_poison.webp",
        'origin': workflow.item.uuid,
        'description': `
            <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.pAjPUbk2oPUTfva2]{Poisoned} by Grung's Poisonous Skin for the duration.</p>
            <p>If you are no longer in direct contact with the Grung, you can repeat the saving throw at the end of each of your turns, ending the effect on a success.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': 'Poisoned',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': 'turn=end, saveAbility=con, saveDC=12, saveMagic=false, name=Poison: Turn End (DC12), killAnim=true',
                'priority': 20
            },
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };
    new Sequence()

        .effect()
        .file("jb2a.smoke.puff.centered.green.2")
        .attachTo(target)
        .scaleToObject(2 * target.document.texture.scaleX)

        .effect()
        .file("jb2a.template_circle.symbol.normal.poison.dark_green")
        .delay(500)
        .attachTo(target)
        .fadeIn(500)
        .fadeOut(500)
        .scaleToObject(1.8 * target.document.texture.scaleX)
        .randomRotation()
        .mask(target)
        .persist()
        .name(`${target.document.name} GrunPo`)
        .playIf(() => {
            return featureWorkflow.failedSaves.size
        })

        .thenDo(async () => {
            if (featureWorkflow.failedSaves.size) await mba.createEffect(target.actor, effectData);
        })

        .play()
}

async function attack({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    if (!(workflow.item.system.actionType === 'mwak') || workflow.item.system?.damage?.parts[0][1] != "piercing") return;
    let target = workflow.targets.first();
    let queueSetup = await queue.setup(workflow.item.uuid, 'poisonousSkin', 290);
    if (!queueSetup) return;
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Race Feature Items", "Poisonous Skin: Save", false);
    if (!featureData) {
        queue.remove(workflow.item.uuid);
        return;
    }
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([target.document.uuid]);
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (!featureWorkflow.failedSaves.size) {
        queue.remove(workflow.item.uuid);
        return;
    }
    let oldFormula = workflow.damageRoll._formula;
    let bonusDamageFormula = '2d4[poison]';
    let damageFormula = oldFormula + ' + ' + bonusDamageFormula;
    let damageRoll = await new Roll(damageFormula).roll({ async: true });
    await workflow.setDamageRoll(damageRoll);
    new Sequence()

        .effect()
        .file("jb2a.smoke.puff.centered.green.2")
        .attachTo(target)
        .scaleToObject(2 * target.document.texture.scaleX)

        .play()

    queue.remove(workflow.item.uuid);
}

export let poisonousSkin = {
    'item': item,
    'attack': attack
}