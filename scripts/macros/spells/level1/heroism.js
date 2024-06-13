import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

export async function heroism({ speaker, actor, token, character, item, args, scope, workflow }) {
    let castLevel = workflow.castData.castLevel;
    if (workflow.targets.size > castLevel) {
        let selection = await mba.selectTarget(workflow.item.name, constants.okCancel, Array.from(workflow.targets), false, 'multiple', undefined, false, 'Too many targets selected. Choose which targets to keep (Max: ' + castLevel + ')');
        if (!selection.buttons) return;
        let newTargets = selection.inputs.filter(i => i).slice(0, castLevel);
        mba.updateTargets(newTargets);
    }
    await warpgate.wait(100);
    let targets = Array.from(game.user.targets);
    async function effectMacroTurnStart() {
        let tempHP = mbaPremades.helpers.getSpellMod(origin);
        if (actor.system.attributes.hp.temp < tempHP) await mbaPremades.helpers.applyDamage([token], tempHP, 'temphp');
    };
    async function effectMacroDel() {
        await Sequencer.EffectManager.endEffects({ name: `${token.document.name} Heroism`, object: token })
        if (actor.system.attributes.hp.temp === 0) return;
        await actor.update({ 'system.attributes.hp.temp': 0 });
    };
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are imbued with bravery. Until the spell ends, you are immune to being frightened and gain temporary hit points equal to caster's spellcasting ability modifier at the start of each of your turn.</p>
            <p>When the spell ends, you lose any remaining temporary hit points from this spell.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'system.traits.ci.value',
                'mode': 0,
                'value': "frightened",
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
            'midi-qol': {
                'castData': {
                    baseLevel: 1,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    for (let target of targets) {
        let delay = 500 + Math.floor(Math.random() * (Math.floor(1000) - Math.ceil(50)) + Math.ceil(50));

        new Sequence()

            .effect()
            .file("jb2a.energy_beam.normal.yellow.03")
            .attachTo(token)
            .stretchTo(target)
            .delay(delay)
            .duration(3000)
            .fadeIn(500)
            .fadeOut(500)
            .scaleIn(0, 2000, { ease: "easeOutExpo" })
            .opacity(0.8)
            .waitUntilFinished(-2500)

            .effect()
            .file("jb2a.template_circle.symbol.normal.shield.green")
            .attachTo(target)
            .scaleToObject(1.5 * target.document.texture.scaleX)
            .filter("ColorMatrix", { hue: 300 })
            .fadeIn(500)
            .fadeOut(1500)
            .playbackRate(0.85)
            .mask()
            .persist()
            .name(`${target.document.name} Heroism`)

            .thenDo(async () => {
                await mba.createEffect(target.actor, effectData);
            })

            .play()
    }
}