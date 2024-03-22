export async function powerWordStun({speaker, actor, token, character, item, args, scope, workflow}) {
    let target = workflow.targets.first();
    let currentHP = target.actor.system.attributes.hp.value;
    if (currentHP <= 150) {
        new Sequence()
            .effect()
            .file("jb2a.sacred_flame.source.blue")
            .atLocation(target)
            .anchor(0.5)
            .scaleToObject(1.5)
            .fadeIn(250)
            .fadeOut(500)

            .effect()
            .file("jb2a.sacred_flame.target.blue")
            .atLocation(target)
            .scaleToObject(2.5)
            .anchor(0.5)
            .fadeIn(250)
            .fadeOut(500)
            .delay(1500)

            .play();
        await warpgate.wait(3500);
        const effectData = {
            'name': "Power Word: Stun",
            'icon': "assets/library/icons/sorted/spells/level8/power_word_stun.webp",
            'description': "You are stunned by a power word. At the end of each of your turns, you can make a Constitution Saving Throw. On a successful save, this stunning effect ends.",
            'changes': [
                {
                    'key': 'flags.midi-qol.OverTime',
                    'mode': 0,
                    'value': 'turn=end, saveAbility=con, saveDC=' + chrisPremades.helpers.getSpellDC(workflow.item) + ' , saveMagic=true, name=Stun',
                    'priority': 20
                },
                {
                    'key': 'macro.CE',
                    'mode': 0,
                    'value': 'Stunned',
                    'priority': 20
                }
            ],
            'flags': {
                'dae': {
                    'showIcon': true,
                },
                'midi-qol': {
                    'castData': {
                        baseLevel: 8,
                        castLevel: workflow.castData.castLevel,
                        itemUuid: workflow.item.uuid
                    }
                }
            }
        };
        await chrisPremades.helpers.createEffect(target.actor, effectData);
    } else {
        ui.notifications.warn('Target HP is higher than 100!');
        return;
    }
}