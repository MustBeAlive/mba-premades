import {mba} from "../../../helperFunctions.js";

async function divineEminenceCast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let valid = Object.values(workflow.actor.system.spells).filter(i => i.slotAvailable === true);
    let choices = [];
    let i = 1;
    for (let choice of valid) {
        if (choice.value < 1) {
            i += 1;
            continue;
        }
        choices.push([`<b>Level ${i}</b>, Slots: <b>${choice.value}</b>`, i]);
        i += 1;
    }
    let level = await mba.dialog("Divine Eminence", choices, "Choose level:");
    if (!level) {
        ui.notifications.warn("Failed to select cast level!");
        return;
    }
    let path = `system.spells.spell${level}.value`;
    let newValue = foundry.utils.getProperty(workflow.actor, path) - 1;
    await workflow.actor.update({ [path]: newValue })
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Divine Eminence` })
    }
    const effectData = {
        'name': "Divine Eminence",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': ``,
        'duration': {
            'turns': 1
        },
        'changes': [
            {
                'key': 'system.bonuses.mwak.damage',
                'mode': 2,
                'value': `+${2 + level}d6[radiant]`,
                'priority': 20
            },
        ],
        'flags': {
            'dae': {
                'specialDuration': ['1Hit']
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };

    await new Sequence()

        .effect()
        .delay(500)
        .file(`jb2a.particles.outward.white.02.03`)
        .attachTo(token, { offset: { y: -0.25 }, gridUnits: true, followRotation: false })
        .scaleToObject(1.2)
        .playbackRate(2)
        .duration(2000)
        .fadeOut(800)
        .fadeIn(1000)
        .animateProperty("sprite", "height", { from: 0, to: 2, duration: 3000, gridUnits: true, ease: "easeOutBack" })
        .filter("Blur", { blurX: 0, blurY: 15 })
        .opacity(2)
        .zIndex(0.2)

        .effect()
        .delay(1050)
        .file("jb2a.divine_smite.caster.reversed.yellowwhite")
        .atLocation(token)
        .scaleToObject(2.2)
        .startTime(900)
        .fadeIn(200)

        .effect()
        .file("jb2a.divine_smite.caster.yellowwhite")
        .atLocation(token)
        .scaleToObject(1.85)
        .belowTokens()
        .waitUntilFinished(-1200)

        .effect()
        .file("jb2a.token_border.circle.static.blue.007")
        .atLocation(token)
        .attachTo(token)
        .scaleToObject(2.1)
        .filter("ColorMatrix", { saturate: -1, brightness: 0.8 })
        .fadeOut(500)
        .persist()
        .name(`${token.document.name} Divine Eminence`)

        .thenDo(async () => {
            await mba.createEffect(workflow.actor, effectData);
        })

        .play();
}

async function divineEminenceAttack({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let effect = await mba.findEffect(workflow.actor, "Divine Eminence");
    if (!effect) return;
    let target = workflow.targets.first();

    await new Sequence()

        .canvasPan()
        .delay(300)
        .shake({ duration: 1000, strength: 1, rotation: false, fadeOutDuration: 1000 })

        .effect()
        .delay(300)
        .file("jb2a.impact.ground_crack.01.blue")
        .atLocation(target)
        .size(2.3 * workflow.token.document.width, { gridUnits: true })
        .filter("ColorMatrix", { saturate: -0.5, hue: -160 })
        .belowTokens()
        .playbackRate(0.85)
        .randomRotation()

        .effect()
        .file("jb2a.divine_smite.target.yellowwhite")
        .atLocation(target)
        .rotateTowards(workflow.token)
        .scaleToObject(3)
        .spriteOffset({ x: -1.5 * workflow.token.document.width, y: -0 * workflow.token.document.width }, { gridUnits: true })
        .mirrorY()
        .rotate(90)
        .zIndex(2)

        .play();
}

export let priest = {
    'divineEminenceCast': divineEminenceCast,
    'divineEminenceAttack': divineEminenceAttack
}