import {mba} from "../../../helperFunctions.js";

async function aversionOfFire({ speaker, actor, token, character, item, args, scope, workflow }) {
    let aversionEffect = await mba.findEffect(actor, "Aversion of Fire");
    if (!aversionEffect) return;
    let aversionDebuff = await mba.findEffect(actor, "Flesh Golem: Aversion of Fire");
    if (aversionDebuff) return;
    let typeCheck = workflow.damageDetail?.some(i => i.type === "fire");
    if (!typeCheck) return;
    const effectData = {
        'name': "Flesh Golem: Aversion of Fire",
        'icon': "modules/mba-premades/icons/generic/generic_fire.webp",
        'description': `
            <p>${actor.prototypeToken.name} recieved fire damage and has disadvantage on attack rolls and ability checks until the end of its next turn.</p>
        `,
        'changes': [
            {
                'key': 'flags.midi-qol.disadvantage.attack.all',
                'mode': 2,
                'value': 1,
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.disadvantage.ability.check.all',
                'mode': 2,
                'value': 1,
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['turnEnd']
            }
        }
    };
    await mba.createEffect(actor, effectData);
}

async function berserk(token) {
    if (mba.findEffect(token.actor, "Berserk")) return;
    let feature = await mba.getItem(token.actor, "Berserk");
    let currentHP = token.actor.system.attributes.hp.value;
    if (currentHP > 40) return;
    let berserkRoll = await new Roll("1d6").roll({ 'async': true });
    await MidiQOL.displayDSNForRoll(berserkRoll);
    berserkRoll.toMessage({
        rollMode: 'roll',
        speaker: { alias: name },
        flavor: 'Berserk Check'
    });
    if (berserkRoll.total != 6) return;
    async function effectMacroDel() {
        new Sequence()

        .animation()
        .on(token)
        .opacity(1)

        .play();

    await Sequencer.EffectManager.endEffects({ name: `${token.document.name} Berserk` })
    };
    let effectData = {
        'name': "Berserk",
        'icon': "modules/mba-premades/icons/class/barbarian/frenzy.webp",
        'description': `
            <p>On each of its turns while berserk, the golem attacks the nearest creature it can see.</p>
            <p>If no creature is near enough to move to and attack, the golem attacks an object, with preference for an object smaller than itself.</p>
            <p>Once the golem goes berserk, it continues to do so until it is destroyed or regains all its hit points.</p>
            <p>The golem's creator, if within 60 feet of the berserk golem, can try to calm it by speaking firmly and persuasively.</p>
            <p>The golem must be able to hear its creator, who must take an action to make a DC 15 Charisma (Persuasion) check.</p>
            <p>If the check succeeds, the golem ceases being berserk. If it takes damage while still at 40 hit points or fewer, the golem might go berserk again.</p>
        `,
        'flags': {
            'dae': {
                'showIcon': true
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };
    new Sequence()

        .effect()
        .file("jb2a.extras.tmfx.outpulse.circle.02.normal")
        .atLocation(token)
        .size(4, { gridUnits: true })
        .opacity(0.25)

        .effect()
        .file("jb2a.impact.ground_crack.orange.02")
        .atLocation(token)
        .belowTokens()
        .filter("ColorMatrix", { hue: -15, saturate: 1 })
        .size(3.5, { gridUnits: true })
        .zIndex(1)

        .effect()
        .file("jb2a.impact.ground_crack.still_frame.02")
        .atLocation(token)
        .belowTokens()
        .fadeIn(1000)
        .filter("ColorMatrix", { hue: -15, saturate: 1 })
        .size(3.5, { gridUnits: true })
        .zIndex(0)

        .effect()
        .file("jb2a.token_border.circle.static.orange.012")
        .atLocation(token)
        .attachTo(token)
        .opacity(0.6)
        .scaleToObject(2)
        .filter("ColorMatrix", { saturate: 1 })
        .tint("#FF0000")
        .fadeOut(500)
        .mask()
        .persist()
        .name(`${token.document.name} Berserk`)

        .thenDo(async () => {
            await feature.displayCard();
            await mba.createEffect(token.actor, effectData);
        })

        .play()
}

export let fleshGolem = {
    'aversionOfFire': aversionOfFire,
    'berserk': berserk,
}