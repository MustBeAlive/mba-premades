import {mba} from "../../../helperFunctions.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
	let template = canvas.scene.collections.templates.get(workflow.templateId);
	if (!template) return;
	let targets = Array.from(workflow.targets);

	await new Sequence()

		.effect()
		.atLocation(token)
		.file(`jb2a.magic_signs.circle.02.necromancy.loop.green`)
		.scaleToObject(1.5)
		.rotateIn(180, 600, { ease: "easeOutCubic" })
		.scaleIn(0, 600, { ease: "easeOutCubic" })
		.loopProperty("sprite", "rotation", { from: 0, to: -360, duration: 10000 })
		.belowTokens()
		.fadeOut(1700)
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

		.effect()
		.file(canvas.scene.background.src)
		.filter("ColorMatrix", { brightness: 0.3 })
		.atLocation({ x: (canvas.dimensions.width) / 2, y: (canvas.dimensions.height) / 2 })
		.size({ width: canvas.scene.width / canvas.grid.size, height: canvas.scene.height / canvas.grid.size }, { gridUnits: true })
		.spriteOffset({ x: -0 }, { gridUnits: true })
		.delay(1000)
		.duration(8500)
		.fadeIn(1500)
		.fadeOut(1500)
		.belowTokens()

		.effect()
		.file("jb2a.particles.inward.red.02.01")
		.filter("ColorMatrix", { hue: 100 })
		.atLocation(token)
		.delay(1000)
		.duration(3000)
		.fadeIn(1000)
		.fadeOut(1000)

		.effect()
		.file("jb2a.energy_strands.in.green.01.2")
		.delay(1500)
		.atLocation(token)
		.scaleToObject(3.5)
		.playbackRate(0.8)
		.waitUntilFinished()

		.wait(600)

		.effect()
		.file("jb2a.detect_magic.cone.green")
		.attachTo(token)
		.stretchTo(template)
		.filter("ColorMatrix", { saturate: 0.8, hue: 315 })
		.belowTokens()

		.play();

	for (let target of targets) {
		const distance = Math.sqrt(Math.pow(target.x - token.x, 2) + Math.pow(target.y - token.y, 2));
		const gridDistance = distance / canvas.grid.size;

		new Sequence()

			.effect()
			.file("jb2a.toll_the_dead.green.skull_smoke")
			.atLocation(target)
			.scaleToObject(2.5, { considerTokenScale: true })
			.delay(gridDistance * 140)
			.opacity(0.9)
			.playbackRate(0.5)

			.play()
	}
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
	if (workflow.failedSaves.size < 1) return;
	let targets = Array.from(workflow.failedSaves);
	async function effectMacroTurnStart() {
		await new Dialog({
			title: "Fear",
			content: `
				<p>You are frightened. On each of your turns you must take the <b>Dash Action</b> and move away from the caster of the Fear spell by the safest available route, unless there is nowhere to move.</p>
				<p>If you <b>end your turn in a location where the caster of the Fear spell can no longer see you</b>, you can make a Wisdom Saving Throw. On a successful save, the spell ends.</p>`
			,
			buttons: {
				ok: {
					label: "Ok!",
				}
			}
		}).render(true);
	};
	async function effectMacroTurnEnd() {
		let effect = mbaPremades.helpers.findEffect(actor, 'Fear');
		let casterName = effect.flags['mba-premades']?.spell?.fear?.casterName;
		let [casterCanSee] = await MidiQOL.findNearby(null, token, 200, { includeIncapacitated: false, canSee: true }).filter(i => i.name === casterName);
		if (casterCanSee) return;
		let spellDC = effect.flags['mba-premades']?.spell?.fear.saveDC;
		let saveRoll = await mbaPremades.helpers.rollRequest(token, 'save', 'wis');
		if (saveRoll.total < spellDC) return;
		await mbaPremades.helpers.removeEffect(effect);
	};
	async function effectMacroDel() {
		await Sequencer.EffectManager.endEffects({ name: `${token.document.name} Fear`, object: token })
	}
	let effectData = {
		'name': workflow.item.name,
		'icon': workflow.item.img,
		'origin': workflow.item.uuid,
		'description': `
			<p>You are frightened. On each of your turns you must take the Dash Action and move away from the caster of the Fear spell by the safest available route, unless there is nowhere to move.</p>
			<p>If you end your turn in a location where the caster of the Fear spell can no longer see you, you can make a Wisdom Saving Throw. On a successful save, the spell ends.</p>
		`,
		'duration': {
			'seconds': 60
		},
		'changes': [
			{
				'key': 'macro.CE',
				'mode': 0,
				'value': "Frightened",
				'priority': 20
			}
		],
		'flags': {
			'effectmacro': {
				'onTurnStart': {
					'script': mba.functionToString(effectMacroTurnStart)
				},
				'onTurnEnd': {
					'script': mba.functionToString(effectMacroTurnEnd)
				},
				'onDelete': {
					'script': mba.functionToString(effectMacroDel)
				}
			},
			'mba-premades': {
				'spell': {
					'fear': {
						'casterName': workflow.token.document.name,
						'saveDC': mba.getSpellDC(workflow.item)
					}
				}
			},
			'midi-qol': {
				'castData': {
					baseLevel: 3,
					castLevel: workflow.castData.castLevel,
					itemUuid: workflow.item.uuid
				}
			}
		}
	};
	for (let target of targets) {
		if (mba.checkTrait(target.actor, 'ci', 'frightened')) continue;

		new Sequence()

			.effect()
			.file("jb2a.markers.fear.dark_orange.03")
			.atLocation(target)
			.scaleToObject(2)
			.delay(500)
			.center()
			.fadeIn(1000)
			.fadeOut(1000)
			.playbackRate(1)
			.attachTo(target)
			.filter("ColorMatrix", { hue: 130 })
			.persist()
			.name(`${target.document.name} Fear`)

			.thenDo(async () => {
				await mba.createEffect(target.actor, effectData);
			})

			.play()

		await warpgate.wait(100);
	}
}

export let fear = {
	'cast': cast,
	'item': item
}