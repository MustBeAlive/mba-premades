import {mba} from "../../../../helperFunctions.js";
import {queue} from "../../../mechanics/queue.js";

export async function wrathOfTheStorm({speaker, actor, token, character, item, args, scope, workflow}) {
    let queueSetup = await queue.setup(workflow.item.uuid, 'wrathOfTheStorm', 50);
    if (!queueSetup) return;
    await mba.playerDialogMessage(game.user);
    let selection = await mba.dialog("Wrath of the Storm", [['Lightning', '[lightning]'], ['Thunder', '[thunder]']],`<b>Choose damage type:</b>`);
    await mba.clearPlayerDialogMessage();
    if (!selection) selection = 'lightning';
    let damageFormula = workflow.damageRoll._formula + selection;
    let damageRoll = await new Roll(damageFormula).roll({ async: true });
    await workflow.setDamageRoll(damageRoll);
    queue.remove(workflow.item.uuid);

    let target = workflow.targets.first();
    new Sequence()

        .effect()
        .file("jb2a.chain_lightning.primary.blue")
        .attachTo(token)
        .stretchTo(target)
        .waitUntilFinished(-1000)

        .effect()
        .file("animated-spell-effects-cartoon.electricity.18")
        .attachTo(target)
        .scaleToObject(1)
        .repeats(2, 800)

        .play()
}