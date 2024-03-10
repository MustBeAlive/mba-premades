export async function ensnaringStrike({speaker, actor, token, character, item, args, scope, workflow}) {
    if (!["mwak"].includes(args[0].item.system.actionType) && !["rwak"].includes(args[0].item.system.actionType)) return {}; // check if attack is made with melee/ranged weapon
    if (args[0].hitTargetUuids.length === 0) return {}; // did not hit anyone
    for (let tokenUuid of args[0].hitTargetUuids) {
    const target = await fromUuid(tokenUuid);
    const targetActor = target.actor;
    if (!targetActor) continue;
    let selected = await MidiQOL.MQfromActorUuid(args[0].actorUuid); 
    let spellDC = selected.system.attributes.spelldc;
    let spellLevel = workflow.castData.castLevel;
    console.log(spellLevel);

    const saveRollData =  {
        request: "save",
        targetUuid: target.actor.uuid,
        ability: "str",
        options: {
            chatMessage: true,
            flavor: `DC${spellDC} vs Ensnaring Strike`,
        },
    };
    const saveRoll = await MidiQOL.socket().executeAsGM("rollAbility", saveRollData);
    if (saveRoll.total >= spellDC) {
        const effect = MidiQOL.getConcentrationEffect(actor);
        if (effect) effect.delete();
        return true;
    }
    const effectData = {
        'name': "Ensnaring Strike",
        'icon': "assets/library/icons/sorted/spells/level1/ensnaring_strike_ranged.webp",
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': "macro.CE", 
                'mode': 0, 
                'value': "Restrained", 
                'priority': 20
            },
            {
                'key': "flags.midi-qol.OverTime", 
                'mode': 0, 
                'value': "turn=start, saveMagic=true, damageBeforeSave=true, damageType=piercing, damageRoll=d6[piercing], label=Piercing Vines", 
                'priority': 20
            },
            {
                'key': "flags.midi-qol.OverTime", 
                'mode': 0, 
                'value': "actionSave=true, saveMagic=false, saveRemove=true, rollType=check, saveAbility=str, saveDC=@attributes.spelldc, label=Strength Ability Check to escape (action)", 
                'priority': 20
            }
        ],
    }
    await MidiQOL.socket().executeAsGM('createEffects', { actorUuid: targetActor.uuid, effects: [effectData] });
    }

    const effect = MidiQOL.getConcentrationEffect(actor);
    if (effect) {
        effect.delete();
        return true
    }
}