import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
	if (workflow.castData.castLevel < 5) {
		let concEffect = await mba.findEffect(workflow.actor, "Concentrating");
		if (concEffect) await mba.removeEffect(concEffect);
	}
	let target = workflow.targets.first();
	new Sequence()

		.effect()
		.file("jb2a.dodecahedron.skull.below.dark_greenpurple")
		.attachTo(target)
		.scaleToObject(2.2 * target.document.texture.scaleX)
		.fadeIn(800)
		.fadeOut(500)
		.belowTokens()
		.filter("ColorMatrix", { hue: 185 })

		.effect()
		.file("jb2a.template_circle.aura.01.loop.large.orangepurple")
		.attachTo(target)
		.scaleToObject(2.2 * target.document.texture.scaleX)
		.delay(800)
		.fadeIn(500)
		.fadeOut(500)
		.playbackRate(0.8)
		.filter("ColorMatrix", { hue: 185 })

		.effect()
		.file("jb2a.energy_strands.complete.dark_green.01")
		.attachTo(target)
		.scaleToObject(2 * target.document.texture.scaleX)
		.delay(800)
		.fadeIn(500)
		.fadeOut(500)
		.opacity(0.8)
		.repeats(4, 800)

		.effect()
		.file("animated-spell-effects-cartoon.misc.fiery eyes.02")
		.attachTo(target)
		.scaleToObject(1.5 * target.document.texture.scaleX)
		.delay(800)
		.fadeIn(500)
		.fadeOut(500)
		.repeats(3, 1300)

		.play()
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
	if (!workflow.failedSaves.size) return;
	let target = workflow.targets.first();
	let choices = [
		["Disadvantage on Checks/Saves", "Ability", "modules/mba-premades/icons/spells/level3/bestow_curse_debuff_ability.webp"],
		["Disadvantage on Attacks", "Attack", "modules/mba-premades/icons/spells/level3/bestow_curse_attack_disadvantage.webp"],
		["Waste Turn", "Turn", "modules/mba-premades/icons/spells/level3/bestow_curse_dread.webp"],
		["Extra Damage", "Damage", "modules/mba-premades/icons/spells/level3/bestow_curse_additional_damage.webp"],
		["Other (Custom, ask GM)", "Other", "modules/mba-premades/icons/spells/level3/bestow_curse.webp"]
	];
	await mba.playerDialogMessage(game.user);
	let selection = await mba.selectImage("Bestow Curse", choices, "<b>Which curse would you like to bestow?</b>", "both");
	await mba.clearPlayerDialogMessage();
	if (!selection.length) return;
	let duration;
	let concentration = true;
	switch (workflow.castData.castLevel) {
		case 3:
			duration = 60;
			break;
		case 4:
			duration = 600;
			break;
		case 5:
		case 6:
			duration = 28800;
			concentration = false;
			break;
		case 7:
		case 8:
			duration = 86400;
			concentration = false;
			break;
		case 9:
			concentration = false;
			break;
	}
	let name;
	let description = `
		<p>You are cursed for the duration.</p>
	`;
	let changes = [];
	let flags = {
		'dae': {
			'showIcon': true
		},
		'effectmacro': {
			'onDelete': {
				'script': mba.functionToString(effectMacroDel)
			}
		},
		'mba-premades': {
			'greaterRestoration': true,
			'isCurse': true,
			'spell': {
				'bestowCurse': {
					'level': workflow.castData.castLevel,
					'saveDC': mba.getSpellDC(workflow.item),
					'type': selection[0]
				}
			}
		},
		"midi-qol": {
			"castData": {
				baseLevel: 3,
				castLevel: workflow.castData.castLevel,
				itemUuid: workflow.item.uuid
			}
		}
	};
	async function effectMacroTurnStart() {
		await mbaPremades.macros.bestowCurse.wasteTurn(effect, origin, token);
	};
	async function effectMacroDel() {
		await mbaPremades.macros.bestowCurse.remove(effect, origin, token);
	}
	if (selection[0] === "Ability") {
		let abilityChoices = [
			["Strength", "str"],
			["Dexterity", "dex"],
			["Constitution", "con"],
			["Intelligence", "int"],
			["Wisdom", "wis"],
			["Charisma", "cha"]
		];
		let ability = await mba.dialog("Bestow Curse: Ability", abilityChoices, "<b>Select ability:</b>");
		if (!ability) return;
		let abilityName;
		switch (ability) {
			case "str": abilityName = "Strength"; break;
			case "dex": abilityName = "Dexterity"; break;
			case "con": abilityName = "Consitution"; break;
			case "int": abilityName = "Intelligence"; break;
			case "wis": abilityName = "Wisdom"; break;
			case "cha": abilityName = "Charisma"; 
		}
		name = "Bestow Curse: Ability";
		description = `
			<p>You are cursed for the duration.</p>
			<p>While cursed in this way, you have disadvantage on ${abilityName} ability checks and saving throws.</p>
		`;
		changes = [
			{
				'key': `flags.midi-qol.disadvantage.ability.check.${ability}`,
				'mode': 2,
				'value': 1,
				'priority': 20
			},
			{
				'key': `flags.midi-qol.disadvantage.ability.save.${ability}`,
				'mode': 2,
				'value': 1,
				'priority': 20
			},
		];
	}
	else if (selection[0] === "Attack") {
		name = "Bestow Curse: Attack";
		description = `
			<p>You are cursed for the duration.</p>
			<p>While cursed in this way, you have disadvantage on attack rolls against caster of the spell (<u>${workflow.token.document.name}</u>).</p>
		`;
		changes = [
			{
				'key': `flags.mba-premades.spell.bestowCurse.attack.target`,
				'mode': 5,
				'value': workflow.token.document.uuid,
				'priority': 20
			},
			{
				'key': `flags.midi-qol.onUseMacroName`,
				'mode': 0,
				'value': "function.mbaPremades.macros.bestowCurse.attack,preAttackRoll",
				'priority': 20
			},
		];
	}
	else if (selection[0] === "Turn") {
		name = "Bestow Curse: Waste Turn";
		description = `
			<p>You are cursed for the duration.</p>
			<p>While cursed in this way, you must make a Wisdom saving throw at the start of each of your turns.</p>
			<p>If you fail, you waste your action on that turn doing nothing.</p>
		`;
		flags = {
			'dae': {
				'showIcon': true
			},
			'effectmacro': {
				'onTurnStart': {
					'script': mba.functionToString(effectMacroTurnStart)
				},
				'onDelete': {
					'script': mba.functionToString(effectMacroDel)
				}
			},
			'mba-premades': {
				'greaterRestoration': true,
				'isCurse': true,
				'spell': {
					'bestowCurse': {
						'level': workflow.castData.castLevel,
						'saveDC': mba.getSpellDC(workflow.item),
						'type': selection[0]
					}
				}
			},
			"midi-qol": {
				"castData": {
					baseLevel: 3,
					castLevel: workflow.castData.castLevel,
					itemUuid: workflow.item.uuid
				}
			}
		};
	}
	else if (selection[0] === "Damage") {
		name = "Bestow Curse: Damage";
		description = `
			<p>You are cursed for the duration.</p>
			<p>While cursed in this way, caster of this spell deals to you additional necrotic damage with attacks and spells.</p>
		`;
		let effectData = {
			"name": "Bestow Curse: Damage Bonus",
			"icon": workflow.item.img,
			"origin": workflow.item.uuid,
			'description': `
				<p>Target: <u>${target.document.name}</u></p>
			`,
			"duration": {
				"seconds": null,
			},
			"changes": [
				{
					"key": "flags.midi-qol.onUseMacroName",
					"mode": 0,
					"value": "function.mbaPremades.macros.bestowCurse.damage,postDamageRoll",
					"priority": 20
				},
				{
					"key": "flags.midi-qol.onUseMacroName",
					"mode": 0,
					"value": "function.mbaPremades.macros.bestowCurse.damageApplication,preDamageApplication",
					"priority": 20
				},
				{
					"key": "flags.mba-premades.spell.bestowCurse.damage.target",
					"mode": 5,
					"value": target.id,
					"priority": 20
				}
			],
			"flags": {
				'dae': {
					'showIcon': true
				},
				"midi-qol": {
					"castData": {
						baseLevel: 3,
						castLevel: workflow.castData.castLevel,
						itemUuid: workflow.item.uuid
					}
				}
			}
		};
		if (!isNaN(duration)) effectData.duration.seconds = duration;
		await mba.createEffect(workflow.actor, effectData);
	}
	else if (selection[0] === "Other") {
		name = "Bestow Curse: Other";
	}
	let effectData = {
		'name': name,
		'icon': selection[1],
		'origin': workflow.item.uuid,
		'description': description,
		'duration': {
			'seconds': duration
		},
		'changes': changes,
		'flags': flags
	};
	let newEffect = await mba.createEffect(target.actor, effectData);
	if (concentration) {
		await mba.addCondition(workflow.actor, "Concentrating");
		await workflow.actor.setFlag("midi-qol", "concentration-data.removeUuids", [newEffect.uuid]);
	}
}

