
//To do: whole spell

async function item({speaker, actor, token, character, item, args, scope, workflow}) {
    let target = workflow.targets.first();
    let hasFearImmunity = mbaPremades.helpers.checkTrait(target.actor, 'ci', 'frightened');
    if (!workflow.failedSaves.size) {
        await mbaPremades.helpers.removeCondition(workflow.actor, 'Concentrating');
        return;
    }
    if (hasFearImmunity) {
        ui.notifications.warn("Target is immune to Condition: Feared and is unaffected by Enemies Abound!")
        await mbaPremades.helpers.removeCondition(workflow.actor, 'Concentrating');
        return;
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': "You lose the ability to distinguish friend from foe, regarding all creatures you can see as enemies until the spell ends. Each time you take damage, you can repeat the saving throw, ending the effect on a success. Whenever you choose another creature as a target while affected by this spell, you must choose the target at random from among the creatures you can see within range of the attack, spell, or other ability you are using. If an enemy provokes an opportunity attack from you, you must make that attack if you are able to.",
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.enemiesAbound.isDamaged,isDamaged',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.enemiesAbound.targetCheck,preItemRoll',
                'priority': 20
            }
        ],
        'flags': {
            'mba-premades': {
                'spell': {
                    'enemiesAbound': {
                        'dc': mbaPremades.helpers.getSpellDC(workflow.item)
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
    await mbaPremades.helpers.createEffect(target.actor, effectData);
}

//IS BORKED, REWORK
async function isDamaged({speaker, actor, token, character, item, args, scope, workflow}) {
    const originItem = await fromUuid(actor.effects.find((eff) => eff.name === 'Enemies Abound').origin);
    let effect = mbaPremades.helpers.findEffect(actor, 'Enemies Abound');
    if (!effect) return;
    let spellDC = effect.flags['mba-premades']?.spell?.enemiesAbound?.dc;
    const itemData = originItem.clone({
	    name: "Enemies Abound: Saving Throw",
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
		    save: { dc: spellDC, ability: "int", scaling: "flat" }, "target.type": "self",
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
        await mbaPremades.helpers.removeEffect(effect);
	}
}

// IS BORKED, REWORK
async function targetCheck({speaker, actor, token, character, item, args, scope, workflow}) {
    let range = workflow.item.system.range.value;
    if (!range) {
        let isSelf = workflow.item.system.target.type;
        if (isSelf === "self") return;
        ui.notifications.warn("Item has no range value. Ask GM for target randomisation (if it can be applied to the used item).");
        return;
    }
    let targetAmmount = workflow.item.system.target.value;
    if (!targetAmmount) {
        ui.notifications.warn("Item has no targets value. Ask GM for target randomisation (if it can be applied to the used item).");
        return;
    }
    let nearbyTargets = await MidiQOL.findNearby(null, token, range, { includeIncapacitated: false, isSeen: true })
    if (targetAmmount >= nearbyTargets.length) {
        console.log("Used item can target more creatures than there are valid targets nearby. Enemies Abound can't affect this item, returning.");
        return;
    }
    let output = mutableSample(nearbyTargets, targetAmmount);
    let newTargets = [];
    for (let i = 0; i < output.length; i++) {
        let token = output[i].document.id;
        newTargets.push(token);
    }
    ui.notifications.warn("You are confused by Enemies Abound and randomly changed target(s)!");
    new Sequence()
        .effect()
        .file("jb2a.dizzy_stars.400px.orange")
        .atLocation(token)
        .anchor(0.5)
        .scaleToObject(2)
        .repeats(3, 1200)

        .play();

    await warpgate.wait(500);
    await mbaPremades.helpers.updateTargets(newTargets);

    function mutableSample (arr, n) { //gets n values from array without shuffling (modifies the array)
        const output = [];
        for (let i = 0; i < n; i++) {
        const randomIndex = Math.floor(Math.random() * arr.length);
        output.push(arr[randomIndex]);
        arr.splice(randomIndex, 1);
        }
        return output;
    }
}

export let enemiesAbound = {
    'item': item,
    'isDamaged': isDamaged,
    'targetCheck': targetCheck
}