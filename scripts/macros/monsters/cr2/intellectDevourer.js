import {mba} from "../../../helperFunctions.js";

async function devourIntellect({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let target = workflow.targets.first();
    let targetInt = target.actor.system.abilities.int.value;
    let intRoll = await new Roll("3d6").roll({ 'async': true });
    await MidiQOL.displayDSNForRoll(intRoll, 'damageRoll');
    intRoll.toMessage({
        rollMode: 'roll',
        speaker: { actor: workflow.actor },
        flavor: `<b>Devour Intellect</b> vs <b>${targetInt}INT</b>`
    });
    if (intRoll.total < targetInt) return;
    const effectData = {
        'name': "Intellect Devourer: Devour Intellect",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Your intelligence score is reduced to 0.</p>
            <p>You are stunned until you regain at least on point of Intelligence.</p>
        `,
        'changes': [
            {
                'key': 'system.abilities.int.value',
                'mode': 3,
                'value': 0,
                'priority': 20
            },
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': 'Stunned',
                'priority': 20
            },
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': 'Incapacitated',
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true
            }
        }
    };
    await mba.createEffect(target.actor, effectData);
}

async function bodyThief({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    if (mba.raceOrType(target.actor) != "humanoid") {
        ui.notifications.warn("Body Thief works only on humanoid targets!");
        return;
    }
    if (!mba.findEffect(target.actor, "Incapacitated")) {
        ui.notifications.warn("Target is not Incapacitated!");
        return;
    }
    let sourceRoll = await workflow.actor.rollAbilityTest('int');
    let targetRoll = await mba.rollRequest(target, 'abil', 'int');
    if (targetRoll.total >= sourceRoll.total) return;
    new Sequence()

        .effect()
        .file("jaamod.sequencer_fx_master.blood_splat.red.2")
        .attachTo(target)
        .scaleIn(0, 500, { 'ease': 'easeOutCubic' })
        .scaleToObject(1.8 * target.document.texture.scaleX)
        .duration(5000)
        .fadeOut(1000)
        .belowTokens()

        .thenDo(async () => {
            await workflow.token.document.update({ hidden: true });
        })

        .play()
}

export let intellectDevourer = {
    'devourIntellect': devourIntellect,
    'bodyThief': bodyThief
}