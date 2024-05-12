import {mba} from "../../../helperFunctions.js";

// change damage in async function to use synth item (to enable reaction promt)

export async function phantasmalForce({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let target = workflow.targets.first();
    let type = await mba.raceOrType(target.actor);
    if (type === "undead" || type === "construct") {
        await warpgate.wait(100);
        ui.notifications.warn("Target cannot be affected by Phantasmal Force! (undead/construct)");
        await mba.removeCondition(workflow.actor, "Concentrating");
        return;
    }
    async function effectMacroStartSource() {
        let effect = await mbaPremades.helpers.findEffect(actor, "Phantasmal Force");
        if (!effect) return;
        let targetDoc = await fromUuid(effect.flags['mba-premades']?.spell?.phantasmalForce?.targetUuid);
        let choices = [["Deal damage to target", "damage"], ["Cancel", "no"]];
        let selection = await mbaPremades.helpers.dialog("Phantasmal Force", choices, `<b></b>`); // не трогал, потому что надо заменить весь блок
        if (!selection || selection === "no") return;
        let damageRoll = await new Roll('1d6[psychic]').roll({ 'async': true });
        await MidiQOL.displayDSNForRoll(damageRoll, 'damageRoll');
        damageRoll.toMessage({
            rollMode: 'roll',
            speaker: { 'alias': name },
            flavor: `<b>Phantasmal Force</b>`
        });
        await mbaPremades.helpers.applyDamage([targetDoc], damageRoll.total, "psychic");
    }
    async function effectMacroDelSource() {
        await Sequencer.EffectManager.endEffects({ name: `${token.document.name} Phantasmal Force` });
    }
    async function effectMacroDelTarget() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Phantasmal Force` });
        let targets = game.canvas.scene.tokens.filter(i => mbaPremades.helpers.findEffect(i.actor, "Phantasmal Force"));
        if (!targets.length) return;
        await mbaPremades.helpers.removeCondition(targets[0].actor, "Concentrating");
    }
    const effectDataSource = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': ``,
        'duration': {
            'seconds': 60
        },
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDelSource)
                },
                'onTurnStart': {
                    'script': mba.functionToString(effectMacroStartSource)
                }
            },
            'mba-premades': {
                'spell': {
                    'phantasmalForce': {
                        'targetUuid': target.document.uuid
                    }
                }
            }
        }
    }
    const effectDataTarget = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': ``,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `actionSave=true, rollType=skill, saveAbility=inv, saveDC=${mba.getSpellDC(workflow.item)}, saveMagic=true, name=Phantasmal Force: Action Save, killAnim=true`,
                'priority': 20
            },
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDelTarget)
                }
            },
            'mba-premades': {
                'spell': {
                    'phantasmalForce': {
                        'originUuid': target.document.uuid
                    }
                }
            }
        }
    };

    new Sequence()

        .wait(1000)

        .effect()
        .file("jb2a.magic_signs.rune.illusion.complete.pink")
        .attachTo(target)
        .duration(5000)
        .scaleToObject(1.1 * target.document.texture.scaleX)
        .opacity(0.9)
        .fadeOut(1000)

        .effect()
        .file("jb2a.butterflies.loop.01.bluepurple")
        .delay(500)
        .duration(4500)
        .attachTo(target)
        .scaleToObject(2.5 * target.document.texture.scaleX)
        .fadeIn(1000)
        .fadeOut(1000)

        .effect()
        .file("jb2a.token_border.circle.static.purple.006")
        .delay(3500)
        .attachTo(target)
        .scaleIn(0, 2000, { ease: "easeOutCubic" })
        .scaleToObject(2)
        .fadeIn(1000)
        .fadeOut(1000)
        .belowTokens()
        .persist()
        .name(`${target.document.name} Phantasmal Force`)

        .effect()
        .file("jb2a.template_square.symbol.normal.stun.purple")
        .delay(3500)
        .atLocation(target)
        .fadeIn(1000)
        .fadeOut(1000)
        .randomRotation()
        .scaleOut(0, 1000, { ease: "linear" })
        .scaleIn(0, 2000, { ease: "easeOutCubic" })
        .size(4.5, { gridUnits: true })
        .persist()
        .name(`${workflow.token.document.name} Phantasmal Force`)

        .play()

    await warpgate.wait(4200);
    await mba.createEffect(target.actor, effectDataTarget);
    await mba.createEffect(workflow.actor, effectDataSource);
}