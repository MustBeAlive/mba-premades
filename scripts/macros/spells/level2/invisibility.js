import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

export async function invisibility({ speaker, actor, token, character, item, args, scope, workflow }) {
    let ammount = workflow.castData.castLevel - 1;
    if (workflow.targets.size > ammount) {
        let selection = await mba.selectTarget(workflow.item.name, constants.okCancel, Array.from(workflow.targets), false, 'multiple', undefined, false, 'Too many targets selected. Choose which targets to keep (Max: ' + ammount + ')');
        if (!selection.buttons) {
			ui.notifications.warn('Failed to select targets, try again!')
            await mba.removeCondition(workflow.actor, "Concentrating");
			return;
		}
        let newTargets = selection.inputs.filter(i => i).slice(0, ammount);
        mba.updateTargets(newTargets);
        if (Array.from(game.user.targets).length > ammount) {
            ui.notifications.warn("Too many targets selected, try again!");
            await mba.removeCondition(workflow.actor, "Concentrating");
            return;
        }
    }
    await warpgate.wait(100);
    let targets = Array.from(game.user.targets);
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are invisible until the spell ends.</p>
            <p>This effect ends early if you make an attack or cast a spell.</p>
        `,
        'duration': {
            'seconds': 3600
        },
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Invisible",
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'specialDuration': ['1Attack', '1Spell']
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 2,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    for (let target of targets) {
        new Sequence()

            .wait(500)

            .effect()
            .file("jb2a.particle_burst.01.circle.orangepink")
            .attachTo(target)
            .scaleToObject(2.3 * target.document.texture.scaleX)
            .duration(1300)
            .fadeOut(300)

            .effect()
            .delay(1000)
            .file("animated-spell-effects-cartoon.misc.weird.01")
            .atLocation(target)
            .scaleToObject(2 * target.document.texture.scaleX)
            .opacity(0.8)
            .filter("ColorMatrix", { hue: 100 })

            .wait(1500)

            .thenDo(function () {
                mba.createEffect(target.actor, effectData)
            })

            .play()
    }
}