export async function tashaHideousLaughter({speaker, actor, token, character, item, args, scope, workflow}) {
    if (args[0].macroPass === "isDamaged")
    {
    const activeLaugh = Sequencer.EffectManager.getEffects({ name: "Laugh", object: token });
    if(activeLaugh) Sequencer.EffectManager.endEffects({ name: "Laugh", object: token });
    const originItem = await fromUuid(actor.effects.find((eff) => eff.name === "Hideous Laughter").origin);
    const spellDC = originItem.actor.system.attributes.spelldc;
    const uuid = originItem.actor.uuid;
    const saveAbility = "wis";

    let effectAdv = [{
        changes: [{ key: "flags.midi-qol.advantage.ability.save.wis", mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM, value: 1, priority: 20 }],
        flags: { "dae": { "token": actor.uuid, specialDuration: ["isSave"] } },
        disabled: false,
        name: `Damaged - Advantage on Save`
    }];
    let checkEffect = actor.effects.find(i => i.name ===  `Damaged - Advantage on Save`);
    if(!checkEffect) await MidiQOL.socket().executeAsGM("createEffects", { actorUuid: actor.uuid, effects: effectAdv });

    const itemData = originItem.clone(
    {
    name: "Hideous Laughter Saving Throw",
    type: "feat",
    effects: [],
    flags: {
        "midi-qol": {
        noProvokeReaction: true,
        onUseMacroName: null,
        forceCEOff: true
        },
    },
    system: {
        equipped: true,
        actionType: "save",
        save: { dc: spellDC, ability: saveAbility, scaling: "flat" },
        "target.type": "self",
        components: { concentration: false, material: false, ritual: false, somatic: false, value: "", vocal: false },
        duration: { units: "inst", value: undefined },
    },
    },
    { keepId:true }
    );
    itemData.system.target.type = "self";
    setProperty(itemData.flags, "autoanimations.killAnim", true);
    const itemUpdate = new CONFIG.Item.documentClass(itemData, { parent: actor });
    const options = { showFullCard: false, createWorkflow: true, versatile: false, configureDialog: false };
    const saveResult = await MidiQOL.completeItemUse(itemUpdate, {}, options);
    if (saveResult.failedSaves.size === 0)
    {
        const hasConcApplied = await game.dfreds.effectInterface.hasEffectApplied('Concentrating', uuid);
        if (hasConcApplied)	game.dfreds.effectInterface.removeEffect({ effectName: 'Concentrating', uuid });
    }
    }

    if (args[0].macroPass === "postSave")
    {
    const targetToken = workflow.hitTargets.values().next().value;
    const targetActor = targetToken.actor;
    const intScore = targetActor.system.abilities.int.value;
    const uuid = targetActor.uuid;

    if(workflow.failedSaves.size !== 0 && intScore > 4)
    {
    const hasProneApplied = await game.dfreds.effectInterface.hasEffectApplied('Prone', uuid);
    if (!hasProneApplied) await game.dfreds.effectInterface.addEffect({ effectName: 'Prone', uuid });

    //Original Design Author: EskieMoh#2969

    //Determine Target facing
    let facing;
    let mirrorFace;

    if(Tagger.hasTags(targetToken, "RFace") && targetToken.document.mirrorX ==  false || !Tagger.hasTags(targetToken, "RFace") && targetToken.document.mirrorX ==  true){
    facing = -1;
    mirrorFace = false;
    } else {
    facing = 1;
    mirrorFace = true;
    }; 

    //Start Animation
    await new Sequence()

    .sound()
        .file("assets/sounds/joker-laugh.ogg")
        .fadeInAudio(500)
        .fadeOutAudio(500)

    .effect()
    .atLocation(token)
    .file(`jb2a.magic_signs.circle.02.enchantment.loop.dark_yellow`)
    .scaleToObject(1.25)
    .rotateIn(180, 600, {ease: "easeOutCubic"})
    .scaleIn(0, 600, {ease: "easeOutCubic"})
    .loopProperty("sprite", "rotation", { from: 0, to: -360, duration: 10000})
    .belowTokens()
    .fadeOut(2000)
    .zIndex(0)

    .effect()
    .atLocation(token)
    .file(`jb2a.magic_signs.circle.02.enchantment.loop.dark_yellow`)
    .scaleToObject(1.25)
    .rotateIn(180, 600, {ease: "easeOutCubic"})
    .scaleIn(0, 600, {ease: "easeOutCubic"})
    .loopProperty("sprite", "rotation", { from: 0, to: -360, duration: 10000})
    .belowTokens(true)
    .filter("ColorMatrix", {saturate:-1, brightness:2})
    .filter("Blur", { blurX: 5, blurY: 10 })
    .zIndex(1)
    .duration(1200)
    .fadeIn(200, {ease: "easeOutCirc", delay: 500})
    .fadeOut(300, {ease: "linear"})

    .effect()
    .file("jb2a.markers.fear.orange.03")
    .scaleIn(0, 500, {ease: "easeOutQuint"})
    .delay(500)
    .atLocation(token, {offset:{y:-0.2}, gridUnits:true, randomOffset: 1.5})
    .scaleToObject(0.5)
    .zIndex(1)
    .playbackRate(1.5)
    .repeats(5, 200, 200)
    .fadeOut(500)
    .waitUntilFinished(-1500)

    .effect()
    .file("animated-spell-effects-cartoon.level 01.bless.yellow")
    .atLocation(targetToken, {randomOffset: 1.2, gridUnits:true})
    .scaleToObject(0.5)
    .repeats(8, 100,100)
    .zIndex(1)

    .effect()
    .file("animated-spell-effects-cartoon.cantrips.mending.yellow")
    .atLocation(targetToken)
    .scaleToObject(3)
    .opacity(0.75)
    .filter("ColorMatrix", { saturate: 1,brightness: 1.3, hue: -5 })
    .zIndex(0)
    .waitUntilFinished(-500)

    .effect()
    .delay(300)
    .file("jb2a.impact.002.orange")
    .atLocation(targetToken)
    .scaleToObject(2)
    .opacity(1)
    .filter("ColorMatrix", { hue: 6 })
    .zIndex(0)

    .effect()
    .file("jb2a.particles.inward.white.02.03")
    .scaleIn(0, 500, {ease: "easeOutQuint"})
    .delay(300)
    .fadeOut(1000)
    .atLocation(targetToken)
    .duration(1000)
    .size(1.75, {gridUnits: true})
    .animateProperty("spriteContainer", "position.y", {  from:0 , to: -0.5, gridUnits:true, duration: 1000})
    .zIndex(1)

    .effect()
    .file("animated-spell-effects-cartoon.magic.impact.02")
    .atLocation(targetToken)
    .scaleToObject(2)
    .opacity(1)
    .zIndex(0)
    .belowTokens()

    .play();

    new Sequence()

    .effect()
    .name("Fear")
    .file("jb2a.markers.fear.dark_orange.03")
    .attachTo(targetToken,{local: true, bindAlpha: false})
    .scaleToObject(2)
    .opacity(1)
    .zIndex(0)
    .persist()

    .animation()
    .on(targetToken)
    .opacity(0)

    .effect()
    .name("Laugh")
    .file("https://i.imgur.com/SQWSf10.png")
    .attachTo(targetToken, {offset:{x:0.4*token.document.width, y:-0.45*token.document.width}, gridUnits: true, local: true, bindAlpha: false})
    .loopProperty("sprite", "rotation", { from: 0, to: 15, duration: 250, ease: "easeOutCubic" })
    .loopProperty("sprite", "position.y", { from: 0, to: -0.025, duration: 250, gridUnits: true, pingPong: false })
    .scaleToObject(0.34)
    .private()
    .persist()

    .effect()
    .name("Laugh")
    .file("https://i.imgur.com/iWuBQ10.png")
    .attachTo(targetToken, {offset:{x:0.55*token.document.width, y:0}, gridUnits: true, local: true, bindAlpha: false})
    .loopProperty("sprite", "rotation", { from: 0, to: -20, duration: 250,ease: "easeOutCubic" })
    .loopProperty("sprite", "position.y", { from: 0, to: -0.025, duration: 250, gridUnits: true, pingPong: false })
    .scaleToObject(0.34)
    .private()
    .persist()

    .effect()
    .name("Laugh")
    .from(targetToken)
    .scaleToObject(1, {considerTokenScale: true})
    .attachTo(targetToken,{ bindAlpha: false})
    .loopProperty("sprite", "position.y", { from: 0, to: 0.01, duration: 150, gridUnits: true, pingPong: true, ease:"easeOutQuad" })
    .loopProperty("sprite", "rotation", { from: -33, to: 33, duration: 300, ease: "easeOutCubic", pingPong: true })
    .rotate(-90*facing)
    .loopProperty("sprite", "width", { from: 0, to: 0.015, duration: 150, gridUnits: true, pingPong: true, ease:"easeOutQuad" })
    .loopProperty("sprite", "height", { from: 0, to: 0.015, duration: 150, gridUnits: true, pingPong: true, ease:"easeOutQuad"  })
    .persist()
    .waitUntilFinished(-200)

    .animation()
    .on(targetToken)
    .opacity(1)

    .play()
    }
    }

    if(args[0] === "off")
    {
        const activeLaugh = Sequencer.EffectManager.getEffects({ name: "Laugh", object: token });
        const activeFear = Sequencer.EffectManager.getEffects({ name: "Fear", object: token });
        if(activeLaugh)	Sequencer.EffectManager.endEffects({ name: "Laugh", object: token });
        if(activeFear) Sequencer.EffectManager.endEffects({ name: "Fear", object: token });
    }

    if (args[0].macroPass === "postActiveEffects")
    {
    const targetToken = workflow.hitTargets.values().next().value;
    const targetActor = targetToken.actor;
    const intScore = targetActor.system.abilities.int.value;
    const uuid = actor.uuid;
    if (intScore <= 4) {
        ui.notifications.warn("Это существо невосприимчиво к Tasha's Hideous Laughter (слишком низкий интеллект)")
        await game.dfreds.effectInterface.removeEffect({ effectName: 'Concentrating', uuid });
    }
    }
}