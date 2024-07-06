import {mba} from "../../../helperFunctions.js";

export async function hungryJaws({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();

    new Sequence()

        .effect()
        .file("jb2a.bite.400px.red")
        .attachTo(target)
        .scaleToObject(2)
        .missed(!workflow.hitTargets.size)

        .effect()
        .file("jaamod.sequencer_fx_master.blood_splat.red.2")
        .attachTo(target)
        .scaleToObject(2)
        .delay(200)
        .duration(4000)
        .fadeOut(2000)
        .belowTokens()
        .playIf(() => {
            return workflow.hitTargets.size
        })

        .effect()
        .file("jb2a.energy_strands.range.multiple.dark_red.01")
        .attachTo(target)
        .stretchTo(workflow.token)
        .delay(300)
        .playIf(() => {
            return workflow.hitTargets.size
        })

        .thenDo(async () => {
            if (workflow.hitTargets.size) await mba.applyDamage([workflow.token], workflow.actor.system.attributes.prof, "temphp");
        })

        .play()
}