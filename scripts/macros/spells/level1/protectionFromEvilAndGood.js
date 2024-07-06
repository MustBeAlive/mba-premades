import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    async function effectMacroDel() {
        new Sequence()

            .effect()
            .file("jb2a.shield.02.outro_explode.purple")
            .attachTo(token)
            .scaleToObject(1.7 * token.document.texture.scaleX)
            .waitUntilFinished(-500)

            .thenDo(function () {
                Sequencer.EffectManager.endEffects({ name: `${token.document.name} PrFEAG` })
            })

            .play()
    };
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are protected from aberrations, celestials, elementals, fey, fiends and undead.</p>
            <p>Creatures of those types have disadvantage on attack rolls against you. You also can't be @UUID[Compendium.mba-premades.MBA SRD.Item.SVd8xu3mTZMqz8fL]{Charmed}, @UUID[Compendium.mba-premades.MBA SRD.Item.oR1wUvem3zVVUv5Q]{Frightened}, or possessed by them.</p>
            <p>If you are already @UUID[Compendium.mba-premades.MBA SRD.Item.SVd8xu3mTZMqz8fL]{Charmed}, @UUID[Compendium.mba-premades.MBA SRD.Item.oR1wUvem3zVVUv5Q]{Frightened}, or possessed by such a creature, you have advantage on any new saving throw against the relevant effect.</p>
        `,
        'duration': {
            'seconds': 600
        },
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 1,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };

    new Sequence()

        .wait(500)

        .effect()
        .file("jb2a.shield.02.intro.purple")
        .attachTo(target)
        .scaleToObject(1.7 * target.document.texture.scaleX)
        .opacity(0.8)
        .playbackRate(0.8)

        .effect()
        .file("jb2a.shield.02.loop.purple")
        .delay(600)
        .fadeIn(500)
        .attachTo(target)
        .scaleToObject(1.7 * target.document.texture.scaleX)
        .opacity(0.8)
        .playbackRate(0.8)
        .persist()
        .name(`${target.document.name} PrFEAG`)

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectData)
        })

        .play()

}

async function hook(workflow) {
    if (workflow.targets.size != 1 || workflow.disadvantage) return;
    let target = workflow.targets.first();
    let targetEffect = mba.findEffect(target.actor, 'Protection from Evil and Good');
    if (!targetEffect) return;
    let actorRace = mba.raceOrType(workflow.actor);
    let races = ['aberration', 'celestial', 'elemental', 'fey', 'fiend', 'undead'];
    let queueSetup = await queue.setup(workflow.item.uuid, 'protectionFromEvilAndGood', 49);
    if (!queueSetup) return;
    if (!races.includes(actorRace)) return;
    workflow.disadvantage = true;
    workflow.advReminderAttackAdvAttribution.add('DIS: Protection From Evil And Good');
    queue.remove(workflow.item.uuid);
}

export let protectionFromEvilAndGood = {
    'item': item,
    'hook': hook
}