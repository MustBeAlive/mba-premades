//Janky on the code side, but for now looks good enough.
export async function sending({speaker, actor, token, character, item, args, scope, workflow}) {
    let word = [];
    let wordInput = await warpgate.menu({
        inputs: [{
                label: `Input text (Max: 25 words)`,
                type: 'text',
            options: ``
        }],
            buttons: [{
                label: 'Ok',
                value: 1}]
            },
            {title: 'Sending'}
        );
    word.push(wordInput.inputs);

    let words = word.toString();
    function countWords(str) {
        return str.trim().split(/\s+/).length;
    }

    let wordCount = countWords(words)
    if (wordCount > 25) {
        ui.notifications.warn('Can only use 25 words!');
        return;
    }

    var wordsArr = Array.from(words.split(" "));

    const style = {
        align: "center",
        fontFamily: "Helvetica",
        fontSize: 40,
        fontWeight: "bold"
    };

    for (let i=0; i < wordsArr.length; i++) {
        let word = wordsArr[i];
        new Sequence()
            .effect()
            .atLocation(token)
            .file("jb2a.particles.outward.red.01.02")
            .duration(4100)

            .effect()
            .atLocation(token, {offset: {x: 3.5, y: 0}})
            .animateProperty("sprite", "position.x", { from: 3.5, to: -3.5, duration: 5000, gridUnits: true})
            .text(`${word}`, style)
            .fadeIn(750)
            .filter("Glow", { color: 0x8e1a1a })
            .duration(5000)
            .fadeOut(750)
            .play()

        await warpgate.wait(2000);
    }
}