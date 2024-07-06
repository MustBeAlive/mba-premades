import {mba} from "../../../helperFunctions.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let featureData = await mba.getItemFromCompendium('mba-premades.MBA Spell Features', 'Flame Blade: Scimitar', false);
    if (!featureData) return;
    let featureData2 = await mba.getItemFromCompendium('mba-premades.MBA Spell Features', 'Flame Blade: Evoke', false);
    if (!featureData2) return;
    let damageDice = 3;
    switch (workflow.castData.castLevel) {
        case 4:
        case 5:
            damageDice = 4
            break;
        case 6:
        case 7:
            damageDice = 5
            break;
        case 8:
        case 9:
            damageDice = 6;
            break;
    }
    featureData.system.damage.parts[0][0] = damageDice + 'd6[fire]';
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Flame Blade` })
        await warpgate.revert(token.document, 'Flame Blade');
    };
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You evoke a fiery blade in your free hand. The blade is similar in size and shape to a scimitar, and it lasts for the duration.</p>
            <p>If you let go of the blade, it disappears, but you can evoke the blade again as a bonus action.</p>
            <p>You can use your action to make a melee spell attack with the fiery blade. On a hit, the target takes ${damageDice}d6 fire damage.</p>
            <p>The flaming blade sheds bright light in a 10-foot radius and dim light for an additional 10 feet.</p>
        `,
        'duration': {
            'seconds': 600
        },
        'changes': [
            {
                'key': 'ATL.light.dim',
                'mode': 4,
                'value': '20',
                'priority': 20
            },
            {
                'key': 'ATL.light.bright',
                'mode': 4,
                'value': '10',
                'priority': 20
            },
            {
                'key': 'ATL.light.color',
                'mode': 5,
                'value': "#ff7300",
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
                'value': "0.2",
                'priority': 20
            },
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'mba-premades': {
                'spell': {
                    'flameBlade': {
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
        'name': 'Flame Blade',
        'description': 'Flame Blade'
    };

    await new Sequence()

        .wait(500)

        .effect()
        .file("jb2a.impact.fire.01.orange")
        .attachTo(workflow.token)
        .scaleToObject(2.5)
        .fadeOut(1000, { ease: "easeInExpo" })

        .wait(100)

        .effect()
        .file("jb2a.ground_cracks.orange.02")
        .atLocation(workflow.token)
        .fadeIn(500, { ease: "easeOutCirc" })
        .fadeOut(1000, { ease: "easeOutQuint" })
        .duration(6000)
        .opacity(1)
        .randomRotation()
        .belowTokens()
        .scaleToObject(1.5)
        .zIndex(0.2)

        .effect()
        .file("jb2a.particles.outward.orange.01.03")
        .attachTo(workflow.token)
        .scaleToObject(2)
        .duration(6000)
        .fadeIn(250, { ease: "easeOutQuint" })
        .fadeOut(1000, { ease: "easeOutQuint" })
        .scaleIn(0, 200, { ease: "easeOutCubic" })
        .opacity(1)
        .filter("ColorMatrix", { saturate: 0, brightness: 1 })
        .randomRotation()

        .effect()
        .file("jb2a.spiritual_weapon.scimitar.01.spectral.02.orange")
        .attachTo(workflow.token, { followRotation: true, local: true })
        .scaleToObject(1.3, { considerTokenScale: true })
        .fadeIn(500)
        .fadeOut(1000)
        .scaleIn(0, 2000, { ease: "easeOutElastic" })
        .scaleOut(0, 500, { ease: "easeOutCubic" })
        .spriteOffset({ x: 0.35 * workflow.token.document.width, y: -0.1 * workflow.token.document.width }, { gridUnits: true })
        .spriteRotation(-90)
        .persist()
        .name(`${workflow.token.document.name} Flame Blade`)

        .thenDo(async () => {
            await warpgate.mutate(workflow.token.document, updates, {}, options);
        })

        .play()

}

async function evoke({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = await mba.findEffect(workflow.actor, "Flame Blade");
    if (!effect) {
        ui.notifications.warn("Unable to find the effec! (Flame Blade)");
        return;
    }
    let evoke = effect.flags['mba-premades']?.spell?.flameBlade?.evoke;
    let updates;
    if (evoke === true) {
        updates = {
            'changes': [
            ],
            'flags': {
                'mba-premades': {
                    'spell': {
                        'flameBlade': {
                            'evoke': false
                        }
                    }
                }
            }
        };
        await mba.updateEffect(effect, updates);
        await Sequencer.EffectManager.endEffects({ name: `${workflow.token.document.name} Flame Blade`, object: token })
    }
    else if (evoke === false) {
        updates = {
            'changes': [
                {
                    'key': 'ATL.light.dim',
                    'mode': 4,
                    'value': '20',
                    'priority': 20
                },
                {
                    'key': 'ATL.light.bright',
                    'mode': 4,
                    'value': '10',
                    'priority': 20
                },
                {
                    'key': 'ATL.light.color',
                    'mode': 5,
                    'value': "#ff7300",
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
                    'value': "0.2",
                    'priority': 20
                },
            ],
            'flags': {
                'mba-premades': {
                    'spell': {
                        'flameBlade': {
                            'evoke': true
                        }
                    }
                }
            }
        };
        await new Sequence()

            .effect()
            .file("jb2a.impact.fire.01.orange")
            .attachTo(token)
            .scaleToObject(2.5)
            .fadeOut(1000, { ease: "easeInExpo" })

            .wait(100)

            .effect()
            .file("jb2a.ground_cracks.orange.02")
            .atLocation(token)
            .fadeIn(500, { ease: "easeOutCirc" })
            .fadeOut(1000, { ease: "easeOutQuint" })
            .duration(6000)
            .opacity(1)
            .randomRotation()
            .belowTokens()
            .scaleToObject(1.5)
            .zIndex(0.2)

            .effect()
            .file("jb2a.particles.outward.orange.01.03")
            .attachTo(token)
            .scaleToObject(2)
            .duration(6000)
            .fadeIn(250, { ease: "easeOutQuint" })
            .fadeOut(1000, { ease: "easeOutQuint" })
            .scaleIn(0, 200, { ease: "easeOutCubic" })
            .opacity(1)
            .filter("ColorMatrix", { saturate: 0, brightness: 1 })
            .randomRotation()

            .effect()
            .file("jb2a.spiritual_weapon.scimitar.01.spectral.02.orange")
            .attachTo(token, { followRotation: true, local: true })
            .scaleToObject(1.3, { considerTokenScale: true })
            .fadeIn(500)
            .fadeOut(1000)
            .scaleIn(0, 2000, { ease: "easeOutElastic" })
            .scaleOut(0, 500, { ease: "easeOutCubic" })
            .spriteOffset({ x: 0.35 * token.document.width, y: -0.1 * token.document.width }, { gridUnits: true })
            .spriteRotation(-90)
            .persist()
            .name(`${token.document.name} Flame Blade`)

            .thenDo(async () => {
                await mba.updateEffect(effect, updates)
            })

            .play()
    }
}

async function attack({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = await mba.findEffect(workflow.actor, "Flame Blade");
    if (!effect) {
        ui.notifications.warn("Unable to find the effec! (Flame Blade)");
        return;
    }
    let evoke = effect.flags['mba-premades']?.spell?.flameBlade?.evoke;
    if (evoke === true) return;
    ui.notifications.warn("You need to evoke the Flame Blade!");
    return false;
}

async function damage({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    Sequencer.EffectManager.endEffects({ name: `${workflow.token.document.name} Flame Blade`, object: token })
    await new Sequence()

        .effect()
        .file("jb2a.greatsword.melee.fire.orange")
        .attachTo(token)
        .stretchTo(target)
        .mirrorY()
        .size(1.2)
        .missed(!workflow.hitTargets.size)
        .waitUntilFinished(-1000)

        .effect()
        .file("jb2a.impact.fire.01.orange")
        .attachTo(target)
        .scaleToObject(2 * target.document.texture.scaleX)
        .missed(!workflow.hitTargets.size)

        .play()

    await new Sequence()

        .effect()
        .file("jb2a.spiritual_weapon.scimitar.01.spectral.02.orange")
        .attachTo(token, { followRotation: true, local: true })
        .scaleToObject(1.3, { considerTokenScale: true })
        .delay(600)
        .fadeIn(500)
        .fadeOut(1000)
        .scaleIn(0, 2000, { ease: "easeOutElastic" })
        .scaleOut(0, 500, { ease: "easeOutCubic" })
        .spriteOffset({ x: 0.35 * token.document.width, y: -0.1 * token.document.width }, { gridUnits: true })
        .spriteRotation(-90)
        .persist()
        .name(`${token.document.name} Flame Blade`)

        .play()
}

export let flameBlade = {
    'item': item,
    'evoke': evoke,
    'attack': attack,
    'damage': damage
}