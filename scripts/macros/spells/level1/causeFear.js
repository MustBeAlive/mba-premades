import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
	let targets = Array.from(workflow.targets);
	for (let target of targets) {
		let type = mba.raceOrType(target.actor);
		if (type === 'undead' || type === 'construct') {
			ChatMessage.create({
				flavor: target.document.name + ' is unaffected by Cause Fear! (Target is undead/construct)',
				speaker: ChatMessage.getSpeaker({ actor: workflow.actor })
			});
			await mba.createEffect(target.actor, constants.immunityEffectData);
			continue;
		}
		if (mba.checkTrait(target.actor, 'ci', 'frightened')) {
			ChatMessage.create({
				flavor: target.document.name + ' is unaffected by Cause Fear! (target is immune to condition: Frightened)',
				speaker: ChatMessage.getSpeaker({ actor: workflow.actor })
			});
			await mba.createEffect(target.actor, constants.immunityEffectData);
			continue;
		}
	}
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
	let ammount = workflow.castData.castLevel;
	if (workflow.targets.size > ammount) {
		let selection = await mba.selectTarget(workflow.item.name, constants.okCancel, Array.from(workflow.targets), false, 'multiple', undefined, false, 'Too many targets selected. Choose which targets to keep (Max: ' + ammount + ')');
		if (!selection.buttons) {
			ui.notifications.warn('Failed to select targets, try again!')
			await mba.removeCondition(workflow.actor, "Concentrating");
			return;
		}
		let check = selection.inputs.filter(i => i != false);
        if (check.length > ammount) {
            ui.notifications.warn("Too many targets selected, try again!");
            return;
        }
		let newTargets = selection.inputs.filter(i => i).slice(0, ammount);
		mba.updateTargets(newTargets);
	}
	await warpgate.wait(100);
	let targets = Array.from(game.user.targets);
	if (mba.within30(targets) === false) {
		ui.notifications.warn('Targets cannot be further than 30 ft. of each other, try again!')
		await mba.removeCondition(workflow.actor, "Concentrating");
		return;
	}
	let featureData = await mba.getItemFromCompendium('mba-premades.MBA Spell Features', 'Cause Fear: Fear', false);
	if (!featureData) {
		ui.notifications.warn("Unable to find item in the compenidum! (Cause Fear: Fear)");
		return
	}
	delete featureData._id;
	featureData.system.save.dc = mba.getSpellDC(workflow.item);
	setProperty(featureData, 'mba-premades.spell.castData.school', workflow.item.system.school);
	let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
	let targetUuids = [];
	for (let i of targets) targetUuids.push(i.document.uuid);
	let [config, options] = constants.syntheticItemWorkflowOptions(targetUuids);
	await game.messages.get(workflow.itemCardId).delete();
	let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
	if (!featureWorkflow.failedSaves.size) {
		await mba.removeCondition(workflow.actor, "Concentrating");
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
		'description': `
			<p>You feel the sense of mortality and are frightened for the duration.</p>
			<p>At the end of each of your turns you can repeat the saving throw, ending the effect on a success.</p>
		`,
		'duration': {
			'seconds': 60
		},
		'changes': [
			{
				'key': 'flags.midi-qol.OverTime',
				'mode': 0,
				'value': 'turn=end, saveAbility=wis, saveDC=' + mba.getSpellDC(workflow.item) + ', saveMagic=true, name=Fear: End Turn',
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

	await new Sequence()

		.effect()
		.file(`jb2a.magic_signs.circle.02.necromancy.loop.green`)
		.atLocation(token)
		.scaleToObject(1.5)
		.rotateIn(180, 600, { ease: "easeOutCubic" })
		.scaleIn(0, 600, { ease: "easeOutCubic" })
		.loopProperty("sprite", "rotation", { from: 0, to: -360, duration: 10000 })
		.belowTokens()
		.fadeOut(2000)
		.zIndex(0)

		.effect()
		.file(`jb2a.magic_signs.circle.02.necromancy.loop.green`)
		.atLocation(token)
		.scaleToObject(1.5)
		.duration(1200)
		.fadeIn(200, { ease: "easeOutCirc", delay: 500 })
		.fadeOut(300, { ease: "linear" })
		.rotateIn(180, 600, { ease: "easeOutCubic" })
		.scaleIn(0, 600, { ease: "easeOutCubic" })
		.loopProperty("sprite", "rotation", { from: 0, to: -360, duration: 10000 })
		.belowTokens(true)
		.filter("ColorMatrix", { saturate: -1, brightness: 2 })
		.filter("Blur", { blurX: 5, blurY: 10 })
		.zIndex(1)

		.wait(1500)

		.play();

	for (let target of failedTargets) {
		let delay = 100 + Math.floor(Math.random() * (Math.floor(1000) - Math.ceil(50)) + Math.ceil(50));

		new Sequence()

			.effect()
			.file("animated-spell-effects-cartoon.level 01.bless.green")
			.attachTo(target, { randomOffset: 1.2, gridUnits: true })
			.scaleToObject(0.5)
			.delay(delay)
			.repeats(8, 100, 100)
			.filter("ColorMatrix", { hue: 5 })
			.zIndex(1)

			.effect()
			.file("animated-spell-effects-cartoon.cantrips.mending.green")
			.attachTo(target)
			.scaleToObject(3)
			.delay(delay)
			.opacity(0.75)
			.filter("ColorMatrix", { saturate: 1, brightness: 1.3, hue: -5 })
			.zIndex(0)
			.waitUntilFinished(-500)

			.thenDo(function () {
				mba.createEffect(target.actor, effectData);
			})

			.effect()
			.file("jb2a.icon.fear.dark_orange")
			.attachTo(target)
			.scaleIn(0, 500, { ease: "easeOutQuint" })
			.fadeOut(1000)
			.scaleToObject(1)
			.duration(2000)
			.filter("ColorMatrix", { hue: 120 })
			.playbackRate(1)

			.effect()
			.file("jb2a.icon.fear.dark_orange")
			.attachTo(target)
			.scaleToObject(3)
			.anchor({ y: 0.45 })
			.scaleIn(0, 500, { ease: "easeOutQuint" })
			.fadeOut(1000)
			.duration(1000)
			.playbackRate(1)
			.filter("ColorMatrix", { hue: 130 })
			.opacity(0.5)

			.effect()
			.file("jb2a.extras.tmfx.border.circle.outpulse.01.fast")
			.attachTo(target)
			.scaleToObject(2)

			.effect()
			.file("jb2a.markers.fear.dark_orange.03")
			.attachTo(target)
			.scaleToObject(2)
			.delay(500)
			.center()
			.fadeIn(1000)
			.fadeOut(1000)
			.playbackRate(1)
			.filter("ColorMatrix", { hue: 130 })
			.persist()
			.name(`${target.document.name} Cause Fear`)

			.play()
	};
}

export let causeFear = {
	'cast': cast,
	'item': item,
}