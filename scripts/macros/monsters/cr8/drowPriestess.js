import {mba} from "../../../helperFunctions.js";
import {tashaSummon} from "../../generic/tashaSummon.js";

async function summonDemon({ speaker, actor, token, character, item, args, scope, workflow }) {
    new Sequence()

        .effect()
        .file("jb2a.magic_signs.circle.02.conjuration.intro.dark_purple")
        .attachTo(workflow.token, { followRotation: false })
        .size(4, { gridUnits: true })
        .fadeOut(1000)
        .playbackRate(1.4)
        .zIndex(1)
        .belowTokens()

        .effect()
        .file("jb2a.magic_signs.circle.02.conjuration.loop.dark_purple")
        .attachTo(workflow.token, { followRotation: false })
        .size(4, { gridUnits: true })
        .delay(2000)
        .zIndex(2)
        .belowTokens()
        .persist()
        .name(`${workflow.token.document.name} SumDem`)

        .play()

    await warpgate.wait(2000);
    let summonRoll = await new Roll("1d100").roll({ 'async': true });
    await MidiQOL.displayDSNForRoll(summonRoll);
    if (summonRoll.total <= 69) {
        ui.notifications.info("Attempt fails!");
        let damageRoll = await new Roll("1d10[psychic]").roll({ 'async': true });
        await MidiQOL.displayDSNForRoll(damageRoll);
        new Sequence()

            .effect()
            .file("jb2a.magic_signs.circle.02.conjuration.outro.dark_purple")
            .attachTo(workflow.token, { followRotation: false })
            .size(4, { gridUnits: true })
            .zIndex(3)
            .belowTokens()

            .wait(400)

            .thenDo(async () => {
                Sequencer.EffectManager.endEffects({ name: `${workflow.token.document.name} SumDem` });
                await mba.applyWorkflowDamage(workflow.token, damageRoll, "force", [workflow.token], undefined, workflow.itemCardId);
            })

            .play()

        return;
    }
    let sourceActor = game.actors.getName("Yochlol");
    if (!sourceActor) {
        ui.notifications.warn("Unale to find actor! (Yochlol)");
        return;
    }
    let tokenName = "Drow Priestess Yochlol";
    let updates = {
        'actor': {
            'name': tokenName,
            'prototypeToken': {
                'name': tokenName,
                'disposition': workflow.token.document.disposition,
            }
        },
        'token': {
            'disposition': workflow.token.document.disposition,
            'name': tokenName,
        }
    };
    await mba.gmDialogMessage();
    await tashaSummon.spawn(sourceActor, updates, 600, workflow.item, 60, workflow.token, "shadow");
    await mba.clearGMDialogMessage();
    new Sequence()

        .effect()
        .file("jb2a.magic_signs.circle.02.conjuration.outro.dark_purple")
        .attachTo(workflow.token, { followRotation: false })
        .size(4, { gridUnits: true })
        .zIndex(3)
        .belowTokens()

        .wait(400)

        .thenDo(async () => {
            Sequencer.EffectManager.endEffects({ name: `${workflow.token.document.name} SumDem` });
        })

        .play()
}

export let drowPriestess = {
    'summonDemon': summonDemon
}