//Animation by EskieMoh#2969 & Carnage Asada#3647;
export async function disguiseSelf({ speaker, actor, token, character, item, args, scope, workflow }) {
    let tokenPath;
    let choices = [
        ['Choose Premade', 'premade'],
        ['Input URL', 'url']
    ];
    let choice = await chrisPremades.helpers.dialog('Input URL or choose one of premade tokens?', choices);
    if (!choice) return;
    switch (choice) {
        case 'premade': {
            let selection = [
                ["tokenizer/npc-images/nurruck.Token.webp", "Nurruck"],
                ["tokenizer/npc-images/kallbraks.Token.webp", "Kallbraks"],
                ["tokenizer/npc-images/kaya.Token.webp", "Kaya"],
                ["tokenizer/npc-images/khryukal_snortgagle_.Token.webp", "Snortgagle"],
                ["tokenizer/npc-images/npc_tester.Token.webp", "Tester"],
                ["tokenizer/npc-images/sindra_sil_veyn.Token.webp", "Syndra"],
                ["tokenizer/npc-images/yudan.Token.webp", "Yudan"],
                ["tokenizer/npc-images/zindar.Token.webp", "Zindar"]
            ];
            function generateEnergyBox(type) {
                return `
                    <label class="radio-label">
                    <input type="radio" name="type" value="${selection[type]}" />
                    <img src="${selection[type].slice(0, -1)}" style="border: 0px; width: 40px; height: 40px"/>
                    ${selection[type].slice(1)}
                    </label>
                `;
            }
            const tokenSelection = Object.keys(selection).map((type) => generateEnergyBox(type)).join("\n");
            const content = `
            <style>
                .disguiseSelf 
                    .form-group {
                        display: flex;
                        flex-wrap: wrap;
                        width: 100%;
                        align-items: flex-start;
                    }
                .disguiseSelf 
                    .radio-label {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    justify-items: center;
                    flex: 1 0 20%;
                    line-height: normal;
                    }
                .disguiseSelf 
                    .radio-label input {
                    display: none;
                }
                .disguiseSelf img {
                    border: 0px;
                    width: 40px;
                    height: 40px;
                    flex: 0 0 40px;
                    cursor: pointer;
                }
                /* CHECKED STYLES */
                .disguiseSelf [type="radio"]:checked + img {
                    outline: 2px solid #f00;
                }
            </style>
            <form class="disguiseSelf">
                <div class="form-group" id="types">
                    ${tokenSelection}
                </div>
            </form>
            `;
            const tokenToDisguise = await new Promise((resolve) => {
                new Dialog({
                    title: "🎭 Disguise Self 🎭: Choose appearance",
                    content: content,
                    buttons: {
                        ok: {
                            label: "Ok",
                            callback: async (html) => {
                                const element = html.find("input[type='radio'][name='type']:checked").val();
                                resolve(element);
                            },
                        },
                        cancel: {
                            label: "Cancel",
                            callback: async (html) => {
                                return;
                            }
                        }
                    }
                }).render(true);
            });
            tokenPath = tokenToDisguise.split(",")[0];
            break;
        }
        case 'url': {
            const adress = await warpgate.menu({
                inputs: [{
                    type: 'text',
                    label: `🎩 Input Image URL`
                }],
                buttons: [{
                    label: 'Ok',
                    value: 1
                }]
            },
                { title: '🎭 Disguise Self 🎭: Choose appearance' }
            );
            if (!adress.inputs) return;
            tokenPath = adress.inputs;
            break;
        }
    }

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

        .thenDo(function () {
            Tagger.addTags(token, "DisguiseSelf")
        })

        .animation()
        .on(token)
        .opacity(0)

        .effect()
        .file(tokenPath)
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