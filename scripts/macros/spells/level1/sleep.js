// Reworked to use workflow; Original Macro by @ccjmk and @crymic
export async function sleep({ speaker, actor, token, character, item, args, scope, workflow }) {
	const sleepHp = await workflow.damageTotal;
	const condition = "Unconscious";
	console.log(`Sleep Spell => Available HP Pool [${sleepHp}] points`);
	const targets = await Array.from(workflow.targets)
		.filter((i) => i.actor.system.attributes.hp.value != 0 && !i.actor.effects.find((x) => x.data.label === condition))
		.sort((a, b) => (canvas.tokens.get(a.id).actor.system.attributes.hp.value < canvas.tokens.get(b.id).actor.system.attributes.hp.value ? -1 : 1));
	let remainingSleepHp = sleepHp;
	let sleepTarget = [];

	for (let target of targets) {
		const findTarget = await canvas.tokens.get(target.id);
		const immuneType = findTarget.actor.type === "character"
			? ["undead", "construct"].some((race) => (findTarget.actor.system.details.race || "").toLowerCase().includes(race))
			: ["undead", "construct"].some((value) => (findTarget.actor.system.details.type.value || "").toLowerCase().includes(value));
		const immuneCI = findTarget.actor.system.traits.ci.custom.includes("Sleep");
		const sleeping = findTarget.actor.effects.find((i) => i.label === condition);
		const targetHpValue = findTarget.actor.system.attributes.hp.value;
		const targetImg = findTarget.document.texture.src;
		if ((immuneType) || (immuneCI) || (sleeping)) {
			console.log(`Sleep Results => Target: ${findTarget.name} | HP: ${targetHpValue} | Status: Resists`);
			sleepTarget.push(`<div class="midi-qol-flex-container"><div>Resists</div><div class="midi-qol-target-npc midi-qol-target-name" id="${findTarget.id}"> ${findTarget.name}</div><div><img src="${targetImg}" width="30" height="30" style="border:0px"></div></div>`);
			continue;
		}
		if (remainingSleepHp >= targetHpValue) {
			remainingSleepHp -= targetHpValue;
			console.log(`Sleep Results => Target: ${findTarget.name} |  HP: ${targetHpValue} | HP Pool: ${remainingSleepHp} | Status: Slept`);
			sleepTarget.push(`<div class="midi-qol-flex-container"><div>Slept</div><div class="midi-qol-target-npc midi-qol-target-name" id="${findTarget.id}"> ${findTarget.name}</div><div><img src="${targetImg}" width="30" height="30" style="border:0px"></div></div>`);
			const effectData = {
				'name': "Sleep Spell",
				'icon': "assets/library/icons/sorted/spells/level1/Sleep.webp",
				'origin': workflow.item.uuid,
				'duration': {
					'seconds': 60
				},
				'flags': {
					'dae': {
						'specialDuration': ["isDamaged"]
					},
					'midi-qol': {
						'castData': {
							baseLevel: 1,
							castLevel: workflow.castData.castLevel,
							itemUuid: workflow.item.uuid
						}
					}
				},
				'changes': [
					{
						'key': "macro.CE",
						'mode': 0,
						'value': "Unconscious",
						'priority': 20
					},
				]
			};
			await chrisPremades.helpers.createEffect(findTarget.actor, effectData);
			await warpgate.wait(200);
			continue;

		} else {
			console.log(`Sleep Results => Target: ${target.name} | HP: ${targetHpValue} | HP Pool: ${remainingSleepHp - targetHpValue} | Status: Missed`);
			sleepTarget.push(`<div class="midi-qol-flex-container"><div>misses</div><div class="midi-qol-target-npc midi-qol-target-name" id="${findTarget.id}"> ${findTarget.name}</div><div><img src="${targetImg}" width="30" height="30" style="border:0px"></div></div>`);
		}
	}
	await warpgate.wait(500);
	const sleptResults = `<div><div class="midi-qol-nobox">${sleepTarget.join('')}</div></div>`;
	const chatMessage = game.messages.get(workflow.itemCardId);
	let content = duplicate(chatMessage.content);
	const searchString = /<div class="midi-qol-hits-display">[\s\S]*<div class="end-midi-qol-hits-display">/g;
	const replaceString = `<div class="midi-qol-hits-display"><div class="end-midi-qol-hits-display">${sleptResults}`;
	content = await content.replace(searchString, replaceString);
	await chatMessage.update({ content: content });
}