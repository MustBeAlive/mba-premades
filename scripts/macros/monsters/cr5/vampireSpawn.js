import {mba} from "../../../helperFunctions.js";

async function biteCheck({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    if (!target) return false;
    let grappled = await mba.findEffect(target.actor, "Vampire Spawn: Grapple");
    let restrained = await mba.findEffect(target.actor, "Restrained");
    let incapacitated = await mba.findEffect(target.actor, "Incapacitated");
    if (!grappled && !restrained && !incapacitated) {
        ui.notifications.warn("Bite can only be used on Restrained, Incapacitated, or grappled by Vampire Spawn targets!");
        return false;
    }
}

async function biteItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let target = workflow.targets.first();
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

        .play()

    let necrotic = +workflow.damageRoll.result.split("+")[2];
    let formula = necrotic.toString();
    let lifestealRoll = await new Roll(formula).roll({ 'async': true });
    let effect = await mba.findEffect(target.actor, "Vampire Spawn: Life Drain");
    if (effect) {
        let originalMax = effect.flags['mba-premades']?.originalMax;
        let newPenalty = effect.flags['mba-premades']?.penalty + necrotic;
        let updates = {
            'description': `
                <p>Your hit point maximum (<b>${originalMax}</b>) is reduced by (<b>${newPenalty}</b>).</p>
                <p>You will die if this effect reduces your hit point maximum to 0.</p>
            `,
            'changes': [
                {
                    'key': 'system.attributes.hp.max',
                    'mode': 2,
                    'value': `-${newPenalty}`,
                    'priority': 20
                },
            ],
            'flags': {
                'dae': {
                    'showIcon': true,
                    'specialDuration': ['longRest']
                },
                'mba-premades': {
                    'healthReduction': true,
                    'penalty': newPenalty
                }
            }
        };
        await mba.applyWorkflowDamage(workflow.token, lifestealRoll, "healing", [workflow.token], "Vampiric Bite", workflow.itemCardId);
        await mba.updateEffect(effect, updates);
        return;
    }
    const effectData = {
        'name': "Vampire Spawn: Life Drain",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Your hit point maximum (<b>${target.actor.system.attributes.hp.max}</b>) is reduced by (<b>${necrotic}</b>).</p>
            <p>You will die if this effect reduces your hit point maximum to 0.</p>
        `,
        'changes': [
            {
                'key': 'system.attributes.hp.max',
                'mode': 2,
                'value': `-${necrotic}`,
                'priority': 20
            },
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['longRest']
            },
            'mba-premades': {
                'greaterRestoration': true,
                'healthReduction': true,
                'originalMax': target.actor.system.attributes.hp.max,
                'penalty': necrotic,
            }
        }
    };
    await mba.applyWorkflowDamage(workflow.token, lifestealRoll, "healing", [workflow.token], "Vampiric Bite", workflow.itemCardId);
    await mba.createEffect(target.actor, effectData);
}

async function claws({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let target = workflow.targets.first();
    if (mba.checkTrait(target.actor, "ci", "grappled")) return;
    if (mba.findEffect(target.actor, `${workflow.token.document.name}: Grapple`)) return; //overly cautious
    if (mba.findEffect(target.actor, "Grappled")) return;
    await mba.gmDialogMessage();
    let choices = [["Deal damage", false], ["Grapple", "grapple"]];
    let selection = await mba.dialog("Vampire Spawn: Claws", choices, "<b>What would you like to do?</b>");
    await mba.clearGMDialogMessage();
    if (!selection) return;
    let dItem = workflow.damageItem;
    dItem.appliedDamage = 0;
    dItem.hpDamage = 0;
    dItem.totalDamage = 0;
    dItem.newHP = dItem.oldHP;
    async function effectMacroDelTarget() {
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
                'value': `actionSave=true, rollType=skill, saveAbility=ath|acr, saveDC=13, saveMagic=false, name=Grapple: Action Save (DC13), killAnim=true`,
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
                    'script': mba.functionToString(effectMacroDelTarget)
                }
            },
            'mba-premades': {
                'feature': {
                    'grapple': {
                        'originName': workflow.token.document.name
                    }
                }
            }
        }
    };
    async function effectMacroDelSource() {
        let targetDoc = await fromUuid(effect.flags['mba-premades']?.feature?.grapple?.targetUuid);
        let targetEffect = await mbaPremades.helpers.findEffect(targetDoc.actor, `${token.document.name}: Grapple`);
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
                    'grapple': {
                        'targetUuid': target.document.uuid
                    }
                }
            }
        }
    };
    await new Sequence()

        .effect()
        .file("jb2a.unarmed_strike.no_hit.01.yellow")
        .atLocation(workflow.token)
        .stretchTo(target)
        .playbackRate(0.9)
        .filter("ColorMatrix", { saturate: -1, brightness: 1 })

        .effect()
        .file("jb2a.unarmed_strike.no_hit.01.yellow")
        .atLocation(workflow.token)
        .stretchTo(target)
        .mirrorY()
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

export let vampireSpawn = {
    'biteCheck': biteCheck,
    'biteItem': biteItem,
    'claws': claws
}