// Cringe implementation, but RaW; rework w/o synthetic item use 
async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
	let ammount = workflow.castData.castLevel;
	if (workflow.targets.size > ammount) {
		let selection = await chrisPremades.helpers.selectTarget(workflow.item.name, chrisPremades.constants.okCancel, Array.from(workflow.targets), false, 'multiple', undefined, false, 'Too many targets selected. Choose which targets to keep (Max: ' + ammount + ')');
		if (!selection.buttons) {
			ui.notifications.warn('Failed to select right ammount of targets, try again!')
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
		return;
	}
	await warpgate.wait(100);
	let featureData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Spell Features', 'Charm Person: Charm', false);
	if (!featureData) {
		ui.notifications.warn('Can\'t find item in compenidum! (Charm Person: Charm)');
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
	await game.messages.get(workflow.itemCardId).delete();
	let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);

	if (!featureWorkflow.failedSaves.size) return;
	let failedTargets = Array.from(featureWorkflow.failedSaves);
	async function effectMacroDel() {
		await Sequencer.EffectManager.endEffects({ name: `${token.document.name} Charm Person`, object: token })
	}
	let effectData = {
		'name': workflow.item.name,
		'icon': workflow.item.img,
		'origin': workflow.item.uuid,
		'description': "You are charmed and regard caster of the spell as a friendly acquaintance. When the spell ends, you become aware that you were charmed.",
		'duration': {
			'seconds': 60
		},
		'changes': [
			{
				'key': 'macro.CE',
				'mode': 0,
				'value': 'Charmed',
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
	}

	await new Sequence()

		.effect()
		.atLocation(token)
		.file(`jb2a.magic_signs.circle.02.enchantment.loop.pink`)
		.scaleToObject(1.5)
		.rotateIn(180, 600, { ease: "easeOutCubic" })
		.scaleIn(0, 600, { ease: "easeOutCubic" })
		.loopProperty("sprite", "rotation", { from: 0, to: -360, duration: 10000 })
		.belowTokens()
		.fadeOut(2000)
		.zIndex(0)

		.effect()
		.atLocation(token)
		.file(`jb2a.magic_signs.circle.02.enchantment.loop.pink`)
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
			.file("animated-spell-effects-cartoon.level 01.bless.blue")
			.atLocation(target, { randomOffset: 1.2, gridUnits: true })
			.scaleToObject(0.5)
			.repeats(8, 100, 100)
			.filter("ColorMatrix", { saturate: 1, hue: 80 })
			.zIndex(1)

			.effect()
			.file("animated-spell-effects-cartoon.cantrips.mending.purple")
			.atLocation(target)
			.scaleToObject(3)
			.opacity(0.75)
			.filter("ColorMatrix", { saturate: 1, brightness: 1.3, hue: -5 })
			.zIndex(0)
			.waitUntilFinished(-500)

			.effect()
			.file("jb2a.template_circle.symbol.out_flow.heart.pink")
			.scaleIn(0, 1000, { ease: "easeOutQuint" })
			.fadeOut(2000)
			.atLocation(target)
			.belowTokens()
			.duration(3000)
			.scaleToObject(3)

			.thenDo(function () {
				chrisPremades.helpers.createEffect(target.actor, effectData);
			})

			.effect()
			.file("jb2a.icon.heart.pink")
			.atLocation(target)
			.scaleIn(0, 500, { ease: "easeOutQuint" })
			.fadeOut(1000)
			.scaleToObject(1)
			.atLocation(target)
			.duration(2000)
			.attachTo(target)
			.playbackRate(1)

			.effect()
			.file("jb2a.icon.heart.pink")
			.atLocation(target)
			.scaleToObject(3)
			.anchor({ y: 0.45 })
			.scaleIn(0, 500, { ease: "easeOutQuint" })
			.fadeOut(1000)
			.atLocation(target)
			.duration(1000)
			.attachTo(target)
			.playbackRate(1)
			.opacity(0.5)

			.effect()
			.file("jb2a.extras.tmfx.border.circle.outpulse.01.fast")
			.atLocation(target)
			.scaleToObject(2)

			.effect()
			.file("jb2a.markers.heart.pink.03")
			.atLocation(target)
			.scaleToObject(2)
			.delay(500)
			.center()
			.fadeIn(1000)
			.fadeOut(1000)
			.playbackRate(1)
			.attachTo(target)
			.persist()
			.name(`${target.document.name} Charm Person`)

			.play()
	});
}

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
	let targets = Array.from(workflow.targets);
	for (let i of targets) {
		let immuneData = {
			'name': 'Save Immunity',
			'icon': 'modules/mba-premades/icons/generic/generic_buff.webp',
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
		if (type != 'humanoid') {
			ChatMessage.create({ 
                flavor: i.document.name + ' is unaffected by Charm Person! (target is not humanoid)', 
                speaker: ChatMessage.getSpeaker({ actor: workflow.actor }) 
            });
			await chrisPremades.helpers.createEffect(i.actor, immuneData);
			continue;
		}
		let hasCharmImmunity = chrisPremades.helpers.checkTrait(i.actor, 'ci', 'charmed');
		if (hasCharmImmunity) {
			ChatMessage.create({ 
                flavor: i.document.name + ' is unaffected by Charm Person! (target is immune to condition: Charmed)', 
                speaker: ChatMessage.getSpeaker({ actor: workflow.actor }) 
            });
			await chrisPremades.helpers.createEffect(i.actor, immuneData);
			continue;
		}
		if (chrisPremades.helpers.inCombat()) {
			let advantageData = {
				'name': 'Save Advantage: In Combat',
				'icon': 'modules/mba-premades/icons/generic/generic_buff.webp',
				'description': "You have advantage on the next save you make",
				'duration': {
					'turns': 1
				},
				'changes': [
					{
						'key': 'flags.midi-qol.advantage.ability.save.all',
						'value': '1',
						'mode': 5,
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
			await chrisPremades.helpers.createEffect(i.actor, advantageData);
		}
	}
}

export let charmPerson = {
	'item': item,
	'cast': cast
}