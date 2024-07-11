import {mba} from "../../../helperFunctions.js";

async function spear({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let target = workflow.targets.first();
    if (mba.getSize(target.actor) > 2) return;
    if (mba.checkTrait(target.actor, "ci", "prone")) return;
    if (mba.findEffect(target.actor, "Prone")) return;
    await mba.gmDialogMessage();
    let choices = [["Deal damage", false], ["Knock Prone", "prone"]];
    let selection = await mba.dialog("Derro: Spear", choices, "<b>What would you like to do?</b>");
    await mba.clearGMDialogMessage();
    if (!selection) return;
    let dItem = workflow.damageItem;
    dItem.appliedDamage = 0;
    dItem.hpDamage = 0;
    dItem.totalDamage = 0;
    dItem.newHP = dItem.oldHP;
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
        .opacity(0)
        .delay(100)

        .effect()
        .from(target)
        .atLocation(target)
        .mirrorX(target.document.data.mirrorX)
        .animateProperty("sprite", "position.y", { from: 0, to: -0.25, duration: 450, gridUnits: true, ease: "easeOutExpo", delay: 250 })
        .animateProperty("sprite", "position.y", { from: 0, to: 0.25, duration: 250, ease: "easeInOutBack", gridUnits: true, fromEnd: true })
        .scaleToObject(target.document.texture.scaleX, { considerTokenScale: true })
        .duration(950)

        .effect()
        .from(target)
        .atLocation(target)
        .scaleToObject(target.document.texture.scaleX, { considerTokenScale: true })
        .belowTokens()
        .filter("ColorMatrix", { saturate: -1, brightness: 0 })
        .filter("Blur", { blurX: 5, blurY: 10 })
        .opacity(0.5)
        .duration(500)

        .effect()
        .atLocation(target)
        .file("animated-spell-effects-cartoon.air.puff.01")
        .scaleToObject(1.75)
        .belowTokens()
        .opacity(0.35)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .delay(750)

        .animation()
        .on(target)
        .opacity(1)
        .delay(850)

        .thenDo(async () => {
            await mba.addCondition(target.actor, 'Prone', false, null);
        })

        .play();
}

export let derro = {
    'spear': spear
}