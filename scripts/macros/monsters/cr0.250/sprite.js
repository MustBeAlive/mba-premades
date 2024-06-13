import {mba} from "../../../helperFunctions.js";

async function poi5({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    if (!workflow.failedSaves.size) return;
    let target = workflow.targets.first();
    if (mba.checkTrait(target.actor, "ci", "poisoned")) return;
    if (mba.findEffect(target.actor, "Sprite: Poison")) return;
    let saveResult = workflow.saveResults[0].total;
    let saveDC = workflow.item.system.save.dc;
    const effectData = {
        'name': "Sprite: Poison",
        'icon': "modules/mba-premades/icons/generic/generic_poison.webp",
        'origin': workflow.item.uuid,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Poisoned",
                'priority': 20
            }
        ]
    };
    await mba.createEffect(target.actor, effectData);
    if (saveResult + 5 <= saveDC) { // this whole block is just cringe
        if (mba.findEffect(target.actor, "Unconscious")) return;
        await mba.addCondition(target.actor, "Unconscious");
        let effect1 = await mba.findEffect(target.actor, "Unconscious");
        let effect2 = await mba.findEffect(target.actor, "Sprite: Poison");
        let updates1 = {
            'flags': {
                'dae': {
                    'specialDuration': ['isDamaged']
                }
            }
        };
        let updates2 = {
            'description': `
                <p>You failed save againt Sprite Poison by 5 or more, and become unconscious for the duration.</p>
                <p>You will wake up from this slumber if you take damage or another creature uses an action to shake you awake.</p>
            `
        }
        await mba.updateEffect(effect1, updates1);
        await mba.updateEffect(effect2, updates2);
    }
}

async function heartSight({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    new Sequence()

        .effect()
        .file("jb2a.template_circle.symbol.out_flow.heart.pink")
        .scaleIn(0, 1000, { ease: "easeOutQuint" })
        .fadeOut(2000)
        .atLocation(target)
        .belowTokens()
        .duration(3000)
        .scaleToObject(3)

        .effect()
        .file("jb2a.icon.heart.pink")
        .atLocation(target)
        .scaleIn(0, 500, { ease: "easeOutQuint" })
        .fadeOut(1000)
        .scaleToObject(1)
        .atLocation(target)
        .duration(2000)
        .attachTo(target)
        .playbackRate(1)

        .effect()
        .file("jb2a.icon.heart.pink")
        .atLocation(target)
        .scaleToObject(3)
        .anchor({ y: 0.45 })
        .scaleIn(0, 500, { ease: "easeOutQuint" })
        .fadeOut(1000)
        .atLocation(target)
        .duration(1000)
        .attachTo(target)
        .playbackRate(1)
        .opacity(0.5)

        .effect()
        .file("jb2a.extras.tmfx.border.circle.outpulse.01.fast")
        .atLocation(target)
        .scaleToObject(2)

        .play()

    let type = mba.raceOrType(target.actor);
    if (type != "celestial" && type != "fiend" && type != "undead") return;
    const effectData = {
        'name': 'Save: Fail',
        'icon': 'modules/mba-premades/icons/generic/generic_debuff.webp',
        'description': "You automatically fail the next save you make.",
        'duration': {
            'turns': 1
        },
        'changes': [
            {
                'key': 'flags.midi-qol.fail.ability.save.all',
                'mode': 0,
                'value': 1,
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'specialDuration': ["isSave"]
            },
            'mba-premades': {
                'effect': {
                    'noAnimation': true
                }
            }
        }
    };
    await mba.createEffect(target.actor, effectData);
}

export let sprite = {
    'poi5': poi5,
    'heartSight': heartSight
}