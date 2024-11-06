import {effectAuras} from "../../mechanics/effectAuras.js";
import {mba} from "../../../helperFunctions.js";

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} AuOfPu` });
        await mbaPremades.macros.auraOfPurity.end(token);
    };
    let effectData = {
        'name': "Aura of Purity: Aura",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Purifying energy radiates from you in an aura with a 30-foot radius.</p>
            <p>Until the spell ends, the aura moves with you, centered on you.</p>
            <p>Each nonhostile creature in the aura (including you) can't become diseased, has resistance to poison damage, and has advantage on saving throws against effects that cause any of the following conditions:</p>
            <p>@UUID[Compendium.mba-premades.MBA SRD.Item.3NxmNhGQQqUDnu73]{Blinded}, @UUID[Compendium.mba-premades.MBA SRD.Item.SVd8xu3mTZMqz8fL]{Charmed}, @UUID[Compendium.mba-premades.MBA SRD.Item.GmOl4GcI3fguwIJc]{Deafened}, @UUID[Compendium.mba-premades.MBA SRD.Item.oR1wUvem3zVVUv5Q]{Frightened}, @UUID[Compendium.mba-premades.MBA SRD.Item.jooSbuYlWEhaNpIi]{Paralyzed}, @UUID[Compendium.mba-premades.MBA SRD.Item.pAjPUbk2oPUTfva2]{Poisoned}, and @UUID[Compendium.mba-premades.MBA SRD.Item.O1gS8bqw9PJTuCAh]{Stunned}.
        `,
        'duration': {
            'seconds': 600
        },
        'changes': [
            {
                'key': 'flags.mba-premades.aura.auraOfPurity.name',
                'mode': 5,
                'value': `auraOfPurity`,
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.auraOfPurity.castLevel',
                'mode': 5,
                'value': `castLevel`,
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.auraOfPurity.range',
                'mode': 5,
                'value': 30,
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.auraOfPurity.disposition',
                'mode': 5,
                'value': `ally`,
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.auraOfPurity.effectName',
                'mode': 5,
                'value': `Aura of Purity`,
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.aura.auraOfPurity.macroName',
                'mode': 5,
                'value': `auraOfPurity`,
                'priority': 20
            },
        ],
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                },
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 4,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    let flagAuras = {
        'auraOfPurity': {
            'name': 'auraOfPurity',
            'castLevel': workflow.castData.castLevel,
            'range': 30,
            'disposition': 'ally',
            'effectName': 'Aura of Purity',
            'macroName': 'auraOfPurity'
        }
    };
    new Sequence()

        .effect()
        .file("jb2a.template_circle.aura.01.loop.large.yellow")
        .attachTo(workflow.token)
        .size(13, { gridUnits: true })
        .fadeIn(3000)
        .fadeOut(1500)
        .scaleIn(0, 5000, { ease: "easeOutCubic" })
        .scaleOut(0, 1500, { ease: "linear" })
        .opacity(0.75)
        .playbackRate(0.8)
        .filter("ColorMatrix", { saturate: -1, brightness: 0.8 })
        .randomRotation()
        .belowTokens()
        .persist()
        .name(`${workflow.token.document.name} AuOfPu`)

        .thenDo(async () => {
            await mba.createEffect(workflow.actor, effectData);
            effectAuras.add(flagAuras, workflow.token.document.uuid, true);
        })

        .play()
}

async function aura(token, selectedAura) {
    let originToken = await fromUuid(selectedAura.tokenUuid);
    if (!originToken) return;
    let originActor = originToken.actor;
    let auraEffect = mba.findEffect(originActor, 'Aura of Purity: Aura');
    if (!auraEffect) return;
    let originItem = await fromUuid(auraEffect.origin);
    if (!originItem) return;
    let effectData = {
        'name': 'Aura of Purity',
        'icon': originItem.img,
        'origin': originItem.uuid,
        'description': `
            <p>You can't become diseased, have resistance to poison damage, and have advantage on saving throws against effects that cause any of the following conditions:</p>
            <p>@UUID[Compendium.mba-premades.MBA SRD.Item.3NxmNhGQQqUDnu73]{Blinded}, @UUID[Compendium.mba-premades.MBA SRD.Item.SVd8xu3mTZMqz8fL]{Charmed}, @UUID[Compendium.mba-premades.MBA SRD.Item.GmOl4GcI3fguwIJc]{Deafened}, @UUID[Compendium.mba-premades.MBA SRD.Item.oR1wUvem3zVVUv5Q]{Frightened}, @UUID[Compendium.mba-premades.MBA SRD.Item.jooSbuYlWEhaNpIi]{Paralyzed}, @UUID[Compendium.mba-premades.MBA SRD.Item.pAjPUbk2oPUTfva2]{Poisoned}, and @UUID[Compendium.mba-premades.MBA SRD.Item.O1gS8bqw9PJTuCAh]{Stunned}.
            <p>Source: <b>${originToken.name}</b></p>
        `,
        'changes': [
            {
                'key': 'system.traits.ci.value',
                'mode': 0,
                'value': 'diseased',
                'priority': 20
            },
            {
                'key': 'system.traits.dr.value',
                'mode': 0,
                'value': 'poison',
                'priority': 20
            },
            {
                'key': 'flags.mba-premades.save.auraOfPurity',
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
    if (effect) await mba.removeEffect(effect);
    await mba.createEffect(token.actor, effectData);
}

async function end(token) {
    effectAuras.remove('auraOfPurity', token.document.uuid);
}

// kinda sucks, but closer to what it should look like
function save(saveId, options) {
    return {'label': '<u>Aura of Purity:</u><br>Are you saving against being Blinded, Charmed, Deafened, Frightened, Paralyzed, Poisoned or Stunned?<br>(ask GM)', 'type': 'advantage'};
}

export let auraOfPurity = {
    'item': item,
    'aura': aura,
    'end': end,
    'save': save
}