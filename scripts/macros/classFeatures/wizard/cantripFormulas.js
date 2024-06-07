import {mba} from "../../../helperFunctions.js";

export async function cantripFormulas({ speaker, actor, token, character, item, args, scope, workflow }) {

    new Sequence()

        .effect()
        .file("jb2a.icosahedron.rune.below.blueyellow")
        .attachTo(workflow.token)
        .scaleToObject(2.25 * token.document.texture.scaleX)
        .fadeIn(1000)
        .fadeOut(2000)
        .scaleIn(0, 600, { 'ease': 'easeOutCubic' })
        .rotateIn(180, 600, { 'ease': 'easeOutCubic' })
        .loopProperty('sprite', 'rotation', { 'from': 0, 'to': -360, 'duration': 10000 })
        .filter("ColorMatrix", { hue: 150 })
        .belowTokens()
        .zIndex(0)
        .persist()
        .name(`${workflow.token.document.name} Cantrip Formulas`)

        .effect()
        .file("jb2a.icosahedron.rune.below.blueyellow")
        .attachTo(workflow.token)
        .scaleToObject(2.25 * token.document.texture.scaleX)
        .duration(1200)
        .fadeIn(200, { 'ease': 'easeOutCirc', 'delay': 500 })
        .fadeOut(300, { 'ease': 'linear' })
        .scaleIn(0, 600, { 'ease': 'easeOutCubic' })
        .rotateIn(180, 600, { 'ease': 'easeOutCubic' })
        .loopProperty('sprite', 'rotation', { 'from': 0, 'to': -360, 'duration': 10000 })
        .belowTokens(true)
        .filter('ColorMatrix', { 'hue': 150 })
        .zIndex(1)
        .persist()
        .name(`${workflow.token.document.name} Cantrip Formulas`)

        .play();

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

    let feature = await mba.getItem(workflow.actor, "Cantrip Formulas");
    if (!feature) {
        ui.notifications.warn("Unable to find feature! (Cantrip Formulas)");
        return;
    }
    let uses = feature.system.uses.value;

    //current actor wizard cantrips, sorted by name
    let actorCantrips = workflow.actor.items.filter(i => i.type === "spell" && i.system?.level === 0 && wizardCantrips.includes(i.name)).sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));

    //filtered list w/o already exsisting cantrips
    let filtered = wizardCantrips.filter(i => !actorCantrips.map(i => i.name).sort().includes(i));
    let newCantrips = []
    for (let name of filtered) {
        let cantrip = await mba.getItemFromCompendium('mba-premades.MBA Spells', name, false);
        newCantrips.push(cantrip);
    }

    let toDelete = await mba.selectDocument("Choose cantrip to delete:", actorCantrips);
    if (!toDelete.length) {
        Sequencer.EffectManager.endEffects({ 'name': `${workflow.token.document.name} Cantrip Formulas`, 'object': workflow.token });
        if (uses < 1) await feature.update({ "system.uses.value": 1 })
        return;
    }
    let toCreate = await mba.selectDocument("Choose cantrip to create:", newCantrips);
    if (!toCreate.length) {
        Sequencer.EffectManager.endEffects({ 'name': `${workflow.token.document.name} Cantrip Formulas`, 'object': workflow.token });
        if (uses < 1) await feature.update({ "system.uses.value": 1 })
        return;
    }

    new Sequence()

        .effect()
        .file("jb2a.particle_burst.01.circle.bluepurple")
        .attachTo(workflow.token)
        .scaleToObject(2 * token.document.texture.scaleX)
        .fadeIn(1000)
        .filter("ColorMatrix", { hue: 330 })
        .playbackRate(0.9)

        .wait(500)

        .thenDo(async () => {
            await workflow.actor.deleteEmbeddedDocuments("Item", [toDelete[0]._id]);
            await workflow.actor.createEmbeddedDocuments("Item", [toCreate[0]]);
            await ChatMessage.create({
                flavor: `<h2>Cantrip Formulas</h2>Swapped <b><u>${toDelete[0].name}</u></b> for <b><u>${toCreate[0].name}</u></b>`,
                speaker: ChatMessage.getSpeaker({ actor: workflow.actor })
            });
            await Sequencer.EffectManager.endEffects({ 'name': `${workflow.token.document.name} Cantrip Formulas`, 'object': workflow.token });
        })

        .play()
}