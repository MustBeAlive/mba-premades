import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
	if (!workflow.failedSaves.size) return;
	let target = workflow.targets.first();
	let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Levitate: Control Elevation", false);
	if (!featureData) return;
	delete featureData._id;
	async function effectMacroSourceTurnStart() {
		let effect = await mbaPremades.helpers.findEffect(actor, "Levitate");
		if (!effect) return;
		let updates = { 'flags.mba-premades.spell.levitate.used': false };
		await mbaPremades.helpers.updateEffect(effect, updates);
	}
	async function effectMacroSourceDel() {
		await warpgate.revert(token.document, 'Levitate: Control Elevation');
	}
	let sourceEffectData = {
		'name': workflow.item.name,
		'icon': workflow.item.img,
		'origin': workflow.item.uuid,
		'description': "",
		'duration': {
			'seconds': 600
		},
		'flags': {
			'effectmacro': {
				'onTurnStart': {
					'script': mba.functionToString(effectMacroSourceTurnStart)
				},
				'onDelete': {
					'script': mba.functionToString(effectMacroSourceDel)
				}
			},
			'mba-premades': {
				'spell': {
					'levitate': {
						'targetUuid': target.document.uuid,
						'used': false,
					}
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
	let sourceUpdates = {
		'embedded': {
			'Item': {
				[featureData.name]: featureData,
			},
			'ActiveEffect': {
				[sourceEffectData.name]: sourceEffectData
			}
		}
	};
	let sourceOptions = {
		'permanent': false,
		'name': 'Levitate: Control Elevation',
		'description': 'Levitate: Control Elevation'
	};
	async function effectMacroTargetDel() {
		await new Sequence()

			.effect()
			.file("animated-spell-effects-cartoon.energy.pulse.yellow")
			.atLocation(token, { offset: { y: 0.2 }, gridUnits: true })
			.size({ width: token.document.width * 1.5, height: token.document.width * 1.45 }, { gridUnits: true })
			.belowTokens()
			.filter("ColorMatrix", { hue: -10 })
			.zIndex(1)
			.waitUntilFinished()

			.animation()
			.on(token)
			.opacity(1)

			.play()

		await Sequencer.EffectManager.endEffects({ name: `${token.document.name} Levitate` });
		await token.document.update({ "elevation": 0 });
	}
	let targetEffectData = {
		'name': "Levitate: Target",
		'icon': workflow.item.img,
		'origin': workflow.item.uuid,
		'description': "",
		'duration': {
			'seconds': 600
		},
		'flags': {
			'effectmacro': {
				'onDelete': {
					'script': mba.functionToString(effectMacroTargetDel)
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
	await warpgate.mutate(workflow.token.document, sourceUpdates, {}, sourceOptions);
	await mba.createEffect(target.actor, targetEffectData);
	let feature = workflow.actor.items.find(i => i.name === "Levitate: Control Elevation");
	let [config, options] = constants.syntheticItemWorkflowOptions([target.document.uuid]);
	await warpgate.wait(100);
	await game.messages.get(workflow.itemCardId).delete();
	await MidiQOL.completeItemUse(feature, config, options);
	await new Sequence()

		.wait(500)

		.effect()
		.file("animated-spell-effects-cartoon.energy.pulse.yellow")
		.atLocation(target, { offset: { y: 0.2 }, gridUnits: true })
		.size({ width: target.document.width * 1.5, height: target.document.width * 1.45 }, { gridUnits: true })
		.belowTokens()
		.filter("ColorMatrix", { hue: -10 })
		.zIndex(1)

		.effect()
		.file("animated-spell-effects-cartoon.smoke.105")
		.atLocation(target, { offset: { y: 0.05 }, gridUnits: true })
		.opacity(1)
		.scaleToObject(2)
		.tint("#FFd129")
		.belowTokens()

		.animation()
		.on(target)
		.opacity(0)

		.effect()
		.from(target)
		.attachTo(target, { bindAlpha: false, followRotation: true, locale: false })
		.scaleToObject(1, { considerTokenScale: true })
		.opacity(1)
		.duration(800)
		.loopProperty("sprite", "position.y", { from: 0, to: -30, duration: 5000, pingPong: true })
		.filter("Glow", { color: 0xFFd129, distance: 10, outerStrength: 4, innerStrength: 0 })
		.zIndex(2)
		.fadeOut(500)
		.persist()
		.name(`${target.document.name} Levitate`)

		.effect()
		.file("jb2a.particles.outward.orange.02.04")
		.scaleToObject(1.35, { considerTokenScale: true })
		.attachTo(target, { bindAlpha: false })
		.opacity(1)
		.duration(800)
		.loopProperty("sprite", "position.y", { from: 0, to: -30, duration: 5000, pingPong: true })
		.fadeIn(1000)
		.zIndex(2.2)
		.fadeOut(500)
		.persist()
		.name(`${target.document.name} Levitate`)

		.effect()
		.from(target)
		.atLocation(target)
		.scaleToObject(0.9)
		.duration(1000)
		.opacity(0.5)
		.belowTokens()
		.filter("ColorMatrix", { brightness: -1 })
		.filter("Blur", { blurX: 5, blurY: 10 })
		.attachTo(target, { bindAlpha: false })
		.zIndex(1)
		.fadeOut(500)
		.persist()
		.name(`${target.document.name} Levitate`)

		.play();
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
	let effect = await mba.findEffect(workflow.actor, "Levitate");
	if (!effect) return;
	if (effect.flags['mba-premades']?.spell?.levitate?.used === true) {
		ui.notifications.info("Cannot change elevation twice in one turn!");
		await game.messages.get(workflow.itemCardId).delete();
		return;
	}
	let target = await fromUuid(effect.flags['mba-premades']?.spell?.levitate?.targetUuid);
	let currentElevation = target.elevation;
	let maxElevation = 20 - currentElevation;
	let minElevation = +("-" + (20 - maxElevation));
	const changeValue = await warpgate.menu(
		{
			inputs: [{
				type: `text`,
				label: `<p>Available options:</p><p><b>${minElevation}</b> to <b>${maxElevation}</b></p>`,
				options: ``
			}],
			buttons: [{
				label: `Ok`,
				value: 1
			}]
		},
		{
			title: `Levitate: Change Elevation`
		}
	);
	let input = +changeValue.inputs[0];
	if (input > maxElevation || input < minElevation) {
		ui.notifications.warn("Wrong input, try again");
		return;
	}
	let elevationChange = currentElevation + input;
	let updates = { token: { elevation: elevationChange } };
	let options = {
		'permanent': true,
		'name': 'Levitate: Change Elevation',
		'description': 'Levitate: Change Elevation'
	};
	await warpgate.mutate(target, updates, {}, options);
	let sourceUpdates = { 'flags.mba-premades.spell.levitate.used': true };
	await mba.updateEffect(effect, sourceUpdates);
}

export let levitate = {
	'cast': cast,
	'item': item
}