import {mba} from "../../../helperFunctions.js";

export async function shillelagh({ speaker, actor, token, character, item, args, scope, workflow }) {
    let weapons = workflow.actor.items.filter(i => i.system.equipped && i.type === "weapon" && ["club", "quarterstaff"].includes(i.system.baseItem));
    if (!weapons.length) {
        ui.notifications.warn("Actor has no valid weapons (club or quarterstaff)");
        return;
    }
    let selection;
    if (weapons.length === 1) selection = weapons[0];
    if (!selection) [selection] = await mba.selectDocument("Which weapon would you like to empower?", weapons);
    if (!selection) {
        ui.notifications.warn("Failed to select weapon");
        return
    }
    let damageType = selection.system.damage.parts[0][1];
    let damageParts = [[`1d8 + @mod`, damageType]];
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Shillelagh` })
        await warpgate.revert(token.document, "Shillelagh");
    }
    const effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>The wood of <b>${selection.name}</b> you are holding is imbued with nature's power.</p>
            <p>For the duration, you can use your spellcasting ability instead of Strength for the attack and damage rolls of melee attacks using that weapon, and the weapon's damage die becomes a d8.</p>
            <p>The weapon also becomes magical, if it isn't already.</p>
            <p>The spell ends if you cast it again or if you let go of the weapon.</p>
        `,
        'duration': {
            'seconds': 60
        },
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 0,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    let updates = {
        'embedded': {
            'Item': {
                [selection.name]: {
                    'name': "Empowered " + selection.name,
                    'system': {
                        'ability': workflow.actor.system.attributes.spellcasting,
                        'damage': {
                            'parts': damageParts
                        },
                        'properties': {
                            'mgc': true
                        }
                    }
                }
            },
            'ActiveEffect': {
                [effectData.name]: effectData
            }
        }
    };
    let options = {
        'permanent': false,
        'name': 'Shillelagh',
        'description': 'Shillelagh'
    };

    new Sequence()

        .wait(500)

        .effect()
        .file("jb2a.butterflies.complete.01.greenyellow")
        .attachTo(workflow.token)
        .scaleToObject(1.5)
        .fadeIn(500)

        .effect()
        .file("jb2a.cast_generic.earth.01.browngreen.1")
        .delay(1200)
        .attachTo(workflow.token)
        .scaleToObject(1.8)
        .waitUntilFinished(-1600)

        .effect()
        .file("jb2a.plant_growth.03.round.4x4.complete.greenyellow")
        .atLocation(workflow.token)
        .scaleToObject(2)
        .belowTokens()
        .fadeIn(500)
        .fadeOut(1500)

        .effect()
        .file("jb2a.butterflies.single.green")
        .delay(2000)
        .attachTo(workflow.token)
        .scaleToObject(2 * workflow.token.document.texture.scaleX)
        .fadeIn(2000)
        .fadeOut(1000)
        .persist()
        .name(`${workflow.token.document.name} Shillelagh`)

        .effect()
        .file("jb2a.butterflies.single.yellow")
        .delay(4000)
        .attachTo(workflow.token)
        .scaleToObject(2 * workflow.token.document.texture.scaleX)
        .fadeIn(1000)
        .fadeOut(1000)
        .persist()
        .name(`${workflow.token.document.name} Shillelagh`)

        .wait(300)

        .thenDo(async () => {
            await warpgate.mutate(workflow.token.document, updates, {}, options);
        })

        .play()
}