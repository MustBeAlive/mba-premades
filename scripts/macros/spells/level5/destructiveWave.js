import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    new Sequence()

        .effect()
        .file("jb2a.lightning_ball.purple")
        .attachTo(workflow.token)
        .scaleToObject(2)
        .fadeIn(2000)
        .fadeOut(500)
        .persist()
        .name(`${workflow.token.document.name} DW1`)

        .play()
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let targets = Array.from(workflow.targets);
    let choices = [["Radiant", "radiant"], ["Necrotic", "necrotic"]];
    await mba.playerDialogMessage();
    let selection = await mba.dialog("Destructive Wave", choices, "<b>Choose second damage type:</b>");
    await mba.clearPlayerDialogMessage();
    if (!selection) return;
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Destructive Wave: Save", false);
    if (!featureData) return;
    delete featureData._id;
    let saveDC = mba.getSpellDC(workflow.item);
    featureData.system.save.dc = saveDC;
    featureData.system.damage.parts = [[`5d6[thunder]`, `thunder`], [`5d6[${selection}]`, selection]];
    setProperty(featureData, 'mba-premades.spell.castData.school', workflow.item.system.school);
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
    let targetUuids = Array.from(targets).map(t => t.document.uuid);
    let [config, options] = constants.syntheticItemWorkflowOptions(targetUuids);
    await game.messages.get(workflow.itemCardId).delete();
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    new Sequence()

        .canvasPan()
        .shake({ duration: 750, strength: 5, rotation: true, fadeOut: 500 })

        .effect()
        .file("jb2a.impact.ground_crack.still_frame.03")
        .atLocation(workflow.token)
        .size(6, { 'gridUnits': true })
        .duration(8000)
        .fadeIn(2000)
        .fadeOut(3000)
        .zIndex(0)
        .belowTokens()

        .thenDo(async () => {
            Sequencer.EffectManager.endEffects({ name: `${workflow.token.document.name} DW1` })
        })

        //Top Right
        .effect()
        .file("jb2a.thunderwave.bottom_left.dark_purple")
        .atLocation(workflow.token, { offset: { x: 3, y: -3 }, gridUnits: true })
        .scaleToObject(8)

        //Top Left
        .effect()
        .file("jb2a.thunderwave.bottom_left.dark_purple")
        .atLocation(workflow.token, { offset: { x: -3, y: -3 }, gridUnits: true })
        .scaleToObject(8)
        .rotate(90)

        //Bot Left
        .effect()
        .file("jb2a.thunderwave.bottom_left.dark_purple")
        .atLocation(workflow.token, { offset: { x: -3, y: 3 }, gridUnits: true })
        .scaleToObject(8)
        .rotate(180)

        //Bot Right
        .effect()
        .file("jb2a.thunderwave.bottom_left.dark_purple")
        .atLocation(workflow.token, { offset: { x: 3, y: 3 }, gridUnits: true })
        .scaleToObject(8)
        .rotate(270)

        .effect()
        .file("jb2a.soundwave.02.purple")
        .attachTo(workflow.token)
        .size(14, { gridUnits: true })
        .delay(200)
        .playbackRate(2.5)
        .repeats(10, 150)

        .thenDo(async () => {
            if (featureWorkflow.failedSaves.size) {
                for (let target of Array.from(featureWorkflow.failedSaves)) {
                    if (!mba.checkTrait(target.actor, "ci", "prone") && !mba.findEffect(target.actor, "Prone")) await mba.addCondition(target.actor, "Prone");
                }
            }
        })

        .play();
}

export let destructiveWave = {
    'cast': cast,
    'item': item
}