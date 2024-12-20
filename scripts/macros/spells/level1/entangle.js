import {mba} from "../../../helperFunctions.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
	let template = canvas.scene.collections.templates.get(workflow.templateId);
	if (!template) return;

	new Sequence()

		.wait(700)

		.effect()
		.file("jb2a.entangle.green")
		.atLocation(template)
		.size(4.4, { gridUnits: true })
		.delay(1000)
		.fadeIn(2000)
		.fadeOut(500)
		.opacity(0.95)
		.shape("circle", {
			lineSize: 4,
			lineColor: "#FF0000",
			fillColor: "#FF0000",
			radius: 0.75,
			gridUnits: true,
			name: "test",
			isMask: true
		})
		.belowTokens()
		.zIndex(1.5)
		.persist()
		.name(`Entangle`)

		.effect()
		.file("jb2a.entangle.green")
		.atLocation(template)
		.size(4.4, { gridUnits: true })
		.delay(1000)
		.fadeIn(2000)
		.fadeOut(500)
		.opacity(0.85)
		.shape("circle", {
			lineSize: 4,
			lineColor: "#FF0000",
			fillColor: "#FF0000",
			radius: 1.55,
			gridUnits: true,
			name: "test",
			isMask: true
		})
		.belowTokens()
		.zIndex(1.3)
		.persist()
		.name(`Entangle`)

		.effect()
		.file("jb2a.entangle.green")
		.atLocation(template)
		.size(4.4, { gridUnits: true })
		.delay(1000)
		.fadeIn(2000)
		.fadeOut(500)
		.opacity(0.75)
		.shape("circle", {
			lineSize: 4,
			lineColor: "#FF0000",
			fillColor: "#FF0000",
			radius: 2.05,
			gridUnits: true,
			name: "test",
			isMask: true
		})
		.belowTokens()
		.zIndex(1.2)
		.persist()
		.name(`Entangle`)

		.effect()
		.file("jb2a.plant_growth.02.ring.4x4.pulse.greenred")
		.atLocation(template)
		.size(5.6, { gridUnits: true })
		.delay(500)
		.fadeIn(500)
		.fadeOut(500)
		.scaleIn(0, 500, { ease: "easeOutCubic" })
		.randomRotation()
		.belowTokens()
		.zIndex(2)
		.name(`Entangle`)

		.effect()
		.atLocation(template)
		.file(`jb2a.fireflies.many.01.green`)
		.size(4, { gridUnits: true })
		.delay(1000)
		.fadeIn(2500)
		.opacity(1)
		.zIndex(2)
		.persist()
		.name(`Entangle`)

		.effect()
		.file("jb2a.plant_growth.02.ring.4x4.pulse.greenred")
		.atLocation(template)
		.size(5.6, { gridUnits: true })
		.delay(500)
		.fadeIn(500)
		.fadeOut(500)
		.scaleIn(0, 500, { ease: "easeOutCubic" })
		.randomRotation()
		.belowTokens()
		.zIndex(2)

		.effect()
		.file("jb2a.swirling_leaves.outburst.01.greenorange")
		.atLocation(token)
		.size(1.75, { gridUnits: true })
		.delay(500)
		.fadeOut(1000)
		.duration(1000)
		.scaleIn(0, 500, { ease: "easeOutQuint" })
		.animateProperty("spriteContainer", "position.y", { from: 0, to: -0.15, gridUnits: true, duration: 1000 })
		.zIndex(1)

		.effect()
		.atLocation(template)
		.file(`jb2a.magic_signs.circle.02.conjuration.complete.dark_green`)
		.size(4.55, { gridUnits: true })
		.fadeIn(600)
		.rotateIn(180, 600, { ease: "easeOutCubic" })
		.scaleIn(0, 600, { ease: "easeOutCubic" })
		.opacity(1)
		.belowTokens()
		.zIndex(1)
		.persist()
		.name(`Entangle`)

		.play()
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
	if (!workflow.failedSaves.size) return;
	let saveDC = mba.getSpellDC(workflow.item);
	async function effectMacroDel() {
		Sequencer.EffectManager.endEffects({ name: `${token.document.name} Entangle` })
	}
	let effectData = {
		'name': "Entangled",
		'icon': workflow.item.img,
		'origin': workflow.item.uuid,
		'description': `
			<p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.gfRbTxGiulUylAjE]{Restrained} by a mass of thick, entangling plants.</p>
			<p>You can use your action to make a Strength check. If you succeed, you are no longer @UUID[Compendium.mba-premades.MBA SRD.Item.gfRbTxGiulUylAjE]{Restrained}.</p>
		`,
		'changes': [
			{
				'key': 'macro.CE',
				'mode': 0,
				'value': 'Restrained',
				'priority': 20
			},
			{
				'key': 'flags.midi-qol.OverTime',
				'mode': 0,
				'value': `actionSave=true, rollType=check, saveAbility=str, saveDC=${saveDC}, saveMagic=true, name=Entangle: Action Save (DC${saveDC}), killAnim=true`,
				'priority': 20
			}
		],
		'flags': {
            'dae': {
				'showIcon': true,
                'specialDuration': ["zeroHP"]
            },
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
	for (let target of Array.from(workflow.failedSaves)) {
		new Sequence()

			.effect()
			.file('jb2a.entangle.green')
			.attachTo(target)
			.size(1.5, { gridUnits: true })
			.delay(100)
			.fadeIn(5000)
			.fadeOut(1000)
			.scaleIn(0, 5000, { ease: "easeOutCubic" })
			.zIndex(1)
			.mask()
			.persist()
			.name(`${target.document.name} Entangle`)

			.thenDo(async () => {
				await mba.createEffect(target.actor, effectData);
			})

			.play()
	}
}

async function del() {
	await Sequencer.EffectManager.endEffects({ name: "Entangle" })
}

export let entangle = {
	'cast': cast,
	'item': item,
	'del': del
}