import {mba} from "../../../helperFunctions.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let targets = Array.from(workflow.targets);
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;

    new Sequence()

        .effect()
        .file("jb2a.magic_signs.circle.02.enchantment.complete.pink")
        .attachTo(template)
        .scaleToObject(1)
        .belowTokens()

        .effect()
        .file("jaamod.misc.burst.3")
        .attachTo(template)
        .scaleToObject(1)
        .delay(2600)
        .filter("ColorMatrix", { hue: 230 })
        .waitUntilFinished(-1800)

        .effect()
        .file("jb2a.template_circle.symbol.out_flow.heart.pink")
        .attachTo(template)
        .scaleToObject(1)
        .fadeIn(1000)
        .fadeOut(1000)
        .playbackRate(0.8)

        .play()

    for (let target of targets) {
        new Sequence()

            .wait(5000)

            .effect()
            .file("jb2a.magic_signs.rune.enchantment.complete.pink")
            .attachTo(target)
            .scaleToObject(1.4)

            .play()
    }
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} CalEmo` })
    };
    let effectDataCalm = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Calm Emotions makes you indifferent about creatures of casters choice that you are hostile toward.</p>
            <p>This indifference ends if you are attacked or harmed by a spell or if you witness any of your friends being harmed.</p>
            <p>When the spell ends, the creature becomes hostile again, unless the DM rules otherwise.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'flags': {
            'dae': {
                'specialDuration': ['isDamaged']
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
    let effectDataSuppress = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Calm Emotions suppresses any effect causing you to be @UUID[Compendium.mba-premades.MBA SRD.Item.SVd8xu3mTZMqz8fL]{Charmed} or @UUID[Compendium.mba-premades.MBA SRD.Item.oR1wUvem3zVVUv5Q]{Frightened}.</p>
            <p>When this spell ends, any suppressed effect resumes, provided that its duration has not expired in the meantime.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'system.traits.ci.value',
                'mode': 2,
                'value': "charmed",
                'priority': 20
            },
            {
                'key': 'system.traits.ci.value',
                'mode': 2,
                'value': "frightened",
                'priority': 20
            },
        ],
        'flags': {
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
    for (let target of Array.from(workflow.failedSaves)) {
        let choices = [["Suppress Charmed/Frightened effect", "suppress"], ["Make target indifferent", "calm"]];
        let selectionType = await mba.dialog("Calm Emotions", choices, `Choose effect type for <u>${target.document.name}</u>:`);
        if (!selectionType) continue;
        new Sequence()

            .effect()
            .file("jb2a.markers.smoke.ring.loop.bluepurple")
            .attachTo(target)
            .scaleToObject(1.55)
            .fadeIn(500)
            .fadeOut(1000)
            .filter("ColorMatrix", { hue: 40 })
            .playbackRate(0.8)
            .persist()
            .name(`${target.document.name} CalEmo`)

            .thenDo(async () => {
                if (selectionType === "suppress") await mba.createEffect(target.actor, effectDataSuppress);
                else if (selectionType === "calm") await mba.createEffect(target.actor, effectDataCalm);
            })

            .play()
    }
}

export let calmEmotions = {
    'cast': cast,
    'item': item
}