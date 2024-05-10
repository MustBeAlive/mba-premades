import {mba} from "../../../helperFunctions.js";

export async function sightRot() {
    let target = game.user.targets.first();
    if (!target) target = await fromUuidSync(game.user._lastSelected).object;
    if (!target) {
        ui.notifications.warn("Unable to find target!");
        return;
    }
    let type = await mba.raceOrType(target.actor);
    if (type != "beast" && type != "humanoid") {
        console.log("Target is unaffected by Sight Rot (Neither beast, nor humanoid)");
        return;
    }
    let [isDiseased] = target.actor.effects.filter(e => e.flags['mba-premades']?.name === "Sight Rot");
    if (isDiseased) {
        ui.notifications.info('Target is already affected by Sight Rot!');
        return;
    }
    const description = [`
        <p>This painful infection causes bleeding from the eyes and eventually blinds the victim.</p>
        <p>A beast or humanoid that drinks water tainted by sight rot must succeed on a DC 15 Constitution saving throw or become infected. One day after infection, the creature's vision starts to become blurry. The creature takes a -1 penalty to attack rolls and ability checks that rely on sight. At the end of each long rest after the symptoms appear, the penalty worsens by 1. When it reaches -5, the victim is blinded until its sight is restored by magic such as lesser restoration or heal.</p>
        <p>Sight rot can be cured using a rare flower called <b>Eyebright</b>, which grows in some swamps. Given an hour, a character who has proficiency with an herbalism kit can turn the flower into one dose of ointment. Applied to the eyes before a long rest, one dose of it prevents the disease from worsening after that rest. After three doses, the ointment cures the disease entirely.</p>
    `];
    async function effectMacroSightRotManifest() {
        await game.Gametime.doIn({ day: 1 }, async () => {
            let [effect] = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Sight Rot");
            if (!effect) {
                console.log('Unable to find effect (Sight Rot)');
                return;
            }
            let description = effect.flags['mba-premades']?.description;
            async function effectMacroSightRot() {
                let [effect] = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Sight Rot");
                if (!effect) {
                    console.log('Unable to find effect (Sight Rot)');
                    return;
                }
                let currentPenalty = effect.flags['mba-premades']?.penalty;
                let eyebrightCurrent = effect.flags['mba-premades']?.eyebrightCurrent;
                let eyebrightLast = effect.flags['mba-premades']?.eyebrightLast;
                let eyebrightUsed = effect.flags['mba-premades']?.eyebrightUsed;
                if (eyebrightUsed === true) {
                    if (eyebrightCurrent > eyebrightLast && eyebrightCurrent != 3) {
                        eyebrightLast = eyebrightCurrent;
                        let updates = {
                            'flags': {
                                'mba-premades': {
                                    'eyebrightLast': eyebrightLast,
                                    'eyebrightUsed': false
                                }
                            }
                        };
                        await mbaPremades.helpers.updateEffect(effect, updates);
                        ChatMessage.create({
                            whisper: ChatMessage.getWhisperRecipients("GM"),
                            content: `
                            <p><b>Sigh Rot</b> progress for <b>${token.document.name}</b></p>
                            <p>Current Penalty: <b>${currentPenalty}</b></p>
                            <p>Consecutive Eyebright Ointment uses: <b>${eyebrightCurrent}</b></p>
                        `,
                            speaker: { actor: null, alias: "Disease Announcer" }
                        });
                        return;
                    }
                    if (eyebrightCurrent > eyebrightLast && eyebrightCurrent === 3) {
                        await mbaPremades.helpers.removeEffect(effect);
                        ChatMessage.create({
                            whisper: ChatMessage.getWhisperRecipients("GM"),
                            content: `<b>${token.document.name}</b> is cured from <b>Sight Rot!</b>`,
                            speaker: { actor: null, alias: "Disease Announcer" }
                        });
                        return;
                    }
                }
                eyebrightCurrent = 0;
                eyebrightLast = 0
                currentPenalty += 1;
                if (currentPenalty > 5) currentPenalty = 5;
                let updates = {
                    'changes': [
                        {
                            'key': 'system.bonuses.All-Attacks',
                            'mode': 2,
                            'value': "-" + currentPenalty,
                            'priority': 20
                        },
                        {
                            'key': 'system.skills.prc.bonuses.check',
                            'mode': 2,
                            'value': "-" + currentPenalty,
                            'priority': 20
                        },
                        {
                            'key': 'system.skills.inv.bonuses.check',
                            'mode': 2,
                            'value': "-" + currentPenalty,
                            'priority': 20
                        }
                    ],
                    'flags': {
                        'mba-premades': {
                            'penalty': currentPenalty,
                            'eyebrightCurrent': eyebrightCurrent,
                            'eyebrightLast': eyebrightLast
                        }
                    }
                };
                await mbaPremades.helpers.updateEffect(effect, updates);
                ChatMessage.create({
                    whisper: ChatMessage.getWhisperRecipients("GM"),
                    content: `
                        <p><b>Sigh Rot</b> progress for <b>${token.document.name}</b></p>
                        <p>Current Penalty: <b>${currentPenalty}</b></p>
                        <p>Consecutive Eyebright Ointment uses: <b>${eyebrightCurrent}</b></p>
                    `,
                    speaker: { actor: null, alias: "Disease Announcer" }
                });
                if (currentPenalty === 5 && !mbaPremades.helpers.findEffect(actor, 'Blinded')) await mbaPremades.helpers.addCondition(actor, "Blinded");
            }
            async function effectMacroSightRotDel() {
                let effect = mbaPremades.helpers.findEffect(actor, "Blinded");
                if (effect) await mbaPremades.helpers.removeEffect(effect);
            }
            let number = Math.floor(Math.random() * 10000);
            let effectData = {
                'name': `Unknown Disease ${number}`,
                'icon': "modules/mba-premades/icons/conditions/nauseated.webp",
                'changes': [
                    {
                        'key': 'system.bonuses.All-Attacks',
                        'mode': 2,
                        'value': "-1",
                        'priority': 20
                    },
                    {
                        'key': 'system.skills.prc.bonuses.check',
                        'mode': 2,
                        'value': "-1",
                        'priority': 20
                    },
                    {
                        'key': 'system.skills.inv.bonuses.check',
                        'mode': 2,
                        'value': "-1",
                        'priority': 20
                    }
                ],
                'flags': {
                    'dae': {
                        'showIcon': false
                    },
                    'effectmacro': {
                        'dnd5e.longRest': {
                            'script': mbaPremades.helpers.functionToString(effectMacroSightRot)
                        },
                        'onDelete': {
                            'script': mbaPremades.helpers.functionToString(effectMacroSightRotDel)
                        }
                    },
                    'mba-premades': {
                        'name': "Sight Rot",
                        'isDisease': true,
                        'lesserRestoration': true,
                        'greaterRestoration': true,
                        'description': description,
                        'penalty': 1,
                        'eyebrightCurrent': 0,
                        'eyebrightLast': 0,
                        'eyebrightUsed': false
                    }
                }
            };
            await mbaPremades.helpers.createEffect(token.actor, effectData);
            await mbaPremades.helpers.removeEffect(effect);
        });
    }
    let number = Math.floor(Math.random() * 10000);
    const effectData = {
        'name': `Unknown Disease ${number}`,
        'icon': "modules/mba-premades/icons/conditions/nauseated.webp",
        'flags': {
            'dae': {
                'showIcon': false
            },
            'effectmacro': {
                'onCreate': {
                    'script': mba.functionToString(effectMacroSightRotManifest)
                }
            },
            'mba-premades': {
                'name': "Sight Rot",
                'isDisease': true,
                'lesserRestoration': true,
                'greaterRestoration': true,
                'description': description,
                'longRest': 0
            }
        }
    };
    await mba.createEffect(target.actor, effectData);
    ChatMessage.create({
        whisper: ChatMessage.getWhisperRecipients("GM"),
        content: `<p><b>${target.document.name}</b> is infected with <b>Sight Rot</b></p><p>Symptoms will manifest in <b>1 day</b></p>`,
        speaker: { actor: null, alias: "Disease Announcer" }
    });
}

