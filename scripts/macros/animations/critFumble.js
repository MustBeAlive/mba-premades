import {constants} from "../generic/constants.js";

export async function critFumble(workflow) {
    if (!workflow) return;
    let actionType = workflow.item.system.actionType;
    if (!actionType) return;
    if (!(constants.attacks).includes(actionType)) return;
    let type;
    if (workflow.isCritical === true) type = "crit";
    else if (workflow.isFumble === true) type = "fumble";
    if (!type) return;
    if (type === "crit") {
        new Sequence()

            .effect()
            .file("jb2a.ui.critical.yellow")
            .attachTo(workflow.token, { offset: { y: -0.5 }, gridUnits: true })
            .scaleToObject(1.7)
            .playbackRate(0.85)
            .aboveInterface()

            .play()
    }
    else if (type === "fumble") {
        new Sequence()

            .effect()
            .file("jb2a.ui.miss.red")
            .attachTo(workflow.token, { offset: { y: -0.5 }, gridUnits: true })
            .scaleToObject(1.7)
            .playbackRate(0.85)
            .aboveInterface()

            .play()
    }

}