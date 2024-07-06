import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.targets.size) return;
    let target = workflow.targets.first();
    async function effectMacroDel() {
        await new Sequence()

            .effect()
            .file("jb2a.particles.swirl.blue.02.01")
            .atLocation(token)
            .scaleToObject(1.7 * token.document.texture.scaleX)
            .duration(8300)
            .fadeIn(1000)
            .fadeOut(700)

            .effect()
            .file("modules/mba-premades/icons/spells/level4/death_ward.webp")
            .attachTo(token, { followRotation: false })
            .scaleToObject(1)
            .duration(8300)
            .fadeIn(1000)
            .fadeOut(1000)
            .aboveLighting()

            .play()
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are protected from death.</p>
            <p>The first time you would drop to 0 hit points as a result of taking damage, you instead drop to 1 hit point, and the spell ends.</p>
            <p>If the spell is still in effect when you are subjected to an effect that would kill you instantaneously without dealing damage, that effect is instead negated against you, and the spell ends.</p>
        `,
        'duration': {
            'seconds': 28800
        },
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 4,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };

    let offset = [
        { x: 0, y: -0.55 },
        { x: -0.5, y: -0.15 },
        { x: -0.3, y: 0.45 },
        { x: 0.3, y: 0.45 },
        { x: 0.5, y: -0.15 }
    ];
    await new Sequence()

        .wait(500)

        .effect()
        .file("jb2a.icon.runes.blue")
        .attachTo(target, { offset: offset[0], gridUnits: true, followRotation: false })
        .scaleToObject(0.5)
        .duration(5900)
        .fadeIn(300)
        .fadeOut(500)
        .scaleIn(0, 250, { ease: "easeOutBack" })
        .zIndex(1)
        .aboveLighting()

        .effect()
        .file("jb2a.icon.runes.blue")
        .attachTo(target, { offset: offset[1], gridUnits: true, followRotation: false })
        .scaleToObject(0.5)
        .delay(600)
        .duration(5300)
        .fadeIn(300)
        .fadeOut(500)
        .scaleIn(0, 250, { ease: "easeOutBack" })
        .zIndex(1)
        .aboveLighting()

        .effect()
        .file("jb2a.icon.runes.blue")
        .attachTo(target, { offset: offset[2], gridUnits: true, followRotation: false })
        .scaleToObject(0.5)
        .delay(1200)
        .duration(4700)
        .fadeIn(300)
        .fadeOut(500)
        .scaleIn(0, 250, { ease: "easeOutBack" })
        .zIndex(1)
        .aboveLighting()

        .effect()
        .file("jb2a.icon.runes.blue")
        .attachTo(target, { offset: offset[3], gridUnits: true, followRotation: false })
        .scaleToObject(0.5)
        .delay(1800)
        .duration(4100)
        .fadeIn(300)
        .fadeOut(500)
        .scaleIn(0, 250, { ease: "easeOutBack" })
        .zIndex(1)
        .aboveLighting()

        .effect()
        .file("jb2a.icon.runes.blue")
        .attachTo(target, { offset: offset[4], gridUnits: true, followRotation: false })
        .scaleToObject(0.5)
        .delay(2400)
        .duration(3500)
        .fadeIn(300)
        .fadeOut(500)
        .scaleIn(0, 250, { ease: "easeOutBack" })
        .zIndex(1)
        .aboveLighting()

        .effect()
        .file("jb2a.swirling_sparkles.01.blue")
        .atLocation(target)
        .scaleToObject(1.7 * target.document.texture.scaleX)
        .delay(3000)
        .fadeIn(500)
        .waitUntilFinished(-1500)

        .effect()
        .file("jb2a.particles.swirl.blue.02.01")
        .atLocation(target)
        .scaleToObject(1.7 * target.document.texture.scaleX)
        .duration(8300)
        .fadeIn(1000)
        .fadeOut(700)

        .effect()
        .file("modules/mba-premades/icons/spells/level4/death_ward.webp")
        .attachTo(target, { followRotation: false })
        .scaleToObject(1)
        .duration(8300)
        .fadeIn(1000)
        .fadeOut(1000)
        .aboveLighting()

        .wait(700)

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectData)
        })

        .play();
}

async function hook(token, { item, workflow, ditem }) {
    let effect = mba.findEffect(token.actor, 'Death Ward');
    if (!effect) return;
    let queueSetup = await queue.setup(workflow.uuid, 'deathWard', 390);
    if (!queueSetup) return;
    if (ditem.newHP != 0) {
        queue.remove(workflow.uuid);
        return;
    }
    ditem.newHP = 1;
    ditem.hpDamage = Math.abs(ditem.newHP - ditem.oldHP);
    await mba.removeEffect(effect);
    queue.remove(workflow.uuid);
}

export let deathWard = {
    'item': item,
    'hook': hook
}