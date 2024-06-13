import {mba} from "../../../../helperFunctions.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let druidLevel = workflow.actor.classes.druid?.system?.levels;
    if (!druidLevel) {
        ui.notifications.warn("Actor has no Druid levels!");
        return;
    }
    let effect = await mba.findEffect(workflow.actor, "Symbiotic Entity");
    if (effect) {
        let remove = await mba.dialog("Symbiotic Enitity", [["Proceed with recasting (delete old effect)", true], ["Nothing, cancel", false]], `<b>You are under the effects of Symbiotic Entity. What would you like to do?</b>`);
        if (!remove || remove === false) return;
        await mba.removeEffect(effect);
    }
    async function effectMacroEveryTurn() {
        let temphp = actor.system.attributes.hp.temp;
        let effect = await mbaPremades.helpers.findEffect(actor, "Symbiotic Entity");
        if (!effect) {
            ui.notifications.warn("Unable to find effect!");
            return;
        }
        if (temphp > 1) return;
        await mbaPremades.helpers.removeEffect(effect);
    };
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Symbiotic Entity`, object: token });
        if (actor.system.attributes.hp.temp > 0) actor.update({ "system.attributes.hp.temp": 0 })
    };
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You channeled your magic to awaken the spores surrounding you, gaining ${druidLevel * 4} temporary hit points. While this feature is active, you gain the following benefits:</p>
            <p>• When you deal your Halo of Spores damage, roll the damage die a second time and add it to the total.</p>
            <p>• Your melee weapon attacks deal an extra 1d6 necrotic damage to any target they hit.</p>
            <p>These benefits last for 10 minutes, until you lose all these temporary hit points, or until you use your Wild Shape again.</p>
        `,
        'duration': {
            'seconds': 600
        },
        'changes': [
            {
                'key': 'system.bonuses.mwak.damage',
                'mode': 2,
                'value': `+1d6[necrotic]`,
                'priority': 20
            },
        ],
        'flags': {
            'effectmacro': {
                'onEachTurn': {
                    'script': mba.functionToString(effectMacroEveryTurn)
                },
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };

    new Sequence()

        .effect()
        .file("jb2a.plant_growth.01.ring.4x4.complete.bluepurple")
        .atLocation(token)
        .scaleToObject(2.25)
        .playbackRate(2)
        .filter("ColorMatrix", { hue: -60 })
        .belowTokens()
        .zIndex(1)

        .effect()
        .file("animated-spell-effects-cartoon.smoke.07")
        .atLocation(token)
        .scaleToObject(2.5)
        .playbackRate(1)
        .belowTokens()
        .opacity(0.6)
        .tint("#54e399")
        .zIndex(2)

        .effect()
        .file("jb2a.particles.outward.greenyellow.01.03")
        .atLocation(token)
        .size(2, { gridUnits: true })
        .scaleIn(0.15, 750, { ease: "easeOutQuint" })
        .duration(1500)
        .fadeOut(1500)
        .randomRotation()
        .filter("ColorMatrix", { saturate: 1, hue: 60 })
        .zIndex(5)

        .effect()
        .file("jb2a.shield_themed.above.eldritch_web.01.dark_green")
        .atLocation(token)
        .scaleToObject(2.5)
        .duration(3875)
        .fadeIn(1500)
        .fadeOut(1000)
        .startTime(4900)
        .filter("Glow", { color: 0x54e399, knockout: true, distance: 1, outerStrength: 2 })
        .randomRotation()
        .belowTokens()
        .opacity(0.5)
        .noLoop()

        .effect()
        .file("jb2a.fireflies.few.01.green")
        .atLocation(token, { offset: { x: 0.5 * token.document.width, y: -0.5 * token.document.width }, gridUnits: true, randomOffset: 0.5, followRotation: false })
        .scaleToObject(1.5)
        .duration(4000)
        .fadeIn(250)
        .fadeOut(500)
        .randomRotation()
        .opacity(0.8)
        .filter("ColorMatrix", { hue: 60 })
        .zIndex(1)

        .effect()
        .file("jb2a.fireflies.few.02.green")
        .atLocation(token, { offset: { x: -0.5 * token.document.width, y: 0.5 * token.document.width }, gridUnits: true, randomOffset: 0.5, followRotation: false })
        .scaleToObject(1.5)
        .duration(4000)
        .fadeIn(250)
        .fadeOut(500)
        .randomRotation()
        .opacity(0.8)
        .filter("ColorMatrix", { hue: 60 })
        .zIndex(1)

        .effect()
        .file("jb2a.fireflies.few.01.green")
        .atLocation(token, { offset: { x: -0.5 * token.document.width, y: -0.5 * token.document.width }, gridUnits: true, randomOffset: 0.5, followRotation: false })
        .scaleToObject(1.5)
        .duration(4000)
        .fadeIn(250)
        .fadeOut(500)
        .randomRotation()
        .opacity(0.8)
        .filter("ColorMatrix", { hue: 60 })
        .zIndex(1)

        .effect()
        .file("jb2a.fireflies.few.02.green")
        .atLocation(token, { offset: { x: 0.5 * token.document.width, y: 0.5 * token.document.width }, gridUnits: true, randomOffset: 0.5, followRotation: false })
        .scaleToObject(1.5)
        .fadeIn(250)
        .fadeOut(500)
        .randomRotation()
        .duration(4000)
        .opacity(0.8)
        .filter("ColorMatrix", { hue: 60 })
        .zIndex(1)

        .effect()
        .file("jb2a.arms_of_hadar.dark_green")
        .attachTo(token)
        .scaleToObject(1.4)
        .scaleIn(0, 500, { ease: "easeOutBack" })
        .fadeOut(500)
        .filter("ColorMatrix", { hue: 40 })
        .belowTokens()
        .zIndex(1)
        .persist()
        .name(`${token.document.name} Symbiotic Entity`)

        .effect()
        .file("jb2a.fireflies.many.02.green")
        .attachTo(token, { randomOffset: 0 })
        .scaleToObject(1.5)
        .duration(3000)
        .fadeIn(250)
        .fadeOut(500)
        .randomRotation()
        .opacity(0.8)
        .filter("ColorMatrix", { hue: 60 })
        .persist()
        .name(`${token.document.name} Symbiotic Entity`)

        .wait(200)

        .thenDo(async () => {
            await mba.createEffect(workflow.actor, effectData);
            await mba.applyDamage([workflow.token], (druidLevel * 4), "temphp");
        })

        .play()
}

export let symbioticEntity = {
    'item': item,
}