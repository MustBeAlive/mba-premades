import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

export async function tashaMindWhip({ speaker, actor, token, character, item, args, scope, workflow }) {
    let ammount = workflow.castData.castLevel - 1;
    if (workflow.targets.size > ammount) {
        let selection = await mba.selectTarget(workflow.item.name, constants.okCancel, Array.from(workflow.targets), false, 'multiple', undefined, false, 'Too many targets selected. Choose which targets to keep (Max: ' + ammount + ')');
        if (!selection.buttons) {
            ui.notifications.warn('Failed to select right ammount of targets, try again!')
            return;
        }
        let check = selection.inputs.filter(i => i != false);
        if (check.length > ammount) {
            ui.notifications.warn("Too many targets selected, try again!");
            return;
        }
        let newTargets = selection.inputs.filter(i => i).slice(0, ammount);
        mba.updateTargets(newTargets);
    }
    await warpgate.wait(100);
    let targets = Array.from(game.user.targets);
    if (mba.within30(targets) === false) {
        ui.notifications.warn('Targets cannot be further than 30 ft. of each other, try again!')
        return;
    }
    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Spell Features', "Tasha's Mind Whip: Damage", false);
    if (!featureData) return;
    delete featureData._id;
    featureData.system.save.dc = mba.getSpellDC(workflow.item);
    setProperty(featureData, 'mba-premades.spell.castData.school', workflow.item.system.school);
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
    let targetUuids = [];
    for (let i of targets) targetUuids.push(i.document.uuid);
    let [config, options] = constants.syntheticItemWorkflowOptions(targetUuids);
    await game.messages.get(workflow.itemCardId).delete();
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (!featureWorkflow.failedSaves.size) return;
    async function effectMacroTurnStart() {
        let choices = [['Action', 'action'], ['Bonus Action', 'bonus'], ['Movement', 'move']];
        let selection = await mbaPremades.helpers.dialog("Tasha's Mind Whip", choices, `<b>Choose which action you would like to keep:</b>`);
        if (!selection) return;
        let flavor;
        switch (selection) {
            case 'action': {
                flavor = `Mind Whip: <b>${token.document.name}</b> chose to keep its <b>Action</b>`;
                break;
            }
            case 'bonus': {
                flavor = `Mind Whip: <b>${token.document.name}</b> chose to keep its <b>Bonus Action</b>`;
                break;
            }
            case 'move': {
                flavor = `Mind Whip: <b>${token.document.name}</b> chose to keep its <b>Movement Action</b>`;
                break;
            }
        }
        ChatMessage.create({
            flavor: flavor,
            speaker: ChatMessage.getSpeaker({ actor: actor })
        });
    };
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Mind Whip`, object: token })
    };
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You can't take reactions until the end of your next turn.</p>
            <p>Moreover, on your next turn, you must choose which action you'd like to keep: move, action, or bonus action.</p>
            <p>You only get to keep one of the three.</p>
        `,
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': 'Reaction',
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['turnEnd']
            },
            'effectmacro': {
                'onTurnStart': {
                    'script': mba.functionToString(effectMacroTurnStart)
                },
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
    let failedTargets = Array.from(featureWorkflow.failedSaves);
    for (let target of failedTargets) {
        new Sequence()

            .effect()
            .file("jb2a.ranged.03.projectile.01.pinkpurple")
            .attachTo(token)
            .stretchTo(target)
            .waitUntilFinished(-1200)

            .effect()
            .file("jb2a.impact.004.dark_purple")
            .attachTo(target)
            .scaleToObject(1.7)
            .delay(200)
            .fadeOut(1000)
            .playbackRate(0.8)
            .playIf(() => {
                return workflow.failedSaves.size
            })

            .effect()
            .file("jb2a.template_circle.symbol.normal.stun.purple")
            .attachTo(target)
            .scaleToObject(1.4)
            .delay(200)
            .fadeIn(500)
            .fadeOut(1000)
            .mask()
            .persist()
            .name(`${target.document.name} Mind Whip`)
            .playIf(() => {
                return workflow.failedSaves.size
            })

            .thenDo(async () => {
                if (workflow.failedSaves.size) await mba.createEffect(target.actor, effectData);
            })

            .play()
    }
}