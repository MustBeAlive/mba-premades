export async function phantasmalForce({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let target = workflow.targets.first();
    async function effectMacroStartSource() {
        let effect = await chrisPremades.helpers.findEffect(actor, "Phantasmal Force");
        if (!effect) return;
        let targetDoc = await fromUuid(effect.flags['mba-premades']?.spell?.phantasmalForce?.targetUuid);
        let choices = [["Deal damage to target", "damage"], ["Cancel", "no"]];
        let selection = await chrisPremades.helpers.dialog("Phantasmal Force", choices);
        if (!selection || selection === "no") return;
        let damageRoll = await new Roll('1d6[psychic]').roll({ 'async': true });
        await MidiQOL.displayDSNForRoll(damageRoll, 'damageRoll');
        damageRoll.toMessage({
            rollMode: 'roll',
            speaker: { 'alias': name },
            flavor: `<b>Phantasmal Force</b>`
        });
        await chrisPremades.helpers.applyDamage([targetDoc], damageRoll.total, "psychic");
    }
    async function effectMacroDelSource() {
        await Sequencer.EffectManager.endEffects({ name: `${token.document.name} Phantasmal Force` });
    }
    async function effectMacroDelTarget() {
        await Sequencer.EffectManager.endEffects({ name: `${token.document.name} Phantasmal Force` });
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
                    'script': chrisPremades.helpers.functionToString(effectMacroDelSource)
                },
                'onTurnStart': {
                    'script': chrisPremades.helpers.functionToString(effectMacroStartSource)
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
                'value': `actionSave=true, rollType=skill, saveAbility=inv, saveDC=${chrisPremades.helpers.getSpellDC(workflow.item)}, saveMagic=true, name=Phantasmal Force: Action Save, killAnim=true`,
                'priority': 20
            },
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': chrisPremades.helpers.functionToString(effectMacroDelTarget)
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


    await chrisPremades.helpers.createEffect(target.actor, effectDataTarget);
    await chrisPremades.helpers.createEffect(workflow.actor, effectDataSource);
}