import {mba} from "../../../helperFunctions.js";

export async function mending({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    new Sequence()

        .effect()
        .file("animated-spell-effects-cartoon.level 01.healing word.yellow")
        .attachTo(target)
        .scaleToObject(2)

        .effect()
        .file("animated-spell-effects-cartoon.cantrips.sacred_flame.yellow")
        .attachTo(target)
        .delay(450)
        .belowTokens()
        .scaleToObject(2.2)
        .playbackRate(0.8)

        .effect()
        .file("animated-spell-effects-cartoon.misc.mend")
        .attachTo(target)
        .scaleToObject(1.5)
        .delay(250)
        .filter("ColorMatrix", { hue: 310 })
        .playbackRate(0.8)

        .thenDo(async () => {
            if (target.document.name === "Eldritch Cannon" || target.document.name === "Steel Defender") {
                let healingRoll = await new Roll("2d6[healing]").roll({ 'async': true });
                await MidiQOL.displayDSNForRoll(healingRoll);
                await mba.applyWorkflowDamage(workflow.token, healingRoll, "healing", [target], undefined, workflow.itemCardId);
            }
        })

        .play()
}