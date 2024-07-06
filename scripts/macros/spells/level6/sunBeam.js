import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Sunbeam: Create Beam", false);
    if (!featureData) return;
    featureData.system.save.dc = mba.getSpellDC(workflow.item);
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} SunBea` })
        await warpgate.revert(token.document, "Sunbeam");
    }
    let effectData = {
        'name': "Sunbeam",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>For the duration, a mote of brilliant radiance shines in your hand. It sheds bright light in a 30-foot radius and dim light for an additional 30 feet. This light is sunlight.</p>
            <p>A beam of brilliant light flashes out from your hand in a 5-foot-wide, 60-foot-long line. Each creature in the line must make a Constitution saving throw.</p>
            <p>On a failed save, a creature takes 6d8 radiant damage and is @UUID[Compendium.mba-premades.MBA SRD.Item.3NxmNhGQQqUDnu73]{Blinded} until your next turn.</p>
            <p>On a successful save, it takes half as much damage and isn't @UUID[Compendium.mba-premades.MBA SRD.Item.3NxmNhGQQqUDnu73]{Blinded} by this spell.</p>
            <p>Undead and oozes have disadvantage on this saving throw.</p>
            <p>You can create a new line of radiance as your action on any turn until the spell ends.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'ATL.light.bright',
                'mode': 2,
                'value': 30,
                'priority': 20
            },
            {
                'key': 'ATL.light.dim',
                'mode': 2,
                'value': 60,
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
                'key': 'ATL.light.color',
                'mode': 5,
                'value': "#adaf18",
                'priority': 20
            },
            {
                'key': 'ATL.light.animation',
                'mode': 5,
                'value': '{type: "smokepatch", speed: 5, intensity: 1, reverse: false }',
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
                    baseLevel: 6,
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
        'name': "Sunbeam",
        'description': "Sunbeam"
    };
    new Sequence()

        .effect()
        .file("jb2a.markers.light.complete.yellow")
        .attachTo(workflow.token)
        .fadeOut(1000)

        .effect()
        .file("jb2a.markers.light_orb.complete.yellow")
        .attachTo(workflow.token)
        .scaleToObject(1)
        .delay(1000)
        .fadeIn(2000)
        .fadeOut(2000)
        .persist()
        .name(`${workflow.token.document.name} SunBea`)

        .wait(1500)

        .thenDo(async () => {
            await warpgate.mutate(workflow.token.document, updates, {}, options);
        })

        .play()
}

async function check({ speaker, actor, token, character, item, args, scope, workflow }) {
    for (let target of Array.from(workflow.targets)) {
        let type = mba.raceOrType(target.actor);
        if (type === "undead" || type === "ooze") {
            await mba.createEffect(target.actor, constants.disadvantageEffectData);
        }
    }
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;
    new Sequence()

        .effect()
        .file("jb2a.disintegrate.green")
        .attachTo(workflow.token)
        .stretchTo(template)
        .filter("ColorMatrix", { hue: 345 })
        .repeats(3, 800)

        .play()
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let effectData = {
        'name': "Sunbeam: Blindness",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.3NxmNhGQQqUDnu73]{Blinded} until the start of the caster's next turn.</p>
        `,
        'changes': [
            {
                'key': "macro.CE",
                'mode': 0,
                'value': "Blinded",
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['turnStartSource']
            }
        }
    };
    for (let target of Array.from(workflow.failedSaves)) {
        if (!mba.checkTrait(target.actor, "ci", "blinded") && !mba.findEffect(target.actor, "Sunbeam: Blindness")) await mba.createEffect(target.actor, effectData);
    }
}

export let sunbeam = {
    'cast': cast,
    'check': check,
    'item': item,
}