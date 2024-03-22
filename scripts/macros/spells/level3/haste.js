export async function haste(actor) {
    const effectData = {
        'name': "Haste: Lethargic",
        'icon': "assets/library/icons/sorted/conditions/downed.png",
        'description': "You are swept by a wave of lethargy. You can't move or take actions until the end of your next turn.",
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['turnEnd']
            }
        }
    };
    await chrisPremades.helpers.createEffect(actor, effectData);
}