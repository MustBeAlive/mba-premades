import {mba} from "../../../helperFunctions.js";

export async function rapportSpores({ speaker, actor, token, character, item, args, scope, workflow }) {
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Rapport Spores` })
    }
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': "All creatures affected by Rapport Spores can communicate telepathically with one another while they are within 30 feet of each other.",
        'duration': {
            'seconds': 3600
        },
        'changes': [
            {
                'key': 'system.traits.languages.custom',
                'mode': 0,
                'value': "Telepathy (30 ft.)",
                'priority': 20
            }
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };
    let targets = Array.from(workflow.targets);
    for (let target of targets) {
        let type = mba.raceOrType(target.actor);
        if (type === 'constuct' || type === 'elemental' || type === 'undead') {
            ChatMessage.create({
                whisper: ChatMessage.getWhisperRecipients("GM"),
                content: target.document.name + ` is unaffected by Rapport Spores (Construct/Elemental/Undead).`,
                speaker: { actor: null, alias: "GM Helper" }
            });
            continue;
        }
        if (target.actor.system.abilities.int.value <= 1) {
            ChatMessage.create({
                whisper: ChatMessage.getWhisperRecipients("GM"),
                content: target.document.name + ` is unaffected by Rapport Spores (INT < 2).`,
                speaker: { actor: null, alias: "GM Helper" }
            });
            continue;
        }
        let hasRapport = mba.findEffect(target.actor, 'Rapport Spores');
        if (hasRapport) await mba.removeEffect(hasRapport);
        new Sequence()

            .effect()
            .file("jb2a.particles.outward.purple.01.02")
            .attachTo(target)
            .scaleToObject(1)
            .fadeIn(1000)
            .fadeOut(1000)
            .mask()
            .persist()
            .name(`${target.document.name} Rapport Spores`)

            .thenDo(async () => {
                await mba.createEffect(target.actor, effectData);
            })

            .play()
    }
}

export let myconidSprout = {
    'rapportSpores': rapportSpores
}