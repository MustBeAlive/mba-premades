import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

export async function melfAcidArrow({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let level = workflow.castData.castLevel;
    let damageFormula = `${(level + 2)}d4[acid]`;
    let overtimeFormula = `${level}d4[acid]`;
    if (!workflow.hitTargets.size) damageFormula = `min(${damageFormula} / 2)`;
    async function effectMacroDel() {
        await Sequencer.EffectManager.endEffects({ name: `${token.document.name} Acid Arrow` });
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>At the end of your next turn, you will be damaged by Melf's Acid Arrow.</p>
        `,
        'changes': [
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `turn=end, damageType=acid, damageRoll=${overtimeFormula}, name=Melf's Acid Arrow: Turn End, killAnim=true, fastForwardDamage=true`,
                'priority': 20
            },
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['turnEnd']
            },
            'effectmacro': {
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
    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Spell Features', "Melf's Acid Arrow: Damage");
    if (!featureData) {
        ui.notifications.warn("Unable to find item in the compendium! (Melf's Acid Arrow: Damage)");
        return;
    }
    delete featureData._id;
    featureData.system.damage.parts[0][0] = damageFormula;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([target.document.uuid]);
    new Sequence()

        .effect()
        .file("jb2a.ranged.04.projectile.01.green")
        .atLocation(token)
        .stretchTo(target)
        .waitUntilFinished(-1400)

        .thenDo(function () {
            MidiQOL.completeItemUse(feature, config, options);
            if (workflow.hitTargets.size) mba.createEffect(target.actor, effectData);
        })

        .effect()
        .file("jb2a.grease.dark_grey.loop")
        .attachTo(target, { offset: { x: 0.25 * target.document.width, y: 0.3 * target.document.width }, gridUnits: true, followRotation: false })
        .scaleToObject(0.4)
        .fadeIn(2000)
        .fadeOut(2000)
        .scaleIn(0, 1500, { ease: "easeOutCubic" })
        .scaleOut(0, 1500, { ease: "easeOutCubic" })
        .randomRotation()
        .opacity(0.8)
        .tint("#BEE43E")
        .filter("ColorMatrix", { saturate: 1, hue: 0, brightness: 2 })
        .mask(target)
        .zIndex(0.1)
        .persist()
        .name(`${target.document.name} Acid Arrow`)
        .playIf(() => {
            return workflow.hitTargets.size
        })

        .effect()
        .file("animated-spell-effects-cartoon.smoke.97")
        .attachTo(target, { offset: { x: 0.25 * target.document.width, y: 0.1 * target.document.width }, gridUnits: true, followRotation: false })
        .scaleToObject(0.4)
        .delay(100, 1000)
        .fadeIn(500)
        .fadeOut(1000)
        .opacity(0.4)
        .tint("#BEE43E")
        .randomizeMirrorX()
        .zIndex(0.2)
        .persist()
        .name(`${target.document.name} Acid Arrow`)
        .playIf(() => {
            return workflow.hitTargets.size
        })

        .effect()
        .file("jb2a.grease.dark_grey.loop")
        .attachTo(target, { offset: { x: -0.4 * target.document.width, y: 0 * target.document.width }, gridUnits: true, followRotation: false })
        .scaleToObject(0.4)
        .fadeIn(2000)
        .fadeOut(2000)
        .scaleIn(0, 1500, { ease: "easeOutCubic" })
        .scaleOut(0, 1500, { ease: "easeOutCubic" })
        .opacity(0.8)
        .tint("#BEE43E")
        .filter("ColorMatrix", { saturate: 1, hue: 0, brightness: 2 })
        .randomRotation()
        .mask(target)
        .zIndex(0.1)
        .persist()
        .name(`${target.document.name} Acid Arrow`)
        .playIf(() => {
            return workflow.hitTargets.size
        })

        .effect()
        .file("animated-spell-effects-cartoon.smoke.97")
        .attachTo(target, { offset: { x: -0.4 * target.document.width, y: -0.2 * target.document.width }, gridUnits: true, followRotation: false })
        .scaleToObject(0.4)
        .delay(100, 1000)
        .fadeIn(500)
        .fadeOut(1000)
        .opacity(0.4)
        .tint("#BEE43E")
        .randomizeMirrorX()
        .zIndex(0.2)
        .persist()
        .name(`${target.document.name} Acid Arrow`)
        .playIf(() => {
            return workflow.hitTargets.size
        })

        .effect()
        .file("jb2a.grease.dark_grey.loop")
        .attachTo(target, { offset: { x: 0.15 * target.document.width, y: -0.5 * target.document.width }, gridUnits: true, followRotation: false })
        .scaleToObject(0.4)
        .fadeIn(2000)
        .fadeOut(2000)
        .scaleIn(0, 1500, { ease: "easeOutCubic" })
        .scaleOut(0, 1500, { ease: "easeOutCubic" })
        .opacity(0.8)
        .tint("#BEE43E")
        .filter("ColorMatrix", { saturate: 1, hue: 0, brightness: 2 })
        .randomRotation()
        .mask(target)
        .zIndex(0.1)
        .persist()
        .name(`${target.document.name} Acid Arrow`)
        .playIf(() => {
            return workflow.hitTargets.size
        })

        .effect()
        .file("animated-spell-effects-cartoon.smoke.97")
        .attachTo(target, { offset: { x: 0.15 * target.document.width, y: -0.55 * target.document.width }, gridUnits: true, followRotation: false })
        .scaleToObject(0.3)
        .delay(100, 1000)
        .fadeIn(500)
        .fadeOut(1000)
        .opacity(0.4)
        .tint("#BEE43E")
        .randomizeMirrorX()
        .zIndex(0.2)
        .persist()
        .name(`${target.document.name} Acid Arrow`)
        .playIf(() => {
            return workflow.hitTargets.size
        })

        .play()
}