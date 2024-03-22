export async function earthbind(token) {
    const tokenDoc = token.document;
    let tokenHeight = tokenDoc.elevation;
    if (tokenHeight === 0) return;
    let newTokenHeight;
    if (tokenHeight > 0 && tokenHeight > 60) {
        newTokenHeight = tokenHeight - 60;
    }
    if (tokenHeight > 0 && tokenHeight < 60) {
        newTokenHeight = 0;
    }
    tokenDoc.update({ "elevation": newTokenHeight });
}