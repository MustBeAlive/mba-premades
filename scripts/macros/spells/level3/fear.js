export async function fear({speaker, actor, token, character, item, args, scope, workflow}) {
    if (workflow.failedSaves.size < 1) return;
    let targets = Array.from(workflow.failedSaves);
    async function effectMacroStart() {
        await new Dialog({
            title: "Fear",
            content: "<p>You are frightened. On each of your turns you must take the <b>Dash Action</b> and move away from the caster of the Fear spell by the safest available route, unless there is nowhere to move.</p><p>If you <b>end your turn in a location where the caster of the Fear spell can no longer see you</b>, you can make a Wisdom Saving Throw. On a successful save, the spell ends.</p>",
            buttons: {
                ok: {
                    label: "Ok!",
                    callback: async (html) => {
                        return;
                    },
                },
            },
            default: "Ok!"
        }).render(true);
    };
    async function effectMacroEnd() {
        let effect = chrisPremades.helpers.findEffect(actor, 'Fear');
        let casterName = effect.flags['mba-premades']?.spell?.fear?.name;
        console.log(casterName);
        let casterCanSee = await MidiQOL.findNearby(null, token, 200, { includeIncapacitated: false, canSee: true }).filter(i => i.name === casterName);
        console.log(casterCanSee);
        if (casterCanSee.length) return;
        let spellDC = effect.flags['mba-premades']?.spell?.fear.dc;
        let saveRoll = await chrisPremades.helpers.rollRequest(token, 'save', 'wis');
        if (saveRoll.total < spellDC) return;
        await chrisPremades.helpers.removeEffect(effect);
    };
    let effectData = {
        'name': "Fear",
        'icon': "assets/library/icons/sorted/spells/level3/fear.webp",
        'description': "You are frightened. On each of your turns you must take the Dash Action and move away from the caster of the Fear spell by the safest available route, unless there is nowhere to move. If you end your turn in a location where the caster of the Fear spell can no longer see you, you can make a Wisdom Saving Throw. On a successful save, the spell ends.",
        'origin': workflow.item.uuid,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Frightened",
                'priority': 20
            }
        ],
        'flags': {
            'effectmacro': {
                'onTurnStart': {
                    'script': chrisPremades.helpers.functionToString(effectMacroStart)
                },
                'onTurnEnd': {
                    'script': chrisPremades.helpers.functionToString(effectMacroEnd)
                }
            },
            'mba-premades': {
                'spell': {
                    'fear': {
                        'name': workflow.token.document.name,
                        'dc': chrisPremades.helpers.getSpellDC(workflow.item)
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
    for (let i = 0; i < targets.length; i++) {
        let target = fromUuidSync(targets[i].document.uuid).object;
        let hasFearImmunity = chrisPremades.helpers.checkTrait(workflow.targets.first().actor, 'ci', 'frightened');
        if (hasFearImmunity) return;
        await chrisPremades.helpers.createEffect(target.actor, effectData);    
    }
}