import {effectAuras} from '../../mechanics/effectAuras.js';
import {mba} from '../../../helperFunctions.js';

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} AuOfLi` });
        await mbaPremades.macros.auraOfLife.end(token);
    }
    async function effectMacroEachTurn() {
        await mbaPremades.macros.auraOfLife.turns(token, origin);
    }
    let effectData = {
        'name': "Aura of Life: Aura",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Life-preserving energy radiates from you in an aura with a 30-foot radius.</p>
            <p>Until the spell ends, the aura moves with you, centered on you.</p>
            <p>Each nonhostile creature in the aura (including you) has resistance to necrotic damage, and its hit point maximum can't be reduced.</p>
            <p>In addition, a nonhostile, living creature regains 1 hit point when it starts its turn in the aura with 0 hit points.</p>
        `,
        'duration': {
            'seconds': 600
        },
        'changes': [
            {
                'key': 'flags.mba-premades.aura.auraOfLife.name',
                'mode': 5,
                'value': `auraOfLife`,
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.auraOfLife.castLevel',
                'mode': 5,
                'value': `castLevel`,
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.auraOfLife.range',
                'mode': 5,
                'value': 30,
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.auraOfLife.disposition',
                'mode': 5,
                'value': `ally`,
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.auraOfLife.effectName',
                'mode': 5,
                'value': `Aura of Life`,
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.auraOfLife.macroName',
                'mode': 5,
                'value': `auraOfLife`,
                'priority': 20
            },
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                },
                'onEachTurn': {
                    'script': mba.functionToString(effectMacroEachTurn)
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 4,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    let flagAuras = {
        'auraOfLife': {
            'name': 'auraOfLife',
            'castLevel': workflow.castData.castLevel,
            'range': 30,
            'disposition': 'ally',
            'effectName': 'Aura of Life',
            'macroName': 'auraOfLife'
        }
    };
    new Sequence()

        .effect()
        .file("jb2a.template_circle.aura.01.loop.large.green")
        .attachTo(workflow.token)
        .size(13, { gridUnits: true })
        .fadeIn(3000)
        .fadeOut(1500)
        .scaleIn(0, 5000, { ease: "easeOutCubic" })
        .scaleOut(0, 1500, { ease: "linear" })
        .opacity(0.75)
        .playbackRate(0.8)
        .randomRotation()
        .belowTokens()
        .persist()
        .name(`${workflow.token.document.name} AuOfLi`)

        .thenDo(async () => {
            await mba.createEffect(workflow.actor, effectData);
            effectAuras.add(flagAuras, workflow.token.document.uuid, true);
        })

        .play()
}

function effect(effect, updates, options, user) {
    if (!updates.changes || !effect.parent) return;
    if (updates.changes.length === 0) return;
    if (effect.parent.constructor.name != 'Actor5e') return;
    if (!mba.findEffect(effect.parent, 'Aura of Life')) return;
    let changed = false;
    for (let i of updates.changes) {
        if (i.key != 'system.attributes.hp.tempmax') continue;
        let number = Number(i.value);
        if (isNaN(number) || number > 0) continue;
        i.value = 0;
        changed = true;
    }
    if (!changed) return;
    effect.updateSource({ 'changes': updates.changes });
}

async function aura(token, selectedAura) {
    let originToken = await fromUuid(selectedAura.tokenUuid);
    if (!originToken) return;
    let originActor = originToken.actor;
    let auraEffect = mba.findEffect(originActor, 'Aura of Life: Aura');
    if (!auraEffect) return;
    let originItem = await fromUuid(auraEffect.origin);
    if (!originItem) return;
    let effectData = {
        'name': 'Aura of Life',
        'icon': originItem.img,
        'origin': originItem.uuid,
        'description': `
            <p>You have resistance to necrotic damage, and your hit point maximum can't be reduced.</p>
            <p>In addition, you regain 1 hit point when you start your turn in the aura with 0 hit points.</p>
            <p>Source: <b>${originToken.name}</b></p>
        `,
        'changes': [
            {
                'key': 'system.traits.dr.value',
                'mode': 0,
                'value': 'necrotic',
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true,
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
    effectAuras.remove('auraOfLife', token.document.uuid);
}

async function turns(token, origin) {
    let targetToken = game.canvas.tokens.get(game.combat.current.tokenId);
    if (!targetToken) return;
    let distance = mba.getDistance(token, targetToken);
    if (distance > 30) return;
    let effect = mba.findEffect(targetToken.actor, 'Aura of Life');
    if (!effect) return;
    if (effect.origin != origin.uuid) return;
    if (targetToken.actor.system.attributes.hp.value > 0) return;
    let deadEffect = mba.findEffect(targetToken.actor, 'Dead');
    if (deadEffect) return;
    new Sequence()

        .effect()
        .file("animated-spell-effects-cartoon.energy.10")
        .attachTo(targetToken)
        .scaleToObject(1.4)
        .filter("ColorMatrix", { hue: 280 })
        .waitUntilFinished(-700)

        .effect()
        .file("jb2a.healing_generic.burst.yellowwhite")
        .attachTo(targetToken)
        .scaleToObject(1.35)
        .filter("ColorMatrix", { hue: 80 })
        .playbackRate(0.9)

        .thenDo(async () => {
            await origin.displayCard();
            await mba.applyDamage([targetToken], 1, 'healing');
        })

        .play()
}

export let auraOfLife = {
    'item': item,
    'aura': aura,
    'end': end,
    'effect': effect,
    'turns': turns
}