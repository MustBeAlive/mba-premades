import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

// To do: everything, I guess

async function magicalGift({ speaker, actor, token, character, item, args, scope, workflow }) {
    let choices = [
        ['Charm of Nine Lives', 'nine'],
        ['Charm of the Crystal Heart', 'heart'],
        ['Charm of the Ghoul', 'ghoul'],
        ['Charm of the Maimed', 'maimed'],
        ['Charm of the Swollen Hag', 'hag'],
        ['Charm of Treasure Sense', 'treasure']
    ];
    await mba.gmDialogMessage();
    let selection = await mba.dialog('Magical Gift', choices, `Which charm would you like to bestow?`);
    await mba.clearGMDialogMessage();
    if (!selection) return;
    let target = workflow.targets.first();
    if (selection === "nine") {
        let livesLeft = 9;
        let effectData = {
            'name': "Charm of the Nine Lives",
            'icon': "icons/creatures/mammals/cat-hunched-glowing-red.webp",
            'origin': workflow.item.uuid,
            'description': `
                <p>You were bestowed with charm of Nine Lives.</p>
                <p>When you drop to 0 hit points as a result of taking damage, you can choose to drop to 1 hit point instead. Once used nine times, the charm goes away.</p>
                <p><b>Lives left: ${livesLeft}</b></p>
            `,
            'flags': {
                'dae': {
                    'showIcon': true,
                },
                'mba-premades': {
                    'feature': {
                        'nineLives': {
                            'livesLeft': livesLeft
                        }
                    }
                }
            }
        };
        let offset = [
            { x: 0, y: -0.55 },
            { x: -0.5, y: -0.15 },
            { x: -0.3, y: 0.45 },
            { x: 0.3, y: 0.45 },
            { x: 0.5, y: -0.15 }
        ];
        await new Sequence()

            .wait(500)

            .effect()
            .file("jb2a.icon.runes.orange")
            .attachTo(target, { offset: offset[0], gridUnits: true, followRotation: false })
            .scaleToObject(0.5)
            .scaleIn(0, 250, { ease: "easeOutBack" })
            .fadeIn(300)
            .fadeOut(500)
            .zIndex(1)
            .duration(5900)
            .aboveLighting()

            .effect()
            .file("jb2a.icon.runes.orange")
            .delay(600)
            .attachTo(target, { offset: offset[1], gridUnits: true, followRotation: false })
            .scaleToObject(0.5)
            .scaleIn(0, 250, { ease: "easeOutBack" })
            .fadeIn(300)
            .fadeOut(500)
            .zIndex(1)
            .duration(5300)
            .aboveLighting()

            .effect()
            .file("jb2a.icon.runes.orange")
            .delay(1200)
            .attachTo(target, { offset: offset[2], gridUnits: true, followRotation: false })
            .scaleToObject(0.5)
            .scaleIn(0, 250, { ease: "easeOutBack" })
            .fadeIn(300)
            .fadeOut(500)
            .zIndex(1)
            .duration(4700)
            .aboveLighting()

            .effect()
            .file("jb2a.icon.runes.orange")
            .delay(1800)
            .attachTo(target, { offset: offset[3], gridUnits: true, followRotation: false })
            .scaleToObject(0.5)
            .scaleIn(0, 250, { ease: "easeOutBack" })
            .fadeIn(300)
            .fadeOut(500)
            .zIndex(1)
            .duration(4100)
            .aboveLighting()

            .effect()
            .file("jb2a.icon.runes.orange")
            .delay(2400)
            .attachTo(target, { offset: offset[4], gridUnits: true, followRotation: false })
            .scaleToObject(0.5)
            .scaleIn(0, 250, { ease: "easeOutBack" })
            .fadeIn(300)
            .fadeOut(500)
            .zIndex(1)
            .duration(3500)
            .aboveLighting()

            .effect()
            .delay(3000)
            .file("jb2a.swirling_sparkles.01.yellow")
            .atLocation(target)
            .fadeIn(500)
            .scaleToObject(1.7 * target.document.texture.scaleX)
            .waitUntilFinished(-1500)

            .effect()
            .file("jb2a.particles.swirl.orange.02.01")
            .fadeIn(1000)
            .fadeOut(700)
            .atLocation(target)
            .scaleToObject(1.7 * target.document.texture.scaleX)
            .duration(8300)

            .effect()
            .file("jb2a.magic_signs.rune.abjuration.complete.orange")
            .fadeIn(1500)
            .fadeOut(700)
            .attachTo(target)
            .scaleToObject(1.2)
            .aboveInterface()

            .wait(700)

            .thenDo(async () => {
                await mba.createEffect(target.actor, effectData)
            })

            .play();

        return;
    }
    else if (selection === "heart") {
        let effectData = {
            'name': "Charm of the Crystal Heart",
            'icon': "icons/magic/defensive/shield-barrier-blades-teal.webp",
            'description': `
                <p>You were bestowed with charm of Crystal Heart.</p>
                <p>This charm grants you immunity to piercing and slashing damage from nonmagical attacks, but you gain vulnerability to bludgeoning damage.</p>
                <p>These effects last for 10 days, after which the charm vanishes from you.</p>
            `,
            'duration': {
                'seconds': 864000
            },
            'changes': [
                {
                    'key': "system.traits.dv.value",
                    'mode': 2,
                    'value': 'bludgeoning',
                    'priority': 20
                },
                {
                    'key': "system.traits.dr.value",
                    'mode': 2,
                    'value': 'piercing',
                    'priority': 20
                },
                {
                    'key': "system.traits.dr.value",
                    'mode': 2,
                    'value': 'slashing',
                    'priority': 20
                }
            ]
        };
        await mba.createEffect(target.actor, effectData);
        return;
    }
    else if (selection === "ghoul") {
        let ghoulData = await mba.getItemFromCompendium('mba-premades.MBA Monster Features', 'Charm of the Ghoul', false);
        let updates = {
            'embedded': {
                'Item': {
                    [ghoulData.name]: ghoulData
                }
            }
        }
        await warpgate.mutate(target.document, updates);
        return;
    }
    else if (selection === "maimed") {
        let maimData = await mba.getItemFromCompendium('mba-premades.MBA Monster Features', 'Charm of the Maimed', false);
        let updates = {
            'embedded': {
                'Item': {
                    [maimData.name]: maimData
                }
            }
        }
        await warpgate.mutate(target.document, updates);
    }
    else if (selection === "hag") {
        let hagData = await mba.getItemFromCompendium('mba-premades.MBA Monster Features', 'Charm of the Swollen Hag', false);
        let updates = {
            'embedded': {
                'Item': {
                    [hagData.name]: hagData
                }
            }
        }
        await warpgate.mutate(target.document, updates);
    }
    else if (selection === "treasure") {
        ui.notifications.info("Under construction!");
        return;
    }
}

