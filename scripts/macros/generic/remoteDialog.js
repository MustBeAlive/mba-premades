import {mba} from "../../helperFunctions.js";

export async function remoteDialog(title, options, content) {
    return await mba.dialog(title, options, content);
}
export async function remoteDocumentDialog(title, uuids, displayTooltips) {
    let documents = await Promise.all(uuids.map(async i => await fromUuid(i)));
    return await mba.selectDocument(title, documents, true, displayTooltips);
}
export async function remoteDocumentsDialog(title, uuids, displayTooltips) {
    let documents = await Promise.all(uuids.map(async i => await fromUuid(i)));
    return await mba.selectDocuments(title, documents, true, displayTooltips);
}
export async function remoteAimCrosshair(tokenUuid, maxRange, icon, interval, size) {
    let token = await fromUuid(tokenUuid);
    return await mba.aimCrosshair(token, maxRange, icon, interval, size);
}
export async function remoteMenu(title, buttons, inputs, useSpecialRender, info, header, extraOptions) {
    return await mba.menu(title, buttons, inputs, useSpecialRender, info, header, extraOptions);
}