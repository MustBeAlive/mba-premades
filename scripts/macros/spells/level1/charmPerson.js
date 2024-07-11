import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
	for (let target of Array.from(workflow.targets)) {
		if (mba.raceOrType(target.actor) != "humanoid" || mba.checkTrait(target.actor, "ci", "charmed")) {
			ChatMessage.create({
				flavor: `<u>${target.document.name}</u> is unaffected by Charm Person!`,
				speaker: ChatMessage.getSpeaker({ actor: workflow.actor })
			});
			await mba.createEffect(target.actor, constants.immunityEffectData);
		}
		else if (mba.inCombat()) {
			await mba.createEffect(target.actor, constants.advantageEffectData)
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
		return;
	}
	await warpgate.wait(100);
	let featureData = await mba.getItemFromCompendium('mba-premades.MBA Spell Features', "Charm Person: Save", false);
	if (!featureData) return;
	delete featureData._id;
	featureData.system.save.dc = mba.getSpellDC(workflow.item);
	setProperty(featureData, 'mba-premades.spell.castData.school', workflow.item.system.school);
	let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
	let targetUuids = Array.from(targets).map(t => t.document.uuid);
	let [config, options] = constants.syntheticItemWorkflowOptions(targetUuids);
	await game.messages.get(workflow.itemCardId).delete();
	let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
	if (!featureWorkflow.failedSaves.size) return;
	async function effectMacroDel() {
		Sequencer.EffectManager.endEffects({ name: `${token.document.name} ChaPer` })
	}
	let effectData = {
		'name': workflow.item.name,
		'icon': workflow.item.img,
		'origin': workflow.item.uuid,
		'description': `
			<p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.SVd8xu3mTZMqz8fL]{Charmed} and regard caster of the spell as a friendly acquaintance.</p>
			<p>When the spell ends, you become aware that you were @UUID[Compendium.mba-premades.MBA SRD.Item.SVd8xu3mTZMqz8fL]{Charmed}.</p>
		`,
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
		new Sequence()

			.effect()
			.file("animated-spell-effects-cartoon.level 01.bless.blue")
			.atLocation(target, { randomOffset: 1.2, gridUnits: true })
			.scaleToObject(0.5)
			.zIndex(1)
			.filter("ColorMatrix", { saturate: 1, hue: 80 })
			.repeats(8, 100, 100)

			.effect()
			.file("animated-spell-effects-cartoon.cantrips.mending.purple")
			.atLocation(target)
			.scaleToObject(3)
			.opacity(0.75)
			.zIndex(0)
			.filter("ColorMatrix", { saturate: 1, brightness: 1.3, hue: -5 })
			.waitUntilFinished(-500)

			.effect()
			.file("jb2a.template_circle.symbol.out_flow.heart.pink")
			.atLocation(target)
			.scaleToObject(3)
			.duration(3000)
			.fadeOut(2000)
			.scaleIn(0, 1000, { ease: "easeOutQuint" })
			.belowTokens()

            .thenDo(async () => {
				await mba.createEffect(target.actor, effectData);
			})

			.effect()
			.file("jb2a.icon.heart.pink")
			.attachTo(target)
			.scaleToObject(1)
			.duration(2000)
			.fadeOut(1000)
			.scaleIn(0, 500, { ease: "easeOutQuint" })
			.playbackRate(1)

			.effect()
			.file("jb2a.icon.heart.pink")
			.attachTo(target)
			.scaleToObject(3)
			.duration(1000)
			.fadeOut(1000)
			.scaleIn(0, 500, { ease: "easeOutQuint" })
			.anchor({ y: 0.45 })
			.playbackRate(1)
			.opacity(0.5)

			.effect()
			.file("jb2a.extras.tmfx.border.circle.outpulse.01.fast")
			.atLocation(target)
			.scaleToObject(2)

			.effect()
			.file("jb2a.markers.heart.pink.03")
			.attachTo(target)
			.scaleToObject(2)
			.delay(500)
			.fadeIn(1000)
			.fadeOut(1000)
			.center()
			.playbackRate(1)
			.persist()
			.name(`${target.document.name} ChaPer`)

			.play()
	};
}

export let charmPerson = {
	'cast': cast,
	'item': item
}