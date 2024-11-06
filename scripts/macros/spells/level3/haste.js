import {mba} from "../../../helperFunctions.js";

export async function haste({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Haste`, object: token });
        async function effectMacroLethargic() {
            Sequencer.EffectManager.endEffects({ name: `${token.document.name} Lthrgc`, object: token });
        };
        const effectData = {
            'name': "Haste: Lethargic",
            'icon': "modules/mba-premades/icons/conditions/downed.webp",
            'description': `
                <p>You are swept by a wave of lethargy.</p>
                <p>You can't move or take actions until the end of your next turn.</p>
            `,
            'flags': {
                'dae': {
                    'showIcon': true,
                    'specialDuration': ['turnEnd']
                },
                'effectmacro': {
                    'onDelete': {
                        'script': mbaPremades.helpers.functionToString(effectMacroLethargic)
                    }
                }
            }
        };
        new Sequence()

            .effect()
            .file("jb2a.token_border.circle.static.orange.009")
            .attachTo(token)
            .scaleToObject(2)
            .fadeIn(1000)
            .fadeOut(1000)
            .belowTokens()
            .playbackRate(0.6)
            .opacity(0.9)
            .filter("ColorMatrix", { hue: 340 })
            .persist()
            .name(`${token.document.name} Lthrgc`)

            .play()

        await mbaPremades.helpers.createEffect(actor, effectData);
    }
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Your speed is doubled, you gain a +2 bonus to AC, you have advantage on Dexterity saving throws, and you gain an additional action on each of your turns.</p>
            <p>That action can be used only to take the Attack (one weapon attack only), Dash, Disengage, Hide, or Use an Object action</p>
            <p>When the spell ends, you can't move or take actions until after your next turn, as a wave of lethargy sweeps over you.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'system.attributes.movement.all',
                'mode': 0,
                'value': "*2",
                'priority': 20
            },
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
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 3,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };

    new Sequence()

        .wait(750)

        .effect()
        .file("animated-spell-effects-cartoon.air.portal")
        .attachTo(target, { offset: { x: 0, y: -0.0 }, gridUnits: true, followRotation: false })
        .scaleToObject(2.5)
        .fadeIn(250)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .fadeOut(500)
        .belowTokens()
        .opacity(0.85)
        .tint("#fef848")

        .effect()
        .file("animated-spell-effects-cartoon.air.explosion.gray")
        .attachTo(target, { offset: { x: 0, y: -0.0 }, gridUnits: true, followRotation: false })
        .scaleToObject(1.45)
        .fadeIn(250)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .fadeOut(500)
        .belowTokens()
        .tint("#fef848")

        .effect()
        .file("jb2a.wind_lines.01.leaves.01.greenorange")
        .attachTo(target)
        .scaleToObject(2)
        .fadeIn(1000)
        .fadeOut(1000)
        .opacity(1)
        .rotate(75)
        .playbackRate(2)
        .mask()
        .persist()
        .name(`${target.document.name} Haste`)

        .effect()
        .file("jb2a.token_border.circle.static.orange.009")
        .attachTo(target)
        .scaleToObject(2)
        .fadeIn(1000)
        .fadeOut(1000)
        .belowTokens()
        .playbackRate(0.6)
        .opacity(0.9)
        .filter("ColorMatrix", { hue: 20 })
        .persist()
        .name(`${target.document.name} Haste`)

        .effect()
        .file("animated-spell-effects-cartoon.smoke.19")
        .attachTo(target, { offset: { x: 0.2 * target.document.width, y: 0.45 * target.document.width }, gridUnits: true, followRotation: false })
        .scaleToObject(1.5, { considerTokenScale: true })
        .rotate(-30)
        .filter("Blur", { blurX: 5, blurY: 10 })
        .opacity(0.5)
        .tint("#fef848")

        .effect()
        .file("animated-spell-effects-cartoon.smoke.19")
        .attachTo(target, { offset: { x: 0.2 * target.document.width, y: 0.35 * target.document.width }, gridUnits: true, followRotation: false })
        .scaleToObject(1.5, { considerTokenScale: true })
        .rotate(-30)
        .zIndex(0.1)
        .tint("#fef848")

        .effect()
        .file("animated-spell-effects-cartoon.smoke.19")
        .attachTo(target, { offset: { x: -0.4 * target.document.width, y: -0.25 * target.document.width }, gridUnits: true, followRotation: false })
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
        .attachTo(target, { offset: { x: -0.4 * target.document.width, y: -0.35 * target.document.width }, gridUnits: true, followRotation: false })
        .scaleToObject(1.2, { considerTokenScale: true })
        .delay(700)
        .belowTokens(false)
        .mirrorY(true)
        .rotate(110)
        .zIndex(0.1)
        .tint("#fef848")
        
        .wait(1400)

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectData);
        })

        .play()
}