export async function corpseHide(combat, update, options, userId) {
    if (!combat.started) return;
    let combatants = Array.from(game.combat.combatants).filter(i => i.isDefeated === true && i.isNPC === true && i.token.hidden != 1);
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

            .effect()
            .file("jb2a.smoke.puff.centered.dark_black.0")
            .delay(1000)
            .atLocation(token)
            .scaleToObject(3 * tokenDoc.texture.scaleX)
            .fadeOut(500)
            .aboveInterface()

            .effect()
            .file("jb2a.smoke.puff.centered.dark_black.1")
            .delay(1000)
            .atLocation(token)
            .scaleToObject(3 * tokenDoc.texture.scaleX)
            .fadeOut(500)
            .aboveInterface()

            .effect()
            .file("jb2a.smoke.puff.centered.dark_black.2")
            .delay(1000)
            .atLocation(token)
            .scaleToObject(3 * tokenDoc.texture.scaleX)
            .fadeOut(500)
            .aboveInterface()
            .waitUntilFinished(-1300)

            .thenDo(function () {
                warpgate.mutate(tokenDoc, updates, {}, options1);
            })

            .play()
    }
}