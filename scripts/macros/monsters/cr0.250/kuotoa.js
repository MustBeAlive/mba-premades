import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function stickyShield(workflow) {
    let target = workflow.targets.first();
    if (workflow.hitTargets.size || workflow.item.system.actionType != "mwak" || !mba.findEffect(target.actor, "Sticky Shield")) return;
    if (mba.findEffect(target.actor, "Reaction")) return;
    let selectionTarget = await mba.remoteDialog("Kuo-toa: Sticky Shield", constants.yesNo, mba.firstOwner(target).id, "<b>Use reaction to attempt to stick enemy weapon to your shield?</b>");
    if (!selectionTarget) return;
    let saveRoll = await mba.rollRequest(workflow.token, 'save', 'str');
    if (saveRoll.total >= 11) {
        await mba.addCondition(target.actor, "Reaction");
        return;
    }
    let optionsSource = [["Keep holding the weapon or unable to let it go (grappled)", "hold"], ["Let the weapon go (uneqip)", "letgo"]];
    let selectionSource = await mba.dialog("Kuo-toa: Sticky Shield", optionsSource, `<b>Your weapon is stuck in the Sticky Shield:</b>`);
    if (!selectionSource) return;
    if (selectionSource === "letgo") {
        let weapon = workflow.actor.items.find(i => i.name === workflow.item.name);
        if (!weapon) {
            ui.notifications.warn("unable to find weapon!");
            return;
        }
        if (weapon.system.equipped) await workflow.actor.updateEmbeddedDocuments("Item", [{ _id: workflow.item.id, "system.equipped": false }]);
        await mba.addCondition(target.actor, "Reaction");
        return;
    }
    const effectData = {
        'name': "Kuo-toa: Sticky Shield",
        'icon': "icons/equipment/shield/heater-emossed-spiral-green.webp",
        'description': `
            <p>Your weapon is stuck in Kuo-toa's Sticky Shield</p>
            <p>Since you keep holding it, you are @UUID[Compendium.mba-premades.MBA SRD.Item.EthsAglVRC2bOxun]{Grappled} while the weapon is still stuck.</p>
            <p>While stuck, this weapon cannot be used.</p>
            <p>You can try to pull the weapon free by taking an action to make a DC 11 Strength check and succeeding.</p>
        `,
        'changes': [
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.monsters.kuotoa.check,preItemRoll',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': 'actionSave=true, rollType=check, saveAbility=str, saveDC=11, saveMagic=false, name=Sticky Shield: Action Save (DC 11), killAnim=true',
                'priority': 20
            },
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': 'Grappled',
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true
            },
            'mba-premades': {
                'feature': {
                    'stickyShield': {
                        'name': workflow.item.name
                    }
                }
            }
        }
    };
    await mba.createEffect(workflow.actor, effectData);
    await mba.addCondition(target.actor, "Reaction");
}

async function check({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = await mba.findEffect(workflow.actor, "Kuo-toa: Sticky Shield");
    if (!effect) return;
    let originName = effect.flags['mba-premades']?.feature?.stickyShield?.name;
    if (workflow.item.name != originName) return;
    ui.notifications.warn("You are unable to use this weapon! (it's stuck in the Sticky Shield)");
    return false;
}

export let kuotoa = {
    'stickyShield': stickyShield,
    'check': check
}