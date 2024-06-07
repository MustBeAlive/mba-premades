import {mba} from "../../helperFunctions.js";

export async function drawCard({ speaker, actor, token, character, item, args, scope, workflow }) {
    let options = [["Yes, let's draw some cards", "yes"], ["No, deny card draw", "no"]];
    await mba.gmDialogMessage();
    let selection = await mba.remoteDialog(workflow.item.name, options, game.users.activeGM.id, `<b>${game.users.current.name}</b> wants to draw some Tarokka cards`);
    await mba.clearGMDialogMessage();
    if (!selection || selection === "no") {
        ui.notifications.info("GM has denied your request. Sorry!");
        return;
    }
    let deckName = 'Tarokka Deck';
    let discardPile = 'Discard Pile';
    let faceDown = true; // true = back, false = face
    let whisper = false; // whisper to GM, if executed by user: whisper from user to GM
    let share = false; // show to ALL active users

    OrcnogFancyCardDealer({ deckName: deckName, discardPileName: discardPile }).draw(faceDown, whisper, share);
    await warpgate.wait(1000);
    OrcnogFancyCardDealer({ deckName: deckName, discardPileName: discardPile }).draw(faceDown, whisper, share);
    await warpgate.wait(1000);
    OrcnogFancyCardDealer({ deckName: deckName, discardPileName: discardPile }).draw(faceDown, whisper, share);
    await warpgate.wait(100);

    // Discard Pile Cleaning Block (requires players to have permission to the pile)
    const pileToEmpty = game.cards.getName("Discard Pile");
    for (let card of pileToEmpty.cards) {
        const originalDeck = card.origin;
        const originalCard = originalDeck.cards.get(card.id);
        await originalCard.update({ drawn: false });
        await card.delete();
    }
}