async function attack({ speaker, actor, token, character, item, args, scope, workflow }) {
	if (workflow.targets.size != 1 || workflow.disadvantage) return;
	let targetUuid = workflow.actor.flags["mba-premades"]?.spell?.bestowCurse?.attack.target;
	if (!targetUuid) return;
	if (targetUuid != workflow.targets.first().document.uuid) return;
	let queueSetup = await queue.setup(workflow.item.uuid, "bestowCurse", 50);
	if (!queueSetup) return;
	workflow.disadvantage = true;
	workflow.advReminderAttackAdvAttribution.add("DIS:Bestow Curse");
	queue.remove(workflow.item.uuid);

	new Sequence()

		.effect()
		.file("jb2a.template_circle.aura.01.loop.large.orangepurple")
		.attachTo(workflow.token)
		.scaleToObject(2.2 * workflow.token.document.texture.scaleX)
		.fadeIn(500)
		.fadeOut(500)
		.playbackRate(0.8)
		.filter("ColorMatrix", { hue: 185 })

		.effect()
		.file("jb2a.energy_strands.complete.dark_green.01")
		.attachTo(workflow.token)
		.scaleToObject(2 * workflow.token.document.texture.scaleX)
		.fadeIn(500)
		.fadeOut(500)
		.opacity(0.8)
		.repeats(4, 800)

		.effect()
		.file("animated-spell-effects-cartoon.misc.fiery eyes.02")
		.attachTo(workflow.token)
		.scaleToObject(1.5 * workflow.token.document.texture.scaleX)
		.fadeIn(500)
		.fadeOut(500)
		.repeats(3, 1300)

		.play()
}

