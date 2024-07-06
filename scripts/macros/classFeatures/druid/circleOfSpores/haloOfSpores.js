import {constants} from "../../../generic/constants.js";
import {mba} from "../../../../helperFunctions.js";

async function combatStart(token, origin) {
    await origin.use()
    let effect = await mba.findEffect(token.actor, "Halo of Spores");
    let [template] = game.canvas.scene.templates.filter(t => t.flags.dnd5e.origin === origin.uuid);
    let updates = {
        'flags': {
            'mba-premades': {
                'feature': {
                    'haloOfSpores': {
                        'templateUuid': template.uuid
                    }
                }
            }
        }
    };
    await mba.updateEffect(effect, updates);
    await template.update({
        'x': token.center.x,
        'y': token.center.y,
        'flags': {
            'mba-premades': {
                'template': {
                    'name': "haloOfSpores",
                    'level': token.actor.classes.druid?.system?.levels,
                    'saveDC': mba.getSpellDC(origin),
                    'sourceUuid': token.document.uuid,
                    'templateUuid': template.uuid,
                    'macroName': 'haloOfSpores'
                }
            },
            'walledtemplates': {
                'hideBorder': "alwaysHide",
                'wallRestriction': 'light',
                'wallsBlock': 'recurse'
            }
        }
    });
    await tokenAttacher.attachElementsToToken([template], token, false);
}

async function combatEnd(token) {
    let effect = await mba.findEffect(token.actor, "Halo of Spores");
    if (!effect) {
        console.log("unable to find effect");
        return;
    }
    let template = await fromUuid(effect.flags['mba-premades']?.feature?.haloOfSpores?.templateUuid);
    if (!template) {
        console.log("unable to find template");
        return;
    }
    await canvas.scene.deleteEmbeddedDocuments("MeasuredTemplate", [template._id]);
}

async function enter(template, token) {
    let trigger = template.flags['mba-premades']?.template;
    if (!trigger) return;
    await haloOfSpores.trigger(token.document, trigger);
}

async function trigger(token, trigger) {
    let template = await fromUuid(trigger.templateUuid);
    if (!template) {
        console.log("unable to find template");
        return;
    }
    let sourceDoc = await fromUuid(trigger.sourceUuid);
    if (!sourceDoc) {
        console.log("unable to find source token document");
        return;
    }
    if (mba.findEffect(sourceDoc.actor, "Reaction")) return;
    if (mba.findEffect(sourceDoc.actor, "Spreading Spores")) return;
    if (token.uuid === sourceDoc.uuid) return;
    if (token.disposition === sourceDoc.disposition) return;
    let choices = [[`Yes (Saving Throw)`, true], [`No (Cancel)`, false]];
    let check = await mba.remoteDialog("Halo of Spores", choices, mba.firstOwner(sourceDoc).id, `<p><b>${token.name}</b> is in the area of your <b>Halo of Spores</b>.</p><p>Would you like to use your <b>reaction</b>?</p>`);
    if (!check || check === false) return;
    let diceAmmount = 1;
    let symbioticEntity = await mba.findEffect(sourceDoc.actor, "Symbiotic Entity");
    if (symbioticEntity) diceAmmount = 2;
    let diceSize = 4;
    let level = trigger.level;
    if (level >= 6 && level < 10) diceSize = 6;
    else if (level >= 10 && level < 14) diceSize = 8;
    else if (level >= 14) diceSize = 10;
    let damageFormula = `${diceAmmount}d${diceSize}[necrotic]`;
    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Class Feature Items', 'Halo of Spores: Decay', false);
    if (!featureData) return;
    delete featureData._id;
    featureData.system.save.dc = trigger.saveDC;
    featureData.system.damage.parts[0][0] = damageFormula;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': sourceDoc.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([token.uuid]);

    new Sequence()

        .effect()
        .file("jb2a.spirit_guardians.green.particles")
        .atLocation(sourceDoc.object, { randomOffset: 0 })
        .filter("ColorMatrix", { hue: 60 })
        .size(3.5 + sourceDoc.width, { gridUnits: true })
        .duration(3000)
        .belowTokens()
        .fadeIn(500)
        .fadeOut(500)
        .opacity(0.45)

        .effect()
        .file("jb2a.fireflies.many.02.green")
        .attachTo(sourceDoc.object, { randomOffset: 0 })
        .scaleToObject(1.5)
        .fadeIn(500)
        .fadeOut(500)
        .randomRotation()
        .duration(3000)
        .opacity(0.8)
        .filter("ColorMatrix", { hue: 60 })

        .effect()
        .file("jb2a.sleep.cloud.01.green")
        .attachTo(sourceDoc.object)
        .scaleToObject(1.75)
        .belowTokens()
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .filter("ColorMatrix", { hue: 60 })
        .duration(3000)
        .fadeIn(500)
        .fadeOut(500)

        .effect()
        .file("jb2a.fireflies.many.02.green")
        .atLocation(token, { randomOffset: 0 })
        .scaleToObject(1.5)
        .fadeIn(500)
        .randomRotation()
        .scaleOut(0, 1000, { ease: "easeInBack" })
        .duration(1500)
        .opacity(0.8)
        .repeats(2, 100, 100)
        .filter("ColorMatrix", { hue: 60 })

        .effect()
        .delay(250)
        .file("jb2a.cast_generic.ice.01.blue")
        .atLocation(token)
        .scaleToObject(1)
        .playbackRate(2)
        .filter("ColorMatrix", { hue: -60 })
        .waitUntilFinished(0)

        .effect()
        .file("animated-spell-effects-cartoon.energy.pulse.green")
        .atLocation(token)
        .scaleToObject(1.25)
        .playbackRate(1)
        .filter("ColorMatrix", { hue: 60 })

        .effect()
        .file("jb2a.impact.004.green")
        .atLocation(token)
        .scaleToObject(2)
        .playbackRate(1)
        .belowTokens()
        .filter("ColorMatrix", { hue: 60 })

        .effect()
        .from(token)
        .attachTo(token)
        .fadeIn(200)
        .fadeOut(500)
        .loopProperty("sprite", "position.x", { from: -0.05, to: 0.05, duration: 50, pingPong: true, gridUnits: true })
        .scaleToObject(1, { considerTokenScale: true })
        .duration(1500)
        .opacity(0.25)

        .effect()
        .file("jb2a.particles.outward.greenyellow.01.03")
        .scaleToObject(2)
        .scaleIn(0.15, 750, { ease: "easeOutQuint" })
        .fadeOut(1500)
        .atLocation(token)
        .duration(1500)
        .randomRotation()
        .filter("ColorMatrix", { saturate: 1, hue: 60 })
        .zIndex(5)

        .play()

    await mba.addCondition(sourceDoc.actor, "Reaction");
    await MidiQOL.completeItemUse(feature, config, options);
}

export let haloOfSpores = {
    'combatStart': combatStart,
    'combatEnd': combatEnd,
    'enter': enter,
    'trigger': trigger
}