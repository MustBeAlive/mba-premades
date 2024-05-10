import { mba } from "../../helperFunctions.js";
import { constants } from "../generic/constants.js";

export async function gemOfBrightness({ speaker, actor, token, character, item, args, scope, workflow }) {
    let gemItem = mba.getItem(workflow.actor, "Gem of Brightness");
    if (!gemItem) {
        ui.notifications.warn("Unable to find item (Gem of Brightness");
        return;
    }
    let usesCurrent = gemItem.system.uses.value;
    let choices = [
        ["Create Light (0 charges)", "light"],
        ["Ray of Blinding Light (1 charge)", "ray"],
        ["Cone of Blinding Light (5 chages)", "cone"],
        ["Cancel", "cancel"]
    ];
    let selection = await mba.dialog("Choose effect:", choices);
    if (!selection || selection === "cancel") return;
    const effectData = {
        'name': "Gem of Brightness: Blindness",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are blinded from the flash of light for the duration.</p>
            <p>You can repeat the saving throw at the end of each of your turns, ending the effect on a success.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': "macro.CE",
                'mode': 0,
                'value': "Blinded",
                'priority': 20,
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': 'turn=end, saveAbility=con, saveDC=15, saveMagic=false, name=Blindness: Turn End, killAnim=true',
                'priority': 20
            },
        ],
    };
    if (selection === "light") {
        const effectData = {
            'name': workflow.item.name,
            'icon': workflow.item.img,
            'origin': workflow.item.uuid,
            'description': `
                <p>For the duration, you shed bright light in a 30-foot radius and dim light for an additional 30 feet.</p>
                <p>Completely covering the object with something opaque blocks the light.</p>
                <p>The spell ends if you cast it again or dismiss it as an action.</p>
            `,
            'changes': [
                {
                    'key': 'ATL.light.dim',
                    'mode': 4,
                    'value': 60,
                    'priority': 20
                },
                {
                    'key': 'ATL.light.bright',
                    'mode': 4,
                    'value': 30,
                    'priority': 20
                },
                {
                    'key': 'ATL.light.alpha',
                    'mode': 5,
                    'value': "0.25",
                    'priority': 20
                },
                {
                    'key': 'ATL.light.angle',
                    'mode': 5,
                    'value': "360",
                    'priority': 20
                },
                {
                    'key': 'ATL.light.luminosity',
                    'mode': 5,
                    'value': "0.5",
                    'priority': 20
                },
                {
                    'key': 'ATL.light.animation',
                    'mode': 5,
                    'value': '{type: "smokepatch", speed: 5, intensity: 1, reverse: false }',
                    'priority': 20
                },
                {
                    'key': 'ATL.light.attenuation',
                    'mode': 5,
                    'value': "0.8",
                    'priority': 20
                },
                {
                    'key': 'ATL.light.contrast',
                    'mode': 5,
                    'value': "0.15",
                    'priority': 20
                },
                {
                    'key': 'ATL.light.shadows',
                    'mode': 5,
                    'value': "0.2",
                    'priority': 20
                }
            ],
            'flags': {
                'dae': {
                    'showIcon': true
                }
            }
        };

        new Sequence()

            .effect()
            .file("jb2a.markers.light.complete.yellow")
            .attachTo(token)
            .fadeOut(1000)

            .effect()
            .file("jb2a.markers.light_orb.complete.yellow")
            .attachTo(token)
            .fadeOut(1000)
            .belowTokens()

            .thenDo(function () {
                mba.createEffect(workflow.actor, effectData)
            })

            .play()
    }
    else if (selection === "ray") {
        let target = workflow.targets.first();
        if (!target) {
            ui.notifications.warn("No target selected, try again!");
            return;
        }
        let featureData = await mba.getItemFromCompendium('mba-premades.MBA Item Features', 'Gem of Brightness: Blinding Light', false);
        if (!featureData) {
            ui.notifications.warn("Can't find item in compenidum! (Gem of Brightness: Blinding Light)");
            return
        }
        let feature = new CONFIG.Item.documentClass(featureData, { 'parent': actor });
        let [config, options] = constants.syntheticItemWorkflowOptions([target.document.uuid]);
        await game.messages.get(workflow.itemCardId).delete();

        new Sequence()

            .effect()
            .file("jb2a.scorching_ray.01.yellow")
            .atLocation(token)
            .stretchTo(target)
            .repeats(3, 600, 600)

            .play()

        let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
        usesCurrent -= 1;
        await gemItem.update({ "system.uses.value": usesCurrent });
        if (!featureWorkflow.failedSaves.size) return;
        await mba.createEffect(target.actor, effectData);
        return;
    }
    else if (selection === "cone") {
        let templateData = {
            't': 'cone',
            'user': game.user,
            'distance': 30,
            'direction': 0,
            'fillColor': game.user.color,
            'flags': {
                'dnd5e': {
                    'origin': workflow.item.uuid
                },
                'midi-qol': {
                    'originUuid': workflow.item.uuid
                },
                'walledtemplates': {
                    'wallRestriction': 'move',
                    'wallsBlock': 'recurse',
                }
            },
            'angle': 60
        };
        let template = await mba.placeTemplate(templateData);
        if (!template) {
            ui.notifications.warn("Failed to place template, try again!");
            return;
        }
        let templateEffectData = {
            'name': workflow.item.name,
            'icon': workflow.item.img,
            'origin': workflow.item.uuid,
            'duration': {
                'turns': 1
            },
            'changes': [
                {
                    'key': 'flags.dae.deleteUuid',
                    'mode': 5,
                    'priority': 20,
                    'value': template.uuid
                }
            ],
        };
        await mba.createEffect(workflow.actor, templateEffectData);
        let targets = Array.from(game.user.targets);
        let targetUuids = [];
        for (let target of targets) targetUuids.push(target.document.uuid);
        let featureData = await mba.getItemFromCompendium('mba-premades.MBA Item Features', 'Gem of Brightness: Blinding Light', false);
        if (!featureData) {
            ui.notifications.warn("Can't find item in compenidum! (Gem of Brightness: Blinding Light)");
            return
        }
        let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
        let [config, options] = constants.syntheticItemWorkflowOptions(targetUuids);
        await game.messages.get(workflow.itemCardId).delete();
        for (let i = 0; i < 10; i++) {

            new Sequence()

                .effect()
                .file("jb2a.energy_strands.range.standard.orange.0{{num}}")
                .atLocation(token, { offset: { x: 0.2 }, gridUnits: true, local: true })
                .delay(500 * (i - 1))
                .stretchTo(template, { randomOffset: 1, gridUnits: true, cacheLocation: true })
                .extraEndDuration(5 * i)
                .randomizeMirrorY()
                .fadeIn(500, { ease: "easeOutBack" })
                .fadeOut(400)
                .opacity(1)
                .setMustache({
                    "num": () => {
                        const nums = [`1`, `2`, `3`, `4`];
                        return nums[Math.floor(Math.random() * nums.length)];
                    }
                })
                .zIndex(1)

                .effect()
                .file("jb2a.energy_strands.range.standard.orange.0{{num}}")
                .atLocation(token, { offset: { x: 0.2, y: 0.2 }, gridUnits: true, local: true })
                .delay(500 * (i - 1))
                .stretchTo(template, { offset: { y: -1 }, randomOffset: 2, gridUnits: true, cacheLocation: true, local: true })
                .extraEndDuration(5 * i)
                .randomizeMirrorY()
                .fadeIn(500, { ease: "easeOutBack" })
                .fadeOut(400)
                .opacity(1)
                .duration(900)
                .setMustache({
                    "num": () => {
                        const nums = [`1`, `2`, `3`, `4`];
                        return nums[Math.floor(Math.random() * nums.length)];
                    }
                })
                .zIndex(1)

                .effect()
                .file("jb2a.energy_strands.range.standard.orange.0{{num}}")
                .atLocation(token, { offset: { x: 0.2, y: -0.2 }, gridUnits: true, local: true })
                .delay(500 * (i - 1))
                .stretchTo(template, { offset: { y: 1 }, randomOffset: 1, gridUnits: true, cacheLocation: true, local: true })
                .extraEndDuration(5 * i)
                .randomizeMirrorY()
                .fadeIn(500, { ease: "easeOutBack" })
                .fadeOut(400)
                .opacity(1)
                .duration(900)
                .setMustache({
                    "num": () => {
                        const nums = [`1`, `2`, `3`, `4`];
                        return nums[Math.floor(Math.random() * nums.length)];
                    }
                })
                .zIndex(1)

                .play();
        }
        let featureWorkflow = await MidiQOL.completeItemUse(feature, config, options);
        usesCurrent -= 5;
        if (usesCurrent < 0) usesCurrent = 0;
        await gemItem.update({ "system.uses.value": usesCurrent });
        if (!featureWorkflow.failedSaves.size) return;
        let failedTargets = Array.from(featureWorkflow.failedSaves);
        for (let target of failedTargets) await mba.createEffect(target.actor, effectData);
    }
}