export async function haste(actor) {
    const effectData = {
        'name': "Haste - Lethargic",
        'icon': "assets/library/icons/sorted/conditions/downed.png",
        'description': "You are swept by a wave of lethargy: you can't move or take actions until the end of your next turn.",
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['turnEnd']
            }
        }
      };
      actor.createEmbeddedDocuments("ActiveEffect", [effectData]);
}