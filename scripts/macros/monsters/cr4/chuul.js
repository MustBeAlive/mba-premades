import {mba} from "../../../helperFunctions.js";

async function pincer({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let target = workflow.targets.first();
    if (mba.getSize(target.actor) > 3) return;
    let saveDC = workflow.item.system.save.dc;
    let effectDataTarget = {
        'name': `${workflow.token.document.name}: Grapple`,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'changes': [
            {
                'key': 'flags.mba-premades.feature.grapple.origin',
                'mode': 5,
                'value': workflow.token.document.uuid,
                'priority': 20
            },
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Grappled",
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `actionSave=true, rollType=skill, saveAbility=ath|acr, saveDC=${saveDC}, saveMagic=false, name=Grapple: Action Save (DC${saveDC}), killAnim=true`,
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': false
            }
        }
    };
    await new Sequence()

        .effect()
        .file("jb2a.unarmed_strike.no_hit.01.yellow")
        .atLocation(workflow.token)
        .stretchTo(target)
        .playbackRate(0.9)
        .filter("ColorMatrix", { saturate: -1, brightness: 1 })

        .effect()
        .file("jb2a.unarmed_strike.no_hit.01.yellow")
        .atLocation(workflow.token)
        .stretchTo(target)
        .mirrorY()
        .playbackRate(0.9)
        .filter("ColorMatrix", { saturate: -1, brightness: 1 })

        .wait(150)

        .thenDo(async () => {
            if (!mba.findEffect(target.actor, "Grappled")) {
                await mba.createEffect(target.actor, effectDataTarget);
                let distance = await mba.getDistance(workflow.token, target, true);
                if (distance > 5) await mba.pushToken(workflow.token, target, -5);
            }
        })

        .effect()
        .file("jb2a.markers.chain.standard.complete.02.grey")
        .attachTo(target)
        .scaleToObject(2 * target.document.texture.scaleX)
        .fadeIn(500)
        .fadeOut(1000)
        .opacity(0.8)

        .play()
}

async function tentaclesCheck({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!mba.findEffect(workflow.targets.first().actor, "Chuul: Grapple")) {
        ui.notifications.warn("Can only use tentacles on grappled targets!");
        return false;
    }
}

async function tentaclesItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let target = workflow.targets.first();
    if (mba.checkTrait(target.actor, "ci", "poisoned")) return;
    if (mba.findEffect(target.actor, "Chuul: Poison")) return;
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} ChuPo` })
    };
    const effectData = {
        'name': "Chuul: Poison",
        'icon': "modules/mba-premades/icons/generic/generic_poison.webp",
        'origin': workflow.item.uuid,
        'description': `
            <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.pAjPUbk2oPUTfva2]{Poisoned} by Chull's Poisonous Tentacles and are @UUID[Compendium.mba-premades.MBA SRD.Item.jooSbuYlWEhaNpIi]{Paralyzed} while @UUID[Compendium.mba-premades.MBA SRD.Item.pAjPUbk2oPUTfva2]{Poisoned} in this way.</p>
            <p>You can repeat the saving throw at the end of each of your turns, ending the effect on a success.</p>
        `,
        'duration': {
            'seconds': 86400
        },
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Poisoned",
                'priority': 20
            },
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Paralyzed",
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
        .name(`${target.document.name} ChuPo`)

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectData);
        })

        .play()
}

export let chuul = {
    'pincer': pincer,
    'tentaclesCheck': tentaclesCheck,
    'tentaclesItem': tentaclesItem
}