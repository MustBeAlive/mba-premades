export async function removeCurse({ speaker, actor, token, character, item, args, scope, workflow }) {
    let target = workflow.targets.first();
    let effects = target.actor.effects.filter(i => i.flags['mba-premades']?.isCurse === true);
    if (!effects.length) {
        ui.notifications.info('Targeted creature is affected by a curse which can not be removed with Greater Restoration!');
        return;
    }
    if (effects.length < 2) {
        let curse = await chrisPremades.helpers.findEffect(target.actor, effects[0].name);
        if (!curse) {
            ui.notifications.warn(`Unable to find Curse: ${effects[0].name}`);
            return;
        }
        await chrisPremades.helpers.removeEffect(curse);
    } else {
        let selection = [];
        for (let i = 0; i < effects.length; i++) {
            let effect = effects[i];
            let name = effect.name;
            let icon = effect.icon;
            selection.push([name, icon]);
        };
        function generateEnergyBox(type) {
            return `
            <label class="radio-label">
            <input type="radio" name="type" value="${selection[type]}" />
            <img src="${selection[type].slice(1)}" style="border: 0px; width: 50px; height: 50px"/>
            ${selection[type].slice(0, -1)}
            </label>
        `;
        }
        const effectSelection = Object.keys(selection).map((type) => generateEnergyBox(type)).join("\n");
        const content = `
        <style>
            .dispelMagic 
                .form-group {
                    display: flex;
                    flex-wrap: wrap;
                    width: 100%;
                    align-items: flex-start;
                }
            .dispelMagic 
                .radio-label {
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
                justify-items: center;
                flex: 1 0 20%;
                line-height: normal;
                }
            .dispelMagic 
                .radio-label input {
                display: none;
            }
            .dispelMagic img {
                border: 0px;
                width: 50px;
                height: 50px;
                flex: 0 0 50px;
                cursor: pointer;
            }
            /* CHECKED STYLES */
            .dispelMagic [type="radio"]:checked + img {
                outline: 2px solid #005c8a;
            }
        </style>
        <form class="dispelMagic">
            <div class="form-group" id="types">
                ${effectSelection}
            </div>
        </form>
    `;
        const effectToRemove = await new Promise((resolve) => {
            new Dialog({
                title: "Choose curse to remove:",
                content,
                buttons: {
                    ok: {
                        label: "Ok",
                        callback: async (html) => {
                            const element = html.find("input[type='radio'][name='type']:checked").val();
                            resolve(element);
                        },
                    },
                    cancel: {
                        label: "Cancel",
                        callback: async (html) => {
                            return;
                        }
                    }
                }
            }).render(true);
        });
        let effectToRemoveName = effectToRemove.split(",")[0];
        let removeEffect = await chrisPremades.helpers.findEffect(target.actor, effectToRemoveName);
        if (!removeEffect) {
            ui.notifications.warn("Something went wrong, unable to find the effect!");
            return;
        }
        await chrisPremades.helpers.removeEffect(removeEffect);
    }

    new Sequence()

        .effect()
        .file("jb2a.extras.tmfx.inpulse.circle.01.normal")
        .atLocation(target)
        .scaleToObject(1)

        .effect()
        .file("jb2a.misty_step.02.blue")
        .atLocation(target)
        .scaleToObject(1)
        .scaleOut(1, 3500, { ease: "easeOutCubic" })

        .wait(1400)

        .effect()
        .file("jb2a.healing_generic.burst.bluewhite")
        .atLocation(target)
        .scaleToObject(1.5)
        .fadeOut(1000, { ease: "easeInExpo" })
        .belowTokens()
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .duration(1200)
        .attachTo(target, { bindAlpha: false })

        .effect()
        .from(target)
        .atLocation(target)
        .filter("ColorMatrix", { saturate: -1, brightness: 10 })
        .filter("Blur", { blurX: 5, blurY: 10 })
        .fadeIn(100)
        .opacity(1)
        .fadeOut(5000)
        .duration(6000)
        .attachTo(target)

        .effect()
        .file("jb2a.fireflies.few.02.blue")
        .atLocation(target)
        .scaleToObject(2)
        .duration(10000)
        .fadeIn(1000)
        .fadeOut(500)
        .attachTo(target)

        .effect()
        .file("jb2a.extras.tmfx.outflow.circle.02")
        .atLocation(target)
        .fadeIn(200)
        .opacity(0.25)
        .duration(10000)
        .scaleToObject(2)
        .fadeOut(500)
        .fadeIn(1000)
        .belowTokens()
        .attachTo(target)

        .effect()
        .file("jb2a.particles.outward.blue.01.03")
        .atLocation(target)
        .filter("ColorMatrix", { saturate: -1, brightness: 2 })
        .fadeIn(200, { ease: "easeInExpo" })
        .duration(10000)
        .opacity(0.25)
        .scaleToObject(2)
        .fadeOut(500)
        .fadeIn(1000)
        .belowTokens()
        .attachTo(target)

        .play()
}