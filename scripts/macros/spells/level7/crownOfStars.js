export async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let featureData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Spell Features', 'Crown of Stars: Send Mote', false);
    if (!featureData) return;
    let ammount = 7;
    let level = workflow.castData.castLevel;
    if (level === 8) ammount = 9;
    if (level === 9) ammount = 11;
    featureData.system.uses.value = ammount;
    featureData.system.uses.max = ammount;
    const moteFile = "jb2a.twinkling_stars.points09.white";
    async function effectMacroDel() {
        await Sequencer.EffectManager.endEffects({ name: `${token.document.name} Crown of Stars Mote`, object: token })
        await warpgate.revert(token.document, 'Crown of Stars: Send Mote');
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Seven star-like motes of light appear and orbit your head until the spell ends. You can use a bonus action to send one of the motes streaking toward one creature or object within 120 feet of you. When you do so, make a ranged spell attack. On a hit, the target takes 4d12 radiant damage. Whether you hit or miss, the mote is expended. The spell ends early if you expend the last mote.</p>
            <p>If you have four or more motes remaining, they shed bright light in a 30-foot radius and dim light for an additional 30 feet. If you have one to three motes remaining, they shed dim light in a 30-foot radius.</p>
        `,
        'duration': {
            'seconds': 3600
        },
        'changes': [
            {
                'key': 'ATL.light.dim',
                'mode': 2,
                'value': 60,
                'priority': 20
            },
            {
                'key': 'ATL.light.bright',
                'mode': 2,
                'value': 30,
                'priority': 20
            },
            {
                'key': 'ATL.light.animation',
                'mode': 4,
                'value': `{intensity: 5, reverse: false, speed: 2, type: "sunburst"}`,
                'priority': 20
            },
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': chrisPremades.helpers.functionToString(effectMacroDel)
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 7,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    let updates = {
        'embedded': {
            'Item': {
                [featureData.name]: featureData
            },
            'ActiveEffect': {
                [workflow.item.name]: effectData
            }
        }
    };
    let options = {
        'permanent': false,
        'name': featureData.name,
        'description': featureData.name
    };
    if (ammount === 7) {
        const moteScale = 0.5
        let starsSequence = new Sequence()

            .effect()
            .file(moteFile)
            .from(token, { cacheLocation: true })
            .attachTo(token)
            .scale(moteScale)
            .fadeIn(300)
            .fadeOut(500)
            .aboveLighting()
            .persist()
            .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 5000, delay: 500 })
            .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: 4000 })
            .spriteOffset({ x: 0.5 }, { gridUnits: true })
            .rotate((360 / ammount) * 1)
            .name(`${token.document.name} Crown of Stars Mote 1`)

            .effect()
            .file(moteFile)
            .from(token, { cacheLocation: true })
            .attachTo(token)
            .scale(moteScale)
            .fadeIn(300)
            .fadeOut(500)
            .aboveLighting()
            .persist()
            .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 5000, delay: 500 })
            .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: 4000 })
            .spriteOffset({ x: 0.5 }, { gridUnits: true })
            .rotate((360 / ammount) * 2)
            .name(`${token.document.name} Crown of Stars Mote 2`)

            .effect()
            .file(moteFile)
            .from(token, { cacheLocation: true })
            .attachTo(token)
            .scale(moteScale)
            .fadeIn(300)
            .fadeOut(500)
            .aboveLighting()
            .persist()
            .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 5000, delay: 500 })
            .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: 4000 })
            .spriteOffset({ x: 0.5 }, { gridUnits: true })
            .rotate((360 / ammount) * 3)
            .name(`${token.document.name} Crown of Stars Mote 3`)

            .effect()
            .file(moteFile)
            .from(token, { cacheLocation: true })
            .attachTo(token)
            .scale(moteScale)
            .fadeIn(300)
            .fadeOut(500)
            .aboveLighting()
            .persist()
            .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 5000, delay: 500 })
            .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: 4000 })
            .spriteOffset({ x: 0.5 }, { gridUnits: true })
            .rotate((360 / ammount) * 4)
            .name(`${token.document.name} Crown of Stars Mote 4`)

            .effect()
            .file(moteFile)
            .from(token, { cacheLocation: true })
            .attachTo(token)
            .scale(moteScale)
            .fadeIn(300)
            .fadeOut(500)
            .aboveLighting()
            .persist()
            .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 5000, delay: 500 })
            .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: 4000 })
            .spriteOffset({ x: 0.5 }, { gridUnits: true })
            .rotate((360 / ammount) * 5)
            .name(`${token.document.name} Crown of Stars Mote 5`)

            .effect()
            .file(moteFile)
            .from(token, { cacheLocation: true })
            .attachTo(token)
            .scale(moteScale)
            .fadeIn(300)
            .fadeOut(500)
            .aboveLighting()
            .persist()
            .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 5000, delay: 500 })
            .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: 4000 })
            .spriteOffset({ x: 0.5 }, { gridUnits: true })
            .rotate((360 / ammount) * 6)
            .name(`${token.document.name} Crown of Stars Mote 6`)

            .effect()
            .file(moteFile)
            .from(token, { cacheLocation: true })
            .attachTo(token)
            .scale(moteScale)
            .fadeIn(300)
            .fadeOut(500)
            .aboveLighting()
            .persist()
            .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 5000, delay: 500 })
            .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: 4000 })
            .spriteOffset({ x: 0.5 }, { gridUnits: true })
            .rotate((360 / ammount) * 7)
            .name(`${token.document.name} Crown of Stars Mote 7`)

        starsSequence.play();
    };
    if (ammount === 9) {
        const moteScale = 0.45
        let starsSequence = new Sequence()

            .effect()
            .file(moteFile)
            .from(token, { cacheLocation: true })
            .attachTo(token)
            .scale(moteScale)
            .fadeIn(300)
            .fadeOut(500)
            .aboveLighting()
            .persist()
            .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 5000, delay: 500 })
            .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: 4000 })
            .spriteOffset({ x: 0.5 }, { gridUnits: true })
            .rotate((360 / ammount) * 1)
            .name(`${token.document.name} Crown of Stars Mote 1`)

            .effect()
            .file(moteFile)
            .from(token, { cacheLocation: true })
            .attachTo(token)
            .scale(moteScale)
            .fadeIn(300)
            .fadeOut(500)
            .aboveLighting()
            .persist()
            .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 5000, delay: 500 })
            .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: 4000 })
            .spriteOffset({ x: 0.5 }, { gridUnits: true })
            .rotate((360 / ammount) * 2)
            .name(`${token.document.name} Crown of Stars Mote 2`)

            .effect()
            .file(moteFile)
            .from(token, { cacheLocation: true })
            .attachTo(token)
            .scale(moteScale)
            .fadeIn(300)
            .fadeOut(500)
            .aboveLighting()
            .persist()
            .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 5000, delay: 500 })
            .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: 4000 })
            .spriteOffset({ x: 0.5 }, { gridUnits: true })
            .rotate((360 / ammount) * 3)
            .name(`${token.document.name} Crown of Stars Mote 3`)

            .effect()
            .file(moteFile)
            .from(token, { cacheLocation: true })
            .attachTo(token)
            .scale(moteScale)
            .fadeIn(300)
            .fadeOut(500)
            .aboveLighting()
            .persist()
            .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 5000, delay: 500 })
            .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: 4000 })
            .spriteOffset({ x: 0.5 }, { gridUnits: true })
            .rotate((360 / ammount) * 4)
            .name(`${token.document.name} Crown of Stars Mote 4`)

            .effect()
            .file(moteFile)
            .from(token, { cacheLocation: true })
            .attachTo(token)
            .scale(moteScale)
            .fadeIn(300)
            .fadeOut(500)
            .aboveLighting()
            .persist()
            .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 5000, delay: 500 })
            .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: 4000 })
            .spriteOffset({ x: 0.5 }, { gridUnits: true })
            .rotate((360 / ammount) * 5)
            .name(`${token.document.name} Crown of Stars Mote 5`)

            .effect()
            .file(moteFile)
            .from(token, { cacheLocation: true })
            .attachTo(token)
            .scale(moteScale)
            .fadeIn(300)
            .fadeOut(500)
            .aboveLighting()
            .persist()
            .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 5000, delay: 500 })
            .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: 4000 })
            .spriteOffset({ x: 0.5 }, { gridUnits: true })
            .rotate((360 / ammount) * 6)
            .name(`${token.document.name} Crown of Stars Mote 6`)

            .effect()
            .file(moteFile)
            .from(token, { cacheLocation: true })
            .attachTo(token)
            .scale(moteScale)
            .fadeIn(300)
            .fadeOut(500)
            .aboveLighting()
            .persist()
            .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 5000, delay: 500 })
            .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: 4000 })
            .spriteOffset({ x: 0.5 }, { gridUnits: true })
            .rotate((360 / ammount) * 7)
            .name(`${token.document.name} Crown of Stars Mote 7`)

            .effect()
            .file(moteFile)
            .from(token, { cacheLocation: true })
            .attachTo(token)
            .scale(moteScale)
            .fadeIn(300)
            .fadeOut(500)
            .aboveLighting()
            .persist()
            .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 5000, delay: 500 })
            .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: 4000 })
            .spriteOffset({ x: 0.5 }, { gridUnits: true })
            .rotate((360 / ammount) * 8)
            .name(`${token.document.name} Crown of Stars Mote 8`)

            .effect()
            .file(moteFile)
            .from(token, { cacheLocation: true })
            .attachTo(token)
            .scale(moteScale)
            .fadeIn(300)
            .fadeOut(500)
            .aboveLighting()
            .persist()
            .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 5000, delay: 500 })
            .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: 4000 })
            .spriteOffset({ x: 0.5 }, { gridUnits: true })
            .rotate((360 / ammount) * 9)
            .name(`${token.document.name} Crown of Stars Mote 9`)

        starsSequence.play();
    };
    if (ammount === 11) {
        const moteScale = 0.4
        let starsSequence = new Sequence()

            .effect()
            .file(moteFile)
            .from(token, { cacheLocation: true })
            .attachTo(token)
            .scale(moteScale)
            .fadeIn(300)
            .fadeOut(500)
            .aboveLighting()
            .persist()
            .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 5000, delay: 500 })
            .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: 4000 })
            .spriteOffset({ x: 0.5 }, { gridUnits: true })
            .rotate((360 / ammount) * 1)
            .name(`${token.document.name} Crown of Stars Mote 1`)

            .effect()
            .file(moteFile)
            .from(token, { cacheLocation: true })
            .attachTo(token)
            .scale(moteScale)
            .fadeIn(300)
            .fadeOut(500)
            .aboveLighting()
            .persist()
            .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 5000, delay: 500 })
            .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: 4000 })
            .spriteOffset({ x: 0.5 }, { gridUnits: true })
            .rotate((360 / ammount) * 2)
            .name(`${token.document.name} Crown of Stars Mote 2`)

            .effect()
            .file(moteFile)
            .from(token, { cacheLocation: true })
            .attachTo(token)
            .scale(moteScale)
            .fadeIn(300)
            .fadeOut(500)
            .aboveLighting()
            .persist()
            .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 5000, delay: 500 })
            .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: 4000 })
            .spriteOffset({ x: 0.5 }, { gridUnits: true })
            .rotate((360 / ammount) * 3)
            .name(`${token.document.name} Crown of Stars Mote 3`)

            .effect()
            .file(moteFile)
            .from(token, { cacheLocation: true })
            .attachTo(token)
            .scale(moteScale)
            .fadeIn(300)
            .fadeOut(500)
            .aboveLighting()
            .persist()
            .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 5000, delay: 500 })
            .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: 4000 })
            .spriteOffset({ x: 0.5 }, { gridUnits: true })
            .rotate((360 / ammount) * 4)
            .name(`${token.document.name} Crown of Stars Mote 4`)

            .effect()
            .file(moteFile)
            .from(token, { cacheLocation: true })
            .attachTo(token)
            .scale(moteScale)
            .fadeIn(300)
            .fadeOut(500)
            .aboveLighting()
            .persist()
            .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 5000, delay: 500 })
            .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: 4000 })
            .spriteOffset({ x: 0.5 }, { gridUnits: true })
            .rotate((360 / ammount) * 5)
            .name(`${token.document.name} Crown of Stars Mote 5`)

            .effect()
            .file(moteFile)
            .from(token, { cacheLocation: true })
            .attachTo(token)
            .scale(moteScale)
            .fadeIn(300)
            .fadeOut(500)
            .aboveLighting()
            .persist()
            .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 5000, delay: 500 })
            .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: 4000 })
            .spriteOffset({ x: 0.5 }, { gridUnits: true })
            .rotate((360 / ammount) * 6)
            .name(`${token.document.name} Crown of Stars Mote 6`)

            .effect()
            .file(moteFile)
            .from(token, { cacheLocation: true })
            .attachTo(token)
            .scale(moteScale)
            .fadeIn(300)
            .fadeOut(500)
            .aboveLighting()
            .persist()
            .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 5000, delay: 500 })
            .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: 4000 })
            .spriteOffset({ x: 0.5 }, { gridUnits: true })
            .rotate((360 / ammount) * 7)
            .name(`${token.document.name} Crown of Stars Mote 7`)

            .effect()
            .file(moteFile)
            .from(token, { cacheLocation: true })
            .attachTo(token)
            .scale(moteScale)
            .fadeIn(300)
            .fadeOut(500)
            .aboveLighting()
            .persist()
            .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 5000, delay: 500 })
            .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: 4000 })
            .spriteOffset({ x: 0.5 }, { gridUnits: true })
            .rotate((360 / ammount) * 8)
            .name(`${token.document.name} Crown of Stars Mote 8`)

            .effect()
            .file(moteFile)
            .from(token, { cacheLocation: true })
            .attachTo(token)
            .scale(moteScale)
            .fadeIn(300)
            .fadeOut(500)
            .aboveLighting()
            .persist()
            .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 5000, delay: 500 })
            .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: 4000 })
            .spriteOffset({ x: 0.5 }, { gridUnits: true })
            .rotate((360 / ammount) * 9)
            .name(`${token.document.name} Crown of Stars Mote 9`)

            .effect()
            .file(moteFile)
            .from(token, { cacheLocation: true })
            .attachTo(token)
            .scale(moteScale)
            .fadeIn(300)
            .fadeOut(500)
            .aboveLighting()
            .persist()
            .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 5000, delay: 500 })
            .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: 4000 })
            .spriteOffset({ x: 0.5 }, { gridUnits: true })
            .rotate((360 / ammount) * 10)
            .name(`${token.document.name} Crown of Stars Mote 10`)

            .effect()
            .file(moteFile)
            .from(token, { cacheLocation: true })
            .attachTo(token)
            .scale(moteScale)
            .fadeIn(300)
            .fadeOut(500)
            .aboveLighting()
            .persist()
            .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 5000, delay: 500 })
            .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: 4000 })
            .spriteOffset({ x: 0.5 }, { gridUnits: true })
            .rotate((360 / ammount) * 11)
            .name(`${token.document.name} Crown of Stars Mote 11`)

        starsSequence.play();
    }
    await warpgate.mutate(workflow.token.document, updates, {}, options);
}

async function miss({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    if (workflow.hitTargets.size) return;
    let offsetX = Math.floor(Math.random() * (Math.floor(2) - Math.ceil(0) + 1) + Math.ceil(0));
    let offsetY = Math.floor(Math.random() * (Math.floor(2) - Math.ceil(0) + 1) + Math.ceil(0));

    await new Sequence()

        .effect()
        .file("jb2a.scorching_ray.blue.01")
        .atLocation(token)
        .stretchTo(target, { offset: { x: offsetX, y: offsetY }, gridUnits: true })
        .filter("ColorMatrix", { saturate: -1, brightness: 1 })
        .repeats(3, 600, 600)

        .play();
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.hitTargets.size) {
        let target = workflow.targets.first();
        await new Sequence()

            .effect()
            .file("jb2a.scorching_ray.blue.01")
            .atLocation(token)
            .stretchTo(target)
            .filter("ColorMatrix", { saturate: -1, brightness: 1 })
            .repeats(3, 600, 600)

            .play();
    }
    let crownFeature = actor.items.find(i => i.name === 'Crown of Stars: Send Mote');
    let moteNumber = crownFeature.system.uses.value + 1;
    await Sequencer.EffectManager.endEffects({ name: `${token.document.name} Crown of Stars Mote ${moteNumber}`, object: token })
    if (crownFeature.system.uses.value >= 4) return;
    let crownEffect = chrisPremades.helpers.findEffect(actor, 'Crown of Stars');
    let dimLightValue = +crownEffect.changes[0].value;
    if (dimLightValue === 30) return;
    let updates = {
        'changes': [
            {
                'key': 'ATL.light.dim',
                'mode': 2,
                'value': 30,
                'priority': 20
            },
            {
                'key': 'ATL.light.animation',
                'mode': 4,
                'value': `{intensity: 5, reverse: false, speed: 1, type: "sunburst"}`,
                'priority': 20
            }
        ]
    };
    await chrisPremades.helpers.updateEffect(crownEffect, updates);
}

export let crownOfStars = {
    'cast': cast,
    'miss': miss,
    'item': item
}