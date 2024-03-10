export async function identify({speaker, actor, token, character, item, args, scope, workflow}) {
    let dialog = await new Dialog({
            title: "Identify",
            content: `
            <p>Какой предмет хочешь идентифицировать? (Перетащи его в окно ниже)</p>
            <form>
                <div class="form-group">
                <div class="form-fields">
                    <input type="text" placeholder="Тащить сюда..." id="identify" readonly>
                    <div style="width: 50px; height: 50px; display: inline-block;">
                    <img id="itemImage" src="" alt="Item Image" style="max-width: 100%; max-height: 100%; display: none;">
                    </div>
                    <span id="itemName" style="margin-left: 10px;"></span>
                </div>
                </div>
            </form>`,
            buttons: {
            identify: {
                label: "Опознать",
                callback: async (html) => {
                const itemUuid = html[0].querySelector("#identify").value;
                const ForienIdentification = game.modules.get('forien-unidentified-items');
                const ArchonIdentification = game.modules.get('archon');
                const findItem = await fromUuid(itemUuid);
                const findItemQuantity = findItem?.system?.quantity;
        
                // Check if the item exists
                if (!findItem) {
                    ui.notifications.error("Предмет не найден");
                    return;
                }
        
            // Identify the item using available modules based on item flags
                let identified = false;
        
                // Check if the ForienIdentification module is installed, active, and no "archon.uuid" flag present
                if (ForienIdentification && ForienIdentification.active && !findItem?.flags?.archon?.uuid) {
                    identified = await ForienIdentification.api.identify(findItem);
                    if (identified) {
                    handleIdentificationSuccess(itemUuid, findItemQuantity);
                    return;
                    }
                }
        
                // Check if the ArchonIdentification module is installed, active, and no "forien-unidentified-items" flag present
                if (ArchonIdentification && ArchonIdentification.active && !findItem?.flags?.["forien-unidentified-items"]?.origData && !identified) {
                    identified = await ArchonIdentification.Archon.reveal(findItem);
                    if (identified) {
                    handleIdentificationSuccess(itemUuid, findItemQuantity);
                    return;
                    }
                }
                // No active module found to identify the item
                ui.notifications.error("Нет активных модулей для идентификации предметов");
                }
            },
            cancel: {
                label: "Отмена",
                callback: () => false
            }
            },
            default: "Отмена",
        render: (html) => {
            const inputField = html.find("#identify")[0];
            const itemImage = html.find("#itemImage")[0];
            const itemNameSpan = html.find("#itemName")[0];
            const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
        
            // Event listener for drop
            const handleDrop = async (e) => {
            e.preventDefault();
            const data = JSON.parse(e.dataTransfer.getData("text/plain"));
            if (data.type !== "Item") return;
            inputField.value = data.uuid;
        
            const item = await fromUuid(data.uuid);
            if (item && item.img) {
                itemImage.src = item.img;
                itemImage.style.display = "block";
                itemImage.style.margin = "auto";
                itemImage.style.display = "block";
                itemImage.style.maxWidth = "100%";
                inputField.style.display = "none";
                itemNameSpan.textContent = item.name;
            }
            };
        
            if (isFirefox) {
            inputField.addEventListener('dragover', (e) => {
                e.preventDefault();
            });
        
            inputField.addEventListener('drop', handleDrop);
            } else {
            inputField.addEventListener("drop", handleDrop);
            }
        }
        }).render(true);
        
        async function handleIdentificationSuccess(itemUuid, findItemQuantity) {
            const findItemNew = await fromUuid(itemUuid);
            const findItemNewQuantity = findItemNew?.system?.quantity;
        
            // Update the item quantity if it changed during identification
            if (findItemQuantity !== findItemNewQuantity) {
            await findItemNew.update({ 'system.quantity': findItemQuantity });
            }
        
            const itemName = findItemNew.name;
            const itemQuantity = findItemNew.system.quantity || 1;
            const itemText = itemQuantity === 1 ? `${itemQuantity} <a class="open-item-sheet" data-item-id="${findItemNew.id}">${findItemNew.name}</a> item` : `${itemQuantity} <a class="open-item-sheet" data-item-id="${findItemNew.id}">${findItemNew.name}</a> items`;
        
            const content = `<p>Ты опознал ${itemText}!</p>`;
        
            const dialogSuccess = new Dialog({
            title: "Опознано",
            content: content,
            buttons: {
                okay: {
                label: "Ок!"
                }
            },
            default: "Ок!",
            render: (html) => {
                html.find('.open-item-sheet').click((ev) => {
                findItemNew.sheet.render(true);
                });
            }
            });
        
            dialogSuccess.render(true);
        }
}