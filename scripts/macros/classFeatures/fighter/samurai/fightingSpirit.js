import {mba} from "../../../../helperFunctions.js";

export async function fightingSpirit({ speaker, actor, token, character, item, args, scope, workflow }) {
    let fighterLevel = workflow.actor.classes.fighter?.system?.levels;
    if (!fighterLevel) {
        ui.notifications.warn("Actor has no Fighter levels!");
        return;
    }
    let value = "5";
    if (fighterLevel >= 10 && fighterLevel < 15) value = "10";
    else if (fighterLevel >= 15) value = "15";
    let healingRoll = await new Roll(value).roll({ 'async': true });
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ 'name': `${token.document.name} Fighting Spirit`, 'object': token });
    };
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You have advantage on weapon attack rolls until the end of your turn.</p>
        `,
        'duration': {
            'turns': 1
        },
        'changes': [
            {
                'key': 'flags.midi-qol.advantage.attack.mwak',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.advantage.attack.rwak',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
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
        .file("jb2a.energy_strands.in.purple.01.0")
        .attachTo(workflow.token)
        .scaleToObject(1.5)
        .playbackRate(0.9)
        .waitUntilFinished(-700)
        
        .effect()
        .file("jb2a.extras.tmfx.outflow.circle.01")
        .attachTo(workflow.token, { cacheLocation: true, offset: { y: 0 }, gridUnits: true, bindAlpha: false })
        .scaleToObject(1.45, { considerTokenScale: true })
        .scaleIn(0.5, 1000)
        .loopProperty("alphaFilter", "alpha", { from: 0.75, to: 1, duration: 1500, pingPong: true, ease: "easeOutSine" })
        .randomRotation()
        .belowTokens()
        .tint("#5900b3")
        .filter("ColorMatrix", { saturate: -0.2, brightness: 1.2 })
        .persist()
        .name(`${workflow.token.document.name} Fighting Spirit`)

        .effect()
        .file("jb2a.energy_wall.01.circle.500x500.01.loop.purple")
        .attachTo(workflow.token)
        .scaleToObject(1.25)
        .fadeOut(1000)
        .scaleIn(0.5, 1000)
        .belowTokens()
        .playbackRate(0.9)
        .persist()
        .name(`${workflow.token.document.name} Fighting Spirit`)

        .wait(600)

        .thenDo(async () => {
            await mba.createEffect(workflow.actor, effectData);
            await mba.applyWorkflowDamage(workflow.token, healingRoll, "temphp", [workflow.token], undefined, workflow.itemCardId);
        })

        .play()
}