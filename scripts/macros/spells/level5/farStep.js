import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Far Step: Teleport", false);
    if (!featureData) return;
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Far Step` })
        await warpgate.revert(token.document, 'Far Step');
    };
    let effectData = {
        'name': "Far Step",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>On each of your turns before the spell ends, you can use a bonus action to teleport up to 60 feet to an unoccupied space you can see.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
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
    let updates = {
        'embedded': {
            'Item': {
                [featureData.name]: featureData,
            },
            'ActiveEffect': {
                [effectData.name]: effectData
            }
        }
    };
    let options = {
        'permanent': false,
        'name': 'Far Step',
        'description': 'Far Step'
    };

    new Sequence()

        .effect()
        .file("jb2a.token_border.circle.spinning.purple.001")
        .attachTo(workflow.token, { bindAlpha: false })
        .scaleToObject(2)
        .fadeOut(1000)
        .scaleIn(0, 1000, { ease: "easeOutElastic" })
        .scaleOut(0, 1000, { ease: "easeOutElastic" })
        .persist()
        .name(`${workflow.token.document.name} Far Step`)

        .play()

    await warpgate.mutate(workflow.token.document, updates, {}, options);
    let feature = await mba.getItem(workflow.actor, "Far Step: Teleport");
    if (!feature) return;
    let [config, options2] = constants.syntheticItemWorkflowOptions([workflow.token.document.uuid]);
    await MidiQOL.completeItemUse(feature, config, options2);
}

async function teleport({ speaker, actor, token, character, item, args, scope, workflow }) {
    let icon = workflow.item.img;
    let interval = workflow.token.document.width % 2 === 0 ? 1 : -1;
    await mba.playerDialogMessage(game.user);
    let position = await mba.aimCrosshair(workflow.token, 60, icon, interval, workflow.token.document.width);
    await mba.clearPlayerDialogMessage();
    if (position.cancelled) return;
    new Sequence()

        .effect()
        .file("jb2a.explosion.07.purplepink")
        .atLocation(workflow.token)
        .scale({ x: workflow.token.data.width / 4, y: workflow.token.data.height / 4 })
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .fadeOut(1000)

        .animation()
        .on(workflow.token)
        .opacity(0)

        .effect()
        .file("jb2a.energy_strands.range.standard.purple.04")
        .atLocation(workflow.token)
        .stretchTo(position)
        .playbackRate(1.25)
        .waitUntilFinished(-2000)

        .effect()
        .file("jb2a.explosion.07.purplepink")
        .atLocation(position)
        .fadeOut(1000)
        .scale({ x: workflow.token.data.width / 4, y: workflow.token.data.height / 4 })
        .scaleIn(0, 500, { ease: "easeOutCubic" })

        .animation()
        .on(workflow.token)
        .teleportTo(position)
        .snapToGrid()
        .offset({ x: -1, y: -1 })
        .waitUntilFinished(+100)

        .animation()
        .on(workflow.token)
        .opacity(1)

        .play();
}

export let farStep = {
    'item': item,
    'teleport': teleport
}