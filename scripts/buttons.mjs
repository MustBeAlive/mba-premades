const buttons = [
	{
		rollmode: CONST.DICE_ROLL_MODES.PUBLIC,
		icon: ['fas', 'fa-dice-d20'],
		label: 'CHAT.RollPublic'
	},
	{
		rollmode: CONST.DICE_ROLL_MODES.PRIVATE,
		icon: ['fas', 'fa-user-secret'],
		label: 'CHAT.RollPrivate'
	}, // 'fa-crown'
	{
		rollmode: CONST.DICE_ROLL_MODES.BLIND,
		icon: ['fas', 'fa-eye-slash'],
		label: 'CHAT.RollBlind'
	},
	{
		rollmode: CONST.DICE_ROLL_MODES.SELF,
		icon: ['fas', 'fa-ghost'],
		label: 'CHAT.RollSelf'
	},
];

function changeMode(_event) {
	game.settings.set('core', 'rollMode', this.dataset.rollmode)
}

/**
 * @param {ChatLog} log
 * @param {JQuery} html
 * @param {Object} options
 */
 export function createRollModeButtons(log, [html], options) {
	const controls = html.querySelector('#chat-controls');
	if (!controls) return;
	controls.classList.add('rollmode-buttons-override');
	const rollmode = controls.querySelector('.roll-type-select');
	if (!rollmode) return;

	const rollmodeBox = document.createElement('div');
	rollmodeBox.classList.add('rollmode-buttons');

	const currentMode = game.settings.get('core', 'rollMode');
	for (const b of buttons) {
		const button = document.createElement('button');
		button.dataset.rollmode = b.rollmode;
		const icon = document.createElement('i');
		icon.classList.add(...b.icon);
		button.append(icon);
		rollmodeBox.append(button);
		b.element = button;
		button.classList.toggle('active', currentMode === b.rollmode);

		button.dataset.tooltip = b.label;
		button.dataset.tooltipDirection = 'UP';

		button.addEventListener('click', changeMode);
	}

	rollmode.after(rollmodeBox);
	rollmode.remove();
}

export function rollModeChange(mode) {
	for (const button of buttons)
		button.element.classList.toggle('active', mode === button.rollmode);
}