async function wasteTurn(effect, origin, token) {
	let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Bestow Curse: Save", false);
	if (!featureData) return;
	delete featureData._id;
	featureData.system.save.dc = effect.flags['mba-premades']?.spell?.bestowCurse?.saveDC;
	let feature = new CONFIG.Item.documentClass(featureData, { 'parent': origin.actor });
	let [config, options] = constants.syntheticItemWorkflowOptions([token.document.uuid]);
	new Sequence()

		.effect()
		.file("jb2a.template_circle.aura.01.loop.large.orangepurple")
		.attachTo(token)
		.scaleToObject(2.2 * token.document.texture.scaleX)
		.fadeIn(500)
		.fadeOut(500)
		.playbackRate(0.8)
		.filter("ColorMatrix", { hue: 185 })

		.effect()
		.file("jb2a.energy_strands.complete.dark_green.01")
		.attachTo(token)
		.scaleToObject(2 * token.document.texture.scaleX)
		.fadeIn(500)
		.fadeOut(500)
		.opacity(0.8)
		.repeats(4, 800)

		.effect()
		.file("animated-spell-effects-cartoon.misc.fiery eyes.02")
		.attachTo(token)
		.scaleToObject(1.5 * token.document.texture.scaleX)
		.fadeIn(500)
		.fadeOut(500)
		.repeats(3, 1300)

		.play()
	let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
	if (!featureWorkflow.failedSaves.size) return;
	ChatMessage.create({
		'speaker': { 'alias': name },
		'content': `<u>${token.document.name}</u> failed the save and wastes it's turn!</b>`
	});
	await mba.dialog("Bestow Curse", [["Ok", false]], "You've failed the Wisdom saving throw against<br><u>Bestow Curse</u> and do nothing on your turn!<p></p>");
}