export async function sightRotOintment({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let [effect] = target.actor.effects.filter(e => e.flags['mba-premades']?.name === "Sight Rot");
    if (!effect) {
        ui.notifications.warn("Target is not infected with Sight Rot!");
        return;
    }
    let eyebrightUsed = effect.flags['mba-premades']?.eyebrightUsed;
    if (eyebrightUsed === true) {
        ui.notifications.warn("Target already used Eyebright Ointment today!");
        return;
    }
    let eyebrightCurrent = effect.flags['mba-premades']?.eyebrightCurrent;
    eyebrightCurrent += 1;
    let updates = {
        'flags': {
            'mba-premades': {
                'eyebrightCurrent': eyebrightCurrent,
                'eyebrightUsed': true
            }
        }
    };
    await mba.updateEffect(effect, updates);
    ChatMessage.create({
        content: `<p><b>${target.document.name}</b> applied eyebright ointment</b></p><p>Consecutive uses: <b>${eyebrightCurrent}</b></p>`,
        speaker: { actor: null, alias: "Disease Announcer" }
    });
    let ointment = workflow.actor.items.filter(i => i.name === `Eyebright Ointment`)[0];
    if (ointment.system.quantity > 1) {
        ointment.update({ "system.quantity": ointment.system.quantity - 1 });
    } else {
        workflow.actor.deleteEmbeddedDocuments("Item", [ointment.id]);
    }
}