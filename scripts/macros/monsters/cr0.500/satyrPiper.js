import {mba} from "../../../helperFunctions.js";

// To do: condition immunity check

async function panpipesCast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let targets = Array.from(workflow.targets).filter(i => !mba.checkTrait(i.actor, 'ci', "charmed") && !mba.findEffect(i.actor, "Deafened") && !i.document.name.includes("Satyr") && i.document.uuid != workflow.token.document.uuid && !mba.findEffect(i.actor, "Satyr Panpipes: Immune") && !mba.findEffect(i.actor, "Satyr Panpipes: Charming Melody") && !mba.findEffect(i.actor, "Satyr Panpipes: Frightening Strain") && !mba.findEffect(i.actor, "Satyr Panpipes: Gentle Lullaby"));
    if (!targets.length) {
        ui.notifications.warn("No targets can be affected, returning!");
        mba.updateTargets();
        return false;
    }
    let newTargets = [];
    for (let target of targets) newTargets.push(target.document.id);
    mba.updateTargets(newTargets);
    new Sequence()

        .effect()
        .file("jb2a.impact_themed.music_note.02.pink")
        .attachTo(workflow.token)
        .scale(1)

        .effect()
        .file("jb2a.template_circle.symbol.out_flow.music_note.purple")
        .attachTo(workflow.token)
        .size(12, { gridUnits: true })
        .fadeIn(2500)
        .scaleIn(0, 2500, { ease: "easeOutCubic" })
        .duration(10000)
        .fadeOut(2500)

        .play()
}

