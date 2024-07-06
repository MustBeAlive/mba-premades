import {mba} from "../../../helperFunctions.js";
import {queue} from "../../mechanics/queue.js";

async function enlarge({ speaker, actor, token, character, item, args, scope, workflow }) {
    async function effectMacroDel() {
        await warpgate.revert(token.document, "Duergar Enlarge", { 'updateOpts': { 'token': { 'animate': true } } });
    };
    let effectData = {
        'name': "Duergar: Enlarge",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>For 1 minute, the duergar magically increases in size, along with anything it is wearing or carrying.</p>
            <p>While enlarged, the duergar is Large, doubles its damage dice on Strength-based weapon attacks, and makes Strength checks and Strength saving throws with advantage.</p>
            <p>If the duergar lacks the room to become Large, it attains the maximum size possible in the space available.</p>
        `,
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
                'value': 'function.mbaPremades.macros.monsters.duergar.damage,postDamageRoll',
                'priority': 20
            }
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };
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
        height = 2;
        width = 2;
        actorSize = "lg";
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
        .scaleToObject(1)
        .loopProperty('sprite', 'position.x', { 'from': -40, 'to': 40, 'duration': 75, 'pingPong': true, 'delay': 200 })
        .duration(2000)
        .waitUntilFinished(-200)
        .zIndex(0)

        .thenDo(async () => {
            let options = {
                'permanent': false,
                'name': "Duergar Enlarge",
                'description': "Duergar Enlarge",
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
    if (!workflow.hitTargets.size || workflow.item.type != "weapon") return;
    let isFin = workflow.item.system.properties.fin;
    if (isFin) {
        let str = workflow.actor.system.abilities.str.value;
        let dex = workflow.actor.system.abilities.dex.value;
        if (str < dex) return;
    }
    let queueSetup = await queue.setup(workflow.item.uuid, "duergarEnlarge", 50);
    if (!queueSetup) return;
    let diceNum = workflow.damageRoll.terms[0].number * 2;
    let damageFormula = diceNum + workflow.damageRoll._formula.substring(1);
    let damageRoll = await mba.damageRoll(workflow, damageFormula, undefined, true);
    await workflow.setDamageRoll(damageRoll);
    queue.remove(workflow.item.uuid);
}

function resilience(saveId, options) {
    if (saveId === 'con') return { 'label': '<u>Duergar Resilience:</u><br>Are you saving against being Poisoned or Paralyzed?<br>(ask GM)', 'type': 'advantage' };
    else if (saveId === 'wis') return { 'label': '<u>Psionic Fortitude:</u><br>Are you saving against being Charmed?<br>(ask GM)', 'type': 'advantage' };
    else return false;
}

export let duergar = {
    'enlarge': enlarge,
    'damage': damage,
    'resilience': resilience
}