import {effectAuras} from "../../mechanics/effectAuras.js";
import {mba} from "../../../helperFunctions.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    async function effectMacroDel() {
        await mbaPremades.macros.wardingWind.end(token);
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} WarWin` });
    };
    const effectData = {
        'name': "Warding Wind: Aura",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
        `,
        'duration': {
            'seconds': 600
        },
        'changes': [
            {
                'key': 'flags.mba-premades.aura.wardingWind.name',
                'mode': 5,
                'value': `wardingWind`,
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.wardingWind.castLevel',
                'mode': 5,
                'value': `castLevel`,
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.wardingWind.range',
                'mode': 5,
                'value': 10,
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.wardingWind.disposition',
                'mode': 5,
                'value': `all`,
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.wardingWind.effectName',
                'mode': 5,
                'value': `Warding Wind`,
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.wardingWind.macroName',
                'mode': 5,
                'value': `wardingWind`,
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
        'wardingWind': {
            'name': 'wardingWind',
            'castLevel': workflow.castData.castLevel,
            'range': 10,
            'disposition': 'all',
            'effectName': 'Warding Wind',
            'macroName': 'wardingWind'
        }
    };
    effectAuras.add(flagAuras, workflow.token.document.uuid, true);
    new Sequence()

        .effect()
        .file("jb2a.whirlwind.purple")
        .attachTo(workflow.token)
        .size(4.8, { gridUnits: true })
        .fadeIn(3000)
        .fadeOut(1500)
        .scaleIn(0, 5000, { ease: "easeOutCubic" })
        .scaleOut(0, 1500, { ease: "linear" })
        .randomRotation()
        .opacity(0.6)
        .persist()
        .name(`${workflow.token.document.name} WarWin`)

        .thenDo(async () => {
            await mba.createEffect(workflow.actor, effectData);
            effectAuras.add(flagAuras, workflow.token.document.uuid, true);
        })

        .play()
}

async function aura(token, selectedAura) {
    let torch = await mba.findEffect(token.actor, "Torch");
    if (torch) await mba.removeEffect(torch);
    let originToken = await fromUuid(selectedAura.tokenUuid);
    if (!originToken) return;
    let originActor = originToken.actor;
    let auraEffect = mba.findEffect(originActor, 'Warding Wind: Aura');
    if (!auraEffect) return;
    let originItem = await fromUuid(auraEffect.origin);
    if (!originItem) return;
    let effectData = {
        'name': 'Warding Wind',
        'icon': originItem.img,
        'origin': originItem.uuid,
        'description': `
            <p>You are inside of an area of strong (20 miles per hour) winds.</p>
            <p>You are deafened, and all attack rolls of ranged weapons have disadvantage if the attacks pass in or out of the wind.</p>
            <p>Source: <b>${originToken.name}</b></p>
        `,
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': `Deafened`,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.grants.disadvantage.attack.rwak',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
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
    effectAuras.remove('wardingWind', token.document.uuid);
}

export let wardingWind = {
    'item': item,
    'aura': aura,
    'end': end
}