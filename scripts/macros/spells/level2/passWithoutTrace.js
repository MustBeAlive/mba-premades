import {effectAuras} from "../../mechanics/effectAuras.js";
import {mba} from "../../../helperFunctions.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} PWT` });
        await mbaPremades.macros.passWithoutTrace.end(token);
    };
    const effectData = {
        'name': "Pass without Trace: Aura",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>For the duration, each creature you choose within 30 feet of you (including you) has a +10 bonus to Dexterity (Stealth) checks and can't be tracked except by magical means.</p>
            <p>A creature that receives this bonus leaves behind no tracks or other traces of its passage.</p>
        `,
        'duration': {
            'seconds': 3600
        },
        'changes': [
            {
                'key': 'flags.mba-premades.aura.passWithoutTrace.name',
                'mode': 5,
                'value': `passWithoutTrace`,
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.passWithoutTrace.castLevel',
                'mode': 5,
                'value': `castLevel`,
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.passWithoutTrace.range',
                'mode': 5,
                'value': 30,
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.passWithoutTrace.disposition',
                'mode': 5,
                'value': `ally`,
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.passWithoutTrace.effectName',
                'mode': 5,
                'value': `Pass without Trace`,
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.passWithoutTrace.macroName',
                'mode': 5,
                'value': `passWithoutTrace`,
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
                    baseLevel: 2,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    let flagAuras = {
        'passWithoutTrace': {
            'name': 'passWithoutTrace',
            'castLevel': workflow.castData.castLevel,
            'range': 30,
            'disposition': 'ally',
            'effectName': 'Pass without Trace',
            'macroName': 'passWithoutTrace'
        }
    };
    effectAuras.add(flagAuras, workflow.token.document.uuid, true);
    new Sequence()

        .effect()
        .file("jb2a.darkness.black")
        .attachTo(workflow.token)
        .size(13, { gridUnits: true })
        .fadeIn(3000)
        .fadeOut(1500)
        .scaleIn(0, 5000, { ease: "easeOutCubic" })
        .scaleOut(0, 1500, { ease: "linear" })
        .opacity(0.25)
        .randomRotation()
        .belowTokens()
        .persist()
        .name(`${workflow.token.document.name} PWT`)

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
    let auraEffect = mba.findEffect(originActor, 'Pass without Trace: Aura');
    if (!auraEffect) return;
    let originItem = await fromUuid(auraEffect.origin);
    if (!originItem) return;
    let effectData = {
        'name': 'Pass without Trace',
        'icon': originItem.img,
        'origin': originItem.uuid,
        'description': `
            <p>You have a +10 bonus to Dexterity (Stealth) checks and can't be tracked except by magical means.</p>
            <p>Also, you leaves behind no tracks or other traces of your passage.</p>
            <p>Source: <b>${originToken.name}</b></p>
        `,
        'changes': [
            {
                'key': 'system.skills.ste.bonuses.check',
                'mode': 2,
                'value': `+10`,
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
    effectAuras.remove('passWithoutTrace', token.document.uuid);
}

export let passWithoutTrace = {
    'item': item,
    'aura': aura,
    'end': end
}