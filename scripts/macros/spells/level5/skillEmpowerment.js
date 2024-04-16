// Based on CPR macro (imo, buttons > dropdown)
export async function skillEmpowerment({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let options = Object.entries(CONFIG.DND5E.skills).filter(([key, value]) => target.actor.system.skills[key].value === 1).map(([i, j]) => ({ 'value': i, 'html': j.label }));
    let choices = [];
    for (let i = 0; i < options.length; i++) {
        choices.push([options[i].html, options[i].value]);
    }
    let selection = await chrisPremades.helpers.dialog('Choose one of the skills:', choices);
    if (!selection) return;
    async function effectMacroDel() {
        await Sequencer.EffectManager.endEffects({ name: `${token.document.name} Skill Empowerment` })
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': "For the next hour, you have expertise in one skill of your choosing.",
        'duration': {
            'seconds': 3600
        },
        'changes': [
            {
                'key': 'system.skills.' + selection + '.value',
                'mode': 4,
                'value': 2,
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
                    baseLevel: 5,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };

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
                    .attachTo(target, { offset: offset[i], gridUnits: true, followRotation: false })
                    .scaleToObject(0.4)
                    .scaleIn(0, 250, { ease: "easeOutBack" })
                    .animateProperty("sprite", "position.x", { from: -0, to: -offset[i].x, duration: 500, gridUnits: true, delay: 500, ease: "easeInBack" })
                    .animateProperty("sprite", "position.y", { from: -0, to: -offset[i].y, duration: 500, gridUnits: true, delay: 500, ease: "easeInBack" })
                    .zIndex(1)
                    .duration(1150)

                    .effect()
                    .file("jb2a.template_circle.out_pulse.02.burst.yellowwhite")
                    .attachTo(target, { offset: offset[i], gridUnits: true })
                    .scaleToObject(0.5)
                    .opacity(0.5)

                    .play()

            }
        })

        .wait(1250)

        .effect()
        .file("jb2a.energy_attack.01.orange")
        .attachTo(target, { followRotation: false })
        .scaleToObject(2.25)
        .belowTokens()
        .startTime(500)
        .endTime(2050)
        .fadeOut(400)
        .randomRotation()

        .effect()
        .file("jb2a.impact.010.orange")
        .attachTo(target)
        .scaleToObject(0.9)
        .zIndex(2)
        .waitUntilFinished(-1000)

        .thenDo(function () {
            chrisPremades.helpers.createEffect(target.actor, effectData);
        })

        .effect()
        .file("jb2a.icon.runes.yellow")
        .from(target, { cacheLocation: true })
        .attachTo(target)
        .scale(0.5)
        .fadeIn(300)
        .fadeOut(1000)
        .aboveLighting()
        .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 20000, delay: 500 })
        .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: 16000 })
        .spriteOffset({ x: 0.5 }, { gridUnits: true })
        .rotate((360 / 6) * 1)
        .persist()
        .name(`${target.document.name} Skill Empowerment 1`)

        .effect()
        .file("jb2a.icon.runes02.yellow")
        .from(target, { cacheLocation: true })
        .attachTo(target)
        .scale(0.5)
        .fadeIn(300)
        .fadeOut(1000)
        .aboveLighting()
        .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 20000, delay: 500 })
        .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: 16000 })
        .spriteOffset({ x: 0.5 }, { gridUnits: true })
        .rotate((360 / 6) * 2)
        .persist()
        .name(`${target.document.name} Skill Empowerment 2`)

        .effect()
        .file("jb2a.icon.runes03.yellow")
        .from(target, { cacheLocation: true })
        .attachTo(target)
        .scale(0.5)
        .fadeIn(300)
        .fadeOut(1000)
        .aboveLighting()
        .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 20000, delay: 500 })
        .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: 16000 })
        .spriteOffset({ x: 0.5 }, { gridUnits: true })
        .rotate((360 / 6) * 3)
        .persist()
        .name(`${target.document.name} Skill Empowerment 3`)

        .effect()
        .file("jb2a.icon.runes.yellow")
        .from(target, { cacheLocation: true })
        .attachTo(target)
        .scale(0.5)
        .fadeIn(300)
        .fadeOut(1000)
        .aboveLighting()
        .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 20000, delay: 500 })
        .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: 16000 })
        .spriteOffset({ x: 0.5 }, { gridUnits: true })
        .rotate((360 / 6) * 4)
        .persist()
        .name(`${target.document.name} Skill Empowerment 4`)

        .effect()
        .file("jb2a.icon.runes02.yellow")
        .from(target, { cacheLocation: true })
        .attachTo(target)
        .scale(0.5)
        .fadeIn(300)
        .fadeOut(1000)
        .aboveLighting()
        .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 20000, delay: 500 })
        .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: 16000 })
        .spriteOffset({ x: 0.5 }, { gridUnits: true })
        .rotate((360 / 6) * 5)
        .persist()
        .name(`${target.document.name} Skill Empowerment 5`)

        .effect()
        .file("jb2a.icon.runes03.yellow")
        .from(target, { cacheLocation: true })
        .attachTo(target)
        .scale(0.5)
        .fadeIn(300)
        .fadeOut(1000)
        .aboveLighting()
        .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 20000, delay: 500 })
        .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: 16000 })
        .spriteOffset({ x: 0.5 }, { gridUnits: true })
        .rotate((360 / 6) * 6)
        .persist()
        .name(`${target.document.name} Skill Empowerment 6`)

        .play()
}