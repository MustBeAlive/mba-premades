async function autoGrapple({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let alreadyGrappled = await chrisPremades.helpers.findEffect(target.actor, "Grappled");
    if (alreadyGrappled) return;
    let size = await chrisPremades.helpers.getSize(target.actor);
    if (size > 2) return;
    let distance = await chrisPremades.helpers.getDistance(workflow.token, target, true);
    if (distance > 5) await chrisPremades.helpers.pushToken(workflow.token, target, -5);
    async function effectMacroDel() {
        await Sequencer.EffectManager.endEffects({ name: `${token.document.name} Water Weird` })
    }
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'changes': [
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': 'actionSave=true, rollType=skill, saveAbility=ath|acr, saveDC=13, saveMagic=false, name=Water Weird Constrict: Action Save, killAnim=true',
                'priority': 20
            },
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': 'Grappled',
                'priority': 20
            },
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': 'Restrained',
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': false
            },
            'effectmacro': {
                'onDelete': {
                    'script': chrisPremades.helpers.functionToString(effectMacroDel)
                }
            }
        }
    };
    await new Sequence()

        .effect()
        .file("jb2a.unarmed_strike.no_hit.01.blue")
        .atLocation(token)
        .stretchTo(target)
        .playbackRate(0.9)
        .filter("ColorMatrix", { saturate: -1, brightness: 1 })

        .effect()
        .file("jb2a.unarmed_strike.no_hit.01.blue")
        .mirrorY()
        .atLocation(token)
        .stretchTo(target)
        .playbackRate(0.9)
        .filter("ColorMatrix", { saturate: -1, brightness: 1 })

        .wait(150)

        .thenDo(function () {
            chrisPremades.helpers.createEffect(target.actor, effectData);
        })

        .effect()
        .file("jb2a.markers.chain.standard.complete.02.blue")
        .attachTo(target)
        .scaleToObject(2 * target.document.texture.scaleX)
        .fadeIn(500)
        .fadeOut(1000)
        .opacity(0.6)
        .persist()
        .name(`${target.document.name} Water Weird`)

        .play()
}

export let waterWeird = {
    'autoGrapple': autoGrapple
}