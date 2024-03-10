// Original macro by thatlonelybugbear
export async function light({speaker, actor, token, character, item, args, scope, workflow}) {
    const dim = 40;
    const bright = 20;
    const color = undefined; // game.user.color;
    const alpha = "0.25";
    const type = "torch";
    const speed = 3;
    const intensity = 1;
    const angle = 360;

    const lightOptions = {dim,bright,color,alpha,type,speed,intensity,angle};

    if (!game.modules.get("warpgate")?.active) return ui.notifications.error("Please enable the Warp Gate module");
    const mutName = "Cantrip: Light";

    if (args[0].macroPass === "preActiveEffects") {
        const {failedSaves} = args[0];
        if (!actor || !token || !failedSaves) return ui.notifications.error("Light spell error - Do you have Item Macro Sheet hooks option enabled? If yes disable; Notify GM");
        let {dim,bright,color,alpha,type,speed,intensity,angle} = lightOptions ?? {};
        const previousTargetUuid = DAE.getFlag(actor, "lightSRD");
        const previousTokenDoc = previousTargetUuid ? fromUuidSync(previousTargetUuid) : undefined;
        const effect = previousTokenDoc ? getEffect(previousTokenDoc.actor,"Light") : undefined;
        if (previousTargetUuid && effect) await MidiQOL.socket().executeAsGM("removeEffects", {actorUuid: previousTargetUuid, effects:[effect.id]});
        if (previousTokenDoc && _hasMutation(previousTokenDoc,mutName)) await warpgate.revert(previousTokenDoc,mutName);
        await warpgate.wait(350);
        if (!failedSaves.length) return ui.notifications.info("Light spell resisted");
        let content = "";
        let optionUpdates = "";
        if (!type) {
            const typeOptions = [['none',{label:'None'}]]
                                .concat(Object.entries(CONFIG.Canvas.lightAnimations))
                                .reduce((acc, [a,b]) => acc += `<option id="type" value="${a}">${game.i18n.localize(b.label)}</option>`, ``);
            content += `<div class="form-group"><label>Light Animation Type</label><div class="form-fields"><select id="type">${typeOptions}</select></div></div> `;
        };
        if (!color) content += `<div class="form-group"><label for="color" style="line-height: 26px;">Color:</label><div class="form-fields"><input type="color" value="${game.user.color}" id="color"></div></div>`;
        if (!alpha) content += `<div class="form-group"><label for="alpha" style="line-height: 26px;">Color Intensity (Alpha):</label><div class="form-fields"><input type="range" value="0.25" id="alpha" min="0" max="1" step="0.05"><span class="range-value" id="alphaOutput">0.25</span></div><p class="hint">Configure the intensity of the light source.</p></div>`;
        if (!dim) content += `<div class="form-group"><label for="dim" style="line-height: 26px;">Dim (ft):</label><div class="form-fields"><input type="range" value="40" id="dim" min="0" max="120" step="5"><span class="range-value" id="dimOutput">20</span></div></div>`;
        if (!bright) content += `<div class="form-group"><label for="bright" style="line-height: 26px;">Bright (ft):</label><div class="form-fields"><input type="range" value="20" id="bright" min="0" max="120" step="5"><span class="range-value" id="brightOutput">20</span></div></div>`;
        if (!angle) content += `<div class="form-group"><label for="angle" style="line-height: 26px;">Emission Angle (Degrees):</label><div class="form-fields"><input type="range" value="360" id="angle" min="0" max="360" step="1"><span class="range-value" id="angleOutput">360</span></div><p class="hint">Configure the angle of the light source.</p></div>`;
        if (!intensity) content += `<div class="form-group"><label for="intensity" style="line-height: 26px;">Animation Intensity:</label><div class="form-fields"><input type="range" value="1" id="intensity" min="0" max="10" step="1"><span class="range-value" id="intensityOutput">1</span></div><p class="hint">Configure the intesity of the light source's animation.</p></div>`;
        if (!speed) content += `<div class="form-group"><label for="speed" style="line-height: 26px;">Animation Speed:</label><div class="form-fields"><input type="range" value="3" id="speed" min="0" max="10" step="1"><span class="range-value" id="speedOutput">3</span></div><p class="hint">Configure the speed of the light source's animation.</p></div>`;
        if (content) {
            optionUpdates = await Dialog.wait({
                title: "Настройка заклинания",
                content: `<form>${content}</form>`,
                buttons: getLights(),
                close: () => {return false},
                render: () => {
                    const valueAlpha = document.querySelector("#alphaOutput");
                    const inputAlpha = document.querySelector("#alpha");
                    if (valueAlpha && inputAlpha) {
                        valueAlpha.textContent = inputAlpha.value;
                        inputAlpha.addEventListener("input", (event) => {valueAlpha.textContent = event.target.value});
                    }
                    const valueDim = document.querySelector("#dimOutput");
                    const inputDim = document.querySelector("#dim");
                    if (valueDim && inputDim) {
                        valueDim.textContent = inputDim.value;
                        inputDim.addEventListener("input", (event) => {valueDim.textContent = event.target.value});
                    }
                    const valueBright = document.querySelector("#brightOutput");
                    const inputBright = document.querySelector("#bright");
                    if (valueBright && inputBright) {
                        valueBright.textContent = inputBright.value;
                        inputBright.addEventListener("input", (event) => {valueBright.textContent = event.target.value});
                    }
                    const valueAngle = document.querySelector("#angleOutput");
                    const inputAngle = document.querySelector("#angle");
                    if (valueAngle && inputAngle) {
                        valueAngle.textContent = inputAngle.value;
                        inputAngle.addEventListener("input", (event) => {valueAngle.textContent = event.target.value});
                    }
                    const valueSpeed = document.querySelector("#speedOutput");
                    const inputSpeed = document.querySelector("#speed");
                    if (valueSpeed && inputSpeed) {
                        valueSpeed.textContent = inputSpeed.value;
                        inputSpeed.addEventListener("input", (event) => {valueSpeed.textContent = event.target.value});
                    }
                    const valueIntensity = document.querySelector("#intensityOutput");
                    const inputIntensity = document.querySelector("#intensity");
                    if (valueIntensity && inputIntensity) {
                        valueIntensity.textContent = inputIntensity.value;
                        inputIntensity.addEventListener("input", (event) => {valueIntensity.textContent = event.target.value});
                    }
                }
            })
        }
        let updates;
        if (!optionUpdates) {
            Hooks.once("midi-qol.preApplyDynamicEffects", workflow =>{return false})
            return ui.notifications.info("Light spell casting cancelled");
        }
        if (!!optionUpdates) updates = { token: { light: optionUpdates } };
        else updates = { token: { light: { color, alpha, dim, bright, angle, animation:{ speed, intensity, type } } } };
        const target = failedSaves[0]; //Token5e#Document
        if (_hasMutation(target,mutName)) {
            await MidiQOL.socket().executeAsGM("removeEffects", {actorUuid: target.uuid, effects:[getEffect(target.actor,"Light")?.id]});
            await warpgate.revert(target,mutName);
        }
        await warpgate.mutate(target,updates,{},{name:mutName});
        await DAE.setFlag(actor, "lightSRD", target.uuid);
    }
    if (args[0] === "off") {
        const sourceActor = fromUuidSync(lastArgValue.origin)?.actor;
        if (_hasMutation(token,mutName)) await warpgate.revert(token.document,mutName);
        await DAE.unsetFlag(sourceActor, "lightSRD");
    }


    function _hasMutation(token,mutName) {
        const tokenDoc = token instanceof TokenDocument ? token : token.document;
        const stack = warpgate.mutationStack(tokenDoc);
        return !!stack.getName(mutName);
    }

    function getLights() {
        let lightButtons = {};
        lightButtons = Object.assign(lightButtons, {
            apply: {
                label: `Apply`,
                icon: "<i class='fa-solid fa-lightbulb'></i>",
                callback: (html) => {
                    const newColor = document.querySelector("#color")?.value ?? color;
                    const newAlpha = document.querySelector("#alpha")?.value ?? alpha;
                    const newDim = document.querySelector("#dim")?.value ?? dim;
                    const newBright = document.querySelector("#bright")?.value ?? bright;
                    const newAngle = document.querySelector("#angle")?.value ?? angle;
                    const newType = document.querySelector("#type")?.value ?? type;
                    const newIntensity = document.querySelector("#intensity")?.value ?? intensity;
                    const newSpeed = document.querySelector("#speed")?.value ?? speed;
                    return {color:newColor, alpha:newAlpha, dim:newDim, bright:newBright, angle:newAngle, animation:{type:newType, instensity:newIntensity, speed:newSpeed}};
                }
            }
        })
        return lightButtons;
    }

    function getEffect(actor, effectName) {
        let effect;
        if(isNewerVersion(game.version, 11)) effect = actor.effects.getName(effectName);
        else effect = actor.effects.find(e=>e.label === effectName);
        return effect;
    }
}