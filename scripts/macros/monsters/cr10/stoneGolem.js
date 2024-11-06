import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function slowCast({ speaker, actor, token, character, item, args, scope, workflow }) {
    new Sequence()

        .effect()
        .file("jb2a.token_stage.square.blue.02.02")
        .attachTo(workflow.token, { followRotation: false })
        .size(7.6, { gridUnits: true })
        .fadeIn(1000)
        .fadeOut(2000)
        .filter("ColorMatrix", { hue: 200 })
        .belowTokens()
        .persist()
        .name(`${workflow.token.document.name} STGSlow1`)

        .play()

    await mba.gmDialogMessage();
    let selection = await mba.selectTarget("Slow", constants.okCancel, Array.from(workflow.targets), false, "multiple", undefined, false, `Choose which targets to keep:`);
    await mba.clearGMDialogMessage();
    if (!selection.buttons) {
        Sequencer.EffectManager.endEffects({ name: `${workflow.token.document.name} STGSlow1` });
        return;
    }
    let newTargets = selection.inputs.filter(i => i).slice(0);
    mba.updateTargets(newTargets);
}

async function slowItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) {
        Sequencer.EffectManager.endEffects({ name: `${workflow.token.document.name} STGSlow1` });
        return;
    }
    async function effectMacroTurnStart() {
        if (!mbaPremades.helpers.findEffect(token.actor, "Reaction")) await mbaPremades.helpers.addCondition(token.actor, "Reaction");
        await mbaPremades.helpers.dialog("Slow", [["Ok!", false]], `
                <p>You are slowed.</p>
                <p>You can't use reactions.</p>
                <p>On your turn, you can use either<br>an Action or a Bonus Action, not both.</p>
                <p>Regardless of your abilities or magic items, you can't make more than one<br>melee or ranged attack during your turn.</p>
                <p>You can make another Wisdom Saving Throw at the end of each of your turns.</p>
                <p>On a successful save, the effect ends.</p>
            `);
    };
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} STGSlow` });
        let reaction = await mbaPremades.helpers.findEffect(token.actor, "Reaction");
        if (reaction) await mbaPremades.helpers.removeEffect(reaction);
    };
    let effectData = {
        'name': "Stone Golem: Slow",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are slowed. You can't use reactions. On your turn, you can use either an Action or a Bonus Action, not both.</p>
            <p>Regardless of your abilities or magic items, you can't make more than one melee or ranged attack during your turn.</p>
            <p>You can make another Wisdom Saving Throw at the end of each of your turns. On a successful save, the effect ends.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.slow.reaction,preItemRoll',
                'priority': 20
            },
            {
                'key': 'system.attributes.movement.all',
                'mode': 0,
                'value': "*0.5",
                'priority': 30
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `turn=end, saveAbility=wis, saveDC=17, saveMagic=true, name=Slow: Turn End (DC17), killAnim=true`,
                'priority': 20
            },
        ],
        'flags': {
            'effectmacro': {
                'onTurnStart': {
                    'script': mba.functionToString(effectMacroTurnStart)
                },
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 3,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    for (let target of Array.from(workflow.failedSaves)) {
        new Sequence()

            .effect()
            .file(workflow.item.img)
            .attachTo(target)
            .scaleToObject(1)
            .duration(4000)
            .fadeIn(1000)
            .fadeOut(1000)

            .effect()
            .file("jb2a.token_border.circle.static.orange.006")
            .attachTo(target)
            .scaleToObject(1.95)
            .delay(500)
            .fadeIn(500)
            .fadeOut(1000)
            .scaleIn(0.1, 1000)
            .scaleOut(0.1, 1000)
            .playbackRate(0.95)
            .belowTokens()
            .filter("ColorMatrix", { hue: 50, brightness: 2 })
            .persist()
            .name(`${target.document.name} STGSlow`)

            .thenDo(async () => {
                if (!mba.findEffect(target.actor, "Stone Golem: Slow")) await mba.createEffect(target.actor, effectData);
                if (!mba.findEffect(target.actor, "Reaction")) await mba.addCondition(target.actor, "Reaction");
            })

            .play()
    }
    await Sequencer.EffectManager.endEffects({ name: `${workflow.token.document.name} STGSlow1` });
}

export let stoneGolem = {
    'slowCast': slowCast,
    'slowItem': slowItem
}