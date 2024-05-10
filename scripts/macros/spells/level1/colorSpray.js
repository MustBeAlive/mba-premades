import {mba} from "../../../helperFunctions.js";

export async function colorSpray({ speaker, actor, token, character, item, args, scope, workflow }) {
    const blindHp = await workflow.damageTotal;
    console.log(`Color Spray Spell => Available HP Pool [${blindHp}] points`);
    const targets = Array.from(workflow.targets)
        .filter((i) => i.actor.system.attributes.hp.value != 0 && !mba.checkTrait(i.actor, 'ci', 'blinded') && !mba.checkTrait(i.actor, 'ci', 'unconscious'))
        .sort((a, b) => (canvas.tokens.get(a.id).actor.system.attributes.hp.value < canvas.tokens.get(b.id).actor.system.attributes.hp.value ? -1 : 1));
    let remainingBlindHp = blindHp;
    let blindTarget = [];
    let template = await canvas.scene.collections.templates.get(workflow.templateId);

    new Sequence()

        .effect()
        .file("jb2a.particles.outward.greenyellow.02.03")
        .attachTo(token)
        .delay(150)
        .size(2.5, { gridUnits: true })
        .fadeIn(1400, { ease: "easeOutBack" })
        .filter("ColorMatrix", { saturate: -1, brightness: 2 })
        .fadeOut(400)
        .duration(7000)
        .opacity(0.8)
        .zIndex(3)

        .effect()
        .file("jb2a.magic_signs.circle.02.illusion.loop.yellow")
        .atLocation(token)
        .attachTo(token)
        .size({ width: 0.4, height: 1 }, { gridUnits: true })
        .rotateTowards(template)
        .mirrorY()
        .scaleIn(0, 500, { ease: "easeOutCubic" })
        .scaleOut(0, 500, { ease: "easeOutCubic" })
        .loopProperty("alphaFilter", "alpha", { from: 0, to: -0.5, duration: 1000, pingPong: true })
        .filter("ColorMatrix", { saturate: -1, brightness: 1.2 })
        .fadeOut(300)
        .duration(7000)

        .zIndex(0)

        .play()

    for (let i = 0; i < 15; i++) {

        new Sequence()

            .effect()
            .file("jb2a.energy_strands.range.standard.blue.0{{num}}")
            .atLocation(token, { offset: { x: 0.2 }, gridUnits: true, local: true })
            .delay(500 * (i - 1))
            .stretchTo(template, { randomOffset: 1, gridUnits: true, cacheLocation: true })
            .extraEndDuration(5 * i)
            .filter("ColorMatrix", { hue: 24 * i - 24 })
            .randomizeMirrorY()
            .fadeIn(500, { ease: "easeOutBack" })
            .fadeOut(400)
            .opacity(1)
            .setMustache({
                "num": () => {
                    const nums = [`1`, `2`, `3`, `4`];
                    return nums[Math.floor(Math.random() * nums.length)];
                }
            })
            .zIndex(1)

            .effect()
            .file("jb2a.energy_strands.range.standard.blue.0{{num}}")
            .atLocation(token, { offset: { x: 0.2, y: 0.2 }, gridUnits: true, local: true })
            .delay(500 * (i - 1))
            .stretchTo(template, { offset: { y: -1 }, randomOffset: 1, gridUnits: true, cacheLocation: true, local: true })
            .extraEndDuration(5 * i)
            .filter("ColorMatrix", { hue: 24 * i + 96 })
            .randomizeMirrorY()
            .fadeIn(500, { ease: "easeOutBack" })
            .fadeOut(400)
            .opacity(1)
            .duration(900)
            .setMustache({
                "num": () => {
                    const nums = [`1`, `2`, `3`, `4`];
                    return nums[Math.floor(Math.random() * nums.length)];
                }
            })
            .zIndex(1)

            .effect()
            .file("jb2a.energy_strands.range.standard.blue.0{{num}}")
            .atLocation(token, { offset: { x: 0.2, y: -0.2 }, gridUnits: true, local: true })
            .delay(500 * (i - 1))
            .stretchTo(template, { offset: { y: 1 }, randomOffset: 1, gridUnits: true, cacheLocation: true, local: true })
            .extraEndDuration(5 * i)
            .filter("ColorMatrix", { hue: 24 * i - 144 })
            .randomizeMirrorY()
            .fadeIn(500, { ease: "easeOutBack" })
            .fadeOut(400)
            .opacity(1)
            .duration(900)
            .setMustache({
                "num": () => {
                    const nums = [`1`, `2`, `3`, `4`];
                    return nums[Math.floor(Math.random() * nums.length)];
                }
            })
            .zIndex(1)

            .play();
    }

    await warpgate.wait(500);

    for (let target of targets) {
        const targetHpValue = target.actor.system.attributes.hp.value;
        const targetImg = target.document.texture.src;
        if (remainingBlindHp >= targetHpValue) {
            remainingBlindHp -= targetHpValue;
            console.log(`Color Spray Results => Target: ${target.document.name} |  HP: ${targetHpValue} | HP Pool: ${remainingBlindHp} | Status: Blinded`);
            blindTarget.push(`<div class="midi-qol-flex-container"><div>Blinded: </div><div class="midi-qol-target-npc midi-qol-target-name" id="${target.id}"> ${target.document.name}</div><div><img src="${targetImg}" width="30" height="30" style="border:0px"></div></div>`);
            const effectData = {
                'name': 'Color Spray: Blind',
                'icon': workflow.item.img,
                'origin': workflow.item.uuid,
                'description': `
                    <p>You are blinded until the end of ${workflow.token.document.name} next turn.</p>
                `,
                'changes': [
                    {
                        'key': 'macro.CE',
                        'mode': 0,
                        'value': "Blinded",
                        'priority': 20
                    }
                ],
                'flags': {
                    'dae': {
                        'showIcon': true,
                        'specialDuration': ['turnEndSource']
                    },
                    'midi-qol': {
                        'castData': {
                            baseLevel: 1,
                            castLevel: workflow.castData.castLevel,
                            itemUuid: workflow.item.uuid
                        }
                    }
                },
            };
            await mba.createEffect(target.actor, effectData);
            await warpgate.wait(200);

        } else {
            console.log(`Color Spray Results => Target: ${target.name} | HP: ${targetHpValue} | HP Pool: ${remainingBlindHp - targetHpValue} | Status: Not enough HP remaining`);
            blindTarget.push(`<div class="midi-qol-flex-container"><div>Resisted: </div><div class="midi-qol-target-npc midi-qol-target-name" id="${target.id}"> ${target.document.name}</div><div><img src="${targetImg}" width="30" height="30" style="border:0px"></div></div>`);
        }
    }
    await warpgate.wait(500);
    const blindResults = `<div><div class="midi-qol-nobox">${blindTarget.join('')}</div></div>`;
    const chatMessage = game.messages.get(workflow.itemCardId);
    let content = duplicate(chatMessage.content);
    const searchString = /<div class="midi-qol-hits-display">[\s\S]*<div class="end-midi-qol-hits-display">/g;
    const replaceString = `<div class="midi-qol-hits-display"><div class="end-midi-qol-hits-display">${blindResults}`;
    content = await content.replace(searchString, replaceString);
    await chatMessage.update({ content: content });
}