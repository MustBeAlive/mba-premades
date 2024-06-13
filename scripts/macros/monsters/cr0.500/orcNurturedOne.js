import {mba} from "../../../helperFunctions.js";

async function corruptedCarrierCast( token, origin ) {
    new Sequence()

        .effect()
        .file("jb2a.explosion.green.3")
        .attachTo(token)
        .size(5.8, { gridUnits: true })
        .playbackRate(0.9)

        .effect()
        .file("animated-spell-effects-cartoon.air.explosion.green")
        .attachTo(token)
        .delay(300)
        .size(5.8, { gridUnits: true })
        .playbackRate(0.9)

        .thenDo(async () => {
            await origin.use();
        })

        .play()
}

async function corruptedCarrierItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let targets = Array.from(workflow.failedSaves);
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Orc Nurtured One Poison` })
    }
    const effectData = {
        'name': "Orc Nurtured One: Poison",
        'icon': "modules/mba-premades/icons/generic/generic_poison.webp",
        'origin': workflow.item.uuid,
        'description': `
            <p>You are poisoned by Orc Nurtured One's Corruption.</p>
            <p>While poisoned by this effect, a you are unable to regain hit points.</p>
            <p>You can repeat the saving throw at the end of each of your turns, ending the effect on a success.</p>
        `,
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': `Poisoned`,
                'priority': 20
            },
            {
                'key': 'system.traits.di.value',
                'mode': 0,
                'value': `healing`,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `turn=end, saveAbility=con, saveDC=13, saveMagic=false, name=Poison: Turn End (DC13), killAnim=true`,
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };
    for (let target of targets) {
        if (mba.checkTrait(target.actor, "ci", "poisoned")) continue;
        if (mba.findEffect(target.actor, "Orc Nurtured One: Poison")) continue;
        new Sequence()

            .effect()
            .file("jb2a.smoke.puff.centered.green.2")
            .attachTo(target)
            .scaleToObject(1.5)

            .effect()
            .file("jb2a.template_circle.symbol.normal.poison.dark_green")
            .attachTo(target)
            .scaleToObject(1.8 * target.document.texture.scaleX)
            .delay(500)
            .fadeIn(500)
            .fadeOut(500)
            .randomRotation()
            .mask()
            .persist()
            .name(`${target.document.name} Orc Nurtured One Poison`)

            .thenDo(async () => {
                await mba.createEffect(target.actor, effectData)
            })

            .play()
    }
}

async function corruptedVengeance({ speaker, actor, token, character, item, args, scope, workflow }) {
    await mba.applyDamage([workflow.actor], workflow.actor.system.attributes.hp.value, 'none');
}


export let orcNurturedOne = {
    'corruptedCarrierCast': corruptedCarrierCast,
    'corruptedCarrierItem': corruptedCarrierItem,
    'corruptedVengeance': corruptedVengeance
}