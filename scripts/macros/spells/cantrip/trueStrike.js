import { mba } from "../../../helperFunctions.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    console.log(game.combat.round);
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} True Strike`, object: token })
    };
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': ``,
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['turnEndSource']
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'mba-premades': {
                'spell': {
                    'trueStrike': {
                        'round': game.combat.round,
                        'sourceUuid': workflow.token.document.uuid
                    }
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 0,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };

    new Sequence()

        .effect()
        .file("jb2a.ward.rune.dark_purple.02")
        .attachTo(target)
        .duration(3000)
        .scaleToObject(1.5)
        .fadeIn(1000)
        .fadeOut(500)

        .effect()
        .file("jb2a.ward.rune.dark_purple.02")
        .attachTo(target)
        .duration(1000)
        .scaleToObject(1.5)
        .fadeIn(500)
        .fadeOut(500)
        .filter("ColorMatrix", { saturate: -1, brightness: 1.5 })

        .effect()
        .file("jb2a.particles.outward.purple.01.03")
        .attachTo(target)
        .duration(3500)
        .size(2, { gridUnits: true })
        .scaleIn(0.25, 500, { ease: "easeOutQuint" })
        .fadeIn(500)
        .fadeOut(2500)

        .effect()
        .file("jb2a.extras.tmfx.border.circle.outpulse.01.fast")
        .attachTo(target)
        .size(1.5, { gridUnits: true })

        .effect()
        .file("jb2a.glint.purple.few.0")
        .attachTo(target)
        .scaleToObject(1.7 * target.document.texture.scaleX)
        .fadeIn(700)
        .fadeOut(1000)

        .effect()
        .file("jb2a.ui.indicator.bluegreen.02.03")
        .delay(2500)
        .attachTo(target)
        .scaleToObject(1.4 * target.document.texture.scaleX)
        .filter("ColorMatrix", { hue: 180 })
        .fadeIn(700)
        .fadeOut(1000)
        .opacity(0.66)
        .persist()
        .name(`${target.document.name} True Strike`)

        .effect()
        .file("jb2a.token_border.circle.spinning.purple.006")
        .attachTo(target)
        .scaleToObject(1.7 * target.document.texture.scaleX)
        .fadeIn(700)
        .fadeOut(1000)
        .scaleOut(0, 250)
        .opacity(0.9)
        .belowTokens()
        .persist()
        .name(`${target.document.name} True Strike`)

        .wait(2500)

        .thenDo(function () {
            mba.createEffect(target.actor, effectData);
        })

        .play()
}

async function hook(workflow) {
    if (!workflow.item) return;
    if (!(workflow.item.system.actionType === 'mwak' || workflow.item.system.actionType === 'msak' || workflow.item.system.actionType === 'rwak' || workflow.item.system.actionType === 'rsak')) return;
    let target = workflow.targets.first();
    let effect = await mba.findEffect(target.actor, "True Strike");
    if (!effect) return;
    let currentRound = game.combat.round;
    let effectRound = effect.flags['mba-premades']?.spell?.trueStrike?.round;
    let sourceUuid = effect.flags['mba-premades']?.spell?.trueStrike?.sourceUuid;
    if ((currentRound != (effectRound + 1) || workflow.token.document.uuid != sourceUuid)) return;
    let queueSetup = await chrisPremades.queue.setup(workflow.item.uuid, 'trueStrike', 150);
    if (!queueSetup) return;
    workflow.advantage = true;
    workflow.advReminderAttackAdvAttribution.add("ADV:True Strike");
    chrisPremades.queue.remove(workflow.item.uuid);
    await mba.removeEffect(effect);
}

export let trueStrike = {
    'item': item,
    'hook': hook
}