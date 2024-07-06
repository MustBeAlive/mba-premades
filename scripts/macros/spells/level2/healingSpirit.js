import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let images = [
        ["Ape", "ape", "modules/mba-premades/icons/spells/level2/healing_spirit/healing_spirit_ape.webp"],
        ["Badger", "badger", "modules/mba-premades/icons/spells/level2/healing_spirit/healing_spirit_badger.webp"],
        ["Bear", "bear", "modules/mba-premades/icons/spells/level2/healing_spirit/healing_spirit_bear.webp"],
        ["Corgi", "corgi", "modules/mba-premades/icons/spells/level2/healing_spirit/healing_spirit_corgi.webp"],
        ["Cow", "cow", "modules/mba-premades/icons/spells/level2/healing_spirit/healing_spirit_cow.webp"],
        ["Deer", "deer", "modules/mba-premades/icons/spells/level2/healing_spirit/healing_spirit_deer.webp"],
        ["Elk", "elk", "modules/mba-premades/icons/spells/level2/healing_spirit/healing_spirit_elk.webp"],
        ["Goat", "goat", "modules/mba-premades/icons/spells/level2/healing_spirit/healing_spirit_goat.webp"],
        ["Hyena", "hyena", "modules/mba-premades/icons/spells/level2/healing_spirit/healing_spirit_hyena.webp"],
        ["Jackal", "jackal", "modules/mba-premades/icons/spells/level2/healing_spirit/healing_spirit_jackal.webp"],
        ["Lion", "lion", "modules/mba-premades/icons/spells/level2/healing_spirit/healing_spirit_lion.webp"],
        ["Owlbear", "owlbear", "modules/mba-premades/icons/spells/level2/healing_spirit/healing_spirit_owlbear.webp"],
        ["Pig", "pig", "modules/mba-premades/icons/spells/level2/healing_spirit/healing_spirit_pig.webp"],
    ];
    let spiritImage = await mba.selectImage("Healing Spirit", images, "<b>Select spirit image:</b>", "path");
    if (!spiritImage) spiritImage = images[0][2];
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;
    let uses = Math.max(2, mba.getSpellMod(workflow.item) + 1);
    await template.update({
        'flags': {
            'mba-premades': {
                'template': {
                    'castLevel': workflow.castData.castLevel,
                    'casterUuid': workflow.token.document.uuid,
                    'disposition': workflow.token.document.disposition,
                    'image': spiritImage,
                    'macroName': 'healingSpirit',
                    'name': 'healingSpirit',
                    'saveDC': mba.getSpellDC(workflow.item),
                    'templateUuid': template.uuid,
                    'usesCurrent': uses,
                    'usesMax': uses
                }
            }
        }
    });
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Healing Spirit: Move", false);
    if (!featureData) return;
    delete featureData._id;
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `Healing Spirit` });
        await warpgate.revert(token.document, 'Healing Spirit');
    }
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Whenever you or a creature you can see moves into the spirit's space for the first time on a turn or starts its turn there, you can cause the spirit to restore ${workflow.castData.castLevel - 1}d6 hit points to that creature (no action required).</p>
            <p>The spirit can't heal constructs or undead.</p>
            <p>The spirit can heal ${uses} times. After healing that number of times, the spirit disappears.</p>
            <p>As a bonus action on your turn, you can move the spirit up to 30 feet to a space you can see.</p>
            <p><b>Uses left: ${uses}</b></p>
        `,
        'duration': {
            'seconds': 60
        },
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'mba-premades': {
                'spell': {
                    'healingSpirit': {
                        'templateUuid': template.uuid
                    }
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
    let updates = {
        'embedded': {
            'Item': {
                [featureData.name]: featureData
            },
            'ActiveEffect': {
                [effectData.name]: effectData
            }
        }
    };
    let options = {
        'permanent': false,
        'name': "Healing Spirit",
        'description': "Healing Spirit"
    };

    await new Sequence()

        .wait(500)

        .effect()
        .file("jb2a.energy_strands.in.green.01")
        .atLocation(template)
        .scaleToObject(1.5)
        .fadeIn(500)
        .fadeOut(500)
        .opacity(0.8)
        .filter("ColorMatrix", { hue: -15 })
        .loopProperty("sprite", "width", { from: 0, to: -0.05, duration: 50, pingPong: true, gridUnits: true, ease: "easeInCubic" })
        .loopProperty("sprite", "height", { from: 0, to: -0.05, duration: 100, pingPong: true, gridUnits: true, ease: "easeInQuint" })

        .effect()
        .file("jb2a.markers.02.yellow")
        .atLocation(template)
        .scaleToObject(1.5)
        .fadeIn(1000)
        .fadeOut(500)
        .scaleIn(0, 2500, { ease: "easeOutCubic" })
        .filter("ColorMatrix", { hue: 15, saturate: 1 })
        .loopProperty("sprite", "width", { from: 0, to: -0.05, duration: 50, pingPong: true, gridUnits: true, ease: "easeInCubic" })
        .loopProperty("sprite", "height", { from: 0, to: -0.05, duration: 100, pingPong: true, gridUnits: true, ease: "easeInQuint" })
        .zIndex(0)

        .effect()
        .file("jb2a.butterflies.single.yellow")
        .atLocation(template)
        .scaleToObject(1.5)
        .fadeIn(500)
        .zIndex(1)

        .wait(1500)

        .effect()
        .file("jb2a.misty_step.02.yellow")
        .atLocation(template)
        .scaleToObject(1.5)
        .startTime(1500)
        .filter("ColorMatrix", { hue: 15 })

        .effect()
        .file(spiritImage)
        .attachTo(template, { bindVisibility: false, bindAlpha: false, followRotation: true })
        .scaleToObject(1.1)
        .fadeIn(250)
        .rotate(0)
        .loopProperty("alphaFilter", "alpha", { from: 0.1, to: 0.5, duration: 5000 / 2, pingPong: true })
        .persist()
        .name("Healing Spirit 1")

        .effect()
        .file("jb2a.butterflies.many.yellow")
        .attachTo(template, { bindVisibility: false, bindAlpha: false, followRotation: true })
        .scaleToObject(1)
        .fadeIn(1000)
        .fadeOut(1000)
        .belowTokens()
        .zIndex(1)
        .persist()
        .name(`Healing Spirit 2`)

        .effect()
        .file("jb2a.butterflies.few.yellow")
        .attachTo(template, { bindVisibility: false, bindAlpha: false, followRotation: true })
        .scaleToObject(1)
        .fadeIn(1000)
        .fadeOut(1000)
        .zIndex(1)
        .persist()
        .name(`Healing Spirit 2`)

        .effect()
        .file("jb2a.extras.tmfx.outflow.circle.01")
        .attachTo(template, { bindVisibility: false, bindAlpha: false, followRotation: true })
        .scaleToObject(1.1)
        .fadeIn(500)
        .opacity(0.2)
        .belowTokens()
        .tint("#a5fe39")
        .persist()
        .name(`Healing Spirit 2`)

        .thenDo(async () => {
            await warpgate.mutate(workflow.token.document, updates, {}, options);
        })

        .play()
}

async function enter(template, token) {
    let trigger = template.flags['mba-premades']?.template;
    if (!trigger) return;
    await healingSpirit.trigger(token.document, trigger);
}

async function trigger(token, trigger) {
    let template = await fromUuid(trigger.templateUuid);
    if (!template) {
        ui.notifications.warn("Unable to find template!");
        return;
    }
    if (mba.raceOrType(token) === "undead" || mba.raceOrType(token) === "construct") return;
    if (trigger.disposition != token.disposition) return;
    if (mba.inCombat()) {
        let turn = game.combat.round + '-' + game.combat.turn;
        let lastTurn = template.flags['mba-premades']?.spell?.healingSpirit?.[token.id]?.turn;
        if (turn === lastTurn) return;
        await template.setFlag('mba-premades', 'spell.healingSpirit.' + token.id + '.turn', turn);
    }
    let originUuid = template.flags.dnd5e?.origin;
    if (!originUuid) return;
    let originItem = await fromUuid(originUuid);
    if (!originItem) return;
    let casterDoc = await fromUuid(trigger.casterUuid);
    let caster = casterDoc._object;
    let selection = await mba.remoteDialog("Healing Spirit", [["Yes", "yes"], ["No", "no"]], mba.firstOwner(caster).id, `<b>Would you like to heal ${token.name}?</b>`);
    if (selection === false) return;
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Healing Spirit: Heal", false);
    if (!featureData) return;
    delete featureData._id;
    let usesCurrent = trigger.usesCurrent;
    let usesMax = trigger.usesMax;
    featureData.system.damage.parts = [[`${trigger.castLevel - 1}d6[healing]`, `healing`]];
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': originItem.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([token.uuid]);
    await MidiQOL.completeItemUse(feature, config, options);
    new Sequence()

        .effect()
        .file("jb2a.misty_step.02.yellow")
        .atLocation(template)
        .scaleToObject(1.5)
        .startTime(1500)
        .filter("ColorMatrix", { hue: 15 })

        .thenDo(function () {
            Sequencer.EffectManager.endEffects({ name: `Healing Spirit 1` });
        })

        .wait(1000)

        .effect()
        .file("jb2a.misty_step.02.yellow")
        .atLocation(template)
        .scaleToObject(1.5)
        .startTime(1500)
        .filter("ColorMatrix", { hue: 15 })

        .effect()
        .file(trigger.image)
        .attachTo(template, { bindVisibility: false, bindAlpha: false, followRotation: true })
        .scaleToObject(1.1)
        .rotate(0)
        .filter("Glow", { color: 0xa5fe39, knockout: true, distance: 2.5, innerStrength: 0 })
        .loopProperty("alphaFilter", "alpha", { from: 0.1, to: 0.5, duration: 5000 / 2, pingPong: true })
        .persist()
        .name("Healing Spirit 1")

        .play()

    usesCurrent -= 1;
    let effect = await mba.findEffect(originItem.actor, "Healing Spirit");
    if (usesCurrent > 0) {
        await template.update({
            'flags': {
                'mba-premades': {
                    'template': {
                        'usesCurrent': usesCurrent
                    }
                }
            }
        });
        let updates = {
            'description': `
                <p>Whenever you or a creature you can see moves into the spirit's space for the first time on a turn or starts its turn there, you can cause the spirit to restore ${trigger.castLevel - 1}d6 hit points to that creature (no action required).</p>
                <p>The spirit can't heal constructs or undead.</p>
                <p>The spirit can heal ${usesMax} times. After healing that number of times, the spirit disappears.</p>
                <p>As a bonus action on your turn, you can move the spirit up to 30 feet to a space you can see.</p>
                <p><b>Uses left: ${usesCurrent}</b></p>
            `,
        };
        await mba.updateEffect(effect, updates);
        return;
    }
    await mba.removeCondition(originItem.actor, "Concentrating");
}

async function move({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = await mba.findEffect(workflow.actor, "Healing Spirit");
    if (!effect) {
        ui.notifications.warn("Unable to find effect!");
        return;
    }
    let template = await fromUuid(effect.flags['mba-premades']?.spell?.healingSpirit?.templateUuid);
    if (!template) {
        ui.notifications.warn("Unable to find template!");
        return;
    }
    let interval = 2;
    if (game.modules.get('walledtemplates')?.active) {
        if (game.settings.get('walledtemplates', 'snapGrid')) interval = 2;
    }
    let position = await mba.aimCrosshair(workflow.token, 30, workflow.item.img, interval, 1);
    if (position.canceled) {
        ui.notifications.warn("Failed to choose position, returning!");
        return;
    }
    let updates = {
        'x': position.x - (canvas.grid.size * 0.5), //cringe?
        'y': position.y - (canvas.grid.size * 0.5)  //cringe?
    };


    new Sequence()

        .effect()
        .file("jb2a.misty_step.02.yellow")
        .atLocation(template)
        .scaleToObject(1.5)
        .startTime(1500)
        .filter("ColorMatrix", { hue: 15 })

        .thenDo(function () {
            Sequencer.EffectManager.endEffects({ name: `Healing Spirit 1` });
        })

        .wait(1000)

        .effect()
        .file("jb2a.misty_step.02.yellow")
        .atLocation(position)
        .scaleToObject(1.5)
        .startTime(1500)
        .filter("ColorMatrix", { hue: 15 })

        .thenDo(async () => {
            await template.update(updates);
        })

        .effect()
        .file(template.flags['mba-premades']?.template?.image)
        .attachTo(template, { bindVisibility: false, bindAlpha: false, followRotation: true })
        .scaleToObject(1.1)
        .rotate(0)
        .filter("Glow", { color: 0xa5fe39, knockout: true, distance: 2.5, innerStrength: 0 })
        .loopProperty("alphaFilter", "alpha", { from: 0.1, to: 0.5, duration: 5000 / 2, pingPong: true })
        .persist()
        .name("Healing Spirit 1")

        .play()
}

export let healingSpirit = {
    'item': item,
    'enter': enter,
    'trigger': trigger,
    'move': move
}