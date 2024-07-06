import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Spell Features', 'Shadow Blade: Sword', false);
    if (!featureData) return;
    let featureData2 = await mba.getItemFromCompendium('mba-premades.MBA Spell Features', 'Shadow Blade: Evoke', false);
    if (!featureData2) {
        ui.notifications.warn("Unable to find item in compendium! (Shadow Blade: Evoke)");
        return
    }
    let spellLevel = workflow.castData.castLevel;
    let diceNum = 2;
    switch (spellLevel) {
        case 3:
        case 4:
            diceNum = 3;
            break;
        case 5:
        case 6:
            diceNum = 4;
            break;
        case 7:
        case 8:
        case 9:
            diceNum = 5;
            break;
    }
    featureData.system.damage.parts = [[diceNum + 'd8[psychic ] + @mod', 'psychic']];
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Shadow Blade` })
        await warpgate.revert(token.document, 'Shadow Blade');
    }
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You weave together threads of shadow to create a sword of solidified gloom in your hand. This magic sword lasts until the spell ends.</p>
            <p>It counts as a simple melee weapon with which you are proficient. It deals ${diceNum}d8 psychic damage on a hit and has the finesse, light, and thrown properties (range 20/60).</p>
            <p>In addition, when you use the sword to attack a target that is in dim light or darkness, you make the attack roll with advantage.</p>
            <p>If you drop the weapon or throw it, it dissipates at the end of the turn. Thereafter, while the spell persists, you can use a bonus action to cause the sword to reappear in your hand.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'mba-premades': {
                'spell': {
                    'shadowBlade': {
                        'evoke': true
                    }
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 2,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    let updates = {
        'embedded': {
            'Item': {
                [featureData.name]: featureData,
                [featureData2.name]: featureData2
            },
            'ActiveEffect': {
                [effectData.name]: effectData
            }
        }
    };
    let options = {
        'permanent': false,
        'name': 'Shadow Blade',
        'description': 'Shadow Blade'
    };

    await new Sequence()

        .wait(500)

        .effect()
        .delay(500)
        .file(`jb2a.particles.outward.red.02.03`)
        .attachTo(token, { offset: { y: -0.25 }, gridUnits: true, followRotation: false })
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
        .file("jb2a.divine_smite.caster.reversed.dark_purple")
        .atLocation(token)
        .scaleToObject(2.2)
        .startTime(900)
        .fadeIn(200)

        .effect()
        .file("jb2a.divine_smite.caster.dark_purple")
        .atLocation(token)
        .scaleToObject(1.85)
        .belowTokens()
        .waitUntilFinished(-1200)

        .effect()
        .file("jb2a.spiritual_weapon.longsword.01.spectral.02.orange")
        .attachTo(token, { followRotation: true, local: true })
        .scaleToObject(1.3, { considerTokenScale: true })
        .fadeIn(500)
        .fadeOut(1000)
        .scaleIn(0, 2000, { ease: "easeOutElastic" })
        .scaleOut(0, 500, { ease: "easeOutCubic" })
        .spriteOffset({ x: 0.4 * token.document.width, y: -0.1 * token.document.width }, { gridUnits: true })
        .spriteRotation(90)
        .mirrorX()
        .mirrorY()
        .filter("ColorMatrix", { hue: 250 })
        .persist()
        .name(`${token.document.name} Shadow Blade`)

        .thenDo(async () => {
            await warpgate.mutate(workflow.token.document, updates, {}, options);
        })

        .play()
}

async function evoke({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = await mba.findEffect(workflow.actor, "Shadow Blade");
    if (!effect) return;
    let evoke = effect.flags['mba-premades']?.spell?.shadowBlade?.evoke;
    let updates;
    if (evoke === true) {
        updates = {
            'flags': {
                'mba-premades': {
                    'spell': {
                        'shadowBlade': {
                            'evoke': false
                        }
                    }
                }
            }
        };
        await mba.updateEffect(effect, updates);
        await Sequencer.EffectManager.endEffects({ name: `${workflow.token.document.name} Shadow Blade`, object: token })
    }
    else if (evoke === false) {
        updates = {
            'flags': {
                'mba-premades': {
                    'spell': {
                        'shadowBlade': {
                            'evoke': true
                        }
                    }
                }
            }
        };
        await new Sequence()

            .effect()
            .file(`jb2a.particles.outward.red.02.03`)
            .attachTo(token, { offset: { y: -0.25 }, gridUnits: true, followRotation: false })
            .scaleToObject(1.2)
            .delay(500)
            .duration(2000)
            .fadeOut(800)
            .fadeIn(1000)
            .playbackRate(2)
            .animateProperty("sprite", "height", { from: 0, to: 2, duration: 3000, gridUnits: true, ease: "easeOutBack" })
            .filter("Blur", { blurX: 0, blurY: 15 })
            .opacity(2)
            .zIndex(0.2)

            .effect()
            .file("jb2a.divine_smite.caster.reversed.dark_purple")
            .attachTo(token)
            .scaleToObject(2.2)
            .delay(1050)
            .startTime(900)
            .fadeIn(200)

            .effect()
            .file("jb2a.divine_smite.caster.dark_purple")
            .attachTo(token)
            .scaleToObject(1.85)
            .belowTokens()
            .waitUntilFinished(-1200)

            .effect()
            .file("jb2a.spiritual_weapon.longsword.01.spectral.02.orange")
            .attachTo(token, { followRotation: true, local: true })
            .scaleToObject(1.3, { considerTokenScale: true })
            .fadeIn(500)
            .fadeOut(1000)
            .scaleIn(0, 2000, { ease: "easeOutElastic" })
            .scaleOut(0, 500, { ease: "easeOutCubic" })
            .spriteOffset({ x: 0.4 * token.document.width, y: -0.1 * token.document.width }, { gridUnits: true })
            .spriteRotation(90)
            .mirrorX()
            .mirrorY()
            .filter("ColorMatrix", { hue: 250 })
            .persist()
            .name(`${token.document.name} Shadow Blade`)

            .thenDo(async () => {
                await mba.updateEffect(effect, updates)
            })

            .play()
    }
}

async function attack({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = await mba.findEffect(workflow.actor, "Shadow Blade");
    if (!effect) {
        ui.notifications.warn("Unable to find effect! (Shadow Blade)");
        return;
    }
    let evoke = effect.flags['mba-premades']?.spell?.shadowBlade?.evoke;
    if (evoke === false) {
        ui.notifications.warn("You need to evoke the Shadow Blade!");
        return false;
    }
    let light = mba.checkLight(workflow.targets.first());
    if (light === "bright") return;
    let queueSetup = await queue.setup(workflow.item.uuid, "shadowBlade", 150);
    if (!queueSetup) return;
    workflow.advantage = true;
    workflow.advReminderAttackAdvAttribution.add("ADV:Shadow Blade (target is in dim light or darkness)");
    queue.remove(workflow.item.uuid);
}

async function damage({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let type = "melee";
    if (mba.getDistance(workflow.token, target) > 5) type = "ranged";
    if (type === "melee") {
        Sequencer.EffectManager.endEffects({ name: `${workflow.token.document.name} Shadow Blade`, object: token })
        await new Sequence()

            .effect()
            .file("jb2a.greatsword.melee.fire.dark_purple")
            .attachTo(token)
            .stretchTo(target)
            .mirrorY()
            .size(1.2)
            .filter("ColorMatrix", { hue: 50 })
            .missed(!workflow.hitTargets.size)
            .waitUntilFinished()

            .play()

        await new Sequence()

            .effect()
            .file("jb2a.spiritual_weapon.longsword.01.spectral.02.orange")
            .attachTo(token, { followRotation: true, local: true })
            .scaleToObject(1.3, { considerTokenScale: true })
            .fadeIn(500)
            .fadeOut(1000)
            .scaleIn(0, 2000, { ease: "easeOutElastic" })
            .scaleOut(0, 500, { ease: "easeOutCubic" })
            .spriteOffset({ x: 0.4 * token.document.width, y: -0.1 * token.document.width }, { gridUnits: true })
            .spriteRotation(90)
            .mirrorX()
            .mirrorY()
            .filter("ColorMatrix", { hue: 250 })
            .persist()
            .name(`${token.document.name} Shadow Blade`)

            .play()
    }
    else if (type === "ranged") {
        let effect = await mba.findEffect(workflow.actor, "Shadow Blade");
        if (!effect) return;
        let updates = {
            'changes': [
            ],
            'flags': {
                'mba-premades': {
                    'spell': {
                        'shadowBlade': {
                            'evoke': false
                        }
                    }
                }
            }
        };

        new Sequence()

            .effect()
            .file("jb2a.sword.throw.blue")
            .attachTo(token)
            .stretchTo(target)
            .filter("ColorMatrix", { hue: 90 })
            .missed(!workflow.hitTargets.size)

            .play()

        await mba.updateEffect(effect, updates);
        await Sequencer.EffectManager.endEffects({ name: `${workflow.token.document.name} Shadow Blade`, object: token })
    }
}

export let shadowBlade = {
    'item': item,
    'evoke': evoke,
    'attack': attack,
    'damage': damage
}