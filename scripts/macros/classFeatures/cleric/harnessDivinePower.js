import {mba} from "../../../helperFunctions.js";

export async function harnessDivinePower({speaker, actor, token, character, item, args, scope, workflow}) {
    let CDItem = await mba.getItem(workflow.actor, "Channel Divinity");
    if (!CDItem) {
        ui.notifications.warn("Unable to find feature! (Channel Divinity)");
        let harness = await mba.getItem(workflow.actor, "CD: Harness Divine Power");
        if (harness) {
            let harnessUses = harness.system.uses.value;
            await harness.update({"system.uses.value": harnessUses += 1});
        }
        return;
    }
    let uses = CDItem.system.uses.value;
    if (uses < 1) {
        ui.notifications.warn("You don't have any Channel Divinity uses left!");
        let harness = await mba.getItem(workflow.actor, "CD: Harness Divine Power");
        if (harness) {
            let harnessUses = harness.system.uses.value;
            await harness.update({"system.uses.value": harnessUses += 1});
        }
        return;
    }
    let maxLevel = Math.ceil(workflow.actor.system.attributes.prof /2);
    let validLevels = [];
    for (let i = 1; i <= maxLevel; i++) {
        let key2 = 'spell' + i;
        let key = 'system.spells.' + key2 + '.value';
        if ((workflow.actor.system.spells[key2].value < workflow.actor.system.spells[key2].max) && workflow.actor.system.spells[key2].max > 0) validLevels.push({'level': i, 'key': key});
    }
    let pact = workflow.actor.system.spells.pact;
    if (pact.max > 0 && pact.level <= maxLevel && pact.value < pact.max) validLevels.push({'level': 'p', 'key': 'system.spells.pact.value'});
    if (!validLevels.length) {
        ui.notifications.warn('You have no spell slots to regain!');
        let harness = await mba.getItem(workflow.actor, "CD: Harness Divine Power");
        if (harness) {
            let harnessUses = harness.system.uses.value;
            await harness.update({"system.uses.value": harnessUses += 1});
        }
        return;
    }
    let options = validLevels.map(i => [(i.level != 'p' ? mba.nth(i.level) + ' Level' : 'Pact Slot'), i.key]);
    let selection = options.length > 1 ? await mba.dialog(workflow.item.name, options, `<b>Choose slot level:</b>`) : options[0][1];
    if (!selection) {
        ui.notifications.info('Failed to select slot level, try again!');
        let harness = await mba.getItem(workflow.actor, "CD: Harness Divine Power");
        if (harness) {
            let harnessUses = harness.system.uses.value;
            await harness.update({"system.uses.value": harnessUses += 1});
        }
        return;
    }
    let value = getProperty(workflow.actor, selection);
    if (isNaN(value)) return;
    new Sequence()

        .effect()
        .file("jb2a.divine_smite.caster.blueyellow")
        .attachTo(token)
        .scaleToObject(1.8 * token.document.texture.scaleX)
        .waitUntilFinished(-600)

        .effect()
        .file("jb2a.explosion.05.yellowwhite")
        .attachTo(token)
        .scaleToObject(1.8)

        .effect()
        .file("jb2a.glint.yellow.many.3")
        .attachTo(token)
        .scaleToObject(1.3)
        .fadeIn(800)
        .fadeOut(1000)

        .thenDo(async () => {
            await CDItem.update({ "system.uses.value": uses -= 1});
            await workflow.actor.update({[selection]: value + 1});
        })

        .play()
}