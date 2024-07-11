import {mba} from "../../../helperFunctions.js";

export async function uncannyDodge({ speaker, actor, token, character, item, args, scope, workflow }) {
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You halve the next attack's damage against you.</p>
        `,
        'changes': [
            {
                'key': 'flags.midi-qol.uncanny-dodge',
                'mode': 5,
                'value': 1,
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['1Reaction']
            }
        }
    };
    const tokenCenter = {
        x: token.x + canvas.grid.size * token.document.width / 2,
        y: token.y + canvas.grid.size * token.document.width / 2,
    };
    const middleposition = {
        x: token.x - tokenCenter.x,
        y: token.y - tokenCenter.y,
    };
    var Xmirror = false;
    var Ymirror = false;
    if (middleposition.x > 0) {
        middleposition.x = 1;
    }
    else if (middleposition.x < 0) {
        middleposition.x = -1;
        Xmirror = true;
    }
    if (middleposition.y > 0) {
        middleposition.y = 1;
    }
    else if (middleposition.y < 0) {
        middleposition.y = -1;
        Ymirror = true;
    }
    
    new Sequence()
    
        .animation()
        .on(token)
        .opacity(0)
    
        .effect()
        .from(token)
        .atLocation(token)
        .opacity(1)
        .animateProperty("sprite", "position.y", { from: 0, to: 0.6, duration: 500, gridUnits: true, ease: "easeOutCubic" })
        .animateProperty("sprite", "position.y", { from: 0, to: -0.6, duration: 500, gridUnits: true, fromEnd: false, delay: 250, ease: "easeOutCubic" })
        .animateProperty("sprite", "position.x", { from: 0, to: middleposition.x * -1.8, duration: 700, gridUnits: true, fromEnd: false, ease: "easeOutCubic" })
        .animateProperty("sprite", "position.x", { from: 0, to: -middleposition.x * -1.8, duration: 800, gridUnits: true, fromEnd: false, ease: "easeOutCubic", delay: 340 })
        .animateProperty("sprite", "position.y", { from: 0, to: -0.5, duration: 400, gridUnits: true, fromEnd: false, delay: 200, ease: "easeOutCubic" })
        .animateProperty("sprite", "position.y", { from: 0, to: 0.5, duration: 500, gridUnits: true, fromEnd: false, delay: 600, ease: "easeOutCubic" })
        .animateProperty("sprite", "rotation", { from: 0, to: 180 * middleposition.x, duration: 500, ease: "easeInOutCubic", fromEnd: false, delay: 100 })
        .animateProperty("sprite", "rotation", { from: 0, to: 180 * middleposition.x, duration: 1000, ease: "easeOutBack", fromEnd: false, delay: 500 })
        .scaleIn(1.2, 400, { delay: 600, ease: "easeInOutQuad" })
        .duration(2000)
        .waitUntilFinished(-1300)

        .thenDo(async () => {
            await mba.createEffect(workflow.actor, effectData)
        })
    
        .effect()
        .file("jb2a.impact.ground_crack.orange.01")
        .atLocation(token)
        .belowTokens()
        .scaleToObject(2)
    
        .animation()
        .delay(1250)
        .on(token)
        .opacity(1)
    
        .play()
}