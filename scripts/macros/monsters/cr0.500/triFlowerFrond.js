import {mba} from "../../../helperFunctions.js";

async function redBlossom({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let target = workflow.targets.first();
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} RedB` })
    }
    const effectData = {
        'name': `Tri-flower Frond: Grapple`,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.EthsAglVRC2bOxun]{Grappled} by Tri-flower Frond's Reb Blossom vines.</p>
            <p>Until this @UUID[Compendium.mba-premades.MBA SRD.Item.EthsAglVRC2bOxun]{Grappled} ends, you take 2d4poison damage at the start of each of your turns.</p>
            <p>Another creature within reach of the Tri-flower Frond can use its Action to end the @UUID[Compendium.mba-premades.MBA SRD.Item.EthsAglVRC2bOxun]{Grappled} on you.</p>
        `,
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Grappled",
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `actionSave=true, rollType=skill, saveAbility=ath|acr, saveDC=11, saveMagic=false, name=Grapple: Action Save (DC11), killAnim=true`,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': 'turn=start, damageType=poison, damageRoll=2d4, damageBeforeSave=true, name=Red Blossom: Turn Start, killAnim=true, fastForwardDamage=true',
                'priority': 20
            },
        ],
        'flags': {
            'dae': {
                'showIcon': true
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };
    if (!mba.findEffect(target.actor, "Tri-flower Frond: Grapple") && !mba.checkTrait(target.actor, "ci", "grappled")) {
        new Sequence()

            .effect()
            .file("jb2a.entangle.brown")
            .attachTo(target)
            .scaleToObject(1.5)
            .fadeIn(1000)
            .fadeOut(1000)
            .filter("ColorMatrix", { hue: 335 })
            .mask()
            .persist()
            .name(`${target.document.name} RedB`)

            .thenDo(async () => {
                await mba.createEffect(target.actor, effectData);
            })

            .play()
    }
}

async function orangeBlossom({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let target = workflow.targets.first();
    async function effectMacroDoEvery() {
        await game.Gametime.doEvery({ minutes: 1 }, async () => {
            let effect = await mbaPremades.helpers.findEffect(actor, "Tri-flower Frond: Poison");
            if (!effect) return;
            let saveRoll = await mbaPremades.helpers.rollRequest(token, 'save', 'con');
            if (saveRoll.total < 11) return;
            await mbaPremades.helpers.removeEffect(effect);
        });
    }
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} OraB` })
    }
    const effectData = {
        'name': `Tri-flower Frond: Poison`,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'duration': {
            'seconds': 3600
        },
        'description': `
            <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.pAjPUbk2oPUTfva2]{Poisoned} by Tri-flower Frond's Orange Blossom vines.</p>
            <p>While @UUID[Compendium.mba-premades.MBA SRD.Item.pAjPUbk2oPUTfva2]{Poisoned} in this way, you are @UUID[Compendium.mba-premades.MBA SRD.Item.kIUR1eRcTTtaMFao]{Unconscious}.</p>
            <p>At the end of each minute, you can repeat the saving throw, ending the effect on a success.</p>
        `,
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Poisoned",
                'priority': 20
            },
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': "Unconscious",
                'priority': 20
            },
        ],
        'flags': {
            'effectmacro': {
                'onCreate': {
                    'script': mba.functionToString(effectMacroDoEvery)
                },
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };
    if (!mba.findEffect(target.actor, "Tri-flower Frond: Poison") && !mba.checkTrait(target.actor, "ci", "poisoned")) {
        new Sequence()

            .effect()
            .file("jb2a.entangle.brown")
            .attachTo(target)
            .scaleToObject(1.5)
            .fadeIn(1000)
            .fadeOut(1000)
            .mask()
            .persist()
            .name(`${target.document.name} OraB`)

            .thenDo(async () => {
                await mba.createEffect(target.actor, effectData);
            })

            .play()
    }
}

async function yellowBlossom({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let target = workflow.targets.first();
    async function effectMacroTurnStart() {
        let effect = await mbaPremades.helpers.findEffect(actor, "Tri-flower Frond: Corrosion");
        if (!effect) return;
        let damage = effect.flags['mba-premades']?.feature?.triFlowerFrond?.yellowBlossom?.damage;
        if (damage === 0) await mbaPremades.helpers.removeEffect(effect);
        await mbaPremades.helpers.applyDamage(actor, damage, 'acid');
    };
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} YelB` })
    };
    const effectData = {
        'name': `Tri-flower Frond: Corrosion`,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are covered in Tri-flower Frond's Yellow Blossom corroding sap and take 5 acid damage at the start of each of your turns.</p>
            <p>Dousing yourself with water reduces the acid damage by 1 point per pint or flask of water used.</p>
        `,
        'flags': {
            'dae': {
                'showIcon': true,
            },
            'effectmacro': {
                'onTurnStart': {
                    'script': mba.functionToString(effectMacroTurnStart)
                },
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'mba-premades': {
                'feature': {
                    'triFlowerFrond': {
                        'yellowBlossom': {
                            'damage': 5
                        }
                    }
                }
            }
        }
    };
    if (!mba.findEffect(target.actor, "Tri-flower Frond: Corrosion")) {
        new Sequence()

            .effect()
            .file("jb2a.entangle.yellow")
            .attachTo(target)
            .scaleToObject(1.5)
            .fadeIn(1000)
            .fadeOut(1000)
            .filter("ColorMatrix", { hue: 25 })
            .mask()
            .persist()
            .name(`${target.document.name} YelB`)

            .thenDo(async () => {
                await mba.createEffect(target.actor, effectData);
            })

            .play()
    }
}


export let triFlowerFrond = {
    'redBlossom': redBlossom,
    'orangeBlossom': orangeBlossom,
    'yellowBlossom': yellowBlossom
}