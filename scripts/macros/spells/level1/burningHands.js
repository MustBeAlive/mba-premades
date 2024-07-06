export async function burningHands({ speaker, actor, token, character, item, args, scope, workflow }) {
	let template = canvas.scene.collections.templates.get(workflow.templateId);
	if (!template) return;

	new Sequence()

		.effect()
		.file('jb2a.energy_strands.in.yellow.01.0')
		.atLocation(workflow.token)
		.rotateTowards(template, { 'cacheLocation': true })
		.scaleToObject(1.1)
		.anchor({ 'x': 0.15 })
		.zIndex(1)

		.effect()
		.file('jb2a.magic_signs.circle.02.evocation.loop.yellow')
		.atLocation(workflow.token)
		.rotateTowards(template, { 'cacheLocation': true })
		.anchor({ x: 0.15 })
		.scaleToObject(1.1)
		.duration(5000)
		.fadeIn(500)
		.fadeOut(500)
		.loopProperty('sprite', 'rotation', { 'from': 0, 'to': 360, 'duration': 1000 })
		.scaleOut(0.1, 2000, { 'ease': 'easeOutQuint', 'delay': -3000 })
		.zIndex(2)

		.effect()
		.file('jb2a.particles.outward.orange.01.04')
		.atLocation(workflow.token)
		.rotateTowards(template, { 'cacheLocation': true })
		.scaleToObject(1.1)
		.anchor({ x: 0.15 })
		.duration(5000)
		.fadeIn(500)
		.fadeOut(500)
		.loopProperty('sprite', 'rotation', { 'from': 0, 'to': 360, 'duration': 3000 })
		.scaleOut(0.175, 5000, { 'ease': 'easeOutQuint', 'delay': -3000 })
		.waitUntilFinished(-4000)
		.zIndex(1)

		.effect()
		.file('jb2a.impact.010.orange')
		.atLocation(workflow.token)
		.rotateTowards(template, { 'cacheLocation': true })
		.anchor({ x: 0.15 })
		.scaleToObject(1.1)
		.zIndex(3)

		.effect()
		.file('jb2a.burning_hands.02.orange')
		.atLocation(template/*.position*/, { 'cacheLocation': true })
		.stretchTo(template, { 'cacheLocation': true })
		.zIndex(3)

		.play();
}