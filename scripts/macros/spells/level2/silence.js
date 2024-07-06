import {mba} from "../../../helperFunctions.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) {
        ui.notifications.warn("Unable to find template!");
        return;
    }
    await template.update({
        'flags': {
            'mba-premades': {
                'template': {
                    'castLevel': workflow.castData.castLevel,
                    'itemUuid': workflow.item.uuid,
                    'templateUuid': template.uuid,
                }
            }
        }
    });
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Silence` })
    };
    const effectData = {
        'name': "Silence",
        'icon': "modules/mba-premades/icons/spells/level2/silence.webp",
        'origin': workflow.item.uuid,
        'description': `
            <p>You are inside of the sphere of Silence.</p>
            <p>While inside, you are deafened, immune to thunder damage and are unable to cast any spell that includes a verbal component.</p>
        `,
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Deafened",
                'priority': 20
            },
            {
                'key': 'system.traits.di.value',
                'mode': 2,
                'value': "thunder",
                'priority': 50
            },
            {
                'key': 'flags.midi-qol.fail.spell.vocal',
                'mode': 5,
                'value': 1,
                'priority': 50
            },
        ],
        'flags': {
            'dae': {
                'showIcon': true,
            },
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
    let targets = Array.from(workflow.targets);
    await new Sequence()

        .effect()
        .file("jb2a.moonbeam.01.outro.yellow")
        .atLocation(template)
        .size(0.75, { gridUnits: true })
        .startTime(500)
        .playbackRate(2)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .filter("ColorMatrix", { saturate: -1 })

        .effect()
        .file("jb2a.extras.tmfx.border.circle.outpulse.01.normal")
        .atLocation(template)
        .size(5, { gridUnits: true })
        .delay(750)
        .opacity(0.5)
        .filter("ColorMatrix", { brightness: 0 })
        .belowTokens()

        .effect()
        .file("jb2a.extras.tmfx.border.circle.outpulse.01.normal")
        .atLocation(template)
        .size(9, { gridUnits: true })
        .delay(750)
        .opacity(0.75)
        .filter("ColorMatrix", { brightness: 0 })
        .belowTokens()

        .effect()
        .file("jb2a.cast_generic.earth.01.browngreen.1")
        .atLocation(template)
        .size(2, { gridUnits: true })
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .filter("ColorMatrix", { saturate: -1 })
        .belowTokens()
        .waitUntilFinished(-1000)

        .thenDo(async () => {
            for (let target of targets) {
                new Sequence()

                    .effect()
                    .file("jb2a.markers.mute.purple.03")
                    .attachTo(target)
                    .scaleToObject(1.8)
                    .fadeIn(1000)
                    .fadeOut(1000)
                    .playbackRate(0.85)
                    .persist()
                    .name(`${target.document.name} Silence`)

                    .thenDo(async () => {
                        await mba.createEffect(target.actor, effectData);
                        let conc = await mba.findEffect(target.actor, "Concentrating");
                        if (conc) await mba.removeEffect(conc);
                    })

                    .play()
            }
        })

        .effect()
        .file("jb2a.markers.bubble.loop.blue")
        .attachTo(template)
        .size(9, { gridUnits: true })
        .fadeIn(500)
        .fadeOut(2000)
        .scaleIn(0.1, 1000, { ease: "easeOutBack" })
        .opacity(0.2)
        .zIndex(2)
        .filter("ColorMatrix", { saturate: -1, brightness: 0 })
        .belowTokens()
        .persist()
        .name(`Silence`)

        .effect()
        .file("jb2a.wall_of_force.sphere.grey")
        .attachTo(template)
        .size(9, { gridUnits: true })
        .opacity(0.2)
        .fadeIn(500)
        .fadeOut(2000)
        .scaleIn(0.1, 1000, { ease: "easeOutBack" })
        .zIndex(2)
        .playbackRate(0.8)
        .filter("Glow", { color: 0x000000, distance: 2.5, innerStrength: 3, outerStrength: 0 })
        .filter("ColorMatrix", { saturate: -1 })
        .persist()
        .name(`Silence`)

        .effect()
        .file("jb2a.extras.tmfx.runes.circle.simple.illusion")
        .attachTo(template)
        .size(2, { gridUnits: true })
        .scaleIn(0, 500, { ease: "easeOutElastic" })
        .fadeOut(2000)
        .playbackRate(0.8)
        .opacity(0.35)
        .belowTokens()
        .filter("ColorMatrix", { saturate: -1, brightness: 0 })
        .persist()
        .name(`Silence`)

        .play()
}

async function enter(template, token) {
    let trigger = template.flags['mba-premades']?.template;
    if (!trigger) return;
    await silence.trigger(token.document, trigger);
}

async function trigger(token, trigger) {
    if (mba.findEffect(token.actor, "Silence")) return;
    let template = await fromUuid(trigger.templateUuid);
    if (!template) return;
    await template.setFlag('mba-premades', 'spell.silence.tokens.' + token.id, token.id);
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Silence` })
    };
    const effectData = {
        'name': "Silence",
        'icon': "modules/mba-premades/icons/spells/level2/silence.webp",
        'origin': trigger.itemUuid,
        'description': `
            <p>You are inside of the sphere of Silence.</p>
            <p>While inside, you are deafened, immune to thunder damage and are unable to cast any spell that includes a verbal component.</p>
        `,
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Deafened",
                'priority': 20
            },
            {
                'key': 'system.traits.di.value',
                'mode': 2,
                'value': "thunder",
                'priority': 50
            },
            {
                'key': 'flags.midi-qol.fail.spell.vocal',
                'mode': 5,
                'value': 1,
                'priority': 50
            },
        ],
        'flags': {
            'dae': {
                'showIcon': true,
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 2,
                    castLevel: trigger.castLevel,
                    itemUuid: trigger.itemUuid
                }
            }
        }
    };
    new Sequence()

        .effect()
        .file("jb2a.markers.mute.purple.03")
        .attachTo(token)
        .scaleToObject(1.8)
        .fadeIn(1000)
        .fadeOut(1000)
        .playbackRate(0.85)
        .persist()
        .name(`${token.name} Silence`)

        .thenDo(async () => {
            await mba.createEffect(token.actor, effectData);
            let conc = await mba.findEffect(token.actor, "Concentrating");
            if (conc) await mba.removeEffect(conc);
        })

        .play()
}

async function leave(token, template) {
    await template.unsetFlag('mba-premades', 'spell.silence.tokens.' + token.id, token.id);
    let effect = mba.findEffect(token.actor, 'Silence');
    if (!effect) return;
    let originUuid = template.flags.dnd5e?.origin;
    if (!originUuid) return;
    if (effect.origin != originUuid) return;
    await mba.removeEffect(effect);
}

async function end(template) {
    let tokenIds = template.flags['mba-premades']?.spell?.silence?.tokens;
    if (!tokenIds) return;
    let tokens = Object.keys(tokenIds).map(tokenId => canvas.tokens.get(tokenId));
    for (let token of tokens) {
        let effect = mba.findEffect(token.actor, 'Silence');
        if (!effect) continue;
        let originUuid = template.flags.dnd5e?.origin;
        if (!originUuid) continue;
        if (effect.origin != originUuid) continue;
        await mba.removeEffect(effect);
    }
}

export let silence = {
    'item': item,
    'enter': enter,
    'trigger': trigger,
    'leave': leave,
    'end': end
}