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
    let regenerationFlags = ['flags.mba-premades.aversion.damageType', 
        'flags.mba-premades.regeneration.crit', 
        'flags.mba-premades.regeneration.threshold', 
        'flags.mba-premades.regeneration.damageType', 
        'flags.mba-premades.regeneration.zeroHP'
    ];
    DAE.addAutoFields(regenerationFlags);
    DAE.addAutoFields(crFlags.concat(cvFlags));
    DAE.addAutoFields(flags);
}

export function colorizeDAETitleBarButton(app, [elem], options) {
    let headerButton = elem.closest('.window-app').querySelector('a.open-item-effect');
    if (!headerButton) return;
    let object = app.object;
    if (!object) return;
    let passiveEffect = !!object.effects.find(i => i.transfer);
    let transferEffect = !!object.effects.find(i => i.transfer === false);
    let color;
    if (passiveEffect && !transferEffect) color = 'dodgerblue';
    else if (transferEffect && !passiveEffect) color = 'green';
    else if (transferEffect && passiveEffect) color = 'orchid';
    else return;
    headerButton.style.color = color;
}