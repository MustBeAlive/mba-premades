export async function produceFlame({speaker, actor, token, character, item, args, scope, workflow}) {
    const lastArg = args[args.length-1]
    if(args[0]==="on"){
        let targetToken = canvas.tokens.get(lastArg.tokenId)
        let level = targetToken.actor.system.details.level ?? targetToken.actor.system.details.cr;
        let dice = 1 + (Math.floor((level + 1) / 6));
        const itemData = {
            name: "Produce Flame: Hurl",
            type: "spell",
            img: "assets/library/icons/sorted/spells/cantrip/produce_flame_hurl.webp",
            data: {
                actionType: "rsak",
                activation: {type: "action"},
                damage: {parts: [[`${dice}d8[fire]`, "fire"]]},
                level:0,
                school: "con",
                target: {value: 1, type: "creature"},
                range: {value: 30, units: "ft"}
            }
        }
        const [item] = await targetToken.actor.createEmbeddedDocuments("Item", [itemData]);
        DAE.setFlag(targetToken.actor,"produceFlameItemId",item.id)
        targetToken.document.update({'light.bright':10})
        targetToken.document.update({'light.dim':20})
        let hookId = Hooks.on("midi-qol.RollComplete",(workflow)=>{
            if(workflow.itemId === item.id)
                targetToken.actor.deleteEmbeddedDocuments("ActiveEffect",[lastArg.effectId])
        })
        DAE.setFlag(targetToken.actor,"produceFlameHookId",hookId)
    }
    if(args[0]==="off"){
    let targetToken = canvas.tokens.get(lastArg.tokenId)
    Hooks.off("midi-qol.RollComplete",DAE.getFlag(targetToken.actor,"produceFlameHookId"));
    targetToken.actor.deleteEmbeddedDocuments("Item", [DAE.getFlag(targetToken.actor,"produceFlameItemId")]);
    targetToken.document.update({'light.bright':0})
    targetToken.document.update({'light.dim':0})
    }
}