import {mba} from "../../../helperFunctions.js";

async function bitesAttack({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let target = workflow.targets.first();
    if (mba.checkTrait(target.actor, "ci", "poisoned")) return;
    if (mba.findEffect(target.actor, "Rot Grubs: Poison")) return;
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} RotG Poison` })
    };
    const effectData = {
        'name': "Rot Grubs: Poison",
        'icon': "modules/mba-premades/icons/generic/generic_poison.webp",
        'origin': workflow.item.uuid,
        'description': `
            <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.pAjPUbk2oPUTfva2]{Poisoned} by a swarm of Rot Grubs.</p>
            <p>At the end of each of your turns, you take 1d6 poison damage.</p>
            <p>Whenever you take fire damage, you can repeat the saving throw, ending the effect on a success.</p>
        `,
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Poisoned",
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': 'turn=end, damageType=poison, damageRoll=1d6, damageBeforeSave=true, name=Rot Grubs: Poison, killAnim=true, fastForwardDamage=true',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.monsters.rotGrubs.bitesSave,preTargetDamageApplication',
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
    new Sequence()

        .effect()
        .file("jb2a.smoke.puff.centered.green.2")
        .attachTo(target)
        .scaleToObject(2 * target.document.texture.scaleX)

        .effect()
        .file("jb2a.template_circle.symbol.normal.poison.dark_green")
        .attachTo(target)
        .scaleToObject(1 * target.document.texture.scaleX)
        .delay(500)
        .fadeIn(500)
        .fadeOut(500)
        .randomRotation()
        .mask(target)
        .persist()
        .name(`${target.document.name} RotG Poison`)

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectData)
        })

        .play()
}

async function bitesSave({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.damageDetail?.some(i => i.type === "fire")) return;
    let effect = await mba.findEffect(actor, "Rot Grubs: Poison");
    if (!effect) return;
    let saveRoll = await mba.rollRequest(token, "save", "con");
    if (saveRoll.total < 10) return;
    await mba.removeEffect(effect);
}

export let rotGrubs = {
    'bitesAttack': bitesAttack,
    'bitesSave': bitesSave
}