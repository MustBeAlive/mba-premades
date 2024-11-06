import {mba} from "../../../helperFunctions.js";

async function evilEyeCast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    new Sequence()

        .effect()
        .file("jb2a.dodecahedron.skull.below.dark_greenpurple")
        .attachTo(target)
        .scaleToObject(2.2 * target.document.texture.scaleX)
        .fadeIn(800)
        .fadeOut(500)
        .belowTokens()

        .effect()
        .file("jb2a.template_circle.aura.01.loop.large.orangepurple")
        .attachTo(target)
        .scaleToObject(2.2 * target.document.texture.scaleX)
        .delay(800)
        .fadeIn(500)
        .fadeOut(500)
        .playbackRate(0.8)

        .effect()
        .file("jb2a.energy_strands.complete.dark_purple.01")
        .attachTo(target)
        .scaleToObject(2 * target.document.texture.scaleX)
        .delay(800)
        .fadeIn(500)
        .fadeOut(500)
        .opacity(0.8)
        .repeats(4, 800)

        .effect()
        .file("animated-spell-effects-cartoon.misc.fiery eyes.05")
        .attachTo(target)
        .scaleToObject(1.5 * target.document.texture.scaleX)
        .delay(800)
        .fadeIn(500)
        .fadeOut(500)
        .repeats(3, 1300)

        .play()
}

async function evilEyeCurse({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    let target = workflow.targets.first();
    async function effectMacroLongRest() {
        let saveRoll = await mbaPremades.helpers.rollRequest(token, "save", "cha");
        if (saveRoll.total >= 14) {
            await mbaPremades.helpers.removeEffect(effect);
            return;
        }
    };
    let effectData = {
        'name': "Fomorian: Curse of the Evil Eye",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are cursed with magical deformities of Fomorian's Evil Eye Curse.</p>
            <p>While deformed, your speed is halved and you have disadvantage on ability checks, saving throws, and attacks based on Strength or Dexterity.</p>
            <p>You can repeat the saving throw whenever you finish a long rest, ending the effect on a success.</p>
        `,
        'changes': [
            {
                'key': 'system.attributes.movement.walk',
                'mode': 1,
                'value': '0.5',
                'priority': 50
            },
            {
                'key': `flags.midi-qol.disadvantage.attack.str`,
                'mode': 2,
                'value': 1,
                'priority': 20
            },
            {
                'key': `flags.midi-qol.disadvantage.ability.check.str`,
                'mode': 2,
                'value': 1,
                'priority': 20
            },
            {
                'key': `flags.midi-qol.disadvantage.ability.save.str`,
                'mode': 2,
                'value': 1,
                'priority': 20
            },
            {
                'key': `flags.midi-qol.disadvantage.attack.dex`,
                'mode': 2,
                'value': 1,
                'priority': 20
            },
            {
                'key': `flags.midi-qol.disadvantage.ability.check.dex`,
                'mode': 2,
                'value': 1,
                'priority': 20
            },
            {
                'key': `flags.midi-qol.disadvantage.ability.save.dex`,
                'mode': 2,
                'value': 1,
                'priority': 20
            },
        ],
        'flags': {
            'dae': {
                'showIcon': true,
            },
            'effectmacro': {
                'dnd5e.longRest': {
                    'script': mba.functionToString(effectMacroLongRest)
                }
            },
            'mba-premades': {
                'greaterRestoration': true,
                'isCurse': true
            },
        }
    };
    await mba.createEffect(target.actor, effectData);
}

export let fomorian = {
    'evilEyeCast': evilEyeCast,
    'evilEyeCurse': evilEyeCurse
}