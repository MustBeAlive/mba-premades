async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    new Sequence()

        .effect()
        .atLocation(token)
        .file(`jb2a.magic_signs.circle.02.evocation.loop.blue`)
        .scaleToObject(1.5)
        .rotateIn(180, 600, { ease: "easeOutCubic" })
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .loopProperty("sprite", "rotation", { from: 0, to: -360, duration: 10000 })
        .belowTokens()
        .fadeOut(2000)
        .zIndex(0)

        .effect()
        .atLocation(token)
        .file(`jb2a.magic_signs.circle.02.evocation.complete.blue`)
        .scaleToObject(1.5)
        .rotateIn(180, 600, { ease: "easeOutCubic" })
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .loopProperty("sprite", "rotation", { from: 0, to: -360, duration: 10000 })
        .belowTokens(true)
        .filter("ColorMatrix", { saturate: -1, brightness: 2 })
        .filter("Blur", { blurX: 5, blurY: 10 })
        .zIndex(1)
        .duration(2500)
        .fadeIn(200, { ease: "easeOutCirc", delay: 500 })
        .fadeOut(300, { ease: "linear" })


        .effect()
        .atLocation(template)
        .file(`jb2a.cast_generic.01.blue.0`)
        .delay(1500)
        .size(9, { gridUnits: true })
        .fadeIn(500)
        .opacity(1)
        .zIndex(2)
        .repeats(4, 500)
        .private()

        .effect()
        .file("jb2a.template_circle.out_pulse.02.loop.bluewhite")
        .atLocation(template)
        .delay(3500)
        .scaleIn(0, 1500, { ease: "easeOutCubic" })
        .fadeIn(500)
        .fadeOut(500)
        .size(12, { gridUnits: true })
        .belowTokens()
        .randomRotation()
        .zIndex(2)
        .private()

        .effect()
        .file("jb2a.template_circle.out_pulse.02.loop.bluewhite")
        .atLocation(template)
        .delay(3500)
        .scaleIn(0, 1500, { ease: "easeOutCubic" })
        .fadeIn(500)
        .fadeOut(500)
        .size(6, { gridUnits: true })
        .belowTokens()
        .randomRotation()
        .zIndex(2)

        .effect()
        .file("jb2a.portals.horizontal.vortex.blue")
        .atLocation(template)
        .delay(3800)
        .fadeIn(1500)
        .opacity(0.95)
        .fadeOut(500)
        .size(8, { gridUnits: true })
        .belowTokens()
        .persist()
        .zIndex(1.2)
        .name(`Maelstrom`)
        .private()


        .effect()
        .file("jb2a.whirlwind.blue")
        .atLocation(template)
        .delay(3800)
        .fadeIn(1500)
        .opacity(0.85)
        .fadeOut(500)
        .size(12, { gridUnits: true })
        .belowTokens()
        .persist()
        .zIndex(1.3)
        .name(`Maelstrom`)
        .private()

        .effect()
        .atLocation(template)
        .file(`jb2a.magic_signs.circle.02.evocation.complete.blue`)
        .size(13, { gridUnits: true })
        .fadeIn(600)
        .opacity(1)
        .rotateIn(180, 600, { ease: "easeOutCubic" })
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .persist()
        .belowTokens()
        .zIndex(1)
        .name(`Maelstrom`)
        .waitUntilFinished()

        .play()
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;
    await template.update({
        'flags': {
            'mba-premades': {
                'template': {
                    'name': 'maelstrom',
                    'castLevel': workflow.castData.castLevel,
                    'saveDC': chrisPremades.helpers.getSpellDC(workflow.item),
                    'macroName': 'maelstrom',
                    'templateUuid': template.uuid,
                    'turn': 'end',
                    'ignoreMove': true
                }
            }
        }
    });
}

async function trigger(token, trigger) {
    let template = await fromUuid(trigger.templateUuid);
    if (!template) return;
    let originUuid = template.flags.dnd5e?.origin;
    if (!originUuid) return;
    let originItem = await fromUuid(originUuid);
    if (!originItem) return;
    let featureData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Spell Features', 'Maelstrom: Strong Current', false);
    if (!featureData) return;
    featureData.system.save.dc = trigger.saveDC;
    delete featureData._id;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': originItem.actor });
    let [config, options] = chrisPremades.constants.syntheticItemWorkflowOptions([token.uuid]);
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (!featureWorkflow.failedSaves.size) return;
    let target = token.object;
    let templateCenter = { x: template.x, y: template.y };
    let ray = new Ray(templateCenter, target.center);
    let pullFactor = -2;
    let newCenter = ray.project(1 + ((canvas.dimensions.size * pullFactor / ray.distance)));
    newCenter = canvas.grid.getSnappedPosition(newCenter.x - target.w / 2, newCenter.y - target.h / 2, 1);
    let targetUpdate = {
        'token': {
            'x': newCenter.x,
            'y': newCenter.y
        }
    };
    let moveOptions = {
        'permanent': true,
        'name': 'Move Token',
        'description': 'Move Token'
    };
    await warpgate.mutate(target.document, targetUpdate, {}, moveOptions);
}

async function enter(template, token) {
    let trigger = template.flags['mba-premades']?.template;
    if (!trigger) return;
    await maelstrom.trigger(token.document, trigger);
}

async function del() {
    await Sequencer.EffectManager.endEffects({ name: "Maelstrom" })
}

export let maelstrom = {
    'cast': cast,
    'item': item,
    'trigger': trigger,
    'enter': enter,
    'del': del
}