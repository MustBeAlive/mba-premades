import {mba} from "../../../helperFunctions.js";
import {constants} from "../../generic/constants.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    if (!target) return;
    if (!mba.findEffect(target.actor, "Deafened")) return;
    await mba.createEffect(target.actor, constants.immunityEffectData);
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) {
        new Sequence()

            .effect()
            .file("jb2a.music_notations.{{music}}.purple")
            .scaleIn(0, 500, { ease: "easeOutQuint" })
            .atLocation(workflow.token, { offset: { y: -0.2 }, gridUnits: true, randomOffset: 1 })
            .scaleToObject(0.8)
            .zIndex(1)
            .playbackRate(1.5)
            .setMustache({
                "music": () => {
                    const musics = [`bass_clef`, `beamed_quavers`, `crotchet`, `flat`, `quaver`, `treble_clef`];
                    return musics[Math.floor(Math.random() * musics.length)];
                }
            })
            .repeats(5, 200, 200)
            .fadeOut(500)

            .play()

        return;
    }
    const gmInputType = "freeform"; //"freeform", "dropdown", "" (disable)
    const gmInputText = ["You smell worse than a golbin!", "I've seen more threatening geckos!", "Your momma's so ugly, clerics try to turn her!"];
    let target = workflow.targets.first();
    if (!target) return;
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} VicMoc` })
    };
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': "You have disadvantage on the next attack roll you make before the end of your next turn",
        'changes': [
            {
                'key': 'flags.midi-qol.disadvantage.attack.all',
                'mode': 2,
                'value': 1,
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ["1Attack", "turnEnd", "combatEnd"]
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 0,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };

    if ((gmInputType !== "dropdown" && gmInputType !== "freeform") || !gmInputType) return;

    let word = [];
    let wordInput;
    await mba.playerDialogMessage();
    if (gmInputType === "dropdown") {
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
    else if (gmInputType === "freeform") {
        wordInput = await warpgate.menu({

            inputs: [{
                label: `What do you say?`,
                type: 'text',
                options: ``
            }],
            buttons: [{
                label: 'Let\'s go!',
                value: 1
            }]
        },
            { title: 'Vicious Mockery' }
        );
    }
    await mba.clearPlayerDialogMessage();
    word.push(wordInput.inputs);

    const style = {
        "fill": "#ffffff",
        "fontFamily": "Helvetica",
        "fontSize": 40,
        "strokeThickness": 0,
        fontWeight: "bold",

    }

    new Sequence()

        .effect()
        .file("jb2a.music_notations.{{music}}.purple")
        .scaleIn(0, 500, { ease: "easeOutQuint" })
        .atLocation(workflow.token, { offset: { y: -0.2 }, gridUnits: true, randomOffset: 1 })
        .scaleToObject(0.8)
        .zIndex(1)
        .playbackRate(1.5)
        .setMustache({
            "music": () => {
                const musics = [`bass_clef`, `beamed_quavers`, `crotchet`, `flat`, `quaver`, `treble_clef`];
                return musics[Math.floor(Math.random() * musics.length)];
            }
        })
        .repeats(5, 200, 200)
        .fadeOut(500)

        .sound()
        .file("modules/dnd5e-animations/assets/sounds/Creatures/laughter.mp3")
        .fadeInAudio(500)
        .fadeOutAudio(500)

        .effect()
        .atLocation(target, { offset: { x: -0.25 * target.document.width, y: -0.3 * target.document.width }, gridUnits: true })
        .delay(500)
        .text(`${word}`, style)
        .duration(5000)
        .fadeOut(1000)
        .animateProperty("sprite", "position.x", { from: -2.0, to: 0, duration: 2000, gridUnits: true, ease: "easeInExpo" })
        .animateProperty("sprite", "position.y", { from: -2.0, to: 0, duration: 2000, gridUnits: true, ease: "easeInExpo" })
        .animateProperty("sprite", "rotation", { from: 0, to: 45, duration: 500, ease: "easeOutElastic" })
        .animateProperty("sprite", "rotation", { from: -2.5, to: 2.5, duration: 500, ease: "easeOutElastic", delay: 650 })
        .scaleIn(0, 1000, { ease: "easeOutElastic" })
        .filter("Glow", { color: 0x6820ee })
        .zIndex(2)
        .shape("polygon", {
            lineSize: 1,
            lineColor: "#FF0000",
            fillColor: "#FF0000",
            points: [{ x: -4, y: -4 }, { x: 1.175, y: -1 }, { x: -1, y: 1.175 }],
            fillAlpha: 1,
            gridUnits: true,
            isMask: true,
            name: "test"
        })

        .effect()
        .delay(1500)
        .from(target)
        .attachTo(target)
        .fadeIn(200)
        .fadeOut(500)
        .loopProperty("sprite", "position.x", { from: -0.05, to: 0.05, duration: 50, pingPong: true, gridUnits: true })
        .scaleToObject(target.document.texture.scaleX)
        .duration(1800)
        .opacity(0.2)
        .tint(0x6820ee)

        .effect()
        .file("jb2a.impact.010.purple")
        .delay(2500)
        .atLocation(target, { offset: { x: -0.25 * target.document.width, y: -0.3 * target.document.width }, gridUnits: true })
        .scaleToObject(1.25)
        .zIndex(1)

        .effect()
        .file("animated-spell-effects-cartoon.misc.demon")
        .delay(2500)
        .atLocation(target, { offset: { x: -0, y: -0.5 * target.document.width }, gridUnits: true })
        .scaleToObject(0.75)
        .playbackRate(1.5)
        .rotate(-20)
        .filter("ColorMatrix", { hue: -100 })

        .effect()
        .file("animated-spell-effects-cartoon.misc.demon")
        .delay(2500)
        .atLocation(target, { offset: { x: -0.5 * target.document.width, y: -0 }, gridUnits: true })
        .scaleToObject(0.75)
        .playbackRate(1.5)
        .rotate(15)
        .filter("ColorMatrix", { hue: -100 })

        .effect()
        .file("jb2a.markers.fear.orange.03")
        .delay(2500)
        .attachTo(target)
        .scaleToObject(1.7 * target.document.texture.scaleX)
        .filter("ColorMatrix", { hue: 260 })
        .fadeIn(1000)
        .fadeOut(1000)
        .persist()
        .name(`${target.document.name} VicMoc`)

        .wait(2500)

        .thenDo(async () => {
            await mba.createEffect(target.actor, effectData);
        })

        .play()
}

export let viciousMockery = {
    'cast': cast,
    'item': item
}