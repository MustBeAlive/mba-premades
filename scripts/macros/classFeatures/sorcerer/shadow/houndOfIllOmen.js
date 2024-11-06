import {constants} from "../../../generic/constants.js";
import {mba} from "../../../../helperFunctions.js";
import {tashaSummon} from "../../../generic/tashaSummon.js";

// To do: token variants
// If hound dies first, error pops (alas, everything else works)

async function summon({ speaker, actor, token, character, item, args, scope, workflow }) {
    let pointsItem = await mba.getItem(workflow.actor, "Sorcery Points");
    if (!pointsItem) {
        ui.notifications.warn("Unable to find feature! (Sorcery Points)");
        return;
    }
    let points = pointsItem.system.uses.value;
    if (points < 3) {
        ui.notifications.info("Not enough sorcery points!");
        return;
    }
    let target = workflow.targets.first();
    if (target.document.uuid === workflow.token.document.uuid) return;
    async function effectMacroDel() {
        let [houndToken] = canvas.scene.tokens.filter(t => t.actor.effects.find(e => e.name === `${token.document.name} Hound of Ill Omen`));
        let houndEffect = await mbaPremades.helpers.findEffect(houndToken.actor, `${token.document.name} Hound of Ill Omen`);
        if (houndEffect) await mbaPremades.helpers.removeEffect(houndEffect);
    };
    let effectDataTarget = {
        'name': "Hound of Ill Omen: Target",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are haunted by Hound of Ill Omen for the duration, or untill the Hound Dies.</p>
            <p></p>
        `,
        'duration': {
            'seconds': 300
        },
        'changes': [
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.houndOfIllOmen.save,preTargetSave',
                'priority': 20
            },
        ],
        'flags': {
            'dae': {
                'specialDuration': ['zeroHP']
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'mba-premades': {
                'feature': {
                    'houndOfIllOmen': {
                        'sourceUuid': workflow.token.document.uuid
                    }
                }
            }
        }
    };
    let sourceActor = game.actors.getName("MBA: Hound of Ill Omen");
    if (!sourceActor) {
        ui.notifications.warn("Missing actor in the side panel! (MBA: Hound of Ill Omen)");
        return;
    }
    let tokenName = `${workflow.token.document.name} Hound`;
    let tempHP = Math.min(workflow.actor.classes.sorcerer?.system?.levels / 2);
    let images = [
        ["White Hound", "white", "modules/mba-premades/icons/class/sorcerer/shadow/hound/hell_hound_medium_spirit_03.webp"],
        ["White Death Dog", "purple", "modules/mba-premades/icons/class/sorcerer/shadow/hound/death_dog_medium_spirit_03.webp"],
        ["White Wolf", "purple", "modules/mba-premades/icons/class/sorcerer/shadow/hound/dire_wolf_large_spirit_03.webp"],
        ["Blue Hound", "blue", "modules/mba-premades/icons/class/sorcerer/shadow/hound/hell_hound_medium_spirit_01.webp"],
        ["Blue Death Dog", "purple", "modules/mba-premades/icons/class/sorcerer/shadow/hound/death_dog_medium_spirit_01.webp"],
        ["Blue Wolf", "purple", "modules/mba-premades/icons/class/sorcerer/shadow/hound/dire_wolf_large_spirit_01.webp"],
        ["Green Hound", "green", "modules/mba-premades/icons/class/sorcerer/shadow/hound/hell_hound_medium_spirit_02.webp"],
        ["Green Death Dog", "purple", "modules/mba-premades/icons/class/sorcerer/shadow/hound/death_dog_medium_spirit_02.webp"],
        ["Green Wolf", "purple", "modules/mba-premades/icons/class/sorcerer/shadow/hound/dire_wolf_large_spirit_02.webp"],
        ["Purple Hound", "purple", "modules/mba-premades/icons/class/sorcerer/shadow/hound/hell_hound_medium_spirit_04.webp"],
        ["Purple Death Dog", "purple", "modules/mba-premades/icons/class/sorcerer/shadow/hound/death_dog_medium_spirit_04.webp"],
        ["Purple Wolf", "purple", "modules/mba-premades/icons/class/sorcerer/shadow/hound/dire_wolf_large_spirit_04.webp"],
    ];
    await mba.playerDialogMessage(game.user);
    let selection = await mba.selectImage("Hound of Ill Omen: Color", images, "<b>Select color:</b>", "both");
    if (!selection) selection = ["purple", "modules/mba-premades/icons/class/sorcerer/shadow/hound/hell_hound_medium_spirit_04.webp"];
    let avatarImg = selection[1];
    await mba.clearPlayerDialogMessage();
    let updates = {
        'actor': {
            'img': avatarImg,
            'name': tokenName,
            'prototypeToken': {
                'name': tokenName,
                'disposition': workflow.token.document.disposition,
                'texture': {
                    'src': avatarImg
                }
            },
            'system': {
                'attributes': {
                    'hp': {
                        'temp': tempHP
                    }
                }
            }
        },
        'token': {
            'disposition': workflow.token.document.disposition,
            'name': tokenName,
            'texture': {
                'src': avatarImg
            }
        }
    };
    await mba.playerDialogMessage(game.user);
    let houndDoc = await tashaSummon.spawn(sourceActor, updates, 300, workflow.item, 30, target, "shadow");
    await mba.clearPlayerDialogMessage();
    await pointsItem.update({ "system.uses.value": points -= 3 });
    await mba.createEffect(target.actor, effectDataTarget);
    async function effectMacroHound() {
        (async function effectMacroDel() {
            await warpgate.dismiss(token.id);
            let [target] = canvas.scene.tokens.filter(t => t.actor.effects.find(e => e.name === "Hound of Ill Omen: Target"));
            if (target) {
                let targetEffect = await mbaPremades.helpers.findEffect(target.actor, "Hound of Ill Omen: Target");
                if (targetEffect) await mbaPremades.helpers.removeEffect(targetEffect);
            }
            let castEffect = mbaPremades.helpers.findEffect(origin.actor, origin.name);
            if (castEffect) await mbaPremades.helpers.removeEffect(castEffect);
        })()
    }
    let updatesHound = {
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroHound)
                }
            }
        }
    };
    let houndEffect = await mba.findEffect(houndDoc.actor, `${target.document.name} Hound of Ill Omen`);
    await mba.updateEffect(houndEffect, updatesHound);
}

async function save({ speaker, actor, token, character, item, args, scope, workflow }) {
    let [spellTarget] = Array.from(workflow.targets).filter(t => t.actor.effects.find(e => e.name === "Hound of Ill Omen: Target"));
    if (!spellTarget) {
        console.log("Unable to find target for Hound of Ill Omen macro!");
        return;
    }
    let [houndNearby] = await mba.findNearby(spellTarget, 5, "any", false, false).filter(t => t.actor.effects.find(e => e.name === `${spellTarget.document.name} Hound of Ill Omen`));
    if (!houndNearby) return;
    let houndEffect = await mba.findEffect(spellTarget.actor, "Hound of Ill Omen: Target");
    let casterDoc = await fromUuid(houndEffect.flags['mba-premades']?.feature?.houndOfIllOmen?.sourceUuid);
    let selection = await mba.dialog("Hound of Ill Omen", constants.yesNo, `<b>Is <u>${spellTarget.document.name}</u> attempting a save against one of <u>${casterDoc.name}</u> spells?</b>`);
    if (!selection) return;
    await mba.createEffect(spellTarget.actor, constants.disadvantageEffectData);
}

export let houndOfIllOmen = {
    'summon': summon,
    'save': save,
}