import {mba} from "../../helperFunctions.js";

export async function grapple({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.targets.size) return;
    let skipCheck = false;
    let target = workflow.targets.first();
    if (mba.getSize(target.actor) > (mba.getSize(workflow.actor) + 1)) {
        ui.notifications.info('Target is too big to attempt grapple!');
        return;
    }
    let effect = mba.findEffect(target.actor, 'Incapacitated');
    if (effect) skipCheck = true;
    if (!skipCheck) {
        let options = [
            [`Acrobatics (${target.actor.system.skills.acr.total})`, 'acr'],
            [`Athletics (${target.actor.system.skills.ath.total})`, 'ath'],
            ['Uncontested', false]
        ];
        let selection = await mba.remoteDialog(workflow.item.name, options, mba.firstOwner(target).id, 'How would you like to contest the grapple?');
        if (selection) {
            let sourceRoll = await workflow.actor.rollSkill('ath');
            let targetRoll = await mba.rollRequest(target, 'skill', selection);
            if (targetRoll.total >= sourceRoll.total) return;
        }
    }
    //if (game.modules.get('Rideable')?.active) game.Rideable.Mount([target.document], workflow.token.document, { 'Grappled': true, 'MountingEffectsOverride': ['Grappled'] });
    
    await new Sequence()
    
        .effect()
        .file("jb2a.unarmed_strike.no_hit.01.yellow")
        .atLocation(token)
        .stretchTo(target)
        .playbackRate(0.9)
        .filter("ColorMatrix", { saturate: -1, brightness: 1 })
    
        .effect()
        .file("jb2a.unarmed_strike.no_hit.01.yellow")
        .mirrorY()
        .atLocation(token)
        .stretchTo(target)
        .playbackRate(0.9)
        .filter("ColorMatrix", { saturate: -1, brightness: 1 })
    
        .wait(150)
    
        .thenDo(function () {
            mba.addCondition(target.actor, 'Grappled', false, workflow.item.uuid);
        })
    
        .effect()
        .file("jb2a.markers.chain.standard.complete.02.grey")
        .attachTo(target)
        .scaleToObject(2 * target.document.texture.scaleX)
        .fadeIn(500)
        .fadeOut(1000)
        .opacity(0.8)
    
        .play()
}