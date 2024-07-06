import {mba} from "../../../helperFunctions.js";

export async function mindBlank({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} MinBla` })
    };
    let effectData = {
        'name': "Mind Blank",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Until the spell ends, you are immune to psychic damage, any effect that would sense your emotions or read your thoughts, divination spells, and the @UUID[Compendium.mba-premades.MBA SRD.Item.SVd8xu3mTZMqz8fL]{Charmed} condition.</p>
            <p>The spell even foils Wish spells and spells or effects of similar power used to affect your mind or to gain information about you.</p>
        `,
        'duration': {
            'seconds': 86400
        },
        'changes': [
            {
                'key': 'system.traits.di.value',
                'mode': 2,
                'value': "psychic",
                'priority': 20
            },
            {
                'key': 'system.traits.ci.value',
                'mode': 2,
                'value': "charmed",
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.spell.nondetection',
                'mode': 5,
                'value': true,
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
                    baseLevel: 8,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };

    new Sequence()

        .wait(750)

        .effect()
        .file("jb2a.moonbeam.01.outro.yellow")
        .attachTo(target)
        .scaleToObject(1.5)
        .startTime(500)
        .playbackRate(2)
        .scaleIn(0, 750, { ease: "easeOutCubic" })
        .filter("ColorMatrix", { saturate: -1 })

        .effect()
        .file("jb2a.extras.tmfx.border.circle.outpulse.01.normal")
        .attachTo(target)
        .scaleToObject(1.5)
        .delay(750)
        .opacity(0.5)
        .filter("ColorMatrix", { brightness: 0 })
        .belowTokens()

        .effect()
        .file("jb2a.extras.tmfx.border.circle.outpulse.01.normal")
        .attachTo(target)
        .scaleToObject(2)
        .delay(750)
        .opacity(0.75)
        .filter("ColorMatrix", { brightness: 0 })
        .belowTokens()

        .effect()
        .file("jb2a.cast_generic.earth.01.browngreen.1")
        .attachTo(target)
        .scaleToObject(2)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .filter("ColorMatrix", { saturate: -1 })
        .belowTokens()
        .waitUntilFinished(-1000)

        .effect()
        .file("jb2a.markers.bubble.loop.blue")
        .attachTo(target)
        .scaleToObject(1.25)
        .fadeIn(500)
        .fadeOut(2000)
        .scaleIn(0.1, 1000, { ease: "easeOutBack" })
        .opacity(0.4)
        .zIndex(2)
        .filter("ColorMatrix", { saturate: -1, brightness: 0 })
        .persist()
        .name(`${target.document.name} MinBla`)

        .effect()
        .file("jb2a.wall_of_force.sphere.grey")
        .attachTo(target)
        .scaleToObject(1.25)
        .opacity(0.5)
        .fadeIn(500)
        .fadeOut(2000)
        .scaleIn(0.1, 1000, { ease: "easeOutBack" })
        .zIndex(2)
        .playbackRate(0.8)
        .filter("Glow", { color: 0x000000, distance: 2.5, innerStrength: 3, outerStrength: 0 })
        .persist()
        .name(`${target.document.name} MinBla`)

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectData);
        })

        .play()
}