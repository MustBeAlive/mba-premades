import {contamination} from "../contamination.js";

async function deathBurstCast(token, origin) {
    new Sequence()

        .effect()
        .file("jb2a.explosion.02.purple")
        .attachTo(token)
        .size(4.5, { gridUnits: true })
        .playbackRate(0.9)

        .thenDo(async () => {
            await origin.use();
        })

        .effect()
        .file("jb2a.explosion.07.purplepink")
        .attachTo(token)
        .size(4.5, { gridUnits: true })
        .playbackRate(0.8)
        .delay(250)

        .play()
}

async function deathBurstItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let saveDC = workflow.item.system.save.dc;
    let targets = Array.from(workflow.targets);
    for (let i = 0; i < workflow.hitTargets.size; i++) {
        if ((workflow.saveResults[i].total + 5) >= saveDC) continue;
        let target = targets[i];
        await contamination.addContamination(target);
        continue;
    }
}

export let hazeHusk = {
    'deathBurstCast': deathBurstCast,
    'deathBurstItem': deathBurstItem
}