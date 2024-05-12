import {mba} from "../../../helperFunctions.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    new Sequence()

        .wait(1000)

        .effect()
        .file("jb2a.ranged.card.01.projectile.01.blue")
        .attachTo(token)
        .stretchTo(template, { cacheLocation: true })
        .scale(1.5)
        .rotate(-25)
        .playbackRate(0.8)
        .name(`Card 1`)

        .effect()
        .file("jb2a.ranged.card.01.projectile.01.purple")
        .delay(100)
        .attachTo(token)
        .stretchTo(template, { cacheLocation: true })
        .scale(1.5)
        .rotate(12.5)
        .playbackRate(0.8)
        .name(`Card 2`)

        .effect()
        .file("jb2a.ranged.card.01.projectile.01.orange")
        .delay(200)
        .attachTo(token)
        .stretchTo(template, { cacheLocation: true })
        .scale(1.5)
        .rotate(-12.5)
        .playbackRate(0.8)
        .name(`Card 3`)

        .effect()
        .file("jb2a.ranged.card.01.projectile.01.green")
        .delay(300)
        .attachTo(token)
        .stretchTo(template, { cacheLocation: true })
        .scale(1.5)
        .playbackRate(0.8)
        .name(`Card 4`)

        .effect()
        .file("jb2a.ranged.card.01.projectile.01.yellow")
        .delay(400)
        .attachTo(token)
        .stretchTo(template, { cacheLocation: true })
        .scale(1.5)
        .rotate(25)
        .playbackRate(0.8)
        .name(`Card 5`)

        .effect()
        .file("jb2a.ranged.card.01.projectile.01.blue")
        .delay(500)
        .attachTo(token)
        .stretchTo(template, { cacheLocation: true })
        .scale(1.5)
        .rotate(-25)
        .playbackRate(0.8)
        .name(`Card 6`)

        .effect()
        .file("jb2a.ranged.card.01.projectile.01.green")
        .delay(600)
        .attachTo(token)
        .stretchTo(template, { cacheLocation: true })
        .scale(1.5)
        .playbackRate(0.8)
        .name(`Card 7`)

        .effect()
        .file("jb2a.ranged.card.01.projectile.01.orange")
        .delay(700)
        .attachTo(token)
        .stretchTo(template, { cacheLocation: true })
        .scale(1.5)
        .rotate(-12.5)
        .playbackRate(0.8)
        .name(`Card 8`)

        .effect()
        .file("jb2a.ranged.card.01.projectile.01.yellow")
        .delay(800)
        .attachTo(token)
        .stretchTo(template, { cacheLocation: true })
        .scale(1.5)
        .rotate(25)
        .playbackRate(0.8)
        .name(`Card 9`)

        .effect()
        .file("jb2a.ranged.card.01.projectile.01.blue")
        .delay(900)
        .attachTo(token)
        .stretchTo(template, { cacheLocation: true })
        .scale(1.5)
        .rotate(-25)
        .playbackRate(0.8)
        .name(`Card 10`)

        .effect()
        .file("jb2a.ranged.card.01.projectile.01.purple")
        .delay(1000)
        .attachTo(token)
        .stretchTo(template, { cacheLocation: true })
        .scale(1.5)
        .rotate(12.5)
        .playbackRate(0.8)
        .name(`Card 11`)

        .effect()
        .file("jb2a.ranged.card.01.projectile.01.orange")
        .delay(1100)
        .attachTo(token)
        .stretchTo(template, { cacheLocation: true })
        .scale(1.5)
        .rotate(-12.5)
        .playbackRate(0.8)
        .name(`Card 12`)

        .effect()
        .file("jb2a.ranged.card.01.projectile.01.yellow")
        .delay(1200)
        .attachTo(token)
        .stretchTo(template, { cacheLocation: true })
        .scale(1.5)
        .rotate(25)
        .playbackRate(0.8)
        .name(`Card 13`)

        .effect()
        .file("jb2a.ranged.card.01.projectile.01.green")
        .delay(1300)
        .attachTo(token)
        .stretchTo(template, { cacheLocation: true })
        .scale(1.5)
        .playbackRate(0.8)
        .name(`Card 14`)

        .effect()
        .file("jb2a.ranged.card.01.projectile.01.blue")
        .delay(1400)
        .attachTo(token)
        .stretchTo(template, { cacheLocation: true })
        .scale(1.5)
        .rotate(-25)
        .playbackRate(0.8)
        .name(`Card 15`)

        .play()
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let targets = Array.from(workflow.failedSaves);
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are blinded by a spray of spectral cards until the end of your next turn.</p>
        `,
        'changes': [
            {
                'key': "macro.CE",
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
    for (let target of targets) await mba.createEffect(target.actor, effectData);
}

export let sprayOfCards = {
    'cast': cast,
    'item': item
}