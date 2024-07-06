import {mba} from "../../../helperFunctions.js";

async function blindingBreathCast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let template = canvas.scene.collections.templates.get(workflow.templateId);
    new Sequence()

        .effect()
        .file("jb2a.breath_weapons02.burst.cone.ice.02")
        .attachTo(token)
        .stretchTo(template)
        .tint("#5c2900")

        .play()
}

async function blindingBreathItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    const effectData = {
        'name': "Dust Mephit: Blinding Breath",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.3NxmNhGQQqUDnu73]{Blinded} by Dust Mephit's Blinding Breath.</p>
            <p>You can repeat the saving throw at the end of each of your turns, ending the effect on a success.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': 'Blinded',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `turn=end, saveAbility=dex, saveDC=10, saveMagic=false, name=Blinding Breath: Turn End (DC10), killAnim=true`,
                'priority': 20
            }
        ]
    };
    let targets = Array.from(workflow.failedSaves);
    for (let target of targets) {
        if (!mba.findEffect(target.actor, "Dust Mephit: Blinding Breath") && !mba.checkTrait(target.actor, "ci", "blinded")) await mba.createEffect(target.actor, effectData);
    }
}

async function deathBurstCast(token, origin) {
    new Sequence()

        .effect()
        .file("animated-spell-effects-cartoon.explosions.08")
        .attachTo(token)
        .size(4, { gridUnits: true })
        .playbackRate(0.9)

        .thenDo(async () => {
            await origin.use();
        })

        .play()
}

async function deathBurstItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: "Dust Mephit Death Burst" })
    }
    const effectData = {
        'name': "Dust Mephit: Death Burst",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.3NxmNhGQQqUDnu73]{Blinded} by Dust Mephit's Death Burst.</p>
            <p>You can repeat the saving throw at the end of each of your turns, ending the effect on a success.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': 'Blinded',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `turn=end, saveAbility=dex, saveDC=10, saveMagic=false, name=Blinding Breath: Turn End (DC10), killAnim=true`,
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
    for (let target of Array.from(workflow.failedSaves)) {
        if (!mba.findEffect(target.actor, "Dust Mephit: Death Burst") && !mba.checkTrait(target.actor, "ci", "blinded")) await mba.createEffect(target.actor, effectData);
    }
}

export let dustMephit = {
    'blindingBreathCast': blindingBreathCast,
    'blindingBreathItem': blindingBreathItem,
    'deathBurstCast': deathBurstCast,
    'deathBurstItem': deathBurstItem
}