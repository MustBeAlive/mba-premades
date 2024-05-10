import { mba } from "../../../helperFunctions.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let level = workflow.actor.system.details.level ?? workflow.actor.system.details.cr;
    let dice = 1 + (Math.floor((level + 1) / 6));
    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Spell Features', 'Produce Flame: Hurl', false);
    if (!featureData) return;
    delete featureData._id;
    featureData.system.damage.parts[0][0] = dice + 'd8[fire]';
    async function effectMacroDel() {
        await warpgate.revert(token.document, 'Produce Flame: Hurl');
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
        'name': 'Produce Flame: Hurl',
        'description': 'Produce Flame: Hurl'
    };

    new Sequence()

        .effect()
        .file("animated-spell-effects-cartoon.fire.27")
        .attachTo(token, { offset: { x: 0.05 * token.document.width, y: 0.35 * token.document.width }, gridUnits: true, followRotation: false })
        .scaleToObject(1.1, { considerTokenScale: true })
        .rotate(-67)
        .filter("ColorMatrix", { saturate: -1, brightness: 0 })
        .filter("Blur", { blurX: 5, blurY: 10 })
        .opacity(0.6)

        .effect()
        .file("animated-spell-effects-cartoon.fire.27")
        .attachTo(token, { offset: { x: 0.05 * token.document.width, y: 0.25 * token.document.width }, gridUnits: true, followRotation: false })
        .scaleToObject(1.1, { considerTokenScale: true })
        .rotate(-67)
        .zIndex(0.1)

        .effect()
        .file("animated-spell-effects-cartoon.fire.27")
        .delay(500)
        .attachTo(token, { offset: { x: -0.325 * token.document.width, y: -0.15 * token.document.width }, gridUnits: true, followRotation: false })
        .scaleToObject(0.9, { considerTokenScale: true })
        .belowTokens(false)
        .mirrorY(true)
        .rotate(145)
        .filter("ColorMatrix", { saturate: -1, brightness: 0 })
        .filter("Blur", { blurX: 5, blurY: 10 })
        .opacity(0.6)

        .effect()
        .file("animated-spell-effects-cartoon.fire.27")
        .delay(500)
        .attachTo(token, { offset: { x: -0.325 * token.document.width, y: -0.25 * token.document.width }, gridUnits: true, followRotation: false })
        .scaleToObject(0.9, { considerTokenScale: true })
        .belowTokens(false)
        .mirrorY(true)
        .rotate(145)
        .zIndex(0.1)

        .effect()
        .file("jaamod.fire.candle_flame.1")
        .delay(700)
        .fadeIn(500)
        .fadeOut(1000)
        .attachTo(token, { offset: { x: 0.4 * token.document.width }, gridUnits: true, followRotation: false })
        .scaleToObject(0.8, { considerTokenScale: true })
        .persist()
        .name(`${token.document.name} Produce Flame`)

        .play()

    await warpgate.mutate(workflow.token.document, updates, {}, options);
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let effect = await mba.findEffect(workflow.actor, "Produce Flame");
    Sequencer.EffectManager.endEffects({ name: `${token.document.name} Produce Flame`, object: token })
    if (!workflow.hitTargets.size) {
        let offsetX = Math.floor(Math.random() * (Math.floor(2) - Math.ceil(0) + 1) + Math.ceil(0));
        if (offsetX === 0) offsetX = 1;
        let offsetY = Math.floor(Math.random() * (Math.floor(2) - Math.ceil(0) + 1) + Math.ceil(0));
        if (offsetY === 0) offsetY = 1;

        new Sequence()

            .effect()
            .file("jb2a.fire_bolt.orange")
            .attachTo(token)
            .stretchTo(target, { offset: { x: offsetX, y: offsetY }, gridUnits: true })

            .thenDo(function () {
                mba.removeEffect(effect);
            })

            .play()

        return;
    }

    new Sequence()

        .effect()
        .file("jb2a.fire_bolt.orange")
        .attachTo(token)
        .stretchTo(target)

        .thenDo(function () {
            mba.removeEffect(effect);
        })

        .play()
}

export let produceFlame = {
    'cast': cast,
    'item': item
}