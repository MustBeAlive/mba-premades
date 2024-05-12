import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

export async function blindnessDeafness({ speaker, actor, token, character, item, args, scope, workflow }) {
    let ammount = workflow.castData.castLevel - 1;
    let targets = Array.from(workflow.targets);
    if (workflow.targets.size > ammount) {
        let selection = await mba.selectTarget(workflow.item.name, constants.okCancel, Array.from(workflow.targets), false, 'multiple', undefined, false, 'Too many targets selected. Choose which targets to keep (Max: ' + ammount + ')');
        if (!selection.buttons) return;
        if (selection.inputs.length > ammount) {
            ui.notifications.warn("Too many targets selected, try again!");
            return
        }
        let newTargets = selection.inputs.filter(i => i).slice(0, ammount);
        mba.updateTargets(newTargets);
        await warpgate.wait(100);
        targets = Array.from(game.user.targets);
    }
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Blindness/Deafness: Save", false);
    if (!featureData) {
        ui.notifications.warn("Unable to find item in compendium! (Blindness/Deafness: Save)");
        return
    }
    delete featureData._id;
    featureData.system.save.dc = mba.getSpellDC(workflow.item);
    setProperty(featureData, 'mba-premades.spell.castData.school', workflow.item.system.school);
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
    let targetUuids = [];
    for (let i of targets) targetUuids.push(i.document.uuid);
    let [config, options] = constants.syntheticItemWorkflowOptions(targetUuids);
    await game.messages.get(workflow.itemCardId).delete();
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (!featureWorkflow.failedSaves.size) return;
    let failedTargets = Array.from(featureWorkflow.failedSaves);
    for (let target of failedTargets) {
        let choices = [['Blindness', 'blind'], ['Deafness', 'deaf']];
        let selection = await mba.dialog(`Blindness/Deafness`, choices, `Choose condition for <b>${target.document.name}</b>:`);
        if (!selection) return;
        let name;
        let description;
        let CE;
        switch (selection) {
            case 'blind': {
                name = "Blindness";
                description = "You are blinded for the duration. At the end of each of your turns, you can make a Constitution saving throw. On a success, the spell ends.";
                CE = 'Blinded';
                break;
            }
            case 'deaf': {
                name = "Deafness";
                description = "You are deafened for the duration. At the end of each of your turns, you can make a Constitution saving throw. On a success, the spell ends.";
                CE = 'Deafened';
                break;
            }
        }
        async function effectMacroDel() {
            await Sequencer.EffectManager.endEffects({ name: `${token.document.name} BD`, object: token })
        };
        let effectData = {
            'name': name,
            'icon': workflow.item.img,
            'origin': workflow.item.uuid,
            'description': description,
            'duration': {
                'seconds': 60
            },
            'changes': [
                {
                    'key': 'flags.midi-qol.OverTime',
                    'mode': 0,
                    'value': `turn=end, saveAbility=con, saveDC=${mba.getSpellDC(workflow.item)}, saveMagic=true, name=Blindness/Deafness: Turn End, killAnim= true`,
                    'priority': 20
                },
                {
                    'key': 'macro.CE',
                    'mode': 0,
                    'value': CE,
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
                        baseLevel: 2,
                        castLevel: workflow.castData.castLevel,
                        itemUuid: workflow.item.uuid
                    }
                }
            }
        };

        new Sequence()

            .effect()
            .file("jb2a.energy_beam.normal.dark_purplered.02")
            .attachTo(token)
            .stretchTo(target)
            .duration(2000)
            .fadeOut(1000)
            .scaleIn(0, 2000, { ease: "easeOutExpo" })
            .playbackRate(0.8)
            .waitUntilFinished(-1500)

            .effect()
            .file("jb2a.energy_strands.complete.dark_purple02.01")
            .attachTo(target)
            .scaleToObject(1.7 * target.document.texture.scaleX)
            .fadeIn(500)
            .fadeOut(1000)
            .opacity(0.8)
            .persist()
            .name(`${target.document.name} BD`)

            .thenDo(function () {
                mba.createEffect(target.actor, effectData);
            })

            .play()
    }
}