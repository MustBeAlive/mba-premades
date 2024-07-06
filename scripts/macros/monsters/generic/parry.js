import {mba} from "../../../helperFunctions.js";

export async function parry({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.actor) return;
    if (mba.findEffect(workflow.actor, "Blinded")) return;
    let CR = await mba.levelOrCR(workflow.actor);
    let bonus;
    if (CR < 5 && workflow.token.document.name != "Karrnathi Undead Soldier") bonus = 2;
    else if (CR < 5 && workflow.token.document.name === "Karrnathi Undead Soldier") bonus = 3;
    else if (CR >= 5 && CR < 12) bonus = 3;
    else if (CR >= 12 && CR < 14) bonus = 4;
    else if (CR >= 14 && CR < 17) bonus = 5;
    else if (CR >= 17 && CR < 23) bonus = 6;
    else if (CR >= 23) bonus = 7;
    if (!bonus) bonus = 2;
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `<b>AC Bonus: ${bonus}</b>`,
        'duration': {
            'turns': 1,
        },
        'changes': [
            {
                'key': 'system.attributes.ac.bonus',
                'mode': 2,
                'value': `+${bonus}`,
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['1Reaction', 'isDamaged']
            }
        }
    };

    new Sequence()

        .thenDo(async () => {
            await mba.createEffect(workflow.actor, effectData);
        })

        .animation()
        .on(workflow.token)
        .opacity(0)
        .delay(150)

        .effect()
        .file("jb2a.impact.005.yellow")
        .atLocation(workflow.token)
        .size(workflow.token.document.width * 2.25, { gridUnits: true })
        .zIndex(1)

        .effect()
        .file("jb2a.extras.tmfx.border.circle.outpulse.01.fast")
        .atLocation(workflow.token)
        .size(workflow.token.document.width * 1.35, { gridUnits: true })
        .spriteOffset({ x: -0.3 * workflow.token.document.width }, { gridUnits: true })
        .opacity(0.25)
        .belowTokens()

        .effect()
        .from(workflow.token)
        .atLocation(workflow.token)
        .scaleToObject(workflow.token.document.texture.scaleX, { considerTokenScale: true })
        .duration(950)
        .animateProperty("sprite", "position.y", { from: 0, to: -0.25, duration: 450, gridUnits: true, ease: "easeOutExpo", delay: 250 })
        .animateProperty("sprite", "position.y", { from: 0, to: 0.25, duration: 250, ease: "easeInOutBack", gridUnits: true, fromEnd: true })
        .mirrorX(workflow.token.document.data.mirrorX)

        .animation()
        .on(workflow.token)
        .opacity(1)
        .delay(850)

        .effect()
        .file("jb2a.icon.shield.yellow")
        .atLocation(workflow.token)
        .scaleToObject(1)
        .delay(500)
        .fadeIn(450)
        .fadeOut(1000)
        .opacity(0.8)
        .playbackRate(1.5)

        .play();
}