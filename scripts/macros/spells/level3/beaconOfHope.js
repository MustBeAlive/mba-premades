import {mba} from '../../../helperFunctions.js';
import {queue} from '../../mechanics/queue.js';

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let targets = Array.from(workflow.targets);
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} BoH` })
    };
    let effectData = {
        'name': "Beacon of Hope",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You have advantage on Wisdom saving throws and death saving throws, and regain the maximum number of hit points possible from any healing.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'flags.midi-qol.advantage.ability.save.wis',
                'mode': 5,
                'value': 1,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.advantage.deathSave',
                'mode': 5,
                'value': 1,
                'priority': 20
            },
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 3,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };

    for (let target of targets) {
        let delay1 = 100 + Math.floor(Math.random() * (Math.floor(1000) - Math.ceil(100)) + Math.ceil(100));
        let delay2 = 1000 + delay1;
        let delay3 = 500 + delay2;
        new Sequence()

            .effect()
            .file("jb2a.divine_smite.caster.yellowwhite")
            .attachTo(target)
            .scaleToObject(1.85)
            .delay(delay1)

            .effect()
            .file("jb2a.markers.circle_of_stars.yellowblue")
            .attachTo(target)
            .scaleToObject(1)
            .delay(delay2)
            .fadeIn(500)
            .fadeOut(1000)
            .mask()
            .persist()
            .name(`${target.document.name} BoH`)

            .wait(delay3)

            .thenDo(async () => {
                await mba.createEffect(target.actor, effectData);
            })

            .play()
    }
}

async function hook(token, {item, workflow, ditem}) {
    let effect = mba.findEffect(token.actor, 'Beacon of Hope');
    if (!effect) return;
    if (!workflow.damageRoll) return;
    let defaultDamageType = workflow.defaultDamageType;
    if (defaultDamageType != 'healing') return;
    if (mba.checkTrait(token.actor, 'di', 'healing')) return;
    let newHealingTotal = 0;
    let queueSetup = await queue.setup(workflow.uuid, 'beaconOfHope', 351);
    if (!queueSetup) return;
    for (let i = 0; workflow.damageRoll.terms.length > i; i++) {
        let flavor = workflow.damageRoll.terms[i].flavor;
        let isDeterministic = workflow.damageRoll.terms[i].isDeterministic;
        if (flavor.toLowerCase() === 'healing' && !isDeterministic) {
            newHealingTotal += workflow.damageRoll.terms[i].faces * workflow.damageRoll.terms[i].results.length;
        } else {
            if (!isNaN(workflow.damageRoll.terms[i].total)) {
                newHealingTotal += workflow.damageRoll.terms[i].total;
            }
        }
    }
    if (mba.checkTrait(token.actor, 'dr', 'healing')) newHealingTotal = Math.floor(newHealingTotal / 2);
    let maxHP = token.actor.system.attributes.hp.max;
    ditem.hpDamage = -Math.clamped(newHealingTotal, 0, maxHP - ditem.oldHP);
    ditem.newHP = Math.clamped(ditem.oldHP + newHealingTotal, 0, maxHP);
    ditem.totalDamage = newHealingTotal;
    queue.remove(workflow.uuid);
}

export let beaconOfHope = {
    'item': item,
    'hook': hook
}