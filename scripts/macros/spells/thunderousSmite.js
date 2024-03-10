export async function thunderousSmite({speaker, actor, token, character, item, args, scope, workflow}) {
    if (!["mwak"].includes(args[0].item.system.actionType)) return {};
    if (args[0].hitTargetUuids.length === 0) return {}; // did not hit anyone
    for (let tokenUuid of args[0].hitTargetUuids) {
        const target = await fromUuid(tokenUuid);
        const targetActor = target.actor;
        if (!targetActor) continue;
        let selected = await MidiQOL.MQfromActorUuid(args[0].actorUuid); 
        let spellDC = selected.system.attributes.spelldc;

        const saveRollData =  {
            request: "save",
            targetUuid: target.actor.uuid,
            ability: "str",
            options: {
                chatMessage: true,
                flavor: `DC${spellDC} vs Thunderous Smite`,
            },
        };
        const saveRoll = await MidiQOL.socket().executeAsGM("rollAbility", saveRollData);
        if (saveRoll.total < spellDC)  {
            let targetToken = workflow.targets.first();
            const effectData = {
                'name': "Thunderous Smite: Prone",
                'icon': "assets/library/icons/sorted/spells/level1/thunderous_smite.webp",
                'duration': {
                    'seconds': 60
                },
                'changes': [
                    {
                        'key': "macro.CE", 
                        'mode': 0, 
                        'value': "Prone", 
                        'priority': 20
                    }
                ]
            }
            chrisPremades.helpers.pushToken(workflow.token, targetToken, 10);
            await MidiQOL.socket().executeAsGM('createEffects', { actorUuid: targetActor.uuid, effects: [effectData] });
        } 
    }
    Hooks.once("midi-qol.RollComplete", (workflow) => {
    const effect = MidiQOL.getConcentrationEffect(actor);
    if (effect) effect.delete();
    return true;
    });
    if (args[0].isCritical) return {damageRoll: `4d6[thunder]`, flavor: "Thunderous Smite" };
    return { damageRoll: `2d6[thunder]`, flavor: "Thunderous Smite" };
}