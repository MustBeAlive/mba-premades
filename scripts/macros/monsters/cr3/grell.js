import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function poison({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let target = workflow.targets.first();
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} GrellP` })
    };
    let effectDataPoison = {
        'name': "Grell: Poison",
        'icon': "modules/mba-premades/icons/generic/generic_poison.webp",
        'origin': workflow.item.uuid,
        'description': `
            <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.pAjPUbk2oPUTfva2]{Poisoned} by Grell's Poison and are @UUID[Compendium.mba-premades.MBA SRD.Item.jooSbuYlWEhaNpIi]{Paralyzed} while @UUID[Compendium.mba-premades.MBA SRD.Item.pAjPUbk2oPUTfva2]{Poisoned} in this way.</p>
            <p>You can repeat the saving throw at the end of each of your turns, ending the effect on a success.</p>
        `,
        'duration': {
            'seconds': 60
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
                'value': `turn=end, saveAbility=con, saveDC=11, saveMagic=false, name=Poison: Turn End (DC11), killAnim=true`,
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
    let effectDataGrapple = {
        'name': "Grell: Grapple",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Grappled",
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `actionSave=true, rollType=skill, saveAbility=ath|acr, saveDC=15, saveMagic=false, name=Grapple: Action Save (DC15), killAnim=true`,
                'priority': 20
            }
        ],
    };
    if (mba.getSize(target.actor) < 3) {
        effectDataGrapple.changes = effectDataGrapple.changes.concat(
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Restrained",
                'priority': 20
            },
        );
    }
    if (!mba.findEffect(target.actor, "Grell: Grapple") && !mba.checkTrait(target.actor, "ci", "grappled ")) await mba.createEffect(target.actor, effectDataGrapple);
    if (!mba.findEffect(target.actor, "Grell: Poison") && !mba.checkTrait(target.actor, "ci", "poisoned")) {
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
            .name(`${target.document.name} GrellP`)

            .thenDo(async () => {
                await mba.createEffect(target.actor, effectDataPoison);
            })

            .play()
    }
}

async function attack({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.targets.size) return;
    let effect = await mba.findEffect(workflow.targets.first().actor, "Grell: Grapple");
    if (!effect) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'grellAdvantage', 150);
    if (!queueSetup) return;
    workflow.advantage = true;
    workflow.advReminderAttackAdvAttribution.add("ADV:Grell Grapple");
    queue.remove(workflow.item.uuid);
}

export let grell = {
    'poison': poison,
    'attack': attack
}