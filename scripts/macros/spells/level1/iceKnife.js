import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

export async function iceKnife({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let targets = await mba.findNearby(target, 5, null, true, false);
    new Sequence()

        .wait(300)

        .effect()
        .file("jb2a.ranged.02.projectile.01.purple")
        .attachTo(token)
        .stretchTo(target)
        .filter("ColorMatrix", { hue: 350 })
        .waitUntilFinished(-1200)

        .effect()
        .file("jb2a.impact_themed.ice_shard.02.blue")
        .attachTo(target)
        .size(3, { gridUnits: true })
        .playbackRate(0.9)
        .waitUntilFinished()

        .play()

    for (let i of targets) {
        new Sequence()

            .wait(800)

            .effect()
            .file("jb2a.impact_themed.ice_shard.01.blue")
            .attachTo(i)
            .scaleToObject(1.5 * i.document.texture.scaleX)

            .play()
    }

    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Spell Features', 'Ice Knife: Explosion', false);
    if (!featureData) {
        ui.notifications.warn('Can\'t find item in compenidum! (Ice Knife: Explosion)');
        return
    }
    delete featureData._id;
    let damageDice = 1 + workflow.castData.castLevel;
    featureData.system.damage.parts = [[damageDice + 'd6[cold]', 'cold']];
    let originItem = workflow.item;
    if (!originItem) return;
    featureData.system.save.dc = mba.getSpellDC(originItem);
    setProperty(featureData, 'mba-premades.spell.castData.school', originItem.system.school);
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
    let targetUuids = [];
    for (let i of targets) targetUuids.push(i.document.uuid);
    let [config, options] = constants.syntheticItemWorkflowOptions(targetUuids);
    await MidiQOL.completeItemUse(feature, config, options);
}