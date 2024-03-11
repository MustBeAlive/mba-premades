async function start({speaker, actor, token, character, item, args, scope, workflow}) {
    if (workflow.failedSaves.size != 1) return;
    let target = workflow.targets.first();
    await chrisPremades.helpers.addCondition(target.actor, 'prone');
	const intScore = target.actor.system.abilities.int.value;
	const uuid = workflow.actor.uuid;
	if (intScore <= 4) {
		ui.notifications.warn("This creature is not effected, its Intelligence score is too low.")
		await game.dfreds.effectInterface.removeEffect({ effectName: 'Concentrating', uuid });
	}
}

async function isDamaged({speaker, actor, token, character, item, args, scope, workflow}) {
    const originItem = await fromUuid(actor.effects.find((eff) => eff.name === "Hideous Laughter").origin);
	const spellDC = originItem.actor.system.attributes.spelldc;
	const uuid = originItem.actor.uuid;
	const saveAbility = "wis";

	let effectData = {
        'name': 'Save Advantage',
        'icon': 'assets/library/icons/sorted/generic/generic_buff.png',
        'description': "You have advantage on the next save you make",
        'duration': {
            'turns': 1
        },
		'changes': [
                {   
                    'key': 'flags.midi-qol.advantage.ability.save.wis', 
                    'mode': 0, 
                    'value': 1, 
                    'priority': 20 
                }
            ],
		'flags': { 
            "dae": { 
                "token": actor.uuid, specialDuration: ["isSave"] 
            } 
        },
		'disabled': false
	};
	let checkEffect = actor.effects.find(i => i.name ===  `Save Advantage`);
    if(!checkEffect) await chrisPremades.helpers.createEffect(actor, effectData);


	const itemData = originItem.clone({
	    name: "Hideous Laughter Saving Throw",
	    type: "feat",
	    effects: [],
	    flags: {
		    "midi-qol": {
		        noProvokeReaction: true,
		        onUseMacroName: null,
		        forceCEOff: true
		    },
	    },
	    system: {
		    equipped: true,
		    actionType: "save",
		    save: { dc: spellDC, ability: saveAbility, scaling: "flat" }, "target.type": "self",
		    components: { concentration: false, material: false, ritual: false, somatic: false, value: "", vocal: false },
		    duration: { units: "inst", value: undefined },
	    },
	},{ keepId:true });
	itemData.system.target.type = "self";
	setProperty(itemData.flags, "autoanimations.killAnim", true);
	const itemUpdate = new CONFIG.Item.documentClass(itemData, { parent: actor });
	const options = { showFullCard: false, createWorkflow: true, versatile: false, configureDialog: false };
	const saveResult = await MidiQOL.completeItemUse(itemUpdate, {}, options);

	if (saveResult.failedSaves.size === 0) {
		const hasConcApplied = await game.dfreds.effectInterface.hasEffectApplied('Concentrating', uuid);
		if (hasConcApplied)	game.dfreds.effectInterface.removeEffect({ effectName: 'Concentrating', uuid });
	}
}

export let tashaHideousLaughter = {
    'start': start,
    'isDamaged': isDamaged
}