import {mba} from "../../../helperFunctions.js";

async function calmingMistCast({ speaker, actor, token, character, item, args, scope, workflow }) {
    new Sequence()

        .effect()
        .file("jb2a.fog_cloud.02.white")
        .atLocation(workflow.token)
        .size(3.5, { gridUnits: true })
        .delay(500)
        .fadeIn(1500)
        .fadeOut(1500)
        .scaleOut(0, 1500, { ease: "linear" })
        .scaleIn(0, 1500, { ease: "easeOutCubic" })
        .opacity(0.8)
        .zIndex(1)
        .randomRotation()

        .play()
}

async function calmingMistItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    const effectData = {
        'name': "Metallic Warbler: Calming Mist",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You were @UUID[Compendium.mba-premades.MBA SRD.Item.SVd8xu3mTZMqz8fL]{Charmed} by Metallic Warbler's Calming Mist.</p>
            <p>While @UUID[Compendium.mba-premades.MBA SRD.Item.SVd8xu3mTZMqz8fL]{Charmed} in this way, you are @UUID[Compendium.mba-premades.MBA SRD.Item.LCcuJNMKrGouZbFJ]{Incapacitated} and has a speed of 0.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': 'Charmed',
                'priority': 20
            },
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': 'Incapacitated',
                'priority': 20
            },
            {
                'key': "system.attributes.movement.walk",
                'mode': 5,
                'value': 0,
                'priority': 100
            }
        ]
    };
    let targets = Array.from(workflow.failedSaves);
    for (let target of targets) {
        if (mba.checkTrait(target.actor, 'ci', 'charmed')) continue;
        await mba.createEffect(target.actor, effectData)
    }
}

export let metallicWarbler = {
    'calmingMistCast': calmingMistCast,
    'calmingMistItem': calmingMistItem
}