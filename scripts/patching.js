import {constants} from './macros/generic/constants.js';
import {mba} from './helperFunctions.js';
import {saves, skills} from './macros.js';

export function patchSkills(enabled) {
    if (enabled) {
        libWrapper.register('mba-premades', 'CONFIG.Actor.documentClass.prototype.rollSkill', doRollSkill, 'WRAPPER');
    } else {
        libWrapper.unregister('mba-premades', 'CONFIG.Actor.documentClass.prototype.rollSkill');
    }
}

async function doRollSkill(wrapped, ...args) {
    let [skillId, options] = args;
    if (!options) options = {};
    let flags = this.flags['mba-premades']?.skill;
    if (flags) {
        let selections = [];
        for (let [key, value] of Object.entries(flags)) {
            if (!value) continue;
            if (typeof skills[key] != 'function') continue;
            let data = skills[key].bind(this)(skillId, options);
            if (data) selections.push(data);
        }
        if (selections.length) {
            let advantages = selections.filter(i => i.type === 'advantage').map(j => ({ 'type': 'checkbox', 'label': j.label, 'options': false }));
            let disadvantages = selections.filter(i => i.type === 'disadvantage').map(j => ({ 'type': 'checkbox', 'label': j.label, 'options': false }));
            let generatedInputs = [];
            if (advantages.length) {
                generatedInputs.push({ 'label': '<u><h3>Advantage:</h3></u>', 'type': 'info' });
                generatedInputs.push(...advantages);
            }
            if (disadvantages.length) {
                generatedInputs.push({ 'label': '<u><h3>Disadvantage:</h3></u>', 'type': 'info' });
                generatedInputs.push(...disadvantages);
            }
            let selection = await mba.menu('Skill Roll Options', constants.okCancel, generatedInputs, true);
            if (selection.buttons) {
                let advantage = false;
                let disadvantage = false;
                if (advantages.length) advantage = !!selection.inputs.slice(1, advantages.length + 1).find(i => i);
                if (disadvantages.length) {
                    let start = 1;
                    let end = disadvantages.length + 1;
                    if (advantages.length) {
                        start += advantages.length + 1;
                        end += advantages.length + 1;
                    }
                    disadvantage = !!selection.inputs.slice(start, end).find(i => i);
                }
                if (advantage) options.advantage = true;
                if (disadvantage) options.disadvantage = true;
            }
        }
    }
    let returnData = await wrapped(skillId, options);
    //roll bonus here
    return returnData;
}

export function patchSaves(enabled) {
    if (enabled) {
        libWrapper.register('mba-premades', 'CONFIG.Actor.documentClass.prototype.rollAbilitySave', doRollSave, 'WRAPPER');
    } else {
        libWrapper.unregister('mba-premades', 'CONFIG.Actor.documentClass.prototype.rollAbilitySave');
    }
}

async function doRollSave(wrapped, ...args) {
    let [saveId, options] = args;
    let flags = this.flags['mba-premades']?.save;
    if (flags) {
        let selections = [];
        for (let [key, value] of Object.entries(flags)) {
            if (!value) continue;
            if (typeof saves[key] != 'function') continue;
            let data = saves[key].bind(this)(saveId, options);
            if (data) selections.push(data);
        }
        if (selections.length) {
            let advantages = selections.filter(i => i.type === 'advantage').map(j => ({ 'type': 'checkbox', 'label': j.label, 'options': false }));
            let disadvantages = selections.filter(i => i.type === 'disadvantage').map(j => ({ 'type': 'checkbox', 'label': j.label, 'options': false }));
            let generatedInputs = [];
            if (advantages.length) {
                generatedInputs.push({ 'label': '<u><h3>Advantage:</h3></u>', 'type': 'info' });
                generatedInputs.push(...advantages);
            }
            if (disadvantages.length) {
                generatedInputs.push({ 'label': '<u><h3>Disadvantage:</h3></u>', 'type': 'info' });
                generatedInputs.push(...disadvantages);
            }
            let selection = await mba.menu('Save Roll Options', constants.okCancel, generatedInputs, true);
            if (selection.buttons) {
                let advantage = false;
                let disadvantage = false;
                if (advantages.length) advantage = !!selection.inputs.slice(1, advantages.length + 1).find(i => i);
                if (disadvantages.length) {
                    let start = 1;
                    let end = disadvantages.length + 1;
                    if (advantages.length) {
                        start += advantages.length + 1;
                        end += advantages.length + 1;
                    }
                    disadvantage = !!selection.inputs.slice(start, end).find(i => i);
                }
                if (advantage) options.advantage = true;
                if (disadvantage) options.disadvantage = true;
            }
        }
    }
    let returnData = await wrapped(saveId, options);
    //roll bonus here
    return returnData;
}