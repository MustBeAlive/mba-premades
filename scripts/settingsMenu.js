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