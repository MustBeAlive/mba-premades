//Animation by EskieMoh#2969
export async function lightningBolt({ speaker, actor, token, character, item, args, scope, workflow }) {
    let token = workflow.token;
    const template = canvas.scene.collections.templates.get(workflow.templateId);
    new Sequence()
        .thenDo(function () {
            FXMASTER.filters.setFilters([{ "type": "color", "options": { "color": { "apply": true, "value": "#9eecff" }, "saturation": 2, "contrast": 2, "brightness": 0.45, "gamma": 1, "red": 0.6196078431372549, "green": 0.9254901960784314, "blue": 1 } }]);
        })
        .effect()
        .file("jb2a.static_electricity.03.blue")
        .atLocation(token)
        .scaleToObject(1.5)
        .repeats(2, 4000, 4000)

        .effect()
        .file("jb2a.magic_signs.circle.02.evocation.loop.blue")
        .atLocation(token)
        .fadeIn(500)
        .fadeOut(500)
        .scaleToObject(2)
        .duration(5000)
        .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 1000 })
        .zIndex(2)

        .effect()
        .file("jb2a.static_electricity.01.blue")
        .atLocation(token)
        .fadeIn(500)
        .fadeOut(500)
        .scaleToObject(1.35)
        .duration(5000)
        .scaleOut(0.1, 2, { ease: "easeOutQuint", delay: -4000 })
        .zIndex(2)
        .waitUntilFinished(-3000)

        .effect()
        .file("jb2a.impact.011.blue")
        .atLocation(token)
        .scaleToObject(2)
        .zIndex(3)

        .effect()
        .file("animated-spell-effects-cartoon.electricity.blast.03")
        .atLocation(token)
        .filter("ColorMatrix", { hue: -20 })
        .filter("ColorMatrix", { saturate: 1.25 })
        .scale(1)
        .stretchTo(template, { onlyX: true, tiling: true, cacheLocation: true })
        .zIndex(3)

        .effect()
        .file("animated-spell-effects-cartoon.electricity.curves")
        .atLocation(token)
        .scale(0.3)
        .stretchTo(template, { onlyX: true, tiling: true, cacheLocation: true })
        .repeats(5, 500, 1000, 1500)

        .thenDo(function () {
            FXMASTER.filters.setFilters([{ "type": "color", "options": { "color": { "apply": false, "value": "#9eecff" }, "saturation": 1, "contrast": 1, "brightness": 1, "gamma": 1, "red": 0.6196078431372549, "green": 0.9254901960784314, "blue": 1 } }]);
        })
        .play();
}