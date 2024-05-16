import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

export async function bless({ speaker, actor, token, character, item, args, scope, workflow }) {
    let ammount = workflow.castData.castLevel + 2;
    if (workflow.targets.size > ammount) {
        let selection = await mba.selectTarget(workflow.item.name, constants.okCancel, Array.from(workflow.targets), false, 'multiple', undefined, false, 'Too many targets selected.<br>Choose which targets to keep (Max: ' + ammount + ')');
        if (!selection.buttons) {
            ui.notifications.warn("Failed to select targets!");
            await mba.removeCondition(workflow.actor, "Concentrating");
            return;
        }
        let newTargets = selection.inputs.filter(i => i).slice(0, ammount);
        mba.updateTargets(newTargets);
    }
    let targets = Array.from(game.user.targets);
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Bless` })
    }
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Until the spell ends, you have 1d4 bonus to all attack rolls and saving throws.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'system.bonuses.abilities.save',
                'mode': 2,
                'value': "+1d4",
                'priority': 20
            },
            {
                'key': 'system.bonuses.All-Attacks',
                'mode': 2,
                'value': "+1d4",
                'priority': 20
            }
        ],
        'flags': {
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
    for (let target of targets) {
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
    
            .effect()
            .file("jb2a.bless.200px.loop.yellow")
            .attachTo(target)
            .scaleToObject(2.1 * target.document.texture.scaleX)
            .delay(delay2)
            .scaleIn(0, 1500, {ease: "easeOutCubic"})
            .fadeOut(1000)
            .opacity(0.8)
            .playbackRate(0.8)
            .belowTokens()
            .persist()
            .name(`${target.document.name} Bless`)
    
            .wait(delay3)
    
            .thenDo(function () {
                mba.createEffect(target.actor, effectData)
            })
    
            .play()
    }
}