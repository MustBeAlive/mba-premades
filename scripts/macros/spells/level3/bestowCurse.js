async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
	if (workflow.failedSaves.size != 1) return;
	let queueSetup = await mbaPremades.queue.setup(workflow.item.uuid, 'bestowCurse', 50);
	if (!queueSetup) return;
	let choices = [
		['Disadvantage on Ability Score', 'Ability'],
		['Disadvantage on Attacks', 'Attack'],
		['Waste Turn', 'Turn'],
		['Extra Damage', 'Damage'],
		['Other', 'Other']
	];
	let selection = await mbaPremades.helpers.dialog('What curse do you wish to bestow?', choices);
	if (!selection) {
		mbaPremades.queue.remove(workflow.item.uuid);
		return;
	}
	let castLevel = workflow.castData.castLevel;
	let duration = 60;
	let concentration = true;
	let featureData = await mbaPremades.helpers.getItemFromCompendium('mba-premades.MBA Spell Features', 'Bestow Curse: ' + selection, false);
	if (!featureData) {
		mbaPremades.queue.remove(workflow.item.uuid);
		return;
	}
	let effectData;
	switch (castLevel) {
		case 4:
			duration = 600;
			featureData.system.duration = {
				'units': 'minute',
				'value': 10
			};
			break;
		case 5:
		case 6:
			duration = 28800;
			concentration = false;
			featureData.system.duration = {
				'units': 'hour',
				'value': 8
			};
			break;
		case 7:
		case 8:
			duration = 86400;
			concentration = false;
			featureData.system.duration = {
				'units': 'day',
				'value': 1
			};
			break;
		case 9:
			duration = 'forever';
			concentration = false;
			featureData.system.duration = {
				'units': 'perm',
				'value': ''
			};
			break;
	}
	if (!concentration) featureData.flags.midiProperties.concentration = false;
	switch (selection) {
		case 'Ability':
			let abilityChoices = [
				['Strength', 'str'],
				['Dexterity', 'dex'],
				['Constitution', 'con'],
				['Intelligence', 'int'],
				['Wisdom', 'wis'],
				['Charisma', 'cha']
			];
			let ability = await mbaPremades.helpers.dialog('What ability?', abilityChoices);
			if (!ability) {
				mbaPremades.queue.remove(workflow.item.uuid);
				return;
			}
			featureData.effects[0].changes[0].key += ability;
			featureData.effects[0].changes[1].key += ability;
			break;
		case 'Damage':
			effectData = {
				'name': featureData.name,
				'icon': featureData.img,
				'origin': workflow.item.uuid,
				'duration': {
					'seconds': null,
				},
				'changes': [
					{
						'key': 'flags.midi-qol.onUseMacroName',
						'mode': 0,
						'value': 'function.mbaPremades.macros.bestowCurse.damage,postDamageRoll',
						'priority': 20
					},
					{
						'key': 'flags.midi-qol.onUseMacroName',
						'mode': 0,
						'value': 'function.mbaPremades.macros.bestowCurse.damageApplication,preDamageApplication',
						'priority': 20
					},
					{
						'key': 'flags.mba-premades.spell.bestowCurse.damage.target',
						'mode': 5,
						'value': workflow.targets.first().id,
						'priority': 20
					}
				],
				'flags': {
					'midi-qol': {
						'castData': {
							baseLevel: 3,
							castLevel: workflow.castData.castLevel,
							itemUuid: workflow.item.uuid
						}
					}
				}
			};
			if (!isNaN(duration)) effectData.duration.seconds = duration;
			await mbaPremades.helpers.createEffect(workflow.actor, effectData);
			break;
		case 'Attack':
			featureData.effects[0].changes[0].value = workflow.token.actor.uuid;
			break;
		case 'Turn':
			let saveDC = mbaPremades.helpers.getSpellDC(workflow.item);
			featureData.effects[0].changes[0].value = 'turn=start, saveAbility=wis, saveMagic=true, saveRemove=false, saveDC=' + saveDC + ', name="Bestow Curse: Turn Start", killAnim= true'
			break;
	}
	let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
	let [config, options] = mbaPremades.constants.syntheticItemWorkflowOptions([workflow.targets.first().document.uuid]);
	await MidiQOL.completeItemUse(feature, config, options);
	let targetEffect = mbaPremades.helpers.findEffect(workflow.targets.first().actor, 'Bestow Curse: ' + selection);
	if (!targetEffect) {
		mbaPremades.queue.remove(workflow.item.uuid);
		return;
	}
	await mbaPremades.helpers.updateEffect(targetEffect,
		{
			'origin': workflow.item.uuid,
			'flags': {
				'mba-premades': {
					'isCurse': true,
					'greaterRestoration': true,
					'spell': {
						'bestowCurse': {
							'level': castLevel,
							'type': selection
						}
					}
				}
			}
		}
	);
	if (concentration) {
		let concentrationEffect = mbaPremades.helpers.findEffect(workflow.actor, 'Concentrating');
		if (!concentrationEffect) {
			mbaPremades.queue.remove(workflow.item.uuid);
			return;
		}
		await mbaPremades.helpers.updateEffect(concentrationEffect, { 'origin': workflow.item.uuid, 'flags.midi-qol.isConcentration': workflow.item.uuid });
		await workflow.actor.setFlag('midi-qol', 'concentration-data.uuid', workflow.item.uuid);

	}
	mbaPremades.queue.remove(workflow.item.uuid);

	let target = workflow.targets.first();

	new Sequence()

		.effect()
		.file("jb2a.dodecahedron.skull.below.dark_greenpurple")
		.attachTo(target)
		.fadeIn(800)
		.fadeOut(500)
		.scaleToObject(2.2 * target.document.texture.scaleX)
		.filter("ColorMatrix", { hue: 185 })

		.effect()
		.file("jb2a.template_circle.aura.01.loop.large.orangepurple")
		.delay(1100)
		.attachTo(target)
		.fadeIn(500)
		.fadeOut(500)
		.scaleToObject(2.2 * target.document.texture.scaleX)
		.playbackRate(0.8)
		.filter("ColorMatrix", { hue: 185 })

		.effect()
		.file("jb2a.energy_strands.complete.dark_green.01")
		.delay(1100)
		.fadeIn(500)
		.fadeOut(500)
		.attachTo(target)
		.opacity(0.8)
		.scaleToObject(2 * target.document.texture.scaleX)
		.repeats(4, 800)

		.effect()
		.file("animated-spell-effects-cartoon.misc.fiery eyes.02")
		.delay(1100)
		.attachTo(target)
		.scaleToObject(1.5 * target.document.texture.scaleX)
		.fadeIn(500)
		.fadeOut(500)
		.repeats(3, 1300)

		.play()
}

