import {mba} from "../../../helperFunctions.js";

export async function emptyBody({ speaker, actor, token, character, item, args, scope, workflow }) {
    let kiItem = await mba.getItem(workflow.actor, "Ki Points");
    if (!kiItem) {
        ui.notifications.warn("Unable to find feature! (Ki Points)");
        return;
    }
    let kiPoints = kiItem.system.uses.value;
    if (kiPoints < 4) {
        ui.notifications.info("Not enough Ki Points!");
        return;
    }
    let choices = [["Become Invisible (4 Ki Points)", "invisibility"]];
    if (kiPoints >= 8) choices.push(["Cast Astral Projection (8 Ki Points)", "astral"]);
    choices.push(["Cancel", false]);
    let selection = await mba.dialog("Empty Body", choices, `<b>What would you like to do?</b>`);
    if (!selection) return;
    if (selection === "invisibility") {
        const effectData = {
            'name': "Empty Body: Invisibility",
            'icon': workflow.item.img,
            'origin': workflow.item.uuid,
            'description': `
                <p>You are invisible for the duration.</p>
                <p>During that time, you also have resistance to all damage but force damage.</p>
            `,
            'duration': {
                'seconds': 60
            },
            'changes': [
                {
                    'key': 'macro.CE',
                    'mode': 0,
                    'value': "Invisible",
                    'priority': 20
                },
                {
                    'key': 'system.traits.dr.value',
                    'mode': 2,
                    'value': "piercing",
                    'priority': 20
                },
                {
                    'key': 'system.traits.dr.value',
                    'mode': 2,
                    'value': "slashing",
                    'priority': 20
                },
                {
                    'key': 'system.traits.dr.value',
                    'mode': 2,
                    'value': "bludgeoning",
                    'priority': 20
                },
                {
                    'key': 'system.traits.dr.value',
                    'mode': 2,
                    'value': "acid",
                    'priority': 20
                },
                {
                    'key': 'system.traits.dr.value',
                    'mode': 2,
                    'value': "cold",
                    'priority': 20
                },
                {
                    'key': 'system.traits.dr.value',
                    'mode': 2,
                    'value': "fire",
                    'priority': 20
                },
                {
                    'key': 'system.traits.dr.value',
                    'mode': 2,
                    'value': "lightning",
                    'priority': 20
                },
                {
                    'key': 'system.traits.dr.value',
                    'mode': 2,
                    'value': "necrotic",
                    'priority': 20
                },
                {
                    'key': 'system.traits.dr.value',
                    'mode': 2,
                    'value': "poison",
                    'priority': 20
                },
                {
                    'key': 'system.traits.dr.value',
                    'mode': 2,
                    'value': "psychic",
                    'priority': 20
                },
                {
                    'key': 'system.traits.dr.value',
                    'mode': 2,
                    'value': "radiant",
                    'priority': 20
                },
                {
                    'key': 'system.traits.dr.value',
                    'mode': 2,
                    'value': "thunder",
                    'priority': 20
                },
            ]
        };
        await kiItem.update({ "system.uses.value": kiPoints -= 4 });
        await mba.createEffect(workflow.actor, effectData);
    }
    else if (selection === "astral") {
        const effectData = {
            'name': "Empty Body: Astral Projection",
            'icon': workflow.item.img,
            'origin': workflow.item.uuid,
            'description': `
                <p>You project your astral body into the Astral Plane (the spell fails and the casting is wasted if you are already on that plane). The material body you leave behind is unconscious and in a state of suspended animation, it doesn't need food or air and doesn't age.</p>
                <p>Your astral body resembles your mortal form in almost every way, replicating your game statistics and possessions. The principal difference is the addition of a silvery cord that extends from between your shoulder blades and trails behind you, fading to invisibility after 1 foot. This cord is your tether to your material body. As long as the tether remains intact, you can find your way home. If the cord is cut (something that can happen only when an effect specifically states that it does) your soul and body are separated, killing you instantly.</p>
                <p>Your astral form can freely travel through the Astral Plane and can pass through portals there leading to any other plane. If you enter a new plane or return to the plane you were on when casting this spell, your body and possessions are transported along the silver cord, allowing you to re-enter your body as you enter the new plane. Your astral form is a separate incarnation. Any damage or other effects that apply to it have no effect on your physical body, nor do they persist when you return to it.</p>
                <p>The spell ends for you when you use your action to dismiss it. When the spell ends, the affected creature returns to its physical body, and it awakens.</p>
                <p>The spell might also end early for you. A successful dispel magic spell used against an astral or physical body ends the spell for that creature. If a creature's original body or its astral form drops to 0 hit points, the spell ends for that creature. If the spell ends and the silver cord is intact, the cord pulls the creature's astral form back to its body, ending its state of suspended animation.</p>
            `,
            'duration': {
                'seconds': 3600
            },
            'changes': [
                {
                    'key': 'macro.CE',
                    'mode': 0,
                    'value': "Unconscious",
                    'priority': 20
                },
            ],
            'flags': {
                'dae': {
                    'specialDuration': ['zeroHP']
                }
            }
        };
        await kiItem.update({ "system.uses.value": kiPoints -= 8 });
        await mba.createEffect(workflow.actor, effectData);
    }
}