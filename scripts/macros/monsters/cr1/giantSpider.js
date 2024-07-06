import {mba} from "../../../helperFunctions.js";

async function web({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let target = workflow.targets.first();
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} GSWeb` })
    };
    const effectData = {
        'name': "Giant Spider: Web",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.gfRbTxGiulUylAjE]{Restrained} by Giant Spider's webbing.</p>
            <p>As an action, you can make a DC 12 Strength check, bursting the webbing on a success.</p>
            <p>The webbing can also be attacked and destroyed (AC: 10; HP: 5; vulnerability to fire damage; immunity to bludgeoning, poison, and psychic damage).</p>
        `,
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': `Restrained`,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `actionSave=true, rollType=check, saveAbility=str, saveDC=12, saveMagic=false, name=Web: Action Save (DC12), killAnim=true`,
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
        .file("animated-spell-effects-cartoon.air.bolt.ray")
        .attachTo(workflow.token)
        .stretchTo(target)

        .effect()
        .file("jb2a.web.01")
        .delay(500)
        .attachTo(target)
        .fadeIn(500)
        .fadeOut(1000)
        .opacity(0.6)
        .mask()
        .persist()
        .name(`${target.document.name} GSWeb`)
        .playIf(() => {
            return (!mba.findEffect(target.actor, "Giant Spider: Web") && !mba.checkTrait(target.actor, "ci", "restrained"));
        })

        .wait(300)

        .thenDo(async () => {
            if (!mba.findEffect(target.actor, "Giant Spider: Web") && !mba.checkTrait(target.actor, "ci", "restrained")) await mba.createEffect(target.actor, effectData);
        })

        .play()
}

export let giantSpider = {
    'web': web
}