import {constants} from "../generic/constants.js";

export async function critFumble(workflow) {
    if (!workflow) return;
    let actionType = workflow.item.system.actionType;
    if (!actionType) return;
    if (!(constants.attacks).includes(actionType)) return;
    let animation;
    if (workflow.isCritical === true) animation = "jb2a.ui.critical.yellow";
    else if (workflow.isFumble === true) animation = "jb2a.ui.miss.red";
    if (!animation) return;
    new Sequence()

        .effect()
        .file(animation)
        .attachTo(workflow.token, { followRotation: false, offset: { y: -0.5 }, gridUnits: true })
        .size(2, { gridUnits: true })
        .playbackRate(0.85)
        .aboveInterface()

        .play()
}