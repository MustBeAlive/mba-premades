import {mba} from "../../../helperFunctions.js";

export async function astralKnowledge({ speaker, actor, token, character, item, args, scope, workflow }) {
    let oldEffect = await mba.findEffect(workflow.actor, "Astral Knowledge");
    if (oldEffect) await mba.removeEffect(oldEffect);
    let options = Object.entries(CONFIG.DND5E.skills).filter(([key, value]) => workflow.actor.system.skills[key].value < 1).map(([i, j]) => ({ 'value': i, 'html': j.label }));
    let choicesSkill = [];
    for (let i = 0; i < options.length; i++) choicesSkill.push([options[i].html, options[i].value]);
    let selectionSkill = await mba.dialog("Astral Knowledge", choicesSkill, "Choose one of the skills:");
    if (!selectionSkill) return;
    let tools = {
        "alchemist": "Alchemist's Supplies",
        "brewer": "Brewer's Supplies",
        "calligrapher": "Calligrapher's Supplies",
        "carpenter": "Carpenter's Tools",
        "cartographer": "Cartographer's Tools",
        "cobbler": "Cobbler's Tools",
        "cook": "Cook's Utensils",
        "glassblower": "Glassblower's Tools",
        "jeweler": "Jeweler's Tools",
        "leatherworker": "Leatherworker's Tools",
        "mason": "Mason's Tools",
        "painter": "Painter's Supplies",
        "potter": "Potter's Tools",
        "smith": "Smith's Tools",
        "tinker": "Tinker's Tools",
        "weaver": "Weaver's Tools",
        "woodcarver": "Woodcarver's Tools",
        "disg": "Disguise Kit",
        "forg": "Forgery Kit",
        "herb": "Herbalism Kit",
        "navg": "Navigator's Tools",
        "pois": "Poisoner's Kit",
        "thief": "Thieves' Tools"
    };




    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': "For the next hour, you are proficient in one skill of your choosing.",
        'changes': [
            {
                'key': `system.skills.${selectionSkill}.value`,
                'mode': 4,
                'value': 1,
                'priority': 20
            }
        ],
    };
    await mba.createEffect(workflow.actor, effectData);
}