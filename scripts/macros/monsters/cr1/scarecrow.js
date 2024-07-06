import {mba} from "../../../helperFunctions.js";

async function attack({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let target = workflow.targets.first();
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} ScF` })
    };
    let effectData = {
        'name': "Scarecrow: Fear",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.oR1wUvem3zVVUv5Q]{Frightened} by Scarecrow until the end of the Scarecrow's next turn.</p>
        `,
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': 'Frightened',
                'priority': 20
            },
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['turnEndSource']
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };
    new Sequence()

        .effect()
        .file("jb2a.icon.fear.dark_orange")
        .attachTo(target)
        .scaleIn(0, 500, { ease: "easeOutQuint" })
        .fadeOut(1000)
        .scaleToObject(1)
        .duration(2000)
        .filter("ColorMatrix", { hue: 120 })
        .playbackRate(1)

        .effect()
        .file("jb2a.extras.tmfx.border.circle.outpulse.01.fast")
        .attachTo(target)
        .scaleToObject(2)

        .thenDo(async () => {
            if (workflow.failedSaves.size && !mba.checkTrait(target.actor, "ci", "frightened")) await mba.createEffect(target.actor, effectData);
        })

        .effect()
        .file("jb2a.markers.fear.dark_orange.03")
        .attachTo(target)
        .scaleToObject(2)
        .delay(500)
        .center()
        .fadeIn(1000)
        .fadeOut(1000)
        .playbackRate(1)
        .filter("ColorMatrix", { hue: 130 })
        .persist()
        .name(`${target.document.name} ScF`)
        .playIf(() => {
            return (workflow.failedSaves.size && !mba.checkTrait(target.actor, "ci", "frightened"));
        })

        .play()
}

async function terrifyingGlare({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} ScTG` })
    };
    let effectData = {
        'name': "Scarecrow: Terrifying Glare",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.oR1wUvem3zVVUv5Q]{Frightened} by Scarecrow's Terrifying Glare until the end of the Scarecrow's next turn.</p>
            <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.jooSbuYlWEhaNpIi]{Paralyzed} while @UUID[Compendium.mba-premades.MBA SRD.Item.oR1wUvem3zVVUv5Q]{Frightened} in this way.</p>
        `,
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': 'Frightened',
                'priority': 20
            },
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': 'Paralyzed',
                'priority': 20
            },
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['turnEndSource']
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };
    new Sequence()

        .effect()
        .file("jb2a.icon.fear.dark_orange")
        .attachTo(target)
        .scaleIn(0, 500, { ease: "easeOutQuint" })
        .fadeOut(1000)
        .scaleToObject(1)
        .duration(2000)
        .filter("ColorMatrix", { hue: 120 })
        .playbackRate(1)

        .effect()
        .file("jb2a.icon.fear.dark_orange")
        .attachTo(target)
        .scaleToObject(3)
        .anchor({ y: 0.45 })
        .scaleIn(0, 500, { ease: "easeOutQuint" })
        .fadeOut(1000)
        .duration(1000)
        .playbackRate(1)
        .filter("ColorMatrix", { hue: 130 })
        .opacity(0.5)

        .effect()
        .file("jb2a.extras.tmfx.border.circle.outpulse.01.fast")
        .attachTo(target)
        .scaleToObject(2)

        .thenDo(async () => {
            if (workflow.failedSaves.size && !mba.checkTrait(target.actor, "ci", "frightened")) await mba.createEffect(target.actor, effectData);
        })

        .effect()
        .file("jb2a.markers.fear.dark_orange.03")
        .attachTo(target)
        .scaleToObject(2)
        .delay(500)
        .center()
        .fadeIn(1000)
        .fadeOut(1000)
        .playbackRate(1)
        .filter("ColorMatrix", { hue: 130 })
        .persist()
        .name(`${target.document.name} ScTG`)
        .playIf(() => {
            return (workflow.failedSaves.size && !mba.checkTrait(target.actor, "ci", "frightened"))
        })

        .play()
}

export let scarecrow = {
    'attack': attack,
    'terrifyingGlare': terrifyingGlare
}