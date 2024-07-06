import {mba} from "../../../helperFunctions.js";

export async function revivify({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let isDead = await mba.findEffect(target.actor, 'Dead');
    if (!isDead) {
        ui.notifications.warn("Target is not dead!");
        return;
    }
    let gentleRepose = await mba.findEffect(target.actor, "Gentle Repose");
    let timeLimit = 60;
    if (gentleRepose) timeLimit = 864060;
    let timeDiff = game.time.worldTime - isDead.duration.startTime;
    if (timeDiff >= timeLimit) {
        ui.notifications.info("Target is dead for at least 60 seconds. Sorry, but it's too late.");
        return;
    }
    
    new Sequence()
    
        .effect()
        .file("jb2a.extras.tmfx.inpulse.circle.01.normal")
        .attachTo(target)
        .scaleToObject(1)
    
        .effect()
        .file("jb2a.misty_step.02.yellow")
        .attachTo(target)
        .scaleToObject(1)
        .scaleOut(1, 3500, { ease: "easeOutCubic" })
    
        .wait(1400)
    
        .effect()
        .file("jb2a.healing_generic.burst.tealyellow")
        .attachTo(target, { bindAlpha: false })
        .scaleToObject(1.5)
        .duration(1200)
        .fadeOut(1000, { ease: "easeInExpo" })
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .belowTokens()
        .filter("ColorMatrix", { hue: 225 })
    
        .effect()
        .from(target)
        .atLocation(target)
        .filter("ColorMatrix", { saturate: -1, brightness: 10 })
        .filter("Blur", { blurX: 5, blurY: 10 })
        .fadeIn(100)
        .opacity(1)
        .fadeOut(5000)
        .duration(6000)
    
        .effect()
        .file("jb2a.fireflies.few.02.yellow")
        .attachTo(target)
        .scaleToObject(2)
        .duration(6000)
        .fadeIn(200, { ease: "easeInExpo" })
        .fadeOut(1000)
    
        .effect()
        .file("jb2a.extras.tmfx.outflow.circle.02")
        .attachTo(target)
        .scaleToObject(2)
        .duration(6000)
        .fadeIn(200, { ease: "easeInExpo" })
        .fadeOut(1000)
        .opacity(0.25)
        .belowTokens()
    
        .effect()
        .file("jb2a.particles.outward.blue.01.03")
        .attachTo(target)
        .scaleToObject(2)
        .duration(6000)
        .fadeIn(200, { ease: "easeInExpo" })
        .fadeOut(1000)
        .opacity(0.25)
        .belowTokens()
        .filter("ColorMatrix", { saturate: -1, brightness: 2 })
    
        .play()
    
    let updates;
    let options;
    if (target.actor.type === "npc") {
        updates = {
            'actor': {
                'system': {
                    'attributes': {
                        'hp': {
                            'value': 1
                        }
                    }
                }
            }
        };
        options = {
            'permanent': true,
            'name': "Revivify",
            'description': "Revivify"
        };
        await warpgate.wait(1500);
        if (gentleRepose) await mbaPremades.helpers.removeEffect(gentleRepose);
        await warpgate.mutate(target.document, updates, options);
        return
    }
    updates = {
        'actor': {
            'system': {
                'attributes': {
                    'death': {
                        'failure': 0,
                        'success': 0
                    },
                    'hp': {
                        'value': 1
                    }
                }
            }
        }
    };
    options = {
        'permanent': true,
        'name': "Revivify",
        'description': "Revivify"
    };
    await warpgate.wait(1500);
    if (gentleRepose) await mbaPremades.helpers.removeEffect(gentleRepose);
    await mbaPremades.helpers.removeCondition(target.actor, 'Dead');
    await warpgate.mutate(target.document, updates, options);
}