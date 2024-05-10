import {queue} from "../../mechanics/queue.js";

export async function tollTheDead({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.targets.size != 1) return;
    let target = workflow.targets.first();

    new Sequence()

        .effect()
        .file("jb2a.toll_the_dead.purple.bell")
        .attachTo(target)
        .scaleToObject(1.3 * target.document.texture.scaleX)
        .fadeIn(500)
        .playbackRate(0.85)
        .waitUntilFinished(-300)

        .effect()
        .file("jb2a.toll_the_dead.purple.shockwave")
        .attachTo(target)
        .scaleToObject(1.7 * target.document.texture.scaleX)
        .playIf(() => {
            return workflow.failedSaves.size
        })

        .play()

    let queueSetup = await queue.setup(workflow.item.uuid, 'tollTheDead', 50);
    if (!queueSetup) return;
    if (target.actor.system.attributes.hp.value === target.actor.system.attributes.hp.max) {
        queue.remove(workflow.item.uuid);
        return;
    }
    let damageFormula = workflow.damageRoll._formula.replace('d8', 'd12');
    let damageRoll = await new Roll(damageFormula).roll({ async: true });
    await workflow.setDamageRoll(damageRoll);
    queue.remove(workflow.item.uuid);
}