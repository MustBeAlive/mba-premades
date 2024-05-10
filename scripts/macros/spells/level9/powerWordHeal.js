import {mba} from "../../../helperFunctions.js";

export async function powerWordHeal({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let type = mba.raceOrType(target.actor);
    if (type === 'undead' || type === 'construct') {
        ui.notifications.warn('Power Word: Heal has no effect on undead and construct creatures!');
        return false;
    }

    new Sequence()

        .effect()
        .file("jb2a.sacred_flame.source.green")
        .atLocation(target)
        .anchor(0.5)
        .scaleToObject(1.5)
        .fadeIn(250)
        .fadeOut(500)

        .effect()
        .file("jb2a.sacred_flame.target.green")
        .atLocation(target)
        .scaleToObject(2.5)
        .anchor(0.5)
        .fadeIn(250)
        .fadeOut(500)
        .delay(1500)

        .play();

    let diff = target.actor.system.attributes.hp.max - target.actor.system.attributes.hp.value;
    await mba.applyDamage([target], diff, 'healing');

    let isCharmed = await mba.findEffect(target.actor, 'Charmed');
    if (isCharmed) await mba.removeCondition(target.actor, 'Charmed');
    let isFrightened = await mba.findEffect(target.actor, 'Frightened');
    if (isFrightened) await mba.removeCondition(target.actor, 'Frightened');
    let isParalyzed = await mba.findEffect(target.actor, 'Paralyzed');
    if (isParalyzed) await mba.removeCondition(target.actor, 'Paralyzed');
    let isStunned = await mba.findEffect(target.actor, 'Stunned');
    if (isStunned) await mba.removeCondition(target.actor, 'Stunned');
    let reaction = mba.findEffect(target.actor, 'Reaction');
    if (!reaction) {
        let isProne = await mba.findEffect(target.actor, 'Prone');
        if (isProne) {
            async function effectMacro() {
                let effect = mba.findEffect(actor, 'Power Word: Heal');
                await new Dialog({
                    title: "Power Word: Heal",
                    content: "<p>Do you wish to spend your reaction to stand up?</p>",
                    buttons: {
                        yes: {
                            label: "Yes",
                            callback: async () => {
                                await mba.removeCondition(actor, 'Prone');
                                await mba.addCondition(actor, 'Reaction');
                                await mba.removeEffect(effect);
                                return;
                            },
                        },
                        no: {
                            label: "No",
                            callback: async () => {
                                await mba.removeEffect(effect);
                                return;
                            }
                        }
                    },
                    default: "Yes"
                }).render(true);
            }
            let effectData = {
                'name': 'Power Word: Heal',
                'flags': {
                    'effectmacro': {
                        'onCreate': {
                            'script': mba.functionToString(effectMacro)
                        }
                    }
                }

            }
            await mba.createEffect(target.actor, effectData);
        }
    }
}