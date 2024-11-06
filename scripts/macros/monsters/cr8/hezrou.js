import {constants} from "../../generic/constants.js";
import {effectAuras} from "../../mechanics/effectAuras.js";
import {mba} from "../../../helperFunctions.js";

async function stenchAuraCombatStart(token, origin) {
    let duplicates = await mba.findNearby(token, 500, "any", true, false).filter(t => t.name === "Hezrou");
    // what the fuck is this...
    if (duplicates.length) {
        let delayRoll1 = await new Roll("1d10").roll({ 'async': true });
        let delayRoll2 = await new Roll("1d10").roll({ 'async': true });
        let delayRoll3 = await new Roll("1d10").roll({ 'async': true });
        let delay1 = delayRoll1.total * 100;
        let delay2 = delayRoll2.total * 100;
        let delay3 = delayRoll3.total * 100;
        await warpgate.wait(delay1);
        await warpgate.wait(delay2);
        await warpgate.wait(delay3);
    }
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Stench` })
        await mbaPremades.macros.monsters.hezrou.stenchAuraEnd(token);
    };
    let effectData = {
        'name': "Hezrou: Stench Aura",
        'icon': "modules/mba-premades/icons/generic/stench.webp",
        'origin': origin.uuid,
        'changes': [
            {
                'key': 'flags.mba-premades.aura.hezrouStenchAura.name',
                'mode': 5,
                'value': "hezrouStenchAura",
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.hezrouStenchAura.range',
                'mode': 5,
                'value': "10",
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.hezrouStenchAura.disposition',
                'mode': 5,
                'value': "all",
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.hezrouStenchAura.effectName',
                'mode': 5,
                'value': "Hezrou: Stench",
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.hezrouStenchAura.macroName',
                'mode': 5,
                'value': "hezrouStenchAura",
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.hezrouStenchAura.conscious',
                'mode': 5,
                'value': "true",
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.hezrouStenchAura.spellDC',
                'mode': 5,
                'value': 14,
                'priority': 20
            },
        ],
        'flags': {
            'dae': {
                'specialDuration': ['zeroHP', 'combatEnd']
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };
    let flagAuras = {
        'hezrouStenchAura': {
            'name': 'hezrouStenchAura',
            'range': 10,
            'disposition': 'all',
            'effectName': 'Hezrou: Stench',
            'macroName': 'hezrouStenchAura',
            'conscious': true,
            'spellDC': 14
        }
    };
    new Sequence()

        .effect()
        .file("jb2a.fog_cloud.02.green02")
        .attachTo(token)
        .size(7.2, { gridUnits: true })
        .fadeIn(1000)
        .fadeOut(2000)
        .scaleIn(0.1, 1000)
        .scaleOut(0.1, 2000)
        .opacity(0.5)
        .persist()
        .name(`${token.document.name} Stench`)

        .thenDo(async () => {
            await mba.createEffect(token.actor, effectData);
            effectAuras.add(flagAuras, token.document.uuid, true);
        })

        .play()
}

async function stenchAura(token, selectedAura) {
    if (token.name === "Hezrou") return;
    if (mba.checkTrait(token.actor, "ci", "poisoned")) return;
    if (mba.findEffect(token.actor, "Hezrou: Stench Immune")) return;
    let originToken = await fromUuid(selectedAura.tokenUuid);
    if (!originToken) return;
    let originActor = originToken.actor;
    let auraEffect = mba.findEffect(originActor, "Hezrou: Stench Aura");
    if (!auraEffect) return;
    let originItem = await fromUuid(auraEffect.origin);
    if (!originItem) return;
    async function effectMacroTurnStart() {
        await mbaPremades.macros.monsters.hezrou.stenchAuraTurnStart(token);
    }
    let effectData = {
        'name': "Hezrou: Stench",
        'icon': originItem.img,
        'origin': originItem.uuid,
        'description': `
            <p>At the start of your next turn, you will be subjected to Hezrou's Stench.</p>
        `,
        'flags': {
            'dae': {
                'showIcon': true,
            },
            'effectmacro': {
                'onTurnStart': {
                    'script': mba.functionToString(effectMacroTurnStart)
                }
            },
            'mba-premades': {
                'aura': true,
                'effect': {
                    'noAnimation': true
                },
                'originUuid': selectedAura.tokenUuid
            }
        }
    };
    let effect = mba.findEffect(token.actor, effectData.name);
    if (effect?.origin === effectData.origin) return;
    if (effect) mba.removeEffect(effect);
    await mba.createEffect(token.actor, effectData);
}

async function stenchAuraTurnStart(token) {
    let effect = await mba.findEffect(token.actor, "Hezrou: Stench");
    let hezrouDoc = await fromUuid(effect.flags['mba-premades']?.originUuid);
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Monster Features", "Hezrou Stench: Save", false);
    if (!featureData) return;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': hezrouDoc.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([token.document.uuid]);
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (!featureWorkflow.failedSaves.size) {
        let effectDataImmune = {
            'name': "Hezrou: Stench Immune",
            'icon': "modules/mba-premades/icons/generic/generic_buff.webp",
            'description': `
                <p>You are immune to Hezrou's Stench for the next 24 hours.</p>
            `,
            'duration': {
                'seconds': 86400
            }
        };
        await mba.createEffect(token.actor, effectDataImmune);
        await mba.removeEffect(effect);
    }
    else {
        async function effectMacroDel() {
            Sequencer.EffectManager.endEffects({ name: `${token.document.name} HezPoi` })
        };
        let effectData = {
            'name': "Hezrou: Poison",
            'icon': "modules/mba-premades/icons/generic/generic_poison.webp",
            'description': `
                <p>You are poisoned by Hezrou's Stench until the start of your next turn.</p>
            `,
            'changes': [
                {
                    'key': 'macro.CE',
                    'mode': 0,
                    'value': "Poisoned",
                    'priority': 20
                },
            ],
            'flags': {
                'dae': {
                    'showIcon': true,
                    'specialDuration': ['turnStart', 'combatEnd']
                },
                'effectmacro': {
                    'onDelete': {
                        'script': mba.functionToString(effectMacroDel)
                    }
                }
            }
        };
        new Sequence()

            .effect()
            .file("jb2a.smoke.puff.centered.green.2")
            .attachTo(token)
            .scaleToObject(2)

            .effect()
            .file("jb2a.template_circle.symbol.normal.poison.dark_green")
            .attachTo(token)
            .scaleToObject(1.3)
            .delay(500)
            .fadeIn(500)
            .fadeOut(500)
            .randomRotation()
            .mask()
            .persist()
            .name(`${token.document.name} HezPoi`)

            .thenDo(async () => {
                await mba.createEffect(token.actor, effectData)
            })

            .play()
    }
}

async function stenchAuraEnd(token) {
    effectAuras.remove('hezrouStenchAura', token.document.uuid);
}

export let hezrou = {
    'stenchAuraCombatStart': stenchAuraCombatStart,
    'stenchAura': stenchAura,
    'stenchAuraTurnStart': stenchAuraTurnStart,
    'stenchAuraEnd': stenchAuraEnd
}