import {mba} from "../../../helperFunctions.js";

async function mummyRot({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let target = workflow.targets.first();
    if (mba.findEffect(target.actor, "Mummy Rot")) return;
    let mummyRot = game.Gametime.doEvery({ day: 1 }, async (actorUuid) => {
        const tokenOrActor = await fromUuid(actorUuid);
        let actor;
        if (tokenOrActor instanceof CONFIG.Actor.documentClass) actor = tokenOrActor;
        if (tokenOrActor instanceof CONFIG.Token.documentClass) actor = tokenOrActor.actor;
        if (!actor) return;
        let effect = await mbaPremades.helpers.findEffect(actor, "Mummy Rot");
        if (!effect) return;
        let penaltyRoll = await new Roll(`3d6`).roll({ 'async': true });
        await MidiQOL.displayDSNForRoll(penaltyRoll);
        let oldPenalty = effect.flags['mba-premades']?.penalty || 0;
        let newPenalty = oldPenalty + penaltyRoll.total;
        let updates = {
            'changes': [
                {
                    'key': 'system.traits.di.value',
                    'mode': 0,
                    'value': 'healing',
                    'priority': 20
                },
                {
                    'key': 'system.attributes.hp.max',
                    'mode': 2,
                    'value': `-${newPenalty}`,
                    'priority': 20
                },
            ],
            'flags': {
                'mba-premades': {
                    'actorUuid': target.document.uuid,
                    'eventId': mummyRot,
                    'isCurse': true,
                    'greaterRestoration': true,
                    'healthReduction': true,
                    'lesserRestoration': false,
                    'name': "Mummy Rot",
                    'penalty': newPenalty
                }
            }
        };
        await mbaPremades.helpers.updateEffect(effect, updates);
        await mbaPremades.helpers.applyDamage([tokenOrActor], penaltyRoll.total, "none"); // might not work
    }, target.document.uuid);
    let effectData = {
        'name': "Mummy Rot",
        'icon': "modules/mba-premades/icons/generic/infernal_wound.webp",
        'origin': workflow.item.uuid,
        'changes': [
            {
                'key': 'system.traits.di.value',
                'mode': 0,
                'value': 'healing',
                'priority': 20
            },
        ],
        'flags': {
            'mba-premades': {
                'actorUuid': target.document.uuid,
                'eventId': mummyRot,
                'isCurse': true,
                'greaterRestoration': true,
                'healthReduction': true,
                'lesserRestoration': false,
                'name': "Mummy Rot",
                'originalMax': target.actor.system.attributes.hp.max,
            }
        }
    };
    await mba.createEffect(target.actor, effectData);
}

async function dreadfulGlare({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let saveResult = workflow.saveResults[0].total;
    let saveDC = workflow.item.system.save.dc;
    let description = `<p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.oR1wUvem3zVVUv5Q]{Frightened} by Mummy's Dreadfl Glare until the start of the Mummy's next turn.</p>`;
    let changes = [
        {
            'key': 'macro.CE',
            'mode': 0,
            'value': 'Frightened',
            'priority': 20
        }, 
    ];
    if (saveResult + 5 <= saveDC) {
        description = `
            <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.oR1wUvem3zVVUv5Q]{Frightened} by Mummy's Dreadfl Glare until the start of the Mummy's next turn.</p>
            <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.jooSbuYlWEhaNpIi]{Paralyzed} while @UUID[Compendium.mba-premades.MBA SRD.Item.oR1wUvem3zVVUv5Q]{Frightened} in this way.</p>
        `;
        changes = [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': 'Frightened',
                'priority': 20
            },
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': 'Paralyzed',
                'priority': 20
            },
        ];
    }
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} MumDG` })
        let effectDataImmune = {
            'name': "Mummy: Dreadful Glare Immune",
            'icon': "modules/mba-premades/icons/generic/gaze_immunity.webp",
            'description': `
                <p>You are immune to Mummy's Dreadful Glare for the next 24 hours.</p>
            `,
            'duration': {
                'seconds': 86400
            }
        };
        await mbaPremades.helpers.createEffect(token.actor, effectDataImmune);
    };
    let effectData = {
        'name': "Mummy: Dreadful Glare",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': description,
        'changes': changes,
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['turnStartSource']
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };
    let effectDataImmune = {
        'name': "Mummy: Dreadful Glare Immune",
        'icon': "modules/mba-premades/icons/generic/gaze_immunity.webp",
        'description': `
            <p>You are immune to Mummy's Dreadful Glare for the next 24 hours.</p>
        `,
        'duration': {
            'seconds': 86400
        }
    };
    new Sequence()

        .effect()
        .file("jb2a.icon.fear.dark_orange")
        .attachTo(target)
        .scaleIn(0, 500, { ease: "easeOutQuint" })
        .fadeOut(1000)
        .scaleToObject(1)
        .duration(2000)
        .playbackRate(1)

        .effect()
        .file("jb2a.icon.fear.dark_orange")
        .attachTo(target)
        .scaleToObject(3)
        .anchor({ y: 0.45 })
        .scaleIn(0, 500, { ease: "easeOutQuint" })
        .fadeOut(1000)
        .duration(1000)
        .playbackRate(1)
        .opacity(0.5)

        .effect()
        .file("jb2a.extras.tmfx.border.circle.outpulse.01.fast")
        .attachTo(target)
        .scaleToObject(2)

        .thenDo(async () => {
            if (workflow.failedSaves.size && !mba.findEffect(target.actor, "Mummy: Dreadful Glare Immune") && !mba.checkTrait(target.actor, "ci", "frightened")) {
                await mba.createEffect(target.actor, effectData);
            }
            else if (workflow.saves.size) await mba.createEffect(target.actor, effectDataImmune);
        })

        .effect()
        .file("jb2a.markers.fear.dark_orange.03")
        .attachTo(target)
        .scaleToObject(2)
        .delay(500)
        .center()
        .fadeIn(1000)
        .fadeOut(1000)
        .playbackRate(1)
        .persist()
        .name(`${target.document.name} MumDG`)
        .playIf(() => {
            return (workflow.failedSaves.size && !mba.findEffect(target.actor, "Mummy: Dreadful Glare Immune") && !mba.checkTrait(target.actor, "ci", "frightened"))
        })

        .play()
}

export let mummy = {
    'mummyRot': mummyRot,
    'dreadfulGlare': dreadfulGlare
}