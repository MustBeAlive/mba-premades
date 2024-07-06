import {mba} from "../../../helperFunctions.js";

export async function nondetection({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let showIcon = true;
    if (game.users.current.isGM) {
        let hide = [["Yes, hide effect icon", "yes"], ["No, keep it", "no"]];
        let hideIcon = await mba.dialog("Do you want to hide the effect icon?", hide);
        if (hideIcon === "yes") showIcon = false;
    };
    async function effectMacro() {
        await game.Gametime.doIn({ hours: 8 }, async () => {
            let effect = await mbaPremades.helpers.findEffect(actor, "Nondetection");
            if (effect) await warpgate.revert(token.document, "Nondetection");
        });
    };
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Nondetection` })
        await warpgate.revert(token.document, "Nondetection");
    };
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are hidden from divination magic and cannot be percieved through magical scrying sensors.</p>
        `,
        'changes': [
            {
                'key': 'flags.mba-premades.spell.nondetection',
                'mode': 5,
                'value': true,
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': showIcon
            },
            'effectmacro': {
                'onCreate': {
                    'script': mba.functionToString(effectMacro)
                },
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
    let updates = {
        'embedded': {
            'ActiveEffect': {
                [effectData.name]: effectData
            }
        },
    };
    let options = {
        'permanent': false,
        'name': 'Nondetection',
        'description': 'Nondetection'
    };

    new Sequence()

        .effect()
        .file("jb2a.cast_generic.water.02.blue.0")
        .atLocation(target)
        .scaleToObject(2.5)
        .belowTokens()
        .waitUntilFinished(-2100)

        .effect()
        .file("jb2a.moonbeam.01.outro.yellow")
        .atLocation(target)
        .scaleToObject(1.3)
        .startTime(500)
        .playbackRate(1)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .fadeOut(500)
        .filter("ColorMatrix", { hue: 150 })

        .effect()
        .file("jb2a.extras.tmfx.border.circle.outpulse.01.normal")
        .delay(1500)
        .atLocation(target)
        .scaleToObject(1.3)
        .opacity(0.5)
        .belowTokens()

        .effect()
        .file("jb2a.extras.tmfx.border.circle.outpulse.01.normal")
        .delay(1500)
        .atLocation(target)
        .scaleToObject(1.3)
        .opacity(0.75)
        .belowTokens()

        .effect()
        .file("jb2a.markers.bubble.complete.blue")
        .atLocation(target)
        .scaleToObject(1.7)
        .opacity(0.2)
        .fadeIn(500)
        .duration(2000)
        .fadeOut(1500)
        .scaleIn(0.1, 1000, { ease: "easeOutBack" })
        .zIndex(2)
        .belowTokens()

        .effect()
        .file("jb2a.wall_of_force.sphere.grey")
        .delay(750)
        .atLocation(target)
        .scaleToObject(1.7)
        .opacity(0.2)
        .fadeIn(500)
        .duration(2000)
        .fadeOut(1500)
        .scaleIn(0.1, 1000, { ease: "easeOutBack" })
        .zIndex(2)
        .playbackRate(0.8)

        .effect()
        .file("jb2a.extras.tmfx.runes.circle.simple.illusion")
        .atLocation(target)
        .scaleToObject(1.7)
        .scaleIn(0, 500, { ease: "easeOutElastic" })
        .fadeOut(2000)
        .playbackRate(0.8)
        .opacity(0.35)
        .belowTokens()

        .effect()
        .file("animated-spell-effects-cartoon.misc.symbol.01")
        .delay(1500)
        .attachTo(target)
        .scaleToObject(2.2)
        .playbackRate(0.66)
        .fadeOut(500)
        .filter("ColorMatrix", { hue: 350 })

        .wait(1800)

        .thenDo(async () => {
            await warpgate.mutate(target.document, updates, {}, options);
        })

        .play()
}