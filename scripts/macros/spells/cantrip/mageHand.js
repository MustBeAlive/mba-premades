// Based on multiple CPR Summon Macro
export async function mageHand({ speaker, actor, token, character, item, args, scope, workflow }) {
    let sourceActor = game.actors.getName("MBA - Mage Hand");
    if (!sourceActor) {
        ui.notifications.warn('Missing actor in the side panel! (MBA - Mage Hand)');
        return;
    }
    let tokenName = chrisPremades.helpers.getConfiguration(workflow.item, 'name') ?? 'Mage Hand';
    if (tokenName === '') tokenName = 'Mage Hand';
    let updates = {
        'actor': {
            'name': tokenName,
            'prototypeToken': {
                'name': tokenName,
                'disposition': workflow.token.document.disposition
            }
        },
        'token': {
            'name': tokenName,
            'disposition': workflow.token.document.disposition
        }
    };
    let selectionColor = await chrisPremades.helpers.dialog('What Color', [
        ['Blue', 'blue'],
        ['Green', 'green'],
        ['Purple', 'purple'],
        ['Red', 'red'],
        ['Rainbow', 'rainbow']
    ]);
    if (!selectionColor) return;
    let selectedName = 'jb2a.arcane_hand.' + selectionColor;
    let selectedImg = await Sequencer.Database.getEntry(selectedName).file;

    let avatarImg = chrisPremades.helpers.getConfiguration(workflow.item, 'avatar');
    if (avatarImg) updates.actor.img = avatarImg;
    let tokenImg = selectedImg;
    if (tokenImg) {
        setProperty(updates, 'actor.prototypeToken.texture.src', tokenImg);
        setProperty(updates, 'token.texture.src', tokenImg);
    }
    let animation = chrisPremades.helpers.getConfiguration(workflow.item, 'animation-') ?? 'celestial';
    await mbaPremades.tashaSummon.spawn(sourceActor, updates, 60, workflow.item, 60, workflow.token, animation, {}, workflow.castData.castLevel);
}