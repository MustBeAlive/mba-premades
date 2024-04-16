export async function borrowedKnowledge({ speaker, actor, token, character, item, args, scope, workflow }) {
    let options = Object.entries(CONFIG.DND5E.skills).filter(([key, value]) => workflow.actor.system.skills[key].value < 1).map(([i, j]) => ({ 'value': i, 'html': j.label }));
    let choices = [];
    for (let i = 0; i < options.length; i++) {
        choices.push([options[i].html, options[i].value]);
    }
    let selection = await chrisPremades.helpers.dialog('Choose one of the skills:', choices);
    if (!selection) {
        return;
    }
    async function effectMacroDel() {
        await Sequencer.EffectManager.endEffects({ name: `${token.document.name} Borrowed Knowledge` })
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': "For the next hour, you are proficient in one skill of your choosing.",
        'duration': {
            'seconds': 3600
        },
        'changes': [
            {
                'key': 'system.skills.' + selection + '.value',
                'mode': 4,
                'value': 1,
                'priority': 20
            }
        ],
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
    let effect = chrisPremades.helpers.findEffect(workflow.actor, workflow.item.name);
    if (effect) await chrisPremades.helpers.removeEffect(effect);

    let offset = [
        { x: 0, y: -0.55 },
        { x: -0.5, y: -0.15 },
        { x: -0.3, y: 0.45 },
        { x: 0.3, y: 0.45 },
        { x: 0.5, y: -0.15 }
    ];

    await new Sequence()

        .wait(50)

        .thenDo(function () {
            for (let i = 0; i < offset.length; i++) {

                new Sequence()

                    .effect()
                    .delay(250)
                    .file("jb2a.icon.runes02.yellow")
                    .attachTo(token, { offset: offset[i], gridUnits: true, followRotation: false })
                    .scaleToObject(0.4)
                    .scaleIn(0, 250, { ease: "easeOutBack" })
                    .animateProperty("sprite", "position.x", { from: -0, to: -offset[i].x, duration: 500, gridUnits: true, delay: 500, ease: "easeInBack" })
                    .animateProperty("sprite", "position.y", { from: -0, to: -offset[i].y, duration: 500, gridUnits: true, delay: 500, ease: "easeInBack" })
                    .zIndex(1)
                    .duration(1150)

                    .effect()
                    .file("jb2a.template_circle.out_pulse.02.burst.yellowwhite")
                    .attachTo(token, { offset: offset[i], gridUnits: true })
                    .scaleToObject(0.5)
                    .opacity(0.5)

                    .play()

            }
        })

        .wait(1250)

        .effect()
        .file("jb2a.energy_attack.01.orange")
        .attachTo(token, { followRotation: false })
        .scaleToObject(2.25)
        .belowTokens()
        .startTime(500)
        .endTime(2050)
        .fadeOut(400)
        .randomRotation()

        .effect()
        .file("jb2a.impact.010.orange")
        .attachTo(token)
        .scaleToObject(0.9)
        .zIndex(2)
        .waitUntilFinished(-1000)

        .effect()
        .file("jb2a.template_circle.symbol.normal.runes.orange")
        .attachTo(token)
        .scaleToObject(1.5)
        .fadeIn(500)
        .randomRotation()
        .mask(token)
        .persist()
        .name(`${token.document.name} Borrowed Knowledge`)

        .effect()
        .file("jb2a.extras.tmfx.outflow.circle.01")
        .attachTo(token, { cacheLocation: true, offset: { y: 0 }, gridUnits: true, bindAlpha: false })
        .scaleToObject(1.55, { considerTokenScale: true })
        .randomRotation()
        .fadeIn(500)
        .fadeOut(2500)
        .belowTokens()
        .opacity(0.45)
        .loopProperty("alphaFilter", "alpha", { from: 0.75, to: 1, duration: 1500, pingPong: true, ease: "easeOutSine" })
        .tint("#c77400")
        .persist()
        .name(`${token.document.name} Borrowed Knowledge`)

        .effect()
        .from(token)
        .attachTo(token, { bindAlpha: false })
        .belowTokens()
        .mirrorX(token.document.data.mirrorX)
        .scaleToObject(1, { considerTokenScale: true })
        .loopProperty("alphaFilter", "alpha", { from: 0.75, to: 1, duration: 1500, pingPong: true, ease: "easeOutSine" })
        .filter("Glow", { color: 0xc77400, distance: 3, outerStrength: 4, innerStrength: 0 })
        .fadeIn(500)
        .zIndex(0.1)
        .persist()
        .name(`${token.document.name} Borrowed Knowledge`)

        .play()

    await chrisPremades.helpers.createEffect(workflow.actor, effectData);
}