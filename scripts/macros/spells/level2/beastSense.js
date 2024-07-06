import {mba} from "../../../helperFunctions.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
	let target = workflow.targets.first();
	if (mba.raceOrType(target.actor) != "beast") {
		ui.notifications.warn("Target is not a beast!");
		await mba.removeCondition(workflow.actor, "Concentrating");
		return;
	}
	let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Beast Sense: See Through Beast", false);
	if (!featureData) {
		await mba.removeCondition(workflow.actor, "Concentrating");
		return;
	}
	delete featureData._id;
	async function effectMacroDel() {
		await warpgate.revert(token.document, 'Beast Sense');
	};
	let effectData = {
		'name': workflow.item.name,
		'icon': workflow.item.img,
		'origin': workflow.item.uuid,
		'description': `
			<p>For the duration of the spell, you can use your action to see through the beast's eyes (${target.document.name}) and hear what it hears, and continue to do so until you use your action to return to your normal senses.</p>
			<p>While perceiving through the beast's senses, you gain the benefits of any special senses possessed by that creature, though you are @UUID[Compendium.mba-premades.MBA SRD.Item.3NxmNhGQQqUDnu73]{Blinded} and @UUID[Compendium.mba-premades.MBA SRD.Item.GmOl4GcI3fguwIJc]{Deafened} to your own surroundings.</p>
		`,
		'duration': {
			'seconds': 3600
		},
		'flags': {
			'effectmacro': {
				'onDelete': {
					'script': mba.functionToString(effectMacroDel)
				}
			},
			'mba-premades': {
				'spell': {
					'beastSense': {
						'state': 0,
						'targetUuid': target.document.uuid
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
	let updates = {
		'embedded': {
			'Item': {
				[featureData.name]: featureData
			},
			'ActiveEffect': {
				[effectData.name]: effectData
			}
		}
	};
	let options = {
		'permanent': false,
		'name': 'Beast Sense',
		'description': 'Beast Sense'
	};

	new Sequence()

		.wait(500)

		.effect()
		.file("jb2a.magic_signs.circle.02.divination.complete.blue")
		.attachTo(workflow.token)
		.scaleToObject(2)
		.waitUntilFinished(-8600)

		.effect()
		.file("jb2a.magic_signs.rune.divination.complete.blue")
		.attachTo(target)
		.scaleToObject(1.4)

		.effect()
		.file("jb2a.magic_signs.rune.divination.complete.blue")
		.attachTo(target)
		.scaleToObject(1.4)
		.mirrorX()

		.effect()
		.file("jb2a.eyes.01.bluegreen.single.0")
		.attachTo(target)
		.scaleToObject(1.5)
		.delay(2000)
		.fadeIn(1000)
		.fadeOut(1000)
		.filter("ColorMatrix", { hue: 30 })
		.playbackRate(0.8)

		.thenDo(async () => {
			await warpgate.mutate(workflow.token.document, updates, {}, options);
		})

		.play()
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
	let effect = await mba.findEffect(workflow.actor, "Beast Sense");
	if (!effect) {
		ui.notifications.warn("Unable to find effect! (Beast Sense)");
		return;
	}
	let state = effect.flags['mba-premades']?.spell?.beastSense?.state;
	let targetDoc = await fromUuid(effect.flags['mba-premades']?.spell?.beastSense?.targetUuid);
	let target = targetDoc.object;
	let choices = [];
	if (state === 0) choices.push([`See through Beast (${targetDoc.name})`, "see"]);
	else if (state === 1) choices.push(["Return to Self", "return"]);
	if (!choices.length) return;
	choices.push(["Cancel", false]);
	let selection = await mba.dialog("Beast Sense", choices, "<b>What would you like to do?</b>");
	if (!selection) return;
	if (selection === "see") {
		let ownership = target.actor.ownership;
		ownership[`${game.user.id}`] = 2;
		async function effectMacroDel() {
			await warpgate.revert(token.document, 'Beast Sense');
		};
		let effectData = {
			'name': "Beast Sense: See Through Beast",
			'icon': workflow.item.img,
			'origin': workflow.item.uuid,
			'flags': {
				'dae': {
					'showIcon': true
				},
				'effectmacro': {
					'onDelete': {
						'script': mba.functionToString(effectMacroDel)
					}
				},
			}
		}
		let sourceUpdates = {
			'changes': [
				{
					'key': 'macro.CE',
					'mode': 0,
					'value': 'Blinded',
					'priority': 20
				},
				{
					'key': 'macro.CE',
					'mode': 0,
					'value': 'Deafened',
					'priority': 20
				},
			],
			'flags': {
				'mba-premades': {
					'spell': {
						'beastSense': {
							'state': 1,
						}
					}
				}
			}
		};
		let targetUpdates = {
			'actor': {
				'ownership': ownership
			},
			'embedded': {
				'ActiveEffect': {
					[effectData.name]: effectData
				}
			}
		};
		let options = {
			'permanent': false,
			'name': 'Beast Sense',
			'description': 'Beast Sense'
		};

		new Sequence()

			.effect()
			.file("jb2a.magic_signs.rune.divination.complete.blue")
			.attachTo(workflow.token)
			.scaleToObject(1.4)

			.effect()
			.file("jb2a.magic_signs.rune.divination.complete.blue")
			.attachTo(workflow.token)
			.scaleToObject(1.4)
			.mirrorX()

			.effect()
			.file("jb2a.eyes.01.bluegreen.single.0")
			.attachTo(target)
			.scaleToObject(1.5)
			.delay(500)
			.fadeIn(1000)
			.fadeOut(1000)
			.filter("ColorMatrix", { hue: 30 })
			.playbackRate(0.8)

			.thenDo(async () => {
				await warpgate.mutate(target.document, targetUpdates, {}, options);
				await mba.updateEffect(effect, sourceUpdates);
				await workflow.token.document.update({ "sight.enabled": false });
			})

			.play()
	}
	else if (selection === "return") {
		let targetEffect = await mba.findEffect(target.actor, "Beast Sense: See Through Beast");
		if (targetEffect) await mba.removeEffect(targetEffect);
		let sourceUpdates = {
			'changes': [],
			'flags': {
				'mba-premades': {
					'spell': {
						'beastSense': {
							'state': 0,
						}
					}
				}
			}
		};
		await mba.updateEffect(effect, sourceUpdates);
		await workflow.token.document.update({ "sight.enabled": true });
	}
}

export let beastSense = {
	'cast': cast,
	'item': item
}