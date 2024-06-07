import {mba} from "../../../helperFunctions.js";

export async function cleansingTouch({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let effects = target.actor.effects.filter(e => e.active === true && e.flags['midi-qol']?.castData?.castLevel >= 0);
    if (!effects.length) {
        ui.notifications.warn('No effects to dispel!');
        return;
    }
    let effectToDispel = await mba.selectEffect("Cleansing Touch", effects, "<b>Choose one effect:</b>");
    if (!effectToDispel) return;
    new Sequence()

        .effect()
        .file("jb2a.divine_smite.caster.yellowwhite")
        .attachTo(workflow.token)
        .scaleToObject(2)
        .waitUntilFinished(-1800)

        .effect()
        .file("jb2a.healing_generic.03.burst.green")
        .attachTo(target)
        .scaleToObject(2)
        .filter("ColorMatrix", { hue: 250 })
        .waitUntilFinished(-1233)

        .effect()
        .file("jb2a.detect_magic.circle.yellow")
        .atLocation(target)
        .scaleToObject(2)
        .anchor(0.5)
        .sound("modules/dnd5e-animations/assets/sounds/Spells/Buff/spell-buff-short-8.mp3")

        .thenDo(async () => {
            await mba.removeEffect(effectToDispel);
        })

        .play()
}