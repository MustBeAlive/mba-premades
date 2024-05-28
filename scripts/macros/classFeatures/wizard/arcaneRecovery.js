export async function arcaneRecovery({ speaker, actor, token, character, item, args, scope, workflow }) {
    //check if actor is wizard and get his levels
    let wizardLevel = workflow.actor.classes.wizard?.system?.levels;
    if (!wizardLevel) {
        ui.notifications.warn("Actor has no Wizard levels!");
        return;
    }

    //calculate available points
    let ammount = Math.ceil(wizardLevel / 2);

    //check if actor has expended slots
    const check = Array.from(Object.entries(workflow.actor.system.spells).filter(i => i[0] != "spell7" && i[0] != "spell8" && i[0] != "spell9" && i[0] != "pact" && i[1].value < i[1].max));
    if (!check.length) {
        ui.notifications.info("You don't have any expended spell slots!");
        return;
    }

    //repeat dialog promt until no points
    while (ammount > 0) {
        await warpgate.wait(50);

        //filter pact, 7-9 levels and levels w/o expended slots
        let expended = [];
        for (let i of Object.entries(workflow.actor.system.spells).filter(i => i[0] != "spell7" && i[0] != "spell8" && i[0] != "spell9" && i[0] != "pact" && ammount >= i[0].slice(-1))) {
            if (i[1].value < i[1].max) expended.push(i);
        }
        if (!expended.length) return;

        ammount = await new Promise(async (resolve) => {
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
                                ammount -= +i[0].slice(-1);
                                resolve(ammount)
                            })
    
                            .play()
                    }
                }
            }
            let height = (Object.keys(buttons).length * 58 + 48);
            dialog = new Dialog(
                {
                    title: `Arcane Recovery (${ammount})`,
                    buttons,
                    close: () => resolve(ammount = 0)
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
}