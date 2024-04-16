async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let ammount = workflow.castData.castLevel - 2;
    if (workflow.targets.size <= ammount) return;
    let selection = await chrisPremades.helpers.selectTarget(workflow.item.name, chrisPremades.constants.okCancel, Array.from(workflow.targets), false, 'multiple', undefined, false, 'Too many targets selected. Choose which targets to keep (Max: ' + ammount + ')');
    if (!selection.buttons) return;
    let newTargets = selection.inputs.filter(i => i).slice(0, ammount);
    chrisPremades.helpers.updateTargets(newTargets);
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let targets = Array.from(workflow.targets);
    async function effectMacroDel() {
        await Sequencer.EffectManager.endEffects({ name: `${token.document.name} Fly`, object: token })

        new Sequence()

            .animation()
            .on(token)
            .opacity(1)

            .play();
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': "You have flying speed of 60 feet for the duration. When the spell ends, you instantly fall if you are still aloft, unless you can stop the fall.",
        'duration': {
            'seconds': 600
        },
        'changes': [
            {
                'key': 'system.attributes.movement.fly',
                'mode': 2,
                'value': 60,
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
                    baseLevel: 3,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    for (let target of targets) {
        await new Sequence()

            .effect()
            .file("animated-spell-effects-cartoon.energy.pulse.yellow")
            .atLocation(target, { offset: { y: 0.2 }, gridUnits: true })
            .size({ width: target.document.width * 1.5, height: target.document.width * 1.45 }, { gridUnits: true })
            .belowTokens()
            .filter("ColorMatrix", { hue: -10 })
            .zIndex(1)

            .effect()
            .file("animated-spell-effects-cartoon.smoke.105")
            .atLocation(target, { offset: { y: 0.05 }, gridUnits: true })
            .opacity(1)
            .scaleToObject(2)
            .tint("#FFd129")
            .belowTokens()

            .animation()
            .on(target)
            .opacity(0)

            .effect()
            .from(target)
            .attachTo(target, { bindAlpha: false, followRotation: true, locale: false })
            .scaleToObject(1, { considerTokenScale: true })
            .opacity(1)
            .duration(800)
            .animateProperty("sprite", "position.y", { from: 50, to: -10, duration: 500, ease: "easeOutBack" })
            .loopProperty("sprite", "position.y", { from: 0, to: -50, duration: 2500, pingPong: true, delay: 1000 })
            .filter("Glow", { color: 0xFFd129, distance: 10, outerStrength: 4, innerStrength: 0 })
            .zIndex(2)
            .fadeOut(500)
            .persist()
            .name(`${target.document.name} Fly`)

            .effect()
            .file("jb2a.particles.outward.orange.02.04")
            .scaleToObject(1.35, { considerTokenScale: true })
            .attachTo(target, { bindAlpha: false })
            .opacity(1)
            .duration(800)
            .animateProperty("sprite", "position.y", { from: 50, to: -10, duration: 500, ease: "easeOutBack" })
            .loopProperty("sprite", "position.y", { from: 0, to: -50, duration: 2500, pingPong: true, delay: 1000 })
            .fadeIn(1000)
            .zIndex(2.2)
            .fadeOut(500)
            .persist()
            .name(`${target.document.name} Fly`)

            .effect()
            .from(target)
            .atLocation(target)
            .scaleToObject(0.9)
            .duration(1000)
            .opacity(0.5)
            .belowTokens()
            .filter("ColorMatrix", { brightness: -1 })
            .filter("Blur", { blurX: 5, blurY: 10 })
            .attachTo(target, { bindAlpha: false })
            .zIndex(1)
            .fadeOut(500)
            .persist()
            .name(`${target.document.name} Fly`)

            .play();

        await chrisPremades.helpers.createEffect(target.actor, effectData)
    }
}

export let fly = {
    'cast': cast,
    'item': item
}