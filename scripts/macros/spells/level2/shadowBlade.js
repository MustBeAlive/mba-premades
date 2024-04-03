// weapon does not account if target is in dim light; animation is cringe >.<
export async function shadowBlade({ speaker, actor, token, character, item, args, scope, workflow }) {
    let spellLevel = workflow.castData.castLevel;
    let weaponData = await chrisPremades.helpers.getItemFromCompendium('mba-premades.MBA Spell Features', 'Shadow Blade: Sword', false);
    if (!weaponData) return;
    let diceNum = 2;
    switch (spellLevel) {
        case 3:
        case 4:
            diceNum = 3;
            break;
        case 5:
        case 6:
            diceNum = 4;
            break;
        case 7:
        case 8:
        case 9:
            diceNum = 5;
            break;
    }
    weaponData.system.damage.parts = [[diceNum + 'd8[psychic ] + @mod', 'psychic']];
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `${token.document.name} Shadow Blade` })
        await warpgate.revert(token.document, 'Shadow Blade: Sword');
    }
    let effectData = {
        'name': weaponData.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'duration': {
            'seconds': 60
        },
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': chrisPremades.helpers.functionToString(effectMacroDel)
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 2,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    let updates = {
        'embedded': {
            'Item': {
                [weaponData.name]: weaponData
            },
            'ActiveEffect': {
                [weaponData.name]: effectData
            }
        }
    };
    let options = {
        'permanent': false,
        'name': weaponData.name,
        'description': weaponData.name
    };
    
    await new Sequence()
        .effect()
        .delay(500)
        .file(`jb2a.particles.outward.red.02.03`)
        .attachTo(token, { offset: { y: -0.25 }, gridUnits: true, followRotation: false })
        .scaleToObject(1.2)
        .playbackRate(2)
        .duration(2000)
        .fadeOut(800)
        .fadeIn(1000)
        .animateProperty("sprite", "height", { from: 0, to: 2, duration: 3000, gridUnits: true, ease: "easeOutBack" })
        .filter("Blur", { blurX: 0, blurY: 15 })
        .opacity(2)
        .zIndex(0.2)
    
        .effect()
        .delay(1050)
        .file("jb2a.divine_smite.caster.reversed.dark_purple")
        .atLocation(token)
        .scaleToObject(2.2)
        .startTime(900)
        .fadeIn(200)
    
        .effect()
        .file("jb2a.divine_smite.caster.dark_purple")
        .atLocation(token)
        .scaleToObject(1.85)
        .belowTokens()
        .waitUntilFinished(-1200)
    
        .effect()
        .file("jb2a.energy_strands.overlay.dark_purple02.01")
        .atLocation(token)
        .attachTo(token)
        .scaleToObject(2)
        .opacity(0.8)
        .persist()
        .name(`${token.document.name} Shadow Blade`)
    
        .play()
        
    await warpgate.mutate(workflow.token.document, updates, {}, options);
}