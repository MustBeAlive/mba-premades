//wip

import {mba} from "../../../helperFunctions.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;
    await template.update({
        'flags': {
            'mba-premades': {
                'template': {
                    'castLevel': workflow.castData.castLevel,
                    'itemUuid': workflow.item.uuid,
                    'saveDC': mba.getSpellDC(workflow.item),
                    'templateUuid': template.uuid,
                }
            }
        }
    });
    await tokenAttacher.attachElementToToken(template, workflow.token, true);
    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Spell Features', 'Gust of Wind: Move');
    if (!featureData) return;
    async function effectMacroDel() {
        await warpgate.revert(token.document, 'Gust of Wind');
    }
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'duration': {
            'seconds': 60
        },
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'mba-premades': {
                'spell': {
                    'gustOfWind': {
                        'templateUuid': template.uuid
                    }
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
        'name': "Gust of Wind",
        'description': "Gust of Wind"
    };

    new Sequence()

        .effect()
        .file("jb2a.gust_of_wind.veryfast")
        .attachTo(template)
        .fadeIn(500)
        .persist()
        .name(`Gust of Wind`)

        .thenDo(async () => {
            await warpgate.mutate(workflow.token.document, updates, {}, options);
        })

        .play()
}

async function enter(template, token) {
    let trigger = template.flags['mba-premades']?.template;
    if (!trigger) return;
    await gustOfWind.trigger(token.document, trigger);
}

async function trigger(token, trigger) {
    let template = await fromUuid(trigger.templateUuid);
    if (!template) return;
}

async function move({ speaker, actor, token, character, item, args, scope, workflow }) {

}

export let gustOfWind = {
    'item': item,
    'enter': enter,
    'trigger': trigger,
    'move': move
}