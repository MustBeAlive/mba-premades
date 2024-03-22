// Reworked; Original Macro by DDB and based on @ccjmk and @crymic macro for sleep.
export async function colorSpray({speaker, actor, token, character, item, args, scope, workflow}) {
	const blindHp = await workflow.damageTotal;
	const immuneConditions = [game.i18n.localize("Blinded"), game.i18n.localize("Unconscious")];
	console.log(`Color Spray Spell => Available HP Pool [${blindHp}] points`);

	const targets = await Array.from(workflow.targets)
		.filter((i) => i.actor.system.attributes.hp.value != 0 && !i.actor.effects.find((x) => immuneConditions.includes((x.name ?? x.label))))
		.sort((a, b) => (canvas.tokens.get(a.id).actor.system.attributes.hp.value < canvas.tokens.get(b.id).actor.system.attributes.hp.value ? -1 : 1));
	let remainingBlindHp = blindHp;
	let blindTarget = [];

	for (let target of targets) {
		const findTarget = await canvas.tokens.get(target.id);
		const targetHpValue = findTarget.actor.system.attributes.hp.value;
		const targetImg = findTarget.document.texture.src;

		if (remainingBlindHp >= targetHpValue) {
			remainingBlindHp -= targetHpValue;
			console.log(`Color Spray Results => Target: ${findTarget.name} |  HP: ${targetHpValue} | HP Pool: ${remainingBlindHp} | Status: Blinded`);
			blindTarget.push(`<div class="midi-qol-flex-container"><div>Blinded</div><div class="midi-qol-target-npc midi-qol-target-name" id="${findTarget.id}"> ${findTarget.name}</div><div><img src="${targetImg}" width="30" height="30" style="border:0px"></div></div>`);
			const effectData = {
					'name': 'Color Spray: Blinded',
					'icon': 'assets/library/icons/sorted/spells/level1/Colour_Spray.webp',
					'origin': workflow.item.uuid,
					'duration': { 
						'seconds': 12
					},
					'flags': { 
						'dae': { 
							'specialDuration': ['turnEndSource']
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
						'key': 'macro.CE',
						'mode': 0,
						'value': "Blinded",
						'priority': 20
						}
					]
				};
				await chrisPremades.helpers.createEffect(findTarget.actor, effectData);
				await warpgate.wait(200);
				
			} else {
				console.log(`Color Spray Results => Target: ${target.name} | HP: ${targetHpValue} | HP Pool: ${remainingBlindHp - targetHpValue} | Status: Not enough HP remaining`);
				blindTarget.push(`<div class="midi-qol-flex-container"><div>misses</div><div class="midi-qol-target-npc midi-qol-target-name" id="${findTarget.id}"> ${findTarget.name}</div><div><img src="${targetImg}" width="30" height="30" style="border:0px"></div></div>`);
		}
	}
	await warpgate.wait(500);
	const blindResults = `<div><div class="midi-qol-nobox">${blindTarget.join('')}</div></div>`;
	const chatMessage = game.messages.get(workflow.itemCardId);
	let content = duplicate(chatMessage.content);
	const searchString = /<div class="midi-qol-hits-display">[\s\S]*<div class="end-midi-qol-hits-display">/g;
	const replaceString = `<div class="midi-qol-hits-display"><div class="end-midi-qol-hits-display">${blindResults}`;
	content = await content.replace(searchString, replaceString);
	await chatMessage.update({ content: content });
}