import {mba} from "../../../helperFunctions.js";
import {tashaSummon} from "../../generic/tashaSummon.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let sourceActor = game.actors.getName('MBA: Flaming Sphere');
    if (!sourceActor) {
        ui.notifications.warn("Missing actor in the side panel! (MBA: Flaming Sphere)");
        return;
    }
    let tokenName = `${workflow.token.document.name} Flaming Sphere`;
    let images = [
        ["Blue", "blue", "modules/jb2a_patreon/Library/2nd_Level/Flaming_Sphere/FlamingSphere_02_Blue_Thumb.webp"], 
        ["Orange", "orange", "modules/jb2a_patreon/Library/2nd_Level/Flaming_Sphere/FlamingSphere_02_Orange_Thumb.webp"], 
        ["Purple", "purple", "modules/jb2a_patreon/Library/2nd_Level/Flaming_Sphere/FlamingSphere_02_Purple_Thumb.webp"]
    ];
    await mba.playerDialogMessage(game.user);
    let selection = await mba.selectImage("Flaming Sphere", images, `<b>Choose color:</b>`, "both");
    await mba.clearPlayerDialogMessage();
    if (!selection) selection = ["orange", "modules/jb2a_patreon/Library/2nd_Level/Flaming_Sphere/FlamingSphere_02_Orange_Thumb.webp"];
    let avatarImg = selection[1];
    let path = `jb2a.flaming_sphere.400px.${selection[0]}.02`;
    let selectedImg = await Sequencer.Database.getEntry(path).file;
    let lightColor = "#bd6500";
    if (selection[0] === "blue") lightColor = "#0084bd";
    else if (selection[0] === "purple") lightColor = "#a700bd";
    let effect = sourceActor.effects.find(e => e.name === "Light");
    let effectUpdates = {
        'changes': [
            {
                'key': 'ATL.light.dim',
                'mode': 4,
                'value': 40,
                'priority': 20
            },
            {
                'key': 'ATL.light.bright',
                'mode': 4,
                'value': 20,
                'priority': 20
            },
            {
                'key': 'ATL.light.color',
                'mode': 5,
                'value': lightColor,
                'priority': 20
            },
            {
                'key': 'ATL.light.animation',
                'mode': 5,
                'value': '{type: "smokepatch", speed: 5, intensity: 1, reverse: false }',
                'priority': 20
            },
            {
                'key': 'ATL.light.alpha',
                'mode': 5,
                'value': "0.25",
                'priority': 20
            }
        ]
    };
    await mba.updateEffect(effect, effectUpdates);
    let ramData = await mba.getItemFromCompendium('mba-premades.MBA Summon Features', 'Flaming Sphere: Ram', false);
    if (!ramData) {
        ui.notifications.warn('Missing summon feature in the module compendium! (Flaming Sphere: Ram)');
        return;
    }
    ramData.system.save.dc = mba.getSpellDC(workflow.item);
    ramData.system.damage.parts[0][0] = workflow.castData.castLevel + 'd6[fire]';
    let auraData = await mba.getItemFromCompendium('mba-premades.MBA Summon Features', 'Flaming Sphere: Aura', false);
    if (!auraData) {
        ui.notifications.warn('Missing summon feature in the module compendium! (Flaming Sphere Aura)');
        return;
    }
    auraData.system.save.dc = mba.getSpellDC(workflow.item);
    let updates = {
        'actor': {
            'img': avatarImg,
            'name': tokenName,
            'prototypeToken': {
                'name': tokenName,
                'disposition': workflow.token.document.disposition,
                'texture': {
                    'src': selectedImg
                }
            }
        },
        'token': {
            'disposition': workflow.token.document.disposition,
            'name': tokenName,
            'texture': {
                'src': selectedImg
            }
        },
        'embedded': {
            'Item': {
                [ramData.name]: ramData,
                [auraData.name]: auraData,
            }
        }
    };
    await mba.playerDialogMessage(game.user);
    let spawned = await tashaSummon.spawn(sourceActor, updates, 60, workflow.item, 60, workflow.token, "fire", {}, workflow.castData.castLevel);
    await mba.clearPlayerDialogMessage();
    let auraEffect = await mba.findEffect(spawned.actor, "Flaming Sphere: Aura");
    if (!auraEffect) return;
    let auraUpdates = {
        'changes': [
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `turn=end, saveAbility=dex, saveDC=${mba.getSpellDC(workflow.item)}, saveMagic=true, saveDamage=halfdamage, damageRoll=${workflow.castData.castLevel}d6[fire], damageType=fire, name=Flaming Sphere Aura, killAnim=true, fastForwardDamage=true`,
                'priority': 20
            },
        ],
        'flags': {
            'mba-premades': {
                'spell': {
                    'flamingSphere': {
                        'color': selection
                    }
                }
            }
        }
    };
    await mba.updateEffect(auraEffect, auraUpdates);
}

async function attack({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let effect = await mba.findEffect(workflow.actor, "Flaming Sphere: Aura");
    let animation1 = "jb2a.impact.ground_crack.orange.03";
    let animation2 = "jb2a.melee_attack.03.trail.02.orangered.0";
    let hue = 0;
    if (effect) {
        let color = effect.flags['mba-premades']?.spell?.flamingSphere?.color;
        if (color === "blue") {
            animation1 = "jb2a.impact.ground_crack.blue.03";
            animation2 = "jb2a.melee_attack.03.trail.02.blueyellow.0";
            hue = 170;
        }
        else if (color === "purple") {
            animation1 = "jb2a.impact.ground_crack.purple.03";
            animation2 = "jb2a.melee_attack.03.trail.02.pinkpurple.0";
            hue = 240;
        }
    }

    new Sequence()

        .effect()
        .file(animation1)
        .atLocation(token)
        .scaleToObject(1.7 * token.document.texture.scaleX)
        .belowTokens()
        .delay(150)

        .canvasPan()
        .delay(250)
        .shake({ duration: 250, strength: 2, rotation: false })

        .effect()
        .file(animation2)
        .atLocation(token)
        .rotateTowards(target)
        .size(3 * token.document.width, { gridUnits: true })
        .spriteOffset({ x: -1 * token.document.width }, { gridUnits: true })
        .zIndex(2)
        .delay(500)

        .effect()
        .file("jb2a.gust_of_wind.veryfast")
        .atLocation(token)
        .stretchTo(target, { onlyX: true })
        .scale(0.5)
        .opacity(0.15)
        .belowTokens()
        .fadeOut(1000)
        .delay(1000)

        .wait(1000)

        .effect()
        .file("jb2a.impact.fire.01.orange.0")
        .attachTo(target)
        .scaleToObject(1.5 * target.document.texture.scaleX)
        .filter("ColorMatrix", { hue: hue })

        .play()
}

export let flamingSphere = {
    'item': item,
    'attack': attack
}