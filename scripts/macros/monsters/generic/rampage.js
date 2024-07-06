import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

export async function rampage({ speaker, actor, token, character, item, args, scope, workflow }) {
    if (!workflow.hitTargets.size) return;
    let target = workflow.targets.first();
    if (target.actor.system.attributes.hp.value > 0) return;
    if (!constants.meleeAttacks.includes(workflow.item?.system?.actionType)) return;
    let feature = mba.getItem(workflow.actor, "Rampage")
    if (!feature) return;
    let moveBonus = Math.min(workflow.actor.system.attributes.movement.walk / 2);
    const effectData = {
        'name': "Rampage",
        'icon': "modules/mba-premades/icons/generic/rampage.webp",
        'origin': workflow.item.uuid,
        'description': `
            <p>After ${token.document.name} reduces a creature to 0 hit points with a melee attack on its turn, he moves up to half its speed (${moveBonus} ft.) and makes one Bite attack.</p>
        `,
        'duration': {
            'turns': 1
        },
        'changes': [
            {
                'key': "system.attributes.movement.walk",
                'mode': 2,
                'value': `+${moveBonus}`,
                'priority': 20
            }
        ]
    };
    new Sequence()

        .effect()
        .file("jb2a.impact.ground_crack.orange.03")
        .attachTo(token)
        .scaleToObject(2.5 * token.document.texture.scaleX)
        .belowTokens()

        .effect()
        .file("animated-spell-effects-cartoon.misc.demon")
        .delay(100)
        .attachTo(token)
        .scaleToObject(2 * token.document.texture.scaleX)
        .playbackRate(0.6)

        .thenDo(async () => {
            await feature.displayCard();
            await mba.createEffect(workflow.actor, effectData);
        })

        .play()
}