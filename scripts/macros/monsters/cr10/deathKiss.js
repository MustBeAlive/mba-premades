import { constants } from "../../generic/constants.js";
import { mba } from "../../../helperFunctions.js";

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
        let targetDoc = await fromUuid(effect.flags['mba-premades']?.feature?.deathKiss?.grapple?.targetUuid);
        let targetEffect = await mbaPremades.helpers.findEffect(targetDoc.actor, "Death Kiss: Grapple");
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
                    'deathKiss': {
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

async function bloodDrainCheck({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let effects = workflow.actor.effects.filter(e => e.name.includes("Death Kiss: Grapple") && e.name != "Grappled");
    if (!effects.length) {
        ui.notifications.warn("You are not grappling anyone!");
        return false;
    }
    if (!mba.findEffect(workflow.actor, `${workflow.token.document.name}: Grapple (${target.document.name})`)) {
        ui.notifications.warn("You can only use this ability on a grappled target!");
        return false;
    }
}

async function bloodDrainItem({ speaker, actor, token, character, item, args, scope, workflow }) {
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

    if (!workflow.failedSaves.size) return;
    let healFormula = Math.floor(workflow.damageRoll.total / 2).toString();
    let healingRoll = await new Roll(healFormula).roll({ 'async': true });
    await mba.applyWorkflowDamage(workflow.token, healingRoll, "healing", [workflow.token], "Blood Drain", workflow.itemCardId);
}

async function lightningBlood({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    if (!(workflow.item.system.actionType === 'mwak' || workflow.item.system.actionType === 'msak')) return;
    if (mba.getDistance(workflow.token, token) > 5) return;
    let hasValidDamageType = false;
    for (let i of workflow.damageDetail) {
        if (i.type === "slashing" || i.type === "piercing") hasValidDamageType = true;
    }
    if (!hasValidDamageType) return;
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Monster Features", "Death Kiss: Lightning Blood", false);
    if (!featureData) return;
    delete featureData._id;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': token.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([workflow.token.document.uuid]);
    await warpgate.wait(100);

    new Sequence()

        .effect()
        .file("jb2a.chain_lightning.secondary.blue")
        .attachTo(token)
        .stretchTo(workflow.token)

        .effect()
        .file("jb2a.static_electricity.03.blue")
        .delay(300)
        .attachTo(workflow.token)
        .scaleToObject(1.5)
        .repeats(2, 2500)

        .thenDo(async () => {
            await MidiQOL.completeItemUse(feature, config, options);
        })

        .play()
}

export let deathKiss = {
    'tentacle': tentacle,
    'bloodDrainCheck': bloodDrainCheck,
    'bloodDrainItem': bloodDrainItem,
    'lightningBlood': lightningBlood
}