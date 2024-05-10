import { mba } from "../../../helperFunctions.js";
import { constants } from "../../generic/constants.js";

export async function animalFriendship({ speaker, actor, token, character, item, args, scope, workflow }) {
    let ammount = workflow.castData.castLevel;
    if (workflow.targets.size > ammount) {
        let selection = await mba.selectTarget(workflow.item.name, constants.okCancel, Array.from(workflow.targets), false, 'multiple', undefined, false, 'Too many targets selected. Choose which targets to keep (Max: ' + ammount + ')');
        if (!selection.buttons) return;
        let newTargets = selection.inputs.filter(i => i).slice(0, ammount);
        mba.updateTargets(newTargets);
        await warpgate.wait(100);
    }
    let targets = Array.from(game.user.targets).filter(i => (mba.raceOrType(i.actor) === "beast") && i.actor.system.abilities.int.value >= 4 && (!mba.findEffect(i.actor, "Blinded")) && (!mba.findEffect(i.actor, "Deafened")));
    console.log(targets);
    if (!targets.length) {
        ui.notifications.info("No valid targets selected!");
        return false;
    }
    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Spell Features', 'Animal Friendship: Save', false);
    if (!featureData) return;
    delete featureData._id;
    let originItem = workflow.item;
    if (!originItem) return;
    featureData.system.save.dc = mba.getSpellDC(originItem);
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
    let targetUuids = [];
    for (let target of targets) targetUuids.push(target.document.uuid);
    let [config, options] = constants.syntheticItemWorkflowOptions(targetUuids);
    await game.messages.get(workflow.itemCardId).delete();
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (!featureWorkflow.failedSaves.size) return;
    let failedTargets = Array.from(featureWorkflow.failedSaves);
    async function effectMacroDel() {
        await Sequencer.EffectManager.endEffects({ name: `${token.document.name} Animal Friendship`, object: token })
    };
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are charmed by ${workflow.token.document.name} and his companions.</p>
            <p>If any of them does to you any harm, the spell ends.</p>
        `,
        'duration': {
            'seconds': 86400
        },
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': 'Charmed',
                'priority': 20
            }
        ],
        'flags': {
            /*
            'dae': {
                'specialDuration': ['isDamaged']
            },
            */
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 1,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    for (let target of failedTargets) {
        new Sequence()

            .effect()
            .file("jb2a.impact_themed.heart.pink")
            .attachTo(target)
            .scaleToObject(1.7 * target.document.texture.scaleX)
            .fadeIn(500)

            .effect()
            .file("jb2a.template_circle.symbol.normal.heart.pink")
            .attachTo(target)
            .scaleToObject(1.4 * target.document.texture.scaleX)
            .delay(200)
            .fadeIn(1000)
            .fadeOut(1000)
            .mask()
            .persist()
            .name(`${target.document.name} Animal Friendship`)

            .thenDo(function () {
                mba.createEffect(target.actor, effectData)
            })

            .play()
    }
}