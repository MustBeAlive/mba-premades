import {constants} from "../../generic/constants.js";
import {effectAuras} from "../../mechanics/effectAuras.js";
import {mba} from "../../../helperFunctions.js";

async function stenchAuraCombatStart(token, origin) {
    let duplicates = await mba.findNearby(token, 500, "any", true, false).filter(t => t.name === "Ghast");
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
        await mbaPremades.macros.monsters.ghast.stenchAuraEnd(token);
    };
    let effectData = {
        'name': "Ghast: Stench Aura",
        'icon': "modules/mba-premades/icons/generic/stench.webp",
        'origin': origin.uuid,
        'changes': [
            {
                'key': 'flags.mba-premades.aura.ghastStenchAura.name',
                'mode': 5,
                'value': "ghastStenchAura",
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.ghastStenchAura.range',
                'mode': 5,
                'value': "5",
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.ghastStenchAura.disposition',
                'mode': 5,
                'value': "all",
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.ghastStenchAura.effectName',
                'mode': 5,
                'value': "Ghast: Stench",
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.ghastStenchAura.macroName',
                'mode': 5,
                'value': "ghastStenchAura",
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.ghastStenchAura.conscious',
                'mode': 5,
                'value': "true",
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.ghastStenchAura.spellDC',
                'mode': 5,
                'value': 10,
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
        'ghastStenchAura': {
            'name': 'ghastStenchAura',
            'range': 5,
            'disposition': 'all',
            'effectName': 'Ghast: Stench',
            'macroName': 'ghastStenchAura',
            'conscious': true,
            'spellDC': 10
        }
    };
    new Sequence()

        .effect()
        .file("jb2a.fog_cloud.02.green02")
        .attachTo(token)
        .size(3.5, { gridUnits: true })
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
    if (token.name === "Ghast") return;
    if (mba.checkTrait(token.actor, "ci", "poisoned")) return;
    if (mba.findEffect(token.actor, "Ghast: Stench Immune")) return;
    let originToken = await fromUuid(selectedAura.tokenUuid);
    if (!originToken) return;
    let originActor = originToken.actor;
    let auraEffect = mba.findEffect(originActor, "Ghast: Stench Aura");
    if (!auraEffect) return;
    let originItem = await fromUuid(auraEffect.origin);
    if (!originItem) return;
    async function effectMacroTurnStart() {
        await mbaPremades.macros.monsters.ghast.stenchAuraTurnStart(token);
    }
    let effectData = {
        'name': "Ghast: Stench",
        'icon': originItem.img,
        'origin': originItem.uuid,
        'description': `
            <p>At the start of your next turn, you will be subjected to Ghast's Stench.</p>
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
    let effect = await mba.findEffect(token.actor, "Ghast: Stench");
    let ghastDoc = await fromUuid(effect.flags['mba-premades']?.originUuid);
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Monster Features", "Ghast Stench: Save", false);
    if (!featureData) return;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': ghastDoc.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([token.document.uuid]);
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (!featureWorkflow.failedSaves.size) {
        let effectDataImmune = {
            'name': "Ghast: Stench Immune",
            'icon': "modules/mba-premades/icons/generic/generic_buff.webp",
            'description': `
                <p>You are immune to Ghast's Stench for the next 24 hours.</p>
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
            Sequencer.EffectManager.endEffects({ name: `${token.document.name} GhaPoi` })
        };
        let effectData = {
            'name': "Ghast: Poison",
            'icon': "modules/mba-premades/icons/generic/generic_poison.webp",
            'description': `
                <p>You are poisoned by Ghast's Stench until the start of your next turn.</p>
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
            .name(`${token.document.name} GhaPoi`)

            .thenDo(async () => {
                await mba.createEffect(token.actor, effectData)
            })

            .play()
    }
}

async function stenchAuraEnd(token) {
    effectAuras.remove('ghastStenchAura', token.document.uuid);
}

export let ghast = {
    'stenchAuraCombatStart': stenchAuraCombatStart,
    'stenchAura': stenchAura,
    'stenchAuraTurnStart': stenchAuraTurnStart,
    'stenchAuraEnd': stenchAuraEnd
}