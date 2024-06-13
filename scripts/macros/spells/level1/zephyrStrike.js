import {mba} from "../../../helperFunctions.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    async function effectMacroDel() {
        const effectData = {
            'name': "Zephyr Strike: Speed Bonus",
            'icon': "modules/mba-premades/icons/spells/level1/zephyr_strike_move.webp",
            'description': "You have +30 walking speed until the end of your turn",
            'duration': {
                'turns': 1,
            },
            'changes': [
                {
                    'key': "system.attributes.movement.walk",
                    'mode': 2,
                    'value': "+30",
                    'priority': 20
                }
            ]
        };
        await mbaPremades.helpers.createEffect(actor, effectData);
    };
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Until the spell ends, your movement does not provoke opportunity attacks.</p>
            <p>Once before the spell ends, you can give yourself advantage on one weapon attack roll on your turn. That attack deals an extra 1d8 force damage on a hit.</p>
            <p>Whether you hit or miss, your walking speed increases by 30 feet until the end of that turn.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.zephyrStrike.attack,preAttackRoll',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.zephyrStrike.damage,postDamageRoll',
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
                    baseLevel: 1,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };

    new Sequence()

        .effect()
        .file("animated-spell-effects-cartoon.air.portal")
        .attachTo(token, { offset: { x: 0, y: -0.0 }, gridUnits: true, followRotation: false })
        .scaleToObject(2.5)
        .fadeIn(250)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .fadeOut(500)
        .belowTokens()
        .opacity(0.85)
        .filter("ColorMatrix", { saturate: -1 })

        .effect()
        .file("animated-spell-effects-cartoon.air.explosion.gray")
        .attachTo(token, { offset: { x: 0, y: -0.0 }, gridUnits: true, followRotation: false })
        .scaleToObject(1.45)
        .fadeIn(250)
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .fadeOut(500)
        .belowTokens()

        .effect()
        .file("jb2a.wind_stream.200.white")
        .attachTo(token, { offset: { x: 0, y: 0 }, gridUnits: true, followRotation: false })
        .scaleToObject(2)
        .fadeIn(1000)
        .fadeOut(500)
        .opacity(0.5)
        .filter("ColorMatrix", { saturate: 1, brightness: 2 })
        .rotate(90)
        .mask()
        .persist()
        .name(`${token.document.name} Zephyr Strike`)

        .effect()
        .file("animated-spell-effects-cartoon.smoke.19")
        .attachTo(token, { offset: { x: 0.2 * token.document.width, y: 0.45 * token.document.width }, gridUnits: true, followRotation: false })
        .scaleToObject(1.5, { considerTokenScale: true })
        .rotate(-30)
        .filter("ColorMatrix", { saturate: -1, brightness: 0 })
        .filter("Blur", { blurX: 5, blurY: 10 })
        .opacity(0.5)
        .fadeOut(500)
        .persist()
        .name(`${token.document.name} Zephyr Strike`)

        .effect()
        .file("animated-spell-effects-cartoon.smoke.19")
        .attachTo(token, { offset: { x: 0.2 * token.document.width, y: 0.35 * token.document.width }, gridUnits: true, followRotation: false })
        .scaleToObject(1.5, { considerTokenScale: true })
        .rotate(-30)
        .zIndex(0.1)
        .fadeOut(500)
        .persist()
        .name(`${token.document.name} Zephyr Strike`)

        .effect()
        .file("animated-spell-effects-cartoon.smoke.19")
        .attachTo(token, { offset: { x: -0.4 * token.document.width, y: -0.25 * token.document.width }, gridUnits: true, followRotation: false })
        .scaleToObject(1.2, { considerTokenScale: true })
        .delay(700)
        .belowTokens(false)
        .mirrorY(true)
        .rotate(110)
        .filter("ColorMatrix", { saturate: -1, brightness: 0 })
        .filter("Blur", { blurX: 5, blurY: 10 })
        .opacity(0.5)
        .fadeOut(500)
        .persist()
        .name(`${token.document.name} Zephyr Strike`)

        .effect()
        .file("animated-spell-effects-cartoon.smoke.19")
        .attachTo(token, { offset: { x: -0.4 * token.document.width, y: -0.35 * token.document.width }, gridUnits: true, followRotation: false })
        .scaleToObject(1.2, { considerTokenScale: true })
        .delay(700)
        .belowTokens(false)
        .mirrorY(true)
        .rotate(110)
        .zIndex(0.1)
        .fadeOut(500)
        .persist()
        .name(`${token.document.name} Zephyr Strike`)

        .thenDo(async () => {
            await mba.createEffect(workflow.actor, effectData);
        })

        .play()
}

