import {mba} from "../../../helperFunctions.js";

async function net({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first()
    if (!workflow.hitTargets.size) return;
    if (mba.getSize(target.actor) > 3) {
        ui.notifications.warn("Target is to big to be caught in the Net!");
        return;
    }
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} WeigNet` });
    }
    const effectData = {
        'name': "Frost Giant: Weighted Net",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.gfRbTxGiulUylAjE]{Restrained} by the Weighted Net.</p>
            <p>You can attempt to free yourself by making a Strength Ability Check (DC17).</p>
            <p>Another creature can make this check for you, or can deal at least 15 slashing damage to the net (AC12) to achieve same goal.</p>
        `,
        'changes': [
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `actionSave=true, rollType=check, saveAbility=str, saveDC=17, saveMagic=false, name=Net: Action Save (DC17), killAnim=true`,
                'priority': 20
            },
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': 'Restrained',
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
        .file("jaamod.traps.trap_net")
        .attachTo(target)
        .scaleToObject(1.5 * target.document.texture.scaleX)
        .fadeOut(500)
        .persist()
        .noLoop()
        .name(`${target.document.name} WeigNet`)
        .playIf(() => {
            return (!mba.checkTrait(target.actor, "ci", "restrained") && !mba.findEffect(target.actor, "Frost Giant: Weighted Net"))
        })

        .wait(1000)

        .thenDo(async () => {
            if (!mba.checkTrait(target.actor, "ci", "restrained") && !mba.findEffect(target.actor, "Frost Giant: Weighted Net")) {
                await mba.createEffect(target.actor, effectData);
            }
        })

        .play()
}

export let frostGiant = {
    'net': net
}