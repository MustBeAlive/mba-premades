import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function stench(token) {
    if (!mba.inCombat()) return;
    let tokenId = game.combat.current.tokenId;
    let [target] = await mba.findNearby(token, 5, null, false, false).filter(i => i.document.id === tokenId && i.document.name != "Troglodyte");
    if (!target) return;
    if (mba.checkTrait(target.actor, "ci", "poisoned")) return;
    if (mba.findEffect(target.actor, "Troglodyte: Stench Immune")) return;
    if (mba.findEffect(target.actor, "Troglodyte: Stench")) return;
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} TrogS` })
    }
    const effectData = {
        'name': "Troglodyte: Stench",
        'icon': "modules/mba-premades/icons/conditions/nauseated.webp",
        'origin': token.uuid,
        'description': `
            <p>You are affected by Troglodyte Stench and are @UUID[Compendium.mba-premades.MBA SRD.Item.pAjPUbk2oPUTfva2]{Poisoned} until the start of your next turn.</p>
        `,
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Poisoned",
                'priority': 20
            },
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['turnStart']
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };
    const immuneData = {
        'name': "Troglodyte: Stench Immune",
        'icon': "modules/mba-premades/icons/generic/generic_buff.webp",
        'origin': token.uuid,
        'description': "You are immune to Troglodyte Stench for the duration.",
        'duration': {
            'seconds': 3600
        }
    };
    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Monster Features', 'Troglodyte: Stench', false);
    if (!featureData) return;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': token.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([target.document.uuid]);
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (!featureWorkflow.failedSaves.size) {
        await mba.createEffect(target.actor, immuneData);
        return;
    }

    new Sequence()

        .effect()
        .file("jb2a.smoke.puff.centered.green.2")
        .attachTo(target)
        .scaleToObject(2 * target.document.texture.scaleX)

        .effect()
        .file("jb2a.template_circle.symbol.normal.poison.dark_green")
        .delay(500)
        .attachTo(target)
        .fadeIn(500)
        .fadeOut(500)
        .scaleToObject(1.8 * target.document.texture.scaleX)
        .randomRotation()
        .mask(target)
        .persist()
        .name(`${target.document.name} TrogS`)

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectData);
        })

        .play()
}

export let troglodyte = {
    'stench': stench
}