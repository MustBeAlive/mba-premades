import {mba} from "../../helperFunctions.js";

export async function compendiumRender(doc, html, context) {
    let ids = [
        'mba-premades.MBA Class Feature Items',
        'mba-premades.MBA Item Features',
        'mba-premades.MBA Monster Features',
        'mba-premades.MBA Race Feature Items',
        'mba-premades.MBA Spell Features',
        'mba-premades.MBA Summon Features',
    ];
    if (!ids.includes(doc.metadata.id)) return;
    await mba.dialog("MBA Premades: Warning", [['OK', false]], "Этот компендиум содержит внутренние (синтетические) предметы, необходимые для правильной работы множества макросов.<br><br><b>Лучше здесь ничего не трогать.</b>");
}