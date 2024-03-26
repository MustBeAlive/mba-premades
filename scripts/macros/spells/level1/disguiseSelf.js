//Animation by EskieMoh#2969 & Carnage Asada#3647; rework to be able to choose from folder of tokens
export async function disguiseSelf({ speaker, actor, token, character, item, args, scope, workflow }) {
    const disguise = await warpgate.menu({
        inputs: [{
            label: `🎩 Input Image URL`,
            type: 'text'
        }],
        buttons: [{
            label: 'Cast!',
            value: 1
        }]
    },
        { title: '🎭 Disguise Self 🎭' }
    );

    async function effectMacroDel() {
        if (Tagger.hasTags(token, "DisguiseSelf")) {
            await Tagger.removeTags(token, "DisguiseSelf");

            new Sequence()
                .animation()
                .on(token)
                .opacity(1)
                .play();

            await Sequencer.EffectManager.endEffects({ name: "DisguiseSelf", object: token })
        }
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'duration': {
            'seconds': 3600
        },
        'flags': {
            'dae': {
                'showIcon': false
            },
            'effectmacro': {
                'onDelete': {
                    'script': chrisPremades.helpers.functionToString(effectMacroDel)
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 1,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    new Sequence()

        .effect()
        .file("modules/jb2a_patreon/Library/Generic/Marker/MarkerCircleOfStars_Regular_OrangePurple_400x400.webm")
        .atLocation(token)
        .delay(200)
        .duration(7500)
        .fadeOut(7500)
        .scaleToObject(1.3)
        .attachTo(token, { bindAlpha: false })
        .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 60000 })
        .zIndex(1)

        .effect()
        .file("modules/jb2a_patreon/Library/1st_Level/Sneak_Attack/Sneak_Attack_Dark_Purple_300x300.webm")
        .atLocation(token)
        .delay(200)
        .startTime(450)
        .scaleToObject(2)
        .attachTo(token, { bindAlpha: false })
        .playbackRate(1)
        .zIndex(2)
        .waitUntilFinished(-1000)

        //Add DisguiseSelf tag on token
        .thenDo(function () {
            Tagger.addTags(token, "DisguiseSelf")
        })

        .animation()
        .on(token)
        .opacity(0)

        .effect()
        .file(disguise.inputs)
        .name("DisguiseSelf")
        .atLocation(token)
        .scaleToObject(0.95)
        .persist()
        .attachTo(token, { bindAlpha: false })
        .fadeOut(2000, { ease: "easeOutCubic" })
        .scaleOut(0.5, 3000, { ease: "easeOutCubic" })

        .effect()
        .file("jb2a.sleep.cloud.01.dark_purple")
        .atLocation(token)
        .delay(200)
        .opacity(0.5)
        .scaleOut(0.5, 1000, { ease: "easeOutCubic" })
        .scaleToObject(2)
        .belowTokens()
        .duration(1000)
        .fadeOut(1000)

        .thenDo(function () {
            chrisPremades.helpers.createEffect(workflow.actor, effectData);
        })

        .effect()
        .file("jb2a.particles.outward.purple.02.03")
        .name("DisguiseSelf")
        .atLocation(token)
        .delay(200)
        .scaleToObject(1.5)
        .zIndex(2)
        .scaleIn(0, 200, { ease: "easeOutCubic" })
        .attachTo(token, { bindAlpha: false })
        .persist()
        .fadeIn(760)
        .fadeOut(2500)

        .play();
}