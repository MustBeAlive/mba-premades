import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
	for (let target of Array.from(workflow.targets)) {
		let type = mba.raceOrType(target.actor);
		if (type === "undead" || type === "construct" || mba.checkTrait(target.actor, 'ci', 'frightened')) {
			ChatMessage.create({
				flavor: `<u>${target.document.name}</u> is unaffected by Cause Fear!`,
				speaker: ChatMessage.getSpeaker({ actor: workflow.actor })
			});
			await mba.createEffect(target.actor, constants.immunityEffectData);
		}
	}
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
	let ammount = workflow.castData.castLevel;
	if (workflow.targets.size > ammount) {
		await mba.playerDialogMessage();
		let selection = await mba.selectTarget(workflow.item.name, constants.okCancel, Array.from(workflow.targets), false, 'multiple', undefined, false, 'Too many targets selected. Choose which targets to keep (Max: ' + ammount + ')');
		await mba.clearPlayerDialogMessage();
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
	let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Cause Fear: Save", false);
	if (!featureData) return;
	delete featureData._id;
	let saveDC = mba.getSpellDC(workflow.item);
	featureData.system.save.dc = saveDC;
	setProperty(featureData, 'mba-premades.spell.castData.school', workflow.item.system.school);
	let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
	let targetUuids = Array.from(targets).map(t => t.document.uuid);
	let [config, options] = constants.syntheticItemWorkflowOptions(targetUuids);
	await game.messages.get(workflow.itemCardId).delete();
	let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
	if (!featureWorkflow.failedSaves.size) {
		await mba.removeCondition(workflow.actor, "Concentrating");
		return;
	}
	async function effectMacroDel() {
		Sequencer.EffectManager.endEffects({ name: `${token.document.name} CauFea`})
	}
	let effectData = {
		'name': workflow.item.name,
		'icon': workflow.item.img,
		'origin': workflow.item.uuid,
		'description': `
			<p>You feel the sense of mortality and are @UUID[Compendium.mba-premades.MBA SRD.Item.oR1wUvem3zVVUv5Q]{Frightened} for the duration.</p>
			<p>At the end of each of your turns you can repeat the saving throw, ending the effect on a success.</p>
		`,
		'duration': {
			'seconds': 60
		},
		'changes': [
			{
				'key': 'macro.CE',
				'mode': 0,
				'value': 'Frightened',
				'priority': 20
			},
			{
				'key': 'flags.midi-qol.OverTime',
				'mode': 0,
				'value': `turn=end, saveAbility=wis, saveDC=${saveDC}, saveMagic=true, name=Fear: Turn End (DC${saveDC}), killAnim=true`,
				'priority': 20
			},
		],
		'flags': {
			'dae': {
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

	for (let target of Array.from(featureWorkflow.failedSaves)) {
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

            .thenDo(async () => {
				let newEffect = await mba.createEffect(target.actor, effectData);
				let concData = workflow.actor.getFlag("midi-qol", "concentration-data.removeUuids");
				concData.push(newEffect.uuid);
				await workflow.actor.setFlag("midi-qol", "concentration-data.removeUuids", concData);
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
			.name(`${target.document.name} CauFea`)

			.play()
	};
}

export let causeFear = {
	'cast': cast,
	'item': item,
}