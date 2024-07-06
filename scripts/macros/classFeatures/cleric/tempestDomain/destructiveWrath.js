import {mba} from "../../../../helperFunctions.js";
import {queue} from "../../../mechanics/queue.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let CDItem = await mba.getItem(workflow.actor, "Channel Divinity");
    if (!CDItem) {
        ui.notifications.warn("Unable to find feature! (Channel Divinity)");
        return;
    }
    let uses = CDItem.system.uses.value;
    if (uses < 1) {
        ui.notifications.info("You don't have any Channel Divinity uses left!");
        return;
    }
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} DesWra` })
    }
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You will deal maximum damage on your next instance of lightning or thunder damage, instead of rolling.</p>
        `,
        'changes': [
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.destructiveWrath.item,postDamageRoll',
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ["1Action"]
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };
    
    await new Sequence()

        .effect()
        .file("animated-spell-effects-cartoon.level 01.divine favour.purple")
        .attachTo(workflow.token)
        .scaleToObject(1.5 * workflow.token.document.texture.scaleX)
        .waitUntilFinished(-700)

        .effect()
        .file("animated-spell-effects-cartoon.energy.12")
        .atLocation(workflow.token)
        .fadeIn(500)
        .fadeOut(750)
        .scaleToObject(1.4 * workflow.token.document.texture.scaleX)
        .playbackRate(0.9)
        .waitUntilFinished(-400)

        .effect()
        .file("animated-spell-effects-cartoon.electricity.ball.06")
        .attachTo(workflow.token)
        .scaleToObject(2.2 * workflow.token.document.texture.scaleX)
        .fadeIn(500)
        .fadeOut(500)
        .duration(2800)
        .playbackRate(0.9)

        .thenDo(async () => {
            await mba.createEffect(workflow.actor, effectData);
            await CDItem.update({ "system.uses.value": uses -= 1 });
        })

        //Boom 1
        .effect()
        .file("jb2a.lightning_strike.blue.0")
        .atLocation(workflow.token, { offset: { x: 0, y: -1.1 }, gridUnits: true })
        .scaleToObject(5 * workflow.token.document.texture.scaleX)

        .effect()
        .file("animated-spell-effects-cartoon.electricity.23")
        .atLocation(workflow.token, { offset: { x: 0, y: -1.1 }, gridUnits: true })
        .scaleToObject(2)

        //Line 1
        .effect()
        .file("animated-spell-effects-cartoon.electricity.24")
        .delay(250)
        .from(workflow.token, { offset: { x: 0, y: -1.1 }, gridUnits: true })
        .rotateTowards(workflow.token)
        .rotate(-17)
        .scaleToObject(3)

        //Boom 3
        .effect()
        .file("jb2a.lightning_strike.blue.0")
        .delay(500)
        .atLocation(workflow.token, { offset: { x: -0.6, y: 0.9 }, gridUnits: true })
        .scaleToObject(5 * workflow.token.document.texture.scaleX)

        .effect()
        .file("animated-spell-effects-cartoon.electricity.23")
        .delay(500)
        .atLocation(workflow.token, { offset: { x: -0.6, y: 0.9 }, gridUnits: true })
        .scaleToObject(2)

        //Line 3
        .effect()
        .file("animated-spell-effects-cartoon.electricity.24")
        .delay(750)
        .from(workflow.token, { offset: { x: -0.6, y: 0.9 }, gridUnits: true })
        .rotateTowards(workflow.token)
        .rotate(-17)
        .scaleToObject(3)

        //Boom 5
        .effect()
        .file("jb2a.lightning_strike.blue.0")
        .delay(1000)
        .atLocation(workflow.token, { offset: { x: 1, y: -0.3 }, gridUnits: true })
        .scaleToObject(5 * workflow.token.document.texture.scaleX)

        .effect()
        .file("animated-spell-effects-cartoon.electricity.23")
        .delay(1000)
        .atLocation(workflow.token, { offset: { x: 1, y: -0.3 }, gridUnits: true })
        .scaleToObject(2)

        //Line 5
        .effect()
        .file("animated-spell-effects-cartoon.electricity.24")
        .delay(1250)
        .from(workflow.token, { offset: { x: 1, y: -0.3 }, gridUnits: true })
        .rotateTowards(workflow.token)
        .rotate(-17)
        .scaleToObject(3)

        //Boom 2
        .effect()
        .file("jb2a.lightning_strike.blue.0")
        .delay(1500)
        .atLocation(workflow.token, { offset: { x: -1, y: -0.3 }, gridUnits: true })
        .scaleToObject(5 * workflow.token.document.texture.scaleX)

        .effect()
        .file("animated-spell-effects-cartoon.electricity.23")
        .delay(1500)
        .atLocation(workflow.token, { offset: { x: -1, y: -0.3 }, gridUnits: true })
        .scaleToObject(2)

        //Line 2
        .effect()
        .file("animated-spell-effects-cartoon.electricity.24")
        .delay(1750)
        .from(workflow.token, { offset: { x: -1, y: -0.3 }, gridUnits: true })
        .rotateTowards(workflow.token)
        .rotate(-17)
        .scaleToObject(3)

        //Boom 4
        .effect()
        .file("jb2a.lightning_strike.blue.0")
        .delay(2000)
        .atLocation(workflow.token, { offset: { x: 0.6, y: 0.9 }, gridUnits: true })
        .scaleToObject(5 * workflow.token.document.texture.scaleX)

        .effect()
        .file("animated-spell-effects-cartoon.electricity.23")
        .delay(2000)
        .atLocation(workflow.token, { offset: { x: 0.6, y: 0.9 }, gridUnits: true })
        .scaleToObject(2)

        //Line 4
        .effect()
        .file("animated-spell-effects-cartoon.electricity.24")
        .delay(2250)
        .from(workflow.token, { offset: { x: 0.6, y: 0.9 }, gridUnits: true })
        .rotateTowards(workflow.token)
        .scaleToObject(3)

        .effect()
        .file("animated-spell-effects-cartoon.electricity.discharge.08")
        .delay(2400)
        .attachTo(workflow.token)
        .scaleToObject(4 * workflow.token.document.texture.scaleX)
        .waitUntilFinished(-1700)

        .effect()
        .file("jb2a.static_electricity.01.blue")
        .attachTo(workflow.token)
        .scaleToObject(1.2 * workflow.token.document.texture.scaleX)
        .fadeIn(300)
        .fadeOut(500)
        .playbackRate(0.9)
        .persist()
        .name(`${workflow.token.document.name} DesWra`)

        .play()
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let queueSetup = await queue.setup(workflow.item.uuid, 'destructiveWrath', 351);
    if (!queueSetup) return;
    let oldDamageRoll = workflow.damageRoll;
    if (oldDamageRoll.terms.length === 0) {
        queue.remove(workflow.item.uuid);
        return;
    }
    let newDamageRoll = '';
    for (let i = 0; oldDamageRoll.terms.length > i; i++) {
        let flavor = oldDamageRoll.terms[i].flavor;
        let isDeterministic = oldDamageRoll.terms[i].isDeterministic;
        if (!(flavor.toLowerCase() === 'lightning' || flavor.toLowerCase() === 'thunder') || isDeterministic === true) {
            newDamageRoll += oldDamageRoll.terms[i].formula;
        } else {
            newDamageRoll += '(' + oldDamageRoll.terms[i].number + '*' + oldDamageRoll.terms[i].faces + ')[' + flavor + ']';
        }
    }
    let damageRoll = await new Roll(newDamageRoll).roll({async: true});
    await workflow.setDamageRoll(damageRoll);
    queue.remove(workflow.item.uuid);
}


export let destructiveWrath = {
    'cast': cast,
    'item': item
}