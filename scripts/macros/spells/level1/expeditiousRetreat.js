import {mba} from "../../../helperFunctions.js";

export async function expeditiousRetreat({ speaker, actor, token, character, item, args, scope, workflow }) {
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>When you cast this spell, and then as a bonus action on each of your turns until the spell ends, you can take the Dash action.</p>
        `,
        'duration': {
            'seconds': 600
        },
        'flags': {
            'midi-qol': {
                'castData': {
                    baseLevel: 1,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    let actionData = await mba.getItemFromCompendium("mba-premades.MBA Actions", "Dash", false);
    if (!actionData) return;
    let action = new CONFIG.Item.documentClass(actionData, { parent: workflow.actor });
    let options = {
        'showFullCard': false,
        'createWorkflow': true,
        'targetUuids': [workflow.token.document.uuid],
        'configureDialog': false,
        'versatile': false,
        'consumeResource': false,
        'consumeSlot': false,
        'workflowOptions': {
            'autoRollDamage': 'always',
            'autoFastDamage': true
        }
    };
    new Sequence()

        .effect()
        .file("jb2a.particles.inward.greenyellow.02.05")
        .attachTo(workflow.token)
        .scaleToObject(2 * workflow.token.document.texture.scaleX)
        .fadeIn(500)
        .fadeOut(1000)

        .effect()
        .file("jb2a.particle_burst.01.rune.yellow")
        .attachTo(workflow.token)
        .scaleToObject(1.8 * workflow.token.document.texture.scaleX)
        .delay(1000)

        .wait(2800)

        .thenDo(async () => {
            await mba.createEffect(workflow.actor, effectData);
            await MidiQOL.completeItemUse(action, {}, options);
        })

        .play()
}