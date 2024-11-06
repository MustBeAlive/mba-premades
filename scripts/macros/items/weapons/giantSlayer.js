import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

export async function giantSlayer({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size || !workflow.item) return;
    let target = workflow.targets.first();
    if (mba.raceOrType(target.actor) != "giant") return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'giantSlaying', 250);
    if (!queueSetup) return;
    let oldFormula = workflow.damageRoll._formula;
    let bonusDamageFormula = `2d6[${workflow.defaultDamageType}]`;
    if (workflow.isCritical) bonusDamageFormula = mba.getCriticalFormula(bonusDamageFormula);
    let damageFormula = oldFormula + ' + ' + bonusDamageFormula;
    let damageRoll = await new Roll(damageFormula).roll({ async: true });
    await workflow.setDamageRoll(damageRoll);
    queue.remove(workflow.item.uuid);
    if (mba.findEffect(target.actor, "Prone")) return;
    if (mba.checkTrait(target.actor, "ci", "prone")) return;
    let saveRoll = await mba.rollRequest(token, "save", "str");
    if (saveRoll.total >= 15) return;
    await new Sequence()

        .effect()
        .file("jb2a.melee_attack.05.trail.03.orangered.0")
        .size(workflow.token.document.width * 3, { gridUnits: true })
        .atLocation(workflow.token)
        .spriteOffset({ x: -1 * workflow.token.document.width }, { gridUnits: true })
        .rotateTowards(target)
        .belowTokens()
        .zIndex(1)

        .animation()
        .on(target)
        .delay(100)
        .opacity(0)

        .effect()
        .from(target)
        .atLocation(target)
        .scaleToObject(target.document.texture.scaleX, { considerTokenScale: true })
        .duration(950)
        .mirrorX(target.document.data.mirrorX)
        .animateProperty("sprite", "position.y", { from: 0, to: -0.25, duration: 450, gridUnits: true, ease: "easeOutExpo", delay: 250 })
        .animateProperty("sprite", "position.y", { from: 0, to: 0.25, duration: 250, ease: "easeInOutBack", gridUnits: true, fromEnd: true })

        .effect()
        .from(target)
        .atLocation(target)
        .scaleToObject(target.document.texture.scaleX, { considerTokenScale: true })
        .duration(500)
        .belowTokens()
        .filter("ColorMatrix", { saturate: -1, brightness: 0 })
        .filter("Blur", { blurX: 5, blurY: 10 })
        .opacity(0.5)

        .effect()
        .file("animated-spell-effects-cartoon.air.puff.01")
        .atLocation(target)
        .scaleToObject(1.75)
        .delay(750)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .belowTokens()
        .opacity(0.35)

        .animation()
        .on(target)
        .delay(850)
        .opacity(1)

        .thenDo(async () => {
            mba.addCondition(target.actor, 'Prone', false, null);
        })

        .play();
}