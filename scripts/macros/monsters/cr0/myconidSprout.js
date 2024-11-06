import {mba} from "../../../helperFunctions.js";

async function rapportSpores({ speaker, actor, token, character, item, args, scope, workflow }) {
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} RapSpo` })
    }
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>All creatures affected by Rapport Spores can communicate telepathically with one another while they are within 30 feet of each other.</p>
        `,
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
    for (let target of Array.from(workflow.targets)) {
        let type = mba.raceOrType(target.actor);
        if (type === 'construct' || type === 'elemental' || type === 'undead') {
            ChatMessage.create({
                whisper: ChatMessage.getWhisperRecipients("GM"),
                content: `${target.document.name} is unaffected by Rapport Spores (Construct/Elemental/Undead)`,
                speaker: { actor: null, alias: "GM Helper" }
            });
            continue;
        }
        if (target.actor.system.abilities.int.value <= 1) {
            ChatMessage.create({
                whisper: ChatMessage.getWhisperRecipients("GM"),
                content: `${target.document.name} is unaffected by Rapport Spores (INT < 2).`,
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
            .scaleToObject(1.3)
            .fadeIn(1000)
            .fadeOut(1000)
            .mask()
            .persist()
            .name(`${target.document.name} RapSpo`)

            .thenDo(async () => {
                await mba.createEffect(target.actor, effectData);
            })

            .play()
    }
}

export let myconidSprout = {
    'rapportSpores': rapportSpores
}