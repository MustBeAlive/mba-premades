import { mba } from "../../../helperFunctions.js";

async function mudBreathCast({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (mba.getSize(workflow.targets.first().actor) > 2) {
        ui.notifications.warn("Target is too big for Mud Breath!");
        return false;
    }
}

async function mudBreathItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    new Sequence()

        .effect()
        .file("jb2a.ranged.04.projectile.01.orange")
        .atLocation(token)
        .stretchTo(target)
        .filter("ColorMatrix", { brightness: 0.2, saturate: 1 })
        .tint("#662e00")
        .playbackRate(0.9)

        .play()

    if (!workflow.failedSaves.size) return;
    new Sequence()

        .effect()
        .file("jb2a.grease.dark_brown.loop")
        .attachTo(target, { offset: { x: 0.25 * target.document.width, y: 0.3 * target.document.width }, gridUnits: true, followRotation: false })
        .randomRotation()
        .scaleToObject(0.5)
        .opacity(0.8)
        .fadeIn(300)
        .fadeOut(500)
        .scaleIn(0, 1500, { ease: "easeOutCubic" })
        .scaleOut(0, 1500, { ease: "easeOutCubic" })
        .zIndex(0.1)
        .mask(target)
        .persist()
        .name(`${target.document.name} Mud Breath`)

        .effect()
        .file("jb2a.grease.dark_brown.loop")
        .attachTo(target, { offset: { x: -0.4 * target.document.width, y: 0 * target.document.width }, gridUnits: true, followRotation: false })
        .randomRotation()
        .scaleToObject(0.5)
        .opacity(0.8)
        .fadeIn(300)
        .fadeOut(500)
        .scaleIn(0, 1500, { ease: "easeOutCubic" })
        .scaleOut(0, 1500, { ease: "easeOutCubic" })
        .zIndex(0.1)
        .mask(target)
        .persist()
        .name(`${target.document.name} Mud Breath`)

        .effect()
        .file("jb2a.grease.dark_brown.loop")
        .attachTo(target, { offset: { x: 0.15 * target.document.width, y: -0.5 * target.document.width }, gridUnits: true, followRotation: false })
        .randomRotation()
        .scaleToObject(0.5)
        .opacity(0.8)
        .fadeIn(300)
        .fadeOut(500)
        .scaleIn(0, 1500, { ease: "easeOutCubic" })
        .scaleOut(0, 1500, { ease: "easeOutCubic" })
        .zIndex(0.1)
        .mask(target)
        .persist()
        .name(`${target.document.name} Mud Breath`)

        .play();

    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Mud Breath` });
    }
    const effectData = {
        'name': "Mud Mephit: Mud Breath",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': 'Restrained',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `turn=end, saveAbility=dex, saveDC=11, saveMagic=false, name=Mud Breath: Action Save, killAnim=true`,
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': false
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };
    await mba.createEffect(target.actor, effectData);
}

async function deathBurstCast(token, origin) {
    new Sequence()

        .effect()
        .file("animated-spell-effects-cartoon.explosions.08")
        .attachTo(token)
        .size(4, { gridUnits: true })
        .playbackRate(0.9)

        .thenDo(async () => {
            await origin.use();
        })

        .play()
}

async function deathBurstItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let targets = Array.from(workflow.failedSaves);
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Mud Breath` });
    }
    const effectData = {
        'name': "Mud Mephit: Death Burst",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': 'Restrained',
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': false,
                'specialDuration': ['turnStart']
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };
    for (let target of targets) {
        new Sequence()

            .effect()
            .file("jb2a.grease.dark_brown.loop")
            .attachTo(target, { offset: { x: 0.25 * target.document.width, y: 0.3 * target.document.width }, gridUnits: true, followRotation: false })
            .randomRotation()
            .scaleToObject(0.5)
            .opacity(0.8)
            .fadeIn(300)
            .fadeOut(500)
            .scaleIn(0, 1500, { ease: "easeOutCubic" })
            .scaleOut(0, 1500, { ease: "easeOutCubic" })
            .zIndex(0.1)
            .mask(target)
            .persist()
            .name(`${target.document.name} Mud Breath`)

            .effect()
            .file("jb2a.grease.dark_brown.loop")
            .attachTo(target, { offset: { x: -0.4 * target.document.width, y: 0 * target.document.width }, gridUnits: true, followRotation: false })
            .randomRotation()
            .scaleToObject(0.5)
            .opacity(0.8)
            .fadeIn(300)
            .fadeOut(500)
            .scaleIn(0, 1500, { ease: "easeOutCubic" })
            .scaleOut(0, 1500, { ease: "easeOutCubic" })
            .zIndex(0.1)
            .mask(target)
            .persist()
            .name(`${target.document.name} Mud Breath`)

            .effect()
            .file("jb2a.grease.dark_brown.loop")
            .attachTo(target, { offset: { x: 0.15 * target.document.width, y: -0.5 * target.document.width }, gridUnits: true, followRotation: false })
            .randomRotation()
            .scaleToObject(0.5)
            .opacity(0.8)
            .fadeIn(300)
            .fadeOut(500)
            .scaleIn(0, 1500, { ease: "easeOutCubic" })
            .scaleOut(0, 1500, { ease: "easeOutCubic" })
            .zIndex(0.1)
            .mask(target)
            .persist()
            .name(`${target.document.name} Mud Breath`)

            .thenDo(async () => {
                await mba.createEffect(target.actor, effectData);
            })

            .play();
    }
}

export let mudMephit = {
    'mudBreathCast': mudBreathCast,
    'mudBreathItem': mudBreathItem,
    'deathBurstCast': deathBurstCast,
    'deathBurstItem': deathBurstItem
}