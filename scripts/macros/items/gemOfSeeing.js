import {mba} from "../../helperFunctions.js";

export async function gemOfSeeing({ speaker, actor, token, character, item, args, scope, workflow }) {
    let gemItem = await mba.getItem(workflow.actor, "Gem of Seeing");
    if (!gemItem) {
        ui.notifications.warn("Unable to find item (Gem of Seeing");
        return;
    }
    if (gemItem.system.attunement != 2) {
        ui.notifications.warn("You must attune to the Gem of Seeing to be able to use it!");
        return;
    }
    let uses = gemItem.system.uses.value;
    if (uses < 1) {
        ui.notifications.warn("");
        return;
    }

    let oldEffect = await mba.findEffect(workflow.actor, "Gem of Seeing: Truesight");
    if (oldEffect) await mba.removeEffect(oldEffect);
    const effectData = {
        'name': "Gem of Seeing: Truesight",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You have truesight out to 120 feet wheen you peer through the gem for the duration.</p>
        `,
        'duration': {
            'seconds': 600
        },
        'changes': [
            {
                'key': "system.attributes.senses.truesight",
                'mode': 4,
                'value': 120,
                'priority': 20,
            },
            {
                'key': "ATL.detectionModes.seeAll.range",
                'mode': 2,
                'value': 120,
                'priority': 20,
            },
        ],
    };

    new Sequence()

        .effect()
        .file("jb2a.markers.light.complete.blue")
        .attachTo(workflow.token)
        .fadeOut(1000)

        .effect()
        .file("jb2a.markers.light_orb.complete.blue")
        .attachTo(workflow.token)
        .fadeOut(1000)
        .belowTokens()

        .wait(750)

        .thenDo(async () => {
            await mba.createEffect(workflow.actor, effectData);
            await gemItem.update({ "system.uses.value": uses -= 1 });
        })

        .play()
}