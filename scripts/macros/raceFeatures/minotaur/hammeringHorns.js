import { mba } from "../../../helperFunctions.js";

async function check({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    if (mba.getSize(target.actor) > (mba.getSize(workflow.actor) + 1)) {
        ui.notifications.info('Target is too big to push!');
        return false;
    }
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let choices = [["5 feet", 5], ["10 feet", 10]];
    let selection = await mba.dialog("Hammering Horns", choices, "<b>How far would you like to push the target?</b>");
    if (!selection) return;
    let target = workflow.targets.first();
    new Sequence()

        .effect()
        .file("jb2a.melee_attack.03.trail.02.orangered.0")
        .atLocation(workflow.token)
        .rotateTowards(target)
        .size(3 * workflow.token.document.width, { gridUnits: true })
        .spriteOffset({ x: -1 * workflow.token.document.width }, { gridUnits: true })
        .zIndex(2)

        .effect()
        .file("jb2a.impact.ground_crack.orange.03")
        .atLocation(target)
        .rotateTowards(target)
        .size(target.document.width * 2.15, { gridUnits: true })
        .delay(400)
        .spriteOffset({ x: -0.75 }, { gridUnits: true })
        .belowTokens()
        .mirrorX()
        .filter("ColorMatrix", { hue: -17, saturate: 1 })

        .canvasPan()
        .delay(400)
        .shake({ duration: 250, strength: 2, rotation: false })

        .wait(700)

        .thenDo(async () => {
            await mba.pushToken(workflow.token, target, selection);
        })

        .play()
}

export let hammeringHorns = {
    'check': check,
    'item': item
}