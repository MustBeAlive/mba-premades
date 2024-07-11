import {constants} from "../../../generic/constants.js";
import {mba} from "../../../../helperFunctions.js";

export async function balmOfTheSummerCourt({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let feature = await mba.getItem(workflow.actor, "Balm of the Summer Court");
    if (!feature) {
        ui.notifications.warn("Unable to find feature! (Balm of the Summer Court)");
        return;
    }
    let uses = feature.system.uses.value;
    if (uses < 1) {
        ui.notifications.warn("You don't have any charges left!");
        return;
    }
    let druidLevels = workflow.actor.classes.druid?.system.levels;
    let max = Math.min(uses, Math.floor(druidLevels / 2));
    let inputs = [
        {
            'label': `Input ammount of charges (Max: ${max})`,
            'type': 'number'
        }
    ];
    await mba.playerDialogMessage();
    let selection = await mba.menu("Balm of the Summer Court", constants.okCancel, inputs, true);
    await mba.clearPlayerDialogMessage();
    if (!selection.buttons) return;
    let ammount = selection.inputs[0];
    if (ammount > max || isNaN(ammount)) {
        ui.notifications.warn("Wrong input!");
        return;
    }
    let healingRoll = await new Roll(`${ammount}d6[healing]`).roll({ 'async': true });
    let temphpRoll = await new Roll(`${ammount}`).roll({ 'async': true });
    await MidiQOL.displayDSNForRoll(healingRoll);

    new Sequence()

        .effect()
        .file("jb2a.bless.400px.intro.green")
        .attachTo(target)
        .scaleToObject(1.8 * target.document.texture.scaleX)
        .playbackRate(1.5)
        .fadeOut(1000)
        .belowTokens()
        .waitUntilFinished(-2800)

        .effect()
        .file("jb2a.healing_generic.burst.bluewhite")
        .attachTo(target)
        .scaleToObject(1.75 * target.document.texture.scaleX)
        .filter("ColorMatrix", { hue: 260 })

        .effect()
        .file(`jb2a.particles.outward.greenyellow.02.03`)
        .attachTo(target, { followRotation: false })
        .scaleToObject(1.1 * target.document.texture.scaleX)
        .delay(600)
        .duration(1000)
        .fadeOut(800)
        .scaleIn(0, 1000, { ease: "easeOutCubic" })
        .zIndex(0.2)

        .thenDo(async () => {
            await mba.applyWorkflowDamage(workflow.token, healingRoll, "healing", [target], undefined, workflow.itemCardId);
            await mba.applyDamage([target], temphpRoll.total, "temphp");
            await feature.update({ "system.uses.value": uses - ammount })
        })

        .play();
}