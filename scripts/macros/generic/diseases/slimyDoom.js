import {mba} from "../../../helperFunctions.js";

export async function slimyDoom() {
    let target = game.user.targets.first();
    if (!target) target = await fromUuidSync(game.user._lastSelected).object;
    if (!target) {
        ui.notifications.warn("Unable to find target!");
        return;
    }
    let [isDiseased] = target.actor.effects.filter(e => e.flags['mba-premades']?.name === "Slimy Doom");
    if (isDiseased) {
        ui.notifications.info('Target is already affected by Slimy Doom!');
        return;
    }
    const description = [`
        <p>The creature begins to bleed uncontrollably.</p>
        <p>The creature has disadvantage on Constitution checks and Constitution saving throws.</p>
        <p>In addition, whenever the creature takes damage, it is stunned until the end of its next turn.</p>
    `];
    let number = Math.floor(Math.random() * 10000);
    const effectData = {
        'name': `Unknown Disease ${number}`,
        'icon': "modules/mba-premades/icons/conditions/nauseated.webp",
        'changes': [
            {
                'key': 'flags.midi-qol.disadvantage.ability.check.con',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.disadvantage.ability.save.con',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.diseases.slimyDoomDamaged,isDamaged',
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': false
            },
            'mba-premades': {
                'name': "Slimy Doom",
                'isDisease': true,
                'lesserRestoration': true,
                'greaterRestoration': true,
                'description': description,
                'targetUuid': target.document.uuid
            }
        }
    };
    await mba.createEffect(target.actor, effectData);
    ChatMessage.create({
        whisper: ChatMessage.getWhisperRecipients("GM"),
        content: `<p><b>${target.document.name}</b> is infected with <b>Slimy Doom</b></p>`,
        speaker: { actor: null, alias: "Disease Announcer" }
    });
}

export async function slimyDoomDamaged({ speaker, actor, token, character, item, args, scope, workflow }) {
    let [diseased] = Array.from(workflow.targets).filter(i => i.actor.effects.some(e => e.flags['mba-premades']?.targetUuid === i.document.uuid && e.flags['mba-premades']?.name === "Slimy Doom"));
    if (!diseased) {
        ui.notifications.warn("Stun trigger is unable to find diseased token! (Slimy Doom)");
        return;
    }
    let [effect] = diseased.actor.effects.filter(e => e.flags['mba-premades']?.name === "Slimy Doom");
    if (!effect) {
        ui.notifications.warn("Stun trigger is unable to find the disease effect! (Slimy Doom)");
        return;
    }
    let effectData = {
        'name': `${effect.name} Stun`,
        'icon': "modules/mba-premades/icons/conditions/nauseated.webp",
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Stunned",
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': false,
                'specialDuration': ['turnEnd']
            }
        }
    };
    await mba.createEffect(diseased.actor, effectData);
}