async function nineLives(token, { item, workflow, ditem }) {
    let effect = mba.findEffect(token.actor, 'Charm of the Nine Lives');
    if (!effect) return;
    let livesLeft = effect.flags['mba-premades']?.feature?.nineLives?.livesLeft;
    let queueSetup = await queue.setup(workflow.uuid, 'nineLives', 390);
    if (!queueSetup) return;
    if (ditem.newHP != 0) {
        queue.remove(workflow.uuid);
        return;
    }
    ditem.newHP = 1;
    livesLeft -= 1;
    ditem.hpDamage = Math.abs(ditem.newHP - ditem.oldHP);
    queue.remove(workflow.uuid);
    let updates = {
        'description': `
            <p>You were bestowed with charm of Nine Lives.</p>
            <p>When you drop to 0 hit points as a result of taking damage, you can choose to drop to 1 hit point instead. Once used nine times, the charm goes away.</p>
            <p><b>Lives left: ${livesLeft}</b></p>
        `,
        'flags': {
            'mba-premades': {
                'feature': {
                    'nineLives': {
                        'livesLeft': livesLeft
                    }
                }
            }
        }
    };

    new Sequence()

        .effect()
        .file("jb2a.particles.swirl.orange.02.01")
        .atLocation(token)
        .scaleToObject(1.7 * token.document.texture.scaleX)
        .duration(8300)
        .fadeIn(1000)
        .fadeOut(700)

        .effect()
        .file("jb2a.magic_signs.rune.abjuration.complete.orange")
        .attachTo(token)
        .scaleToObject(1.2)
        .fadeIn(1500)
        .fadeOut(700)
        .aboveInterface()

        .thenDo(async () => {
            if (livesLeft < 1) await mba.removeEffect(effect);
            else await mba.updateEffect(effect, updates);
        })

        .play()
}

async function ghoul({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let type = mba.raceOrType(target.actor);
    if (type != 'humanoid') {
        ui.notifications.warn('Charm of the Ghoul works only on humanoid targets!');
        return;
    }
    if (target.actor.system.attributes.hp.value > 1) {
        ui.notifications.warn('Target is alive!');
        return;
    }
    let damageFormula = '3d8' + '+3';
    let damageRoll = await new Roll(damageFormula).roll({ 'async': true });
    damageRoll.toMessage({
        rollMode: 'roll',
        speaker: { 'alias': name },
        flavor: workflow.item.name
    });
    await mba.applyDamage([workflow.actor], damageRoll.total, 'healing');

    const feature = actor.items.getName('Charm of the Ghoul');
    if (feature.system.uses.value < 1) {
        const itemName = "Charm of the Ghoul";
        const items = actor.items.filter(i => i.name === itemName);
        for (const i of items) await i?.delete()
    }
}

async function maimed({ speaker, actor, token, character, item, args, scope, workflow }) {
    let feature = mba.getItem(actor, "Charm of the Maimed");
    if (!feature) {
        ui.notifications.warn("Unable to find feature! (Charm of the Maimed)");
        return;
    }
    if (feature.system.uses.value > 0) return;
    await feature.delete();
}

export let chwinga = {
    'magicalGift': magicalGift,
    'nineLives': nineLives,
    'ghoul': ghoul,
    'maimed': maimed
}