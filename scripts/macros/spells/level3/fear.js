import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
	let template = canvas.scene.collections.templates.get(workflow.templateId);
	if (!template) return;
	let targets = Array.from(workflow.targets);
	for (let target of targets) {
		if (mba.checkTrait(target.actor, "ci", "frightened")) await mba.createEffect(target.actor, constants.immunityEffectData);
	}
	await new Sequence()

		.effect()
		.file(canvas.scene.background.src)
		.filter("ColorMatrix", { brightness: 0.3 })
		.atLocation({ x: (canvas.dimensions.width) / 2, y: (canvas.dimensions.height) / 2 })
		.size({ width: canvas.scene.width / canvas.grid.size, height: canvas.scene.height / canvas.grid.size }, { gridUnits: true })
		.spriteOffset({ x: -0 }, { gridUnits: true })
		.duration(8500)
		.fadeIn(1500)
		.fadeOut(1500)
		.belowTokens()

		.effect()
		.file("jb2a.particles.inward.red.02.01")
		.attachTo(workflow.token)
		.scaleToObject(2.5)
		.duration(3000)
		.fadeIn(1000)
		.fadeOut(1000)
		.filter("ColorMatrix", { hue: 100 })

		.effect()
		.file("jb2a.energy_strands.in.green.01.2")
		.attachTo(workflow.token)
		.scaleToObject(3.5)
		.delay(500)
		.playbackRate(0.8)
		.waitUntilFinished(-200)

		.effect()
		.file("jb2a.detect_magic.cone.green")
		.attachTo(workflow.token)
		.stretchTo(template)
		.filter("ColorMatrix", { saturate: 0.8, hue: 315 })
		.belowTokens()

		.play();
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
	let template = canvas.scene.collections.templates.get(workflow.templateId);
	if (workflow.failedSaves.size < 1) {
		if (template) await template.delete();
		return;
	}
	async function effectMacroTurnStart() {
		await mbaPremades.helpers.dialog("Fear", [["Ok!", false]], `
				<p>You are Frightened.</p>
				<p>On each of your turns you must take the <u>Dash Action</u> and move away from the caster of the spell by the safest available route, unless there is nowhere to move.</p>
				<p>If you end your turn in a location where the caster of the spell can no longer see you, you can make a Wisdom Saving Throw. On a successful save, the spell ends.</p><p></p>
			`)
	};
	async function effectMacroTurnEnd() {
		await mbaPremades.macros.fear.save(token);
	};
	async function effectMacroDel() {
		Sequencer.EffectManager.endEffects({ name: `${token.document.name} Fear` })
	};
	let effectData = {
		'name': workflow.item.name,
		'icon': workflow.item.img,
		'origin': workflow.item.uuid,
		'description': `
			<p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.oR1wUvem3zVVUv5Q]{Frightened}.</p>
			<p>On each of your turns you must take the @UUID[Compendium.mba-premades.MBA Actions.Item.tntAPUYhwPQibvEp]{Dash} Action and move away from the caster of the spell by the safest available route, unless there is nowhere to move.</p>
			<p>If you end your turn in a location where the caster of the spell can no longer see you, you can make a Wisdom Saving Throw. On a successful save, the spell ends.</p>
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
						'originUuid': workflow.token.document.uuid,
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
	for (let target of Array.from(workflow.failedSaves)) {
		if (mba.checkTrait(target.actor, "ci", "frightened")) continue;
		new Sequence()

			.effect()
			.file("jb2a.toll_the_dead.green.skull_smoke")
			.atLocation(target)
			.scaleToObject(2.5, { considerTokenScale: true })
			.opacity(0.9)
			.playbackRate(0.5)

			.effect()
			.file("jb2a.template_circle.symbol.normal.fear.orange")
			.attachTo(target)
			.scaleToObject(1.6)
			.fadeIn(2000)
			.fadeOut(1000)
			.filter("ColorMatrix", { hue: 120 })
			.mask()
			.persist()
			.name(`${target.document.name} Fear`)

			.thenDo(async () => {
				await mba.createEffect(target.actor, effectData);
			})

			.play()

		await warpgate.wait(100);
	}
	if (template) await template.delete();
}

async function save(token) {
	let effect = mba.findEffect(token.actor, "Fear");
	if (!effect) {
		ui.notifications.warn("Unable to find the effect! (Fear)");
		return;
	}
	let originUuid = effect.flags['mba-premades']?.spell?.fear?.originUuid;
	let [canSee] = await mba.findNearby(token, 200, "any", false, false, false, true).filter(t => t.document.uuid === originUuid);
	if (canSee) return;
	let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Fear: Save", false);
	if (!featureData) return;
	delete featureData._id;
	featureData.system.save.dc = effect.flags['mba-premades']?.spell?.fear?.saveDC;
	let feature = new CONFIG.Item.documentClass(featureData, { 'parent': token.actor });
	let [config, options] = constants.syntheticItemWorkflowOptions([token.document.uuid]);
	let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
	if (featureWorkflow.failedSaves.size) return;
	await mba.removeEffect(effect);
}

export let fear = {
	'cast': cast,
	'item': item,
	'save': save
}