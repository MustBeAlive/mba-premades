import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let queueSetup = await queue.setup(workflow.item.uuid, 'fireStorm', 50);
    if (!queueSetup) return;
    let templateData = {
        't': 'rect',
        'user': game.user,
        'distance': 14.14,
        'direction': 45,
        'x': 3080,
        'y': 1680,
        'fillColor': game.user.color,
        'flags': {
            'dnd5e': {
                'origin': workflow.item.uuid
            },
            'walledtemplates': {
                'hideBorder': "alwaysHide"
            }
        },
        'width': 10,
        'angle': 0
    };
    let templateDoc = new CONFIG.MeasuredTemplate.documentClass(templateData, { 'parent': canvas.scene });
    let templates = [];
    ui.notifications.info("Place up to 10 templates. Right click to finish.");
    for (let i = 0; i < 10; i++) {
        let template = new game.dnd5e.canvas.AbilityTemplate(templateDoc);
        try {
            let [finalTemplate] = await template.drawPreview();
            templates.push(finalTemplate);
        } catch {/* empty */ }
        if (templates.length != i + 1) break;
    }
    if (!templates.length) {
        queue.remove(workflow.item.uuid);
        return;
    }
    let targets = new Set();
    for (let i of templates) {
        let position = i.object.ray.project(0.5);
        new Sequence()

            .effect()
            .file('animated-spell-effects-cartoon.fire.19')
            .atLocation(position)
            .size(3.5, { gridUnits: true })
            .persist()
            .name("FirSto")

            .play();

        let tokens = mba.templateTokens(i);
        if (!tokens.length) continue;
        for (let j of tokens) targets.add(j);
    }
    console.log(targets);
    mba.updateTargets(Array.from(targets));
    async function effectMacro() {
        let templates = effect.flags['mba-premades']?.spell?.fireStorm?.templates;
        if (!templates) return;
        for (let i of templates) {
            let template = await fromUuid(i);
            if (!template) continue;

            new Sequence()

                .thenDo(async () => {
                    Sequencer.EffectManager.endEffects({ name: `FirSto` })
                })

                .effect()
                .file("animated-spell-effects-cartoon.fire.57")
                .atLocation(template)
                .scaleToObject(2)
                .randomRotation()

                .effect()
                .file("animated-spell-effects-cartoon.fire.15")
                .atLocation(template)
                .playbackRate(0.8)
                .scaleToObject(2)
                .randomRotation()

                .effect()
                .file("animated-spell-effects-cartoon.fire.37")
                .atLocation(template)
                .scaleToObject(2)
                .randomRotation()
                .playbackRate(0.8)
                .belowTokens()

                .thenDo(async () => {
                    await template.delete();
                })

                .play()
        }
    }
    let effectData = {
        'name': "Fire Storm: Templates",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'flags': {
            'dae': {
                'showIcon': true
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacro)
                }
            },
            'mba-premades': {
                'spell': {
                    'fireStorm': {
                        'templates': templates.map(i => i.uuid)
                    }
                }
            }
        }
    };
    await mba.createEffect(workflow.actor, effectData);
    queue.remove(workflow.item.uuid);
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = await mba.findEffect(workflow.actor, "Fire Storm: Templates");
    if (effect) await mba.removeEffect(effect);
}

export let fireStorm = {
    'cast': cast,
    'item': item
}