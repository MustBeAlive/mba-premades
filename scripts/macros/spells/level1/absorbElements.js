import {mba} from "../../../helperFunctions.js";

export async function absorbElements({ speaker, actor, token, character, item, args, scope, workflow }) {
    let choices = [['Acid 🧪', 'acid'], ['Cold ❄️', 'cold'], ['Fire 🔥', 'fire'], ['Lightning ⚡', 'lightning'], ['Thunder ☁️', 'thunder'], ["None of the above", "none"]];
    let type = await mba.dialog("Absorb Elements", choices, `<b>Choose damage element (ask GM)</b>`);
    if (!type || type === "none") return;
    let level = workflow.castData.castLevel;
    let icon;
    let animation1;
    let animation2;
    let animation3;
    let animation4;
    switch (type) {
        case "acid": {
            icon = "modules/mba-premades/icons/spells/level1/absorb_elements_acid.webp";
            animation1 = "jb2a.shield.03.intro.green";
            animation2 = "jb2a.shield.03.loop.green";
            animation3 = "jb2a.shield.03.outro_explode.green";
            animation4 = "jb2a.token_border.circle.static.green.001";
            break;
        }
        case "cold": {
            icon = "modules/mba-premades/icons/spells/level1/absorb_elements_cold.webp";
            animation1 = "jb2a.shield.03.intro.blue";
            animation2 = "jb2a.shield.03.loop.blue";
            animation3 = "jb2a.shield.03.outro_explode.blue";
            animation4 = "jb2a.token_border.circle.static.blue.001";
            break;
        }
        case "fire": {
            icon = "modules/mba-premades/icons/spells/level1/absorb_elements_fire.webp";
            animation1 = "jb2a.shield.03.intro.red";
            animation2 = "jb2a.shield.03.loop.red";
            animation3 = "jb2a.shield.03.outro_explode.red";
            animation4 = "jb2a.token_border.circle.static.orange.001";
            break;
        }
        case "lightning": {
            icon = "modules/mba-premades/icons/spells/level1/absorb_elements_lightning.webp";
            animation1 = "jb2a.shield.03.intro.blue";
            animation2 = "jb2a.shield.03.loop.blue";
            animation3 = "jb2a.shield.03.outro_explode.blue";
            animation4 = "jb2a.token_border.circle.static.blue.001";
            break;
        }
        case "thunder": {
            icon = "modules/mba-premades/icons/spells/level1/absorb_elements_thunder.webp";
            animation1 = "jb2a.shield.03.intro.purple";
            animation2 = "jb2a.shield.03.loop.purple";
            animation3 = "jb2a.shield.03.outro_explode.purple";
            animation4 = "jb2a.token_border.circle.static.purple.001";
            break;
        }
    }
    async function effectMacroDel1() {
        let effect = await mbaPremades.helpers.findEffect(actor, "Absorb Elements: Damage Bonus");
        let animation;
        if (effect) {
            let type = effect.flags['mba-premades']?.spell?.absorbElements?.type;
            if (!type) return;
            if (type === "acid") animation = "jb2a.shield.03.outro_explode.green";
            if (type === "cold") animation = "jb2a.shield.03.outro_explode.blue";
            if (type === "fire") animation = "jb2a.shield.03.outro_explode.red";
            if (type === "lightning") animation = "jb2a.shield.03.outro_explode.blue";
            if (type === "thunder") animation = "jb2a.shield.03.outro_explode.purple";
        }
        if (!animation) {
            Sequencer.EffectManager.endEffects({ name: `${token.document.name} AE Resistance`, object: token })
            return;
        }
        new Sequence()

            .effect()
            .file(animation)
            .attachTo(token)
            .scaleToObject(1.7 * token.document.texture.scaleX)
            .zIndex(3)
            .waitUntilFinished(-500)

            .thenDo(function () {
                Sequencer.EffectManager.endEffects({ name: `${token.document.name} AE Resistance`, object: token })
            })

            .play()
    };
    async function effectMacroDel2() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} AE Bonus`, object: token })
    };
    const effectDataResist = {
        'name': `Absorb Elements: Damage Resistance`,
        'icon': icon,
        'origin': workflow.item.uuid,
        'description': `
            <p>You have resistance to ${type} damage type until the start of your next turn.</p>
        `,
        'changes': [
            {
                'key': 'system.traits.dr.value',
                'mode': 0,
                'value': type,
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ["turnStart"],
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel1)
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
    const effectDataBonus = {
        'name': `Absorb Elements: Damage Bonus`,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>The first target you hit with a melee attack on your turn will take extra ${level}d6 ${type} damage.</p>
        `,
        'changes': [
            {
                'key': 'system.bonuses.mwak.damage',
                'mode': 2,
                'value': `+${level}d6[${type}]`,
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ["turnEnd", "1Hit:mwak"],
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel2)
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 1,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            },
            'mba-premades': {
                'spell': {
                    'absorbElements': {
                        'type': type
                    }
                }
            }
        }
    };

    new Sequence()

        .wait(500)

        .effect()
        .file(animation1)
        .attachTo(token)
        .scaleToObject(1.7 * token.document.texture.scaleX)
        .opacity(0.8)
        .playbackRate(0.8)
        .zIndex(3)

        .effect()
        .file(animation4)
        .delay(600)
        .fadeIn(500)
        .fadeOut(500)
        .attachTo(token)
        .scaleToObject(1.75 * token.document.texture.scaleX)
        .opacity(0.8)
        .zIndex(2)
        .mask()
        .persist()
        .name(`${token.document.name} AE Bonus`)

        .effect()
        .file(animation2)
        .delay(600)
        .fadeIn(500)
        .attachTo(token)
        .scaleToObject(1.7 * token.document.texture.scaleX)
        .opacity(0.8)
        .playbackRate(0.8)
        .zIndex(3)
        .persist()
        .name(`${token.document.name} AE Resistance`)

        .thenDo(function () {
            mba.createEffect(workflow.actor, effectDataResist);
            mba.createEffect(workflow.actor, effectDataBonus);
        })

        .play()
}