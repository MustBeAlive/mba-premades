async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    async function effectMacroDel() {
        await Sequencer.EffectManager.endEffects({ name: `${token.document.name} Destructive Wrath`, object: token })
    }
    let effectData = {
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
                    'script': chrisPremades.helpers.functionToString(effectMacroDel)
                }
            }
        }
    };
    await new Sequence()

        .effect()
        .file("animated-spell-effects-cartoon.level 01.divine favour.purple")
        .attachTo(token)
        .scaleToObject(1.5 * token.document.texture.scaleX)
        .waitUntilFinished(-700)

        .effect()
        .file("animated-spell-effects-cartoon.energy.12")
        .atLocation(token)
        .fadeIn(500)
        .fadeOut(750)
        .scaleToObject(1.4 * token.document.texture.scaleX)
        .playbackRate(0.9)
        .waitUntilFinished(-400)

        .effect()
        .file("animated-spell-effects-cartoon.electricity.ball.06")
        .attachTo(token)
        .scaleToObject(2.2 * token.document.texture.scaleX)
        .fadeIn(500)
        .fadeOut(500)
        .duration(2800)
        .playbackRate(0.9)

        //Boom 1
        .effect()
        .file("jb2a.lightning_strike.blue.0")
        .atLocation(token, { offset: { x: 0, y: -1.1 }, gridUnits: true })
        .scaleToObject(5 * token.document.texture.scaleX)

        .effect()
        .file("animated-spell-effects-cartoon.electricity.23")
        .atLocation(token, { offset: { x: 0, y: -1.1 }, gridUnits: true })
        .scaleToObject(2)

        //Line 1
        .effect()
        .file("animated-spell-effects-cartoon.electricity.24")
        .delay(250)
        .from(token, { offset: { x: 0, y: -1.1 }, gridUnits: true })
        .rotateTowards(token)
        .rotate(-17)
        .scaleToObject(3)

        //Boom 3
        .effect()
        .file("jb2a.lightning_strike.blue.0")
        .delay(500)
        .atLocation(token, { offset: { x: -0.6, y: 0.9 }, gridUnits: true })
        .scaleToObject(5 * token.document.texture.scaleX)

        .effect()
        .file("animated-spell-effects-cartoon.electricity.23")
        .delay(500)
        .atLocation(token, { offset: { x: -0.6, y: 0.9 }, gridUnits: true })
        .scaleToObject(2)

        //Line 3
        .effect()
        .file("animated-spell-effects-cartoon.electricity.24")
        .delay(750)
        .from(token, { offset: { x: -0.6, y: 0.9 }, gridUnits: true })
        .rotateTowards(token)
        .rotate(-17)
        .scaleToObject(3)

        //Boom 5
        .effect()
        .file("jb2a.lightning_strike.blue.0")
        .delay(1000)
        .atLocation(token, { offset: { x: 1, y: -0.3 }, gridUnits: true })
        .scaleToObject(5 * token.document.texture.scaleX)

        .effect()
        .file("animated-spell-effects-cartoon.electricity.23")
        .delay(1000)
        .atLocation(token, { offset: { x: 1, y: -0.3 }, gridUnits: true })
        .scaleToObject(2)

        //Line 5
        .effect()
        .file("animated-spell-effects-cartoon.electricity.24")
        .delay(1250)
        .from(token, { offset: { x: 1, y: -0.3 }, gridUnits: true })
        .rotateTowards(token)
        .rotate(-17)
        .scaleToObject(3)

        //Boom 2
        .effect()
        .file("jb2a.lightning_strike.blue.0")
        .delay(1500)
        .atLocation(token, { offset: { x: -1, y: -0.3 }, gridUnits: true })
        .scaleToObject(5 * token.document.texture.scaleX)

        .effect()
        .file("animated-spell-effects-cartoon.electricity.23")
        .delay(1500)
        .atLocation(token, { offset: { x: -1, y: -0.3 }, gridUnits: true })
        .scaleToObject(2)

        //Line 2
        .effect()
        .file("animated-spell-effects-cartoon.electricity.24")
        .delay(1750)
        .from(token, { offset: { x: -1, y: -0.3 }, gridUnits: true })
        .rotateTowards(token)
        .rotate(-17)
        .scaleToObject(3)

        //Boom 4
        .effect()
        .file("jb2a.lightning_strike.blue.0")
        .delay(2000)
        .atLocation(token, { offset: { x: 0.6, y: 0.9 }, gridUnits: true })
        .scaleToObject(5 * token.document.texture.scaleX)

        .effect()
        .file("animated-spell-effects-cartoon.electricity.23")
        .delay(2000)
        .atLocation(token, { offset: { x: 0.6, y: 0.9 }, gridUnits: true })
        .scaleToObject(2)

        //Line 4
        .effect()
        .file("animated-spell-effects-cartoon.electricity.24")
        .delay(2250)
        .from(token, { offset: { x: 0.6, y: 0.9 }, gridUnits: true })
        .rotateTowards(token)
        .scaleToObject(3)

        .effect()
        .file("animated-spell-effects-cartoon.electricity.discharge.08")
        .delay(2400)
        .attachTo(token)
        .scaleToObject(4 * token.document.texture.scaleX)
        .waitUntilFinished(-1700)

        .effect()
        .file("jb2a.static_electricity.01.blue")
        .attachTo(token)
        .scaleToObject(1.2 * token.document.texture.scaleX)
        .fadeIn(300)
        .fadeOut(500)
        .playbackRate(0.9)
        .persist()
        .name(`${token.document.name} Destructive Wrath`)

        .thenDo(function () {
            chrisPremades.helpers.createEffect(workflow.actor, effectData)
        })

        .play()
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let queueSetup = await chrisPremades.queue.setup(workflow.item.uuid, 'destructiveWrath', 351);
    if (!queueSetup) return;
    let oldDamageRoll = workflow.damageRoll;
    if (oldDamageRoll.terms.length === 0) {
        chrisPremades.queue.remove(workflow.item.uuid);
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
    chrisPremades.queue.remove(workflow.item.uuid);
}


export let destructiveWrath = {
    'cast': cast,
    'item': item
}