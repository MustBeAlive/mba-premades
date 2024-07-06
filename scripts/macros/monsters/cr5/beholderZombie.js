import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function rayRoll({ speaker, actor, token, character, item, args, scope, workflow }) {
    const target = workflow.targets.first();
    let rollFormula = "1d4";
    let rayRoll = await new Roll(rollFormula).roll({ 'async': true });
    await MidiQOL.displayDSNForRoll(rayRoll);
    rayRoll.toMessage({
        rollMode: 'roll',
        speaker: { 'alias': name },
        flavor: "Beholder Zombie: Ray Randomiser"
    });
    let featureData;
    let animation;
    let ray = rayRoll.total;
    if (ray === 1) {
        featureData = await mba.getItemFromCompendium('mba-premades.MBA Monster Features', 'Beholder Zombie: Paralyzing Ray', false);
        if (!featureData) return;
        animation = "jb2a.scorching_ray.01.pink";
    }
    else if (ray === 2) {
        featureData = await mba.getItemFromCompendium('mba-premades.MBA Monster Features', 'Beholder Zombie: Fear Ray', false);
        if (!featureData) return;
        animation = "jb2a.scorching_ray.01.purple";
    }
    else if (ray === 3) { // test color
        featureData = await mba.getItemFromCompendium('mba-premades.MBA Monster Features', 'Beholder Zombie: Enervation Ray', false);
        if (!featureData) return;
        animation = "jb2a.scorching_ray.01.green";
    }
    else if (ray === 4) {
        featureData = await mba.getItemFromCompendium('mba-premades.MBA Monster Features', 'Beholder Zombie: Disintegration Ray', false);
        if (!featureData) return;
        animation = "jb2a.scorching_ray.01.red";
    }
    delete featureData._id;
    let feature = new CONFIG.Item.documentClass(featureData, { 'parent': workflow.actor });
    let [config, options] = constants.syntheticItemWorkflowOptions([target.document.uuid]);
    await MidiQOL.completeItemUse(feature, config, options);
    new Sequence()

        .effect()
        .file(animation)
        .atLocation(workflow.token)
        .stretchTo(target)
        .repeats(3, 600, 600)

        .play();
}

async function rayParalyzing({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let target = workflow.targets.first();
    if (mba.checkTrait(target.actor, "ci", "paralyzed")) return;
    if (mba.findEffect(target.actor, "Beholder Zombie: Paralyzing Ray")) return;
    const effectData = {
        'name': "Beholder Zombie: Paralyzing Ray",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.jooSbuYlWEhaNpIi]{Paralyzed} by Beholder Zombie's Paralyzing Ray for the duration.</p>
            <p>You can repeat the saving throw at the end of each of your turns, ending the effect on a success.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': 'Paralyzed',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `turn=end, saveAbility=con, saveDC=14, saveMagic=false, name=Paralyzing Ray: Turn End (DC14), killAnim=true`,
                'priority': 20
            }
        ]
    };
    await mba.createEffect(target.actor, effectData);
}

async function rayFear({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let target = workflow.targets.first();
    if (mba.checkTrait(target.actor, "ci", "paralyzed")) return;
    if (mba.findEffect(target.actor, "Beholder Zombie: Fear Ray")) return;
    const effectData = {
        'name': "Beholder Zombie: Fear Ray",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.oR1wUvem3zVVUv5Q]{Frightened} by Beholder Zombie's Fear Ray for the duration.</p>
            <p>You can repeat the saving throw at the end of each of your turns, ending the effect on a success.</p>
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
                'value': `turn=end, saveAbility=wis, saveDC=14, saveMagic=false, name=Fear Ray: Turn End (DC14), killAnim=true`,
                'priority': 20
            }
        ]
    };
    await mba.createEffect(target.actor, effectData);
}

async function rayDisintegrating({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    if (target.actor.system.attributes.hp.value > 0) return;
    let centerX = target.x + canvas.grid.size / 2
    let centerY = target.y + canvas.grid.size / 2
    let updates = {
        'token': {
            'hidden': true
        }
    };
    let options = {
        'permanent': false,
        'name': 'Disintegration',
        'description': 'Disintegration'
    };

    new Sequence()

        .wait(2000)

        .animation()
        .on(target)
        .delay(400)
        .opacity(0)

        .effect()
        .file("animated-spell-effects-cartoon.smoke.97")
        .atLocation(target, { offset: { y: -0.25 }, gridUnits: true })
        .delay(500)
        .fadeIn(1000)
        .scaleIn(0, 1000, { ease: "easeOutCubic" })
        .duration(10000)
        .fadeOut(2000)
        .scaleToObject(0.8)
        .filter("ColorMatrix", { brightness: 0 })
        .zIndex(1)

        .effect()
        .atLocation({ x: centerX, y: centerY })
        .from(target)
        .scaleToObject(target.document.texture.scaleX)
        .shape("circle", {
            lineSize: 25,
            lineColor: "#FF0000",
            radius: 0.4,
            gridUnits: true,
            name: "test",
            isMask: true,
            offset: { x: canvas.grid.size * 0.1, y: -canvas.grid.size * 0.4 },
        })
        .duration(4000)
        .fadeOut(2000)
        .name(`1.2`)

        .effect()
        .atLocation({ x: centerX, y: centerY })
        .from(target)
        .scaleToObject(target.document.texture.scaleX)
        .shape("circle", {
            lineSize: 25,
            lineColor: "#FF0000",
            radius: 0.45,
            gridUnits: true,
            name: "test",
            isMask: true,
            offset: { x: -canvas.grid.size * 0.4, y: canvas.grid.size * 0.3 },
        })
        .duration(6000)
        .fadeOut(2000)
        .name(`2`)

        .effect()
        .atLocation({ x: centerX, y: centerY })
        .from(target)
        .scaleToObject(target.document.texture.scaleX)
        .shape("circle", {
            lineSize: 25,
            lineColor: "#FF0000",
            radius: 0.45,
            gridUnits: true,
            name: "test",
            isMask: true,
            offset: { x: canvas.grid.size * 0.5, y: canvas.grid.size * 0.4 },
        })
        .duration(8000)
        .fadeOut(2000)
        .name(`3`)
        .waitUntilFinished()

        .thenDo(async () => {
            await warpgate.mutate(target.document, updates, {}, options);
        })

        .wait(500)

        .animation()
        .on(target)
        .opacity(1)

        .play()
}


export let beholderZombie = {
    'rayRoll': rayRoll,
    'rayParalyzing': rayParalyzing,
    'rayFear': rayFear,
    'rayDisintegrating': rayDisintegrating
}