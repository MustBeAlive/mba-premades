import {mba} from "../../../helperFunctions.js";

async function slam({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    new Sequence()

        .effect()
        .file("jb2a.divine_smite.caster.dark_purple")
        .attachTo(target)
        .fadeIn(500)
        .scaleToObject(1.5)
        .belowTokens()

        .play()

    if (!workflow.failedSaves.size) return;
    let damageRoll = workflow.damageRoll.total;
    let effect = await mba.findEffect(target.actor, "Clay Golem: Max Health Reduction");
    if (effect) {
        let originalMax = effect.flags['mba-premades']?.originalMax;
        let newPenalty = effect.flags['mba-premades']?.penalty + damageRoll;
        let updates = {
            'description': `
                <p>Your hit point maximum (<b>${originalMax}</b>) is reduced by (<b>${newPenalty}</b>).</p>
                <p>You will die if this effect reduces your hit point maximum to 0.</p>
                <p>The reduction lasts until removed by the @UUID[Compendium.mba-premades.MBA Spells.Item.D1lMOvyXiY6Ud4km]{Greater Restoration} spell or other magic.</p>
            `,
            'changes': [
                {
                    'key': 'system.attributes.hp.max',
                    'mode': 2,
                    'value': `-${newPenalty}`,
                    'priority': 30
                },
            ],
            'flags': {
                'dae': {
                    'showIcon': true,
                },
                'mba-premades': {
                    'healthReduction': true,
                    'penalty': newPenalty
                }
            }
        };
        await mba.updateEffect(effect, updates);
        return;
    }
    else if (!effect) {
        const effectData = {
            'name': "Clay Golem: Max Health Reduction",
            'icon': "modules/mba-premades/icons/generic/generic_debuff.webp",
            'origin': workflow.item.uuid,
            'description': `
            <p>Your hit point maximum (<b>${target.actor.system.attributes.hp.max}</b>) is reduced by (<b>${damageRoll}</b>).</p>
            <p>You will die if this effect reduces your hit point maximum to 0.</p>
            <p>The reduction lasts until removed by the @UUID[Compendium.mba-premades.MBA Spells.Item.D1lMOvyXiY6Ud4km]{Greater Restoration} spell or other magic.</p>
        `,
            'changes': [
                {
                    'key': 'system.attributes.hp.max',
                    'mode': 2,
                    'value': `-${damageRoll}`,
                    'priority': 30
                },
            ],
            'flags': {
                'dae': {
                    'showIcon': true,
                },
                'mba-premades': {
                    'greaterRestoration': true,
                    'healthReduction': true,
                    'originalMax': target.actor.system.attributes.hp.max,
                    'penalty': damageRoll,
                }
            }
        };
        await mba.createEffect(target.actor, effectData);
    }
}

async function haste({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (mba.findEffect(workflow.actor, "Clay Golem: Haste")) return;
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Haste` });
    };
    const effectData = {
        'name': "Clay Golem: Haste",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Until the end of its next turn, the golem magically gains a +2 bonus to its AC, has advantage on Dexterity saving throws, and can use its Slam attack as a bonus action.</p>
        `,
        'changes': [
            {
                'key': 'system.attributes.ac.bonus',
                'mode': 2,
                'value': "+2",
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.advantage.ability.save.dex',
                'mode': 2,
                'value': 1,
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['turnEndSource']
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };

    new Sequence()

        .effect()
        .file("animated-spell-effects-cartoon.air.portal")
        .attachTo(workflow.token, { offset: { x: 0, y: -0.0 }, gridUnits: true, followRotation: false })
        .scaleToObject(2.5)
        .fadeIn(250)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .fadeOut(500)
        .belowTokens()
        .opacity(0.85)
        .tint("#fef848")

        .effect()
        .file("animated-spell-effects-cartoon.air.explosion.gray")
        .attachTo(workflow.token, { offset: { x: 0, y: -0.0 }, gridUnits: true, followRotation: false })
        .scaleToObject(1.45)
        .fadeIn(250)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .fadeOut(500)
        .belowTokens()
        .tint("#fef848")

        .effect()
        .file("jb2a.wind_lines.01.leaves.01.greenorange")
        .attachTo(workflow.token)
        .scaleToObject(2)
        .fadeIn(1000)
        .fadeOut(1000)
        .opacity(1)
        .rotate(75)
        .playbackRate(2)
        .mask()
        .persist()
        .name(`${workflow.token.document.name} Haste`)

        .effect()
        .file("jb2a.token_border.circle.static.orange.009")
        .attachTo(workflow.token)
        .scaleToObject(2)
        .fadeIn(1000)
        .fadeOut(1000)
        .belowTokens()
        .playbackRate(0.6)
        .opacity(0.9)
        .filter("ColorMatrix", { hue: 20 })
        .persist()
        .name(`${workflow.token.document.name} Haste`)

        .effect()
        .file("animated-spell-effects-cartoon.smoke.19")
        .attachTo(workflow.token, { offset: { x: 0.2 * workflow.token.document.width, y: 0.45 * workflow.token.document.width }, gridUnits: true, followRotation: false })
        .scaleToObject(1.5, { considerTokenScale: true })
        .rotate(-30)
        .filter("Blur", { blurX: 5, blurY: 10 })
        .opacity(0.5)
        .tint("#fef848")

        .effect()
        .file("animated-spell-effects-cartoon.smoke.19")
        .attachTo(workflow.token, { offset: { x: 0.2 * workflow.token.document.width, y: 0.35 * workflow.token.document.width }, gridUnits: true, followRotation: false })
        .scaleToObject(1.5, { considerTokenScale: true })
        .rotate(-30)
        .zIndex(0.1)
        .tint("#fef848")

        .effect()
        .file("animated-spell-effects-cartoon.smoke.19")
        .attachTo(workflow.token, { offset: { x: -0.4 * workflow.token.document.width, y: -0.25 * workflow.token.document.width }, gridUnits: true, followRotation: false })
        .scaleToObject(1.2, { considerTokenScale: true })
        .delay(700)
        .belowTokens(false)
        .mirrorY(true)
        .rotate(110)
        .filter("Blur", { blurX: 5, blurY: 10 })
        .opacity(0.5)
        .tint("#fef848")

        .effect()
        .file("animated-spell-effects-cartoon.smoke.19")
        .attachTo(workflow.token, { offset: { x: -0.4 * workflow.token.document.width, y: -0.35 * workflow.token.document.width }, gridUnits: true, followRotation: false })
        .scaleToObject(1.2, { considerTokenScale: true })
        .delay(700)
        .belowTokens(false)
        .mirrorY(true)
        .rotate(110)
        .zIndex(0.1)
        .tint("#fef848")

        .wait(700)

        .thenDo(async () => {
            await mba.createEffect(workflow.token.actor, effectData);
        })

        .play()
}

async function berserk(token) {
    if (mba.findEffect(token.actor, "Berserk")) return;
    let feature = await mba.getItem(token.actor, "Berserk");
    let currentHP = token.actor.system.attributes.hp.value;
    if (currentHP > 60) return;
    let berserkRoll = await new Roll("1d6").roll({ 'async': true });
    await MidiQOL.displayDSNForRoll(berserkRoll);
    berserkRoll.toMessage({
        rollMode: 'roll',
        speaker: { alias: name },
        flavor: 'Berserk Check'
    });
    if (berserkRoll.total != 6) return;
    async function effectMacroDel() {
        new Sequence()

            .animation()
            .on(token)
            .opacity(1)

            .play();

        await Sequencer.EffectManager.endEffects({ name: `${token.document.name} Berserk` })
    };
    let effectData = {
        'name': "Berserk",
        'icon': "modules/mba-premades/icons/class/barbarian/frenzy.webp",
        'description': `
            <p>On each of its turns while berserk, the golem attacks the nearest creature it can see.</p>
            <p>If no creature is near enough to move to and attack, the golem attacks an object, with preference for an object smaller than itself.</p>
            <p>Once the golem goes berserk, it continues to do so until it is destroyed or regains all its hit points.</p>
        `,
        'flags': {
            'dae': {
                'showIcon': true
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };
    new Sequence()

        .effect()
        .file("jb2a.extras.tmfx.outpulse.circle.02.normal")
        .atLocation(token)
        .size(4, { gridUnits: true })
        .opacity(0.25)

        .effect()
        .file("jb2a.impact.ground_crack.orange.02")
        .atLocation(token)
        .belowTokens()
        .filter("ColorMatrix", { hue: -15, saturate: 1 })
        .size(3.5, { gridUnits: true })
        .zIndex(1)

        .effect()
        .file("jb2a.impact.ground_crack.still_frame.02")
        .atLocation(token)
        .belowTokens()
        .fadeIn(1000)
        .filter("ColorMatrix", { hue: -15, saturate: 1 })
        .size(3.5, { gridUnits: true })
        .zIndex(0)

        .effect()
        .file("jb2a.token_border.circle.static.orange.012")
        .atLocation(token)
        .attachTo(token)
        .opacity(0.6)
        .scaleToObject(2)
        .filter("ColorMatrix", { saturate: 1 })
        .tint("#FF0000")
        .fadeOut(500)
        .mask()
        .persist()
        .name(`${token.document.name} Berserk`)

        .thenDo(async () => {
            await feature.displayCard();
            await mba.createEffect(token.actor, effectData);
        })

        .play()
}

export let clayGolem = {
    'slam': slam,
    'haste': haste,
    'berserk': berserk
}