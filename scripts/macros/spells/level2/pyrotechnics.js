export async function pyrotechnics({speaker, actor, token, character, item, args, scope, workflow}) {
    let choices = [['Smoke Cloud', 'cloud'], ['Fireworks Explosion', 'explosion']];
    let selection = await chrisPremades.helpers.dialog('Choose one of the following effects:', choices);
    if (!selection) return;
    if (selection === "cloud") {
        let templateData = {
            't': 'circle',
            'user': game.user,
            'distance': 20,
            'direction': 0,
            'fillColor': game.user.color,
            'flags': {
                'dnd5e': {
                    'origin': workflow.item.uuid
                },
                'midi-qol': {
                    'originUuid': workflow.item.uuid
                },
                'chris-premades': {
                    'spell': {
                        'fogCloud': true
                    }
                },
                'walledtemplates': {
                    'wallRestriction': 'move',
                    'wallsBlock': 'recurse',
                }
            },
            'angle': 0
        };
        let template = await chrisPremades.helpers.placeTemplate(templateData);
        if (!template) return;


        new Sequence()

            .effect()
            .atLocation(token)
            .file(`jb2a.magic_signs.circle.02.transmutation.loop.yellow`)
            .scaleToObject(1.5)
            .rotateIn(180, 600, { ease: "easeOutCubic" })
            .scaleIn(0, 600, { ease: "easeOutCubic" })
            .loopProperty("sprite", "rotation", { from: 0, to: -360, duration: 10000 })
            .belowTokens()
            .fadeOut(2000)
            .zIndex(0)

            .effect()
            .atLocation(token)
            .file(`jb2a.magic_signs.circle.02.transmutation.complete.yellow`)
            .scaleToObject(2)
            .rotateIn(180, 600, { ease: "easeOutCubic" })
            .scaleIn(0, 600, { ease: "easeOutCubic" })
            .loopProperty("sprite", "rotation", { from: 0, to: -360, duration: 10000 })
            .belowTokens(true)
            .filter("ColorMatrix", { saturate: -1, brightness: 2 })
            .filter("Blur", { blurX: 5, blurY: 10 })
            .zIndex(1)
            .duration(1200)
            .fadeIn(200, { ease: "easeOutCirc", delay: 500 })
            .fadeOut(300, { ease: "linear" })

            .effect()
            .atLocation(template)
            .file(`jb2a.magic_signs.circle.02.transmutation.complete.yellow`)
            .size(6, { gridUnits: true })
            .fadeIn(600)
            .opacity(1)
            .rotateIn(180, 600, { ease: "easeOutCubic" })
            .scaleIn(0, 600, { ease: "easeOutCubic" })
            .belowTokens()
            .playbackRate(1.2)

            .effect()
            .file("jaamod.smoke.poison_cloud")
            .atLocation(template)
            .scaleIn(0, 1500, { ease: "easeOutCubic" })
            .scaleOut(0, 1500, { ease: "linear" })
            .fadeIn(200)
            .fadeOut(1000)
            .zIndex(2)
            .delay(1500)
            .filter("ColorMatrix", { saturate: -1 })
            .playbackRate(0.7)
            .size(6, { gridUnits: true })

            .effect()
            .delay(2500)
            .file("jb2a.darkness.black")
            .atLocation(template)
            .fadeIn(5000)
            .opacity(0.7)
            .zIndex(1)
            .randomRotation()
            .scaleOut(0, 1500, { ease: "linear" })
            .fadeOut(1000)
            .scaleIn(0, 5000, { ease: "easeOutCubic" })
            .size(8.8, { gridUnits: true })
            .persist()
            .name('Pyrotechnics')

            .play()

        async function effectMacroDel() {
            await Sequencer.EffectManager.endEffects({ name: "Pyrotechnics" })
        }
        let templateEffectData = {
            'name': workflow.item.name,
            'icon': workflow.item.img,
            'origin': workflow.item.uuid,
            'changes': [
                {
                    'key': 'flags.dae.deleteUuid',
                    'mode': 5,
                    'priority': 20,
                    'value': template.uuid
                }
            ],
            'duration': {
                'seconds': 60
            },
            'flags': {
                'effectmacro': {
                    'onDelete': {
                        'script': chrisPremades.helpers.functionToString(effectMacroDel)
                    }
                },
                'midi-qol': {
                    'castData': {
                        baseLevel: 2,
                        castLevel: workflow.castData.castLevel,
                        itemUuid: workflow.item.uuid
                    }
                }
            }
        };
        await chrisPremades.helpers.createEffect(workflow.actor, templateEffectData);
        return;
    }

    let templateData = {
        't': "circle",
        'user': game.user,
        'distance': 10,
        'direction': 0,
        'fillColor': game.user.color,
        'flags': {
            'dnd5e': {
                'origin': workflow.item.uuid
            },
            'midi-qol': {
                'originUuid': workflow.item.uuid
            },
            'walledtemplates': {
                'wallRestriction': 'move',
                'wallsBlock': 'recurse',
            }
        },
        'angle': 0
    };
    let template = await chrisPremades.helpers.placeTemplate(templateData);
    if (!template) return;

    new Sequence()

        .effect()
        .atLocation(token)
        .file(`jb2a.magic_signs.circle.02.transmutation.loop.yellow`)
        .scaleToObject(1.5)
        .rotateIn(180, 600, { ease: "easeOutCubic" })
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .loopProperty("sprite", "rotation", { from: 0, to: -360, duration: 10000 })
        .belowTokens()
        .fadeOut(2000)
        .zIndex(0)

        .effect()
        .atLocation(token)
        .file(`jb2a.magic_signs.circle.02.transmutation.complete.yellow`)
        .scaleToObject(2)
        .rotateIn(180, 600, { ease: "easeOutCubic" })
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .loopProperty("sprite", "rotation", { from: 0, to: -360, duration: 10000 })
        .belowTokens(true)
        .filter("ColorMatrix", { saturate: -1, brightness: 2 })
        .filter("Blur", { blurX: 5, blurY: 10 })
        .zIndex(1)
        .duration(1200)
        .fadeIn(200, { ease: "easeOutCirc", delay: 500 })
        .fadeOut(300, { ease: "linear" })

        .effect()
        .atLocation(template)
        .file(`jb2a.magic_signs.circle.02.transmutation.complete.yellow`)
        .size(4, { gridUnits: true })
        .fadeIn(600)
        .opacity(1)
        .rotateIn(180, 600, { ease: "easeOutCubic" })
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .belowTokens()
        .playbackRate(1.2)

        .effect()
        .file("animated-spell-effects-cartoon.smoke.07")
        .atLocation(template)
        .scaleIn(0, 1500, { ease: "easeOutCubic" })
        .fadeIn(200)
        .zIndex(2)
        .delay(1800)
        .size(4, { gridUnits: true })

        .effect()
        .file("animated-spell-effects-cartoon.smoke.115")
        .atLocation(template)
        .scaleIn(0, 1500, { ease: "easeOutCubic" })
        .fadeIn(200)
        .zIndex(2)
        .delay(1800)
        .size(4, { gridUnits: true })

        .effect()
        .file(`jb2a.firework.02.{{color}}`)
        .atLocation(template)
        .setMustache({
            "color": () => {
                const colors = ['orangeyellow.03', 'orange.02', 'greenred.01', 'bluepink.03'];
                return colors[Math.floor(Math.random() * colors.length)];
            }
        })
        .scale(1)
        .delay(2400)
        .zIndex(4)

        .effect()
        .file("jb2a.particles.outward.blue.02.03")
        .atLocation(template)
        .filter("ColorMatrix", { saturate: -1, brightness: 2 })
        .duration(7000)
        .fadeOut(3000)
        .scale(1.5)
        .randomRotation()
        .delay(2500)
        .zIndex(4)

        .effect()
        .file("jaamod.misc.fireworks.1")
        .atLocation(template)
        .delay(2700)
        .zIndex(4)

        .play()

    let templateEffectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'changes': [
            {
                'key': 'flags.dae.deleteUuid',
                'mode': 5,
                'priority': 20,
                'value': template.uuid
            }
        ],
        'duration': {
            'turns': 1
        }
    };
    await chrisPremades.helpers.createEffect(workflow.actor, templateEffectData);

    let targetUuids = [];
    for (let i of game.user.targets) {
        let hasBlindImmunity = await chrisPremades.helpers.checkTrait(i.actor, 'ci', 'blinded');
        if (hasBlindImmunity) {
            ChatMessage.create({ flavor: i.name + ' is unaffected by Pyrotechnics: Explosion (Target is immune to condition: Blinded)', speaker: ChatMessage.getSpeaker({ actor: workflow.actor }) });
            continue;
        }
        targetUuids.push(i.document.uuid);
    }
    let featureData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Spell Features', 'Pyrotechnics: Explosion', false);
    if (!featureData) return;
    featureData.system.save.dc = chrisPremades.helpers.getSpellDC(workflow.item);
    delete featureData._id;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
    let [config, options] = chrisPremades.constants.syntheticItemWorkflowOptions(targetUuids);
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (!featureWorkflow.failedSaves.size) return;
    let targetEffectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'description': "You witnessed a dazzling explosion of colors and are blinded until the end of caster's next turn.",
        'origin': workflow.item.uuid,
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': 'Blinded',
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['turnEndSource']
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 2,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    for (let i of featureWorkflow.failedSaves) await chrisPremades.helpers.createEffect(i.actor, targetEffectData);
}