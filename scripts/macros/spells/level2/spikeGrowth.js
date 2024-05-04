import { mba } from '../../../helperFunctions.js';
import { constants } from '../../generic/constants.js';

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);

    new Sequence()

        .wait(1000)

        .effect()
        .file(`jb2a.magic_signs.circle.02.conjuration.complete.dark_blue`)
        .atLocation(template)
        .size(8, { gridUnits: true })
        .fadeIn(600)
        .rotateIn(180, 600, { ease: "easeOutCubic" })
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .opacity(0.66)
        .belowTokens()
        .zIndex(1)
        .name(`Spike Growth 1`)
        .persist()

        .effect()
        .file("jb2a.plant_growth.01.ring.4x4.pulse.bluepurple")
        .atLocation(template)
        .size(7.6, { gridUnits: true })
        .delay(500)
        .fadeIn(500)
        .fadeOut(500)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .randomRotation()
        .belowTokens()
        .zIndex(2)

        .effect()
        .file("jb2a.swirling_leaves.outburst.01.bluepurple")
        .atLocation(token)
        .size(3.5, { gridUnits: true })
        .delay(500)
        .duration(1000)
        .fadeOut(1000)
        .scaleIn(0, 500, { ease: "easeOutQuint" })
        .animateProperty("spriteContainer", "position.y", { from: 0, to: -0.15, gridUnits: true, duration: 1000 })
        .zIndex(1)

        .effect()
        .file("jb2a.plant_growth.01.square.4x4.loop.bluepurple")
        .atLocation(template)
        .size(7.9, { gridUnits: true })
        .delay(1000)
        .fadeIn(2000)
        .fadeOut(500)
        .opacity(0.95)
        .shape("circle", {
            lineSize: 4,
            lineColor: "#FF0000",
            fillColor: "#FF0000",
            radius: 1.5,
            gridUnits: true,
            name: "sg2",
            isMask: true
        })
        .belowTokens()
        .zIndex(1.5)
        .name(`Spike Growth 2`)
        .persist()

        .effect()
        .file("jb2a.plant_growth.01.square.4x4.loop.bluepurple")
        .atLocation(template)
        .size(7.9, { gridUnits: true })
        .delay(1000)
        .fadeIn(2000)
        .fadeOut(500)
        .opacity(0.85)
        .shape("circle", {
            lineSize: 4,
            lineColor: "#FF0000",
            fillColor: "#FF0000",
            radius: 3.1,
            gridUnits: true,
            name: "sg3",
            isMask: true
        })
        .belowTokens()
        .zIndex(1.3)
        .name(`Spike Growth 3`)
        .persist()

        .effect()
        .file("jb2a.plant_growth.01.square.4x4.loop.bluepurple")
        .atLocation(template)
        .size(7.9, { gridUnits: true })
        .delay(1000)
        .fadeIn(2000)
        .fadeOut(500)
        .opacity(0.75)
        .shape("circle", {
            lineSize: 4,
            lineColor: "#FF0000",
            fillColor: "#FF0000",
            radius: 4.1,
            gridUnits: true,
            name: "sg4",
            isMask: true
        })
        .belowTokens()
        .zIndex(1.2)
        .name(`Spike Growth 4`)
        .persist()

        .play()
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
    await Sequencer.EffectManager.endEffects({ name: "Spike Growth" })
}

export let spikeGrowth = {
    'cast': cast,
    'enterLeave': enterLeave,
    'staying': staying,
    'del': del
}