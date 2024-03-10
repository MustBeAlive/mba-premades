// Original macro by MISC (Bradeck/Coolhand/SagaTympana)
export async function magicStone({speaker, actor, token, character, item, args, scope, workflow}) {
    const mutName = 'Magic Stones';
    const mutDescription = `Accept magic stones ?`;
    if (args[0].macroPass === 'postActiveEffects') {

        const num = await warpgate.buttonDialog({
            buttons: [{ label: '1', value: 1 }, {label: '2', value: 2}, {label: '3', value: 3}], title: 'Choose ammount of stones:'})
        if(num === false) return;
        
        if(workflow.targets.size !== 1) return ui.notifications.warn("Too many targets selected!");

        let tokentarget = workflow.targets.first();
        let target = tokentarget.document;
        let stoneData = item.toObject();
        
        const modEval = await new Roll('@mod', item.getRollData()).evaluate({async:true});
        
        const newItemMacro = `
            let uses = workflow.item.system.uses.value;
            
            if (uses === 0) {
                await warpgate.revert(token.document,"${mutName}");
            }
            `;
        
        
        const updates = {

            embedded: {
                //create Throw Stone part of this spell
                Item: {
                    "Throw Magic Stone": { 
                        "type": "spell",
                        "img": "assets/library/icons/sorted/spells/cantrip/magic_stone_throw.webp",
                        
                        "system": {
                            "attackBonus": `- @mod + ${modEval.total}`,
                            "level": 0,
                            "damage":{
                                "parts":[
                                [`1d6 + ${modEval.total}`
                                , 'bludgeoning']
                                ]
                            },
                            "preparation": {
                                "mode":"always",
                                "prepared":"true"    
                            
                            },
                            "uses":{
                                "value": num,
                                "max": num,
                                "per": "charges"
                            },
                            "activation":{
                                "type": "action",
                                "cost": 1,
                            },
                            "target":{
                                "value": 1,
                                "type":"creature"
                            },
                            "description": {
                                "value": `Stone imbued with magic. You can use one of the pebbles to make ranged weapon attack (60ft.) You use caster's spellcasting ability modifier for that attack roll. On a hit, target takes bludgeoning damage equal to 1d6 + caster's spellcasting ability modifier. Whether the attack hits or misses, the spell then ends on the stone. `
                            },
                            
                            "actionType": "rsak"
                        },  
                
                        "flags": {
                            "favtab": {
                                "isFavorite": true
                            },
                        },
                        //Here we assign the macro used by Throw Stones
                        'flags.midi-qol.onUseMacroName': 'ItemMacro',
                        'flags.itemacro.macro.data.name': "Attack",
                        'flags.itemacro.macro.data.type': "script",
                        'flags.itemacro.macro.data.scope': "global",
                        'flags.itemacro.macro.data.command': newItemMacro
                    },
                },
            },
        }

        await warpgate.mutate(target, updates, {}, { name: mutName, description: mutDescription });
        await actor.setFlag('world', 'magicStonesTarget', target.id);

        new Sequence()
        
        .effect()
        .name("Casting")
        .atLocation(token)
        .file(`jb2a.magic_signs.circle.02.enchantment.loop.dark_purple`)
        .scaleToObject(1.25)
        .rotateIn(180, 600, {ease: "easeOutCubic"})
        .scaleIn(0, 600, {ease: "easeOutCubic"})
        .loopProperty("sprite", "rotation", { from: 0, to: -360, duration: 10000})
        .belowTokens()
        .fadeOut(2000)
        .zIndex(0)
        
        .effect()
        .atLocation(tokentarget)
        .file(`jb2a.magic_signs.circle.02.enchantment.loop.dark_purple`)
        .scaleToObject(1.25)
        .rotateIn(180, 600, {ease: "easeOutCubic"})
        .scaleIn(0, 600, {ease: "easeOutCubic"})
        .loopProperty("sprite", "rotation", { from: 0, to: -360, duration: 10000})
        .belowTokens(true)
        .filter("ColorMatrix", {saturate:-1, brightness:2})
        .filter("Blur", { blurX: 5, blurY: 10 })
        .zIndex(1)
        .duration(1200)
        .fadeIn(200, {ease: "easeOutCirc", delay: 500})
        .fadeOut(300, {ease: "linear"})
        
        
        .repeats(5, 200, 200)
        .fadeOut(500)
        
        .play()
    }


    if(args[0]==='off') {
        const getTarget = canvas.scene.tokens.get(actor.getFlag('world', 'magicStonesTarget'));
        await warpgate.revert(getTarget, mutName);
        await actor.unsetFlag('world', 'magicStonesTarget');
    }
}