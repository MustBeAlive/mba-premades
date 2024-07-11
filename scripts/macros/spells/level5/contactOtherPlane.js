import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

//to do: icon, animations?

export async function contactOtherPlane({ speaker, actor, token, character, item, args, scope, workflow }) {
    new Sequence()

        .effect()
        .file("jb2a.magic_signs.circle.02.divination.complete.purple")
        .attachTo(workflow.token)
        .scaleToObject(2.5)
        .fadeOut(3000)
        .belowTokens()
        .persist()
        .name(`${workflow.token.document.name} CoOtP1`)

        .play()

    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Contact Other Plane: Save", false);
    if (!featureData) return;
    delete featureData._id;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([workflow.token.document.uuid]);
    await MidiQOL.completeItemUse(feature, config, options);

    if (workflow.failedSaves.size) {
        let effectData = {
            'name': "Contact Other Plane: Insanity",
            'icon': "",
            'origin': workflow.item.uuid,
            'description': `
                <p>You become insane until you finish a Long Rest.</p>
                <p>While insane, you can't take actions, can't understand what other creatures say, can't read, and speak only in gibberish.</p>
                <p>A Greater Restoration spell cast on you ends this effect early.</p>
            `,
            'changes': [

            ],
            'flags': {
                'dae': {
                    'showIcon': true,
                    'specialDuration': ['longRest']
                },
                'mba-premades': {
                    'greaterRestoration': true,
                    'isCurse': true,
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
        new Sequence()

            .thenDo(async () => {
                Sequencer.EffectManager.endEffects({ name: `${workflow.token.document.name} CoOtP1` });
            })

            .effect()
            .file("animated-spell-effects-cartoon.cantrips.sacred_flame.red")
            .attachTo(workflow.token)
            .scaleToObject(1.8)
            .belowTokens()

            .thenDo(async () => {
                await mba.createEffect(workflow.actor, effectData);
            })

            .play()

    }
    else if (!workflow.failedSaves.size) {
        let count = 5;
        for (let i = 0; i != count;) {
            let choices = [["Press when question is answered", false]];
            await mba.dialog("Contact Other Plane: Counter", choices, `<p>This is a QoL counter for GM to track questions.</p><p>Questions left: <b>${count}</b></p>`);
            i++
        }
    }
}