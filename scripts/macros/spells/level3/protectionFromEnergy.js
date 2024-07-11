import {mba} from "../../../helperFunctions.js";

export async function protectionFromEnergy({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let choices = [
        ['Acid', 'Acid', "modules/mba-premades/icons/spells/level3/protection_from_energy_acid.webp"],
        ['Cold', 'Cold', "modules/mba-premades/icons/spells/level3/protection_from_energy_cold.webp"],
        ['Fire', 'Fire', "modules/mba-premades/icons/spells/level3/protection_from_energy_fire.webp"],
        ['Lightning', 'Lightning', "modules/mba-premades/icons/spells/level3/protection_from_energy_lightning.webp"],
        ['Thunder', 'Thunder', "modules/mba-premades/icons/spells/level3/protection_from_energy_thunder.webp"]
    ];
    await mba.playerDialogMessage();
    let selection = await mba.selectImage("Protection from Energy", choices, "Choose element:", "both");
    await mba.clearPlayerDialogMessage();
    if (!selection.length) {
        await mba.removeCondition(workflow.actor, "Concentrating");
        return;
    }
    let hue = 0;
    switch (selection[0]) {
        case "Acid": hue = 200; break;
        case "Cold": hue = 280; break;
        case "Fire": hue = 95; break;
        case "Lightning": hue = 310; break;
        case "Thunder": hue = 0; break;
    }
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} PfE`, object: token })
    };
    const effectData = {
        'name': `Protection from Energy: ${selection[0]}`,
        'icon': selection[1],
        'origin': workflow.item.uuid,
        'description': `You have resistance to ${selection[0].toLowerCase()} damage for the duration.`,
        'duration': {
            'seconds': 3600
        },
        'changes': [
            {
                'key': 'system.traits.dr.value',
                'mode': 0,
                'value': selection[0].toLowerCase(),
                'priority': 20
            }
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
    new Sequence()

        .effect()
        .file("jb2a.energy_field.02.below.purple")
        .attachTo(target)
        .scaleToObject(1.5)
        .fadeIn(1000, {ease: "easeOutCubic"})
        .fadeOut(1000)
        .filter("ColorMatrix", { hue: hue})
        .opacity(0.6)
        .playbackRate(0.85)
        .belowTokens()
        .persist()
        .name(`${target.document.name} PfE`)

        .effect()
        .file("jb2a.energy_field.02.above.purple")
        .attachTo(target)
        .scaleToObject(1.5)
        .fadeIn(1000, {ease: "easeOutCubic"})
        .fadeOut(1000)
        .filter("ColorMatrix", { hue: hue})
        .opacity(0.6)
        .playbackRate(0.85)
        .persist()
        .name(`${target.document.name} PfE`)

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectData);
        })

        .play()
}