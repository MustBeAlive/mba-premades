export async function shillelagh({speaker, actor, token, character, item, args, scope, workflow}) {
    const lastArg = args[args.length - 1];
    let weapons = actor.items.filter(i => i.type === `weapon` && ["club","quarterstaff"].includes(i.system.baseItem));
    if (weapons.length < 1) {
        ui.notifications.warn('Can\'t find club or quarterstaff!');
        return;
    }
    let weapon_content = ``;
    for (let weapon of weapons) {
        weapon_content += `<option value=${weapon.id}>${weapon.name}</option>`;
    }
    if (args[0] === "on") {
        let content = `
    <div class="form-group">
    <label>Weapons : </label>
    <select name="weapons">
        ${weapon_content}
    </select>
    </div>`;

        new Dialog({
            title: "Choose Club or Quarterstaff",
            content,
            buttons:
            {
                Ok:
                {
                    label: `Ok`,
                    callback: (html) => {
                        let itemId = html.find('[name=weapons]')[0].value;
                        let weaponItem = actor.items.get(itemId);
                        let copy_item = duplicate(weaponItem.toObject(false));
                        DAE.setFlag(actor, `shillelagh`, {
                            "_id" : itemId,
                            "system.damage" : copy_item.system.damage,
                            "system.ability": copy_item.system.ability,
                            "system.properties.mgc": copy_item.system.properties.mgc,
                            "name": copy_item.name
                        }).then(() => {
                            let damage = copy_item.system.damage.parts[0][0];
                            var newdamage = damage.replace(/1d(4|6)/g,"1d8");
                            copy_item.system.damage.parts[0][0] = newdamage;
                            copy_item.system.ability = actor.system.attributes.spellcasting;
                            copy_item.system.properties.mgc = true;
                            copy_item.name = `${copy_item.name} (Empowered)`;
                            actor.updateEmbeddedDocuments("Item", [copy_item]);
                            ChatMessage.create({content: copy_item.name + " is empowered by Shillelagh"});
                        });
                    }
                },
                Cancel:
                {
                    label: `Cancel`
                }
            }
        }).render(true);
    }

    if (args[0] === "off") {
        const flag = DAE.getFlag(actor, `shillelagh`);
        await actor.updateEmbeddedDocuments("Item", [flag]);
        DAE.unsetFlag(actor, `shillelagh`);
        ChatMessage.create({content: flag.name + " returns to normal"});
    }
}