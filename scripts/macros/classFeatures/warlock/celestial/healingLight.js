import {constants} from "../../../generic/constants.js";
import {mba} from "../../../../helperFunctions.js";

export async function healingLight({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let feature = await mba.getItem(workflow.actor, "Healing Light");
    if (!feature) {
        ui.notifications.warn("Unable to find feature! (Healing Light)");
        return;
    }
    let uses = feature.system.uses.value;
    if (uses < 1) {
        ui.notifications.warn("You don't have any charges left!");
        return;
    }
    let max = workflow.actor.system.abilities.cha.mod;
    let inputs = [
        {
            'label': `Input ammount of charges (Max: ${max})`,
            'type': 'number'
        }
    ];
    await mba.playerDialogMessage();
    let selection = await mba.menu("Healing Light", constants.okCancel, inputs, true);
    await mba.clearPlayerDialogMessage();
    if (!selection.buttons) return;
    let ammount = selection.inputs[0];
    if (ammount > max || isNaN(ammount)) {
        ui.notifications.warn("Wrong input!");
        return;
    }
    let healingRoll = await new Roll(`${ammount}d6[healing]`).roll({ 'async': true });
    await MidiQOL.displayDSNForRoll(healingRoll);

    new Sequence()

        .effect()
        .file("jb2a.divine_smite.caster.yellowwhite")
        .attachTo(workflow.token)
        .scaleToObject(2)
        .waitUntilFinished(-2800)

        .effect()
        .file("jb2a.healing_generic.03.burst.green")
        .attachTo(target)
        .scaleToObject(2)
        .filter("ColorMatrix", { hue: 250 })
        .waitUntilFinished(-1233)

        .effect()
        .file("jb2a.healing_generic.burst.yellowwhite")
        .attachTo(target)
        .scaleToObject(1.35)
        .playbackRate(0.9)

        .thenDo(async () => {
            await mba.applyWorkflowDamage(workflow.token, healingRoll, "healing", [target], undefined, workflow.itemCardId);
            await feature.update({ "system.uses.value": uses - ammount })
        })

        .play();
}