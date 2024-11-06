import {effectAuras} from "../../mechanics/effectAuras.js";
import {mba} from "../../../helperFunctions.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} CruMan` });
        await mbaPremades.macros.crusadersMantle.end(token);
    };
    const effectData = {
        'name': "Crusader's Mantle: Aura",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Holy power radiates from you in an aura with a 30-foot radius, awakening boldness in friendly creatures.</p>
            <p>Until the spell ends, the aura moves with you, centered on you.</p>
            <p>While in the aura, each nonhostile creature in the aura (including you) deals an extra 1d4 radiant damage when it hits with a weapon attack.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'flags.mba-premades.aura.crusadersMantle.name',
                'mode': 5,
                'value': `crusadersMantle`,
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.crusadersMantle.castLevel',
                'mode': 5,
                'value': `castLevel`,
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.crusadersMantle.range',
                'mode': 5,
                'value': 30,
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.crusadersMantle.disposition',
                'mode': 5,
                'value': `ally`,
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.crusadersMantle.effectName',
                'mode': 5,
                'value': `Crusader's Mantle`,
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.crusadersMantle.macroName',
                'mode': 5,
                'value': `crusadersMantle`,
                'priority': 20
            },
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
    let flagAuras = {
        'crusadersMantle': {
            'name': "crusadersMantle",
            'castLevel': workflow.castData.castLevel,
            'range': 30,
            'disposition': "ally",
            'effectName': "Crusader's Mantle",
            'macroName': 'crusadersMantle'
        }
    };
    effectAuras.add(flagAuras, workflow.token.document.uuid, true);
    new Sequence()

        .effect()
        .file("jb2a.detect_magic.circle.yellow")
        .attachTo(workflow.token)
        .size(12, { gridUnits: true })

        .effect()
        .file("jb2a.template_circle.aura.01.loop.large.yellow")
        .attachTo(workflow.token)
        .size(14, { gridUnits: true })
        .fadeIn(1000)
        .fadeOut(1000)
        .scaleIn(0.1, 2000)
        .scaleOut(0.1, 2000)
        .opacity(0.6)
        .playbackRate(0.8)
        .belowTokens()
        .persist()
        .name(`${workflow.token.document.name} CruMan`)

        .wait(1000)

        .thenDo(async () => {
            await mba.createEffect(workflow.actor, effectData);
            effectAuras.add(flagAuras, workflow.token.document.uuid, true);
        })

        .play()
}

async function aura(token, selectedAura) {
    let originToken = await fromUuid(selectedAura.tokenUuid);
    if (!originToken) return;
    let originActor = originToken.actor;
    let auraEffect = mba.findEffect(originActor, "Crusader's Mantle: Aura");
    if (!auraEffect) return;
    let originItem = await fromUuid(auraEffect.origin);
    if (!originItem) return;
    let effectData = {
        'name': "Crusader's Mantle",
        'icon': originItem.img,
        'origin': originItem.uuid,
        'description': `
            <p>Your weapon attacks deal an additional 1d4 radiant damage.</p>
            <p>Source: <b>${originToken.name}</b></p>
        `,
        'changes': [
            {
                'key': 'system.bonuses.mwak.damage',
                'mode': 2,
                'value': `+1d4[radiant]`,
                'priority': 20
            },
            {
                'key': 'system.bonuses.rwak.damage',
                'mode': 2,
                'value': `+1d4[radiant]`,
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true
            },
            'mba-premades': {
                'aura': true,
                'effect': {
                    'noAnimation': true
                }
            }
        }
    };
    let effect = mba.findEffect(token.actor, effectData.name);
    if (effect?.origin === effectData.origin) return;
    if (effect) mba.removeEffect(effect);
    await mba.createEffect(token.actor, effectData);
}


async function end(token) {
    effectAuras.remove('crusadersMantle', token.document.uuid);
}

export let crusadersMantle = {
    'item': item,
    'aura': aura,
    'end': end
}