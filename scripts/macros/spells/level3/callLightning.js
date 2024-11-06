import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;
    new Sequence()

        .effect()
        .file("jb2a.call_lightning.high_res.blue")
        .attachTo(template)
        .scaleToObject(1)
        .fadeIn(2000)
        .fadeOut(5000)
        .opacity(0.7)
        .persist()
        .name(`Call Lightning`)

        .play()

    await mba.playerDialogMessage(game.user);
    let storming = await mba.dialog("Call Lightning", constants.yesNo, "<b>Is it already storming? (ask GM)</b>");
    await mba.clearPlayerDialogMessage();
    let spellLevel = workflow.castData.castLevel;
    if (storming) spellLevel += 1;
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Call Lightning: Storm Bolt", false);
    if (!featureData) return;
    featureData.system.damage.parts = [[`${spellLevel}d10[lightning]`, "lightning"]];
    featureData.system.save.dc = mba.getSpellDC(workflow.item);
    featureData.flags['mba-premades'] = { 'spell': { 'castData': workflow.castData } };
    featureData.flags['mba-premades'].spell.castData.school = workflow.item.system.school;
    async function effectMacroDel() {
        await warpgate.revert(token.document, "Call Lightning");
    }
    let effectData = {
        'name': "Call Lightning",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p></p>
        `,
        'duration': {
            'seconds': 600
        },
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 3,
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
                [workflow.item.name]: effectData
            }
        }
    };
    let options = {
        'permanent': false,
        'name': "Call Lightning",
        'description': "Call Lightning"
    };
    await warpgate.mutate(workflow.token.document, updates, {}, options);
}

async function bolt({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;
    new Sequence()

        .effect()
        .file("jb2a.lightning_strike.blue.2")
        .attachTo(template, { offset: { x: 0.66, y: 0.66 }, gridUnits: true })
        .scaleToObject(2.5)

        .effect()
        .file("animated-spell-effects-cartoon.electricity.08")
        .attachTo(template, { offset: { x: 0.66, y: 0.66 }, gridUnits: true })
        .scaleToObject(1)
        .delay(100)

        .effect()
        .file("jb2a.lightning_strike.blue.2")
        .attachTo(template, { offset: { x: -0.66, y: 0.66 }, gridUnits: true })
        .scaleToObject(2.5)
        .delay(150)

        .effect()
        .file("animated-spell-effects-cartoon.electricity.08")
        .attachTo(template, { offset: { x: -0.66, y: 0.66 }, gridUnits: true })
        .scaleToObject(1)
        .delay(250)

        .effect()
        .file("jb2a.lightning_strike.blue.2")
        .attachTo(template, { offset: { x: 0, y: -0.66 }, gridUnits: true })
        .scaleToObject(2.5)
        .delay(300)

        .effect()
        .file("animated-spell-effects-cartoon.electricity.08")
        .attachTo(template, { offset: { x: 0, y: -0.66 }, gridUnits: true })
        .scaleToObject(1)
        .delay(400)

        .play()
}

export let callLightning = {
    'item': item,
    'bolt': bolt,
}