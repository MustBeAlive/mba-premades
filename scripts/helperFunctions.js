export let mba = {
    'getItemDescription': function _getItemDescription(key, name) {
        let journalEntry = game.journal.getName(key);
        if (!journalEntry) {
            ui.notifications.error('Item descriptions journal entry not found!');
            return;
        }
        let page = journalEntry.pages.getName(name);
        if (!page) {
            ui.notifications.warn('Item description not found in journal!');
            return;
        }
        let description = page.text.content;
        return description;
    },
    'jb2aCheck': function _jb2aCheck() {
        let patreon = game.modules.get('jb2a_patreon')?.active;
        let free = game.modules.get('JB2A_DnD5e')?.active;
        if (patreon && free) {
            ui.notifications.info('Включены обе версии модуля JB2A. Выключи бесплатную.');
            return 'patreon';
        }
        if (patreon) return 'patreon';
        if (free) return 'free';
        ui.notifications.info('Модуль JB2A не включен');
        return false;
    },
    'over30': function _over30 (targets) {
        let tokens = Array.from(targets);
        const distanceArray = [];
        for (let i = 0; i < tokens.length; i++) {
            for (let k = i + 1; k < tokens.length; k++) {
                let token1 = fromUuidSync(tokens[i].document.uuid).object;
                let token2 = fromUuidSync(tokens[k].document.uuid).object;
                distanceArray.push(MidiQOL.computeDistance(token1, token2));
            }
        }
        const found = distanceArray.some((distance) => distance > 30);
        if (found) return 'true';
        if (!found) return 'false';
    },
    'functionToString': function _functiongToString(input) {
        return `(${input.toString()})()`;
    },
    'addCondition': async function _addCondition(actor, name, overlay, origin) {
        await game.dfreds.effectInterface.addEffect(
            {
                'effectName': name,
                'uuid': actor.uuid,
                'origin': origin,
                'overlay': overlay
            }
        );
    },
    'removeCondition': async function _removeCondition(actor, name) {
        await game.dfreds.effectInterface.removeEffect(
            {
                'effectName': name,
                'uuid': actor.uuid
            }
        );
    },
    'raceOrType': function _raceOrType(entity) {
        return MidiQOL.typeOrRace(entity);
    },
    'getItemFromCompendium': async function _getItemFromCompendium(key, name, ignoreNotFound, packFolderId) {
        const gamePack = game.packs.get(key);
        if (!gamePack) {
            ui.notifications.warn('Invalid compendium specified!');
            return false;
        }
        let packIndex = await gamePack.getIndex({'fields': ['name', 'type', 'folder']});
        let match = packIndex.find(item => item.name === name && (!packFolderId || (packFolderId && item.folder === packFolderId)));
        if (match) {
            return (await gamePack.getDocument(match._id))?.toObject();
        } else {
            if (!ignoreNotFound) ui.notifications.warn('Item not found in specified compendium! Check spelling?');
            return undefined;
        }
    },
    'dialog': async function _dialog(title, options, content) {
        if (content) content = '<center>' + content + '</center>';
        let buttons = options.map(([label, value]) => ({label, value}));
        let selected = await warpgate.buttonDialog(
            {
                buttons,
                title,
                content
            },
            'column'
        );
        return selected;
    },
    'numberDialog': async function _numberDialog(title, buttons, options) {
        let inputs = [];
        for (let i of options) {
            inputs.push({
                'label': i,
                'type': 'number'
            });
        }
        let config = {
            'title': title
        };
        return await warpgate.menu(
            {
                'inputs': inputs,
                'buttons': buttons
            },
            config
        );
    },
    'applyDamage': async function _applyDamage(tokenList, damageValue, damageType) {
        let targets;
        if (Array.isArray(tokenList)) {
            targets = new Set(tokenList);
        } else {
            targets = new Set([tokenList]);
        }
        await MidiQOL.applyTokenDamage(
            [
                {
                    damage: damageValue,
                    type: damageType
                }
            ],
            damageValue,
            targets,
            null,
            null
        );
    },
    'inCombat': function _inCombat() {
        return !(game.combat === null || game.combat === undefined || game.combat?.started === false);
    },
    'updateTargets': function _updateTargets(targets) {
        game.user.updateTokenTargets(targets);
    },
    'getSize': function _getSize(actor, sizeToString) {
    },
    'getCriticalFormula': function _getCriticalFormula(formula) {
        return new CONFIG.Dice.DamageRoll(formula, {}, {'critical': true, 'powerfulCritical': game.settings.get('dnd5e', 'criticalDamageMaxDice'), 'multiplyNumeric': game.settings.get('dnd5e', 'criticalDamageModifiers')}).formula;
    }
}