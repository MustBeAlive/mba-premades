import {mba} from "../../../helperFunctions.js";

//change miss part to synthetic item (or check if workflow.apply can prompt to use reaction)

export async function melfAcidArrow({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let level = workflow.castData.castLevel;
    if (!workflow.hitTargets.size) {
        new Sequence()

            .effect()
            .file("jb2a.ranged.04.projectile.01.green")
            .atLocation(token)
            .stretchTo(target)

            .play();

        let damage = Math.floor(workflow.damageRoll.total / 2);
        await mba.applyDamage([target], damage, "acid");
        return;
    }
    async function effectMacroDel() {
        await Sequencer.EffectManager.endEffects({ name: `${token.document.name} Acid Arrow` });
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'changes': [
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `turn=end, damageType=acid, damageRoll=${level}d4, name=Melf's Acid Arrow: Turn End, killAnim=true`,
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

    new Sequence()

        .effect()
        .file("jb2a.ranged.04.projectile.01.green")
        .atLocation(token)
        .stretchTo(target)
        .waitUntilFinished(-1400)

        .thenDo(function () {
            mba.createEffect(target.actor, effectData);
        })

        .effect()
        .file("jb2a.grease.dark_grey.loop")
        .attachTo(target, { offset: { x: 0.25 * target.document.width, y: 0.3 * target.document.width }, gridUnits: true, followRotation: false })
        .randomRotation()
        .scaleToObject(0.4)
        .opacity(0.8)
        .tint("#BEE43E")
        .filter("ColorMatrix", { saturate: 1, hue: 0, brightness: 2 })
        .fadeIn(2000)
        .fadeOut(2000)
        .scaleIn(0, 1500, { ease: "easeOutCubic" })
        .scaleOut(0, 1500, { ease: "easeOutCubic" })
        .mask(target)
        .zIndex(0.1)
        .persist()
        .name(`${target.document.name} Acid Arrow`)

        .effect()
        .delay(100, 1000)
        .file("animated-spell-effects-cartoon.smoke.97")
        .attachTo(target, { offset: { x: 0.25 * target.document.width, y: 0.1 * target.document.width }, gridUnits: true, followRotation: false })
        .scaleToObject(0.4)
        .opacity(0.4)
        .tint("#BEE43E")
        .randomizeMirrorX()
        .fadeIn(500)
        .fadeOut(1000)
        .zIndex(0.2)
        .persist()
        .name(`${target.document.name} Acid Arrow`)

        .effect()
        .file("jb2a.grease.dark_grey.loop")
        .attachTo(target, { offset: { x: -0.4 * target.document.width, y: 0 * target.document.width }, gridUnits: true, followRotation: false })
        .randomRotation()
        .scaleToObject(0.4)
        .opacity(0.8)
        .tint("#BEE43E")
        .filter("ColorMatrix", { saturate: 1, hue: 0, brightness: 2 })
        .fadeIn(2000)
        .fadeOut(2000)
        .scaleIn(0, 1500, { ease: "easeOutCubic" })
        .scaleOut(0, 1500, { ease: "easeOutCubic" })
        .mask(target)
        .zIndex(0.1)
        .persist()
        .name(`${target.document.name} Acid Arrow`)

        .effect()
        .delay(100, 1000)
        .file("animated-spell-effects-cartoon.smoke.97")
        .attachTo(target, { offset: { x: -0.4 * target.document.width, y: -0.2 * target.document.width }, gridUnits: true, followRotation: false })
        .scaleToObject(0.4)
        .opacity(0.4)
        .tint("#BEE43E")
        .randomizeMirrorX()
        .fadeIn(500)
        .fadeOut(1000)
        .zIndex(0.2)
        .persist()
        .name(`${target.document.name} Acid Arrow`)

        .effect()
        .file("jb2a.grease.dark_grey.loop")
        .attachTo(target, { offset: { x: 0.15 * target.document.width, y: -0.5 * target.document.width }, gridUnits: true, followRotation: false })
        .randomRotation()
        .scaleToObject(0.4)
        .opacity(0.8)
        .tint("#BEE43E")
        .filter("ColorMatrix", { saturate: 1, hue: 0, brightness: 2 })
        .fadeIn(2000)
        .fadeOut(2000)
        .scaleIn(0, 1500, { ease: "easeOutCubic" })
        .scaleOut(0, 1500, { ease: "easeOutCubic" })
        .mask(target)
        .zIndex(0.1)
        .persist()
        .name(`${target.document.name} Acid Arrow`)

        .effect()
        .delay(100, 1000)
        .file("animated-spell-effects-cartoon.smoke.97")
        .attachTo(target, { offset: { x: 0.15 * target.document.width, y: -0.55 * target.document.width }, gridUnits: true, followRotation: false })
        .scaleToObject(0.3)
        .opacity(0.4)
        .tint("#BEE43E")
        .randomizeMirrorX()
        .fadeIn(500)
        .fadeOut(1000)
        .zIndex(0.2)
        .persist()
        .name(`${target.document.name} Acid Arrow`)

        .play()
}