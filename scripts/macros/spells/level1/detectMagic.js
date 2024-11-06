import { constants } from "../../generic/constants.js";
import { mba } from "../../../helperFunctions.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let featureData = await mba.getItemFromCompendium("mba-premades.MBA Spell Features", "Detect Magic: Ping", false);
    if (!featureData) return;
    delete featureData._id;
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} DeMa` })
        await warpgate.revert(token.document, "Detect Magic");
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>For the duration, you sense the presence of magic within 30 feet of you.</p>
            <p>If you sense magic in this way, you can use your action to see a faint aura around any visible creature or object in the area that bears magic, and you learn its school of magic, if any.</p>
            <p>The spell can penetrate most barriers, but it is blocked by 1 foot of stone, 1 inch of common metal, a thin sheet of lead, or 3 feet of wood or dirt.</p>
        `,
        'duration': {
            'seconds': 600
        },
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 1,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    let updates = {
        'embedded': {
            'Item': {
                [featureData.name]: featureData
            },
            'ActiveEffect': {
                [workflow.item.name]: effectData
            }
        }
    };
    let options = {
        'permanent': false,
        'name': "Detect Magic",
        'description': "Detect Magic"
    };
    new Sequence()

        .effect()
        .file("jb2a.token_border.circle.spinning.blue.001")
        .attachTo(workflow.token)
        .scaleToObject(2)
        .delay(1500)
        .fadeOut(1000)
        .scaleIn(0, 4000, { ease: "easeOutCubic" })
        .persist()
        .name(`${workflow.token.document.name} DeMa`)

        .thenDo(async () => {
            await warpgate.mutate(workflow.token.document, updates, {}, options);
            let feature = await mba.getItem(workflow.actor, "Detect Magic: Ping");
            if (!feature) return;
            let [config, options2] = constants.syntheticItemWorkflowOptions([workflow.token.document.uuid]);
            await MidiQOL.completeItemUse(feature, config, options2);
        })

        .play()
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    const aoeDistance = 30;
    const captureArea = {
        x: workflow.token.x + (canvas.grid.size * workflow.token.document.width) / 2,
        y: workflow.token.y + (canvas.grid.size * workflow.token.document.width) / 2,
        scene: canvas.scene,
        radius: aoeDistance / canvas.scene.grid.distance * canvas.grid.size
    };
    const containedTokens = warpgate.crosshairs.collect(captureArea, 'Token')
    let targets = Array.from(containedTokens);

    new Sequence()

        .effect()
        .file("jb2a.detect_magic.circle.blue")
        .atLocation(workflow.token)
        .size(12.5, { gridUnits: true })
        .fadeOut(4000)
        .opacity(0.75)
        .belowTokens()

        .play()

    for (let target of targets) {
        if (target.uuid === workflow.token.document.uuid) continue;
        const distance = Math.sqrt(Math.pow(target.x - workflow.token.x, 2) + Math.pow(target.y - workflow.token.y, 2));
        const gridDistance = distance / canvas.grid.size;
        let nondetection = target.actor.flags['mba-premades']?.spell?.nondetection;
        let validItems = target.actor.items.filter(i => i.type === 'weapon').concat(target.actor.items.filter(i => i.type === 'equipment'), target.actor.items.filter(i => i.type === 'consumable'));
        let magicItems = validItems.filter(i => i.system.properties?.mgc === true || i.system.attunement != 0 || i.name.includes("+1") || i.name.includes("+2") || i.name.includes("+3"));

        new Sequence()

            .effect()
            .file("jb2a.markers.circle_of_stars.blue")
            .atLocation(target)
            .scaleToObject(2.5)
            .delay(gridDistance * canvas.grid.size)
            .duration(5000)
            .fadeIn(1000)
            .fadeOut(1000)
            .mask(target)

            .wait(500)

            .effect()
            .from(target)
            .attachTo(target, { locale: true })
            .scaleToObject(1, { considerTokenScale: true })
            .delay(gridDistance * canvas.grid.size)
            .duration(17500)
            .fadeIn(1000, { delay: 1000 })
            .fadeOut(3500, { ease: "easeInSine" })
            .spriteRotation(target.rotation * -1)
            .loopProperty("alphaFilter", "alpha", { values: [0.1, 0.85], duration: 1500, pingPong: true, delay: 500 })
            .filter("Glow", { color: 0x008ae0, distance: 20 })
            .opacity(0.75)
            .belowTokens()
            .zIndex(0.1)
            .playIf(() => {
                if (nondetection) return false;
                return (magicItems.length);
            })

            .effect()
            .file("jb2a.extras.tmfx.outflow.circle.01")
            .attachTo(target, { locale: true })
            .scaleToObject(1.5, { considerTokenScale: false })
            .delay(gridDistance * canvas.grid.size)
            .duration(17500)
            .fadeIn(4000, { delay: 0 })
            .fadeOut(3500, { ease: "easeInSine" })
            .scaleIn(0, 3500, { ease: "easeInOutCubic" })
            .randomRotation()
            .tint(0x008ae0)
            .opacity(0.75)
            .belowTokens()
            .playIf(() => {
                if (nondetection) return false;
                return (magicItems.length);
            })

            .play()
    }
}

export let detectMagic = {
    'cast': cast,
    'item': item
}