async function damage({ speaker, actor, token, character, item, args, scope, workflow }) {
	if (!workflow.hitTargets.size) return;
	let target = workflow.targets.first();
	if (workflow.actor.flags["mba-premades"]?.spell?.bestowCurse?.damage?.target != target.id) return;
	let queueSetup = await queue.setup(workflow.item.uuid, "bestowCurse", 250);
	if (!queueSetup) return;
	let oldFormula = workflow.damageRoll._formula;
	let bonusDamageFormula = "1d8[necrotic]";
	if (workflow.isCritical) bonusDamageFormula = mba.getCriticalFormula(bonusDamageFormula);
	let damageFormula = oldFormula + " + " + bonusDamageFormula;
	let damageRoll = await new Roll(damageFormula).roll({ async: true });
	await workflow.setDamageRoll(damageRoll);
	new Sequence()

		.effect()
		.file("jb2a.template_circle.aura.01.loop.large.orangepurple")
		.attachTo(target)
		.scaleToObject(2.2 * target.document.texture.scaleX)
		.fadeIn(500)
		.fadeOut(500)
		.playbackRate(0.8)
		.belowTokens()
		.filter("ColorMatrix", { hue: 185 })

		.effect()
		.file("jb2a.energy_strands.complete.dark_green.01")
		.attachTo(target)
		.scaleToObject(2 * target.document.texture.scaleX)
		.fadeIn(500)
		.fadeOut(500)
		.opacity(0.8)
		.repeats(4, 800)

		.effect()
		.file("animated-spell-effects-cartoon.misc.fiery eyes.02")
		.attachTo(target)
		.scaleToObject(1.5 * target.document.texture.scaleX)
		.fadeIn(500)
		.fadeOut(500)
		.repeats(3, 1300)

		.play()

	queue.remove(workflow.item.uuid);
}

async function damageApplication({ speaker, actor, token, character, item, args, scope, workflow }) {
	if (workflow.hitTargets.size < 2) return;
	let targetId = workflow.actor.flags["mba-premades"]?.spell?.bestowCurse?.damage.target;
	if (!targetId) return;
	let queueSetup = await queue.setup(workflow.item.uuid, "bestowCurse", 250);
	if (!queueSetup) return;
	let targetDamage = workflow.damageList.find(i => i.tokenId === targetId);
	if (!targetDamage) return;
	let targetActor = canvas.scene.tokens.get(targetDamage.tokenId).actor;
	if (!targetActor) {
		queue.remove(workflow.item.uuid);
		return;
	}
	let damageRoll = await new Roll("1d8[necrotic]").roll({ "async": true });
	damageRoll.toMessage({
		rollMode: "roll",
		speaker: { "alias": name },
		flavor: "Bestow Curse Damage"
	});
	let hasDI = mba.checkTrait(targetActor, "di", "necrotic");
	if (hasDI) {
		queue.remove(workflow.item.uuid);
		return;
	}
	let damageTotal = damageRoll.total;
	let hasDR = mba.checkTrait(targetActor, "dr", "necrotic");
	if (hasDR) damageTotal = Math.floor(damageTotal / 2);
	targetDamage.damageDetail[0].push(
		{
			"damage": damageTotal,
			"type": "necrotic"
		}
	);
	targetDamage.totalDamage += damageTotal;
	targetDamage.appliedDamage += damageTotal;
	targetDamage.hpDamage += damageTotal;
	if (targetDamage.oldTempHP > 0) {
		if (targetDamage.oldTempHP >= damageTotal) targetDamage.newTempHP -= damageTotal;
		else {
			let leftHP = damageTotal - targetDamage.oldTempHP;
			targetDamage.newTempHP = 0;
			targetDamage.newHP -= leftHP;
		}
	}
	else targetDamage.newHP -= damageTotal;
	queue.remove(workflow.item.uuid);
}

async function remove(effect, origin, token) {
	let curseFlags = effect.flags["mba-premades"]?.spell?.bestowCurse;
	if (!curseFlags) return;
	await warpgate.wait(200);
	if (curseFlags.type === "Damage") {
		let damageEffect = origin.actor.effects.find(e => e.name === "Bestow Curse: Damage Bonus" && e.changes?.[2]?.value === token.id);
		if (damageEffect) await mba.removeEffect(damageEffect);
	}
	if (curseFlags.level < 5) {
		let concEffect = mba.findEffect(origin.actor, "Concentrating");
		if (concEffect) await mba.removeEffect(concEffect);
	}
}

export let bestowCurse = {
	'cast': cast,
	'item': item,
	'attack': attack,
	'wasteTurn': wasteTurn,
	'damage': damage,
	'damageApplication': damageApplication,
	'remove': remove
}