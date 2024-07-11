import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function feyCharmCheck({ speaker, actor, token, character, item, args, scope, workflow }) {
    new Sequence()

        .effect()
        .file("jb2a.aura_themed.01.outward.complete.nature.01.green")
        .attachTo(workflow.token)
        .scaleToObject(2)
        .belowTokens()
        .playbackRate(0.95)

        .play()

    let target = workflow.targets.first();
    let type = await mba.raceOrType(target.actor);
    let immune = await mba.checkTrait(target.actor, "ci", "charmed");
    let immune2 = await mba.findEffect(target.actor, "Fey Charm: Immune");
    if (type != "humanoid" && type != "beast") {
        await mba.createEffect(target.actor, constants.immunityEffectData);
        return;
    }
    if (immune || immune2) {
        await mba.createEffect(target.actor, constants.immunityEffectData);
    }
}

async function feyCharmItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    if (!workflow.failedSaves.size) {
        let effectDataImmune = {
            'name': "Fey Charm: Immune",
            'icon': "modules/mba-premades/icons/generic/fey_charm_immune.webp",
            'description': `
                <p>You are immune to Dryad's Fey Charm ability for the next 24 hours.</p>
            `,
            'duration': {
                'seconds': 86400
            }
        };
        if (!mba.findEffect(target.actor, "Fey Charm: Immune")) await mba.createEffect(target.actor, effectDataImmune);
        return;
    }
    async function effectMacroDelTarget() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} FeyCha` });
        let originDoc = await fromUuid(effect.flags['mba-premades']?.feature?.dryad?.charm?.originUuid);
        let originEffect = await mbaPremades.helpers.findEffect(originDoc.actor, `${originDoc.name}: Fey Charm (${token.document.name})`);
        if (originEffect) await mbaPremades.helpers.removeEffect(originEffect);
        let effectDataImmune = {
            'name': "Fey Charm: Immune",
            'icon': "modules/mba-premades/icons/generic/fey_charm_immune.webp",
            'description': `
                <p>You are immune to Dryad's Fey Charm ability for the next 24 hours.</p>
            `,
            'duration': {
                'seconds': 86400
            }
        };
        await mbaPremades.helpers.createEffect(token.actor, effectDataImmune);
    }
    let effectDataTarget = {
        'name': "Dryad: Fey Charm",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
			<p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.SVd8xu3mTZMqz8fL]{Charmed} by Dryad and regard the dryad as a trusted friend to be heeded and protected.</p>
			<p>Although you are not under the dryad's control, you take the dryad's requests or actions in the most favorable way you can.</p>
		`,
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': 'Charmed',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.onUseMacroName',
                'mode': 0,
                'value': 'function.mbaPremades.macros.monsters.dryad.feyCharmDamaged,isDamaged',
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ["zeroHP"]
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDelTarget)
                }
            },
            'mba-premades': {
                'feature': {
                    'dryad': {
                        'charm': {
                            'originUuid': workflow.token.document.uuid
                        }
                    }
                }
            }
        }
    };
    async function effectMacroDelSource() {
        let targetDoc = await fromUuid(effect.flags['mba-premades']?.feature?.dryad?.feyCharm?.targetUuid);
        let targetEffect = await mbaPremades.helpers.findEffect(targetDoc.actor, `${token.document.name}: Fey Charm`);
        if (targetEffect) await mbaPremades.helpers.removeEffect(targetEffect);
    };
    let effectDataSource = {
        'name': `${workflow.token.document.name}: Fey Charm (${target.document.name})`,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'flags': {
            'dae': {
                'specialDuration': ['zeroHP']
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDelSource)
                }
            },
            'mba-premades': {
                'feature': {
                    'dryad': {
                        'feyCharm': {
                            'targetUuid': target.document.uuid
                        }
                    }
                }
            }
        }
    };

    new Sequence()

        .effect()
        .file("animated-spell-effects-cartoon.level 01.bless.blue")
        .atLocation(target, { randomOffset: 1.2, gridUnits: true })
        .scaleToObject(0.5)
        .zIndex(1)
        .filter("ColorMatrix", { saturate: 1, hue: 80 })
        .repeats(8, 100, 100)

        .effect()
        .file("animated-spell-effects-cartoon.cantrips.mending.purple")
        .atLocation(target)
        .scaleToObject(3)
        .opacity(0.75)
        .zIndex(0)
        .filter("ColorMatrix", { saturate: 1, brightness: 1.3, hue: -5 })
        .waitUntilFinished(-500)

        .effect()
        .file("jb2a.template_circle.symbol.out_flow.heart.pink")
        .atLocation(target)
        .scaleToObject(3)
        .duration(3000)
        .fadeOut(2000)
        .scaleIn(0, 1000, { ease: "easeOutQuint" })
        .belowTokens()

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectDataTarget);
            await mba.createEffect(workflow.actor, effectDataSource);
        })

        .effect()
        .file("jb2a.icon.heart.pink")
        .attachTo(target)
        .scaleToObject(1)
        .duration(2000)
        .fadeOut(1000)
        .scaleIn(0, 500, { ease: "easeOutQuint" })
        .playbackRate(1)

        .effect()
        .file("jb2a.icon.heart.pink")
        .attachTo(target)
        .scaleToObject(3)
        .duration(1000)
        .fadeOut(1000)
        .scaleIn(0, 500, { ease: "easeOutQuint" })
        .anchor({ y: 0.45 })
        .playbackRate(1)
        .opacity(0.5)

        .effect()
        .file("jb2a.extras.tmfx.border.circle.outpulse.01.fast")
        .atLocation(target)
        .scaleToObject(2)

        .effect()
        .file("jb2a.markers.heart.pink.03")
        .attachTo(target)
        .scaleToObject(2)
        .delay(500)
        .fadeIn(1000)
        .fadeOut(1000)
        .center()
        .playbackRate(1)
        .persist()
        .name(`${target.document.name} FeyCha`)

        .play()
}

