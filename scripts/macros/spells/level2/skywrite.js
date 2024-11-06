import {mba} from "../../../helperFunctions.js";

export async function skywrite({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;
    let word = [];
    await mba.playerDialogMessage(game.user);
    let wordInput = await warpgate.menu({
        inputs: [{
            label: `Input text (Max: 10 words)`,
            type: 'text',
            options: ``
        }],
        buttons: [{
            label: 'Ok',
            value: 1
        }]
    },
        { title: 'Skywrite' }
    );
    await mba.clearPlayerDialogMessage();
    word.push(wordInput.inputs);
    let words = word.toString();
    let wordCount = words.trim().split(/\s+/).length;
    if (wordCount > 10) {
        ui.notifications.warn('Too much words, try again!');
        await mba.removeCondition(workflow.actor, 'Concentrating');
        return;
    }

    const style = {
        align: "center",
        fontFamily: "Helvetica",
        fontSize: 40,
        fontWeight: "bold",
        wordWrap: true,
        wordWrapWidth: 600
    };

    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: "Skywrite" })
    };
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You caused words to form in a part of the sky. The words appear to be made of cloud and remain in place for the spell’s duration. The words dissipate when the spell ends. A strong wind can disperse the clouds and end the spell early.</p>
            <p>Message: ${word}</p>
        `,
        'duration': {
            'seconds': 3600
        },
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 2,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };

    new Sequence()

        .effect()
        .attachTo(template)
        .fadeIn(1000)
        .fadeOut(1000)
        .scaleIn(0, 3500, { ease: "easeOutElastic" })
        .text(`${word}`, style)
        .persist()
        .name(`Skywrite`)

        .thenDo(async () => {
            await mba.createEffect(workflow.actor, effectData);
        })

        .play()
}