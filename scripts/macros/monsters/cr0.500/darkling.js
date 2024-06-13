import {mba} from "../../../helperFunctions.js";

async function deathFlashCast(token, origin) {
    new Sequence()

        .effect()
        .file("animated-spell-effects-cartoon.mix.fire earth explosion.01")
        .atLocation(token)
        .size(4.8, { gridUnits: true })

        .thenDo(async () => {
            await origin.use();
        })

        .play()
}

async function deathFlashItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let targets = Array.from(workflow.failedSaves);
    for (let target of targets) {
        if (mba.checkTrait(target.actor, "ci", "blinded")) continue;
        if (mba.findEffect(target.actor, "Darkling: Death Flash")) continue;
        const effectData = {
            'name': "Darkling: Death Flash",
            'icon': workflow.item.img,
            'origin': workflow.item.uuid,
            'changes': [
                {
                    'key': 'macro.CE',
                    'mode': 0,
                    'value': "Blinded",
                    'priority': 20
                }
            ],
            'flags': {
                'dae': {
                    'showIcon': true,
                    'specialDuration': ['turnEnd']
                }
            }
        };
        await mba.createEffect(target.actor, effectData);
    }
}

export let darkling = {
    'deathFlashCast': deathFlashCast,
    'deathFlashItem': deathFlashItem
}