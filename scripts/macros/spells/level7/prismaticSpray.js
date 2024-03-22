//rework banishment
export async function prismaticSpray({speaker, actor, token, character, item, args, scope, workflow}) {
    let targets = Array.from(workflow.targets);
    let saves = Array.from(workflow.saves);
    let animation;
    let damage = async (damageType, rayColor, target, saved, animation) => {
        let damageRoll
        if (saved) damageRoll = await new Roll(`10d6/2[${damageType}]`).roll(); //math.min?
        else damageRoll = await new Roll(`10d6[${damageType}]`).roll();
        ChatMessage.create({ flavor: `Prismatic spray (${rayColor}) damaged ${target.document.name} for ${damageRoll.total} ${damageType} damage.`, speaker: ChatMessage.getSpeaker({ actor: target.actor}) });
        await chrisPremades.helpers.applyDamage([target], damageRoll.total, damageType);
        new Sequence().effect().atLocation(workflow.token).stretchTo(target).file(animation).play();
    }

    for (let i = 0; i < targets.length; i++) {
        let target = targets[i];
        let saved = saves.includes(target);
        let effects = [(await new Roll("1d8").roll()).total];
        if (effects[0] === 8) { effects = [(await new Roll("1d7").roll()).total, (await new Roll("1d7").roll()).total]; }
        for (let effect of effects) {
        switch (effect) {
            case 1:
                animation = 'jb2a.scorching_ray.01.red';
                await damage("fire", "Red", target, saved, animation);
                break;
            case 2:
                animation = 'jb2a.scorching_ray.01.orange';
                await damage("acid", "Orange", target, saved, animation);
                break;
            case 3:
                animation = 'jb2a.scorching_ray.01.yellow';
                await damage("lightning", "Yellow", target, saved, animation);
                break;
            case 4:
                animation = 'jb2a.scorching_ray.01.green';;
                await damage("poison", "Green", target, saved, animation);
                break;
            case 5:
                animation = 'jb2a.scorching_ray.01.blue';
                await damage("cold", "Blue", target, saved, animation);
                break;
            case 6:
                if (saved) break;
                let alreadyRestrained = chrisPremades.helpers.findEffect(target.actor, 'Prismatic Spray: Indigo');
                if (alreadyRestrained) break;
                rayColor = "Indigo";
                animation = 'jb2a.scorching_ray.01.pink';
                async function effectMacro1() {
                    let effect = chrisPremades.helpers.findEffect(actor, 'Prismatic Spray: Indigo');
                    let success = effect.flags['mba-premades']?.spell?.prismaticSpray?.success;
                    let fail = effect.flags['mba-premades']?.spell?.prismaticSpray?.fail;
                    let spellDC = effect.flags['mba-premades']?.spell?.prismaticSpray?.dc;
                    let saveRoll = await chrisPremades.helpers.rollRequest(token, 'save', 'con');
                    if (saveRoll.total < spellDC) {
                        fail += 1;
                        let updates = {
                            'flags': {
                                'mba-premades': {
                                    'spell': {
                                        'prismaticSpray': {
                                            'fail': fail
                                        }
                                    }
                                }
                            }
                        };
                        await chrisPremades.helpers.updateEffect(effect, updates);
                    } else {
                        success += 1;
                        let updates = {
                            'flags': {
                                'mba-premades': {
                                    'spell': {
                                        'prismaticSpray': {
                                            'success': success
                                        }
                                    }
                                }
                            }
                        };
                        await chrisPremades.helpers.updateEffect(effect, updates);
                    }
                    if (effect.flags['mba-premades']?.spell?.prismaticSpray?.success > 2) {
                        await chrisPremades.helpers.removeEffect(effect);
                    }
                    if (effect.flags['mba-premades']?.spell?.prismaticSpray?.fail > 2) {
                        await chrisPremades.helpers.removeEffect(effect);
                        await chrisPremades.helpers.addCondition(actor, 'Petrified');
                    }
                };
                let restrainData = {
                    'name': "Prismatic Spray: Indigo",
                    'icon': "assets/library/icons/sorted/spells/level7/prismatic_spray.webp",
                    'origin': workflow.item.uuid,
                    'description': "",
                    'changes': [
                        {
                            'key': 'macro.CE',
                            'mode': 0,
                            'value': 'Restrained',
                            'priority': 20
                        }
                    ],
                    'flags': {
                        'dae': {
                            'showIcon': true
                        },
                        'mba-premades': {
                            'spell': {
                                'prismaticSpray': {
                                    'dc': chrisPremades.helpers.getSpellDC(workflow.item),
                                    'success': 0,
                                    'fail': 0
                                }
                            }
                        },
                        'effectmacro': {
                            'onTurnEnd': {
                                'script': chrisPremades.helpers.functionToString(effectMacro1)
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
                await chrisPremades.helpers.createEffect(target.actor, restrainData);
                ChatMessage.create({ flavor: `Prismatic spray - ${rayColor} restrained ${target.document.name}`, speaker: ChatMessage.getSpeaker({ actor: target.actor}) });
                new Sequence().effect().atLocation(workflow.token).stretchTo(target).file(animation).play();
                break;
            case 7: // Promts at wrong time, find a way to promt on source turn start
                if (saved) break;
                let alreadyBlinded = chrisPremades.helpers.findEffect(target.actor, 'Prismatic Spray: Violet');
                if (alreadyBlinded) break;
                rayColor = "Purple";
                animation = 'jb2a.scorching_ray.01.purple';
                async function effectMacro2() {
                    let effect = chrisPremades.helpers.findEffect(actor, 'Prismatic Spray: Violet');
                    let spellDC = effect.flags['mba-premades']?.spell?.prismaticSpray?.dc;
                    let saveRoll = await chrisPremades.helpers.rollRequest(token, 'save', 'wis');
                    if (saveRoll.total < spellDC) {
                        new Sequence()
                            .effect()
                            .file("jb2a.divine_smite.caster.dark_purple")
                            .atLocation(token)
                            .scaleToObject(2.5)
                            .duration(3000)

                            .effect()
                            .file("jb2a.divine_smite.target.dark_purple")
                            .atLocation(token)
                            .delay(2300)
                            .duration(2300)
                            .scaleToObject(3)

                            .effect()
                            .file("jb2a.portals.horizontal.vortex.purple")
                            .atLocation(token)
                            .scaleToObject(2.5)
                            .delay(2900)
                            .fadeIn(500)
                            .fadeOut(1500)
                            .waitUntilFinished()
                            .play();
                        await warpgate.wait(3500);
                        await token.document.update({ hidden: true });
                        await chrisPremades.helpers.removeEffect(effect); 
                        ChatMessage.create({ content: token.document.name + " was banished!" });
                    } else {
                        await chrisPremades.helpers.removeEffect(effect);
                        return;
                    }
                };
                let blindData = {
                    'name': "Prismatic Spray: Violet",
                    'icon': "assets/library/icons/sorted/spells/level7/prismatic_spray.webp",
                    'origin': workflow.item.uuid,
                    'description': "",
                    'changes': [
                        {
                            'key': 'macro.CE',
                            'mode': 0,
                            'value': 'Blinded',
                            'priority': 20
                        }
                    ],
                    'flags': {
                        'dae': {
                            'showIcon': true
                        },
                        'mba-premades': {
                            'spell': {
                                'prismaticSpray': {
                                    'dc': chrisPremades.helpers.getSpellDC(workflow.item),
                                }
                            }
                        },
                        'effectmacro': {
                            'onTurnStart': {
                                'script': chrisPremades.helpers.functionToString(effectMacro2)
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
                await chrisPremades.helpers.createEffect(target.actor, blindData);
                ChatMessage.create({ flavor: `Prismatic spray (${rayColor}) blinded ${target.document.name}`, speaker: ChatMessage.getSpeaker({ actor: target.actor}) });
                new Sequence().effect().atLocation(workflow.token).stretchTo(target).file(animation).play();
                break;
        }
        }
    }
}