import {effectAuras} from "../../mechanics/effectAuras.js";
import {mba} from "../../../helperFunctions.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    let oldEffect = await mba.findEffect(workflow.actor, "Countercharm: Aura");
    if (oldEffect) await mba.removeEffect(oldEffect); 
    async function effectMacroDel() {
        await mbaPremades.macros.countercharm.end(token);
        await Sequencer.EffectManager.endEffects({ name: `${token.document.name} Countercharm` });
    };
    const effectData = {
        'name': "Countercharm: Aura",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You start a performance that lasts until the end of your next turn.</p>
            <p>During this perfomance, you and any friendly creatures within 30 feet of you have advantage on saving throws against being frightened or charmed.</p>
            <p>A creature must be able to hear you to gain this benefit.</p>
            <p>The performance ends early if you are incapacitated or silenced or if you voluntarily end it (no action required).</p>
        `,
        'changes': [
            {
                'key': 'flags.mba-premades.aura.countercharm.name',
                'mode': 5,
                'value': `countercharm`,
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.countercharm.range',
                'mode': 5,
                'value': 30,
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.countercharm.disposition',
                'mode': 5,
                'value': `ally`,
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.countercharm.effectName',
                'mode': 5,
                'value': `Countercharm`,
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.countercharm.macroName',
                'mode': 5,
                'value': `countercharm`,
                'priority': 20
            },
        ],
        'flags': {
            'dae': {
                'showIcon': true,
                'specialDuration': ['turnEnd']
            },
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            }
        }
    };
    let flagAuras = {
        'countercharm': {
            'name': 'countercharm',
            'castLevel': workflow.castData.castLevel,
            'range': 30,
            'disposition': 'ally',
            'effectName': 'Countercharm',
            'macroName': 'countercharm'
        }
    };
    effectAuras.add(flagAuras, workflow.token.document.uuid, true);

    let targets = mbaPremades.helpers.findNearby(workflow.token, 30, "ally", false, false);

    new Sequence()

        .effect()
        .file("jb2a.markers.music.pink")
        .attachTo(workflow.token)
        .scaleToObject(1.2)
        .fadeIn(1000)
        .fadeOut(1000)
        .zIndex(1)
        .waitUntilFinished(-4000)

        .effect()
        .file("jb2a.markers.music_note.purple.03")
        .attachTo(workflow.token)
        .scaleToObject(1.85)
        .delay(500)
        .fadeIn(1000)
        .fadeOut(1000)
        .playbackRate(0.85)
        .zIndex(2)
        .persist()
        .name(`${workflow.token.document.name} Countercharm`)

        .thenDo(async () => {
            await mba.createEffect(workflow.actor, effectData);
            effectAuras.add(flagAuras, workflow.token.document.uuid, true);
        })

        .play()

    if (!targets.length) return;
    for (let target of targets) {
        new Sequence()

            .wait(1200)

            .effect()
            .file("jb2a.bardic_inspiration.pink")
            .attachTo(target, { followRotation: false })
            .scaleToObject(1.6)

            .play()
    }
}

async function aura(token, selectedAura) {
    if (mba.findEffect(token.actor, "Deafened")) {
        let effect = await mba.findEffect(token.actor, "Countercharm");
        if (effect) await mba.removeEffect(effect);   
        return;
    }
    let originToken = await fromUuid(selectedAura.tokenUuid);
    if (!originToken) return;
    let originActor = originToken.actor;
    let auraEffect = mba.findEffect(originActor, 'Countercharm: Aura');
    if (!auraEffect) return;
    let originItem = await fromUuid(auraEffect.origin);
    if (!originItem) return;
    let effectData = {
        'name': 'Countercharm',
        'icon': originItem.img,
        'origin': originItem.uuid,
        'description': `
            <p>You have advantage on saving throws against being frightened or charmed.</p>
            <p>You must be able to hear you to gain this benefit.</p>
            <p>Source: <b>${originToken.name}</b></p>
        `,
        'changes': [
            {
                'key': 'flags.adv-reminder.message.ability.save.wis',
                'mode': 2,
                'value': `Countercharm: Advantage against being Frightened`,
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.CR.frightened',
                'mode': 5,
                'value': 1,
                'priority': 20
            },
            {
                'key': 'flags.adv-reminder.message.ability.save.cha',
                'mode': 2,
                'value': `Countercharm: Advantage against being Charmed`,
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.CR.charmed',
                'mode': 5,
                'value': 1,
                'priority': 20
            },
        ],
        'flags': {
            'dae': {
                'showIcon': true
            },
            'mba-premades': {
                'aura': true,
                'effect': {
                    'noAnimation': true
                }
            }
        }
    };
    let effect = mba.findEffect(token.actor, effectData.name);
    if (effect?.origin === effectData.origin) return;
    if (effect) mba.removeEffect(effect);
    await mba.createEffect(token.actor, effectData);
}

async function end(token) {
    effectAuras.remove('countercharm', token.document.uuid);
}

export let countercharm = {
    'item': item,
    'aura': aura,
    'end': end
}