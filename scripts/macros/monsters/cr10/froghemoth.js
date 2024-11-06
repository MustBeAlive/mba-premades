import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function swallowItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let target = workflow.targets.first();
    if (mba.getSize(target.actor) > 2) return;
    let effects = workflow.actor.effects.filter(e => e.name.includes("Swallow") && e.name != "Swallow: Passive" && e.name != "Swallow: Save");
    if (effects.length === 2) return;
    let grappleEffect = await mba.findEffect(target.actor, "Froghemoth: Grapple");
    async function effectMacroDelSource() {
        let targetDoc = await fromUuid(effect.flags['mba-premades']?.feature?.froghemoth?.swallow?.targetUuid);
        let targetEffect = await mbaPremades.helpers.findEffect(targetDoc.actor, "Froghemoth: Swallow");
        if (targetEffect) await mbaPremades.helpers.removeEffect(targetEffect);
    };
    let effectDataSource = {
        'name': `Swallow (${target.document.name})`,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'flags': {
            'dae': {
                'specialDuration': ['zeroHP']
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDelSource)
                }
            },
            'mba-premades': {
                'feature': {
                    'froghemoth': {
                        'swallow': {
                            'targetUuid': target.document.uuid
                        }
                    }
                }
            }
        }
    };
    async function effectMacroDelTarget() {
        if (!mbaPremades.helpers.findEffect(token.actor, "Prone")) await mbaPremades.helpers.addCondition(token.actor, "Prone");
    };
    let effectDataTarget = {
        'name': "Froghemoth: Swallow",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You've been swallowed by Froghemoth.</p>
            <p>While swallowed, you are @UUID[Compendium.mba-premades.MBA SRD.Item.3NxmNhGQQqUDnu73]{Blinded} and @UUID[Compendium.mba-premades.MBA SRD.Item.gfRbTxGiulUylAjE]{Restrained}, have total cover against attacks and other effects outside the Froghemoth, and take 3d6 acid damage at the start of each of the Froghemoth's turns.</p>
            <p>If the Froghemoth takes 20 damage or more on a single turn from a creature inside it, the Froghemoth must succeed on a DC 20 Constitution saving throw at the end of that turn.</p>
            <p>On a failed save, Froghemoth regurgitates all swallowed creatures, which fall @UUID[Compendium.mba-premades.MBA SRD.Item.LbGCc4TiQnxaUoGn]{Prone} in a space within 10 feet of the Froghemoth.</p>
            <p>If the Froghemoth dies, you are no longer @UUID[Compendium.mba-premades.MBA SRD.Item.gfRbTxGiulUylAjE]{Restrained} by it and can escape from the corpse using 15 feet of movement, exiting @UUID[Compendium.mba-premades.MBA SRD.Item.LbGCc4TiQnxaUoGn]{Prone}.</p>
        `,
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Blinded",
                'priority': 20
            },
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Restrained",
                'priority': 20
            },
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['combatEnd']
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDelTarget)
                }
            }
        }
    };
    let distance = await mba.getDistance(workflow.token, target);
    if (grappleEffect) await mba.removeEffect(grappleEffect);
    await warpgate.wait(100);
    await mba.pushToken(workflow.token, target, -distance);
    await mba.createEffect(target.actor, effectDataTarget);
    await mba.createEffect(workflow.actor, effectDataSource);
}

async function swallowEveryTurn(token) {
    let effect = await mba.findEffect(token.actor, "Swallow: Passive");
    if (!effect) return;
    let updates = {
        'flags': {
            'mba-premades': {
                'feature': {
                    'frohemoth': {
                        'swallow': {
                            'damageTaken': 0,
                        }
                    }
                }
            }
        }
    };
    await mba.updateEffect(effect, updates);
}

async function swallowTurnStart(token) {
    let effects = token.actor.effects.filter(e => e.name.includes("Swallow") && e.name != "Swallow: Passive" && e.name != "Swallow: Save");
    if (!effects.length) return;
    let targetUuids = [];
    for (let effect of effects) {
        let swallowEffect = await mba.findEffect(token.actor, effect.name);
        targetUuids.push(swallowEffect.flags['mba-premades']?.feature?.froghemoth?.swallow?.targetUuid);
    }
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Monster Features", "Frogemoth Swallow: Damage", false);
    if (!featureData) return;
    delete featureData._id;
    featureData.name = "Froghemoth: Acid Stomach";
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': token.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions(targetUuids);
    await MidiQOL.completeItemUse(feature, config, options);
}

async function swallowDamaged({ speaker, actor, token, character, item, args, scope, workflow }) {
    let [froghemothToken] = Array.from(workflow.targets).filter(t => t.document.name === "Froghemoth");
    if (mba.findEffect(froghemothToken.actor, "Swallow: Save")) return;
    let check = await mba.findEffect(froghemothToken.actor, `Swallow (${workflow.token.name})`);
    if (!check) return;
    let effect = await mba.findEffect(froghemothToken.actor, "Swallow: Passive");
    let damageTaken = effect.flags['mba-premades']?.feature?.froghemoth?.swallow?.damageTaken;
    damageTaken += workflow.damageItem.appliedDamage;
    let updates = {
        'flags': {
            'mba-premades': {
                'feature': {
                    'froghemoth': {
                        'swallow': {
                            'damageTaken': damageTaken,
                        }
                    }
                }
            }
        }
    };
    await mba.updateEffect(effect, updates);
    if (damageTaken < 20) return;
    else {
        async function effectMacroTurnEnd() {
            let saveEffect = await mbaPremades.helpers.findEffect(token.actor, "Swallow: Save");
            let saveRoll = await mbaPremades.helpers.rollRequest(token, "save", "con");
            if (saveRoll.total >= 20) {
                await mbaPremades.helpers.removeEffect(saveEffect);
                return;
            }
            else {
                let effects = token.actor.effects.filter(e => e.name.includes("Swallow") && e.name != "Swallow: Passive" && e.name != "Swallow: Save");
                if (!effects.length) {
                    ui.notifications.warn("Failed to find origin swallow effects!");
                    return;
                }
                for (let effect of effects) {
                    let swallowEffect = await mbaPremades.helpers.findEffect(token.actor, effect.name);
                    let targetDoc = await fromUuid(swallowEffect.flags['mba-premades']?.feature?.froghemoth?.swallow?.targetUuid);
                    mbaPremades.helpers.pushToken(token, targetDoc.object, 10);
                    await mbaPremades.helpers.removeEffect(swallowEffect);
                }
                await mbaPremades.helpers.removeEffect(saveEffect);
            }
        }
        let effectData = {
            'name': "Swallow: Save",
            'icon': "modules/mba-premades/icons/generic/generic_debuff.webp",
            'flags': {
                'dae': {
                    'showIcon': true,
                },
                'effectmacro': {
                    'onEachTurn': {
                        'script': mba.functionToString(effectMacroTurnEnd)
                    }
                }
            }
        };
        await mba.createEffect(froghemothToken.actor, effectData);
    }
}

async function tentacle({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let target = workflow.targets.first();
    if (mba.findEffect(workflow.actor, `${workflow.token.document.name}: Grapple (${target.document.name})`)) return;
    if (mba.checkTrait(target.actor, "ci", "grappled")) return;
    if (mba.findEffect(target.actor, "Grappled")) return;
    if (mba.findEffect(target.actor, `${workflow.token.document.name}: Grapple`)) return; //overly cautious
    if (mba.getSize(target.actor) > 4) return;
    let saveDC = workflow.item.system.save.dc;
    async function effectMacroDel() {
        let originDoc = await fromUuid(effect.changes[0].value);
        let originEffect = await mbaPremades.helpers.findEffect(originDoc.actor, `${originDoc.name}: Grapple (${token.document.name})`);
        if (originEffect) await mbaPremades.helpers.removeEffect(originEffect);
    };
    let effectDataTarget = {
        'name': `${workflow.token.document.name}: Grapple`,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'changes': [
            {
                'key': 'flags.mba-premades.feature.grapple.origin',
                'mode': 5,
                'value': workflow.token.document.uuid,
                'priority': 20
            },
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Grappled",
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `actionSave=true, rollType=skill, saveAbility=ath|acr, saveDC=${saveDC}, saveMagic=false, name=Grapple: Action Save (DC${saveDC}), killAnim=true`,
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': false,
                'specialDuration': ['combatEnd']
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };
    async function effectMacroDelSource() {
        let targetDoc = await fromUuid(effect.flags['mba-premades']?.feature?.froghemoth?.grapple?.targetUuid);
        let targetEffect = await mbaPremades.helpers.findEffect(targetDoc.actor, "Froghemoth: Grapple");
        if (targetEffect) await mbaPremades.helpers.removeEffect(targetEffect);
    };
    let effectDataSource = {
        'name': `${workflow.token.document.name}: Grapple (${target.document.name})`,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'flags': {
            'dae': {
                'specialDuration': ['zeroHP', 'combatEnd']
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDelSource)
                }
            },
            'mba-premades': {
                'feature': {
                    'froghemoth': {
                        'grapple': {
                            'targetUuid': target.document.uuid
                        }
                    }
                }
            }
        }
    };
    await new Sequence()

        .effect()
        .file("jb2a.template_line_piercing.generic.01.orange")
        .atLocation(workflow.token)
        .stretchTo(target)
        .playbackRate(0.9)
        .filter("ColorMatrix", { saturate: -1, brightness: 1 })

        .wait(150)

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectDataTarget);
            await mba.createEffect(workflow.actor, effectDataSource);
        })

        .effect()
        .file("jb2a.markers.chain.standard.complete.02.grey")
        .attachTo(target)
        .scaleToObject(2 * target.document.texture.scaleX)
        .fadeIn(500)
        .fadeOut(1000)
        .opacity(0.8)

        .play()
}

async function tongueCheck({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    if (mba.getSize(target.actor) > 2) {
        ui.notifications.warn("Target is too big to use tongue on!");
        return false;
    }
}

async function tongueItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let position;
    let updates;
    let options;
    if (workflow.failedSaves.size) {
        let interval = target.document.width % 2 === 0 ? 1 : -1;
        await mba.gmDialogMessage();
        position = await mba.aimCrosshair(workflow.token, 10, workflow.item.img, interval, target.document.width);
        await mba.clearGMDialogMessage();
        updates = {
            'token': {
                'x': position.x - (canvas.grid.size * 0.5),
                'y': position.y - (canvas.grid.size * 0.5)
            }
        };
        options = {
            'permanent': true,
            'name': 'Move Token',
            'description': 'Move Token'
        };
    }
    new Sequence()

        .effect()
        .file("jb2a.template_line_piercing.nature.01.green")
        .atLocation(workflow.token)
        .stretchTo(target)
        .playbackRate(0.8)
        .filter("ColorMatrix", { hue: 200 })

        .effect()
        .file("jb2a.melee_generic.slash.01.bluepurple.2")
        .attachTo(target)
        .size(3, { gridUnits: true })

        .wait(300)

        .thenDo(async () => {
            if (workflow.failedSaves.size) await warpgate.mutate(target.document, updates, {}, options);
        })

        .play()
}

async function shockSusceptibility({ speaker, actor, token, character, item, args, scope, workflow }) {
    let shockEffect = await mba.findEffect(actor, "Shock Susceptibility");
    if (!shockEffect) return;
    let shockDebuff = await mba.findEffect(actor, "Froghemoth: Shock Susceptibility");
    if (shockDebuff) return;
    let typeCheck = workflow.damageDetail?.some(i => i.type === "lightning");
    if (!typeCheck) return;
    const effectData = {
        'name': "Froghemoth: Shock Susceptibility",
        'icon': "modules/mba-premades/icons/generic/generic_lightning.webp",
        'description': `
            <p>${actor.prototypeToken.name} recieved lightning damage.</p>
            <p>Its speed is halved and it has disadvantage on Dexteriy savingh throws until the end of its next turn.</p>
        `,
        'changes': [
            {
                'key': 'system.attributes.movement.all',
                'mode': 0,
                'value': "*0.5",
                'priority': 30
            },
            {
                'key': 'flags.midi-qol.disadvantage.ability.save.dex',
                'mode': 2,
                'value': 1,
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['turnEnd']
            }
        }
    };
    await mba.createEffect(actor, effectData);
}

export let froghemoth = {
    'swallowItem': swallowItem,
    'swallowEveryTurn': swallowEveryTurn,
    'swallowTurnStart': swallowTurnStart,
    'swallowDamaged': swallowDamaged,
    'tentacle': tentacle,
    'tongueCheck': tongueCheck,
    'tongueItem': tongueItem,
    'shockSusceptibility': shockSusceptibility
}