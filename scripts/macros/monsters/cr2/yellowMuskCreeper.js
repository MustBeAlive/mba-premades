import {mba} from "../../../helperFunctions.js";

async function touch({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let target = workflow.targets.first();
    if (mba.raceOrType(target.actor) != "humanoid") return;
    if (target.actor.system.attributes.hp.value > 0) return;
    const effectData = {
        'name': "Yellow Musk: Bulb",
        'icon': "icons/commodities/flowers/flower-grey-orange.webp",
        'origin': workflow.item.uuid,
        'duration': {
            'seconds': 86400
        }
    };
    await mba.createEffect(target.actor, effectData);
}

async function yellowMuskCast({ speaker, actor, token, character, item, args, scope, workflow }) {
    let newTargets = [];
    for (let target of Array.from(workflow.targets).filter(i => mba.raceOrType(i.actor) === "humanoid")) newTargets.push(target.document.id);
    if (!newTargets.length) ui.notifications.info("No humanoid targets available");
    mba.updateTargets(newTargets);

    new Sequence()

        .effect()
        .file("jaamod.smoke.poison_cloud")
        .attachTo(workflow.token)
        .scaleIn(0, 1500, { ease: "easeOutCubic" })
        .scaleOut(0, 1500, { ease: "linear" })
        .fadeIn(200)
        .fadeOut(1000)
        .zIndex(2)
        .filter("ColorMatrix", { hue: 295 })
        .playbackRate(0.7)
        .size(13, { gridUnits: true })

        .effect()
        .delay(1500)
        .file("jb2a.fog_cloud.02.green02")
        .attachTo(workflow.token)
        .fadeIn(1500)
        .fadeOut(2500)
        .duration(10000)
        .opacity(0.7)
        .zIndex(1)
        .randomRotation()
        .scaleIn(0, 1500, { ease: "easeOutCubic" })
        .size(13, { gridUnits: true })
        .name(`Yellow Musk`)

        .play()
}

async function yellowMuskItem({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.failedSaves.size) return;
    async function effectMacroTurnStart() {
        await mbaPremades.helpers.dialog("Yellow Musk", [["Ok!", "ok"]], `
            <p>You are charmed by a strong musk of Yellow Musk Creeper</p>
			<p>On your turn you do nothing except <b>move as close as you can to the Creeper</b></p>
            <p>You can repeat the saving throw at the end of each of your turns, ending the effect on a success</p>
        `);
    }
    const effectData = {
        'name': "Yellow Musk: Charm",
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>You are @UUID[Compendium.mba-premades.MBA SRD.Item.SVd8xu3mTZMqz8fL]{Charmed} by a strong musk of Yellow Musk Creeper.</p>
            <p>On your turn you do nothing except move as close as you can to the Creeper.</p>
            <p>You can repeat the saving throw at the end of each of your turns, ending the effect on a success.</p>
        `,
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': 'Charmed',
                'priority': 20
            },
            {
                'key': 'flags.midi-qol.OverTime',
                'mode': 0,
                'value': `turn=end, saveAbility=wis, saveDC=11, saveMagic=false, name=Yellow Musk: Turn End (DC11), killAnim=true`,
                'priority': 20
            }
        ],
        'flags': {
            'dae': {
                'showIcon': true
            },
            'effectmacro': {
                'onTurnStart': {
                    'script': mba.functionToString(effectMacroTurnStart)
                }
            }
        }
    };
    let targets = Array.from(workflow.failedSaves);
    for (let target of targets) {
        if (mba.checkTrait(target.actor, "ci", "charmed")) continue;
        if (mba.findEffect(target.actor, "Yellow Musk: Charm")) continue;
        await mba.createEffect(target.actor, effectData);
    }
}

export let yellowMuskCreeper = {
    'touch': touch,
    'yellowMuskCast': yellowMuskCast,
    'yellowMuskItem': yellowMuskItem
}