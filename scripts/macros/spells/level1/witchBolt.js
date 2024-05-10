import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

export async function witchBolt({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let target = workflow.targets.first();
    async function effectMacroEveryTurn() {
        let effect = await mba.findEffect(actor, "Witch Bolt");
        if (!effect) return;
        let target = await fromUuid(effect.flags['mba-premades']?.spell?.witchBolt?.targetUuid);
        let nearbyToken = await MidiQOL.findNearby(null, token, 30, { includeIncapacitated: false, canSee: true }).filter(i => i.name === target.name);
        if (!nearbyToken.length) {
            ui.notifications.info(`Witch Bolt ends (target is outside the spell's range)`);
            await mba.removeCondition(actor, "Concentrating");
            return;
        }
        if (game.combat.current.tokenId != token.document.id) return;
        let choices = [['Yes!', 'yes'], ['No, stop concentrating!', 'no']];
        let selection = await mba.dialog('Use action to sustain Witch Bolt?', choices);
        if (!selection) return;
        if (selection === "no") {
            await mba.removeCondition(actor, 'Concentrating');
            return;
        }
        let color = effect.flags['mba-premades']?.spell?.witchBolt?.color;
        let animation = "jb2a.impact.012." + color;
        if (color === "dark_green") animation = "jb2a.impact.012.green02";
        let featureData = await mba.getItemFromCompendium('mba-premades.MBA Spell Features', 'Witch Bolt: Sustained Damage');
        if (!featureData) {
            ui.notifications.warn("Missing item in the compendium! (Witch Bolt: Sustained Damage)")
            return;
        }
        delete featureData._id;
        let feature = new CONFIG.Item.documentClass(featureData, { 'parent': actor });
        let [config, options] = constants.syntheticItemWorkflowOptions([effect.flags['mba-premades']?.spell?.witchBolt?.targetUuid]);
        await warpgate.wait(100);
        await MidiQOL.completeItemUse(feature, config, options);
        await new Sequence()

            .effect()
            .file(animation)
            .atLocation(target)
            .attachTo(target)
            .scaleToObject(1.8)
            .delay(750)
            .fadeIn(500)
            .repeats(3, 1100)

            .play()
    }
    async function effectMacroDel() {
        await Sequencer.EffectManager.endEffects({ name: `${token.document.name} Witch Bolt` })
    }
    let color = [
        ['Blue', 'blue'],
        ['Dark Green', 'dark_green'],
        ['Dark Red', 'dark_red'],
        ['Dark Purple', 'dark_purple'],
        ['Green', 'green'],
        ['Red', 'red'],
        ['Yellow', 'yellow']
    ];
    let selection = await mba.dialog("Choose animation color:", color);
    if (!selection) selection = "blue";
    let animation1 = "jb2a.impact.012." + selection;
    if (selection === "dark_green") animation1 = "jb2a.impact.012.green02";
    let animation2 = "jb2a.witch_bolt." + selection;
    let animation3 = "jb2a.static_electricity.03." + selection;
    if (selection === "dark_green") animation3 = "jb2a.static_electricity.03.green02";
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': "",
        'duration': {
            'seconds': 60
        },
        'flags': {
            'effectmacro': {
                'onEachTurn': {
                    'script': mba.functionToString(effectMacroEveryTurn)
                },
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'mba-premades': {
                'spell': {
                    'witchBolt': {
                        'color': selection,
                        'targetUuid': target.document.uuid
                    }
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 1,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };

    await new Sequence()

        .effect()
        .file(`jb2a.magic_signs.circle.02.evocation.loop.red`)
        .atLocation(token)
        .scaleToObject(1.5)
        .rotateIn(180, 600, { ease: "easeOutCubic" })
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .loopProperty("sprite", "rotation", { from: 0, to: -360, duration: 10000 })
        .belowTokens()
        .fadeOut(1700)
        .zIndex(0)

        .effect()
        .file(`jb2a.magic_signs.circle.02.evocation.loop.red`)
        .atLocation(token)
        .scaleToObject(1.5)
        .rotateIn(180, 600, { ease: "easeOutCubic" })
        .scaleIn(0, 600, { ease: "easeOutCubic" })
        .loopProperty("sprite", "rotation", { from: 0, to: -360, duration: 10000 })
        .belowTokens(true)
        .filter("ColorMatrix", { saturate: -1, brightness: 2 })
        .filter("Blur", { blurX: 5, blurY: 10 })
        .zIndex(1)
        .duration(1200)
        .fadeIn(200, { ease: "easeOutCirc", delay: 500 })
        .fadeOut(300, { ease: "linear" })

        .effect()
        .file(canvas.scene.background.src)
        .filter("ColorMatrix", { brightness: 0.7 })
        .atLocation({ x: (canvas.dimensions.width) / 2, y: (canvas.dimensions.height) / 2 })
        .size({ width: canvas.scene.width / canvas.grid.size, height: canvas.scene.height / canvas.grid.size }, { gridUnits: true })
        .spriteOffset({ x: -0 }, { gridUnits: true })
        .delay(1000)
        .duration(4500)
        .fadeIn(1500)
        .fadeOut(1500)
        .belowTokens()

        .effect()
        .file(animation1)
        .atLocation(token)
        .attachTo(token)
        .scaleToObject(1.8)
        .delay(750)
        .fadeIn(500)
        .repeats(3, 1100)

        .effect()
        .file(animation2)
        .atLocation(token)
        .attachTo(token)
        .stretchTo(target, { attachTo: true })
        .opacity(0.8)
        .delay(2500)
        .fadeIn(1000)
        .persist()
        .name(`${token.document.name} Witch Bolt`)

        .effect()
        .file(animation3)
        .attachTo(target)
        .scaleToObject(1.5)
        .delay(3000)
        .fadeIn(750)
        .persist()
        .name(`${token.document.name} Witch Bolt`)

        .thenDo(function () {
            mba.createEffect(workflow.actor, effectData);
        })

        .play()
}