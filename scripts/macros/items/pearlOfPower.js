import {mba} from "../../helperFunctions.js";

export async function pearlOfPower({ speaker, actor, token, character, item, args, scope, workflow }) {
    let pearl = mba.getItem(workflow.actor, "Pearl of Power");
    if (!pearl) {
        ui.notifications.warn("Unable to find item! (Pearl of Power)");
        return;
    }
    if (pearl.system.attunement != 2) {
        ui.notifications.warn("Pearl of Power requires attunement!");
        return;
    }
    if (pearl.system.uses.value < 1) {
        ui.notifications.warn("Pearl of Power is out of charges!");
        return;
    }
    const check = Array.from(Object.entries(workflow.actor.system.spells).filter(i => i[0] === "spell1" || i[0] === "spell2" || i[0] === "spell3").filter(i => i[1].value < i[1].max));
    if (!check.length) {
        ui.notifications.info("You don't have any expended spell slots!");
        return;
    }
    let expended = [];
    for (let i of Object.entries(workflow.actor.system.spells).filter(i => i[0] === "spell1" || i[0] === "spell2" || i[0] === "spell3")) {
        if (i[1].value < i[1].max) expended.push(i);
    }
    if (!expended.length) return;
    await new Promise(async () => {
        let buttons = {}
        let dialog;
        for (let i of expended) {
            buttons[i[0]] = {
                label: `<img src='modules/mba-premades/icons/class/wizard/arcane_recovery_${i[0]}.webp' width='50' height='50' style='border: 0px; float: left'><p style='padding: 1%; font-size: 15px'> ${i[0].replace("spell", "Level ").concat(`  (${i[1].value}/${i[1].max})`)}</p>`,
                callback: () => {
                    let path = `system.spells.${i[0]}.value`;
                    let newValue = foundry.utils.getProperty(workflow.actor, path) + 1;
                    if (isNaN(newValue)) return;
                    new Sequence()

                        .effect()
                        .file("jb2a.icosahedron.rune.below.blueyellow")
                        .attachTo(token)
                        .scaleToObject(2.5 * token.document.texture.scaleX)
                        .duration(4000)
                        .fadeIn(1000)
                        .fadeOut(500)
                        .belowTokens()
                        .filter("ColorMatrix", { hue: 150 })

                        .effect()
                        .file("jb2a.particle_burst.01.circle.bluepurple")
                        .attachTo(token)
                        .scaleToObject(2 * token.document.texture.scaleX)
                        .delay(2000)
                        .fadeIn(1000)
                        .filter("ColorMatrix", { hue: 330 })
                        .playbackRate(0.9)

                        .thenDo(function () {
                            workflow.actor.update({ [path]: newValue });
                            pearl.update({ "system.uses.value": 0 });
                        })

                        .play()
                }
            }
        }
        let height = (Object.keys(buttons).length * 58 + 48);
        dialog = new Dialog(
            {
                title: `Pearl of Power`,
                buttons
            },
            {
                height: height
            }
        );
        await dialog._render(true);
        dialog.element.find(".dialog-buttons").css({
            "flex-direction": 'column',
        })
    });
}