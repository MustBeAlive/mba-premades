import {mba} from "../../../helperFunctions.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Race Feature Items', 'Shell Defense: Emerge from Shell', false);
    if (!featureData) {
        ui.notifications.warn("Unable to find item in compendium (Shell Defense: Emerge from Shell)");
        return;
    };
    async function effectMacroDel() {
        new Sequence()

            .effect()
            .file("jb2a.shield.03.outro_explode.green")
            .attachTo(token)
            .scaleToObject(1.7 * token.document.texture.scaleX)
            .waitUntilFinished(-500)

            .thenDo(function () {
                Sequencer.EffectManager.endEffects({ name: `${token.document.name} Shell Defense`, object: token })
                warpgate.revert(token.document, "Shell Defense");
            })

            .play()
    };
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are hiding in the shell and have +4 bonus to AC, as well as advantage on Strength and Constitution saving throws.</p>
            <p>While in the shell, you are prone, your speed is 0 and can't increase, you have disadvantage on Dexterity saving throws, can't take reactions, and the only action you can take is a bonus action to emerge.</p>
        `,
        'changes': [
            {
                'key': 'system.attributes.ac.bonus',
                'mode': 2,
                'value': "+4",
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.advantage.ability.save.str',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.advantage.ability.save.con',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Prone",
                'priority': 20
            },
            {
                'key': 'system.attributes.movement.walk',
                'mode': 5,
                'value': 0,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.disadvantage.ability.save.dex',
                'mode': 2,
                'value': 1,
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };
    let updates = {
        'embedded': {
            'Item': {
                [featureData.name]: featureData
            },
            'ActiveEffect': {
                [effectData.name]: effectData
            }
        }
    };
    let options = {
        'permanent': false,
        'name': 'Shell Defense',
        'description': 'Shell Defense'
    };
    new Sequence()

        .effect()
        .file("jb2a.shield.03.intro.green")
        .attachTo(token)
        .scaleToObject(1.7 * token.document.texture.scaleX)
        .opacity(0.8)
        .playbackRate(0.8)

        .effect()
        .file("jb2a.shield.03.loop.green")
        .delay(600)
        .fadeIn(500)
        .attachTo(token)
        .scaleToObject(1.7 * token.document.texture.scaleX)
        .opacity(0.8)
        .playbackRate(0.8)
        .persist()
        .name(`${token.document.name} Shell Defense`)

        .thenDo(function () {
            warpgate.mutate(workflow.token.document, updates, {}, options);
        })

        .play()
}

async function emerge({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = await mba.findEffect(workflow.actor, "Shell Defense");
    if (!effect) {
        ui.notifications.warn("You are not hiding in the shell!");
        return;
    };
    let choices = [["Yes, emerge", "yes"], ["No, keep staying in the shell", "no"]];
    let selection = await mba.dialog("Do you wish to emerge from the shell?", choices);
    if (!selection || selection === "no") return;
    await mba.removeEffect(effect);
}

export let shellDefense = {
    'item': item,
    'emerge': emerge
}