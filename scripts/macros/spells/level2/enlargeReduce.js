import {mba} from "../../../helperFunctions.js";

export async function enlargeReduce({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (workflow.failedSaves.size != 1) return;
    await mba.playerDialogMessage();
    let selection = await mba.dialog(workflow.item.name, [["Enlarge", "enlarge"], ["Reduce", "reduce"]], `<b>Enlarge or Reduce?</b>`);
    await mba.clearPlayerDialogMessage();
    if (!selection) return;
    let target = workflow.targets.first();
    if (selection === "enlarge") {
        async function effectMacroDel() {
            await warpgate.revert(token.document, 'Enlarge/Reduce', { 'updateOpts': { 'token': { 'animate': true } } });
        }
        let effectData = {
            'name': 'Enlarge',
            'icon': 'modules/mba-premades/icons/spells/level2/enlarge_reduce1.webp',
            'origin': workflow.item.uuid,
            'description': `
                <p>Your size doubles in all dimensions, and your weight is multiplied by eight. This growth increases your size by one category: from Medium to Large, for example.</p>
                <p>If there isn't enough room for you to double your size, you attain the maximum possible size in the space available.</p>
                <p>Until the spell ends, you also have advantage on Strength checks and Strength saving throws.</p>
                <p>Your weapons also grow to match your new size. While these weapons are enlarged, your attacks with them deal 1d4 extra damage.</p>
            `,
            'duration': {
                'seconds': 60
            },
            'changes': [
                {
                    'key': 'system.bonuses.mwak.damage',
                    'mode': 2,
                    'value': '+1d4',
                    'priority': 20
                },
                {
                    'key': 'system.bonuses.rwak.damage',
                    'mode': 2,
                    'value': '+1d4',
                    'priority': 20
                },
                {
                    'key': 'flags.midi-qol.advantage.ability.check.str',
                    'mode': 2,
                    'value': 1,
                    'priority': 20
                },
                {
                    'key': 'flags.midi-qol.advantage.ability.save.str',
                    'mode': 2,
                    'value': 1,
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
                        'enlargeReduce': selection
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
        let token = {};
        let actor = {};
        let doGrow = true;
        let targetSize = target.actor.system.traits.size;
        if (targetSize != 'tiny' || targetSize != 'sm') {
            let room = mba.checkForRoom(target, 1);
            let direction = mba.findDirection(room);
            switch (direction) {
                case 'none':
                    doGrow = false;
                    break;
                case 'ne':
                    setProperty(token, 'y', target.y - canvas.grid.size);
                    break;
                case 'sw':
                    setProperty(token, 'x', target.x - canvas.grid.size);
                    break;
                case 'nw':
                    setProperty(token, 'x', target.x - canvas.grid.size);
                    setProperty(token, 'y', target.y - canvas.grid.size);
                    break;
            }
        }
        if (doGrow) {
            switch (targetSize) {
                case 'tiny':
                    setProperty(token, 'texture.scaleX', '0.8');
                    setProperty(token, 'texture.scaleY', '0.8');
                    setProperty(actor, 'system.traits.size', 'sm');
                    break;
                case 'sm':
                    setProperty(token, 'texture.scaleX', '1');
                    setProperty(token, 'texture.scaleY', '1');
                    setProperty(actor, 'system.traits.size', 'med');
                    break;
                case 'med':
                    setProperty(token, 'height', target.document.height + 1);
                    setProperty(token, 'width', target.document.width + 1);
                    setProperty(actor, 'system.traits.size', 'lg');
                    break;
                case 'lg':
                    setProperty(token, 'height', target.document.height + 1);
                    setProperty(token, 'width', target.document.width + 1);
                    setProperty(actor, 'system.traits.size', 'huge');
                    break;
                case 'huge':
                    setProperty(token, 'height', target.document.height + 1);
                    setProperty(token, 'width', target.document.width + 1);
                    setProperty(actor, 'system.traits.size', 'grg');
                    break;
                case 'grg':
                    setProperty(token, 'height', target.document.height + 1);
                    setProperty(token, 'width', target.document.width + 1);
                    break;
            }
        }
        let updates = {
            'actor': actor,
            'embedded': {
                'ActiveEffect': {
                    [effectData.name]: effectData
                }
            },
            'token': token,
        };
        let callbacks = {
            'delta': (delta, tokenDoc) => {
                if ('x' in delta.token) delete delta.token.x;
                if ('y' in delta.token) delete delta.token.y;
            }
        };
        let scale = 1;
        let size = mba.getSize(target.actor, true);
        switch (size) {
            case 'small':
                scale = 0.8;
                break;
            case 'tiny':
                scale = 0.5;
                break;
        }
        await new Sequence()

            .effect()
            .file('jb2a.static_electricity.03.orange')
            .atLocation(target)
            .scaleToObject(1)
            .duration(3000)
            .fadeIn(250)
            .fadeOut(250)
            .zIndex(2)

            .effect()
            .from(target)
            .atLocation(target)
            .scaleToObject(2)
            .duration(500)
            .scaleIn(0.25, 500)
            .fadeIn(250)
            .fadeOut(250)
            .repeats(3, 500, 500)
            .opacity(0.2)
            .zIndex(1)

            .animation()
            .on(target)
            .opacity(0)

            .effect()
            .from(target)
            .atLocation(target)
            .scaleToObject(scale)
            .loopProperty('sprite', 'position.x', { 'from': -40, 'to': 40, 'duration': 75, 'pingPong': true, 'delay': 200 })
            .duration(2000)
            .waitUntilFinished(-200)
            .zIndex(0)

            .thenDo(async () => {
                let options = {
                    'permanent': false,
                    'name': 'Enlarge/Reduce',
                    'description': 'Enlarge/Reduce',
                    'updateOpts': { 'token': { 'animate': false } }
                };
                await warpgate.mutate(target.document, updates, callbacks, options);
            })

            .wait(200)

            .effect()
            .from(target)
            .atLocation(target)
            .scaleToObject(1)
            .duration(3000)
            .scaleIn(0.25, 700, { 'ease': 'easeOutBounce' })

            .effect()
            .file('jb2a.extras.tmfx.outpulse.circle.01.fast')
            .attachTo(target)
            .scaleToObject(2)
            .belowTokens()
            .opacity(0.75)
            .zIndex(1)

            .effect()
            .file('jb2a.impact.ground_crack.orange.02')
            .atLocation(target)
            .scaleToObject(2)
            .belowTokens()
            .zIndex(0)

            .effect()
            .file('jb2a.particles.outward.orange.01.04')
            .attachTo(target)
            .scaleToObject(1.5)
            .duration(3000)
            .fadeIn(500)
            .fadeOut(1000)
            .scaleIn(0.25, 500, { 'ease': 'easeOutQuint' })
            .randomRotation()
            .zIndex(4)

            .effect()
            .file('jb2a.static_electricity.03.orange')
            .attachTo(target)
            .scaleToObject(1)
            .duration(5000)
            .fadeIn(250)
            .fadeOut(250)
            .waitUntilFinished(-3000)

            .animation()
            .on(target)
            .opacity(1)

            .play();
    }
    else if (selection === "reduce") {
        async function effectMacroDel() {
            await warpgate.revert(token.document, 'Enlarge/Reduce', { 'updateOpts': { 'token': { 'animate': true } } });
        }
        let effectData = {
            'name': 'Reduce',
            'icon': 'modules/mba-premades/icons/spells/level2/enlarge_reduce2.webp',
            'origin': workflow.item.uuid,
            'description': `
                <p>Your size is halved in all dimensions, and your weight is reduced to one-eighth of normal. This reduction decreases your size by one category: from Medium to Small, for example.</p>
                <p>Until the spell ends, you also has disadvantage on Strength checks and Strength saving throws.</p>
                <p>Your weapons also shrink to match your new size. While these weapons are reduced, your attacks with them deal 1d4 less damage (this effect can't reduce the damage below 1).</p>
            `,
            'duration': {
                'seconds': 60
            },
            'changes': [
                {
                    'key': 'system.bonuses.mwak.damage',
                    'mode': 2,
                    'value': '-1d4',
                    'priority': 20
                },
                {
                    'key': 'system.bonuses.rwak.damage',
                    'mode': 2,
                    'value': '-1d4',
                    'priority': 20
                },
                {
                    'key': 'flags.midi-qol.disadvantage.ability.check.str',
                    'mode': 0,
                    'value': '1',
                    'priority': 20
                },
                {
                    'key': 'flags.midi-qol.disadvantage.ability.save.str',
                    'mode': 0,
                    'value': '1',
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
                        'enlargeReduce': selection
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
        let token = {};
        let actor = {};
        let targetSize = target.actor.system.traits.size;
        switch (targetSize) {
            case 'tiny':
                setProperty(token, 'texture.scaleX', '0.25');
                setProperty(token, 'texture.scaleY', '0.25');
            case 'sm':
                setProperty(token, 'texture.scaleX', '0.5');
                setProperty(token, 'texture.scaleY', '0.5');
                setProperty(actor, 'system.traits.size', 'tiny');
                break;
            case 'med':
                setProperty(token, 'texture.scaleX', '0.8');
                setProperty(token, 'texture.scaleY', '0.8');
                setProperty(actor, 'system.traits.size', 'sm');
                break;
            case 'lg':
                setProperty(token, 'height', target.document.height - 1);
                setProperty(token, 'width', target.document.width - 1);
                setProperty(actor, 'system.traits.size', 'med');
                break;
            case 'huge':
                setProperty(token, 'height', target.document.height - 1);
                setProperty(token, 'width', target.document.width - 1);
                setProperty(actor, 'system.traits.size', 'lg');
                break;
            case 'grg':
                setProperty(token, 'height', target.document.height - 1);
                setProperty(token, 'width', target.document.width - 1);
                setProperty(actor, 'system.traits.size', 'huge');
                break;
        }
        let updates = {
            'actor': actor,
            'embedded': {
                'ActiveEffect': {
                    [effectData.name]: effectData
                }
            },
            'token': token,
        };
        let scale = 1;
        let size = mba.getSize(target.actor, true);
        switch (size) {
            case 'medium':
                scale = 0.8;
                break;
            case 'small':
                scale = 0.5;
                break;
            case 'tiny':
                scale = 0.25;
                break;
        }
        await new Sequence()

            .effect()
            .file('jb2a.static_electricity.03.orange')
            .atLocation(target)
            .scaleToObject(1)
            .duration(3000)
            .fadeIn(250)
            .fadeOut(250)
            .zIndex(2)

            .effect()
            .from(target)
            .atLocation(target)
            .scaleToObject(2)
            .duration(500)
            .fadeIn(250)
            .fadeOut(250)
            .scaleIn(0.25, 500)
            .repeats(3, 500, 500)
            .opacity(0.2)
            .zIndex(1)

            .animation()
            .on(target)
            .opacity(0)

            .effect()
            .from(target)
            .atLocation(target)
            .loopProperty('sprite', 'rotation', { 'from': -10, 'to': 10, 'duration': 75, 'pingPong': true, 'delay': 200 })
            .duration(2000)
            .waitUntilFinished(-200)
            .zIndex(0)

            .thenDo(async () => {
                let options = {
                    'permanent': false,
                    'name': 'Enlarge/Reduce',
                    'description': 'Enlarge/Reduce',
                    'updateOpts': { 'token': { 'animate': false } }
                };
                await warpgate.mutate(target.document, updates, {}, options);
            })

            .wait(200)

            .effect()
            .from(target)
            .atLocation(target)
            .scaleToObject(scale)
            .duration(3000)
            .scaleIn(0.25, 700, { 'ease': 'easeOutBounce' })

            .effect()
            .file('jb2a.extras.tmfx.outpulse.circle.01.fast')
            .attachTo(target)
            .opacity(0.75)
            .scaleToObject(2)
            .zIndex(1)

            .effect()
            .file('jb2a.energy_strands.in.yellow.01.2')
            .attachTo(target)
            .scaleToObject(2)
            .belowTokens()
            .zIndex(0)

            .effect()
            .file('jb2a.particles.outward.orange.01.04')
            .attachTo(target)
            .scaleToObject(1.5)
            .duration(3000)
            .fadeIn(500)
            .fadeOut(1000)
            .scaleIn(0.25, 500, { 'ease': 'easeOutQuint' })
            .randomRotation()
            .zIndex(4)

            .effect()
            .file('jb2a.static_electricity.03.orange')
            .attachTo(target)
            .scaleToObject(1)
            .duration(5000)
            .fadeIn(250)
            .fadeOut(250)
            .waitUntilFinished(-3000)

            .animation()
            .on(target)
            .opacity(1)

            .play()
    }
}