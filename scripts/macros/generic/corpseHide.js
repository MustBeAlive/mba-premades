import {mba} from "../../helperFunctions.js";

export async function corpseHide(combat, update, options, userId) {
    if (!combat.started) return;
    let combatants = Array.from(game.combat.combatants).filter(i => i.isDefeated === true && i.isNPC === true && i.token.hidden != 1 && !mba.findEffect(i.actor, "Regeneration"));
    if (!combatants.length) return;
    let updates = {
        token: {
            'hidden': true
        },
    };
    let options1 = {
        'permanent': true,
        'name': 'Corpse Hider',
        'description': 'Corpse Hider'
    };
    for (let combatant of combatants) {
        let tokenDoc = combatant.token;
        let token = tokenDoc.object
        new Sequence()

            .effect()
            .file("jb2a.misty_step.01.dark_black")
            .atLocation(token)
            .scaleToObject(2 * tokenDoc.texture.scaleX)
            .aboveInterface()
            .waitUntilFinished(-1600)

            .thenDo(function () {
                warpgate.mutate(tokenDoc, updates, {}, options1);
            })

            .play()
    }
}