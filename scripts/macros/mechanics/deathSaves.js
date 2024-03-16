export async function deathSaves(combat, update, options, userId) {
    if (!combat.started) return;
        
    let currentTokenId = combat.current.tokenId;
    let token = canvas.tokens.get(currentTokenId);
    let actor = token.actor;

    if (actor.system.attributes.hp.value <= 0 && actor.isOwner && actor.system.attributes.death.success < 3) {
        game.MonksTokenBar.requestRoll(
            [{"token": token.id}],
            {
                request: [{"type": "misc", "key": "death"}],
                dc:10,
                showdc:true,
                silent: false, 
                fastForward: false, 
                flavor:'Кто-то борется за свою жизнь...',
                rollMode: 'gmroll'
            }
        );
    }
}