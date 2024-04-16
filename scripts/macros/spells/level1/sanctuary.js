async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.targets.size) return;
    let target = workflow.targets.first();
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Sanctuary` })
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are warded against attacks. Until the spell ends, any creature who targets you with an attack or a harmful spell must first make a Wisdom saving throw. On a failed save, the creature must choose a new target or lose the attack or spell.</p>
            <p>This spell doesn't protect you from area effects, such as the explosion of a fireball.</p>
            <p>If you make an attack, cast a spell that affects an enemy, or deal damage to another creature, this spell ends.</p>
        `,
        'duration': {
            'seconds': 60,
        },
        'changes': [
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.sanctuary.attack,postActiveEffects',
                'priority': 20
            }
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': chrisPremades.helpers.functionToString(effectMacroDel)
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 1,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    new Sequence()

        .effect()
        .atLocation(token)
        .file(`jb2a.markers.light.complete.blue`)
        .scaleToObject(2)
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .belowTokens()
        .fadeOut(2000)
        .duration(5000)
        .zIndex(1)
        .filter("ColorMatrix", { saturate: -1, brightness: 1.5 })

        .wait(500)

        .effect()
        .from(target)
        .duration(2000)
        .scaleToObject(target.document.texture.scaleX)
        .atLocation(target)
        .fadeIn(2000)
        .filter("ColorMatrix", { saturate: -1, brightness: 10 })
        .filter("Blur", { blurX: 5, blurY: 10 })
        .opacity(0.5)
        .waitUntilFinished(-1500)

        .effect()
        .file("jb2a.extras.tmfx.border.circle.outpulse.01.normal")
        .delay(1200)
        .atLocation(target)
        .scaleToObject(3.25 * target.document.texture.scaleX)

        .effect()
        .file("jb2a.extras.tmfx.outflow.circle.02")
        .delay(1200)
        .atLocation(target)
        .fadeIn(200)
        .opacity(0.25)
        .duration(10000)
        .scaleToObject(3 * target.document.texture.scaleX)
        .fadeOut(500)
        .belowTokens()

        .effect()
        .file("jb2a.particles.outward.blue.01.03")
        .delay(1200)
        .atLocation(target)
        .filter("ColorMatrix", { saturate: -1, brightness: 2 })
        .fadeIn(200, { ease: "easeInExpo" })
        .duration(10000)
        .opacity(0.25)
        .scaleToObject(3 * target.document.texture.scaleX)
        .fadeOut(500)
        .belowTokens()

        .effect()
        .file("jb2a.butterflies.single.blue")
        .delay(1200)
        .scaleToObject(2 * target.document.texture.scaleX)
        .opacity(1)
        .fadeIn(2000)
        .filter("ColorMatrix", { saturate: -1, brightness: 2 })
        .attachTo(target, { followRotation: false })
        .fadeOut(1000)
        .zIndex(3)
        .persist()
        .name(`${target.document.name} Sanctuary`)

        .effect()
        .file("jb2a.extras.tmfx.inflow.circle.03")
        .delay(1200)
        .atLocation(target)
        .scaleToObject(target.document.texture.scaleX)
        .opacity(0.75)
        .attachTo(target)
        .fadeIn(1000)
        .fadeOut(1000)
        .zIndex(1)
        .persist()
        .name(`${target.document.name} Sanctuary`)

        .effect()
        .file("jb2a.bless.200px.intro.blue")
        .atLocation(target)
        .scaleToObject(1.5 * target.document.texture.scaleX)
        .fadeIn(2000)
        .opacity(1)
        .waitUntilFinished(-500)
        .zIndex(0)

        .effect()
        .file("jb2a.bless.200px.loop.blue")
        .scaleToObject(1.5 * target.document.texture.scaleX)
        .opacity(0.75)
        .fadeOut(1000)
        .attachTo(target, { followRotation: false })
        .zIndex(0)
        .persist()
        .name(`${target.document.name} Sanctuary`)

        .play();

    await warpgate.wait(2400);
    await chrisPremades.helpers.createEffect(target.actor, effectData)
}

async function hook(workflow) {
    if (!workflow.token) return;
    if (workflow.targets.size != 1) return;
    let invalidTypes = [
        'cone',
        'cube',
        'cylinder',
        'line',
        'radious',
        'sphere',
        'square',
        'wall'
    ];
    if (invalidTypes.includes(workflow.item.system.target?.type)) return;
    let targetToken = workflow.targets.first();
    if (targetToken.document.disposition === workflow.token.document.disposition) return;
    let targetActor = targetToken.actor;
    let targetEffect = chrisPremades.helpers.findEffect(targetActor, 'Sanctuary');
    if (!targetEffect) return;
    let targetItem = await fromUuid(targetEffect.origin);
    if (!targetItem) return;
    let featureData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Spell Features', 'Sanctuary: Save', false);
    if (!featureData) return;
    featureData.system.save.dc = chrisPremades.helpers.getSpellDC(targetItem);
    setProperty(featureData, 'flags.mba-premades.spell.sanctuary.ignore', true);
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': targetItem.actor });
    let [config, options] = chrisPremades.constants.syntheticItemWorkflowOptions([workflow.token.document.uuid]);
    let queueSetup = await chrisPremades.queue.setup(workflow.item.uuid, 'sanctuary', 48);
    if (!queueSetup) return;
    await warpgate.wait(100);
    let spellWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (!spellWorkflow.failedSaves.size) {
        chrisPremades.queue.remove(workflow.item.uuid);
        return;
    }
    chrisPremades.queue.remove(workflow.item.uuid);
    const messageData = { flavor: `<b>${workflow.token.document.name}</b> failed save against <b>Sanctuary</b> and must choose new target, or lose the attack/spell.` };
    await ChatMessage.create(messageData);
    new Sequence()

        .effect()
        .file('jb2a.bless.200px.intro.blue')
        .atLocation(workflow.token)
        .scaleToObject(1.5 * workflow.token.document.texture.scaleX)
        .fadeIn(2000)
        .fadeOut(500)
        .opacity(1)
        .zIndex(0)

        .play();

    return false;
}

async function attack({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.item.flags['mba-premades']?.spell?.sanctuary?.ignore) return;
    let remove = false;
    let defaultDamageType = workflow.defaultDamageType;
    if (workflow.damageRoll && !(defaultDamageType === 'healing' || defaultDamageType === 'temphp')) {
        remove = true;
    }
    if (!remove && chrisPremades.constants.attacks.includes(workflow.item.system.actionType)) remove = true;
    if (!remove && workflow.item.type === 'spell') {
        for (let i of Array.from(workflow.targets)) {
            if (workflow.token.document.disposition != i.document.disposition) {
                remove = true;
                break;
            }
        }
    }
    if (!remove) return;
    let effect = chrisPremades.helpers.findEffect(workflow.actor, 'Sanctuary');
    if (!effect) return;
    await chrisPremades.helpers.removeEffect(effect);
}

export let sanctuary = {
    'item': item,
    'hook': hook,
    'attack': attack
}