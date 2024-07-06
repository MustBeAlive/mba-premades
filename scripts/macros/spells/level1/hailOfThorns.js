import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    async function effectMacroDel() {
        await (warpgate.wait(200));
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} HaOfTh` })
    };
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.hailOfThorns.damage,postDamageRoll',
                'priority': 20
            }
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'mba-premades': {
                'spell': {
                    'hailOfThorns': {
                        'dc': mba.getSpellDC(workflow.item),
                        'level': workflow.castData.castLevel
                    }
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

    new Sequence()

        .wait(500)

        .effect()
        .file("jb2a.token_border.circle.static.green.001")
        .attachTo(workflow.token)
        .scaleToObject(1.8 * workflow.token.document.texture.scaleX)
        .fadeIn(500)
        .fadeOut(1500)
        .persist()
        .name(`${workflow.token.document.name} HaOfTh`)

        .thenDo(async () => {
            await mba.createEffect(workflow.actor, effectData)
        })

        .play()
}

async function damage({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    if (workflow.item?.system?.actionType != 'rwak') return;
    let target = workflow.targets.first();
    let effect = mba.findEffect(workflow.actor, "Hail of Thorns");
    if (!effect) return;
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Hail of Thorns: Burst", false);
    if (!featureData) return;
    delete featureData._id;
    let originItem = await fromUuid(effect.origin);
    if (!originItem) return;
    setProperty(featureData, 'mba-premades.spell.castData.school', originItem.system.school);
    featureData.system.save.dc = mba.getSpellDC(originItem);
    let damageDice = Math.min(effect.flags['midi-qol'].castData.castLevel, 6);
    featureData.system.damage.parts = [[`${damageDice}d10[piercing]`, "piercing"]];
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
    let targetUuids = await mba.findNearby(target, 5).concat(target).map(t => t.document.uuid);
    let [config, options] = constants.syntheticItemWorkflowOptions(targetUuids);
    await MidiQOL.completeItemUse(feature, config, options);

    new Sequence()

        .wait(1000)
        
        .effect()
        .file("animated-spell-effects-cartoon.mix.fire earth explosion.01")
        .attachTo(target)
        .scaleToObject(2.8 * target.document.texture.scaleX)

        .effect()
        .file("jb2a.explosion.shrapnel.bomb.01.green")
        .attachTo(target)
        .size(4, { gridUnits: true })
        .delay(200)

        .wait(200)

        .thenDo(async () => {
            await mba.removeCondition(workflow.actor, 'Concentrating');
        })

        .play()
}

export let hailOfThorns = {
    'item': item,
    'damage': damage
}