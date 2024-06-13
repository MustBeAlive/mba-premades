import { constants } from "../../generic/constants.js";
import { mba } from "../../../helperFunctions.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let type = mba.raceOrType(target.actor);
    if (type === "undead" || type === "construct") await mba.createEffect(target.actor, constants.immunityEffectData);
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    async function effectMacroStartSource() {
        let effect = await mbaPremades.helpers.findEffect(actor, "Phantasmal Force");
        if (!effect) return;
        let targetDoc = await fromUuid(effect.flags['mba-premades']?.spell?.phantasmalForce?.targetUuid);
        let target = targetDoc.object;
        let choices = [[`Yes, deal damage to <b>${targetDoc.name}</b>`, "damage"], ["Cancel", false]];
        await mbaPremades.helpers.gmDialogMessage();
        let selection = await mbaPremades.helpers.remoteDialog("Phantasmal Force", choices, game.users.activeGM.id, `Can <b>${token.document.name}</b> deal damage to <b>${targetDoc.name}</b>?`);
        await mbaPremades.helpers.clearGMDialogMessage();
        if (!selection) return;
        let featureData = await mbaPremades.helpers.getItemFromCompendium('mba-premades.MBA Spell Features', 'Phantasmal Force: Damage', false);
        if (!featureData) {
            ui.notifications.warn("Unable to find item in the compendium! (Phantasmal Force: Damage)");
            return;
        }
        delete featureData._id;
        let feature = new CONFIG.Item.documentClass(featureData, { 'parent': actor });
        let [config, options] = mbaPremades.constants.syntheticItemWorkflowOptions([targetDoc.uuid]);
        await MidiQOL.completeItemUse(feature, config, options);
        new Sequence()

            .effect()
            .file("jb2a.magic_signs.rune.illusion.complete.pink")
            .attachTo(target)
            .scaleToObject(1.1 * target.document.texture.scaleX)
            .duration(5000)
            .fadeOut(1000)
            .opacity(0.9)

            .play()
    }
    async function effectMacroDelSource() {
        await Sequencer.EffectManager.endEffects({ name: `${token.document.name} Phantasmal Force` });
    }
    async function effectMacroDelTarget() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Phantasmal Force` });
        let targets = game.canvas.scene.tokens.filter(i => mbaPremades.helpers.findEffect(i.actor, "Phantasmal Force"));
        if (!targets.length) return;
        await mbaPremades.helpers.removeCondition(targets[0].actor, "Concentrating");
    }
    const effectDataSource = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': ``,
        'duration': {
            'seconds': 60
        },
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDelSource)
                },
                'onTurnStart': {
                    'script': mba.functionToString(effectMacroStartSource)
                }
            },
            'mba-premades': {
                'spell': {
                    'phantasmalForce': {
                        'targetUuid': target.document.uuid
                    }
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
    }
    const effectDataTarget = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': ``,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `actionSave=true, rollType=skill, saveAbility=inv, saveDC=${mba.getSpellDC(workflow.item)}, saveMagic=true, name=Phantasmal Force: Action Save, killAnim=true`,
                'priority': 20
            },
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDelTarget)
                }
            },
            'mba-premades': {
                'spell': {
                    'phantasmalForce': {
                        'originUuid': target.document.uuid
                    }
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

    new Sequence()

        .effect()
        .file("jb2a.magic_signs.rune.illusion.complete.pink")
        .attachTo(target)
        .scaleToObject(1.1 * target.document.texture.scaleX)
        .duration(5000)
        .fadeOut(1000)
        .opacity(0.9)

        .effect()
        .file("jb2a.butterflies.loop.01.bluepurple")
        .attachTo(target)
        .scaleToObject(2.5 * target.document.texture.scaleX)
        .delay(500)
        .duration(4500)
        .fadeIn(1000)
        .fadeOut(1000)

        .effect()
        .file("jb2a.token_border.circle.static.purple.006")
        .attachTo(target)
        .scaleToObject(2)
        .delay(3500)
        .fadeIn(1000)
        .fadeOut(1000)
        .scaleIn(0, 2000, { ease: "easeOutCubic" })
        .belowTokens()
        .persist()
        .name(`${target.document.name} Phantasmal Force`)
        .playIf(() => {
            return workflow.failedSaves.size
        })

        .effect()
        .file("jb2a.template_square.symbol.normal.stun.purple")
        .delay(3500)
        .atLocation(target)
        .fadeIn(1000)
        .fadeOut(1000)
        .randomRotation()
        .scaleOut(0, 1000, { ease: "linear" })
        .scaleIn(0, 2000, { ease: "easeOutCubic" })
        .size(4.5, { gridUnits: true })
        .persist()
        .name(`${workflow.token.document.name} Phantasmal Force`)
        .playIf(() => {
            return workflow.failedSaves.size
        })

        .wait(4200)

        .thenDo(async () => {
            if (workflow.failedSaves.size) {
                await mba.createEffect(target.actor, effectDataTarget);
                await mba.createEffect(workflow.actor, effectDataSource);
            }
        })

        .play()
}

export let phantasmalForce = {
    'cast': cast,
    'item': item
}