async function damage({ speaker, actor, token, character, item, args, scope, workflow }) {
	if (workflow.hitTargets.size != 1) return;
	if (workflow.actor.flags['mba-premades']?.spell?.bestowCurse?.damage?.target != workflow.hitTargets.first().id) return;
	let queueSetup = await mbaPremades.queue.setup(workflow.item.uuid, 'bestowCurse', 250);
	if (!queueSetup) return;
	let oldFormula = workflow.damageRoll._formula;
	let bonusDamageFormula = '1d8[necrotic]';
	//await mbaPremades.helpers.addToDamageRoll(workflow, bonusDamageFormula);
	if (workflow.isCritical) bonusDamageFormula = mbaPremades.helpers.getCriticalFormula(bonusDamageFormula);
	let damageFormula = oldFormula + ' + ' + bonusDamageFormula;
	let damageRoll = await new Roll(damageFormula).roll({ async: true });
	await workflow.setDamageRoll(damageRoll);
	mbaPremades.queue.remove(workflow.item.uuid);

	let target = workflow.targets.first();
	new Sequence()

		.effect()
		.file("jb2a.template_circle.aura.01.loop.large.orangepurple")
		.attachTo(target)
		.fadeIn(500)
		.fadeOut(500)
		.scaleToObject(2.2 * target.document.texture.scaleX)
		.playbackRate(0.8)
		.filter("ColorMatrix", { hue: 185 })

		.effect()
		.file("jb2a.energy_strands.complete.dark_green.01")
		.fadeIn(500)
		.fadeOut(500)
		.attachTo(target)
		.opacity(0.8)
		.scaleToObject(2 * target.document.texture.scaleX)
		.repeats(4, 800)

		.effect()
		.file("animated-spell-effects-cartoon.misc.fiery eyes.02")
		.attachTo(target)
		.scaleToObject(1.5 * target.document.texture.scaleX)
		.fadeIn(500)
		.fadeOut(500)
		.repeats(3, 1300)

		.play()
}

