import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

// To do:
// Regrowth: add chat message about "hydra recovered one head"
// Change attacks?
// Legendary Actions?
// Blood Explosion

async function headsCombatStart(token) {
    let effect = await mba.findEffect(token.actor, "Multiple Heads: Passive");
    if (!effect) {
        ui.notifications.warn("Unable to find effect! (Multiple Heads: Passive)");
        return;
    }
    let updates = {
        'icon': "modules/mba-premades/icons/generic/hydra_heads1.webp",
        'description': `
            <p>Heads Current: 6/6</p>
            <p>Healing ammount: 0</p>
        `,
        'flags': {
            'dae': {
                'showIcon': true,
            },
            'mba-premades': {
                'feature': {
                    'falseHydra': {
                        'headsCurrent': 6,
                        'healAmmount': 0
                    }
                }
            }
        }
    };
    await mba.updateEffect(effect, updates);
}

async function biteHeal({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let target = workflow.targets.first();
    let [falseHydraDoc] = game.canvas.scene.tokens.filter(t => t.name === "False Hydra");
    if (!falseHydraDoc) return;
    let falseHydraToken = falseHydraDoc.object;
    let effect = await mba.findEffect(falseHydraToken.actor, "Multiple Heads: Passive");
    if (!effect) return;
    let headsCurrent = effect.flags['mba-premades']?.feature?.falseHydra?.headsCurrent;
    let healAmmount = effect.flags['mba-premades']?.feature?.falseHydra?.healAmmount;
    let necrotic = workflow.otherDamageDetail[0].damage;
    if (!workflow.failedSaves.size) necrotic = Math.floor(necrotic / 2);
    let formula = necrotic.toString();
    let lifestealRoll = await new Roll(formula).roll({ 'async': true });
    healAmmount += necrotic;
    let updates = {
        'description': `
            <p>Heads Current: ${headsCurrent}/6</p>
            <p>Healing ammount: ${healAmmount}</p>
        `,
        'flags': {
            'mba-premades': {
                'feature': {
                    'falseHydra': {
                        'healAmmount': healAmmount,
                    }
                }
            }
        }
    };
    new Sequence()

        .effect()
        .file("jb2a.energy_strands.range.multiple.dark_purple02.01")
        .attachTo(target)
        .stretchTo(workflow.token)
        .repeats(2, 1500)

        .effect()
        .file("jb2a.divine_smite.caster.dark_purple")
        .attachTo(workflow.token)
        .fadeIn(500)
        .scaleToObject(1.5)
        .belowTokens()

        .thenDo(async () => {
            if (workflow.token.document.name != "False Hydra") await mba.applyWorkflowDamage(workflow.token, lifestealRoll, "healing", [workflow.token], "Gnawing Bite", workflow.itemCardId);
            await mba.applyWorkflowDamage(falseHydraToken, lifestealRoll, "healing", [falseHydraToken], "Gnawing Bite", workflow.itemCardId);
            await mba.updateEffect(effect, updates);
        })

        .play()
}

async function biteReaction({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!mba.inCombat()) return;
    let [falseHydraDoc] = game.canvas.scene.tokens.filter(t => t.name === "False Hydra");
    if (!falseHydraDoc) return;
    let falseHydraToken = falseHydraDoc.object;
    if (game.combat.combatant.tokenId === falseHydraToken.id) return;
    let effect = await mba.findEffect(falseHydraToken.actor, "Multiple Heads: Passive");
    let headsCurrent = effect.flags['mba-premades']?.feature?.failedSaves?.headsCurrent;
    if (!mba.findEffect(falseHydraToken.actor, "Reaction")) {
        await mba.addCondition(falseHydraToken.actor, "Reaction");
        return;
    }
    let reactions = falseHydraToken.actor.effects.filter(e => e.name.includes("Reaction"));
    if (reactions.length >= headsCurrent) {
        ui.notifications.warn("Unable to make opportunity attack! (no heads left)");
        return false;
    }
    await mba.addCondition(falseHydraToken.actor, "Reaction");
}

async function discordantSong({ speaker, actor, token, character, item, args, scope, workflow }) {

}

async function regrowth({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = await mba.findEffect(workflow.actor, "Multiple Heads: Passive");
    if (!effect) return;
    let headsCurrent = effect.flags['mba-premades']?.feature?.falseHydra?.headsCurrent;
    if (headsCurrent === 6) {
        ui.notifications.warn("False Hydra has all of its heads!");
        await game.messages.get(workflow.itemCardId).delete();
        return;
    }
    let healAmmount = effect.flags['mba-premades']?.feature?.falseHydra?.healAmmount;
    if (healAmmount < 35) {
        ui.notifications.warn("False Hydra is unable to regrow a head! (Not enough healing)");
        await game.messages.get(workflow.itemCardId).delete();
        return;
    }
    headsCurrent += 1;
    healAmmount -= 35;
    let updates = {
        'description': `
            <p>Heads Current: ${headsCurrent}/6</p>
            <p>Healing ammount: ${healAmmount}</p>
        `,
        'flags': {
            'mba-premades': {
                'feature': {
                    'falseHydra': {
                        'headsCurrent': headsCurrent,
                        'healAmmount': healAmmount,
                    }
                }
            }
        }
    };
    await mba.updateEffect(effect, updates);
}

async function legendaryBite({ speaker, actor, token, character, item, args, scope, workflow }) {
    let heads = game.canvas.scene.tokens.filter(t => t.name.includes("False Hydra") && t.actor.system.attributes.hp.value > 0).map(t => t.object);
    await mba.gmDialogMessage();
    let selection = await mba.selectTarget("Legendary Action: Bite", constants.yesNoButton, heads, false, "one", undefined, false, "Which head will be attacking?");
    await mba.clearGMDialogMessage();
    if (!selection.buttons) return;
    let [headId] = selection.inputs.filter(i => i).slice(0);
    let headToken = canvas.scene.tokens.get(headId);
    let feature = await mba.getItem(headToken.actor, "Gnawing Bite");
    if (!feature) return;
    let [config, options] = constants.syntheticItemWorkflowOptions([workflow.targets.first().document.uuid]);
    await mba.remoteRollItem(feature, config, options, mba.firstOwner(headToken).id);
}

async function legendaryDetachHead({ speaker, actor, token, character, item, args, scope, workflow }) {
    let sourceActor = game.actors.getName("False Hydra Head");
    if (!sourceActor) {
        ui.notifications.warn("Unale to find actor! (False Hydra Head)");
        return;
    }
    let updates = {
        'actor': {
            'prototypeToken': {
                'disposition': workflow.token.document.disposition,
            }
        },
        'token': {
            'disposition': workflow.token.document.disposition,
        }
    };
    new Sequence()

        .effect()
        .file("jb2a.extras.tmfx.border.circle.outpulse.01.fast")
        .atLocation(workflow.token)
        .scaleToObject(3)
        .fadeIn(1000)
        .fadeOut(2000)
        .opacity(0.75)
        .zIndex(1)
        .belowTokens()
        .filter("ColorMatrix", { saturate: 0, brightness: 0 })
        .persist()
        .name(`${workflow.token.document.name} CreHea`)

        .effect()
        .file("jb2a.extras.tmfx.outflow.circle.04")
        .attachTo(workflow.token)
        .scaleToObject(3)
        .fadeIn(1000)
        .fadeOut(2000)
        .opacity(1.2)
        .zIndex(1)
        .randomRotation()
        .belowTokens()
        .filter("ColorMatrix", { saturate: 0, brightness: 0 })
        .persist()
        .name(`${workflow.token.document.name} CreHea`)

        .effect()
        .file(canvas.scene.background.src)
        .atLocation({ x: (canvas.dimensions.width) / 2, y: (canvas.dimensions.height) / 2 })
        .size({ width: canvas.scene.width / canvas.grid.size, height: canvas.scene.height / canvas.grid.size }, { gridUnits: true })
        .duration(20000)
        .fadeIn(1000)
        .fadeOut(2000)
        .spriteOffset({ x: -0.5 }, { gridUnits: true })
        .filter("ColorMatrix", { brightness: 0.3 })
        .belowTokens()
        .persist()
        .name(`${workflow.token.document.name} CreHea`)

        .thenDo(async () => {
            await mba.gmDialogMessage();
            await mba.spawn(sourceActor, updates, {}, workflow.token, 5, "fiend");
            await mba.clearGMDialogMessage();
            Sequencer.EffectManager.endEffects({ name: `${workflow.token.document.name} CreHea` });
        })

        .play()
}

async function legendaryBloodBath({ speaker, actor, token, character, item, args, scope, workflow }) {

}

async function damageLink({ speaker, actor, token, character, item, args, scope, workflow }) {
    let [falseHydraDoc] = game.canvas.scene.tokens.filter(t => t.name === "False Hydra");
    if (!falseHydraDoc) return;
    let falseHydraToken = falseHydraDoc.object;
    let effect = await mba.findEffect(falseHydraToken.actor, "Multiple Heads: Passive");
    let headsCurrent = effect.flags['mba-premades']?.feature?.falseHydra?.headsCurrent;
    let healAmmount = effect.flags['mba-premades']?.feature?.falseHydra?.healAmmount;
    let damageTotal;
    if (workflow.damageItem.newHP > 0) damageTotal = workflow.damageItem.appliedDamage;
    else damageTotal = workflow.damageItem.totalDamage;
    await mba.applyDamage([falseHydraToken], damageTotal, "none");
    if (workflow.damageItem.newHP > 0) return;
    headsCurrent -= 1;
    if (headsCurrent === 0) {
        await mba.applyDamage([falseHydraToken], falseHydraToken.system.attributes.hp.value, "none");
        return;
    }
    let updates = {
        'description': `
                <p>Heads Current: ${headsCurrent}/6</p>
                <p>Healing ammount: ${healAmmount}</p>
            `,
        'flags': {
            'mba-premades': {
                'feature': {
                    'falseHydra': {
                        'headsCurrent': headsCurrent,
                        'healAmmount': healAmmount,
                    }
                }
            }
        }
    };
    await mba.updateEffect(effect, updates);
}


export let falseHydra = {
    'headsCombatStart': headsCombatStart,
    'biteHeal': biteHeal,
    'biteReaction': biteReaction,
    'discordantSong': discordantSong,
    'regrowth': regrowth,
    'legendaryBite': legendaryBite,
    'legendaryDetachHead': legendaryDetachHead,
    'legendaryBloodBath': legendaryBloodBath,
    'damageLink': damageLink
}