async function panpipesItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    let immuneData = {
        'name': "Satyr Panpipes: Immune",
        'icon': "modules/mba-premades/icons/generic/generic_buff.webp",
        'description': `For the next 24 hours you are immune to the effects of Satyr Pipes.`,
        'duration': {
            'seconds': 86400
        }
    };
    if (workflow.saves.size) {
        for (let target of workflow.saves) await mba.createEffect(target.actor, immuneData);
    }
    if (!workflow.failedSaves.size) return;
    let targets = Array.from(workflow.failedSaves);
    let choices = [["Charming Melody (Charm)", "charm"], ["Frightening Strain (Fear)", "fear"], ["Gentle Lullaby (Sleep)", "sleep"]];
    let selection = await mba.dialog("Satyr Panpipes", choices, "Select magical melody effect:");
    if (!selection) return;
    async function effectMacroDel() {
        let immuneData = {
            'name': "Satyr Pipes: Immune",
            'icon': "modules/mba-premades/icons/generic/generic_buff.webp",
            'description': `For the next 24 hours you are immune to the effects of Satyr Pipes.`,
            'duration': {
                'seconds': 86400
            }
        };
        await mbaPremades.helpers.createEffect(actor, immuneData);
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Panpipes`, object: token })
    }
    let effectData;
    if (selection === "charm") {
        effectData = {
            'name': "Satyr Panpipes: Charming Melody",
            'icon': workflow.item.img,
            'origin': workflow.item.uuid,
            'description': `
                <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.SVd8xu3mTZMqz8fL]{Charmed} by magical melody of Satyr Pipes.</p>
                <p>You can repeat the saving throw at the end of each of your turns, ending the effect on a success.</p>
                <p>The effect ends early if you take damage from Satyr or any of its companions.</p>
                <p>After the effect ends or you succeed on save, you are immune to any effect of Satyr Panpipes for the next 24 hours.</p>
            `,
            'duration': {
                'seconds': 60
            },
            'changes': [
                {
                    'key': 'macro.CE',
                    'mode': 0,
                    'value': "Charmed",
                    'priority': 20
                },
                {
                    'key': 'flags.midi-qol.OverTime',
                    'mode': 0,
                    'value': `turn=end, saveAbility=wis, saveDC=${workflow.item.system.save.dc}, saveMagic=true, name=Restrain: Action Save (DC${workflow.item.system.save.dc}), killAnim=true`,
                    'priority': 20
                }
            ],
            'flags': {
                'effectmacro': {
                    'onDelete': {
                        'script': mba.functionToString(effectMacroDel)
                    }
                }
            }
        };
    }
    else if (selection === "fear") {
        effectData = {
            'name': "Satyr Panpipes: Frightening Strain",
            'icon': workflow.item.img,
            'origin': workflow.item.uuid,
            'description': `
                <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.oR1wUvem3zVVUv5Q]{Frightened} by magical melody of Satyr Pipes.</p>
                <p>You can repeat the saving throw at the end of each of your turns, ending the effect on a success.</p>
                <p>After the effect ends or you succeed on save, you are immune to any effect of Satyr Panpipes for the next 24 hours.</p>
            `,
            'duration': {
                'seconds': 60
            },
            'changes': [
                {
                    'key': 'macro.CE',
                    'mode': 0,
                    'value': "Frightened",
                    'priority': 20
                },
                {
                    'key': 'flags.midi-qol.OverTime',
                    'mode': 0,
                    'value': `turn=end, saveAbility=wis, saveDC=${workflow.item.system.save.dc}, saveMagic=true, name=Restrain: Action Save (DC${workflow.item.system.save.dc}), killAnim=true`,
                    'priority': 20
                }
            ],
            'flags': {
                'effectmacro': {
                    'onDelete': {
                        'script': mba.functionToString(effectMacroDel)
                    }
                }
            }
        };
    }
    else if (selection === "sleep") {
        effectData = {
            'name': "Satyr Panpipes: Gentle Lullaby",
            'icon': workflow.item.img,
            'origin': workflow.item.uuid,
            'description': `
                <p>You are put to sleep by magical melody of Satyr Pipes and fall @UUID[Compendium.mba-premades.MBA SRD.Item.kIUR1eRcTTtaMFao]{Unconscious}.</p>
                <p>You can repeat the saving throw at the end of each of your turns, ending the effect on a success.</p>
                <p>The effect ends early if you take damage or if someone takes an action to shake you awake.</p>
                <p>After the effect ends or you succeed on save, you are immune to any effect of Satyr Panpipes for the next 24 hours.</p>
            `,
            'duration': {
                'seconds': 60
            },
            'changes': [
                {
                    'key': 'macro.CE',
                    'mode': 0,
                    'value': "Unconscious",
                    'priority': 20
                },
                {
                    'key': 'flags.midi-qol.OverTime',
                    'mode': 0,
                    'value': `turn=end, saveAbility=wis, saveDC=${workflow.item.system.save.dc}, saveMagic=true, name=Restrain: Action Save (DC${workflow.item.system.save.dc}), killAnim=true`,
                    'priority': 20
                }
            ],
            'flags': {
                'effectmacro': {
                    'onDelete': {
                        'script': mba.functionToString(effectMacroDel)
                    }
                }
            }
        };
    }
    for (let target of targets) {

        new Sequence()

            .effect()
            .file("jb2a.markers.music.purplepink")
            .attachTo(target)
            .scaleToObject(1.5 * target.document.texture.scaleX)
            .fadeIn(500)
            .fadeOut(1000)
            .duration(2000)


            .effect()
            .file("jb2a.markers.music_note.purple.03")
            .delay(1000)
            .attachTo(target)
            .scaleToObject(2.2)
            .playbackRate(1)
            .center()
            .fadeIn(500)
            .fadeOut(1000)
            .persist()
            .name(`${target.document.name} Panpipes`)


            .effect()
            .file("jb2a.template_circle.symbol.normal.music_note.purple")
            .delay(1000)
            .attachTo(target)
            .scaleToObject(1.6 * target.document.texture.scaleX)
            .mask(target)
            .fadeIn(500)
            .fadeOut(1000)
            .persist()
            .name(`${target.document.name} Panpipes`)

            .thenDo(async () => {
                await mba.createEffect(target.actor, effectData);
            })

            .play()
    }
}

export let satyrPiper = {
    'panpipesCast': panpipesCast,
    'panpipesItem': panpipesItem
}