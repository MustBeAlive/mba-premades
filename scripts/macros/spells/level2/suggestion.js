// Original animation by EskieMoh#2969
export async function suggestion({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let target = workflow.targets.first();
    let charmImmune = chrisPremades.helpers.checkTrait(target.actor, 'ci', 'charmed');
    if (charmImmune) {
        ui.notifications.warn('Target is unaffected by Suggestion!(target is immune to condition: Charmed)');
        await chrisPremades.helpers.removeCondition(workflow.actor, 'Concentrating');
    }
    async function effectMacroDel() {
        await Sequencer.EffectManager.endEffects({ name: `${token.document.name} Suggestion` })
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': "",
        'duration': {
            'seconds': 28800
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
    
    let offset = [
        { x: 0, y: -0.55 },
        { x: -0.5, y: -0.15 },
        { x: -0.3, y: 0.45 },
        { x: 0.3, y: 0.45 },
        { x: 0.5, y: -0.15 }
    ];
    
    await new Sequence()
    
        .effect()
        .atLocation(token)
        .file(`jb2a.magic_signs.circle.02.enchantment.loop.pink`)
        .scaleToObject(1.5)
        .rotateIn(180, 600, { ease: "easeOutCubic" })
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .loopProperty("sprite", "rotation", { from: 0, to: -360, duration: 10000 })
        .belowTokens()
        .fadeOut(2000)
        .zIndex(0)
    
        .effect()
        .atLocation(token)
        .file(`jb2a.magic_signs.circle.02.enchantment.loop.pink`)
        .scaleToObject(1.5)
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
    
        .wait(1500)
    
        .thenDo(function () {
            for (let i = 0; i < offset.length; i++) {
    
                new Sequence()
    
                    .effect()
                    .delay(250)
                    .file("jb2a.icon.runes.green02")
                    .attachTo(target, { offset: offset[i], gridUnits: true, followRotation: false })
                    .scaleToObject(0.4)
                    .scaleIn(0, 250, { ease: "easeOutBack" })
                    .animateProperty("sprite", "position.x", { from: -0, to: -offset[i].x, duration: 500, gridUnits: true, delay: 500, ease: "easeInBack" })
                    .animateProperty("sprite", "position.y", { from: -0, to: -offset[i].y, duration: 500, gridUnits: true, delay: 500, ease: "easeInBack" })
                    .zIndex(1)
                    .duration(1150)
    
                    .effect()
                    .file("jb2a.template_circle.out_pulse.02.burst.bluewhite")
                    .attachTo(target, { offset: offset[i], gridUnits: true })
                    .scaleToObject(0.5)
                    .opacity(0.5)
                    .filter("ColorMatrix", { hue: 280 })
    
                    .play()
    
            }
        })
    
        .wait(1250)
    
        .effect()
        .file("jb2a.energy_attack.01.blue")
        .attachTo(target, { followRotation: false })
        .scaleToObject(2.25)
        .belowTokens()
        .startTime(500)
        .endTime(2050)
        .fadeOut(400)
        .filter("ColorMatrix", { hue: 280 })
        .randomRotation()
    
        .effect()
        .file("jb2a.impact.010.green")
        .attachTo(target)
        .scaleToObject(0.9)
        .zIndex(2)
        .waitUntilFinished(-1000)
    
        .thenDo(function () {
            chrisPremades.helpers.createEffect(target.actor, effectData);
        })
    
        .effect()
        .file("jb2a.template_circle.symbol.normal.runes.green02")
        .attachTo(target)
        .scaleToObject(1.5)
        .fadeIn(500)
        .randomRotation()
        .mask(target)
        .persist()
        .name(`${target.document.name} Suggestion`)
    
        .effect()
        .file("jb2a.extras.tmfx.outflow.circle.01")
        .attachTo(target, { cacheLocation: true, offset: { y: 0 }, gridUnits: true, bindAlpha: false })
        .scaleToObject(1.55, { considerTokenScale: true })
        .randomRotation()
        .fadeIn(500)
        .fadeOut(2500)
        .belowTokens()
        .opacity(0.45)
        .loopProperty("alphaFilter", "alpha", { from: 0.75, to: 1, duration: 1500, pingPong: true, ease: "easeOutSine" })
        .tint("#3efd30")
        .persist()
        .name(`${target.document.name} Suggestion`)
    
        .effect()
        .from(target)
        .attachTo(target, { bindAlpha: false })
        .belowTokens()
        .mirrorX(token.document.data.mirrorX)
        .scaleToObject(1, { considerTokenScale: true })
        .loopProperty("alphaFilter", "alpha", { from: 0.75, to: 1, duration: 1500, pingPong: true, ease: "easeOutSine" })
        .filter("Glow", { color: 0x3efd30, distance: 3, outerStrength: 4, innerStrength: 0 })
        .fadeIn(500)
        .zIndex(0.1)
        .persist()
        .name(`${target.document.name} Suggestion`)
    
        .play()
}