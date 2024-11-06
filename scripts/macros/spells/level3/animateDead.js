import {mba} from "../../../helperFunctions.js";
import {summons} from "../../generic/summons.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let zombieActor = game.actors.getName("MBA: Zombie");
    let skeletonActor = game.actors.getName("MBA: Skeleton");
    if (!zombieActor || !skeletonActor) {
        ui.notifications.warn('Missing required sidebar actors!');
        return;
    }
    let spellLevel = workflow.castData?.castLevel;
    if (!spellLevel) return;
    let totalSummons = 1 + (spellLevel - 3) * 2;
    if (workflow.actor.flags['mba-premades']?.feature?.undeadThralls) totalSummons += 1;
    if (!totalSummons || totalSummons < 1) return;
    await mba.playerDialogMessage(game.user);
    let sourceActors = await mba.selectDocuments(`Select Summons (Max: ${totalSummons})`, [zombieActor, skeletonActor]);
    await mba.clearPlayerDialogMessage();
    if (!sourceActors) return;
    if (sourceActors.length > totalSummons) {
        ui.notifications.info("Wrong ammount selected, try again!");
        return;
    }
    let updates = {
        'actor': {
            'prototypeToken': {
                'disposition': workflow.token.document.disposition,
            }
        },
        'token': {
            'disposition': workflow.token.document.disposition,
        }
    };
    await mba.playerDialogMessage(game.user);
    await summons.spawn(sourceActors, updates, 86400, workflow.item, undefined, undefined, 10, workflow.token, "undead", undefined, workflow.castData?.castLevel);
    await mba.clearPlayerDialogMessage();
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Animate Dead: Command Undead", false);
    if (!featureData) return;
    let updates2 = {
        'embedded': {
            'Item': {
                [featureData.name]: featureData
            }
        }
    };
    let options = {
        'permanent': false,
        'name': workflow.item.name,
        'description': featureData.name
    };
    await warpgate.mutate(workflow.token.document, updates2, {}, options);
    let effect = mba.findEffect(workflow.actor, workflow.item.name);
    if (!effect) return;
    let currentScript = effect.flags.effectmacro?.onDelete?.script;
    if (!currentScript) return;
    let effectUpdates = {
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': currentScript + '; await warpgate.revert(token.document, "' + effect.name + '");'
                }
            },
        }
    };
    await mba.updateEffect(effect, effectUpdates);
}

async function command({ speaker, actor, token, character, item, args, scope, workflow }) {
    let targets = game.canvas.scene.tokens.filter(t => mba.findEffect(t.actor, `${workflow.token.document.name} Animate Dead`));
    if (!targets.length) {
        ui.notifications.warn("Unable to find undead to command!");
        return;
    }

    new Sequence()

        .effect()
        .file("jb2a.magic_signs.circle.02.necromancy.intro.green")
        .attachTo(workflow.token, { followRotation: false })
        .size(2.5, { gridUnits: true })
        .fadeOut(1000)
        .playbackRate(1.4)
        .zIndex(1)
        .belowTokens()

        .effect()
        .file("jb2a.magic_signs.circle.02.necromancy.loop.green")
        .attachTo(workflow.token, { followRotation: false })
        .size(2.5, { gridUnits: true })
        .delay(2000)
        .zIndex(2)
        .belowTokens()
        .persist()
        .name(`${workflow.token.document.name} AnDCom`)

        .play()

    for (let target of targets) {
        new Sequence()

            .wait(2000)

            .effect()
            .file("jb2a.energy_beam.normal.dark_greenpurple.03")
            .attachTo(workflow.token)
            .stretchTo(target)
            .duration(5000)
            .fadeIn(500)
            .fadeOut(1000)
            .scaleIn(0.1, 2000)

            .effect()
            .file("jb2a.condition.curse.01.001.green")
            .attachTo(target)
            .scaleToObject(2)
            .delay(2000)
            .playbackRate(0.8)

            .play()
    };
    await warpgate.wait(6000);
    new Sequence()

        .effect()
        .file("jb2a.magic_signs.circle.02.necromancy.outro.green")
        .attachTo(workflow.token, { followRotation: false })
        .size(2.5, { gridUnits: true })
        .zIndex(3)
        .belowTokens()

        .wait(300)

        .thenDo(async () => {
            Sequencer.EffectManager.endEffects({ name: `${workflow.token.document.name} AnDCom` });
        })

        .play()
}

export let animateDead = {
    'item': item,
    'command': command
}