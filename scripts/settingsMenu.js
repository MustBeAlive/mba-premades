import {updateAllSceneNPCs, updateSceneNPCs, updateSidebarNPCs} from './actor.js';
import {additionalCompendiumPriority, additionalCompendiums, selectCompendium} from './compendium.js';
import {fixSettings, troubleshoot} from './help.js';
import {tours} from './tours.js';
import {allRaces} from './utility/npcRandomizer.js';
let settingCategories = {};
export function addMenuSetting(key, category) {
    setProperty(settingCategories, key.split(' ').join('-'), category);
}
let labels = {
    'Humanoid-Randomizer-Settings': 'Configure',
    'Additional-Compendiums': 'Configure',
    'Additional-Compendium-Priority': 'Configure',
    'Item-Compendium': 'Select',
    'Spell-Compendium': 'Select',
    'Monster-Compendium': 'Select',
    'Racial-Trait-Compendium': 'Select'
}
class mbaSettingsBase extends FormApplication {
    constructor() {
        super();
        this.category = null;
    }
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            'classes': ['form'],
            'popOut': true,
            'template': 'modules/mba-premades/templates/config.html',
            'id': 'mba-premades-settings',
            'title': 'MBA Premades',
            'width': 800,
            'height': 'auto',
            'closeOnSubmit': true
        });
    }
    getData() {
        let generatedOptions = [];
	    for (let setting of game.settings.settings.values()) {
            if (setting.namespace != 'mba-premades') continue;
            let key = setting.key.split(' ').join('-');
            if (settingCategories[key] != this.category) continue;
            const s = foundry.utils.deepClone(setting);
            if (s.scope === 'world' && !game.user.isGM) continue;
            s.id = `${s.key}`;
            s.name = game.i18n.localize(s.name);
            s.hint = game.i18n.localize(s.hint);
            s.value = game.settings.get(s.namespace, s.key);
            s.type = setting.type instanceof Function ? setting.type.name : 'String';
            s.isCheckbox = setting.type === Boolean;
            s.isSelect = s.choices !== undefined;
            s.isRange = (setting.type === Number) && s.range;
            s.isNumber = setting.type === Number;
            s.filePickerType = s.filePicker === true ? 'any' : s.filePicker;
            s.isButton = (setting.type instanceof Object || setting.type instanceof Array) && setting.type.name != 'String';
            if (s.select) s.isButton = true;
            s.label = labels[key];
            generatedOptions.push(s);
	    }
        return {'settings': generatedOptions.sort(function (a, b) {
            let nameA = a.name.toUpperCase();
            let nameB = b.name.toUpperCase();
            if (nameA > nameB) {
                return 1;
            } else if (nameA < nameB) {
                return -1;
            } else {
                return 0;
            }
        })};
    }
    activateListeners(html) {
        super.activateListeners(html);
    }
    async _updateObject(event, formData) {
        for (let [key, value] of Object.entries(formData)) {
            if (game.settings.get('mba-premades', key) === value) continue;
            await game.settings.set('mba-premades', key, value);
        }
    }
}
export class mbaSettingsGeneral extends mbaSettingsBase {
    constructor() {
        super();
        this.category = 'General';
    }
}
export class mbaSettingsCompendiums extends mbaSettingsBase {
    constructor() {
        super();
        this.category = 'Compendiums';
    }
}
export class mbaSettingsMechanics extends mbaSettingsBase {
    constructor() {
        super();
        this.category = 'Mechanics';
    }
}
export class mbaSettingsSpells extends mbaSettingsBase {
    constructor() {
        super();
        this.category = 'Spells';
    }
}
export class mbaSettingsFeats extends mbaSettingsBase {
    constructor() {
        super();
        this.category = 'Feats';
    }
}
export class mbaSettingsClassFeats extends mbaSettingsBase {
    constructor() {
        super();
        this.category = 'Class Features';
    }
}
export class mbaSettingsRaceFeats extends mbaSettingsBase {
    constructor() {
        super();
        this.category = 'Race Features';
    }
}
export class mbaSettingsMonsterFeats extends mbaSettingsBase {
    constructor() {
        super();
        this.category = 'Monster Features';
    }
}
export class mbaSettingsSummons extends mbaSettingsBase {
    constructor() {
        super();
        this.category = 'Summons';
    }
}
export class mbaSettingsHomewbrew extends mbaSettingsBase {
    constructor() {
        super();
        this.category = 'Homebrew';
    }
}
export class mbaSettingsModule extends mbaSettingsBase {
    constructor() {
        super();
        this.category = 'Module Integration';
    }
}
export class mbaSettingsManualRolling extends mbaSettingsBase {
    constructor() {
        super();
        this.category = 'Manual Rolling';
    }
}
export class mbaSettingsRandomizer extends mbaSettingsBase {
    constructor() {
        super();
        this.category = 'Randomizer';
    }
}
export class mbaSettingsAnimations extends mbaSettingsBase {
    constructor() {
        super();
        this.category = 'Animations';
    }
}
export class mbaSettingsTroubleshoot extends FormApplication {
    constructor() {
        super();
    }
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            'classes': ['form'],
            'popOut': true,
            'template': 'modules/mba-premades/templates/config.html',
            'id': 'mba-troubleshoot-settings',
            'title': 'Help',
            'width': 800,
            'height': 'auto',
            'closeOnSubmit': true
        });
    }
    getData() {
        return {
            'settings': [
                {
                    'name': 'Tour Features',
                    'id': 'tour',
                    'value': {},
                    'isButton': true,
                    'hint': 'Start a guided tour of MBA Premades.',
                    'label': 'Go'
                },
                {
                    'name': 'Run Troubleshooter:',
                    'id': 'trouble',
                    'value': {},
                    'isButton': true,
                    'hint': 'Will export a file used to help troubleshoot issues with this module on my Discord server.',
                    'label': 'Go'
                },
                {
                    'name': 'Apply recommended setting fixes:',
                    'id': 'fix',
                    'value': {},
                    'isButton': true,
                    'hint': 'This will have the module automatically apply recommended setting changes.',
                    'label': 'Go'
                }
            ]
        }
    }
    activateListeners(html) {
        super.activateListeners(html);
    }
    async _updateObject(event, formData) {

    }
}
export class mbaSettingsRandomizerHumanoid extends FormApplication {
    constructor() {
        super();
    }
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            'classes': ['form'],
            'popOut': true,
            'template': 'modules/mba-premades/templates/config.html',
            'id': 'mba-humanoid-randomizer-settings',
            'title': 'mba\'s Humanoid Randomizer Settings',
            'width': 800,
            'height': 'auto',
            'closeOnSubmit': true
        });
    }
    getData() {
        let generatedOptions = [];
        let humanoidSettings = game.settings.get('mba-premades', 'Humanoid Randomizer Settings');
        for (let i of Object.values(allRaces)) {
            let id = i.name.toLowerCase().split(' ').join('-');
            generatedOptions.push(
                {
                    'name': i.name + ' enabled:',
                    'id': id + '.enabled',
                    'value': humanoidSettings?.[id]?.enabled ?? allRaces[id].enabled,
                    'isCheckbox': true,
                    'hint': 'Enable use of the ' + i.name + ' race?'
                },
                {
                    'name': i.name + ' weight:',
                    'id': id + '.weight',
                    'value': humanoidSettings?.[id]?.weight ?? allRaces[id].weight,
                    'isRange': true,
                    'range': {
                        'min': 1,
                        'max': 100,
                        'step': 1
                    },
                    'hint': 'Weighted chance for ' + i.name + ' to be selected.'
                }
            );
        }
        return {'settings': generatedOptions};
    }
    activateListeners(html) {
        super.activateListeners(html);
    }
    async _updateObject(event, formData) {
        let updates = {};
        for (let [key, value] of Object.entries(formData)) {
            setProperty(updates, key, value);
        }
        let setting = mergeObject(allRaces, game.settings.get('mba-premades', 'Humanoid Randomizer Settings'));
        mergeObject(setting, updates);
        game.settings.set('mba-premades', 'Humanoid Randomizer Settings', setting);
    }
}
export async function settingButton(id) {
    switch (id) {
        case 'Humanoid Randomizer Settings':
            await new mbaSettingsRandomizerHumanoid().render(true);
            break;
        case 'trouble':
            try {
                troubleshoot();
            } catch {}
            break;
        case 'fix':
            fixSettings();
            break;
        case 'sidebarNPCs':
            await updateSidebarNPCs();
            break;
        case 'sceneNPCs':
            await updateSceneNPCs();
            break;
        case 'allSceneNPCs':
            await updateAllSceneNPCs();
            break;
        case 'Additional Compendiums':
            await additionalCompendiums();
            break;
        case 'Additional Compendium Priority':
            await additionalCompendiumPriority();
            break;
        case 'Item Compendium':
        case 'Spell Compendium':
        case 'Monster Compendium':
        case 'Racial Trait Compendium':
            await selectCompendium(id);
            break;
        case 'tour':
            game.settings.sheet.close();
            let dialogApp = Object.values(ui.windows).find(i => i.id === 'mba-troubleshoot-settings');
            if (dialogApp) dialogApp.close();
            await warpgate.wait(100);
            await tours.guidedTour();
            break;
    }
}
export class mbaSettingsNPCUpdate extends FormApplication {
    constructor() {
        super();
    }
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            'classes': ['form'],
            'popOut': true,
            'template': 'modules/mba-premades/templates/config.html',
            'id': 'mba-npc-updater',
            'title': 'MBA NPC Updater',
            'width': 800,
            'height': 'auto',
            'closeOnSubmit': true
        });
    }
    getData() {
        return {
            'settings': [
                {
                    'name': 'Update Sidebar NPCs:',
                    'id': 'sidebarNPCs',
                    'value': {},
                    'isButton': true,
                    'hint': 'This will use the D&D Beyond Importer API to update all sidebar NPCs with automations from this module. Use with care!',
                    'label': 'Go'
                },
                {
                    'name': 'Update Current Scene NPCs:',
                    'id': 'sceneNPCs',
                    'value': {},
                    'isButton': true,
                    'hint': 'This will use the D&D Beyond Importer API to update the NPCs on the current scene with automations from this module. Use with care!',
                    'label': 'Go'
                },
                {
                    'name': 'Update All Scene NPCs',
                    'id': 'allSceneNPCs',
                    'value': {},
                    'isButton': true,
                    'hint': 'This will use the D&D Beyond Importer API to update all NPCs on all scenes with automations from this module. Use with care!',
                    'label': 'Go'
                }
            ]
        }
    }
    activateListeners(html) {
        super.activateListeners(html);
    }
    async _updateObject(event, formData) {

    }
}