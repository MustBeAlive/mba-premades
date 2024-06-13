import {mba} from "../../../helperFunctions.js";

async function cinderBreathCast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    new Sequence()

        .effect()
        .file("jb2a.breath_weapons02.burst.cone.ice.02")
        .attachTo(workflow.token)
        .stretchTo(template)
        .filter("ColorMatrix", { brightness: -0.5, saturate: -1 })
        .tint("#ffffff")

        .play()
}

async function cinderBreathItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    const effectData = {
        'name': "Smoke Mephit: Cinder Breath",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': 'Blinded',
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': false,
                'specialDuration': ['turnEndSource']
            }
        }
    };
    let targets = Array.from(workflow.failedSaves);
    for (let target of targets) await mba.createEffect(target.actor, effectData)
}

async function deathBurstCast(token, origin) {
    new Sequence()

        .effect()
        .file("jb2a.explosion.08.1200.orange")
        .attachTo(token)
        .size(4.5, { gridUnits: true })
        .playbackRate(0.9)
        .filter("ColorMatrix", { saturate: -1, brightness: 0.5 })

        .effect()
        .file("jb2a.darkness.black")
        .atLocation(token)
        .fadeIn(1500)
        .fadeOut(1500)
        .opacity(0.8)
        .zIndex(1)
        .randomRotation()
        .scaleOut(0, 1500, { ease: "linear" })
        .scaleIn(0, 1000, { ease: "easeOutCubic" })
        .size(3.5, { gridUnits: true })
        .persist()
        .name(`Smoke Mephit Death Burst`)

        .thenDo(async () => {
            await origin.use();
        })

        .play()
}

async function deathBurstDel() {
    await Sequencer.EffectManager.endEffects({ name: "Smoke Mephit Death Burst" })
}

export let smokeMephit = {
    'cinderBreathCast': cinderBreathCast,
    'cinderBreathItem': cinderBreathItem,
    'deathBurstCast': deathBurstCast,
    'deathBurstDel': deathBurstDel
}