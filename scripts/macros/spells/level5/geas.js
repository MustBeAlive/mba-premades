import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

//To do: description?

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    new Sequence()

        .effect()
        .file("jb2a.shield_themed.below.eldritch_web.01.dark_purple")
        .attachTo(workflow.token)
        .scaleToObject(2.2)
        .fadeIn(500)
        .fadeOut(1500)
        .filter("ColorMatrix", { hue: 90 })
        .belowTokens()
        .persist()
        .name(`${workflow.token.document.name} Geas`)

        .play()

    let target = workflow.targets.first();
    await mba.gmDialogMessage();
    let selectionGM = await mba.remoteDialog("Geas", constants.yesNo, game.users.activeGM.id, `Can <u>${target.document.name}</u> understand <u>${workflow.token.document.name}</u>?`);
    await mba.clearGMDialogMessage();
    if (!selectionGM || mba.checkTrait(target.actor, "ci", "charmed")) await mba.createEffect(target.actor, constants.immunityEffectData);
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) {
        Sequencer.EffectManager.endEffects({ name: `${workflow.token.document.name} Geas` });
        return;
    }
    let target = workflow.targets.first();
    let duration;
    switch (workflow.castData.castLevel) {
        case 5:
        case 6: duration = 86400 * 30; break;
        case 7:
        case 8: duration = 86400 * 365; break;
        case 9: break;
    };
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Geas: Punishment", false);
    if (!featureData) {
        Sequencer.EffectManager.endEffects({ name: `${workflow.token.document.name} Geas` });
        return;
    }
    async function effectMacroDelSource() {
        let targetActorId = effect.flags['mba-premades']?.spell?.geas?.targetActorId;
        let [target] = game.canvas.scene.tokens.filter(t => t.actor.id === targetActorId);
        if (!target) {
            ui.notifications.info("Target is not on the same scene!");
        }
        else if (target) {
            let targetEffect = await mbaPremades.helpers.findEffect(target.actor, "Geas: Target");
            if (targetEffect) await mbaPremades.helpers.removeEffect(targetEffect);
        }
        await warpgate.revert(token.document, "Geas");
    };
    let effectDataSource = {
        'name': `Geas (${target.document.name})`,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'flags': {
            'dae': {
                'showIcon': false,
                'specialDuration': ['zeroHP'],
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDelSource)
                }
            },
            'mba-premades': {
                'spell': {
                    'geas': {
                        'targetActorId': target.actor.id
                    }
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 5,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    let updates = {
        'embedded': {
            'Item': {
                [featureData.name]: featureData,
            },
            'ActiveEffect': {
                [effectDataSource.name]: effectDataSource
            }
        }
    };
    let options = {
        'permanent': false,
        'name': "Geas",
        'description': "Geas"
    };
    async function effectMacroDelTarget() {
        let originActorId = effect.flags['mba-premades']?.spell?.geas?.originActorId;
        let [target] = game.canvas.scene.tokens.filter(t => t.actor.id === originActorId);
        if (!target) return;
        let targetEffect = await mbaPremades.helpers.findEffect(target.actor, `Geas (${token.document.name})`);
        if (targetEffect) await mbaPremades.helpers.removeEffect(targetEffect);
    };
    let effectDataTarget = {
        'name': "Geas: Target",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p></p>
        `,
        'duration': duration,
        'flags': {
            'dae': {
                'showIcon': false,
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDelTarget)
                }
            },
            'mba-premades': {
                'greaterRestoration': true,
                'isCurse': true,
                'spell': {
                    'geas': {
                        'originActorId': workflow.actor.id
                    }
                }
            },
            "midi-qol": {
                "castData": {
                    baseLevel: 5,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    new Sequence()

        .effect()
        .file("jb2a.condition.curse.01.002.red")
        .attachTo(target)
        .scaleToObject(2)
        .fadeIn(500)
        .fadeOut(1500)
        .repeats(3, 1500)

        .effect()
        .file("jb2a.shield_themed.below.eldritch_web.03.dark_purple")
        .attachTo(target)
        .scaleToObject(2.2)
        .duration(6000)
        .fadeIn(500)
        .fadeOut(1500)
        .filter("ColorMatrix", { hue: 90 })
        .belowTokens()

        .thenDo(async () => {
            await warpgate.mutate(workflow.token.document, updates, {}, options);
            await mba.createEffect(target.actor, effectDataTarget);
            Sequencer.EffectManager.endEffects({ name: `${workflow.token.document.name} Geas` });
        })

        .play()
}

async function punishment({ speaker, actor, token, character, item, args, scope, workflow }) {
    let [effect] = workflow.actor.effects.filter(e => e.name.includes("Geas") && e.name != "Geas: Target");
    if (!effect) {
        ui.notifications.warn("Unable to find effect! (Geas)");
        return;
    }
    let targetActorId = effect.flags['mba-premades']?.spell?.geas?.targetActorId;
    let [target] = game.canvas.scene.tokens.filter(t => t.actor.id === targetActorId);
    if (!target) {
        ui.notifications.info("Target is not on the same scene!");
        return;
    }
    let damageRoll = await new Roll(`5d10[psychic]`).roll({ 'async': true });
    await MidiQOL.displayDSNForRoll(damageRoll);

    new Sequence()

        .effect()
        .file("jb2a.condition.curse.01.002.red")
        .attachTo(target)
        .scaleToObject(2)
        .fadeIn(500)
        .fadeOut(1500)
        .repeats(3, 1500)

        .effect()
        .file("jb2a.shield_themed.below.eldritch_web.03.dark_purple")
        .attachTo(target)
        .scaleToObject(2.2)
        .duration(6000)
        .fadeIn(500)
        .fadeOut(1500)
        .filter("ColorMatrix", { hue: 90 })
        .belowTokens()

        .wait(250)

        .thenDo(async () => {
            await mba.applyWorkflowDamage(workflow.token, damageRoll, "psychic", [target], undefined, workflow.itemCardId);
        })

        .play()
}

export let geas = {
    'cast': cast,
    'item': item,
    'punishment': punishment
}