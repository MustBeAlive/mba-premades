import {mba} from "../../../../helperFunctions.js";

async function light({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = await mba.findEffect(workflow.actor, "Radiant Weapon: Light");
    if (effect) {
        await mba.removeEffect(effect);
        return;
    }
    const effectData = {
        'name': "Radiant Weapon: Light",
        'icon': "modules/mba-premades/icons/generic/generic_light.webp",
        'origin': workflow.item.uuid,
        'description': `
            <p>While holding your Radiant-infused Weapon, you can take a bonus action to cause it to shed bright light in a 30-foot radius and dim light for an additional 30 feet.</p>
            <p>You can extinguish the light as a bonus action.</p>
        `,
        'changes': [
            {
                'key': 'ATL.light.dim',
                'mode': 4,
                'value': 60,
                'priority': 20
            },
            {
                'key': 'ATL.light.bright',
                'mode': 4,
                'value': 30,
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
            'dae': {
                'showIcon': true
            }
        }
    };

    new Sequence()

        .effect()
        .file("jb2a.markers.light.complete.yellow")
        .attachTo(workflow.token)
        .fadeOut(1000)

        .effect()
        .file("jb2a.markers.light_orb.complete.yellow")
        .attachTo(workflow.token)
        .fadeOut(1000)
        .belowTokens()

        .thenDo(async () => {
            await mba.createEffect(workflow.actor, effectData)
        })

        .play()
}

async function blindCast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    new Sequence()

        .effect()
        .file("jb2a.scorching_ray.01.yellow")
        .atLocation(workflow.token)
        .stretchTo(target)
        .repeats(3, 600, 600)

        .play()
}

async function blindItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let effectData = {
        'name': "Radiant Weapon: Blind",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are blinded until the end of your next turn.</p>
        `,
        'changes': [
            {
                'key': "macro.CE",
                'mode': 0,
                'value': "Blinded",
                'priority': 20,
            },
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['turnEnd']
            }
        }
    };
    await mba.createEffect(workflow.targets.first().actor, effectData);
}

export let radiantWeapon = {
    'light': light,
    'blindCast': blindCast,
    'blindItem': blindItem
}