import {mba} from "../../../helperFunctions.js";

export async function crownOfMadness({ speaker, actor, token, character, item, args, scope, workflow }) {
	let target = workflow.targets.first();
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
		.file("jb2a.impact.002.pinkpurple")
		.atLocation(target)
		.scaleToObject(2)
		.delay(300)
		.opacity(1)
		.filter("ColorMatrix", { hue: 6 })
		.zIndex(0)

		.effect()
		.file("jb2a.particles.inward.white.02.03")
		.atLocation(target)
		.size(1.75, { gridUnits: true })
		.delay(300)
		.duration(1000)
		.fadeOut(1000)
		.scaleIn(0, 500, { ease: "easeOutQuint" })
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

	if (!workflow.failedSaves.size) return;
	let effect = await mba.findEffect(workflow.actor, 'Concentrating');
	if (mba.raceOrType(target.actor) != 'humanoid') {
		ui.notifications.info(`${target.document.name} is unaffected by Crown of Madness! (not humanoid)`);
		await mba.removeCondition(workflow.actor, 'Concentrating');
		return;
	}
	if (mba.checkTrait(target.actor, 'ci', 'charmed')) {
		ui.notifications.info(`${target.document.name} is unaffected by Crown of Madness! (immune to Charmed condition)`);
		await mba.removeCondition(workflow.actor, 'Concentrating');
		return;
	}
	async function effectMacroCaster() {
		await warpgate.wait(100);
		let choices = [['Yes!', 'yes'], ['No, stop concentrating!', 'no']];
		let selection = await mbaPremades.helpers.dialog("Crown of Madness", choices, `<b>Use action to maintain Crown of Madness?</b>`);
		if (!selection || selection === "yes") return;
		await mbaPremades.helpers.removeCondition(actor, 'Concentrating');
	}
	let updates = {
		'flags': {
			'effectmacro': {
				'onTurnStart': {
					'script': mba.functionToString(effectMacroCaster)
				}
			}
		}
	}
	await mba.updateEffect(effect, updates)
	async function effectMacroStart() {
		let originItem = await fromUuid(effect.origin);
		let originName = originItem.actor.prototypeToken.name;
		await mbaPremades.helpers.dialog("Crown of Madness", [["Ok!", "ok"]], `
			<p>You must use your action to make a melee attack against a creature other than yourself before moving.</p>
			<p>(<b>${originName}</b> chooses the creature)</p>
			<p>You can act normally if <b>${originName}</b> refuses to choose any creature or if none are within your reach.</p>
		`);
	}
	async function effectMacroDel() {
		await Sequencer.EffectManager.endEffects({ name: `${token.document.name} Crown of Madness`, object: token })
	}
	let effectData = {
		'name': workflow.item.name,
		'icon': workflow.item.img,
		'origin': workflow.item.uuid,
		'description': `
			<p>You are affected by Crown of Madness.</p>
			<p>On the start of each of your turns, you must use your action to make a melee attack against a creature other than yourself before moving (<b>${workflow.token.document.name}</b> chooses the creature).</p>
			<p>You can act normally if <b>${workflow.token.document.name}</b> refuses to choose any creature or if none are within your reach.</p>
		`,
		'duration': {
			'seconds': 60
		},
		'changes': [
			{
				'key': 'flags.midi-qol.OverTime',
				'mode': 0,
				'value': `turn=end, saveAbility=wis, saveDC=${mba.getSpellDC(workflow.item)}, saveMagic=true, name=Crown of Madness: Turn End`,
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
					'script': mba.functionToString(effectMacroStart)
				},
				'onDelete': {
					'script': mba.functionToString(effectMacroDel)
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

	new Sequence()

		.wait(500)

		.effect()
		.file("jb2a.token_border.circle.spinning.purple.010")
		.attachTo(target)
		.scaleToObject(2)
		.fadeOut(1000)
		.scaleIn(0, 1500, { ease: "easeOutCubic" })
		.filter("ColorMatrix", { hue: 40 })
		.persist()
		.name(`${target.document.name} Crown of Madness`)

		.thenDo(async () => {
			await mba.createEffect(target.actor, effectData);
		})

		.play();
}