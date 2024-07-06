import {mba} from "../../../helperFunctions.js";

async function poi5({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    if (!workflow.failedSaves.size) return;
    let target = workflow.targets.first();
    if (mba.findEffect(target.actor, "Homunculus: Poison")) return;
    if (mba.checkTrait(target.actor, "ci", "poisoned")) return;
    let saveResult = workflow.saveResults[0].total;
    let saveDC = workflow.item.system.save.dc;
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Hom Poison` })
    };
    const effectData = {
        'name': "Homunculus: Poison",
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
        .name(`${target.document.name} Hom Poison`)

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectData)
        })

        .play()

    if (saveResult + 5 <= saveDC) {
        if (mba.findEffect(target.actor, "Unconscious")) return;
        let timeRoll = await new Roll('1d10').roll({ 'async': true });
        await MidiQOL.displayDSNForRoll(timeRoll);
        timeRoll.toMessage({
            rollMode: 'roll',
            speaker: { 'alias': name },
            flavor: workflow.item.name
        });
        let duration = 60 * timeRoll.total;
        await mba.addCondition(target.actor, "Unconscious");
        let effect1 = await mba.findEffect(target.actor, "Unconscious");
        let effect2 = await mba.findEffect(target.actor, "Homunculus: Poison");
        let updates1 = {
            'flags': {
                'dae': {
                    'specialDuration': ['isDamaged']
                }
            }
        };
        let updates2 = {
            'description': `
                <p>You failed save againt Homunculus Poison by 5 or more, and become @UUID[Compendium.mba-premades.MBA SRD.Item.kIUR1eRcTTtaMFao]{Unconscious} for the duration.</p>
                <p>You will wake up from this slumber if you take damage or another creature uses an action to shake you awake.</p>
            `,
            'duration': {
                'seconds': duration
            }
        };
        await mba.updateEffect(effect1, updates1);
        await mba.updateEffect(effect2, updates2);
    }
}

export let homunculus = {
    'poi5': poi5
}