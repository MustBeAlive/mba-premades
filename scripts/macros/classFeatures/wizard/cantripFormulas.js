import {mba} from "../../../helperFunctions.js";

export async function cantripFormulas({ speaker, actor, token, character, item, args, scope, workflow }) {
    //all wizard cantrips
    let wizardCantrips = [
        'Acid Splash',
        'Blade Ward',
        'Booming Blade',
        'Chill Touch',
        'Control Flames',
        'Create Bonfire',
        'Dancing Lights',
        'Fire Bolt',
        'Friends',
        'Frostbite',
        'Green-Flame Blade',
        'Gust',
        'Infestation',
        'Light',
        'Lightning Lure',
        'Mage Hand',
        'Mending',
        'Message',
        'Mind Sliver',
        'Minor Illusion',
        'Mold Earth',
        'Poison Spray',
        'Prestidigitation',
        'Ray of Frost',
        'Shape Water',
        'Shocking Grasp',
        'Sword Burst',
        'Thunderclap',
        'Toll the Dead',
        'True Strike'
    ];

    //current actor wizard cantrips, sorted by name
    let actorCantrips = workflow.actor.items.filter(i => i.type === "spell" && i.system?.level === 0 && wizardCantrips.includes(i.name)).sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));

    //filtered list w/o already exsisting cantrips
    let filtered = wizardCantrips.filter(i => !actorCantrips.map(i => i.name).sort().includes(i));
    let newCantrips = []
    for (let name of filtered) {
        let cantrip = await mba.getItemFromCompendium('mba-premades.MBA Spells', name, false);
        newCantrips.push(cantrip);
    }

    let [toDelete] = await mba.selectDocument("Choose cantrip to delete:", actorCantrips);
    if (!toDelete) return;
    let [toCreate] = await mba.selectDocument("Choose cantrip to create:", newCantrips);
    if (!toCreate) return;

    await workflow.actor.deleteEmbeddedDocuments("Item", [toDelete._id]);
    await workflow.actor.createEmbeddedDocuments("Item", [toCreate]);
}