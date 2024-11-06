import {mba} from "../../../helperFunctions.js";

// To do: 
// Token
// Fragile doesn't work on 'preTargetDamageApplication' or "isDamaged" hooks, find another way

async function fragile({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.isCritical) return;
}

export let terracottaWarrior = {
    'fragile': fragile
}