export function addDAEFlags() {
    let flags = ['flags.mba-premades.lesserRestoration',
        'flags.mba-premades.greaterRestoration',
        'flags.mba-premades.isDisease',
        'flags.mba-premades.isCurse',
        'flags.mba-premades.abilityReduction',
        'flags.mba-premades.healthReduction',
        'flags.mba-premades.penalty'
    ];
    DAE.addAutoFields(flags);
}