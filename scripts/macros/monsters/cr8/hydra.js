import {mba} from "../../../helperFunctions.js";

async function bite({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!mba.inCombat()) return;
    if (game.combat.combatant.id === workflow.token.document.id) return;
    let effect = await mba.findEffect(workflow.actor, "Multiple Heads: Passive");
    if (!effect) {
        ui.notifications.warn("Unable to find effect! (Multiple Heads: Passive)");
        return;
    }
    let headsCurrent = effect.flags['mba-premades']?.feature?.hydra?.headsCurrent;
    if (!mba.findEffect(workflow.actor, "Reaction")) return;
    let reactions = workflow.actor.effects.filter(e => e.name.includes("Reaction"));
    if (reactions.length >= headsCurrent) {
        ui.notifications.warn("Unable to make opportunity attack! (no heads left)");
        return false;
    }
    await mba.addCondition(workflow.actor, "Reaction");
}

async function headsCombatStart(token) {
    let effect = await mba.findEffect(token.actor, "Multiple Heads: Passive");
    if (!effect) {
        ui.notifications.warn("Unable to find effect! (Multiple Heads: Passive)");
        return;
    }
    let updates = {
        'icon': "modules/mba-premades/icons/generic/hydra_heads1.webp",
        'description': `
            <p>Heads Current: 5</p>
            <p>Heads Lost this round: 0</p>
            <p>Damage taken this turn: 0</p>
            <p>Fire damage taken this round: <b>false</b></p>
        `,
        'flags': {
            'dae': {
                'showIcon': true
            },
            'mba-premades': {
                'feature': {
                    'hydra': {
                        'headsCurrent': 5,
                        'headsLost': 0,
                        'damageTaken': 0,
                        'fireDamageTaken': false,
                    }
                }
            }
        }
    };
    await mba.updateEffect(effect, updates);
}

async function headsEachTurn(token) {
    let effect = await mba.findEffect(token.actor, "Multiple Heads: Passive");
    if (!effect) {
        ui.notifications.warn("Unable to find effect! (Multiple Heads: Passive)");
        return;
    }
    let fireDamageTaken = effect.flags['mba-premades']?.feature?.hydra?.fireDamageTaken;
    let headsCurrent = effect.flags['mba-premades']?.feature?.hydra?.headsCurrent;
    let headsLost = effect.flags['mba-premades']?.feature?.hydra?.headsLost;
    let updates = {
        'description': `
            <p>Heads Current: ${headsCurrent}</p>
            <p>Heads Lost this round: ${headsLost}</p>
            <p>Damage taken this turn: 0</p>
            <p>Fire damage taken this round: <b>${fireDamageTaken}</b></p>
        `,
        'flags': {
            'mba-premades': {
                'feature': {
                    'hydra': {
                        'headsCurrent': headsCurrent,
                        'headsLost': headsLost,
                        'damageTaken': 0,
                        'fireDamageTaken': fireDamageTaken,
                    }
                }
            }
        }
    };
    await mba.updateEffect(effect, updates);
}

async function headsDamaged({ speaker, actor, token, character, item, args, scope, workflow }) {
    let [hydraToken] = Array.from(workflow.targets).filter(t => t.document.name === "Hydra");
    let effect = await mba.findEffect(hydraToken.actor, "Multiple Heads: Passive");
    if (!effect) {
        ui.notifications.warn("Unable to find effect! (Multiple Heads: Passive)");
        return;
    }
    let damageTaken = effect.flags['mba-premades']?.feature?.hydra?.damageTaken;
    let fireDamageTaken = effect.flags['mba-premades']?.feature?.hydra?.fireDamageTaken;
    let headsCurrent = effect.flags['mba-premades']?.feature?.hydra?.headsCurrent;
    let headsLost = effect.flags['mba-premades']?.feature?.hydra?.headsLost;
    let icon = effect.icon;
    if (workflow.damageDetail?.some(i => i.type === "fire")) {
        fireDamageTaken = true;
        icon = "modules/mba-premades/icons/generic/hydra_heads2.webp";
    }
    if (damageTaken < 25) {
        damageTaken += workflow.damageItem.appliedDamage;
        if (damageTaken >= 25) {
            ChatMessage.create({
                flavor: `<h3><u>${token.document.name}</u> lost one of its heads!</h3>`,
                speaker: ChatMessage.getSpeaker({ actor: token.actor })
            });
            headsCurrent -= 1;
            headsLost += 1;
            if (headsCurrent < 1) {
                let currentHP = token.actor.system.attributes.hp.value;
                await mba.applyDamage([token], currentHP, "none");
                return;
            }
        }
    }
    let updates = {
        'icon': icon,
        'description': `
            <p>Heads Current: ${headsCurrent}</p>
            <p>Heads Lost this round: ${headsLost}</p>
            <p>Damage taken this turn: ${damageTaken}</p>
            <p>Fire damage taken this round: <b>${fireDamageTaken}</b></p>
        `,
        'flags': {
            'mba-premades': {
                'feature': {
                    'hydra': {
                        'headsCurrent': headsCurrent,
                        'headsLost': headsLost,
                        'damageTaken': damageTaken,
                        'fireDamageTaken': fireDamageTaken
                    }
                }
            }
        }
    };
    await mba.updateEffect(effect, updates);
}

