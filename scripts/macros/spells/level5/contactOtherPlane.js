import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

// To do: better animations?

export async function contactOtherPlane({ speaker, actor, token, character, item, args, scope, workflow }) {
    new Sequence()

        .effect()
        .file("jb2a.magic_signs.circle.02.divination.intro.purple")
        .attachTo(workflow.token, { followRotation: false })
        .size(4, { gridUnits: true })
        .fadeOut(1000)
        .playbackRate(1.4)
        .zIndex(1)
        .belowTokens()

        .effect()
        .file("jb2a.magic_signs.circle.02.divination.loop.purple")
        .attachTo(workflow.token, { followRotation: false })
        .size(4, { gridUnits: true })
        .delay(2000)
        .zIndex(2)
        .belowTokens()
        .persist()
        .name(`${workflow.token.document.name} CoOtPl`)

        .play()

    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Contact Other Plane: Save", false);
    if (!featureData) return;
    delete featureData._id;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([workflow.token.document.uuid]);
    await warpgate.wait(2000);
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);

    if (featureWorkflow.failedSaves.size) {
        let effectData = {
            'name': "Contact Other Plane: Insanity",
            'icon': "modules/mba-premades/icons/spells/level5/contact_other_plane_insanity.webp",
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

            .effect()
            .file("animated-spell-effects-cartoon.cantrips.sacred_flame.red")
            .attachTo(workflow.token)
            .scaleToObject(2.5)
            .belowTokens()
            .repeats(5, 500)

            .effect()
            .file("jb2a.magic_signs.circle.02.divination.outro.purple")
            .attachTo(workflow.token, { followRotation: false })
            .size(4, { gridUnits: true })
            .zIndex(3)
            .belowTokens()

            .thenDo(async () => {
                await mba.createEffect(workflow.actor, effectData);
            })

            .wait(400)

            .thenDo(async () => {
                Sequencer.EffectManager.endEffects({ name: `${workflow.token.document.name} CoOtPl` });
            })

            .play()

        return;
    }
    else if (featureWorkflow.saves.size) {
        let count = 5;
        for (let i = 0; i != count;) {
            await new Promise((resolve) => {
                new Dialog({
                    title: `Contact other Plane: Counter`,
                    content: `<p>This is a QoL counter for GM to track questions.</p><p>Questions left: <b>${count}</b></p>`,
                    buttons: {
                        plus: {
                            label: "Press when question is answered",
                            callback: async () => {
                                count -= 1;
                                resolve(count);
                            },
                        }
                    },
                    default: "plus"
                }).render(true);
            });
        };
        new Sequence()

            .effect()
            .file("jb2a.magic_signs.circle.02.divination.outro.purple")
            .attachTo(workflow.token, { followRotation: false })
            .size(4, { gridUnits: true })
            .zIndex(3)
            .belowTokens()

            .wait(400)

            .thenDo(async () => {
                Sequencer.EffectManager.endEffects({ name: `${workflow.token.document.name} CoOtPl` });
            })

            .play()
    }
}