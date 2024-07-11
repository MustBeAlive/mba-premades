import {mba} from "../../../helperFunctions.js";

//To do:

export async function gaseousForm({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let choicesColor = [["Teal", "teal"], ["Green", "green"], ["Blue", "blue"], ["Red", "red"]];
    await mba.playerDialogMessage();
    let selectionColor = await mba.dialog("Gaseous Form", choicesColor, "Choose color:");
    await mba.clearPlayerDialogMessage();
    if (!selectionColor) selectionColor = "teal";
    let tintColor;
    switch (selectionColor) {
        case "blue": {
            tintColor = "#74e2cf";
            break;
        }
        case "green": {
            tintColor = "#6cde3b";
            break;
        }
        case "red": {
            tintColor = "#e22c47";
            break;
        }
        case "teal": {
            tintColor = "#6ff087";
            break;
        }
    }
    async function effectMacroDel() {
        new Sequence()

            .effect()
            .file("jb2a.smoke.puff.centered.grey")
            .atLocation(token)
            .scaleToObject(2, { considerTokenScale: true })
            .opacity(0.5)
            .filter("ColorMatrix", { saturate: 0, brightness: 1.5 })
            .tint("#6cde3b")
            .waitUntilFinished(-2100)

            .thenDo(function () {
                Sequencer.EffectManager.endEffects({ name: `${token.document.name} Gaseous Form`, object: token });
            })

            .animation()
            .on(token)
            .opacity(1)

            .play();
    };
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>For the duration, you are transformed into a misty cloud, along with everything you are wearing and carrying.</p>
            <p>While in this form, your only method of movement is a flying speed of 10 feet. You can enter and occupy the space of another creature. You have resistance to nonmagical damage, and you have advantage on Strength, Dexterity, and Constitution saving throws.</p>
            <p>You can pass through small holes, narrow openings, and even mere cracks, though you treat liquids as though they were solid surfaces. You can't fall and remain hovering in the air even when stunned or otherwise incapacitated.</p>
            <p>While in the form of a misty cloud, you can't talk or manipulate objects, and any objects you were carrying or holding can't be dropped, used, or otherwise interacted with. You can't attack or cast spells.</p>
        `,
        'duration': {
            'seconds': 3600
        },
        'changes': [
            {
                'key': 'system.attributes.movement.fly',
                'mode': 5,
                'value': 10,
                'priority': 25
            },
            {
                'key': 'system.attributes.movement.burrow',
                'mode': 5,
                'value': 0,
                'priority': 25
            },
            {
                'key': 'system.attributes.movement.climb',
                'mode': 5,
                'value': 0,
                'priority': 25
            },
            {
                'key': 'system.attributes.movement.swim',
                'mode': 5,
                'value': 0,
                'priority': 25
            },
            {
                'key': 'system.attributes.movement.walk',
                'mode': 5,
                'value': 0,
                'priority': 25
            },
            {
                'key': 'system.traits.dr.value',
                'mode': 0,
                'value': "nonmagic",
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.advantage.ability.save.str',
                'mode': 0,
                'value': 1,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.advantage.ability.save.dex',
                'mode': 0,
                'value': 1,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.advantage.ability.save.con',
                'mode': 0,
                'value': 1,
                'priority': 20
            },
        ],
        'flags': {
            'dae': {
                'specialDuration': ['zeroHP']
            },
            'effectmacro': {
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

        .animation()
        .on(target)
        .opacity(0)

        .effect()
        .file("jb2a.smoke.puff.centered.grey")
        .atLocation(target)
        .scaleToObject(2, { considerTokenScale: true })
        .opacity(0.5)
        .filter("ColorMatrix", { saturate: 0, brightness: 1.5 })
        .tint(tintColor)

        .effect()
        .file("jb2a.extras.tmfx.outflow.circle.01")
        .attachTo(target, { cacheLocation: true, offset: { y: 0 }, gridUnits: true, bindAlpha: false })
        .scaleToObject(1.45, { considerTokenScale: true })
        .randomRotation()
        .belowTokens()
        .opacity(0.45)
        .tint(tintColor)
        .loopProperty("alphaFilter", "alpha", { from: 0.75, to: 1, duration: 1500, pingPong: true, ease: "easeOutSine" })
        .filter("ColorMatrix", { saturate: -0.2, brightness: 1.2 })
        .persist()
        .name(`${target.document.name} Gaseous Form`)

        .effect()
        .from(target)
        .attachTo(target, { bindAlpha: false })
        .scaleToObject(1, { considerTokenScale: true })
        .opacity(0.65)
        .tint(tintColor)
        .loopProperty("alphaFilter", "alpha", { from: 0.75, to: 1, duration: 1500, pingPong: true, ease: "easeOutSine" })
        .loopProperty("sprite", "position.x", { from: 0.025, to: -0.025, duration: 5000, gridUnits: true, pingPong: true, ease: "easeOutSine" })
        .loopProperty("sprite", "position.y", { from: 0, to: -0.03, duration: 2500, gridUnits: true, pingPong: true })
        .filter("Glow", { color: tintColor, distance: 5, outerStrength: 4, innerStrength: 0 })
        .filter("ColorMatrix", { saturate: -0.2, brightness: 1.2 })
        .filter("Blur", { blurX: 0, blurY: 0.8 })
        .persist()
        .name(`${target.document.name} Gaseous Form`)

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectData);
        })

        .play()
}