import {mba} from "../../../helperFunctions.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Aura of Vitality: Heal Creature", false);
    if (!featureData) return;
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} AoV` })
        await warpgate.revert(token.document, "Aura of Vitality");
    }
    const effectData = {
        'name': "Aura of Vitality",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are concentrating on Aura of Vitality.</p>
            <p>Until the spell ends, you can use a bonus action to cause one creature in the aura (including you) to regain 2d6 hit points.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 3,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
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
        'name': 'Aura of Vitality',
        'description': 'Aura of Vitality'
    };
    new Sequence()

        .effect()
        .file("animated-spell-effects-cartoon.energy.10")
        .attachTo(workflow.token)
        .scaleToObject(1.4)
        .filter("ColorMatrix", { hue: 260 })

        .effect()
        .file("jb2a.aura_themed.01.outward.complete.cold.01.green")
        .attachTo(workflow.token)
        .scaleToObject(3)
        .belowTokens()
        .fadeOut(1000)
        .persist()
        .name(`${workflow.token.document.name} AoV`)

        .wait(400)

        .thenDo(async () => {
            await warpgate.mutate(workflow.token.document, updates, {}, options);
        })

        .play()
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();

    new Sequence()

        .effect()
        .file("animated-spell-effects-cartoon.energy.10")
        .attachTo(target)
        .scaleToObject(1.4)
        .filter("ColorMatrix", { hue: 280 })
        .waitUntilFinished(-700)

        .effect()
        .file("jb2a.healing_generic.burst.yellowwhite")
        .attachTo(target)
        .scaleToObject(1.35)
        .filter("ColorMatrix", { hue: 80 })
        .playbackRate(0.9)

        .play()
}

export let auraOfVitality = {
    'cast': cast,
    'item': item
}