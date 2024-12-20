import {mba} from "../../helperFunctions.js";

export async function potionOfDiminution({ speaker, character, item, args, scope, workflow }) {
    let durationRoll = await new Roll("1d4").roll({ 'async': true });
    await MidiQOL.displayDSNForRoll(durationRoll);
    ChatMessage.create({
        content: `Potion of Diminution duration: <b>${durationRoll.total} hours</b>`,
        speaker: { actor: workflow.actor }
    });
    let duration = durationRoll.total * 3600;
    let target = workflow.targets.first();
    async function effectMacroDel() {
        await warpgate.revert(token.document, 'Potion of Diminution', { 'updateOpts': { 'token': { 'animate': true } } });
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Your size is halved in all dimensions, and your weight is reduced to one-eighth of normal. This reduction decreases your size by one category: from Medium to Small, for example.</p>
            <p>Until the spell ends, you also has disadvantage on Strength checks and Strength saving throws.</p>
            <p>Your weapons also shrink to match your new size. While these weapons are reduced, your attacks with them deal 1d4 less damage (this effect can't reduce the damage below 1).</p>
        `,
        'duration': {
            'seconds': duration
        },
        'changes': [
            {
                'key': 'system.bonuses.mwak.damage',
                'mode': 2,
                'value': '-1d4',
                'priority': 20
            },
            {
                'key': 'system.bonuses.rwak.damage',
                'mode': 2,
                'value': '-1d4',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.disadvantage.ability.check.str',
                'mode': 0,
                'value': '1',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.disadvantage.ability.save.str',
                'mode': 0,
                'value': '1',
                'priority': 20
            }
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };
    let token = {};
    let actor = {};
    let targetSize = target.actor.system.traits.size;
    switch (targetSize) {
        case 'tiny':
            setProperty(token, 'texture.scaleX', '0.25');
            setProperty(token, 'texture.scaleY', '0.25');
        case 'sm':
            setProperty(token, 'texture.scaleX', '0.5');
            setProperty(token, 'texture.scaleY', '0.5');
            setProperty(actor, 'system.traits.size', 'tiny');
            break;
        case 'med':
            setProperty(token, 'texture.scaleX', '0.8');
            setProperty(token, 'texture.scaleY', '0.8');
            setProperty(actor, 'system.traits.size', 'sm');
            break;
        case 'lg':
            setProperty(token, 'height', target.document.height - 1);
            setProperty(token, 'width', target.document.width - 1);
            setProperty(actor, 'system.traits.size', 'med');
            break;
        case 'huge':
            setProperty(token, 'height', target.document.height - 1);
            setProperty(token, 'width', target.document.width - 1);
            setProperty(actor, 'system.traits.size', 'lg');
            break;
        case 'grg':
            setProperty(token, 'height', target.document.height - 1);
            setProperty(token, 'width', target.document.width - 1);
            setProperty(actor, 'system.traits.size', 'huge');
            break;
    }
    let updates = {
        'actor': actor,
        'embedded': {
            'ActiveEffect': {
                [effectData.name]: effectData
            }
        },
        'token': token,
    };
    let scale = 1;
    let size = mba.getSize(target.actor, true);
    switch (size) {
        case 'medium':
            scale = 0.8;
            break;
        case 'small':
            scale = 0.5;
            break;
        case 'tiny':
            scale = 0.25;
            break;
    }
    await new Sequence()

        .effect()
        .file("animated-spell-effects-cartoon.water.05")
        .atLocation(target, { offset: { x: 0.2, y: -0.5 }, gridUnits: true })
        .scaleToObject(1.4)
        .opacity(0.9)
        .rotate(90)
        .filter("ColorMatrix", { saturate: -1 })
        .zIndex(1)

        .wait(200)

        .effect()
        .file(`jb2a.sacred_flame.source.white`)
        .attachTo(target, { offset: { y: 0.15 }, gridUnits: true, followRotation: false })
        .startTime(3400)
        .scaleToObject(2.2)
        .fadeOut(500)
        .animateProperty("sprite", "position.y", { from: 0, to: -0.4, duration: 1000, gridUnits: true })
        .zIndex(1)

        .effect()
        .from(target)
        .scaleToObject(target.document.texture.scaleX)
        .opacity(0.3)
        .duration(1250)
        .fadeIn(100)
        .fadeOut(600)
        .filter("Glow", { color: "0x9e9e9e" })
        .tint("0x9e9e9e")

        .effect()
        .file(`jb2a.particles.outward.white.01.03`)
        .attachTo(target, { offset: { y: 0.1 }, gridUnits: true, followRotation: false })
        .scale(0.6)
        .duration(1000)
        .fadeOut(800)
        .scaleIn(0, 1000, { ease: "easeOutCubic" })
        .animateProperty("sprite", "width", { from: 0, to: 0.25, duration: 500, gridUnits: true, ease: "easeOutBack" })
        .animateProperty("sprite", "height", { from: 0, to: 1.0, duration: 1000, gridUnits: true, ease: "easeOutBack" })
        .animateProperty("sprite", "position.y", { from: 0, to: -0.6, duration: 1000, gridUnits: true })
        .zIndex(0.3)

        .effect()
        .file('jb2a.static_electricity.03.orange')
        .atLocation(target)
        .scaleToObject(1)
        .duration(3000)
        .fadeIn(250)
        .fadeOut(250)
        .filter("ColorMatrix", { saturate: -1 })
        .zIndex(2)

        .effect()
        .from(target)
        .atLocation(target)
        .scaleToObject(2)
        .duration(500)
        .fadeIn(250)
        .fadeOut(250)
        .scaleIn(0.25, 500)
        .repeats(3, 500, 500)
        .opacity(0.2)
        .zIndex(1)

        .animation()
        .on(target)
        .opacity(0)

        .effect()
        .from(target)
        .atLocation(target)
        .loopProperty('sprite', 'rotation', { 'from': -10, 'to': 10, 'duration': 75, 'pingPong': true, 'delay': 200 })
        .duration(2000)
        .waitUntilFinished(-200)
        .zIndex(0)

        .thenDo(async () => {
            let options = {
                'permanent': false,
                'name': 'Potion of Diminution',
                'description': 'Potion of Diminution',
                'updateOpts': { 'token': { 'animate': false } }
            };
            await warpgate.mutate(target.document, updates, {}, options);
        })

        .wait(200)

        .effect()
        .from(target)
        .atLocation(target)
        .scaleToObject(scale)
        .duration(3000)
        .scaleIn(0.25, 700, { 'ease': 'easeOutBounce' })

        .effect()
        .file('jb2a.extras.tmfx.outpulse.circle.01.fast')
        .attachTo(target)
        .opacity(0.75)
        .scaleToObject(2)
        .zIndex(1)

        .effect()
        .file('jb2a.energy_strands.in.yellow.01.2')
        .attachTo(target)
        .scaleToObject(2)
        .belowTokens()
        .filter("ColorMatrix", { saturate: -1 })
        .zIndex(0)

        .effect()
        .file('jb2a.particles.outward.orange.01.04')
        .attachTo(target)
        .scaleToObject(1.5)
        .duration(3000)
        .fadeIn(500)
        .fadeOut(1000)
        .scaleIn(0.25, 500, { 'ease': 'easeOutQuint' })
        .filter("ColorMatrix", { saturate: -1 })
        .randomRotation()
        .zIndex(4)

        .effect()
        .file('jb2a.static_electricity.03.orange')
        .attachTo(target)
        .scaleToObject(1)
        .duration(5000)
        .fadeIn(250)
        .fadeOut(250)
        .filter("ColorMatrix", { saturate: -1 })
        .waitUntilFinished(-3000)

        .animation()
        .on(target)
        .opacity(1)

        .thenDo(async () => {
            let vialItem = await mba.getItem(workflow.actor, workflow.item.name);
            if (vialItem.system.quantity > 1) {
                await vialItem.update({ "system.quantity": vialItem.system.quantity - 1 });
            } else {
                await workflow.actor.deleteEmbeddedDocuments("Item", [vialItem.id]);
            }
            let emptyVialItem = mba.getItem(workflow.actor, "Empty Vial");
            if (!emptyVialItem) {
                const itemData = await mba.getItemFromCompendium('mba-premades.MBA Items', 'Empty Vial', false);
                if (!itemData) {
                    ui.notifications.warn("Unable to find item in compendium! (Empty Vial)");
                    return
                }
                await workflow.actor.createEmbeddedDocuments("Item", [itemData]);
            } else {
                await emptyVialItem.update({ "system.quantity": emptyVialItem.system.quantity + 1 });
            }
        })

        .play()
}