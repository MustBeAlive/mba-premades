import {mba} from "../../../helperFunctions.js";

// To do: description, initial cast animation

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    async function effectMacroTurnEnd() {
        await mbaPremades.macros.blink.turnEnd(token);
    };
    async function effectMacroDel() {
        let blinkAwayEffect = await mbaPremades.helpers.findEffect(token.actor, "Blink: Blinked Away");
        if (blinkAwayEffect) await mbaPremades.macros.blink.turnStart(token);
    };
    let effectData = {
        'name': "Blink",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Roll a d20 at the end of each of your turns for the duration of the spell.</p>
            <p>On a roll of 11 or higher, you vanish from your current plane of existence and appear in the Ethereal Plane (the spell fails and the casting is wasted if you were already on that plane).</p>
            <p>At the start of your next turn, and when the spell ends if you are on the Ethereal Plane, you return to an unoccupied space of your choice that you can see within 10 feet of the space you vanished from.</p>
            <p>If no unoccupied space is available within that range, you appear in the nearest unoccupied space (chosen at random if more than one space is equally near). You can dismiss this spell as an action.</p>
            <p>While on the Ethereal Plane, you can see and hear the plane you originated from, which is cast in shades of gray, and you can't see anything there more than 60 feet away.</p>
            <p>You can only affect and be affected by other creatures on the Ethereal Plane.</p>
            <p>Creatures that aren't there can't perceive you or interact with you, unless they have the ability to do so.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'flags': {
            'effectmacro': {
                'onTurnEnd': {
                    'script': mba.functionToString(effectMacroTurnEnd)
                },
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
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
    new Sequence()

        .effect()
        .file("jb2a.particle_burst.01.circle.yellow")
        .attachTo(token)
        .scaleToObject(2.3)
        .fadeOut(300)
        .filter("ColorMatrix", { hue: 180 })
        .waitUntilFinished(-333)

        .thenDo(async () => {
            await mba.createEffect(workflow.actor, effectData);
        })

        .play()
}

async function turnEnd(token) {
    let blinkRoll = await new Roll('1d20').roll({ 'async': true });
    await MidiQOL.displayDSNForRoll(blinkRoll);
    blinkRoll.toMessage({
        'rollMode': 'roll',
        'speaker': { 'alias': "MBA Premades" },
        'flavor': 'Blink Roll'
    });
    if (blinkRoll.total < 11) return;
    let blinkEffect = mba.findEffect(token.actor, "Blink");
    async function effectMacroTurnStart() {
        await mbaPremades.macros.blink.turnStart(token);
    }
    let effectData = {
        'name': "Blink: Blinked Away",
        'icon': "modules/mba-premades/icons/spells/level3/blink_teleport.webp",
        'origin': blinkEffect.origin,
        'changes': [
            {
                'key': 'flags.midi-qol.superSaver.all',
                'value': '1',
                'mode': 5,
                'priority': 20
            },
            {
                'key': 'system.attributes.ac.bonus',
                'value': '100',
                'mode': 5,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.min.ability.save.all',
                'value': '100',
                'mode': 5,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.fail.critical.all',
                'value': '1',
                'mode': 5,
                'priority': 20
            },
            {
                'key': 'macro.tokenMagic',
                'value': 'spectral-body',
                'mode': 0,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.neverTarget',
                'value': true,
                'mode': '1',
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true
            },
            'effectmacro': {
                'onTurnStart': {
                    'script': mba.functionToString(effectMacroTurnStart)
                }
            }
        }
    };
    new Sequence()

        .effect()
        .file("jb2a.particle_burst.01.circle.yellow")
        .attachTo(token)
        .scaleToObject(2.3)
        .duration(1300)
        .fadeOut(300)
        .filter("ColorMatrix", { hue: 180 })

        .effect()
        .file("animated-spell-effects-cartoon.misc.weird.01")
        .atLocation(token)
        .scaleToObject(2)
        .delay(1000)
        .opacity(0.8)

        .wait(1500)

        .thenDo(async () => {
            await mba.createEffect(token.actor, effectData);
        })

        .play()
}

async function turnStart(token) {
    let effect = await mba.findEffect(token.actor, "Blink: Blinked Away");
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Blink: Landing", false);
    if (!featureData) return;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': token.actor });
    await feature.displayCard();
    let interval = token.document.width % 2 === 0 ? 1 : -1;
    await mba.playerDialogMessage(mba.firstOwner(token));
    let position = await mba.aimCrosshair(token, 10, effect.icon, interval, token.document.width);
    await mba.clearPlayerDialogMessage();
    new Sequence()

        .effect()
        .file("jb2a.particle_burst.01.circle.yellow")
        .atLocation(position)
        .scaleToObject(2.3)
        .duration(1300)
        .fadeOut(300)
        .filter("ColorMatrix", { hue: 180 })

        .effect()
        .file("animated-spell-effects-cartoon.misc.weird.01")
        .atLocation(position)
        .scaleToObject(2)
        .delay(1000)
        .opacity(0.8)

        .wait(1500)

        .animation()
        .on(token)
        .teleportTo(position)
        .snapToGrid()
        .offset({ x: -1, y: -1 })

        .thenDo(async () => {
            if (effect) await mba.removeEffect(effect);
        })

        .play()
}

export let blink = {
    'item': item,
    'turnEnd': turnEnd,
    'turnStart': turnStart
}