async function feyCharmDamaged({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effect = await mba.findEffect(actor, "Dryad: Fey Charm");
    if (!effect) return;
    let originDoc = await fromUuid(effect.flags['mba-premades']?.feature?.dryad?.charm?.originUuid);
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Monster Features", "Dryad Fey Charm: Save", false);
    if (!featureData) return;
    delete featureData._id;
    featureData.name = "Fey Charm: Save";
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': originDoc.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([token.document.uuid]);
    let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
    if (featureWorkflow.failedSaves.size) return;
    await mba.removeEffect(effect);
}

async function treeStride({ speaker, actor, token, character, item, args, scope, workflow }) {
    let animation1 = "jb2a.misty_step.01.green";
    let animation2 = "jb2a.misty_step.02.green";
    let icon = workflow.token.document.texture.src;
    let interval = workflow.token.document.width % 2 === 0 ? 1 : -1;
    await mba.gmDialogMessage();
    let position = await mba.aimCrosshair(workflow.token, 60, icon, interval, workflow.token.document.width);
    await mba.clearGMDialogMessage();
    if (position.cancelled) return;

    new Sequence()

        .animation()
        .delay(800)
        .on(workflow.token)
        .fadeOut(200)

        .effect()
        .file(animation1)
        .atLocation(workflow.token)
        .scaleToObject(2)
        .waitUntilFinished(-2000)

        .animation()
        .on(workflow.token)
        .teleportTo(position)
        .snapToGrid()
        .offset({ x: -1, y: -1 })
        .waitUntilFinished(200)

        .effect()
        .file(animation2)
        .atLocation(workflow.token)
        .scaleToObject(2)

        .animation()
        .delay(1400)
        .on(workflow.token)
        .fadeIn(200)

        .play();
}

export let dryad = {
    'feyCharmCheck': feyCharmCheck,
    'feyCharmItem': feyCharmItem,
    'feyCharmDamaged': feyCharmDamaged,
    'treeStride': treeStride
}