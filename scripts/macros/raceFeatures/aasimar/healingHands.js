import {mba} from "../../../helperFunctions.js";

export async function healingHands({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let prof = workflow.actor.system.attributes.prof;
    let formula = `${prof}d4[healing]`;
    let healingRoll = await new Roll(formula).roll({ 'async': true });
    await MidiQOL.displayDSNForRoll(healingRoll, 'damageRoll');
    new Sequence()

        .effect()
        .file("animated-spell-effects-cartoon.energy.10")
        .attachTo(target)
        .scaleToObject(1.4)
        .filter("ColorMatrix", { hue: 280 })
        .waitUntilFinished(-700)

        .effect()
        .file("jb2a.healing_generic.burst.yellowwhite")
        .attachTo(target)
        .scaleToObject(1.35)
        .filter("ColorMatrix", { hue: 80 })
        .playbackRate(0.9)

        .thenDo(async () => {
            await mba.applyWorkflowDamage(workflow.token, healingRoll, "healing", [target], undefined, workflow.itemCardId);
        })

        .play()
}