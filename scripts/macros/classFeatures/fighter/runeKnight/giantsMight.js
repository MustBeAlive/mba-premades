import {constants} from "../../../generic/constants.js";
import {mba} from "../../../../helperFunctions.js";
import {queue} from "../../../mechanics/queue.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let fighterLevel = workflow.actor.classes.fighter?.system?.levels;
    if (!fighterLevel) {
        ui.notifications.warn("Actor has no Fighter levels!");
        return;
    }
    let dieSize = 6;
    if (fighterLevel >= 10 && fighterLevel < 18) dieSize = 8;
    else if (fighterLevel >= 18) dieSize = 10;
    let description = `
        <p>If you are smaller than Large, you become Large, along with anything you are wearing. If you lack the room to become Large, your size doesn't change.</p>
        <p>You have advantage on Strength checks and Strength saving throws.</p>
        <p>Once on each of your turns, one of your attacks with a weapon or an unarmed strike can deal an extra 1d${dieSize} damage to a target on a hit.</p>
    `;
    if (fighterLevel >= 18) description = `
        <p>If you are smaller than Huge, you become Huge, along with anything you are wearing. If you lack the room to become Huge, your size doesn't change.</p>
        <p>You have advantage on Strength checks and Strength saving throws.</p>
        <p>Once on each of your turns, one of your attacks with a weapon or an unarmed strike can deal an extra 1d${dieSize} damage to a target on a hit.</p>
        <p>You reach increases by 5 feet.</p>
    `;
    async function effectMacroTurnStart() {
        let effect = await mbaPremades.helpers.findEffect(actor, "Giant's Might");
        let updates = {
            'flags': {
                'mba-premades': {
                    'feature': {
                        'giantsMight': {
                            'used': 0
                        }
                    }
                }
            }
        };
        if (effect) await mbaPremades.helpers.updateEffect(effect, updates);
    };
    async function effectMacroDel() {
        await warpgate.revert(token.document, "Giant's Might", { 'updateOpts': { 'token': { 'animate': true } } });
    };
    let effectData = {
        'name': "Giant's Might",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': description,
        'duration': {
            'seconds': 60
        },
        'changes': [
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
            },
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.giantsMight.damage,postDamageRoll',
                'priority': 20
            }
        ],
        'flags': {
            'effectmacro': {
                'onTurnStart': {
                    'script': mba.functionToString(effectMacroTurnStart)
                },
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'mba-premdaes': {
                'feature': {
                    'giantsMight': {
                        'used': 0
                    }
                }
            }
        }
    };
    if (fighterLevel >= 18) {
        effectData.changes = effectData.changes.concat(
            {
                'key': 'flags.midi-qol.range.mwak',
                'mode': 2,
                'value': '+5',
                'priority': 20
            }
        );
    }
    let target = workflow.token;
    let actorSize = target.actor.system.traits.size;
    let height = target.document.height;
    let width = target.document.width;
    let doGrow = true;
    let targetSize = mba.getSize(workflow.actor);
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
    if (doGrow) {
        if (targetSize < 4 && fighterLevel >= 18) {
            height = 3;
            width = 3;
            actorSize = "huge";
        }
        else if (targetSize < 3) {
            height = 2;
            width = 2;
            actorSize = "lg";
        }
    }
    let updates = {
        'actor': {
            'system': {
                'traits': {
                    'size': actorSize
                }
            }
        },
        'embedded': {
            'ActiveEffect': {
                [effectData.name]: effectData
            }
        },
        'token': {
            'height': height,
            'width': width
        },
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
                'name': "Giant's Might",
                'description': "Giant's Might",
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

async function damage({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = await mba.findEffect(workflow.actor, "Giant's Might");
    if (!effect) return;
    if (effect.flags['mba-premades']?.feature?.giantsMight?.used === 1) return;
    if (!constants.attacks.includes(workflow.item.system.actionType)) return;
    let queueSetup = await queue.setup(workflow.item.uuid, 'giantsMight', 215);
    if (!queueSetup) return;
    let fighterLevel = workflow.actor.classes.fighter?.system?.levels;
    if (!fighterLevel) {
        ui.notifications.warn("Actor has no Fighter levels!");
        return;
    }
    let dieSize = 6;
    if (fighterLevel >= 10 && fighterLevel < 18) dieSize = 8;
    else if (fighterLevel >= 18) dieSize = 10;
    await mba.playerDialogMessage();
    let selection = await mba.dialog("Giant's Might", constants.yesNo, `Deal extra 1d${dieSize} damage?`);
    await mba.clearPlayerDialogMessage();
    if (!selection) {
        queue.remove(workflow.item.uuid);
        return;
    }
    let oldFormula = workflow.damageRoll._formula;
    let bonusDamageFormula = `1d${dieSize}[${workflow.defaultDamageType}]`;
    if (workflow.isCritical) bonusDamageFormula = mba.getCriticalFormula(bonusDamageFormula);
    let damageFormula = oldFormula + ' + ' + bonusDamageFormula;
    let damageRoll = await new Roll(damageFormula).roll({ async: true });
    await workflow.setDamageRoll(damageRoll);
    let updates = {
        'flags': {
            'mba-premades': {
                'feature': {
                    'giantsMight': {
                        'used': 1
                    }
                }
            }
        }
    };
    if (effect) await mbaPremades.helpers.updateEffect(effect, updates);
    queue.remove(workflow.item.uuid);
}

export let giantsMight = {
    'item': item,
    'damage': damage
}