import {mba} from "../../../helperFunctions.js";

async function attack({ speaker, actor, token, character, item, args, scope, workflow }) {
    let choices = [['Slashing', 'slashing'], ['Bludgeoning', 'bludgeoning']];
    let damageType = await mba.dialog("Crawling Claw: Damage Type", choices, "<b>Choose damage type:</b>");
    if (!damageType) damageType = "slashing";
    workflow.item.system.damage.parts[0][1] = damageType;
}

export let crawlingClaw = {
    'attack': attack
}