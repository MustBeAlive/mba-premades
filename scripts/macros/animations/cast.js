let animations = {
    'abj': 'jb2a.magic_signs.circle.02.abjuration.loop.',
    'con': 'jb2a.magic_signs.circle.02.conjuration.loop.',
    'div': 'jb2a.magic_signs.circle.02.divination.loop.',
    'enc': 'jb2a.magic_signs.circle.02.enchantment.loop.',
    'evo': 'jb2a.magic_signs.circle.02.evocation.loop.',
    'ill': 'jb2a.magic_signs.circle.02.illusion.loop.',
    'nec': 'jb2a.magic_signs.circle.02.necromancy.loop.',
    'trs': 'jb2a.magic_signs.circle.02.transmutation.loop.'
}

export async function cast(workflow) {
    if (!workflow.token || workflow.item?.type != 'spell') return;
    let school = workflow.item.system.school;
    if (!Object.keys(animations).includes(school)) return;
    let color = game.settings.get('mba-premades', school + '_color');
    let animation = animations[school] + color;
    new Sequence()

        .effect()
        .file(animation)
        .atLocation(workflow.token)
		.scaleToObject(1.5)
        .fadeOut(2000)
		.rotateIn(180, 600, { ease: "easeOutCubic" })
		.scaleIn(0, 600, { ease: "easeOutCubic" })
		.loopProperty("sprite", "rotation", { from: 0, to: -360, duration: 10000 })
		.belowTokens()
		.zIndex(0)

        .effect()
        .file(animation)
        .atLocation(workflow.token)
        .scaleToObject(1.5)
        .duration(1200)
        .fadeIn(200, { ease: "easeOutCirc", delay: 500 })
		.fadeOut(300, { ease: "linear" })
		.rotateIn(180, 600, { ease: "easeOutCubic" })
		.scaleIn(0, 600, { ease: "easeOutCubic" })
		.loopProperty("sprite", "rotation", { from: 0, to: -360, duration: 10000 })
		.belowTokens()
        .zIndex(1)
		.filter("ColorMatrix", { saturate: -1, brightness: 2 })
		.filter("Blur", { blurX: 5, blurY: 10 })

        .play();

    await warpgate.wait(100);
}