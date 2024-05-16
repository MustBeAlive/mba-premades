import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} RoE`, object: token })
    };
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are enfeebled and deal only half damage with weapon attacks that use Strength until the spell ends.</p>
            <p>At the end of each of your turns, you can make a Constitution saving throw. On a success, the spell ends.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `turn=end, saveAbility=con, saveDC=${mba.getSpellDC(workflow.item)}, saveMagic=true, name=Ray of Enfeeblement: Turn End, killAnim=true`,
                'priority': 20
            },
            {
                'key': "flags.midi-qol.onUseMacroName",
                'mode': 0,
                'value': "function.mbaPremades.macros.rayOfEnfeeblement.finesse,postDamageRoll",
                'priority': 20
            }
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

    new Sequence()

        .effect()
        .file("jb2a.scorching_ray.grey.01")
        .attachTo(token)
        .stretchTo(target)
        .filter("ColorMatrix", { brightness: 0 })
        .missed(!workflow.hitTargets.size)
        .playIf(() => {
            return !workflow.hitTargets.size
        })

        .effect()
        .file("jb2a.scorching_ray.grey.01")
        .attachTo(token)
        .stretchTo(target)
        .filter("ColorMatrix", { brightness: 0 })
        .repeats(3, 800)
        .waitUntilFinished(-1000)
        .playIf(() => {
            return workflow.hitTargets.size
        })

        .effect()
        .file("jb2a.token_border.circle.spinning.purple.006")
        .attachTo(target)
        .scaleToObject(2)
        .filter("ColorMatrix", { brightness: 0 })
        .belowTokens()
        .fadeIn(500)
        .fadeOut(1000)
        .persist()
        .name(`${target.document.name} RoE`)
        .playIf(() => {
            return workflow.hitTargets.size
        })

        .thenDo(function () {
            if (workflow.hitTargets.size) mba.createEffect(target.actor, effectData);
        })

        .play()
}

async function finesse({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.isFumble || workflow.item.type != 'weapon') return;
    if (workflow.item.system.properties?.fin) {
        let str = workflow.actor.system.abilities.str.value;
        let dex = workflow.actor.system.abilities.dex.value;
        if (str < dex) return;
    }
    let queueSetup = await queue.setup(workflow.item.uuid, 'rayOfEnfeeblement', 360);
    if (!queueSetup) return;
    let damageRollFormula = 'floor((' + workflow.damageRoll._formula + ') / 2)';
    let damageRoll = await new Roll(damageRollFormula).roll({ async: true });
    await workflow.setDamageRoll(damageRoll);
    queue.remove(workflow.item.uuid);
}

export let rayOfEnfeeblement = {
    'item': item,
    'finesse': finesse
}