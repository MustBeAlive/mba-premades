import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

//To do: better casting animation

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let targets = Array.from(workflow.targets);
    for (let target of targets) {
        if (mba.checkTrait(target.actor, "ci", "charmed")) await mba.createEffect(target.actor, constants.immunityEffectData);
    }
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!template) return;

    new Sequence()

        .effect()
        .file("jb2a.magic_signs.circle.02.illusion.complete.dark_purple")
        .attachTo(template)
        .scaleToObject(1.1)
        .belowTokens()

        .play()
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    if (!workflow.failedSaves.size) {
        if (template) await template.delete();
        let concEffect = await mba.findEffect(workflow.actor, "Concentrating");
        if (concEffect) await mba.removeCondition(concEffect);
        return;
    }
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} HypPat` })
    }
    let effectData = {
        'name': "Hypnotic Pattern",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.SVd8xu3mTZMqz8fL]{Charmed} by a twisting pattern of colors.</p>
            <p>While @UUID[Compendium.mba-premades.MBA SRD.Item.SVd8xu3mTZMqz8fL]{Charmed} by this spell, you are @UUID[Compendium.mba-premades.MBA SRD.Item.LCcuJNMKrGouZbFJ]{Incapacitated} and have a speed of 0.</p>
            <p>The spell ends early if you take any damage or if someone else uses an action to shake you out of stupor.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Charmed",
                'priority': 20
            },
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Incapacitated",
                'priority': 20
            },
            {
                'key': 'system.attributes.movement.all',
                'mode': 0,
                'value': 0,
                'priority': 20
            },
        ],
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
                    baseLevel: 3,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    for (let target of Array.from(workflow.failedSaves)) {
        new Sequence()

            .effect()
            .file("jb2a.template_circle.symbol.normal.stun.purple")
            .attachTo(target)
            .scaleToObject(1.5)
            .fadeIn(500)
            .fadeOut(2000)
            .filter("ColorMatrix", { hue: 50 })
            .mask()
            .persist()
            .name(`${target.document.name} HypPat`)

            .thenDo(async () => {
                await mba.createEffect(target.actor, effectData);
            })

            .play()
    }
    if (template) await template.delete();
}

export let hypnoticPattern = {
    'cast': cast,
    'item': item
}