import {mba} from "../../../helperFunctions.js";

export async function arcaneRecovery({ speaker, actor, token, character, item, args, scope, workflow }) {
    //check if actor is wizard and get his levels
    let wizardLevel = workflow.actor.classes.wizard?.system?.levels;
    if (!wizardLevel) {
        ui.notifications.warn("Actor has no Wizard levels!");
        return;
    }

    //calculate available points
    let ammount = Math.ceil(wizardLevel / 2);

    //check if actor has expended slots
    const check = Array.from(Object.entries(workflow.actor.system.spells).filter(i => i[0] != "spell7" && i[0] != "spell8" && i[0] != "spell9" && i[0] != "pact" && i[1].value < i[1].max));
    if (!check.length) {
        ui.notifications.info("You don't have any expended spell slots!");
        return;
    }

    new Sequence()

        .effect()
        .file("jb2a.icosahedron.rune.below.blueyellow")
        .attachTo(workflow.token)
        .scaleToObject(2.25 * workflow.token.document.texture.scaleX)
        .fadeIn(1000)
        .fadeOut(2000)
        .scaleIn(0, 600, { 'ease': 'easeOutCubic' })
        .rotateIn(180, 600, { 'ease': 'easeOutCubic' })
        .loopProperty('sprite', 'rotation', { 'from': 0, 'to': -360, 'duration': 10000 })
        .filter("ColorMatrix", { hue: 150 })
        .belowTokens()
        .zIndex(0)
        .persist()
        .name(`${workflow.token.document.name} Arcane Recovery`)

        .effect()
        .file("jb2a.icosahedron.rune.below.blueyellow")
        .attachTo(workflow.token)
        .scaleToObject(2.25 * workflow.token.document.texture.scaleX)
        .duration(1200)
        .fadeIn(200, { 'ease': 'easeOutCirc', 'delay': 500 })
        .fadeOut(300, { 'ease': 'linear' })
        .scaleIn(0, 600, { 'ease': 'easeOutCubic' })
        .rotateIn(180, 600, { 'ease': 'easeOutCubic' })
        .loopProperty('sprite', 'rotation', { 'from': 0, 'to': -360, 'duration': 10000 })
        .belowTokens(true)
        .filter('ColorMatrix', { 'hue': 150 })
        .zIndex(1)
        .persist()
        .name(`${workflow.token.document.name} Arcane Recovery`)

        .play();

    //repeat dialog promt until no points
    while (ammount > 0) {
        await warpgate.wait(50);

        //filter pact, 7-9 levels and levels w/o expended slots
        let choices = [];
        for (let i of Object.entries(workflow.actor.system.spells).filter(i => i[0] != "spell7" && i[0] != "spell8" && i[0] != "spell9" && i[0] != "pact" && ammount >= i[0].slice(-1))) {
            let level = +i[0].slice(5);
            if (i[1].value < i[1].max) choices.push([`<b>Level: ${level}</b> (Current: <b>${i[1].value}/${i[1].max}</b>)`, level, `modules/mba-premades/icons/class/wizard/arcane_recovery_${level}.webp`]);
        }
        if (!choices.length) {
            ammount = 0;
            continue;
        }
        choices.push(["Cancel", false, "modules/mba-premades/icons/conditions/incapacitated.webp"]);
        let slotLevel = await mba.selectImage("Arcane Recovery", choices, `Choose spell slot level to recover:<br>(Points Left: <b>${ammount}</b>)`, "value");
        if (!slotLevel) {
            ammount = 0;
            continue;
        }
        let path = `system.spells.spell${slotLevel}.value`;
        let newValue = foundry.utils.getProperty(workflow.actor, path) + 1;
        if (isNaN(newValue)) {
            ui.notifications.warn("Unable to find spell level path!");
            Sequencer.EffectManager.endEffects({ 'name': `${workflow.token.document.name} Arcane Recovery`, 'object': workflow.token });
            return;
        }
        await workflow.actor.update({ [path]: newValue });
        ammount -= slotLevel;
    }

    new Sequence()

        .effect()
        .file("jb2a.particle_burst.01.circle.bluepurple")
        .attachTo(workflow.token)
        .scaleToObject(2 * workflow.token.document.texture.scaleX)
        .fadeIn(1000)
        .filter("ColorMatrix", { hue: 330 })
        .playbackRate(0.9)

        .wait(750)

        .thenDo(async () => {
            await Sequencer.EffectManager.endEffects({ 'name': `${workflow.token.document.name} Arcane Recovery`, 'object': workflow.token });
        })

        .play()
}