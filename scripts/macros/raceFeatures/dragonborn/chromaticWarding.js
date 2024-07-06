import {mba} from "../../../helperFunctions.js";

export async function chromaticWarding({speaker, actor, token, character, item, args, scope, workflow}) {
    let type;
    if (mba.getItem(workflow.actor, "Chromatic Ancestry (Black)")) type = "acid";
    else if (mba.getItem(workflow.actor, "Chromatic Ancestry (Blue)")) type = "lightning";
    else if (mba.getItem(workflow.actor, "Chromatic Ancestry (Green)")) type = "poison";
    else if (mba.getItem(workflow.actor, "Chromatic Ancestry (Red)")) type = "fire";
    else if (mba.getItem(workflow.actor, "Chromatic Ancestry (White)")) type = "cold";
    if (!type) {
        ui.notifications.warn("Unable to find dragonborn type!");
        return;
    }
    let hue;
    switch (type) {
        case "acid": hue = 90; break;
        case "cold": hue = 180; break;
        case "fire": hue = 0; break;
        case "lightning": hue = 180; break;
        case "poison": hue = 70; break; 
    }
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} ChromWa` })
    };
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are immune to <b>${type}</b> damage type for the duration.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [ 
            {
                'key': 'system.traits.di.value',
                'mode': 2,
                'value': `${type}`,
                'priority': 20
            }
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };

    new Sequence()

        .effect()
        .file("animated-spell-effects-cartoon.fire.spiral")
        .attachTo(workflow.token)
        .scaleToObject(1.4)
        .filter("ColorMatrix", {hue: hue })
        .waitUntilFinished(-2700)

        .effect()
        .file("jb2a.token_border.circle.static.orange.008")
        .attachTo(workflow.token)
        .scaleToObject(1.85)
        .fadeIn(1000)
        .fadeOut(1000)
        .belowTokens()
        .filter("ColorMatrix", {hue: hue })
        .persist()
        .name(`${workflow.token.document.name} ChromWa`)

        .thenDo(async () => {
            await mba.createEffect(workflow.actor, effectData);
        })

        .play()
}