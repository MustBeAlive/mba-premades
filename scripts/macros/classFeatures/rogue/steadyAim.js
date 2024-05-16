import {mba} from "../../../helperFunctions.js";

export async function steadyAim({ speaker, actor, token, character, item, args, scope, workflow }) {
    //hehe?
    if (game.modules.get("drag-ruler")?.active && dragRuler.getMovedDistanceFromToken(workflow.token) > 0) {
        ui.notifications.warn("You've already moved this turn, alas is unable to use Steady Aim!");
        await game.messages.get(workflow.itemCardId).delete();
        return;
    }
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You have <b>advantage</b> on the next attack roll you make, but your speed is 0 until the end of your current turn.</p>
        `,
        'duration': {
            'turns': 1
        },
        'changes': [
            {
                'key': 'flags.midi-qol.advantage.attack.all',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
            {
                'key': 'system.attributes.movement.walk',
                'mode': 3,
                'value': 0,
                'priority': 20
            },
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['1Attack']
            }
        }
    };

    let enemyTokens = game.canvas.scene.tokens.filter(t => t.disposition != workflow.token.document.disposition);
    let targets = [];
    for (let i of enemyTokens) targets.push(i.object);

    await new Sequence()

        .effect()
        .file("jb2a.sneak_attack.dark_red")
        .atLocation(token)
        .scaleToObject(2.5)
        .waitUntilFinished(-2100)

        .thenDo(function () {
            mba.createEffect(workflow.actor, effectData)
        })

        .play()

    if (!targets.length) return;
    for (let target of targets) {
        let delay = 300 + Math.floor(Math.random() * (Math.floor(1500) - Math.ceil(50)) + Math.ceil(50));
        new Sequence()

            .effect()
            .file("jb2a.ui.indicator.redyellow.02.01")
            .attachTo(target)
            .scaleToObject(1.3 * target.document.texture.scaleX)
            .delay(delay)
            .fadeIn(500)
            .fadeOut(500)
            .playbackRate(0.8)
            .repeats(3, 1100)

            .play()
    }
}