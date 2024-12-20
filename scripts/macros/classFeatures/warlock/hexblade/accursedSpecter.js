import {mba} from "../../../../helperFunctions.js";
import {tashaSummon} from "../../../generic/tashaSummon.js";

export async function accursedSpecter({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.targets.size) return;
    let target = workflow.targets.first();
    if (!target) return;
    if (target.document.uuid === workflow.token.document.uuid) return;
    if (target.actor.system.attributes.hp.value > 0) return;
    if (mba.raceOrType(target.actor) != "humanoid") return;
    let originItem = await mba.getItem(workflow.actor, "Accursed Specter");
    if (originItem.system.uses.value < 1) return;
    let choices = [["Yes, summon Specter", true], ["No", false]];
    await mba.playerDialogMessage(game.user);
    let selection = await mba.dialog("Accursed Specter", choices, `Would you like to cause ${target.document.name} spirit to rise as a <b><u>Specter?</u></b>`);
    await mba.clearPlayerDialogMessage();
    if (!selection) return;
    let sourceActor = game.actors.getName("MBA: Accursed Specter");
    if (!sourceActor) {
        ui.notifications.warn("Missing actor in the side panel! (MBA: Accursed Specter)");
        return;
    }
    let tokenName = `${workflow.token.document.name} Accursed Specter`;
    let tempHP = Math.min(workflow.actor.classes.warlock?.system?.levels / 2);
    let lifeDrainFeatureData = await mba.getItemFromCompendium("mba-premades.MBA Summon Features", "Accursed Specter: Life Drain", false);
    if (!lifeDrainFeatureData) {
        ui.notifications.warn("Unable to find item in the compendium!! (Accursed Specter: Life Drain)");
        return;
    }
    lifeDrainFeatureData.name = "Life Drain";
    let chaBonus = workflow.actor.system.abilities.cha.mod;
    if (chaBonus < 0) chaBonus = 0;
    lifeDrainFeatureData.system.attackBonus = `+${chaBonus}`;
    let updates = {
        'actor': {
            'name': tokenName,
            'prototypeToken': {
                'name': tokenName,
                'disposition': workflow.token.document.disposition,
            },
            'system': {
                'attributes': {
                    'hp': {
                        'temp': tempHP
                    }
                }
            }
        },
        'token': {
            'disposition': workflow.token.document.disposition,
            'name': tokenName,
        },
        'embedded': {
            'Item': {
                [lifeDrainFeatureData.name]: lifeDrainFeatureData
            }
        }
    };
    await mba.playerDialogMessage(game.user);
    await tashaSummon.spawn(sourceActor, updates, 86400, originItem, 5, target, "shadow");
    await mba.clearPlayerDialogMessage();
    async function effectMacroLongRest() {
        await effect.delete();
    }
    let updates2 = {
        'flags': {
            'effectmacro': {
                'dnd5e.longRest': {
                    'script': mba.functionToString(effectMacroLongRest)
                }
            }
        }
    }
    let effect = await mba.findEffect(workflow.actor, "Accursed Specter");
    if (effect) await mba.updateEffect(effect, updates2);
    await originItem.update({ "system.uses.value": 0 });
}