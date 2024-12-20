import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let ammount = workflow.castData.castLevel + 2;
    if (workflow.targets.size <= ammount) return;
    await mba.playerDialogMessage(game.user);
    let selection = await mba.selectTarget(workflow.item.name, constants.okCancel, Array.from(workflow.targets), false, 'multiple', undefined, false, 'Too many targets selected. Choose which targets to keep (Max: ' + ammount + ')');
    await mba.clearPlayerDialogMessage();
    if (!selection.buttons) {
        ui.notifications.warn("Failed to select targets!");
        return false;
    }
    let check = selection.inputs.filter(i => i != false);
    if (check.length > ammount) {
        ui.notifications.warn("Too many targets selected, try again!");
        return false;
    }
    let newTargets = selection.inputs.filter(i => i).slice(0, ammount);
    mba.updateTargets(newTargets);
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Bane` })
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Until the spell ends, you subtract 1d4 from all attack rolls and saving throws.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'system.bonuses.abilities.save',
                'mode': 2,
                'value': "-1d4",
                'priority': 20
            },
            {
                'key': 'system.bonuses.All-Attacks',
                'mode': 2,
                'value': "-1d4",
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'specialDuration': ["zeroHP"]
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
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
    for (let target of Array.from(workflow.failedSaves)) {
        let delay1 = 100 + Math.floor(Math.random() * (Math.floor(1000) - Math.ceil(100)) + Math.ceil(100));
        let delay2 = 1500 + delay1;
        let delay3 = 500 + delay2;

        new Sequence()

            .effect()
            .file("jb2a.particle_burst.01.circle.yellow")
            .atLocation(target)
            .scaleToObject(2 * target.document.texture.scaleX)
            .delay(delay1)
            .fadeIn(500)
            .fadeOut(500)
            .playbackRate(0.9)
            .filter("ColorMatrix", { hue: 250 })

            .effect()
            .file("jb2a.bless.200px.loop.purple")
            .attachTo(target)
            .delay(delay2)
            .fadeOut(1000)
            .scaleIn(0, 1500, { ease: "easeOutCubic" })
            .scaleToObject(1.9 * target.document.texture.scaleX)
            .opacity(0.8)
            .playbackRate(0.8)
            .randomRotation()
            .belowTokens()
            .persist()
            .name(`${target.document.name} Bane`)

            .wait(delay3)

            .thenDo(async () => {
                await mba.createEffect(target.actor, effectData)
            })

            .play()
    }
}

export let bane = {
    'cast': cast,
    'item': item
}