// Cringe implementation, but RaW; rework w/o synthetic item use 
async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
	let ammount = workflow.castData.castLevel;
	if (workflow.targets.size > ammount) {
		let selection = await chrisPremades.helpers.selectTarget(workflow.item.name, chrisPremades.constants.okCancel, Array.from(workflow.targets), false, 'multiple', undefined, false, 'Too many targets selected. Choose which targets to keep (Max: ' + ammount + ')');
		if (!selection.buttons) {
			ui.notifications.warn('Failed to select right ammount of targets, try again!')
			await chrisPremades.helpers.removeCondition(workflow.actor, "Concentrating");
			return;
		}
		let newTargets = selection.inputs.filter(i => i).slice(0, ammount);
		await chrisPremades.helpers.updateTargets(newTargets);
	}
	await warpgate.wait(100);
	let targets = Array.from(game.user.targets);
	const distanceArray = [];
	for (let i = 0; i < targets.length; i++) {
		for (let k = i + 1; k < targets.length; k++) {
			let target1 = fromUuidSync(targets[i].document.uuid).object;
			let target2 = fromUuidSync(targets[k].document.uuid).object;
			distanceArray.push(chrisPremades.helpers.getDistance(target1, target2));
		}
	}
	const found = distanceArray.some((distance) => distance > 30);
	if (found === true) {
		ui.notifications.warn('Targets cannot be further than 30 ft. of each other!')
		await chrisPremades.helpers.removeCondition(workflow.actor, "Concentrating");
		return;
	}
	await warpgate.wait(100);
	let featureData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Spell Features', 'Cause Fear: Fear', false);
	if (!featureData) {
		ui.notifications.warn('Can\'t find item in compenidum! (Cause Fear: Fear)');
		return
	}
	let originItem = workflow.item;
	if (!originItem) return;
	featureData.system.save.dc = chrisPremades.helpers.getSpellDC(originItem);
	setProperty(featureData, 'chris-premades.spell.castData.school', originItem.system.school);
	let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
	let targetUuids = [];
	for (let i of targets) targetUuids.push(i.document.uuid);
	let [config, options] = chrisPremades.constants.syntheticItemWorkflowOptions(targetUuids);
	await warpgate.wait(100);
	await game.messages.get(workflow.itemCardId).delete();
	let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
	if (!featureWorkflow.failedSaves.size) {
		await chrisPremades.helpers.removeCondition(workflow.actor, "Concentrating");
		return;
	}
	let failedTargets = Array.from(featureWorkflow.failedSaves);
	async function effectMacroDel() {
		await Sequencer.EffectManager.endEffects({ name: `${token.document.name} Cause Fear`, object: token })
	}
	let effectData = {
		'name': workflow.item.name,
		'icon': workflow.item.img,
		'origin': workflow.item.uuid,
		'description': "<p>You feel the sense of mortality and are frightened for the duration.</p><p>At the end of each of your turns you can repeat the saving throw, ending the effect on a success.</p>",
		'duration': {
			'seconds': 60
		},
		'changes': [
			{
				'key': 'flags.midi-qol.OverTime',
				'mode': 0,
				'value': 'turn=end, saveAbility=wis, saveDC=' + chrisPremades.helpers.getSpellDC(workflow.item) + ', saveMagic=true, name=Cause Fear: End Turn',
				'priority': 20
			},
			{
				'key': 'macro.CE',
				'mode': 0,
				'value': 'Frightened',
				'priority': 20
			}
		],
		'flags': {
			'effectmacro': {
				'onDelete': {
					'script': chrisPremades.helpers.functionToString(effectMacroDel)
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

	await new Sequence()

		.effect()
		.atLocation(token)
		.file(`jb2a.magic_signs.circle.02.necromancy.loop.green`)
		.scaleToObject(1.5)
		.rotateIn(180, 600, { ease: "easeOutCubic" })
		.scaleIn(0, 600, { ease: "easeOutCubic" })
		.loopProperty("sprite", "rotation", { from: 0, to: -360, duration: 10000 })
		.belowTokens()
		.fadeOut(2000)
		.zIndex(0)

		.effect()
		.atLocation(token)
		.file(`jb2a.magic_signs.circle.02.necromancy.loop.green`)
		.scaleToObject(1.5)
		.rotateIn(180, 600, { ease: "easeOutCubic" })
		.scaleIn(0, 600, { ease: "easeOutCubic" })
		.loopProperty("sprite", "rotation", { from: 0, to: -360, duration: 10000 })
		.belowTokens(true)
		.filter("ColorMatrix", { saturate: -1, brightness: 2 })
		.filter("Blur", { blurX: 5, blurY: 10 })
		.zIndex(1)
		.duration(1200)
		.fadeIn(200, { ease: "easeOutCirc", delay: 500 })
		.fadeOut(300, { ease: "linear" })

		.wait(1500)

		.play();

	failedTargets.forEach(target => {

		new Sequence()

			.effect()
			.file("animated-spell-effects-cartoon.level 01.bless.green")
			.atLocation(target, { randomOffset: 1.2, gridUnits: true })
			.scaleToObject(0.5)
			.repeats(8, 100, 100)
			.filter("ColorMatrix", { hue: 5 })
			.zIndex(1)

			.effect()
			.file("animated-spell-effects-cartoon.cantrips.mending.green")
			.atLocation(target)
			.scaleToObject(3)
			.opacity(0.75)
			.filter("ColorMatrix", { saturate: 1, brightness: 1.3, hue: -5 })
			.zIndex(0)
			.waitUntilFinished(-500)

			.thenDo(function () {
				chrisPremades.helpers.createEffect(target.actor, effectData);
			})

			.effect()
			.file("jb2a.icon.fear.dark_orange")
			.atLocation(target)
			.scaleIn(0, 500, { ease: "easeOutQuint" })
			.fadeOut(1000)
			.scaleToObject(1)
			.atLocation(target)
			.duration(2000)
			.attachTo(target)
			.filter("ColorMatrix", { hue: 120 })
			.playbackRate(1)

			.effect()
			.file("jb2a.icon.fear.dark_orange")
			.atLocation(target)
			.scaleToObject(3)
			.anchor({ y: 0.45 })
			.scaleIn(0, 500, { ease: "easeOutQuint" })
			.fadeOut(1000)
			.atLocation(target)
			.duration(1000)
			.attachTo(target)
			.playbackRate(1)
			.filter("ColorMatrix", { hue: 130 })
			.opacity(0.5)

			.effect()
			.file("jb2a.extras.tmfx.border.circle.outpulse.01.fast")
			.atLocation(target)
			.scaleToObject(2)

			.effect()
			.file("jb2a.markers.fear.dark_orange.03")
			.atLocation(target)
			.scaleToObject(2)
			.delay(500)
			.center()
			.fadeIn(1000)
			.playbackRate(1)
			.attachTo(target)
			.filter("ColorMatrix", { hue: 130 })
			.persist()
			.name(`${target.document.name} Cause Fear`)

			.play()
	});
}

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
	let targets = Array.from(workflow.targets);
	for (let i of targets) {
		let immuneData = {
			'name': 'Save Immunity',
			'icon': 'assets/library/icons/sorted/generic/generic_buff.webp',
			'description': "You succeed on the next save you make",
			'duration': {
				'turns': 1
			},
			'changes': [
				{
					'key': 'flags.midi-qol.min.ability.save.all',
					'value': '100',
					'mode': 2,
					'priority': 120
				}
			],
			'flags': {
				'dae': {
					'specialDuration': ['isSave']
				},
				'chris-premades': {
					'effect': {
						'noAnimation': true
					}
				}
			}
		};
		let type = chrisPremades.helpers.raceOrType(i.actor);
		if (type === 'undead' || type === 'construct') {
			ChatMessage.create({
				flavor: i.document.name + ' is unaffected by Cause Fear! (Target is undead/construct)',
				speaker: ChatMessage.getSpeaker({ actor: workflow.actor })
			});
			await chrisPremades.helpers.createEffect(i.actor, immuneData);
			return;
		}
		let hasFearImmunity = chrisPremades.helpers.checkTrait(i.actor, 'ci', 'frightened');
		if (hasFearImmunity) {
			ChatMessage.create({
				flavor: i.document.name + ' is unaffected by Cause Fear! (target is immune to condition: Frightened)',
				speaker: ChatMessage.getSpeaker({ actor: workflow.actor })
			});
			await chrisPremades.helpers.createEffect(i.actor, immuneData);
			return;
		}
	}
}

export let causeFear = {
	'item': item,
	'cast': cast,
}