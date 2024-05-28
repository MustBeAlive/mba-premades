import {mba} from "../../../helperFunctions.js";

export async function protectionFromPoison({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': "You have advantage on saving throws against being poisoned and have resistance to poison damage.",
        'duration': {
            'seconds': 3600
        },
        'changes': [
            {
                'key': 'system.traits.dr.value',
                'mode': 0,
                'value': 'poison',
                'priority': 20
            },
            {
                'key': 'flags.adv-reminder.message.ability.save.con',
                'mode': 0,
                'value': 'Protection from Poison: advantage on saving throws against being poisoned.',
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.CR.poisoned',
                'mode': 2,
                'value': 1,
                'priority': 20
            }
        ],
        'flags': {
            'midi-qol': {
                'castData': {
                    baseLevel: 2,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };

    new Sequence()

        .wait(1000)

        .effect()
        .file("jb2a.energy_field.01.green")
        .attachTo(target)
        .scaleIn(0, 3500, { ease: "easeOutBack" })
        .scaleOut(0, 3500, { ease: "easeInSine" })
        .tint("#1fdaff")
        .scaleToObject(2 * target.document.texture.scaleX)
        .belowTokens()
        .playbackRate(0.9)
        .duration(10000)
        .name(`${target.document.name} Protection from Poison`)

        .effect()
        .file("jb2a.energy_field.02.below.green")
        .delay(3500)
        .attachTo(target)
        .fadeIn(1000)
        .fadeOut(1000)
        .scaleToObject(1.55 * target.document.texture.scaleX)
        .playbackRate(0.9)
        .name(`${target.document.name} Protection from Poison`)

        .thenDo(function () {
            mba.createEffect(target.actor, effectData);
        })

        .play()

    await warpgate.wait(1500);
    let effectsFirst = target.actor.effects.filter(i => i.name.includes("Poison") && i.name != "Protection from Poison");
    if (!effectsFirst.length) return;
    if (effectsFirst.length < 2) {
        let poison = await mba.findEffect(target.actor, effectsFirst[0].name);
        if (!poison) {
            ui.notifications.warn(`Unable to find Poison: ${effectsFirst[0].name}`);
            return;
        }
        await mba.removeEffect(poison);
    } else {
        let effects = effectsFirst.filter(i => i.name != "Poisoned" && i.name != "Protection from Poison");
        if (effects.length < 2) {
            let poison = await mba.findEffect(target.actor, effects[0].name);
            if (!poison) {
                ui.notifications.warn(`Unable to find Poison: ${effects[0].name}`);
                return;
            }
            await mba.removeEffect(poison);
        } else {
            let effectToRemove = await mba.selectEffect("Protection from Poison", effects, "<b>Choose one effect:</b>", false);
            if (effectToRemove === false) return;
            await mba.removeEffect(effectToRemove);
        }
    }
}