async function damageApplication({ speaker, actor, token, character, item, args, scope, workflow }) {
	if (workflow.hitTargets.size < 2) return;
	let targetId = workflow.actor.flags['mba-premades']?.spell?.bestowCurse?.damage.target;
	if (!targetId) return;
	let queueSetup = await mbaPremades.queue.setup(workflow.item.uuid, 'bestowCurse', 250);
	if (!queueSetup) return;
	let targetDamage = workflow.damageList.find(i => i.tokenId === targetId);
	if (!targetDamage) return;
	let targetActor = canvas.scene.tokens.get(targetDamage.tokenId).actor;
	if (!targetActor) {
		mbaPremades.queue.remove(workflow.item.uuid);
		return;
	}
	let damageRoll = await new Roll('1d8[necrotic]').roll({ 'async': true });
	damageRoll.toMessage({
		rollMode: 'roll',
		speaker: { 'alias': name },
		flavor: 'Bestow Curse Damage'
	});
	let hasDI = mbaPremades.helpers.checkTrait(targetActor, 'di', 'necrotic');
	if (hasDI) {
		mbaPremades.queue.remove(workflow.item.uuid);
		return;
	}
	let damageTotal = damageRoll.total;
	let hasDR = mbaPremades.helpers.checkTrait(targetActor, 'dr', 'necrotic');
	if (hasDR) damageTotal = Math.floor(damageTotal / 2);
	targetDamage.damageDetail[0].push(
		{
			'damage': damageTotal,
			'type': 'necrotic'
		}
	);
	targetDamage.totalDamage += damageTotal;
	targetDamage.appliedDamage += damageTotal;
	targetDamage.hpDamage += damageTotal;
	if (targetDamage.oldTempHP > 0) {
		if (targetDamage.oldTempHP >= damageTotal) {
			targetDamage.newTempHP -= damageTotal;
		} else {
			let leftHP = damageTotal - targetDamage.oldTempHP;
			targetDamage.newTempHP = 0;
			targetDamage.newHP -= leftHP;
		}
	} else {
		targetDamage.newHP -= damageTotal;
	}
	mbaPremades.queue.remove(workflow.item.uuid);

}

async function attack({ speaker, actor, token, character, item, args, scope, workflow }) {
	if (workflow.targets.size != 1 || workflow.disadvantage) return;
	let targetUuid = workflow.actor.flags['mba-premades']?.spell?.bestowCurse?.attack.target;
	if (!targetUuid) return;
	if (targetUuid != workflow.targets.first().actor.uuid) return;
	let queueSetup = await mbaPremades.queue.setup(workflow.item.uuid, 'bestowCurse', 50);
	if (!queueSetup) return;
	workflow.disadvantage = true;
	workflow.attackAdvAttribution.add('DIS: Bestow Curse');
	mbaPremades.queue.remove(workflow.item.uuid);

	let target = workflow.targets.first();
	new Sequence()

		.effect()
		.file("jb2a.template_circle.aura.01.loop.large.orangepurple")
		.attachTo(token)
		.fadeIn(500)
		.fadeOut(500)
		.scaleToObject(2.2 * token.document.texture.scaleX)
		.playbackRate(0.8)
		.filter("ColorMatrix", { hue: 185 })

		.effect()
		.file("jb2a.energy_strands.complete.dark_green.01")
		.fadeIn(500)
		.fadeOut(500)
		.attachTo(token)
		.opacity(0.8)
		.scaleToObject(2 * token.document.texture.scaleX)
		.repeats(4, 800)

		.effect()
		.file("animated-spell-effects-cartoon.misc.fiery eyes.02")
		.attachTo(token)
		.scaleToObject(1.5 * token.document.texture.scaleX)
		.fadeIn(500)
		.fadeOut(500)
		.repeats(3, 1300)

		.play()
}

async function remove(effect, origin, token) {
	let curseFlags = effect.flags['mba-premades']?.spell?.bestowCurse
	if (!curseFlags) return;
	await warpgate.wait(200);
	if (curseFlags.type === 'Damage') {
		let damageEffect = origin.actor.effects.find(eff => eff.name === 'Bestow Curse: Damage' && eff.changes?.[2]?.value === token.id);
		if (damageEffect) await mbaPremades.helpers.removeEffect(damageEffect);
	}
	if (curseFlags.level < 5) {
		let effect2 = mbaPremades.helpers.findEffect(origin.actor, 'Concentrating');
		if (effect2) await mbaPremades.helpers.removeEffect(effect2);
	}
}

export let bestowCurse = {
	'item': item,
	'damage': damage,
	'damageApplication': damageApplication,
	'attack': attack,
	'remove': remove
}