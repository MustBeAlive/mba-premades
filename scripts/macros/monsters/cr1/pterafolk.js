import { mba } from "../../../helperFunctions.js";

async function terrorDiveActive({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = await mba.findEffect(workflow.actor, "Terror Dive: Active");
    if (effect) {
        ui.notifications.warn("Terror Dive is already active!");
        await game.messages.get(workflow.itemCardId).delete();
        return;
    }
    let effectData = {
        'name': "Terror Dive: Active",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'duration': {
            'turns': 1
        },
        'description': `
            <p></p>
        `,
        'changes': [
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.monsters.pterafolk.terrorDiveTrigger,postDamageRoll',
                'priority': 20
            }
        ],
    };
    await mba.createEffect(workflow.actor, effectData);
}

async function terrorDiveTrigger({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size || !workflow.item) return;
    if (workflow.item.system.actionType != "mwak") return;
    let target = workflow.targets.first();
    if (mba.checkTrait(target.actor, "ci", "frightened")) return;
    if (mba.findEffect(target.actor, "Pterafolk Terror Dive: Fear")) return;

    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} PtFear` })
    };
    let effectData = {
        'name': "Pterafolk Terror Dive: Fear",
        'icon': "modules/mba-premades/icons/generic/dive.webp",
        'origin': workflow.item.uuid,
        'description': `
            <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.oR1wUvem3zVVUv5Q]{Frightened} by Pterafolk's Terror Dive until the end of your next turn.</p>
        `,
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': 'Frightened',
                'priority': 20
            },
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['turnEnd']
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };
    new Sequence()

        .effect()
        .file("jb2a.toll_the_dead.purple.skull_smoke")
        .atLocation(target)
        .scaleToObject(2.5, { considerTokenScale: true })
        .opacity(0.9)
        .playbackRate(0.5)
        .filter("ColorMatrix", { hue: 180 })

        .effect()
        .file("jb2a.template_circle.symbol.normal.fear.dark_purple")
        .attachTo(target)
        .scaleToObject(1.6)
        .fadeIn(2000)
        .fadeOut(1000)
        .filter("ColorMatrix", { hue: 180 })
        .mask()
        .persist()
        .name(`${target.document.name} PtFear`)

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectData);
        })

        .play()
}

export let pterafolk = {
    'terrorDiveActive': terrorDiveActive,
    'terrorDiveTrigger': terrorDiveTrigger
}