import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let saveDC = mba.getSpellDC(workflow.item);
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} PWP` })
    };
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are affected by crippling pain.</p>
            <p>Any speed you have cannot be higher than 10 feet. You also have disadvantage on attack rolls, ability checks, and saving throws, other than Constitution saving throws.</p>
            <p>Finally, if you try to cast a spell, you must first succeed on a Constitution saving throw, or the casting fails and the spell is wasted.</p>
            <p>At the end of each of your turns, you can make a Constitution saving throw. On a successful save, the effect ends.</p>
        `,
        'changes': [
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.powerWordPain.check,preItemRoll',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `turn=end, saveAbility=con, saveDC=${saveDC}, saveMagic=true, name=Power Word Pain: Turn End (DC${saveDC}), killAnim=true`,
                'priority': 20
            },
            {
                'key': 'system.attributes.movement.burrow',
                'mode': 3,
                'value': '10',
                'priority': 100
            },
            {
                'key': 'system.attributes.movement.climb',
                'mode': 3,
                'value': '10',
                'priority': 100
            },
            {
                'key': 'system.attributes.movement.fly',
                'mode': 3,
                'value': '10',
                'priority': 100
            },
            {
                'key': 'system.attributes.movement.hover',
                'mode': 3,
                'value': '10',
                'priority': 100
            },
            {
                'key': 'system.attributes.movement.swim',
                'mode': 3,
                'value': '10',
                'priority': 100
            },
            {
                'key': 'system.attributes.movement.walk',
                'mode': 3,
                'value': '10',
                'priority': 100
            },
            {
                'key': 'flags.midi-qol.disadvantage.attack.all',
                'mode': 2,
                'value': '1',
                'priority': 50
            },
            {
                'key': 'flags.midi-qol.disadvantage.ability.check.all',
                'mode': 2,
                'value': '1',
                'priority': 50
            },
            {
                'key': 'flags.midi-qol.disadvantage.ability.save.str',
                'mode': 2,
                'value': '1',
                'priority': 50
            },
            {
                'key': 'flags.midi-qol.disadvantage.ability.save.dex',
                'mode': 2,
                'value': '1',
                'priority': 50
            },
            {
                'key': 'flags.midi-qol.disadvantage.ability.save.int',
                'mode': 2,
                'value': '1',
                'priority': 50
            },
            {
                'key': 'flags.midi-qol.disadvantage.ability.save.wis',
                'mode': 2,
                'value': '1',
                'priority': 50
            },
            {
                'key': 'flags.midi-qol.disadvantage.ability.save.cha',
                'mode': 2,
                'value': '1',
                'priority': 50
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true,
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'mba-premades': {
                'spell': {
                    'powerWordPain': {
                        'saveDC': mba.getSpellDC(workflow.item),
                    }
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 7,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };

    new Sequence()

    .effect()
    .file("jb2a.extras.tmfx.border.circle.outpulse.01.fast")
    .attachTo(workflow.token)
    .scaleToObject(3)
    .opacity(0.75)
    .zIndex(1)
    .belowTokens()
    .filter("ColorMatrix", { saturate: 0, brightness: 0 })
    .repeats(3, 1000, 1000)

    .effect()
    .file("jb2a.extras.tmfx.outflow.circle.04")
    .attachTo(workflow.token)
    .scaleToObject(2.8)
    .fadeIn(1000)
    .fadeOut(1000)
    .opacity(1.2)
    .zIndex(1)
    .randomRotation()
    .belowTokens()
    .filter("ColorMatrix", { saturate: 0, brightness: 0 })
    .repeats(3, 1000, 1000)

    .effect()
    .file(canvas.scene.background.src)
    .atLocation({ x: (canvas.dimensions.width) / 2, y: (canvas.dimensions.height) / 2 })
    .size({ width: canvas.scene.width / canvas.grid.size, height: canvas.scene.height / canvas.grid.size }, { gridUnits: true })
    .duration(9500)
    .fadeIn(1000)
    .fadeOut(1000)
    .spriteOffset({ x: -0.5 }, { gridUnits: true })
    .filter("ColorMatrix", { brightness: 0.3 })
    .belowTokens()

    .wait(1000)

    .effect()
    .file("jb2a.magic_signs.rune.02.loop.01.purple")
    .attachTo(workflow.token, { offset: { x: -0.4, y: -0.5 }, gridUnits: true })
    .scaleToObject(0.8)
    .duration(8000)
    .fadeIn(1000)
    .fadeOut(1000)
    .mirrorX()

    .effect()
    .file("jb2a.magic_signs.rune.enchantment.loop.purple")
    .attachTo(workflow.token, { offset: { x: -0.03, y: -0.55 }, gridUnits: true })
    .scaleToObject(0.8)
    .delay(1000)
    .duration(7000)
    .fadeIn(1000)
    .fadeOut(1000)

    .effect()
    .file("jb2a.magic_signs.rune.02.loop.01.purple")
    .attachTo(workflow.token, { offset: { x: 0.4, y: -0.5 }, gridUnits: true })
    .scaleToObject(0.8)
    .delay(2000)
    .duration(6000)
    .fadeIn(1000)
    .fadeOut(1000)

    .wait(3500)

    .effect()
    .file("jb2a.cast_generic.dark.side01.red")
    .atLocation(workflow.token)
    .rotateTowards(target)
    .size(1.5 * workflow.token.document.width, { gridUnits: true })
    .zIndex(2)
    .filter("ColorMatrix", { hue: 260 })
    .waitUntilFinished(-1500)

    .effect()
    .file("jb2a.impact.004.dark_purple")
    .atLocation(target)
    .scaleToObject(3)
    .fadeOut(1167)
    .scaleIn(0, 1167, { ease: "easeOutCubic" })
    .opacity(0.45)

    .canvasPan()
    .shake({ duration: 100, strength: 25, rotation: false })

    .effect()
    .file("jb2a.static_electricity.03.dark_purple")
    .attachTo(target)
    .scaleToObject(1.25)
    .fadeOut(1000)
    .opacity(0.75)
    .zIndex(1)
    .playbackRate(4)
    .randomRotation()
    .repeats(10, 250, 250)

    .thenDo(async () => {
        if (target.actor.system.attributes.hp.value <= 100 && !mba.checkTrait(target.actor, 'ci', 'charmed')) await mba.createEffect(target.actor, effectData);
        else ui.notifications.info("Target either has more than 100 HP or is immune to being Charmed!");
    })

    .effect()
    .file("jb2a.template_circle.symbol.normal.skull.purple")
    .attachTo(target)
    .scaleToObject(1.3)
    .fadeIn(3000)
    .fadeOut(1000)
    .mask()
    .persist()
    .name(`${target.document.name} PWP`)
    .playIf(() => {
        return (target.actor.system.attributes.hp.value <= 100 && !mba.checkTrait(target.actor, 'ci', 'charmed'));
    })

    .play();
}

async function check({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.item.type != "spell" || workflow.item.name === "Power Word Pain: Turn End") return;
    let effect = await mba.findEffect(workflow.actor, "Power Word Pain");
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Power Word Pain: Save", false);
    if (!featureData) return;
    delete featureData._id;
	featureData.system.save.dc = effect.flags['mba-premades']?.spell?.powerWordPain?.saveDC;
	let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
	let [config, options] = constants.syntheticItemWorkflowOptions([workflow.token.document.uuid]);
	let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
	if (!featureWorkflow.failedSaves.size) return;
    ui.notifications.warn('Spell fails!');
    return false;
}

export let powerWordPain = {
    'item': item,
    'check': check
}