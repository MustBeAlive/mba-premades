export async function actionsTab(api) {
    let sections = [
        {
            'label': 'DND5E.FeatureActive',
            'items': [],
            'hasActions': true,
            'dataset': {
                'type': 'feat'
            }
        }
    ];
    let pack = game.packs.get('mba-premades.MBA Actions');
    if (!pack) return;
    await pack.getDocuments();
    sections[0].items = pack.contents;
    api.registerCharacterTab(
        new api.models.HandlebarsTab({
            title: 'MBA Actions',
            path: '/systems/dnd5e/templates/actors/parts/actor-features.hbs',
            tabId: 'mba-actions-tab',
            getData: async (data) => {
                console.log(data);
                return {
                    ...data,
                    // change any other Character Sheet Context data as needed
                    'sections': sections
                }
            },
            onRender(params) {
            // wire some events
            }
        })
    );
}