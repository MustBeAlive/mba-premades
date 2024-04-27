export async function speakWithPlants({ speaker, actor, token, character, item, args, scope, workflow }) {
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You imbue plants within 30 feet of you with limited sentience and animation, giving them the ability to communicate with you and follow your simple commands.</p>
            <p>You can question plants about events in the spell's area within the past day, gaining information about creatures that have passed, weather, and other circumstances.</p>
            <p>You can also turn difficult terrain caused by plant growth (such as thickets and undergrowth) into ordinary terrain that lasts for the duration. Or you can turn ordinary terrain where plants are present into difficult terrain that lasts for the duration, causing vines and branches to hinder pursuers, for example.</p>
            <p>Plants might be able to perform other tasks on your behalf, at the DM's discretion. The spell doesn't enable plants to uproot themselves and move about, but they can freely move branches, tendrils, and stalks.</p>
            <p>If a plant creature is in the area, you can communicate with it as if you shared a common language, but you gain no magical ability to influence it.</p>
            <p>This spell can cause the plants created by the entangle spell to release a restrained creature.</p>
        `,
        'duration': {
            'seconds': 600
        },
        'flags': {
            'midi-qol': {
                'castData': {
                    baseLevel: 3,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };

    new Sequence()

        .wait(500)

        .effect()
        .file("jb2a.swirling_leaves.complete.02.greenorange")
        .attachTo(token)
        .size(3, { gridUnits: true })
        .fadeIn(500)
        .fadeOut(1500)
        .scaleIn(0, 3000, { ease: "easeOutCubic" })
        .belowTokens()

        .effect()
        .file("jb2a.particles.inward.greenyellow.01.05")
        .delay(1000)
        .attachTo(token)
        .size(2, { gridUnits: true })
        .duration(8700)
        .fadeIn(1500)
        .fadeOut(1500)
        //.scaleIn(0, 1000, { ease: "easeOutCubic" })
        .belowTokens()

        .effect()
        .file("jb2a.magic_signs.rune.02.complete.06.green")
        .delay(1000)
        .attachTo(token)
        .scaleToObject(1.2)
        .scaleIn(0, 3000, { ease: "easeOutCubic" })
        .zIndex(0.1)
        .fadeOut(1500)
        .duration(8700)

        .play()

    await warpgate.wait(1000);
    await chrisPremades.helpers.createEffect(workflow.actor, effectData);
}