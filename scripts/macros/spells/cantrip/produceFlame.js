import {mba} from "../../../helperFunctions.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let level = workflow.actor.system.details.level ?? workflow.actor.system.details.cr;
    let dice = 1 + (Math.floor((level + 1) / 6));
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Produce Flame: Hurl", false);
    if (!featureData) return;
    delete featureData._id;
    featureData.system.damage.parts[0][0] = dice + 'd8[fire]';
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} ProFla` })
        await warpgate.revert(token.document, 'Produce Flame');
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'duration': {
            'seconds': 600
        },
        'changes': [
            {
                'key': 'ATL.light.dim',
                'mode': 4,
                'value': '20',
                'priority': 20
            },
            {
                'key': 'ATL.light.bright',
                'mode': 4,
                'value': '10',
                'priority': 20
            },
            {
                'key': 'ATL.light.animation',
                'mode': 4,
                'value': '{intensity: 1, reverse: false, speed: 6, type: "torch"}',
                'priority': 20
            }
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'flags': {
                'midi-qol': {
                    'castData': {
                        baseLevel: 0,
                        castLevel: workflow.castData.castLevel,
                        itemUuid: workflow.item.uuid
                    }
                }
            }
        }
    };
    let updates = {
        'embedded': {
            'Item': {
                [featureData.name]: featureData,
            },
            'ActiveEffect': {
                [effectData.name]: effectData
            }
        }
    };
    let options = {
        'permanent': false,
        'name': 'Produce Flame',
        'description': 'Produce Flame'
    };

    new Sequence()

        .effect()
        .file("animated-spell-effects-cartoon.fire.27")
        .attachTo(workflow.token, { offset: { x: 0.05 * workflow.token.document.width, y: 0.35 * workflow.token.document.width }, gridUnits: true, followRotation: false })
        .scaleToObject(1.1, { considerTokenScale: true })
        .rotate(-67)
        .filter("ColorMatrix", { saturate: -1, brightness: 0 })
        .filter("Blur", { blurX: 5, blurY: 10 })
        .opacity(0.6)

        .effect()
        .file("animated-spell-effects-cartoon.fire.27")
        .attachTo(workflow.token, { offset: { x: 0.05 * workflow.token.document.width, y: 0.25 * workflow.token.document.width }, gridUnits: true, followRotation: false })
        .scaleToObject(1.1, { considerTokenScale: true })
        .rotate(-67)
        .zIndex(0.1)

        .effect()
        .file("animated-spell-effects-cartoon.fire.27")
        .attachTo(workflow.token, { offset: { x: -0.325 * workflow.token.document.width, y: -0.15 * workflow.token.document.width }, gridUnits: true, followRotation: false })
        .scaleToObject(0.9, { considerTokenScale: true })
        .delay(500)
        .belowTokens(false)
        .mirrorY(true)
        .rotate(145)
        .filter("ColorMatrix", { saturate: -1, brightness: 0 })
        .filter("Blur", { blurX: 5, blurY: 10 })
        .opacity(0.6)

        .effect()
        .file("animated-spell-effects-cartoon.fire.27")
        .attachTo(workflow.token, { offset: { x: -0.325 * workflow.token.document.width, y: -0.25 * workflow.token.document.width }, gridUnits: true, followRotation: false })
        .scaleToObject(0.9, { considerTokenScale: true })
        .delay(500)
        .belowTokens(false)
        .mirrorY(true)
        .rotate(145)
        .zIndex(0.1)

        .effect()
        .file("jaamod.fire.candle_flame.1")
        .attachTo(workflow.token, { offset: { x: 0.4 * workflow.token.document.width }, gridUnits: true, followRotation: false })
        .scaleToObject(0.8, { considerTokenScale: true })
        .delay(700)
        .fadeIn(500)
        .fadeOut(1000)
        .persist()
        .name(`${workflow.token.document.name} ProFla`)

        .play()

    await warpgate.mutate(workflow.token.document, updates, {}, options);
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let effect = await mba.findEffect(workflow.actor, "Produce Flame");
    Sequencer.EffectManager.endEffects({ name: `${token.document.name} ProFla` })
    if (!workflow.hitTargets.size) {
        let offsetX = Math.floor(Math.random() * (Math.floor(2) - Math.ceil(0) + 1) + Math.ceil(0));
        if (offsetX === 0) offsetX = 1;
        let offsetY = Math.floor(Math.random() * (Math.floor(2) - Math.ceil(0) + 1) + Math.ceil(0));
        if (offsetY === 0) offsetY = 1;

        new Sequence()

            .effect()
            .file("jb2a.fire_bolt.orange")
            .attachTo(workflow.token)
            .stretchTo(target, { offset: { x: offsetX, y: offsetY }, gridUnits: true })

            .thenDo(async () => {
                await mba.removeEffect(effect);
            })

            .play()

        return;
    }

    new Sequence()

        .effect()
        .file("jb2a.fire_bolt.orange")
        .attachTo(workflow.token)
        .stretchTo(target)

        .thenDo(async () => {
            await mba.removeEffect(effect);
        })

        .play()
}

export let produceFlame = {
    'cast': cast,
    'item': item
}