export async function crownOfMadness({ speaker, actor, token, character, item, args, scope, workflow }) {
	if (!workflow.failedSaves.size) return;
	let target = workflow.targets.first();
	let effect = await chrisPremades.helpers.findEffect(workflow.actor, 'Concentrating');
	let type = chrisPremades.helpers.raceOrType(target.actor);
	if (type != 'humanoid') {
		ui.notifications.info(target.document.name + ' is unaffected by Crown of Madness! (target is not humanoid)');
		await chrisPremades.helpers.removeCondition(workflow.actor, 'Concentrating');
		return;
	}
	let hasCharmImmunity = chrisPremades.helpers.checkTrait(target.actor, 'ci', 'charmed');
	if (hasCharmImmunity) {
		ui.notifications.info(target.document.name + ' is unaffected by Crown of Madness! (target is immune to condition: Charmed)');
		await chrisPremades.helpers.removeCondition(workflow.actor, 'Concentrating');
		return;
	}
	async function effectMacroCaster() {
		await warpgate.wait(100);
		let choices = [
			['Yes!', 'yes'],
			['No, stop concentrating!', 'no']
		];
		let selection = await chrisPremades.helpers.dialog('Use action to sustain Crown of Madness?', choices);
		if (!selection) return;
		if (selection === "yes") return;
		await chrisPremades.helpers.removeCondition(actor, 'Concentrating');
	}
	let updates = {
		'flags': {
			'effectmacro': {
				'onTurnStart': {
					'script': chrisPremades.helpers.functionToString(effectMacroCaster)
				}
			}
		}
	}
	await chrisPremades.helpers.updateEffect(effect, updates)
	async function effectMacroStart() {
		await new Dialog({
			title: "Crown of Madness",
			content: "<p>You must use your action to make a melee attack against a creature other than yourself before moving (caster chooses the creature).</p><p>You can act normally if caster refuses to choose any creature or if none are within your reach.</p>",
			buttons: {
				ok: {
					label: "Ok",
				}
			}
		}).render(true);
	}
	async function effectMacroDel() {
		await Sequencer.EffectManager.endEffects({ name: `${token.document.name} Crown of Madness`, object: token })
	}
	let effectData = {
		'name': workflow.item.name,
		'icon': workflow.item.img,
		'origin': workflow.item.uuid,
		'description': "You are affected by Crown of Madness. On the start of each of your turns, you must use your action to make a melee attack against a creature other than yourself before moving (caster chooses the creature). You can act normally if caster refuses to choose any creature or if none are within your reach.",
		'duration': {
			'seconds': 60
		},
		'changes': [
			{
				'key': 'flags.midi-qol.OverTime',
				'mode': 0,
				'value': 'turn=end, saveAbility=wis, saveDC=' + chrisPremades.helpers.getSpellDC(workflow.item) + ', saveMagic=true, name=Crown of Madness: Turn End',
				'priority': 20
			},
			{
				'key': 'macro.CE',
				'mode': 0,
				'value': "Charmed",
				'priority': 20
			},
		],
		'flags': {
			'effectmacro': {
				'onTurnStart': {
					'script': chrisPremades.helpers.functionToString(effectMacroStart)
				},
				'onDelete': {
					'script': chrisPremades.helpers.functionToString(effectMacroDel)
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
		.delay(300)
		.file("jb2a.impact.002.pinkpurple")
		.atLocation(target)
		.scaleToObject(2)
		.opacity(1)
		.filter("ColorMatrix", { hue: 6 })
		.zIndex(0)

		.effect()
		.file("jb2a.particles.inward.white.02.03")
		.scaleIn(0, 500, { ease: "easeOutQuint" })
		.delay(300)
		.fadeOut(1000)
		.atLocation(target)
		.duration(1000)
		.size(1.75, { gridUnits: true })
		.animateProperty("spriteContainer", "position.y", { from: 0, to: -0.5, gridUnits: true, duration: 1000 })
		.zIndex(1)

		.effect()
		.file("animated-spell-effects-cartoon.magic.impact.01")
		.atLocation(target)
		.scaleToObject(2)
		.opacity(1)
		.filter("ColorMatrix", { saturate: 1, brightness: 1.3 })
		.zIndex(0)
		.belowTokens()

		.play();

	new Sequence()

		.effect()
		.file("jb2a.token_border.circle.spinning.purple.010")
		.attachTo(target)
		.scaleIn(0, 1500, { ease: "easeOutCubic" })
		.scaleToObject(2)
		.filter("ColorMatrix", { hue: 40 })
		.private()
		.persist()
		.name(`${target.document.name} Crown of Madness`)

		.thenDo(function () {
			chrisPremades.helpers.createEffect(target.actor, effectData);
		})

		.play();
}