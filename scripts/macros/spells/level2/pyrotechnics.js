import { constants } from "../../generic/constants.js";
import { mba } from "../../../helperFunctions.js";

export async function pyrotechnics({ speaker, actor, token, character, item, args, scope, workflow }) {
    let choices = [['Smoke Cloud', 'cloud'], ['Explosion of Fireworkds', 'explosion']];
    let selection = await mba.dialog("Pyrotechnics", choices, `<b>Choose one of the effects:</b>`);
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
                'mba-premades': {
                    'spell': {
                        'fogCloud': true
                    }
                },
                'walledtemplates': {
                    'hideBorder': "alwaysHide",
                    'wallRestriction': 'move',
                    'wallsBlock': 'recurse',
                }
            },
            'angle': 0
        };
        let template = await mba.placeTemplate(templateData);
        if (!template) return;
        new Sequence()

            .wait(250)

            .effect()
            .attachTo(template)
            .file(`jb2a.magic_signs.circle.02.transmutation.complete.yellow`)
            .size(6, { gridUnits: true })
            .fadeIn(600)
            .scaleIn(0, 600, { ease: "easeOutCubic" })
            .rotateIn(180, 600, { ease: "easeOutCubic" })
            .opacity(1)
            .belowTokens()
            .playbackRate(1.2)

            .effect()
            .file("jaamod.smoke.poison_cloud")
            .attachTo(template)
            .delay(1500)
            .fadeIn(200)
            .fadeOut(1000)
            .scaleIn(0, 1500, { ease: "easeOutCubic" })
            .scaleOut(0, 1500, { ease: "linear" })
            .zIndex(2)
            .filter("ColorMatrix", { saturate: -1 })
            .playbackRate(0.7)
            .size(6, { gridUnits: true })

            .effect()
            .file("jb2a.darkness.black")
            .attachTo(template)
            .size(8.8, { gridUnits: true })
            .delay(2500)
            .fadeIn(5000)
            .fadeOut(1000)
            .scaleIn(0, 5000, { ease: "easeOutCubic" })
            .scaleOut(0, 1500, { ease: "linear" })
            .opacity(0.7)
            .zIndex(1)
            .randomRotation()
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
            'duration': {
                'seconds': 60
            },
            'changes': [
                {
                    'key': 'flags.dae.deleteUuid',
                    'mode': 5,
                    'priority': 20,
                    'value': template.uuid
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
                        baseLevel: 2,
                        castLevel: workflow.castData.castLevel,
                        itemUuid: workflow.item.uuid
                    }
                }
            }
        };
        await mba.createEffect(workflow.actor, templateEffectData);
        return;
    }
    else if (selection === "explosion") {
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
                    'hideBorder': "alwaysHide",
                    'wallRestriction': 'move',
                    'wallsBlock': 'recurse',
                }
            },
            'angle': 0
        };
        let template = await mba.placeTemplate(templateData);
        if (!template) return;

        new Sequence()

            .wait(250)

            .effect()
            .attachTo(template)
            .file(`jb2a.magic_signs.circle.02.transmutation.complete.yellow`)
            .size(4, { gridUnits: true })
            .fadeIn(600)
            .scaleIn(0, 600, { ease: "easeOutCubic" })
            .rotateIn(180, 600, { ease: "easeOutCubic" })
            .opacity(1)
            .belowTokens()
            .playbackRate(1.2)

            .effect()
            .file("animated-spell-effects-cartoon.smoke.07")
            .attachTo(template)
            .size(4, { gridUnits: true })
            .delay(1800)
            .fadeIn(200)
            .scaleIn(0, 1500, { ease: "easeOutCubic" })
            .zIndex(2)

            .effect()
            .file("animated-spell-effects-cartoon.smoke.115")
            .attachTo(template)
            .size(4, { gridUnits: true })
            .delay(1800)
            .fadeIn(200)
            .scaleIn(0, 1500, { ease: "easeOutCubic" })
            .zIndex(2)

            .effect()
            .file(`jb2a.firework.02.{{color}}`)
            .attachTo(template)
            .scale(1)
            .delay(2400)
            .setMustache({
                "color": () => {
                    const colors = ['orangeyellow.03', 'orange.02', 'greenred.01', 'bluepink.03'];
                    return colors[Math.floor(Math.random() * colors.length)];
                }
            })
            .zIndex(4)

            .effect()
            .file("jb2a.particles.outward.blue.02.03")
            .attachTo(template)
            .scale(1.5)
            .delay(2500)
            .duration(7000)
            .fadeOut(3000)
            .filter("ColorMatrix", { saturate: -1, brightness: 2 })
            .randomRotation()
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
            'duration': {
                'turns': 1
            },
            'changes': [
                {
                    'key': 'flags.dae.deleteUuid',
                    'mode': 5,
                    'priority': 20,
                    'value': template.uuid
                }
            ],
        };
        await mba.createEffect(workflow.actor, templateEffectData);

        let targetUuids = [];
        for (let i of game.user.targets) {
            if (mba.checkTrait(i.actor, 'ci', 'blinded')) {
                ChatMessage.create({ 
                    flavor: `<b>${i.name}</b> is unaffected by Pyrotechnics (target is immune to condition: Blinded)`, 
                    speaker: ChatMessage.getSpeaker({ actor: workflow.actor }) 
                });
                continue;
            }
            targetUuids.push(i.document.uuid);
        }
        let featureData = await mba.getItemFromCompendium('mba-premades.MBA Spell Features', 'Pyrotechnics: Explosion', false);
        if (!featureData) {
            ui.notifications.warn("Unable to find item in the compendium! (Pyrotechnics: Explosion)");
            return;
        }
        delete featureData._id;
        featureData.system.save.dc = mba.getSpellDC(workflow.item);
        let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
        let [config, options] = constants.syntheticItemWorkflowOptions(targetUuids);
        let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
        if (!featureWorkflow.failedSaves.size) return;
        let targetEffectData = {
            'name': workflow.item.name,
            'icon': workflow.item.img,
            'origin': workflow.item.uuid,
            'description': "You witnessed a dazzling explosion of colors and are blinded until the end of caster's next turn.",
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
        for (let i of featureWorkflow.failedSaves) await mba.createEffect(i.actor, targetEffectData);
    }
}