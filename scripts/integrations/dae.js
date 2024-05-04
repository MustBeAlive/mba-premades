export function addDAEFlags() {
    let crFlags = Object.keys(CONFIG.DND5E.conditionTypes).map(i => 'flags.mba-premades.CR.' + i);
    let cvFlags = Object.keys(CONFIG.DND5E.conditionTypes).map(i => 'flags.mba-premades.CV.' + i);
    let flags = ['flags.mba-premades.lesserRestoration',
        'flags.mba-premades.greaterRestoration',
        'flags.mba-premades.isDisease',
        'flags.mba-premades.isCurse',
        'flags.mba-premades.abilityReduction',
        'flags.mba-premades.healthReduction',
        'flags.mba-premades.penalty'
    ];
    DAE.addAutoFields(crFlags.concat(cvFlags));
    DAE.addAutoFields(flags);
}