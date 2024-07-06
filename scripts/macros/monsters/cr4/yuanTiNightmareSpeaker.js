import {mba} from "../../../helperFunctions.js";

async function constrict({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let target = workflow.targets.first();
    if (mba.findEffect(target.actor, "Grappled")) return;
    if (mba.getSize(target.actor) > 2) return;
    let distance = await mba.getDistance(workflow.token, target, true);
    if (distance > 5) await mba.pushToken(workflow.token, target, -5);
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} YuNiSpC` })
    }
    let effectData = {
        'name': "Yuan-ti Nightmare Speaker: Constrict",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': 'Grappled',
                'priority': 20
            },
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': 'Restrained',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': 'actionSave=true, rollType=skill, saveAbility=ath|acr, saveDC=14, saveMagic=false, name=Constrict: Action Save (DC 14), killAnim=true',
                'priority': 20
            },
        ],
        'flags': {
            'dae': {
                'showIcon': false
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
        .file("jb2a.unarmed_strike.no_hit.01.blue")
        .atLocation(workflow.token)
        .stretchTo(target)
        .playbackRate(0.9)
        .filter("ColorMatrix", { saturate: -1, brightness: 1 })

        .effect()
        .file("jb2a.unarmed_strike.no_hit.01.blue")
        .mirrorY()
        .atLocation(workflow.token)
        .stretchTo(target)
        .playbackRate(0.9)
        .filter("ColorMatrix", { saturate: -1, brightness: 1 })

        .wait(150)

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectData);
        })

        .effect()
        .file("jb2a.markers.chain.standard.complete.02.blue")
        .attachTo(target)
        .scaleToObject(2 * target.document.texture.scaleX)
        .fadeIn(500)
        .fadeOut(1000)
        .opacity(0.6)
        .persist()
        .name(`${target.document.name} YuNiSpC`)

        .play()
}

async function spectralFangs({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();

    new Sequence()

        .effect()
        .file("jb2a.ranged.01.projectile.01.dark_green")
        .attachTo(workflow.token)
        .stretchTo(target)
        .waitUntilFinished(-1400)
        .missed(!workflow.hitTargets.size)

        .effect()
        .file("jb2a.bite.400px.green")
        .attachTo(target)
        .scaleToObject(2.5 * target.document.texture.scaleX)
        .playIf(() => {
            return workflow.hitTargets.size
        })

        .effect()
        .file("jaamod.sequencer_fx_master.blood_splat.red.2")
        .delay(200)
        .attachTo(target)
        .scaleIn(0, 500, { 'ease': 'easeOutCubic' })
        .scaleToObject(1.65 * target.document.texture.scaleX)
        .duration(2500)
        .fadeOut(1000)
        .belowTokens()
        .playIf(() => {
            return workflow.hitTargets.size
        })

        .play()
}

async function invokeNightmare({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} YuNiSpF` })
    };
    let effectData = {
        'name': "Yuan-ti Nightmare Speaker: Nightmare",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.oR1wUvem3zVVUv5Q]{Frightened} by Yuan-ti Nightmare Speaker's Nightmare for the duration.</p>
            <p>You can repeat the saving throw at the end of each of your turns, ending the effect on a success or taking 2d10 psychic damage on a failure.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': 'Frightened',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `turn=end, damageType=psychic, damageRoll=2d10, damageBeforeSave=false, saveDamage=nodamage, saveAbility=int, saveDC=13, saveRemove=true, saveMagic=false, name=Nighmare: Turn End (DC13), killAnim=true, fastForwardDamage=true`,
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

    new Sequence()

        .effect()
        .file("jb2a.icon.fear.dark_purple")
        .attachTo(target)
        .scaleIn(0, 500, { ease: "easeOutQuint" })
        .fadeOut(1000)
        .scaleToObject(1)
        .duration(2000)
        .playbackRate(1)

        .effect()
        .file("jb2a.icon.fear.dark_purple")
        .attachTo(target)
        .scaleToObject(3)
        .anchor({ y: 0.45 })
        .scaleIn(0, 500, { ease: "easeOutQuint" })
        .fadeOut(1000)
        .duration(1000)
        .playbackRate(1)
        .opacity(0.5)

        .effect()
        .file("jb2a.extras.tmfx.border.circle.outpulse.01.fast")
        .attachTo(target)
        .scaleToObject(2)

        .thenDo(async () => {
            if (workflow.failedSaves.size && !mba.checkTrait(target.actor, "ci", "frightened") && !mba.findEffect(target.actor, "Yuan-ti Nightmare Speaker: Nightmare")) {
                await mba.createEffect(target.actor, effectData);
                let damageRoll = await new Roll("4d10[psychic]").roll({ 'async': true });
                await MidiQOL.displayDSNForRoll(damageRoll);
                await mba.applyWorkflowDamage(workflow.token, damageRoll, "psychic", [target], undefined, workflow.itemCardId);
            }
        })

        .effect()
        .file("jb2a.markers.fear.dark_purple.03")
        .attachTo(target)
        .scaleToObject(2)
        .delay(500)
        .center()
        .fadeIn(1000)
        .fadeOut(1000)
        .playbackRate(1)
        .persist()
        .name(`${target.document.name} YuNiSpF`)
        .playIf(() => {
            return (workflow.failedSaves.size && !mba.checkTrait(target.actor, "ci", "frightened") && !mba.findEffect(target.actor, "Yuan-ti Nightmare Speaker: Nightmare"));
        })

        .play()
}

export let yuanTiNightmareSpeaker = {
    'constrict': constrict,
    'spectralFangs': spectralFangs,
    'invokeNightmare': invokeNightmare
}