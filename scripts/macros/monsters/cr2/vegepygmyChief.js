import {mba} from "../../../helperFunctions.js";

async function sporesCast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let targets = Array.from(workflow.targets).filter(t => mba.raceOrType(t.actor) != "plant").map(t => t.id);
    mba.updateTargets(targets);
    new Sequence()

        .effect()
        .file("jaamod.smoke.poison_cloud")
        .attachTo(workflow.token)
        .size(4, { gridUnits: true })
        .fadeIn(200)
        .fadeOut(1000)
        .scaleIn(0, 1500, { ease: "easeOutCubic" })
        .scaleOut(0, 1500, { ease: "linear" })
        .zIndex(2)
        .filter("ColorMatrix", { hue: 295 })
        .playbackRate(0.7)

        .effect()
        .file("jb2a.fog_cloud.02.green02")
        .attachTo(workflow.token)
        .size(7.6, { gridUnits: true })
        .delay(1500)
        .fadeIn(5000)
        .fadeOut(3000)
        .scaleIn(0, 5000, { ease: "easeOutCubic" })
        .opacity(0.7)
        .zIndex(1)
        .randomRotation()

        .play()
}

async function sporesItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} VGC Poison` })
    };
    let effectData = {
        'name': "Vegepygmy Chief: Poison",
        'icon': "modules/mba-premades/icons/generic/generic_poison.webp",
        'origin': workflow.item.uuid,
        'description': `
            <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.pAjPUbk2oPUTfva2]{Poisoned} by Vegepygmy Chief's Poisonous Spores.</p>
            <p>While @UUID[Compendium.mba-premades.MBA SRD.Item.pAjPUbk2oPUTfva2]{Poisoned} in this way, you take 2d8 poison damage at the start of each of your turns.</p>
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
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `turn=start, damageType=poison, damageRoll=2d8, name=Poison: Turn Start, killAnim=true, fastForwardDamage=true`,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `turn=end, saveAbility=con, saveDC=12, name=Poison: Turn End (DC12), saveMagic=false, killAnim=true`,
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
    for (let target of Array.from(workflow.failedSaves)) {
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
            .name(`${target.document.name} VGC Poison`)
            .playIf(() => {
                return (!mba.checkTrait(target.actor, "ci", "poisoned") && !mba.findEffect(target.actor, "Vegepygmy Chief: Poison"))
            })

            .thenDo(async () => {
                if (!mba.checkTrait(target.actor, "ci", "poisoned") && !mba.findEffect(target.actor, "Vegepygmy Chief: Poison")) await mba.createEffect(target.actor, effectData)
            })

            .play()
    }
}

export let vegepygmyChief = {
    'sporesCast': sporesCast,
    'sporesItem': sporesItem
}