import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

// To do: icon, animations

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let newTargets = [];
    for (let target of Array.from(workflow.targets)) {
        if (target.actor.system.abilities.int.value > 2) newTargets.push(target.id);
        else {
            ChatMessage.create({
                flavor: `<u>${target.document.name}</u> is unaffected by Synaptic Static!`,
                speaker: ChatMessage.getSpeaker({ actor: workflow.actor })
            });
        }
    }
    mba.updateTargets(newTargets);
    /*let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;
    let targets = Array.from(game.user.targets);


    for (let target of targets) {
        new Sequence()

            .effect()
            .file("jb2a.lightning_ball.yellow")
            .attachTo(target)
            .scaleToObject(2.5)
            .fadeIn(2000)
            .belowTokens()
            .mask()
            .persist()
            .name(`${workflow.token.document.name} SynST1`)

            .play()
    }*/
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Synaptic Static: Save", false);
    if (!featureData) return;
    delete featureData._id;
    let saveDC = mba.getSpellDC(workflow.item);
    featureData.system.save.dc = saveDC;
    setProperty(featureData, 'mba-premades.spell.castData.school', workflow.item.system.school);
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
    let targetUuids = Array.from(workflow.targets).map(t => t.document.uuid);
    let [config, options] = constants.syntheticItemWorkflowOptions(targetUuids);
    await game.messages.get(workflow.itemCardId).delete();
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (!featureWorkflow.failedSaves.size) return;
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} SynSta` })
    };
    let effectData = {
        'name': "Synaptic Static",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are affected by Synaptic Static and have muddied thoughts.</p>
            <p>For the duration you subtract 1d6 from all attack rolls and ability checks, as well as its Constitution saving throws to maintain @UUID[Compendium.mba-premades.MBA SRD.Item.xkgKqndXJGj9YaFC]{Concentration}.</p>
            <p>You can make an Intelligence saving throw at the end of each of your turns, ending the effect on a success.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'system.bonuses.All-Attacks',
                'mode': 2,
                'value': "-1d6",
                'priority': 25
            },
            {
                'key': 'system.bonuses.abilities.check',
                'mode': 2,
                'value': "-1d6",
                'priority': 25
            },
            {
                'key': 'flags.midi-qol.concentrationSaveBonus',
                'mode': 2,
                'value': "-1d6",
                'priority': 25
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `turn=end, saveAbility=int, saveDC=${saveDC}, saveMagic=true, name=Synaptic Static: Turn End (DC${saveDC}), killAnim=true`,
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
                    baseLevel: 5,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    for (let target of featureWorkflow.failedSaves) {
        let delayRoll = await new Roll("1d4").roll({ 'async': true });
        let delay = delayRoll.total * 100;

        new Sequence()

            .effect()
            .file("jb2a.static_electricity.03.yellow")
            .attachTo(target)
            .scaleToObject(1.25)
            .delay(delay)
            .fadeIn(500)
            .fadeOut(1000)
            .randomRotation()
            .persist()
            .name(`${target.document.name} SynSta`)

            .thenDo(async () => {
                await mba.createEffect(target.actor, effectData);
            })
            .play()
    }
}

export let synapticStatic = {
    'cast': cast,
    'item': item
}