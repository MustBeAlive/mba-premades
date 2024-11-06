import {mba} from "../../helperFunctions.js";
import {tashaSummon} from "../generic/tashaSummon.js";

export async function panpipesOfTheSewers({ speaker, actor, token, character, item, args, scope, workflow }) {
    let sourceActor = game.actors.getName('Sewer Pipes: Swarm of Rats');
    if (!sourceActor) {
        ui.notifications.warn('Missing actor in the side panel! (Sewer Pipes: Swarm of Rats)');
        return;
    }
    let tokenName = `${workflow.token.document.name} Swarm of Rats`;
    let updates = {
        'actor': {
            'name': tokenName,
            'prototypeToken': {
                'disposition': workflow.token.document.disposition,
                'name': tokenName,
            }
        },
        'token': {
            'disposition': workflow.token.document.disposition,
            'name': tokenName,
        }
    };

    new Sequence()
    
        .wait(150)
    
        .effect()
        .file("jb2a.markers.music.pink")
        .atLocation(token)
        .attachTo(token)
        .scaleToObject(1.5)
        .fadeIn(500)
        .fadeOut(500)
        .opacity(0.75)
    
        .effect()
        .file("animated-spell-effects-cartoon.level 01.bless.blue")
        .atLocation(token, { randomOffset: 1.2, gridUnits: true })
        .scaleToObject(0.5)
        .repeats(8, 100, 100)
        .filter("ColorMatrix", { saturate: 1, hue: 80 })
        .zIndex(1)
    
        .effect()
        .file("animated-spell-effects-cartoon.cantrips.mending.purple")
        .atLocation(token)
        .scaleToObject(3)
        .opacity(0.75)
        .filter("ColorMatrix", { saturate: 1, brightness: 1.3, hue: -5 })
        .zIndex(0)
    
        .effect()
        .delay(800)
        .file("jb2a.impact.002.pinkpurple")
        .atLocation(token)
        .scaleToObject(2)
        .opacity(1)
        .filter("ColorMatrix", { hue: 6 })
        .zIndex(0)
    
        .effect()
        .file("jb2a.particles.inward.white.02.03")
        .scaleIn(0, 500, { ease: "easeOutQuint" })
        .delay(800)
        .fadeOut(1000)
        .atLocation(token)
        .duration(1000)
        .size(1.75, { gridUnits: true })
        .animateProperty("spriteContainer", "position.y", { from: 0, to: -0.5, gridUnits: true, duration: 1000 })
        .zIndex(1)
    
        .play();

    await mba.playerDialogMessage(game.user);
    await tashaSummon.spawn(sourceActor, updates, 86400, workflow.item, 30, workflow.token, "nature");
    await mba.clearPlayerDialogMessage();
}