import {mba} from "../../../helperFunctions.js";

// To do: better icon

export async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Crown of Stars: Send Mote", false);
    if (!featureData) return;
    delete featureData._id;
    let ammount = 7;
    if (workflow.castData.castLevel === 8) ammount = 9;
    else if (workflow.castData.castLevel === 9) ammount = 11;
    featureData.system.uses.value = ammount;
    featureData.system.uses.max = ammount;
    const moteFile = "jb2a.twinkling_stars.points09.white";
    await Sequencer.Preloader.preloadForClients(moteFile);
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} CrOfSM` });
        await warpgate.revert(token.document, "Crown of Stars");
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Seven star-like motes of light appear and orbit your head until the spell ends.</p>
            <p>You can use a bonus action to send one of the motes streaking toward one creature or object within 120 feet of you. When you do so, make a ranged spell attack.</p>
            <p>On a hit, the target takes 4d12 radiant damage. Whether you hit or miss, the mote is expended. The spell ends early if you expend the last mote.</p>
            <p>If you have four or more motes remaining, they shed bright light in a 30-foot radius and dim light for an additional 30 feet.</p>
            <p>If you have one to three motes remaining, they shed dim light in a 30-foot radius.</p>
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
                'key': 'ATL.light.alpha',
                'mode': 5,
                'value': "0.25",
                'priority': 20
            },
            {
                'key': 'ATL.light.angle',
                'mode': 5,
                'value': "360",
                'priority': 20
            },
            {
                'key': 'ATL.light.luminosity',
                'mode': 5,
                'value': "0.5",
                'priority': 20
            },
            {
                'key': 'ATL.light.animation',
                'mode': 4,
                'value': `{intensity: 5, reverse: false, speed: 2, type: "sunburst"}`,
                'priority': 20
            },
            {
                'key': 'ATL.light.attenuation',
                'mode': 5,
                'value': "0.8",
                'priority': 20
            },
            {
                'key': 'ATL.light.contrast',
                'mode': 5,
                'value': "0.15",
                'priority': 20
            },
            {
                'key': 'ATL.light.shadows',
                'mode': 5,
                'value': "0.2",
                'priority': 20
            }
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
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
        'name': "Crown of Stars",
        'description': "Crown of Stars",
    };
    let moteScale = 0.5
    if (ammount === 9) moteScale = 0.45;
    else if (ammount === 11) moteScale = 0.4;
    new Sequence()

        .effect()
        .file(moteFile)
        .from(workflow.token, { cacheLocation: true })
        .attachTo(workflow.token)
        .scale(moteScale)
        .fadeIn(500)
        .fadeOut(1000)
        .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 5000, delay: 500 })
        .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: 4000 })
        .spriteOffset({ x: 0.5 }, { gridUnits: true })
        .rotate((360 / ammount) * 1)
        .aboveLighting()
        .persist()
        .name(`${workflow.token.document.name} CrOfSM 1`)

        .effect()
        .file(moteFile)
        .from(workflow.token, { cacheLocation: true })
        .attachTo(workflow.token)
        .scale(moteScale)
        .fadeIn(500)
        .fadeOut(1000)
        .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 5000, delay: 500 })
        .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: 4000 })
        .spriteOffset({ x: 0.5 }, { gridUnits: true })
        .rotate((360 / ammount) * 2)
        .aboveLighting()
        .persist()
        .name(`${workflow.token.document.name} CrOfSM 2`)

        .effect()
        .file(moteFile)
        .from(workflow.token, { cacheLocation: true })
        .attachTo(workflow.token)
        .scale(moteScale)
        .fadeIn(500)
        .fadeOut(1000)
        .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 5000, delay: 500 })
        .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: 4000 })
        .spriteOffset({ x: 0.5 }, { gridUnits: true })
        .rotate((360 / ammount) * 3)
        .aboveLighting()
        .persist()
        .name(`${workflow.token.document.name} CrOfSM 3`)

        .effect()
        .file(moteFile)
        .from(workflow.token, { cacheLocation: true })
        .attachTo(workflow.token)
        .scale(moteScale)
        .fadeIn(500)
        .fadeOut(1000)
        .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 5000, delay: 500 })
        .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: 4000 })
        .spriteOffset({ x: 0.5 }, { gridUnits: true })
        .rotate((360 / ammount) * 4)
        .aboveLighting()
        .persist()
        .name(`${workflow.token.document.name} CrOfSM 4`)

        .effect()
        .file(moteFile)
        .from(workflow.token, { cacheLocation: true })
        .attachTo(workflow.token)
        .scale(moteScale)
        .fadeIn(500)
        .fadeOut(1000)
        .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 5000, delay: 500 })
        .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: 4000 })
        .spriteOffset({ x: 0.5 }, { gridUnits: true })
        .rotate((360 / ammount) * 5)
        .aboveLighting()
        .persist()
        .name(`${workflow.token.document.name} CrOfSM 5`)

        .effect()
        .file(moteFile)
        .from(workflow.token, { cacheLocation: true })
        .attachTo(workflow.token)
        .scale(moteScale)
        .fadeIn(500)
        .fadeOut(1000)
        .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 5000, delay: 500 })
        .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: 4000 })
        .spriteOffset({ x: 0.5 }, { gridUnits: true })
        .rotate((360 / ammount) * 6)
        .aboveLighting()
        .persist()
        .name(`${workflow.token.document.name} CrOfSM 6`)

        .effect()
        .file(moteFile)
        .from(workflow.token, { cacheLocation: true })
        .attachTo(workflow.token)
        .scale(moteScale)
        .fadeIn(500)
        .fadeOut(1000)
        .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 5000, delay: 500 })
        .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: 4000 })
        .spriteOffset({ x: 0.5 }, { gridUnits: true })
        .rotate((360 / ammount) * 7)
        .aboveLighting()
        .persist()
        .name(`${workflow.token.document.name} CrOfSM 7`)

        .effect()
        .file(moteFile)
        .from(workflow.token, { cacheLocation: true })
        .attachTo(workflow.token)
        .scale(moteScale)
        .fadeIn(500)
        .fadeOut(1000)
        .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 5000, delay: 500 })
        .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: 4000 })
        .spriteOffset({ x: 0.5 }, { gridUnits: true })
        .rotate((360 / ammount) * 8)
        .name(`${workflow.token.document.name} CrOfSM 8`)
        .aboveLighting()
        .persist()
        .playIf(() => {
            return ammount > 7
        })

        .effect()
        .file(moteFile)
        .from(workflow.token, { cacheLocation: true })
        .attachTo(workflow.token)
        .scale(moteScale)
        .fadeIn(500)
        .fadeOut(1000)
        .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 5000, delay: 500 })
        .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: 4000 })
        .spriteOffset({ x: 0.5 }, { gridUnits: true })
        .rotate((360 / ammount) * 9)
        .name(`${workflow.token.document.name} CrOfSM 9`)
        .aboveLighting()
        .persist()
        .playIf(() => {
            return ammount > 7
        })

        .effect()
        .file(moteFile)
        .from(workflow.token, { cacheLocation: true })
        .attachTo(workflow.token)
        .scale(moteScale)
        .fadeIn(500)
        .fadeOut(1000)
        .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 5000, delay: 500 })
        .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: 4000 })
        .spriteOffset({ x: 0.5 }, { gridUnits: true })
        .rotate((360 / ammount) * 10)
        .name(`${workflow.token.document.name} CrOfSM 10`)
        .aboveLighting()
        .persist()
        .playIf(() => {
            return ammount > 9
        })

        .effect()
        .file(moteFile)
        .from(workflow.token, { cacheLocation: true })
        .attachTo(workflow.token)
        .scale(moteScale)
        .fadeIn(500)
        .fadeOut(1000)
        .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 5000, delay: 500 })
        .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: 4000 })
        .spriteOffset({ x: 0.5 }, { gridUnits: true })
        .rotate((360 / ammount) * 11)
        .name(`${workflow.token.document.name} CrOfSM 11`)
        .aboveLighting()
        .persist()
        .playIf(() => {
            return ammount > 9
        })

        .thenDo(async () => {
            await warpgate.mutate(workflow.token.document, updates, {}, options);
        })

        .play()
}

async function miss({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    if (workflow.hitTargets.size) return;
    let offsetX = Math.floor(Math.random() * (Math.floor(2) - Math.ceil(0) + 1) + Math.ceil(0));
    let offsetY = Math.floor(Math.random() * (Math.floor(2) - Math.ceil(0) + 1) + Math.ceil(0));

    new Sequence()

        .effect()
        .file("jb2a.scorching_ray.blue.01")
        .atLocation(workflow.token)
        .stretchTo(target, { offset: { x: offsetX, y: offsetY }, gridUnits: true })
        .filter("ColorMatrix", { saturate: -1, brightness: 1 })
        .repeats(3, 600, 600)

        .play();
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.hitTargets.size) {
        let target = workflow.targets.first();
        new Sequence()

            .effect()
            .file("jb2a.scorching_ray.blue.01")
            .atLocation(workflow.token)
            .stretchTo(target)
            .filter("ColorMatrix", { saturate: -1, brightness: 1 })
            .repeats(3, 600, 600)

            .play();
    }
    let crownItem = mba.getItem(workflow.actor, "Crown of Stars: Send Mote");
    Sequencer.EffectManager.endEffects({ name: `${token.document.name} CrOfSM ${crownItem.system.uses.value + 1}` })
    if (crownItem.system.uses.value >= 4) return;
    let crownEffect = mba.findEffect(actor, "Crown of Stars");
    if (crownItem.system.uses.value < 1) {
        await mba.removeEffect(crownEffect);
        return;
    }
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
    await mba.updateEffect(crownEffect, updates);
}

export let crownOfStars = {
    'cast': cast,
    'miss': miss,
    'item': item
}