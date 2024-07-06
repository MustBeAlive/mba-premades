import {constants} from '../../generic/constants.js';
import {mba} from '../../../helperFunctions.js';

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    let gridSize = canvas.grid.size;
    let locations = [
        { x: template.x, y: template.y },
        { x: template.x, y: template.y - gridSize * 3 },
        { x: template.x - gridSize * 2, y: template.y - gridSize * 2 },
        { x: template.x - gridSize * 3, y: template.y },
        { x: template.x - gridSize * 2, y: template.y + gridSize * 2 },
        { x: template.x, y: template.y + gridSize * 3 },
        { x: template.x + gridSize * 2, y: template.y + gridSize * 2 },
        { x: template.x + gridSize * 3, y: template.y },
        { x: template.x + gridSize * 2, y: template.y - gridSize * 2 },
    ];

    new Sequence()

        .effect()
        .file("jb2a.cast_generic.earth.01.browngreen.1")
        .attachTo(template)
        .size(3, { gridUnits: true })

        .effect()
        .file("jb2a.plant_growth.02.ring.4x4.pulse.greenred")
        .attachTo(template)
        .size(8, { gridUnits: true })
        .belowTokens()
        .filter("ColorMatrix", { brightness: 0 })
        .playbackRate(1.5)
        .opacity(0.65)

        .effect()
        .file("jb2a.plant_growth.02.ring.4x4.pulse.greenred")
        .attachTo(template)
        .size(4, { gridUnits: true })
        .belowTokens()
        .filter("ColorMatrix", { brightness: 0 })
        .playbackRate(1.5)
        .opacity(0.65)

        .play()

    for (let i = 0; i < locations.length; i++) {
        await Sequencer.Preloader.preload('jb2a.plant_growth.02.round.4x4.loop.greenred');
        await Sequencer.Preloader.preload('jb2a.ice_spikes.radial.burst.grey');

        new Sequence()

            .effect()
            .file("jb2a.plant_growth.02.round.4x4.loop.greenred")
            .atLocation(locations[i])
            .size(3.8, { gridUnits: true })
            .delay(550)
            .fadeIn(1000)
            .fadeOut(1000)
            .randomRotation()
            .opacity(0.85)
            .zIndex(1)
            .belowTokens()
            .persist()
            .name(`Spike Growth`)

            .effect()
            .file("jb2a.ice_spikes.radial.burst.grey")
            .size(13, { gridUnits: true })
            .atLocation(locations[i], { randomOffset: 0.25 })
            .delay(30)
            .fadeIn(1000, { delay: 600 })
            .fadeOut(1000)
            .endTime(800)
            .playbackRate(4)
            .scaleIn(0, 1000, { ease: "easeOutBack" })
            .filter("Glow", { color: 0x922042, distance: 1 })
            .filter("ColorMatrix", { brightness: 0 })
            .belowTokens()
            .noLoop()
            .persist()
            .name(`Spike Growth`)

            .play()
    }
}

async function enterLeave(data, template) {
    if (canvas.scene.grid.units != 'ft') return;
    if (data.hook.animate === false) return;
    let cellDistance;
    if (canvas.scene.grid.type != 0) {
        let through = data.hook.templatemacro.through.find(tmp => tmp.templateId === template.id);
        if (!through) return;
        cellDistance = through.cells.length;
    } else {
        let token = canvas.tokens.get(data.tokenId);
        let currentTokenCenter = {
            x: data.coords.current.x + (token.w / 2),
            y: data.coords.current.y + (token.w / 2)
        };
        let previousTokenCenter = {
            x: data.coords.previous.x + (token.w / 2),
            y: data.coords.previous.y + (token.w / 2)
        };
        let intersectionPoint = quadraticIntersection(previousTokenCenter, currentTokenCenter, template.object.center, template.object.shape.radius, epsilon = 0);
        if (intersectionPoint.length === 0) return;
        let ray = new Ray(intersectionPoint[0], currentTokenCenter);
        cellDistance = (Math.ceil(ray.distance / canvas.scene.grid.size));
    }
    let scale = Math.ceil(canvas.scene.grid.distance / 5);
    let distance = cellDistance * scale;
    if (distance <= 0) return;
    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Spell Features', 'Spike Growth: Thorns', false);
    if (!featureData) return;
    let originUuid = template.flags.dnd5e?.origin;
    if (!originUuid) return;
    let originItem = await fromUuid(originUuid);
    if (!originItem) return;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': originItem.actor });
    let token = canvas.tokens.get(data.tokenId);
    if (!token) return;
    let [config, options] = constants.syntheticItemWorkflowOptions([token.document.uuid]);
    for (let i = 0; i < distance; i++) {
        if (i > 0) await (warpgate.wait(100));
        await MidiQOL.completeItemUse(feature, config, options);
    }
}

async function staying(data, template) {
    if (canvas.scene.grid.units != 'ft') return;
    if (data.hook.animate === false) return;
    let cellDistance;
    if (canvas.scene.grid.type != 0) {
        let through = data.hook.templatemacro.through.find(tmp => tmp.templateId === template.id);
        if (!through) return;
        cellDistance = through.cells.length - 1;
    } else {
        let token = canvas.tokens.get(data.tokenId);
        let currentTokenCenter = {
            x: data.coords.current.x + (token.w / 2),
            y: data.coords.current.y + (token.w / 2)
        };
        let previousTokenCenter = {
            x: data.coords.previous.x + (token.w / 2),
            y: data.coords.previous.y + (token.w / 2)
        };
        let intersectionPoint = quadraticIntersection(previousTokenCenter, currentTokenCenter, template.object.center, template.object.shape.radius, epsilon = 0);
        if (intersectionPoint.length === 0) return;
        let ray = new Ray(intersectionPoint[0], currentTokenCenter);
        cellDistance = (Math.ceil(ray.distance / canvas.scene.grid.size));
    }
    let scale = Math.ceil(canvas.scene.grid.distance / 5);
    let distance = cellDistance * scale;
    if (distance <= 0) return;
    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Spell Features', 'Spike Growth: Thorns', false);
    if (!featureData) return;
    let originUuid = template.flags.dnd5e?.origin;
    if (!originUuid) return;
    let originItem = await fromUuid(originUuid);
    if (!originItem) return;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': originItem.actor });
    let token = canvas.tokens.get(data.tokenId);
    if (!token) return;
    let [config, options] = constants.syntheticItemWorkflowOptions([token.document.uuid]);
    for (let i = 0; i < distance; i++) {
        if (i > 0) await (warpgate.wait(100));
        await MidiQOL.completeItemUse(feature, config, options);
    }
}

async function del() {
    await Sequencer.EffectManager.endEffects({ name: `Spike Growth` });
}

export let spikeGrowth = {
    'cast': cast,
    'enterLeave': enterLeave,
    'staying': staying,
    'del': del
}