import {mba} from "../../../helperFunctions.js";

async function deathBurstCast(token, origin) {
    new Sequence()

        .effect()
        .file("jb2a.explosion.08.1200.orange")
        .attachTo(token)
        .size(4.5, { gridUnits: true })
        .playbackRate(0.9)

        .thenDo(async () => {
            await origin.use();
        })

        .play()
}

async function touch({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let target = workflow.targets.first();
    if (mba.findEffect(target.actor, "Magmin: Igniting Touch")) return;
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} MagIT` })
    };
    async function effectMacroTurnStart() {
        let effect = await mbaPremades.helpers.findEffect(actor, "Magmin: Igniting Touch");
        if (!effect) return;
        let choices = [["Yes (Spend Action)", "yes"], ["No (fire damage at the end of the turn)", false]];
        let selection = await mbaPremades.helpers.dialog("Magmin: Igniting Touch", choices, `<b>Do you wish to douse the fire?</b>`);
        if (!selection) return;
        await mbaPremades.helpers.removeEffect(effect);
    };
    const effectData = {
        'name': "Magmin: Igniting Touch",
        'icon': "modules/mba-premades/icons/conditions/burning.webp",
        'origin': workflow.item.uuid,
        'description': `
            <p>You are on fire.</p>
            <p>Until you or someone else takes an Action to douse it, you take 1d6 fire damage at the end of each of your turns.</p>
        `,
        'changes': [
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': 'turn=end, damageType=fire, damageRoll=1d6, damageBeforeSave=true, name=Igniting Touch: Turn End, killAnim=true, fastForwardDamage=true',
                'priority': 20
            },
        ],
        'flags': {
            'dae': {
                'showIcon': true
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                },
                'onTurnStart': {
                    'script': mba.functionToString(effectMacroTurnStart)
                }
            }
        }
    };

    new Sequence()

        .effect()
        .file("jb2a.flames.orange.03.1x1.0")
        .attachTo(target, { offset: { x: 0, y: -0.15 }, gridUnits: true })
        .scaleToObject(1.4)
        .belowTokens(false)
        .opacity(0.8)
        .fadeIn(500)
        .fadeOut(1000)
        .mask()
        .persist()
        .name(`${target.document.name} MagIT`)

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectData);
        })

        .play()
}

export let magmin = {
    'deathBurstCast': deathBurstCast,
    'touch': touch
}