import {mba} from "../../../helperFunctions.js";

async function poison({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let target = workflow.targets.first();
    if (mba.checkTrait(target.actor, "ci", "poisoned")) return;
    if (mba.findEffect(target.actor, "Ettercap: Poison")) return;
    let saveDC = workflow.item.system.save.dc;
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} EttPoi` })
    };
    const effectData = {
        'name': "Ettercap: Poison",
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
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `turn=end, saveAbility=con, saveDC=${saveDC}, saveMagic=false, name=Poison: Turn End (DC${saveDC}), killAnim=true`,
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': false
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
        .name(`${target.document.name} EttPoi`)

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectData)
        })

        .play()
}

async function web({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let target = workflow.targets.first();
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} EttWeb` })
    };
    const effectData = {
        'name': "Ettercap: Web",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.gfRbTxGiulUylAjE]{Restrained} by Ettercap's webbing.</p>
            <p>As an action, you can make a DC 11 Strength check, bursting the webbing on a success.</p>
            <p>The webbing can also be attacked and destroyed (AC 10; hp 5; vulnerability to fire damage; immunity to bludgeoning, poison, and psychic damage).</p>
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
                'value': `actionSave=true, rollType=check, saveAbility=str, saveDC=11, saveMagic=false, name=Web: Action Save (DC11), killAnim=true`,
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
        .name(`${target.document.name} EttWeb`)
        .playIf(() => {
            return (!mba.findEffect(target.actor, "Ettercap: Web") && !mba.checkTrait(target.actor, "ci", "restrained") && mba.getSize(target.actor) < 3);
        })

        .wait(300)

        .thenDo(async () => {
            if (!mba.findEffect(target.actor, "Ettercap: Web") && !mba.checkTrait(target.actor, "ci", "restrained") && mba.getSize(target.actor) < 3) await mba.createEffect(target.actor, effectData);
        })

        .play()
}

export let ettercap = {
    'poison': poison,
    'web': web
}