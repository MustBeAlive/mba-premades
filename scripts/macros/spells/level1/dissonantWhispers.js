import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    if (!mba.findEffect(target.actor, 'Deafened')) return;
    ChatMessage.create({
        flavor: `<b>${target.document.name}</b> is <b>deafened</b> and automatically succeeds on the save.`,
        speaker: ChatMessage.getSpeaker({ actor: workflow.actor })
    });
    await mba.createEffect(target.actor, constants.immunityEffectData);
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    if (!workflow.failedSaves.size || mba.findEffect(target.actor, 'Reaction')) {
        new Sequence()

            .effect()
            .file("jb2a.cast_generic.sound.01.pinkteal.0")
            .attachTo(target)
            .scaleToObject(1.8 * target.document.texture.scaleX)
            .waitUntilFinished(-1000)

            .effect()
            .file("jb2a.impact_themed.music_note.pink")
            .attachTo(target)
            .scaleToObject(1.5 * target.document.texture.scaleX)

            .play()

        if (!workflow.failedSaves.size) {
            ui.notifications.warn("Target saves!");
            return;
        }
        else if (mba.findEffect(target.actor, 'Reaction')) {
            ui.notifications.info("Target has no reaction available!");
            return;
        }
    }
    async function effectMacroCreate() {
        await mbaPremades.helpers.dialog("Dissonant Whispers", [["Gotcha", "ok"]], `                
            <p>You must immediately use your reaction to move as far as your speed allows away from the caster of the spell.</p>
            <p>You don't have to move into obviously dangerous ground, such as a fire or a pit.</p>
        `);
    };
    async function effectMacroDel() {
        await Sequencer.EffectManager.endEffects({ name: `${token.document.name} Dissonant Whispers`, object: token })
    };
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You must immediately use your reaction to move as far as your speed allows away from the caster of the spell.</p>
            <p>You don't have to move into obviously dangerous ground, such as a fire or a pit.</p>
        `,
        'duration': {
            'rounds': 1
        },
        'flags': {
            'effectmacro': {
                'onCreate': {
                    'script': mba.functionToString(effectMacroCreate)
                },
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'dae': {
                'specialDuration': ['turnStart']
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 1,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };

    new Sequence()

        .effect()
        .file("jb2a.cast_generic.sound.01.pinkteal.0")
        .attachTo(target)
        .scaleToObject(1.8 * target.document.texture.scaleX)
        .waitUntilFinished(-1000)

        .effect()
        .file("jb2a.impact_themed.music_note.pink")
        .attachTo(target)
        .scaleToObject(1.5 * target.document.texture.scaleX)

        .effect()
        .file("jb2a.markers.fear.orange.03")
        .attachTo(target)
        .scaleToObject(2)
        .center()
        .fadeIn(500)
        .fadeOut(1000)
        .playbackRate(1)
        .filter("ColorMatrix", { hue: 290 })
        .persist()
        .name(`${target.document.name} Dissonant Whispers`)

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectData);
            await mba.addCondition(target.actor, "Reaction");
        })

        .play()
}

export let dissonantWhispers = {
    'cast': cast,
    'item': item
}