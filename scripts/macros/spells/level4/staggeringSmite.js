import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} StaSmi` })
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.staggeringSmite.damage,postDamageRoll',
                'priority': 20
            }
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'mba-premades': {
                'spell': {
                    'staggeringSmite': {
                        'saveDC': mba.getSpellDC(workflow.item)
                    }
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 4,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };

    await new Sequence()

        .effect()
        .delay(500)
        .file(`jb2a.particles.outward.purple.02.03`)
        .attachTo(workflow.token, { offset: { y: -0.25 }, gridUnits: true, followRotation: false })
        .scaleToObject(1.2)
        .playbackRate(2)
        .duration(2000)
        .fadeOut(800)
        .fadeIn(1000)
        .animateProperty("sprite", "height", { from: 0, to: 2, duration: 3000, gridUnits: true, ease: "easeOutBack" })
        .filter("Blur", { blurX: 0, blurY: 15 })
        .opacity(2)
        .zIndex(0.2)

        .effect()
        .delay(1050)
        .file("jb2a.divine_smite.caster.reversed.pink")
        .atLocation(workflow.token)
        .scaleToObject(2.2)
        .startTime(900)
        .fadeIn(200)

        .effect()
        .file("jb2a.divine_smite.caster.pink")
        .atLocation(workflow.token)
        .scaleToObject(1.85)
        .belowTokens()
        .waitUntilFinished(-1200)

        .effect()
        .file("jb2a.token_border.circle.static.purple.007")
        .attachTo(workflow.token)
        .scaleToObject(2)
        .filter("ColorMatrix", { hue: 30 })
        .fadeOut(500)
        .persist()
        .name(`${workflow.token.document.name} StaSmi`)

        .thenDo(async () => {
            await mba.createEffect(workflow.actor, effectData);
        })

        .play();
}

async function damage({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.hitTargets.size != 1 || !workflow.item) return;
    if (workflow.item.system.actionType != 'mwak') return;
    let effect = workflow.actor.effects.find(i => i.flags['mba-premades']?.spell?.staggeringSmite);
    if (!effect) return;
    let target = workflow.targets.first();
    let queueSetup = await queue.setup(workflow.item.uuid, 'staggeringSmite', 250);
    if (!queueSetup) return;
    let oldFormula = workflow.damageRoll._formula;
    let bonusDamageFormula = "4d6[psychic]";
    if (workflow.isCritical) bonusDamageFormula = mba.getCriticalFormula(bonusDamageFormula);
    let damageFormula = oldFormula + ' + ' + bonusDamageFormula;
    let damageRoll = await new Roll(damageFormula).roll({ async: true });
    await workflow.setDamageRoll(damageRoll);
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Staggering Smite: Save", false);
    if (!featureData) {
        queue.remove(workflow.item.uuid);
        return;
    }
    delete featureData._id;
    featureData.system.save.dc = effect.flags['mba-premades'].spell.staggeringSmite.saveDC;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([target.document.uuid]);
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);

    await new Sequence()

        .canvasPan()
        .delay(300)
        .shake({ duration: 1000, strength: 1, rotation: false, fadeOutDuration: 1000 })

        .effect()
        .delay(300)
        .file("jb2a.impact.ground_crack.purple.01")
        .atLocation(target)
        .filter("ColorMatrix", { hue: 25 })
        .size(2.3 * token.document.width, { gridUnits: true })
        .belowTokens()
        .playbackRate(0.85)
        .randomRotation()

        .effect()
        .file("jb2a.divine_smite.target.pink")
        .atLocation(target)
        .rotateTowards(token)
        .scaleToObject(3)
        .spriteOffset({ x: -1.5 * token.document.width, y: -0 * token.document.width }, { gridUnits: true })
        .mirrorY()
        .rotate(90)
        .zIndex(2)

        .wait(600)

        .thenDo(function () {
            Sequencer.EffectManager.endEffects({ name: `${token.document.name} StaSmi` })
        })

        .play()

    if (featureWorkflow.failedSaves.size) {
        new Sequence()

            .effect()
            .file("jb2a.token_border.circle.static.purple.007")
            .atLocation(target)
            .attachTo(target)
            .scaleToObject(2)
            .scaleIn(0, 2000, { ease: "easeOutCubic" })
            .fadeOut(500)
            .filter("ColorMatrix", { hue: 30 })
            .persist()
            .name(`${target.document.name} StaSmi`)

            .play();

        async function effectMacroDel() {
            Sequencer.EffectManager.endEffects({ name: `${token.document.name} StaSmi` })
        }
        let effectData = {
            'name': 'Staggering Smite: Stagger',
            'icon': effect.icon,
            'origin': effect.uuid,
            'description': `
                <p>You are staggered by Staggering Smite.</p>
                <p>You have disadvantage on ability checks, attack rolls and can't take reactions until the end of your next turn.</p>
            `,
            'changes': [
                {
                    'key': 'flags.midi-qol.disadvantage.attack.all',
                    'mode': 2,
                    'value': 1,
                    'priority': 20
                },
                {
                    'key': 'flags.midi-qol.disadvantage.ability.check.all',
                    'mode': 2,
                    'value': 1,
                    'priority': 20
                },
                {
                    'key': 'macro.CE',
                    'mode': 0,
                    'value': 'Reaction',
                    'priority': 20
                }
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
                },
                'midi-qol': {
                    'castData': {
                        baseLevel: 4,
                        castLevel: effect.flags['midi-qol']?.castData?.castLevel,
                        itemUuid: effect.uuid
                    }
                }
            }
        };
        await mba.createEffect(target.actor, effectData);
    }
    await mba.removeEffect(effect);
    queue.remove(workflow.item.uuid);
}

export let staggeringSmite = {
    'damage': damage,
    'item': item
}