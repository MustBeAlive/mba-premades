import {mba} from "../../../helperFunctions.js";

// Maybe make ability to target creatures you are currently unable to see

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    new Sequence()

        .wait(500)

        .effect()
        .file("jb2a.markers.02.purplepink")
        .attachTo(workflow.token)
        .fadeIn(1000)
        .fadeOut(1000)
        .scaleToObject(4)
        .belowTokens()

        .wait(1500)

        .effect()
        .file("jb2a.throwable.launch.missile.04.pinkpurple")
        .attachTo(workflow.token)
        .stretchTo(target, { attachTo: true })
        .zIndex(2)
        .waitUntilFinished()

        .effect()
        .file("jb2a.impact.003.pinkpurple")
        .attachTo(target)
        .scaleToObject(2)

        .play()
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let target = workflow.targets.first();
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} RauPsL`})
    };
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You have failed the save against Raulothim Psychic Lance and are @UUID[Compendium.mba-premades.MBA SRD.Item.LCcuJNMKrGouZbFJ]{Incapacitated} until the start of the caster's next turn.</p>
        `,
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Incapacitated",
                'priority': 20
            },
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ["turnStartSource"],
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 4,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    new Sequence()

        .effect()
        .file("jb2a.markers.simple.001.complete.003.purple")
        .attachTo(target)
        .scaleToObject(3.2)
        .zIndex(1)

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectData);
        })

        .wait(1500)

        .effect()
        .file("jb2a.markers.simple.001.loop.003.purple")
        .attachTo(target)
        .scaleToObject(3.2)
        .fadeOut(1500)
        .zIndex(0)
        .persist()
        .name(`${target.document.name} RauPsL`)

        .play()
}

export let raulothimPsychicLance = {
    'cast': cast,
    'item': item
}