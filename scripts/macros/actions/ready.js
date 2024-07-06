import {mba} from "../../helperFunctions.js";

export async function ready({ speaker, actor, token, character, item, args, scope, workflow }) {
    let reactionSpent = await mba.findEffect(workflow.actor, "Reaction");
    if (reactionSpent) {
        ui.notifications.warn("In order to ready an action you need to have your reaction available!");
        return;
    }
    let choices = [["Yes (begin concentrating)", "yes"], ["No", "no"]];
    let selection = await mba.dialog("Ready Action", choices, `Are you readying a <b>spell?</b>`);
    if (!selection) return;
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Ready` })
    }
    if (selection === "no") {
        let effectData = {
            'name': workflow.item.name,
            'icon': workflow.item.img,
            'origin': workflow.item.uuid,
            'description': "You are readying an action until the start of your next turn, or until the designated trigger occurs.",
            'flags': {
                'dae': {
                    'showIcon': true,
                    'specialDuration': ['1Action', 'turnStart']
                },
                'effectmacro': {
                    'onDelete': {
                        'script': mba.functionToString(effectMacroDel)
                    }
                }
            }
        };
        await mba.addCondition(workflow.actor, "Reaction");
        await mba.createEffect(workflow.actor, effectData);
    
        await new Sequence()
    
            .effect()
            .from(token)
            .belowTokens()
            .attachTo(token, { locale: true })
            .scaleToObject(1, { considerTokenScale: true })
            .spriteRotation(token.rotation * -1)
            .filter("Glow", { color: 0xff0000, distance: 20 })
            .opacity(0.8)
            .zIndex(0.1)
            .loopProperty("alphaFilter", "alpha", { values: [0.05, 0.75], duration: 5000, pingPong: true })
            .persist()
            .name(`${token.document.name} Ready 1`)
    
            .effect()
            .file("jb2a.extras.tmfx.border.circle.outpulse.02.normal")
            .attachTo(token)
            .scaleToObject(1 * token.document.texture.scaleX)
            .tint("#FF0000")
            .belowTokens()
            .persist()
            .playbackRate(0.66)
            .name(`${token.document.name} Ready 2`)
    
            .play()
    
        return;
    }
    let isConcentrating = await mba.findEffect(workflow.actor, "Concentrating");
    if (isConcentrating) {
        let oldConc = await fromUuid(isConcentrating.flags['midi-qol']?.isConcentration);
        let concChoices = [[`Stop concentrating on <b>${oldConc.name}</b>`, "yes"],["Cancel readying action", false]];
        let concSelection = await mba.dialog("Ready Action", concChoices, `<b>You are already concentrating. What would you like to do?</b>`);
        if (!concSelection) return;
        await mba.removeCondition(workflow.actor, "Concentrating");
        await warpgate.wait(100);
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are readying an action until the start of your next turn, or until the designated trigger occurs.</p>
        `,
        'changes': [
            {
                'key': "macro.CE",
                'mode': 0,
                'value': "Concentrating",
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['1Action', 'turnStart']
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };
    await mba.addCondition(workflow.actor, "Reaction");
    await mba.createEffect(workflow.actor, effectData);
    
    await new Sequence()
    
        .effect()
        .from(token)
        .attachTo(token, { locale: true })
        .scaleToObject(1, { considerTokenScale: true })
        .belowTokens()
        .spriteRotation(token.rotation * -1)
        .loopProperty("alphaFilter", "alpha", { values: [0.05, 0.75], duration: 5000, pingPong: true })
        .filter("Glow", { color: 0xff0000, distance: 20 })
        .opacity(0.8)
        .zIndex(0.1)
        .persist()
        .name(`${token.document.name} Ready 1`)
    
        .effect()
        .file("jb2a.extras.tmfx.border.circle.outpulse.02.normal")
        .attachTo(token)
        .scaleToObject(1.2 * token.document.texture.scaleX)
        .tint("#FF0000")
        .belowTokens()
        .playbackRate(0.66)
        .persist()
        .name(`${token.document.name} Ready 2`)
    
        .play()
}