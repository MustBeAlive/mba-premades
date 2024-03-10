// Original macro by MISC (Bradeck/thatlonelybugbear)
export async function absorbElements({speaker, actor, token, character, item, args, scope, workflow}) {
    const damageTypes = [['🧪 Acid', 'acid'], ['❄️ Cold', 'cold'], ['🔥 Fire', 'fire'], ['⚡ Lightning', 'lightning'], ['☁️ Thunder', 'thunder']]; //All possible damage types

    /* Choose wich element to absorb */
    const buttons = damageTypes.map(([label, value]) => ({label, value}));
    const title = 'Absorb Elements';
    const content ='<strong>Choose element:</strong>';
    const absorbedElement = await warpgate.buttonDialog ({buttons,title,content}, 'column');
    if (absorbedElement.buttons === false) return;

    /* Find & change the damage resistance AE */ 
    const drEffect = actor.effects.getName('Absorb Elements: DR');
    const newDR = duplicate(drEffect.changes);
    newDR[0].value = absorbedElement;
    await warpgate.mutate(token.document, {embedded: {ActiveEffect: {'Absorb Elements: DR': {changes: newDR}}}}, {}, {permanent:true, comparisonKeys: {ActiveEffect: 'name'}});

    /* Find & change the melee damage bonus AE */ 
    const damageBonusEffect = actor.effects.getName('Absorb Elements: Melee Damage Bonus');
    const newDamageBonuses = duplicate(damageBonusEffect.changes);
    newDamageBonuses[0].value= newDamageBonuses[1].value= '+'+workflow.itemLevel+'d6['+absorbedElement+']';
    await warpgate.mutate(token.document, {embedded: {ActiveEffect: {'Absorb Elements: Melee Damage Bonus': {changes: newDamageBonuses}}}}, {}, {permanent:true, comparisonKeys: {ActiveEffect: 'name'}});
}