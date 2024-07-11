import {mba} from "../../../helperFunctions.js";

async function horrorNimbusCast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let newTargets = [];
    for (let target of Array.from(workflow.targets)) {
        if (mba.findEffect(target.actor, "Blinded")) continue;
        if (mba.findEffect(target.actor, "Nalfeshnee: Fear")) continue;
        if (mba.findEffect(target.actor, "Nalfeshnee: Fear Immune")) continue;
        if (mba.checkTrait(target.actor, "ci", "frightened")) continue;
        newTargets.push(target.id);
    }
    mba.updateTargets(newTargets);
    new Sequence()

    .effect()
    .file("jb2a.energy_attack.01.multicolored01")
    .attachTo(workflow.token)
    .scaleToObject(3)
    .waitUntilFinished(-1500)

    .effect()
    .file("jb2a.smoke.puff.ring.01.multicolored.2")
    .attachTo(workflow.token)
    .scaleToObject(4)

    .effect()
    .file("jb2a.smoke.puff.ring.01.multicolored.1")
    .attachTo(workflow.token)
    .scaleToObject(4)

    .effect()
    .file("jb2a.soundwave.01.multicolored02")
    .attachTo(workflow.token)
    .scaleToObject(5.5)
    .playbackRate(2)

    .effect()
    .file("jb2a.soundwave.02.multicolored02")
    .attachTo(workflow.token)
    .scaleToObject(5.5)
    .playbackRate(2)

    .play()
}

async function horrorNimbusItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    let effectDataImmune = {
        'name': "Nalfeshnee: Fear Immune",
        'icon': "modules/mba-premades/icons/spells/level3/fear.webp",
        'description': `
            <p>You are immune to Nalfeshnee's Horror Nimbus ability for the next 24 hours.</p>
        `,
        'duration': {
            'seconds': 86400
        }
    };
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} NalfFe` })
        let effectDataImmune = {
            'name': "Nalfeshnee: Fear Immune",
            'icon': "modules/mba-premades/icons/spells/level3/fear.webp",
            'description': `
                <p>You are immune to Nalfeshnee's Horror Nimbus ability for the next 24 hours.</p>
            `,
            'duration': {
                'seconds': 86400
            }
        };
        await mbaPremades.helpers.createEffect(token.actor, effectDataImmune);
    };
    let effectData = {
        'name': "Nalfeshnee: Fear",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.oR1wUvem3zVVUv5Q]{Frightened} by Nalfeshnee's Horror Nimbus for the duration.</p>
            <p>You can repeat the saving throw at the end of each of your turns, ending the effect on a success.</p>
            <p>If your saving throw is successful or the effect ends, you are immune to the Nalfeshnee's Horror Nimbus for the next 24 hours.</p>
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
                'value': `turn=end, saveAbility=wis, saveDC=15, saveMagic=false, name=Fear: Turn End (DC15), killAnim=true`,
                'priority': 20
            },
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };
    if (workflow.saves.size) {
        for (let target of Array.from(workflow.saves)) {
            new Sequence()

                .effect()
                .file("jb2a.toll_the_dead.purple.skull_smoke")
                .atLocation(target)
                .scaleToObject(2.5, { considerTokenScale: true })
                .opacity(0.9)
                .playbackRate(0.5)

                .thenDo(async () => {
                    await mba.createEffect(target.actor, effectDataImmune);
                })

                .play()
        }
    }
    if (workflow.failedSaves.size) {
        for (let target of Array.from(workflow.failedSaves)) {
            new Sequence()

                .effect()
                .file("jb2a.toll_the_dead.purple.skull_smoke")
                .atLocation(target)
                .scaleToObject(2.5, { considerTokenScale: true })
                .opacity(0.9)
                .playbackRate(0.5)

                .effect()
                .file("jb2a.template_circle.symbol.normal.fear.dark_purple")
                .attachTo(target)
                .scaleToObject(1.6)
                .fadeIn(2000)
                .fadeOut(1000)
                .mask()
                .persist()
                .name(`${target.document.name} NalfFe`)

                .thenDo(async () => {
                    await mba.createEffect(target.actor, effectData);
                })

                .play()
        }
    }
}

async function teleport({ speaker, actor, token, character, item, args, scope, workflow }) {
    let randomColor = true;
    let colors = [
        ["Blue", "blue"],
        ["Black", "dark_black"],
        ["Dark Green", "dark_green"],
        ["Dark Red", "dark_red"],
        ["Green", "green"],
        ["Grey", "grey"],
        ["Orange", "orange"],
        ["Pink", "pink"],
        ["Purple", "purple"],
        ["Red", "red"],
        ["Yellow", "yellow"]
    ];
    let animRoll1 = await new Roll('1d11').roll({ 'async': true });
    let animRoll2 = await new Roll('1d11').roll({ 'async': true });
    let animation1 = "jb2a.misty_step.01." + colors[(animRoll1.total - 1)][1];
    let animation2 = "jb2a.misty_step.02." + colors[(animRoll2.total - 1)][1];
    if (randomColor === false) {
        let selection = await mba.dialog("Nalfeshnee: Teleport", colors, "<b>Select color:</b>");
        if (!selection) return;
        animation1 = "jb2a.misty_step.01." + selection;
        animation2 = "jb2a.misty_step.02." + selection;
    }
    let interval = workflow.token.document.width % 2 === 0 ? 1 : -1;
    let position = await mba.aimCrosshair(workflow.token, 120, workflow.item.img, interval, workflow.token.document.width);
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

export let nalfeshnee = {
    'horrorNimbusCast': horrorNimbusCast,
    'horrorNimbusItem': horrorNimbusItem,
    'teleport': teleport
}