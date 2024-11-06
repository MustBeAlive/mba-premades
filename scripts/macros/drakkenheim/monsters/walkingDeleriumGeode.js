import {contamination} from "../contamination.js";
import {mba} from "../../../helperFunctions.js";

async function slam({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    if (!workflow.failedSaves.size) return;
    await contamination.addContamination(workflow.targets.first())
}

async function deathBurstCast(token, origin) {
    let choices = [["No (explosion)", true],["Yes (no explosion)", false]];
    await mba.gmDialogMessage();
    let selection = await mba.dialog("Death Burst", choices, `<b>Was Delerium Geode killed by force, radiant or thunder damage?</b>`);
    await mba.clearGMDialogMessage();
    if (!selection) return;
    new Sequence()

        .effect()
        .file("jb2a.explosion.02.purple")
        .attachTo(token)
        .size(10.5, { gridUnits: true })
        .playbackRate(0.9)

        .thenDo(async () => {
            await origin.use();
        })

        .effect()
        .file("jb2a.explosion.07.purplepink")
        .attachTo(token)
        .size(10.5, { gridUnits: true })
        .playbackRate(0.8)
        .delay(250)

        .play()
}

async function deathBurstItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let anomalyRoll = await new Roll("1d20").roll({ 'async': true });
    await MidiQOL.displayDSNForRoll(anomalyRoll);
    ChatMessage.create({
        whisper: ChatMessage.getWhisperRecipients("GM"),
        content: `
            <p>Walking Delerium Geode's Death Burst triggers an Arcane Anomaly</p>
            <p><u>Roll Result: ${anomalyRoll.total}</u></p>
        `,
        speaker: { alias: "MBA Premades: Death Burst" }
    });
    let saveDC = workflow.item.system.save.dc;
    let targets = Array.from(workflow.targets);
    for (let i = 0; i < workflow.hitTargets.size; i++) {
        if (workflow.saveResults[i].total >= saveDC) continue;
        let target = targets[i];
        await contamination.addContamination(target);
        continue;
    }
}

export let walkingDeleriumGeode = {
    'slam': slam,
    'deathBurstCast': deathBurstCast,
    'deathBurstItem': deathBurstItem
}