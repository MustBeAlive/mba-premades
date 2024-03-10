export async function dissonantWhispers({speaker, actor, token, character, item, args, scope, workflow}) {
    if (args[0].macroPass === "postActiveEffects") {
        const target = workflow.hitTargets.values().next().value;
        const uuid = target.document.uuid;
        const saveAbility = "wis";
        const damageType = "psychic";
        const attackNum = Math.floor(workflow.itemLevel + 2);
        const spellDC = actor.system.attributes.spelldc;
        const hasEffectApplied = await game.dfreds.effectInterface.hasEffectApplied('Deafened', uuid);
        const hasEffectAppliedReaction = await game.dfreds.effectInterface.hasEffectApplied('Reaction', uuid);
        
        if (hasEffectApplied) {
            ui.notifications.info("Цель оглушена (deafened) и автоматически проходит проверку");
            let damageRoll = await new Roll(`${attackNum}d6 / 2`).roll({async: true});
            damageRoll.total = Math.floor(damageRoll.total);
            damageRoll._total = Math.floor(damageRoll.total);
            await MidiQOL.displayDSNForRoll(damageRoll,'damageRoll');
            await new MidiQOL.DamageOnlyWorkflow(actor, token, damageRoll.total, damageType, target ? [target] : [], damageRoll, {flavor: "Damage Roll (Psychic)", itemCardId: workflow.itemCardId});
        }
        
        else
        {
        const itemData = item.clone(
        {
        name: item.name.concat(" Damage"),
        img: "assets/library/icons/sorted/spells/level1/Dissonant_Whispers.webp", //Change chat image here
          type: "feat",
          effects: [],
          flags: {
            "midi-qol": {
              noProvokeReaction: true,
              onUseMacroName: null,
              forceCEOff: true
            },"midiProperties": {
              halfdam: true
              },
          },
          system: {
            equipped: true,
            actionType: "save",
            save: { dc: spellDC, ability: saveAbility, scaling: "flat" },
            damage: { parts: [[`${attackNum}d6`, damageType]] },
            "target.type": "self",
            components: { concentration: false, material: false, ritual: false, somatic: false, value: "", vocal: false },
            duration: { units: "inst", value: undefined },
          },
        },
        { keepId:true }
        );
        itemData.system.target.type = "self";
        setProperty(itemData.flags, "autoanimations.killAnim", true);
        const itemUpdate = new CONFIG.Item.documentClass(itemData, { parent: target.actor });
        const options = { showFullCard: false, createWorkflow: true, versatile: false, configureDialog: false, workflowOptions: {autoRollDamage: 'always', autoFastDamage: true} };
        const saveResult = await MidiQOL.completeItemUse(itemUpdate, {}, options);
        if (saveResult.failedSaves.size == 1) {
            if(!hasEffectAppliedReaction)
            {
            await game.dfreds.effectInterface.addEffect({ effectName: 'Reaction', uuid });
            }
            ui.notifications.info("Цель Dissonant Whispers должна отойти от кастера настолько, насколько позволит скорость. Цель не идет в заведомо опасную местность");
        }
        }
    }
}