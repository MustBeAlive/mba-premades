import {contamination} from "../contamination.js";

async function bite({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    if (!workflow.failedSaves.size) return;
    await contamination.addContamination(workflow.targets.first())
}

export let ratPrince = {
    'bite': bite
}