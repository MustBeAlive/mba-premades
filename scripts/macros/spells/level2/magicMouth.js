import { mba } from "../../../helperFunctions.js";

export async function magicMouth({ speaker, actor, token, character, item, args, scope, workflow }) {
    let choices = [["Create Tile", "new"], ["Use Existing Tile", "old"]];
    let selection = await mba.dialog("Magic Mouth", choices, "<b></b>");
    if (!selection) return;
    if (selection === "new") {
        //set Tile Macro Id
        let macroId = "bla";
        //set Tile Trigger Method
        let triggerMethod = "dblrightclick";

        const aoeDistance = 3;
        let config = {
            size: 1,
            icon: workflow.item.img,
            label: 'Magic Mouth',
            tag: 'magic mouth',
            t: 'circle',
            drawIcon: true,
            drawOutline: true,
            interval: 0,
            rememberControlled: true,
        }
        let position = await warpgate.crosshairs.show(config);
        const captureArea = {
            x: position.x,
            y: position.y,
            scene: canvas.scene,
            radius: aoeDistance / canvas.scene.grid.distance * canvas.grid.size
        };
        let containedTiles = warpgate.crosshairs.collect(captureArea, 'Tile')
        let targetTile = containedTiles.find(tile => tile.hidden == false);
        let actionList = [
            //Landing 1 Action
            {
                action: "anchor",
                data: { tag: `_${triggerMethod}`, stop: true },
                id: "AB69696969696969"
            },
            //Player Type Action
            {
                action: "playertype",
                data: { gm: `Magic Mouth` },
                id: "A420420420420420"
            },
            //Landing 2 Action
            {
                action: "anchor",
                data: { tag: `Magic Mouth`, stop: false },
                id: "ACB4567890123456"
            },
            //Macro Action
            /*{
                action: "runmacro",
                data: { entity: { id: `Macro.${macroId}`, name: `${game.macros.get(macroId).name}` } },
                runasgm: "gm",
                id: "poitTIO09857dtbg"
            },*/
            //Landing 3 Action
            {
                action: "anchor",
                data: { tag: `Magic Mouth End`, stop: true },
                id: "ACB456789ft23s5Q"
            }
        ]

        if (!targetTile) {
            let createdTile = await canvas.scene.createEmbeddedDocuments("Tile", [{
                texture: { src: "modules/mba-premades/icons/skull2.webp" },
                hidden: false, //true
                x: position.x - canvas.grid.size / 2,
                y: position.y - canvas.grid.size / 2,
                width: 40,
                height: 40,
                flags: {
                    "monks-active-tiles": { actions: [], trigger: [] }
                },
            }]);
            targetTile = createdTile[0];
            console.log("newTile", targetTile)
        }

        let tileActions = targetTile.flags["monks-active-tiles"].actions;
        actionList.forEach(action => { tileActions.push(action); });
        let tileTriggers = targetTile.flags["monks-active-tiles"].trigger;
        console.log("tileTriggers", tileTriggers)
        if (!tileTriggers.includes(`${triggerMethod}`)) {
            tileTriggers.push(`${triggerMethod}`);
        }
        await targetTile.update({
            "flags.monks-active-tiles.active": true,
            "flags.monks-active-tiles.actions": tileActions,
            "flags.monks-active-tiles.trigger": tileTriggers,
        })

        new Sequence()

            .effect()
            .file("jb2a.cast_generic.sound.01.pinkteal")
            .atLocation(targetTile)
            .size(targetTile.width + canvas.grid.size / 4)
            .delay(250)
            .endTime(1000)
            .scaleOut(0, 500, { ease: "easeOutSine" })
            .tint("#4be7dc")
            .belowTokens()
            .filter("ColorMatrix", { brightness: 1.5 })

            .effect()
            .from(targetTile)
            .attachTo(targetTile, { bindAlpha: false })
            .size({ width: targetTile.width, height: targetTile.height })
            .duration(1750)
            .fadeIn(500)
            .fadeOut(500)
            .filter("Glow", { color: 0x4be7dc })
            .zIndex(0.2)
            .playIf(() => {
                return targetTile.hidden == false;
            })

            .effect()
            .file("jb2a.magic_signs.rune.02.loop.08.blue")
            .atLocation(targetTile)
            .size(0.4, { gridUnits: true })
            .duration(1250)
            .fadeOut(250)
            .scaleIn(0, 500, { ease: "easeOutBack" })
            .filter("ColorMatrix", { hue: -30 })
            .zIndex(1)

            .wait(1000)

            .effect()
            .file("jb2a.impact.010.blue")
            .atLocation(targetTile)
            .size(0.5, { gridUnits: true })
            .filter("ColorMatrix", { hue: -30 })
            .zIndex(1.1)

            .effect()
            .file(`jb2a.particles.outward.white.01.03`)
            .attachTo(targetTile, { offset: { y: 0.1 }, gridUnits: true, followRotation: false })
            .scale(0.2)
            .duration(1000)
            .fadeOut(800)
            .scaleIn(0, 1000, { ease: "easeOutCubic" })
            .animateProperty("sprite", "width", { from: 0, to: 0.25, duration: 500, gridUnits: true, ease: "easeOutBack" })
            .animateProperty("sprite", "height", { from: 0, to: 1.0, duration: 1000, gridUnits: true, ease: "easeOutBack" })
            .animateProperty("sprite", "position.y", { from: 0, to: -0.6, duration: 1000, gridUnits: true })
            .tint("#4be7dc")
            .zIndex(0.3)

            .play()
    }
    else if (selection === "old") {
        let magicMouth = tile.document;
        let activeEffect = Sequencer.EffectManager.getEffects({ name: `Magic Mouth`, object: magicMouth }).length > 0;
        if (!activeEffect) {
            new Sequence()

                .animation()
                .on(magicMouth)
                .opacity(0)

                .effect()
                .name(`Magic Mouth`)
                .from(magicMouth)
                .attachTo(magicMouth, { bindAlpha: false })
                .size({ width: magicMouth.width, height: magicMouth.height })
                .belowTokens()
                .filter("Glow", { color: 0x4be7dc })
                .persist()
                .zIndex(0.2)
                .loopProperty("sprite", "position.y", { from: 0, to: -0.05, duration: 150, pingPong: true, gridUnits: true, ease: "easeOutSine" })
                .loopProperty("sprite", "rotation", { values: [0, 3, 0, -3], duration: 150, pingPong: true, ease: "easeInSine" })
                .playIf(() => {
                    return magicMouth.hidden == false;
                })

                .effect()
                .name(`Magic Mouth`)
                .file("jb2a.markers.light_orb.loop.blue")
                .attachTo(magicMouth, { bindVisibility: false, bindAlpha: false })
                .size(0.65, { gridUnits: true })
                .belowTokens()
                .persist()
                .zIndex(0.2)
                .loopProperty("sprite", "width", { from: 0, to: -0.075, duration: 150, pingPong: true, gridUnits: true, ease: "easeOutCubic" })
                .loopProperty("sprite", "height", { from: 0, to: -0.025, duration: 150, pingPong: true, gridUnits: true, ease: "easeOutSine" })
                .filter("ColorMatrix", { hue: -15 })
                .scaleIn(0, 500, { ease: "easeOutBack" })
                .scaleOut(0, 1000, { ease: "easeOutSine" })
                .fadeOut(1000)
                .opacity(0.8)
                .playIf(() => {
                    return magicMouth.hidden == true;
                })

                .effect()
                .name(`Magic Mouth`)
                .file("animated-spell-effects-cartoon.electricity.wifi.02")
                .attachTo(magicMouth, { bindAlpha: false, bindVisibility: false })
                .scaleToObject(1.1)
                .playbackRate(1.25)
                .belowTokens()
                .filter("ColorMatrix", { hue: -45 })
                .persist()
                .zIndex(0.1)

                .play()

        } else {
            Sequencer.EffectManager.endEffects({ name: `Magic Mouth`, object: magicMouth });
            new Sequence()

                .animation()
                .on(magicMouth)
                .opacity(1)

                .play()
        }
    }
}