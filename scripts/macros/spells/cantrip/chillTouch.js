import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    if (!workflow.hitTargets.size) {
        let offsetX = Math.floor(Math.random() * (Math.floor(2) - Math.ceil(0) + 1) + Math.ceil(0));
        if (offsetX === 0) offsetX = 1;
        let offsetY = Math.floor(Math.random() * (Math.floor(2) - Math.ceil(0) + 1) + Math.ceil(0));
        if (offsetY === 0) offsetY = 1;
        new Sequence()

            .effect()
            .file("jb2a.spell_projectile.skull.pinkpurple")
            .attachTo(workflow.token)
            .stretchTo(target, { offset: { x: offsetX, y: offsetY }, gridUnits: true })
            .filter("ColorMatrix", { hue: 160 })

            .play()

        return;
    }
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} ChiTou` })
    };
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are unable to regain hit points until the start of the caster's next turn</p>
            <p>If you are Undead, you have disadvantage on attack rolls against the caster of Chill Touch cantrip until the end of his next turn.</p>
        `,
        'changes': [
            {
                'key': 'system.traits.di.value',
                'mode': 0,
                'value': 'healing',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.chillTouch.attack,preAttackRoll',
                'priority': 20
            },
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['turnEndSource']
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 0,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    new Sequence()

        .effect()
        .file("jb2a.spell_projectile.skull.pinkpurple")
        .attachTo(workflow.token)
        .stretchTo(target)
        .filter("ColorMatrix", { hue: 160 })
        .waitUntilFinished(-1600)

        .effect()
        .file("jb2a.markers.skull.purple.03")
        .attachTo(target)
        .scaleToObject(1.7)
        .filter("ColorMatrix", { hue: 170 })
        .fadeIn(500)
        .fadeOut(1000)
        .persist()
        .name(`${target.document.name} ChiTou`)

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectData);
        })

        .play()
}

async function attack({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.targets.size != 1) return;
    let type = mba.raceOrType(workflow.actor);
    if (type.toLowerCase() != 'undead') return;
    let effect = mba.findEffect(workflow.actor, 'Chill Touch');
    if (!effect) return;
    let sourceActor = await fromUuid(effect.origin);
    let sourceActorId = sourceActor.actor.id;
    if (workflow.targets.first().actor.id != sourceActorId) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'chillTouch', 50);
    if (!queueSetup) return;
    workflow.disadvantage = true;
    workflow.advReminderAttackAdvAttribution.add('DIS: Chill Touch');
    queue.remove(workflow.item.uuid);
}

export let chillTouch = {
    'item': item,
    'attack': attack
}