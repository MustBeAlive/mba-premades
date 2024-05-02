import {mba} from "../../../helperFunctions.js";

export async function light({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let target = workflow.targets.first();
    let color;
    await Dialog.wait({
        title: "Pick color:",
        content: `<form><div class="form-group"><label for="color" style="line-height: 26px;">Color:</label><div class="form-fields"><input type="color" value="${game.user.color}" id="color"></div></div></form>`,
        buttons: {
            color: {
                label: "Apply",
                icon: "<i class='fa-solid fa-lightbulb'></i>",
                callback: () => {
                    let newColor = document.querySelector("#color")?.value ?? color;
                    color = newColor;
                }
            }
        },
        close: () => { return false },
    });

    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>For the duration, you shed bright light in a 20-foot radius and dim light for an additional 20 feet.</p>
            <p>Completely covering the object with something opaque blocks the light.</p>
            <p>The spell ends if you cast it again or dismiss it as an action.</p>
        `,
        'duration': {
            'seconds': 3600
        },
        'changes': [
            {
                'key': 'ATL.light.dim',
                'mode': 4,
                'value': 40,
                'priority': 20
            },
            {
                'key': 'ATL.light.bright',
                'mode': 4,
                'value': 20,
                'priority': 20
            },
            {
                'key': 'ATL.light.alpha',
                'mode': 5,
                'value': "0.25",
                'priority': 20
            },
            {
                'key': 'ATL.light.angle',
                'mode': 5,
                'value': "360",
                'priority': 20
            },
            {
                'key': 'ATL.light.luminosity',
                'mode': 5,
                'value': "0.5",
                'priority': 20
            },
            {
                'key': 'ATL.light.color',
                'mode': 5,
                'value': color,
                'priority': 20
            },
            {
                'key': 'ATL.light.animation',
                'mode': 5,
                'value': '{type: "smokepatch", speed: 5, intensity: 1, reverse: false }',
                'priority': 20
            },
            {
                'key': 'ATL.light.attenuation',
                'mode': 5,
                'value': "0.8",
                'priority': 20
            },
            {
                'key': 'ATL.light.contrast',
                'mode': 5,
                'value': "0.15",
                'priority': 20
            },
            {
                'key': 'ATL.light.shadows',
                'mode': 5,
                'value': "0.2",
                'priority': 20
            }
        ],
        'flags': {
            'midi-qol': {
                'castData': {
                    baseLevel: 0,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    let effect = await mba.findEffect(target.actor, "Light");
    if (!effect) effect = await mba.findEffect(workflow.actor, "Light");
    if (effect) await mba.removeEffect(effect);

    new Sequence ()

        .effect()
        .file("jb2a.markers.light.complete.yellow")
        .attachTo(target)
        .fadeOut(1000)
        
        .effect()
        .file("jb2a.markers.light_orb.complete.yellow")
        .attachTo(target)
        .fadeOut(1000)
        .belowTokens()

        .thenDo(function () {
            mba.createEffect(target.actor, effectData)
        })

        .play()
}