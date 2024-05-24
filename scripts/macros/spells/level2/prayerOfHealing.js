import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

export async function prayerOfHealing({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.targets.size) return;
    let targets = [];
    for (let i of workflow.targets) if (i.actor.system.details.type.value != 'undead' && i.actor.system.details.type.value != 'construct') targets.push(i);
    if (!targets.length) return;
    let diceNumber = workflow.castData.castLevel;
    let damageFormula = `${diceNumber}d8[healing] + ${mba.getSpellMod(workflow.item)}`;
    let damageRoll = await new Roll(damageFormula).roll({ 'async': true });
    await MidiQOL.displayDSNForRoll(damageRoll, 'damageRoll');
    damageRoll.toMessage({
        rollMode: 'roll',
        speaker: { 'alias': name },
        flavor: workflow.item.name
    });
    let selection = await mba.selectTarget('Prayer of Healing', constants.okCancel, targets, true, 'multiple', undefined, false, `Choose targets you'd like to heal: (Max: 6)`);
    if (!selection.buttons) return;
    let selectedTokens = [];
    for (let i of selection.inputs) if (i) selectedTokens.push(await fromUuid(i));
    if (selectedTokens.length > 6) {
        ui.notifications.info('Too many targets selected!');
        return;
    }
    for (let target of selectedTokens) {
        new Sequence()

            .effect()
            .file("jb2a.bless.400px.intro.green")
            .attachTo(target)
            .scaleToObject(1.8)
            .playbackRate(1.5)
            .fadeOut(1000)
            .belowTokens()
            .waitUntilFinished(-2800)

            .effect()
            .file("jb2a.healing_generic.burst.bluewhite")
            .attachTo(target)
            .scaleToObject(1.75)
            .filter("ColorMatrix", { hue: 300 })

            .effect()
            .file(`jb2a.particles.outward.greenyellow.02.03`)
            .attachTo(target, { followRotation: false })
            .scaleToObject(1.1)
            .delay(600)
            .duration(1000)
            .fadeOut(800)
            .scaleIn(0, 1000, { ease: "easeOutCubic" })
            .animateProperty("sprite", "width", { from: 0, to: 0.5, duration: 500, gridUnits: true, ease: "easeOutBack" })
            .animateProperty("sprite", "height", { from: 0, to: 1.5, duration: 1000, gridUnits: true, ease: "easeOutBack" })
            .animateProperty("sprite", "position.y", { from: 0, to: -0.6, duration: 1000, gridUnits: true })
            .zIndex(0.2)

            .play();
    }
    await mba.applyWorkflowDamage(workflow.token, damageRoll, 'healing', selectedTokens, workflow.item.name, workflow.itemCardId);
}