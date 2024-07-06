import {mba} from "../../../helperFunctions.js";

export async function arcaneBlight() {
    let target = game.user.targets.first();
    if (!target) target = await fromUuidSync(game.user._lastSelected).object;
    if (!target) {
        ui.notifications.warn("Unable to find target!");
        return;
    }
    let arcaneBlightImmune = await mba.findEffect(target.actor, "Arcane Blight: Immunity");
    if (arcaneBlightImmune) {
        ChatMessage.create({
            whisper: ChatMessage.getWhisperRecipients("GM"),
            content: `<u>${target.document.name}</u> is immune to Arcane Blight!`,
            speaker: { actor: null, alias: "Disease Announcer" }
        });
        return;
    }
    const [isDiseased] = target.actor.effects.filter(e => e.flags['mba-premades']?.name === "Arcane Blight");
    if (isDiseased) {
        ui.notifications.info('Target is already affected by Arcane Blight!');
        return;
    }
    const description = [`
        <p>Any humanoid that spends 12 hours in the necropolis must succeed on a DC 15 Constitution saving throw or contract an arcane blight. This magical disease transforms the humanoid into a nothic, but only after the victim experiences hallucinations and feelings of isolation and paranoia. Other symptoms include clammy skin, hair loss, and myopia (nearsightedness).</p>
        <p>A player character infected with the arcane blight gains the following flaw: 'I don't trust anyone.' This flaw, which supersedes any conflicting flaw, is fed by delusions that are difficult for the character to distinguish from reality. Common delusions include the belief that that allies are conspiring to steal the victim's riches or otherwise turn against the victim.</p>
        <p>Whenever it finishes a long rest, an infected humanoid must repeat the saving throw. On a successful save, the DC for future saves against the arcane blight drops by 1d6. If the saving throw DC drops to 0, the creature overcomes the arcane blight and becomes immune to the effect of further exposure. A creature that fails three of these saving throws transforms into a nothic under the DM's control. Only a wish spell or divine intervention can undo this transformation.</p>
        <p>A greater restoration spell or similar magic ends the infection on the target, removing the flaw and all other symptoms, but this magic doesn't protect the target against further exposure.</p>
    `];
    async function effectMacroArcaneBlight() {
        let [effect] = token.actor.effects.filter(e => e.flags['mba-premades']?.name === "Arcane Blight");
        if (!effect) return;
        let saveDC = effect.flags['mba-premades']?.saveDC;
        let fails = effect.flags['mba-premades']?.fails;
        let newSaveDC;
        let saveRoll = await mbaPremades.helpers.rollRequest(token, 'save', 'con');
        if (saveRoll.total >= saveDC) {
            let arcaneBlightRoll = await new Roll("1d6").roll({ 'async': true });
            await MidiQOL.displayDSNForRoll(arcaneBlightRoll);
            newSaveDC = saveDC - arcaneBlightRoll.total;
            ChatMessage.create({
                whisper: ChatMessage.getWhisperRecipients("GM"),
                content: `
                    <p><b>Arcane Blight: ` + token.document.name + `</b></p>
                    <p></p>
                    <p>Fails: <b>${fails}</b></p>
                    <p>Old DC: <b>${saveDC}</b></p>
                    <p>Roll Result: <b>${arcaneBlightRoll.total}</b></p>
                    <p>New DC: <b>${newSaveDC}</b></p>
                `,
                speaker: { actor: null, alias: "Disease Announcer" }
            });
        }
        if (saveRoll.total < saveDC) {
            fails += 1;
            newSaveDC = saveDC;
            ChatMessage.create({
                whisper: ChatMessage.getWhisperRecipients("GM"),
                content: `
                    <p><b>Arcane Blight: ` + token.document.name + `</b></p>
                    <p></p>
                    <p>Fails: <b>${fails}</b></p>
                    <p>Save DC: <b>${newSaveDC}</b></p>
                `,
                speaker: { actor: null, alias: "Disease Announcer" }
            });
        }
        let updates = {
            'flags': {
                'mba-premades': {
                    'saveDC': newSaveDC,
                    'fails': fails
                }
            }
        };
        await mbaPremades.helpers.updateEffect(effect, updates);
        if (effect.flags['mba-premades']?.fails > 2) {
            ChatMessage.create({
                whisper: ChatMessage.getWhisperRecipients("GM"),
                content: `<b>${token.document.name}</b> failed the save against Arcane Blight three times and turns into Nothic under DM's Control!`,
                speaker: { actor: null, alias: "Disease Announcer" }
            });
            await mbaPremades.helpers.removeEffect(effect);
        }
        if (effect.flags['mba-premades']?.saveDC < 1) {
            let immuneData = {
                'name': "Arcane Blight Immunity",
                'icon': "modules/mba-premades/icons/conditions/immunity.webp",
                'flags': {
                    'dae': {
                        'showIcon': false
                    }
                }
            };
            ChatMessage.create({
                whisper: ChatMessage.getWhisperRecipients("GM"),
                content: `<b>${token.document.name}</b> is cured from <b>Arcane Blight!</b>`,
                speaker: { actor: null, alias: "Disease Announcer" }
            });
            await mbaPremades.helpers.removeEffect(effect);
            await mbaPremades.helpers.createEffect(actor, immuneData);
        }
    }
    let number = Math.floor(Math.random() * 10000);
    const effectData = {
        'name': `Unknown Disease ${number}`,
        'icon': "modules/mba-premades/icons/conditions/nauseated.webp",
        'changes': [
            {
                'key': 'system.details.flaw',
                'mode': 2,
                'value': "I don't trust anyone.",
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': false
            },
            'effectmacro': {
                'dnd5e.longRest': {
                    'script': mba.functionToString(effectMacroArcaneBlight)
                }
            },
            'mba-premades': {
                'isDisease': true,
                'name': "Arcane Blight",
                'lesserResoration': false,
                'greaterRestoration': true,
                'description': description,
                'saveDC': 15,
                'fails': 0
            }
        }
    };
    await mba.createEffect(target.actor, effectData);
    ChatMessage.create({
        whisper: ChatMessage.getWhisperRecipients("GM"),
        content: `<p><u>${target.document.name}</u> is infected with <b>Arcane Blight</b></p>`,
        speaker: { actor: null, alias: "Disease Announcer" }
    });
}