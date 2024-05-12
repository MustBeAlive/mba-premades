import { mba } from "../../../helperFunctions.js";

export async function ceremony({ speaker, actor, token, character, item, args, scope, workflow }) {
	let choices = [
		['Atonement', 'Atonement'],
		['Bless Water', 'Water'],
		['Coming of Age', 'Age'],
		['Dedication', 'Dedication'],
		['Funeral Rite', 'Funeral'],
		['Wedding', 'Wedding']
	];
	let selection = await mba.dialog("Ceremony", choices, `<b>Choose one of the rites:</b>`);
	if (!selection) return;
	if (selection === "Atonement") {
		let target = workflow.targets.first();
		if (!target) {
			ui.notifications.warn("No target selected!");
			return;
		}
		let atonementRoll = await mba.rollRequest(workflow.token, 'skill', 'ins');

		new Sequence()

			.effect()
			.file("jb2a.divine_smite.caster.yellowwhite")
			.attachTo(token)
			.scaleToObject(1.85)
			.belowTokens()
			.waitUntilFinished(-1100)

			.effect()
			.file("jb2a.divine_smite.caster.reversed.yellowwhite")
			.attachTo(target)
			.scaleToObject(1.85)
			.belowTokens()
			.playIf(() => {
				return atonementRoll.total >= 20
			})

			.effect()
			.file("jb2a.template_circle.out_pulse.02.burst.yellowwhite")
			.attachTo(target)
			.scaleToObject(2.1)
			.delay(2000)
			.playIf(() => {
				return atonementRoll.total >= 20
			})

			.thenDo(function () {
				if (atonementRoll.total >= 20) ui.notifications.info(`You successfully restore ${target.document.name} to its original alignment.`);
				else ui.notifications.warn("Spell fails.");
			})

			.play()
	}
	else if (selection === "Water") {
		let waterFlask = mba.getItem(workflow.actor, "Water Flask");
		if (!waterFlask) {
			ui.notifications.warn("You don't have water flask to make holy water!");
			return;
		}
		if (waterFlask.system.quantity > 1) {
			waterFlask.update({ "system.quantity": waterFlask.system.quantity - 1 });
		} else {
			workflow.actor.deleteEmbeddedDocuments("Item", [waterFlask.id]);
		}
		let holyWater = mba.getItem(workflow.actor, "Holy Water");
		if (!holyWater) {
			const itemData = await mba.getItemFromCompendium('mba-premades.MBA Items', 'Holy Water', false);
			if (!itemData) {
				ui.notifications.warn("Unable to find item in compenidum! (Holy Water)");
				return
			}
			await workflow.actor.createEmbeddedDocuments("Item", [itemData]);
		} else {
			holyWater.update({ "system.quantity": holyWater.system.quantity + 1 });
		}
		new Sequence()

			.effect()
			.file("jb2a.divine_smite.caster.yellowwhite")
			.attachTo(token)
			.scaleToObject(1.85)
			.belowTokens()
			.waitUntilFinished(-1200)

			.effect()
			.file("jb2a.cast_generic.water.02.blue.0")
			.attachTo(token)
			.scaleToObject(1.9 * token.document.texture.scaleX)
			.fadeIn(500)

			.play()
	}
	else if (selection === "Age") {
		let target = workflow.targets.first();
		if (!target) {
			ui.notifications.warn("No target selected!");
			return;
		};
		if (mba.raceOrType(target.actor) != "humanoid") {
			ui.notifications.warn("Spell fails!");
			return;
		};
		if (mba.findEffect(target.actor, "Coming of Age: Immune")) {
			ui.notifications.warn("Creature can benefit from this rite only once!");
			return;
		};
		async function effectMacroDel() {
			const effectData = {
				'name': "Coming of Age: Immune",
				'icon': "modules/mba-premades/icons/spells/level1/ceremony1.webp"
			};
			await mbaPremades.helpers.createEffect(actor, effectData);
		};
		const effectData = {
			'name': "Ceremony: Coming of Age",
			'icon': workflow.item.img,
			'origin': workflow.item.uuid,
			'description': "Until the spell ends, you have 1d4 bonus to all ability checks.",
			'duration': {
				'seconds': 86400
			},
			'changes': [
				{
					'key': 'system.bonuses.abilities.check',
					'mode': 2,
					'value': "+1d4",
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
						baseLevel: 1,
						castLevel: workflow.castData.castLevel,
						itemUuid: workflow.item.uuid
					}
				}
			}
		};
		new Sequence()

			.effect()
			.file("jb2a.divine_smite.caster.yellowwhite")
			.attachTo(token)
			.scaleToObject(1.85)
			.belowTokens()
			.waitUntilFinished(-1100)

			.effect()
			.file("jb2a.divine_smite.caster.reversed.yellowwhite")
			.attachTo(target)
			.scaleToObject(1.85)
			.belowTokens()

			.wait(1500)

			.thenDo(function () {
				mba.createEffect(target.actor, effectData);
			})

			.play()
	}
	else if (selection === "Dedication") {
		let target = workflow.targets.first();
		if (!target) {
			ui.notifications.warn("No target selected!");
			return;
		}
		if (mba.raceOrType(target.actor) != "humanoid") {
			ui.notifications.warn("Spell fails!");
			return;
		}
		if (mba.findEffect(target.actor, "Dedication: Immune")) {
			ui.notifications.warn("Creature can benefit from this rite only once!");
			return;
		};
		async function effectMacroDel() {
			const effectData = {
				'name': "Dedication: Immune",
				'icon': "modules/mba-premades/icons/spells/level1/ceremony1.webp"
			};
			await mbaPremades.helpers.createEffect(actor, effectData);
		};
		const effectData = {
			'name': "Ceremony: Dedication",
			'icon': workflow.item.img,
			'origin': workflow.item.uuid,
			'description': "Until the spell ends, you have 1d4 bonus to all saving throws.",
			'duration': {
				'seconds': 86400
			},
			'changes': [
				{
					'key': 'system.bonuses.abilities.save',
					'mode': 2,
					'value': "+1d4",
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
						baseLevel: 1,
						castLevel: workflow.castData.castLevel,
						itemUuid: workflow.item.uuid
					}
				}
			}
		};
		new Sequence()

			.effect()
			.file("jb2a.divine_smite.caster.yellowwhite")
			.attachTo(token)
			.scaleToObject(1.85)
			.belowTokens()
			.waitUntilFinished(-1100)

			.effect()
			.file("jb2a.divine_smite.caster.reversed.yellowwhite")
			.attachTo(target)
			.scaleToObject(1.85)
			.belowTokens()

			.wait(1500)

			.thenDo(function () {
				mba.createEffect(target.actor, effectData);
			})

			.play()
	}
	else if (selection === "Funeral") {
		let target = workflow.targets.first();
		if (!target) {
			ui.notifications.warn("No target selected!");
			return;
		}
		if (!mba.findEffect(target.actor, "Dead")) {
			ui.notifications.info("Target is not dead!");
			return;
		}
		if (mba.raceOrType(target.actor) === "undead") {
			ui.notifications.info("Spell fails!");
			return;
		}
		const effectData = {
			'name': "Ceremony: Funeral Rite",
			'icon': workflow.item.img,
			'origin': workflow.item.uuid,
			'description': "For the next 7 days you can't become undead.",
			'duration': {
				'seconds': 604800
			},
			'flags': {
				'midi-qol': {
					'castData': {
						baseLevel: 1,
						castLevel: workflow.castData.castLevel,
						itemUuid: workflow.item.uuid
					}
				}
			}
		};
		new Sequence()

			.effect()
			.file("jb2a.divine_smite.caster.yellowwhite")
			.attachTo(token)
			.scaleToObject(1.85)
			.belowTokens()
			.waitUntilFinished(-1100)

			.effect()
			.file("jb2a.divine_smite.caster.reversed.yellowwhite")
			.attachTo(target)
			.scaleToObject(1.85)
			.belowTokens()

			.wait(1500)

			.thenDo(function () {
				mba.createEffect(target.actor, effectData);
			})

			.play()
	}
	else if (selection === "Wedding") {
		let targets = Array.from(workflow.targets);
		if (targets.length != 2) {
			ui.notifications.warn('Wrong ammount of targets!');
			return;
		}
		for (let target of targets) {
			if (mba.raceOrType(target.actor) != 'humanoid') {
				ui.notifications.warn("One of the targets is not human!");
				return;
			}
			if (mba.findEffect(target.actor, "Wedding: Immune")) {
				ui.notifications.warn("One of the targets is already married and can only benefit from this rite again if widowed.");
				return;
			}
		}
		let t1 = targets[0];
		let t2 = targets[1];
		async function effectMacroDel() {
			let effect = await mbaPremades.helpers.findEffect(actor, 'Ceremony: AC Bonus');
			if (effect) await mbaPremades.helpers.removeEffect(effect);
			const effectData = {
				'name': "Wedding: Immune",
				'icon': "modules/mba-premades/icons/spells/level1/ceremony2.webp"
			};
			await mbaPremades.helpers.createEffect(actor, effectData);
		}
		async function effectMacroEachTurn() {
			let effect = await mbaPremades.helpers.findEffect(actor, 'Ceremony: Wedding');
			let bonusEffect = await mbaPremades.helpers.findEffect(actor, 'Ceremony: AC Bonus');
			let partnerName = effect.flags['mba-premades']?.spell?.ceremony?.name;
			let nearbyPartner = await MidiQOL.findNearby(null, token, 30, { includeIncapacitated: true }).filter(i => i.name === partnerName);
			const effectData = {
				'name': "Ceremony: AC Bonus",
				'icon': "modules/mba-premades/icons/spells/level1/ceremony3.webp",
				'changes': [
					{
						'key': 'system.attributes.ac.bonus',
						'mode': 2,
						'value': "+2",
						'priority': 20
					}
				],
				'flags': {
					'dae': {
						'showIcon': true
					}
				}
			};
			if (nearbyPartner.length && bonusEffect) {
				return;
			}
			else if (nearbyPartner.length && !bonusEffect) {
				await mbaPremades.helpers.createEffect(actor, effectData);
				return;
			}
			else if (!nearbyPartner.lenth && bonusEffect) {
				await mbaPremades.helpers.removeEffect(bonusEffect);
				return;
			} else return;
		}
		const effectData1 = {
			'name': "Ceremony: Wedding",
			'icon': "modules/mba-premades/icons/spells/level1/ceremony2.webp",
			'description': `For the next 7 days, you have a +2 bonus to AC while you are within 30 feet of your partner (${t2.document.name}).`,
			'duration': {
				'seconds': 604800
			},
			'flags': {
				'mba-premades': {
					'spell': {
						'ceremony': {
							'name': t2.document.name
						}
					}
				},
				'effectmacro': {
					'onDelete': {
						'script': mba.functionToString(effectMacroDel)
					},
					'onEachTurn': {
						'script': mba.functionToString(effectMacroEachTurn)
					}
				},
				'midi-qol': {
					'castData': {
						baseLevel: 1,
						castLevel: workflow.castData.castLevel,
						itemUuid: workflow.item.uuid
					}
				}
			}
		};
		const effectData2 = {
			'name': "Ceremony: Wedding",
			'icon': "modules/mba-premades/icons/spells/level1/ceremony2.webp",
			'description': `For the next 7 days, you have a +2 bonus to AC while you are within 30 feet of your partner (${t1.document.name}).`,
			'duration': {
				'seconds': 604800
			},
			'flags': {
				'mba-premades': {
					'spell': {
						'ceremony': {
							'name': t1.document.name
						}
					}
				},
				'effectmacro': {
					'onDelete': {
						'script': mba.functionToString(effectMacroDel)
					},
					'onEachTurn': {
						'script': mba.functionToString(effectMacroEachTurn)
					}
				},
				'midi-qol': {
					'castData': {
						baseLevel: 1,
						castLevel: workflow.castData.castLevel,
						itemUuid: workflow.item.uuid
					}
				}
			}
		};
		new Sequence()

			.effect()
			.file("jb2a.divine_smite.caster.yellowwhite")
			.attachTo(token)
			.scaleToObject(1.85)
			.belowTokens()
			.waitUntilFinished(-1100)

			.effect()
			.file("jb2a.divine_smite.caster.reversed.yellowwhite")
			.attachTo(t1)
			.scaleToObject(1.85)
			.belowTokens()

			.effect()
			.file("jb2a.divine_smite.caster.reversed.yellowwhite")
			.attachTo(t2)
			.scaleToObject(1.85)
			.belowTokens()

			.wait(1500)

			.thenDo(function () {
				mba.createEffect(t1.actor, effectData1);
				mba.createEffect(t2.actor, effectData2);
			})

			.play()
	}
}