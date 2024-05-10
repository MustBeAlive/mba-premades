import {mba} from "../../../helperFunctions.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let lightMap = true;
    new Sequence()

        .effect()
        .file("jb2a.energy_strands.in.red.01.2")
        .attachTo(token)
        .scaleToObject(9, { considerTokenScale: true })
        .filter("ColorMatrix", { hue: 60 })
        .randomRotation()
        .belowTokens()
        .zIndex(0.1)

        .effect()
        .file("jb2a.token_border.circle.static.blue.001")
        .attachTo(token)
        .opacity(0.6)
        .scaleToObject(2.1, { considerTokenScale: true })
        .fadeIn(500)
        .fadeOut(500)
        .duration(2500)
        .filter("ColorMatrix", { hue: 220 })
        .belowTokens()
        .zIndex(2)
        .name("Turn Undead")
        .waitUntilFinished(-500)

        .effect()
        .file(canvas.scene.background.src)
        .filter("ColorMatrix", { brightness: 1.5 })
        .atLocation({ x: (canvas.dimensions.width) / 2, y: (canvas.dimensions.height) / 2 })
        .size({ width: canvas.scene.width / canvas.grid.size, height: canvas.scene.height / canvas.grid.size }, { gridUnits: true })
        .spriteOffset({ x: -0 }, { gridUnits: true })
        .duration(7000)
        .fadeIn(500)
        .fadeOut(1000)
        .belowTokens()
        .playIf(() => {
            return lightMap == true;
        })

        .effect()
        .file(`jb2a.particles.outward.orange.01.03`)
        .attachTo(token, { offset: { y: 0.1 }, gridUnits: true, followRotation: false })
        .size(0.5 * token.document.width, { gridUnits: true })
        .duration(1000)
        .fadeOut(800)
        .scaleIn(0, 1000, { ease: "easeOutCubic" })
        .animateProperty("sprite", "width", { from: 0, to: 0.25, duration: 500, gridUnits: true, ease: "easeOutBack" })
        .animateProperty("sprite", "height", { from: 0, to: 1.0, duration: 1000, gridUnits: true, ease: "easeOutBack" })
        .animateProperty("sprite", "position.y", { from: 0, to: -0.6, duration: 1000, gridUnits: true })
        .filter("ColorMatrix", { saturate: 1, hue: 30 })
        .zIndex(0.3)

        .effect()
        .file("jb2a.impact.ground_crack.orange.01")
        .atLocation(token)
        .belowTokens()
        .filter("ColorMatrix", { hue: 20, saturate: 1 })
        .size(7, { gridUnits: true })
        .tint("#e6c419")
        .zIndex(0.1)

        .canvasPan()
        .shake({ duration: 3000, strength: 2, rotation: false, fadeOut: 3000 })

        .effect()
        .file("jb2a.token_border.circle.static.orange.004")
        .attachTo(token)
        .opacity(0.6)
        .scaleToObject(1.7, { considerTokenScale: true })
        .fadeIn(250)
        .fadeOut(500)
        .duration(2500)
        .filter("ColorMatrix", { saturate: 0.5, hue: 30 })
        .tint("#e6c419")
        .zIndex(2)
        .name("Turn Undead")

        .effect()
        .file("jb2a.markers.light_orb.loop.yellow")
        .attachTo(token)
        .scaleToObject(3, { considerTokenScale: true })
        .scaleIn(0, 1000, { ease: "easeOutBack" })
        .zIndex(3)
        .fadeOut(1000)
        .duration(10000)
        .name("Turn Undead")

        .effect()
        .file("jb2a.markers.light.loop.yellow02")
        .attachTo(token, { offset: { y: 0 }, gridUnits: true, followRotation: true })
        .size(10, { gridUnits: true })
        .scaleIn(0, 250, { ease: "easeOutBack" })
        .scaleOut(0, 3500, { ease: "easeInSine" })
        .randomRotation()
        .belowTokens()
        .zIndex(1)
        .duration(10000)
        .name("Turn Undead")

        .effect()
        .file("jb2a.extras.tmfx.outflow.circle.02")
        .attachTo(token, { offset: { y: 0 }, gridUnits: true, followRotation: true })
        .size(13, { gridUnits: true })
        .opacity(0.65)
        .scaleIn(0, 250, { ease: "easeOutBack" })
        .scaleOut(0, 3500, { ease: "easeInSine" })
        .filter("ColorMatrix", { brightness: 1 })
        .belowTokens()
        .zIndex(0.2)
        .duration(10000)
        .name("Turn Undead")

        .effect()
        .file("jb2a.extras.tmfx.outflow.circle.01")
        .attachTo(token, { offset: { y: 0 }, gridUnits: true, followRotation: true })
        .size(13, { gridUnits: true })
        .opacity(0.7)
        .scaleIn(0, 250, { ease: "easeOutBack" })
        .scaleOut(0, 3500, { ease: "easeInSine" })
        .filter("ColorMatrix", { brightness: 1 })
        .rotate(90)
        .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 20000 })
        .belowTokens()
        .zIndex(0.3)
        .duration(10000)
        .name("Turn Undead")

        .effect()
        .file("jb2a.impact.003.yellow")
        .attachTo(token, { offset: { y: 0.1 }, gridUnits: true, followRotation: true })
        .scaleToObject(1, { considerTokenScale: true })
        .zIndex(2)

        .play()

    if (workflow.targets.size === 0) return;
    let effectDataResistance = {
        'label': 'Turn Undead: Advantage',
        'icon': 'modules/mba-premades/icons/generic/generic_buff.webp',
        'changes': [
            {
                'key': 'flags.midi-qol.advantage.ability.save.wis',
                'value': '1',
                'mode': 5,
                'priority': 120
            }
        ],
        'flags': {
            'dae': {
                'transfer': false,
                'showIcon': true,
                'specialDuration': ['isSave'],
                'stackable': 'multi',
                'macroRepeat': 'none'
            }
        }
    };
    let effectDataImmunity = {
        'label': 'Turn Undead: Immunity',
        'icon': 'modules/mba-premades/icons/generic/generic_buff.webp',
        'changes': [
            {
                'key': 'flags.midi-qol.min.ability.save.wis',
                'value': '100',
                'mode': 5,
                'priority': 120
            }
        ],
        'flags': {
            'dae': {
                'transfer': false,
                'showIcon': true,
                'specialDuration': ['isSave'],
                'stackable': 'multi',
                'macroRepeat': 'none'
            }
        }
    };
    let validTargets = [];
    for (let i of Array.from(workflow.targets)) {
        if (mba.raceOrType(i.actor) != 'undead') continue;
        if (i.actor.system.attributes.hp.value === 0) continue;
        if (i.actor.flags['mba-bestiary']?.feature?.turnResistance) await mba.createEffect(i.actor, effectDataResistance);
        if (i.actor.flags['mba-bestiary']?.feature?.turnImmunity) await mba.createEffect(i.actor, effectDataImmunity);
        validTargets.push(i.id);
    }
    mba.updateTargets(validTargets);
}

async function save({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.failedSaves.size === 0) return;
    let classIdentifier = 'cleric';
    let clericLevels = workflow.actor.classes[classIdentifier]?.system?.levels;
    if (!clericLevels) return;
    let destroyLevel;
    if (clericLevels >= 17) {
        destroyLevel = 4;
    } else if (clericLevels >= 14) {
        destroyLevel = 3;
    } else if (clericLevels >= 11) {
        destroyLevel = 2;
    } else if (clericLevels >= 8) {
        destroyLevel = 1;
    } else if (clericLevels >= 5) {
        destroyLevel = 0.5;
    }
    if (!destroyLevel) return;
    let destroyTokens = [];
    for (let i of Array.from(workflow.failedSaves)) {
        let CR = i.actor.system.details?.cr;
        if (!CR) continue;
        if (CR > destroyLevel) continue;
        destroyTokens.push(i);

        new Sequence()

            .effect()
            .file('jb2a.divine_smite.target.blueyellow')
            .atLocation(i)
            .scaleToObject(3)

            .play();
    }
    if (destroyTokens.length === 0) return;
    await mba.applyDamage(destroyTokens, '10000', 'none');
}

export let turnUndead = {
    'cast': cast,
    'save': save
}