import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

export async function magicMissile({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.targets.size) return;
    let maxMissiles = 3 + (workflow.castData.castLevel - 1);
    let targets = Array.from(workflow.targets);
    let selection = await mba.selectTarget(`Choose targets and ammount of missiles (Max: ${maxMissiles})`, constants.okCancel, targets, true, 'number');
    if (!selection.buttons) return;
    let total = 0;
    for (let i of selection.inputs) {
        if (!isNaN(i)) total += i;
    }
    if (total > maxMissiles) {
        ui.notifications.info('Input is bigger than missile ammount, try again!');
        return;
    }
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Magic Missile: Bolt", false);
    if (!featureData) return;
    featureData.flags['mba-premades'] = { 'spell': { 'castData': workflow.castData } };
    featureData.flags['mba-premades'].spell.castData.school = workflow.item.system.school;
    delete featureData._id;
    let damageFormula = '1d4[force] + 1';
    if (mba.getItem(workflow.actor, 'Empowered Evocation')) damageFormula += ' + ' + workflow.actor.system.abilities.int.mod;
    let damageRoll = await new Roll(damageFormula).roll({ 'async': true });
    await MidiQOL.displayDSNForRoll(damageRoll);
    damageRoll.toMessage({
        rollMode: 'roll',
        speaker: { 'alias': name },
        flavor: workflow.item.name
    });
    featureData.system.damage.parts = [[damageRoll.total + '[force]', 'force']];
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([]);
    let colors = [
        'grey',
        'dark_red',
        'orange',
        'yellow',
        'green',
        'blue',
        'purple'
    ];
    let colorSelection = "random";
    if (colorSelection === 'random' || colorSelection === 'cycle') await Sequencer.Preloader.preload('jb2a.magic_missile');
    let lastColor = Math.floor(Math.random() * colors.length);
    for (let i = 0; i < selection.inputs.length; i++) {
        if (isNaN(selection.inputs[i]) || selection.inputs[i] === 0) continue;
        options.targetUuids = [targets[i].document.uuid];
        for (let j = 0; j < selection.inputs[i]; j++) {
            let animation = 'jb2a.magic_missile.';
            if (colorSelection === 'random') {
                animation += colors[Math.floor((Math.random() * colors.length))];
            }
            else if (colorSelection === 'cycle') {
                animation += colors[lastColor];
                lastColor++;
                if (lastColor >= colors.length) lastColor = 0;
            }
            else animation += colorSelection;
            
            new Sequence()

                .effect()
                .file(animation)
                .atLocation(workflow.token)
                .stretchTo(targets[i])
                .randomizeMirrorY()

                .play();

            await MidiQOL.completeItemUse(feature, config, options);
        }
    }
}