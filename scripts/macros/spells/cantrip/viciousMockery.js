// Original macro by GPS
export async function viciousMockery({speaker, actor, token, character, item, args, scope, workflow}) {
    const gmInputType = "freeform"; //Input "freeform" for a text box users can enter their text into. Input "dropdown" to use a list of selectable options for players that you can change below in gmInputText. Input "" to disable animations.
    const gmInputText = ["I really really really don't like you", "You shall not pass", "Ew gross"];

    const target = workflow.hitTargets.first();
    const targetActor = target.actor;
    const targetUuid = target.document.uuid;
    const uuid = targetActor.uuid;
    const hasDeafenedApplied = await game.dfreds.effectInterface.hasEffectApplied('Deafened', uuid);
    const saveAbility = "wis";
    const damageType = "psychic";
    const spellDC = actor.system.attributes.spelldc;
    let level = workflow.actor.system.details.level ?? workflow.actor.system.details.cr;
    let attackNum = 1 + (Math.floor((level + 1) / 6));

    if(!hasDeafenedApplied)
    {
    const itemData = item.clone(
    {
    img: "assets/library/icons/sorted/spells/cantrip/vicious_mockery.webp", //Change chat image here
    type: "feat",
    effects: [],
    flags: {
        "midi-qol": {
        noProvokeReaction: true,
        onUseMacroName: null,
        forceCEOff: true
        },"midiProperties": {
        nodam: true
        },
    },
    system: {
        equipped: true,
        actionType: "save",
        save: { dc: spellDC, ability: saveAbility, scaling: "flat" },
        damage: { parts: [[`${attackNum}d4`, damageType]] },
        components: { concentration: false, material: false, ritual: false, somatic: false, value: "", vocal: false },
        duration: { units: "inst", value: undefined }
    },
    },
    { keepId:true }
    );
    setProperty(itemData.flags, "autoanimations.killAnim", true);
    const itemUpdate = new CONFIG.Item.documentClass(itemData, { parent: actor });
    const options = { showFullCard: false, createWorkflow: true, versatile: false, configureDialog: false, targetUuids: [target.document.uuid], workflowOptions: {autoRollDamage: 'always', autoFastDamage: true} };
    const saveResult = await MidiQOL.completeItemUse(itemUpdate, {}, options);

    if (saveResult.failedSaves.size == 1) {
        const effectDisadv = [{
            changes: [{ key: "flags.midi-qol.disadvantage.attack.all", mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM, value: 1, priority: 20 }],
            flags: { "dae": { "token": targetUuid, "specialDuration": ["1Attack","turnEnd"] } },
            disabled: false,
            name: `Vicious Mockery`,
            icon: "assets/library/icons/sorted/spells/cantrip/vicious_mockery.webp",
            description: "You have disadvantage on the next attack roll you make before the end of your next turn"
        }];
        const checkEffect = targetActor.effects.find(i => i.name ===  `Vicious Mockery`);
        if(!checkEffect) await MidiQOL.socket().executeAsGM("createEffects", { actorUuid: uuid, effects: effectDisadv });

    if((gmInputType !== "dropdown" && gmInputType !== "freeform") || !gmInputType) return;

    new Sequence()

    .effect()
    .name("Casting")
    .atLocation(token)
    .file(`jb2a.magic_signs.circle.02.enchantment.loop.purple`)
    .scaleToObject(1.5)
    .rotateIn(180, 600, {ease: "easeOutCubic"})
    .scaleIn(0, 600, {ease: "easeOutCubic"})
    .loopProperty("sprite", "rotation", { from: 0, to: -360, duration: 10000})
    .belowTokens()
    .fadeOut(2000)
    .zIndex(0)

    .effect()
    .atLocation(token)
    .file(`jb2a.magic_signs.circle.02.enchantment.loop.purple`)
    .scaleToObject(1.5)
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
    .file("jb2a.music_notations.{{music}}.purple")
    .scaleIn(0, 500, {ease: "easeOutQuint"})
    .delay(500)
    .atLocation(token, {offset:{y:-0.2}, gridUnits:true, randomOffset: 1.5})
    .scaleToObject(0.8)
    .zIndex(1)
    .playbackRate(1.5)
    .setMustache({
    "music": ()=> {
    const musics = [`bass_clef`,`beamed_quavers`,`crotchet`,`flat`,`quaver`, `treble_clef`];
    return musics[Math.floor(Math.random()*musics.length)];
    }
    })
    .repeats(5, 200, 200)
    .fadeOut(500)

    .play()

    let word = [];
    let wordInput;
    if(gmInputType === "dropdown") {
        wordInput = await warpgate.menu({
            inputs: [{
                label: `What do you say?`,
                type: 'select',
                options: gmInputText.map(text => ({ label: text, value: text }))
            }],
            buttons: [{
                label: 'Let\'s go!',
                value: 1
            }],
            title: 'Vicious Mockery'
        });
    }
    else if(gmInputType === "freeform") {
        wordInput = await warpgate.menu({

            inputs: [{
                    label: `What do you say?`,
                    type: 'text',
                options: ``
            }],
                buttons: [{
                    label: 'Let\'s go!',
                    value: 1}]
                },
                {title: 'Vicious Mockery'}
            );
    }
        
    word.push(wordInput.inputs);
        
    const style = {
        "fill": "#ffffff",
        "fontFamily": "Helvetica",
        "fontSize": 40,
        "strokeThickness": 0,
        fontWeight: "bold",

    }

    new Sequence()

    .sound()
        .file("modules/dnd5e-animations/assets/sounds/Creatures/laughter.mp3")
        .fadeInAudio(500)
        .fadeOutAudio(500)

    .effect()
    .atLocation(target, {offset: {x: -0.25*target.document.width, y:-0.3*target.document.width}, randomOffset: 0.1, gridUnits: true})
    .file(`animated-spell-effects-cartoon.level 01.healing word.purple`)
    .fadeOut(250)
    .zIndex(1)
    .scale(0.25*target.width)
    .scaleIn(0, 500, {ease: "easeOutBack"})
    .zIndex(0)
    .animateProperty("sprite", "position.x", { from: -0.6, to:0, duration: 600, gridUnits: true, ease: "easeInExpo" })
    .animateProperty("sprite", "position.y", { from: -0.6, to:0, duration: 600, gridUnits: true, ease: "easeInExpo" })
    .animateProperty("sprite", "rotation", { from: 0, to:45, duration: 10,  ease: "easeOutElastic" })
    .scaleIn(0, 500, {ease: "easeOutElastic"})
    .filter("ColorMatrix", { hue: 50 })

    .effect()
    .file("jb2a.particles.outward.orange.02.02")
    .atLocation(target, {offset: {x: -0.25*target.document.width, y:-0.3*target.document.width}, randomOffset: 0.1, gridUnits: true})
    .scale(0.25*target.width)
    .duration(800)
    .fadeOut(200)
    .zIndex(1)
    .animateProperty("sprite", "position.x", { from: -0.6, to:0, duration: 600, gridUnits: true, ease: "easeInExpo" })
    .animateProperty("sprite", "position.y", { from: -0.6, to:0, duration: 600, gridUnits: true, ease: "easeInExpo" })
    .animateProperty("sprite", "rotation", { from: 0, to:45, duration: 10,  ease: "easeOutElastic" })
    .scaleIn(0, 500, {ease: "easeOutElastic"})
    .zIndex(2)

    .effect()
    .atLocation(target, {offset: {x: -0.25*target.document.width, y:-0.3*target.document.width}, randomOffset: 0.1, gridUnits: true})
    .text(`${word}`, style)
    .duration(5000)
    .fadeOut(1000)
    .animateProperty("sprite", "position.x", { from: -2.0, to:0, duration: 2000, gridUnits: true, ease: "easeInExpo" })
    .animateProperty("sprite", "position.y", { from: -2.0, to:0, duration: 2000, gridUnits: true, ease: "easeInExpo" })
    .animateProperty("sprite", "rotation", { from: 0, to:45, duration: 500,  ease: "easeOutElastic" })
    .animateProperty("sprite", "rotation", { from: -2.5, to:2.5, duration: 500,  ease: "easeOutElastic", delay: 650 })
    .scaleIn(0, 1000, {ease: "easeOutElastic"})
    .filter("Glow", { color: 0x6820ee })
    .zIndex(2)
    .shape("polygon", {
                lineSize: 1,
                lineColor: "#FF0000",
                fillColor: "#FF0000",
    points: [{ x: -4, y: -4},{ x: 1.175, y: -1},{ x: -1, y: 1.175} ],
                fillAlpha: 1,
                gridUnits: true,
                isMask:true,
                name: "test"
            })
            
    .effect()
    .delay(600)
    .file("jb2a.impact.010.purple")
    .atLocation(target, {offset: {x: -0.25*target.document.width, y:-0.3*target.document.width},gridUnits: true})
    .scaleToObject(1.25)
    .zIndex(1)

    .effect()
    .delay(600)
    .from(target)
    .attachTo(target)
    .fadeIn(200)
    .fadeOut(500)
    .loopProperty("sprite", "position.x", { from: -0.05, to: 0.05, duration: 50, pingPong: true, gridUnits: true})
    .scaleToObject(target.document.texture.scaleX)
    .duration(1800)
    .opacity(0.2)
    .tint(0x6820ee)

    .effect()
    .delay(1200)
    .file("animated-spell-effects-cartoon.misc.demon")
    .atLocation(target, {offset: {x: -0, y:-0.5*target.document.width},gridUnits: true})
    .scaleToObject(0.75)
    .playbackRate(1.5)
    .rotate(-20)
    .filter("ColorMatrix", {hue:-100})

    .effect()
    .delay(1500)
    .file("animated-spell-effects-cartoon.misc.demon")
    .atLocation(target, {offset: {x: -0.5*target.document.width, y:-0},gridUnits: true})
    .scaleToObject(0.75)
    .playbackRate(1.5)
    .rotate(15)
    .filter("ColorMatrix", {hue:-100})

    .play()
    }
    }
    else
    {
        ui.notifications.warn("Taget cannot hear you and is unaffected by Vicious Mockery")
    }
}