async function headsTurnEnd(token) {
    let effect = await mba.findEffect(token.actor, "Multiple Heads: Passive");
    if (!effect) {
        ui.notifications.warn("Unable to find effect! (Multiple Heads: Passive)");
        return;
    }
    let fireDamageTaken = effect.flags['mba-premades']?.feature?.hydra?.fireDamageTaken;
    let headsCurrent = effect.flags['mba-premades']?.feature?.hydra?.headsCurrent;
    let headsLost = effect.flags['mba-premades']?.feature?.hydra?.headsLost;
    if (!fireDamageTaken && headsLost > 0) {
        let newHeadsAmmount = headsLost * 2;
        let healingTotal = newHeadsAmmount * 10;
        headsCurrent += newHeadsAmmount;
        new Sequence()

            .effect()
            .file("animated-spell-effects-cartoon.energy.10")
            .attachTo(token)
            .scaleToObject(1.4)
            .filter("ColorMatrix", { hue: 280 })
            .waitUntilFinished(-700)

            .effect()
            .file("jb2a.healing_generic.burst.yellowwhite")
            .attachTo(token)
            .scaleToObject(1.35)
            .filter("ColorMatrix", { hue: 80 })
            .playbackRate(0.9)

            .thenDo(async () => {
                ChatMessage.create({
                    flavor: `<h3><u>${token.document.name}</u> grows ${newHeadsAmmount} new heads!</h3>`,
                    speaker: ChatMessage.getSpeaker({ actor: token.actor })
                });
                await mba.applyDamage([token], healingTotal, "healing");
            })

            .play()
    }
    else if (fireDamageTaken && headsLost > 0) {
        ChatMessage.create({
            flavor: `<h3><u>${token.document.name}</u> took fire damage and is unable to regenerate!</h3>`,
            speaker: ChatMessage.getSpeaker({ actor: token.actor })
        });
    }
    let updates = {
        'icon': "modules/mba-premades/icons/generic/hydra_heads1.webp",
        'description': `
            <p>Heads Current: ${headsCurrent}</p>
            <p>Heads Lost this round: 0</p>
            <p>Damage taken this turn: 0</p>
            <p>Fire damage taken this round: <b>false</b></p>
        `,
        'flags': {
            'mba-premades': {
                'feature': {
                    'hydra': {
                        'headsCurrent': headsCurrent,
                        'headsLost': 0,
                        'damageTaken': 0,
                        'fireDamageTaken': false,
                    }
                }
            }
        }
    };
    await mba.updateEffect(effect, updates);
}

function multipleHeads(saveId, options) {
    return { 'label': '<u>Multiple Heads:</u><br>Are you saving against being blinded, charmed, deafened, frightened, stunned, or knocked unconscious?<br>(ask GM)', 'type': 'advantage' };
}

export let hydra = {
    'bite': bite,
    'headsCombatStart': headsCombatStart,
    'headsEachTurn': headsEachTurn,
    'headsDamaged': headsDamaged,
    'headsTurnEnd': headsTurnEnd,
    'multipleHeads': multipleHeads
}