async function attack({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = mba.findEffect(workflow.actor, 'Zephyr Strike');
    if (!effect) return;
    if (workflow.item.system.actionType != 'mwak' && workflow.item.system.actionType != 'rwak') return;
    let choices = [['Yes, go ahead', 'yes'], ['No!', 'no']];
    let selection = await mba.dialog("Zephyr Strike", choices, `<b>Use Zephyr Strike to gain advantage on the attack roll?</b>`);
    if (!selection || selection === 'no') return;
    const effectData = {
        'name': 'Zephyr Strike: Advantage',
        'icon': 'modules/mba-premades/icons/generic/generic_buff.webp',
        'duration': {
            'turns': 1
        },
        'changes': [
            {
                'key': 'flags.midi-qol.advantage.attack.mwak',
                'mode': 2,
                'value': "1",
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.advantage.attack.rwak',
                'mode': 2,
                'value': "1",
                'priority': 20
            },
            {
                'key': 'system.bonuses.mwak.damage',
                'mode': 2,
                'value': '1d8[force]',
                'priority': 20
            },
            {
                'key': 'system.bonuses.rwak.damage',
                'mode': 2,
                'value': '1d8[force]',
                'priority': 20
            }
        ]
    };
    await mba.createEffect(workflow.actor, effectData);
}

async function damage({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = await mba.findEffect(workflow.actor, "Zephyr Strike: Advantage");
    if (!effect) return;
    await mba.removeCondition(workflow.actor, "Concentrating");
    await mba.removeEffect(effect);
    await Sequencer.EffectManager.endEffects({ name: `${workflow.token.document.name} Zephyr Strike` })
    let target = workflow.targets.first();
    let ranOffset = (Math.random() * (0.4 + 0.4) - 0.4);
    const targetCenter = {
        x: target.x + canvas.grid.size * target.document.width / 2,
        y: target.y + canvas.grid.size * target.document.width / 2,
    };
    const tokenCenter = {
        x: token.x + canvas.grid.size * token.document.width / 2,
        y: token.y + canvas.grid.size * token.document.width / 2,
    };
    const distance = Math.sqrt(
        Math.pow(targetCenter.x - tokenCenter.x, 2) + Math.pow(targetCenter.y - tokenCenter.y, 2)
    );
    const gridDistance = (distance / canvas.grid.size) * 5
    let projHeight = [];
    let projX = [];
    if (gridDistance >= 85) {
        projHeight = canvas.grid.size / 200;
        projX = true;
    } else if (gridDistance >= 55) {
        projHeight = canvas.grid.size / 250;
        projX = true;
    } else if (gridDistance > 30) {
        projHeight = canvas.grid.size / 300;
        projX = true;
    } else {
        projHeight = 1;
        projX = false;
    }

    new Sequence()

        .effect()
        .file("animated-spell-effects-cartoon.smoke.17")
        .atLocation(token, { offset: { x: -0, y: -0 }, gridUnits: true, local: false })
        .rotateTowards(targetCenter, { local: true })
        .spriteOffset({ x: -1.0 + ranOffset, y: -1.2 - (token.document.width - 1) / 2 }, { gridUnits: true })
        .scaleToObject(2)
        .rotate(-90)
        .zIndex(1)

        .effect()
        .delay(0)
        .file("animated-spell-effects-cartoon.air.bolt.ray")
        .atLocation(token, { offset: { x: 0.5 * token.document.width, y: ranOffset }, gridUnits: true, local: true })
        .stretchTo(target, { onlyX: projX })
        .scale(projHeight)
        .waitUntilFinished(-2000)

        .effect()
        .file("jb2a.impact.007.white")
        .atLocation(target, { offset: { x: 0, y: 0 }, gridUnits: true })
        .scale(0.6)
        .filter("ColorMatrix", { hue: 150 })

        .effect()
        .file("animated-spell-effects-cartoon.smoke.43")
        .atLocation(target, { offset: { x: 0, y: 0 }, gridUnits: true })
        .scale(0.3)
        .filter("ColorMatrix", { hue: 150 })
        .randomRotation()
        .zIndex(1)

        .play();
}

export let zephyrStrike = {
    'item': item,
    'attack': attack,
    'damage': damage
}