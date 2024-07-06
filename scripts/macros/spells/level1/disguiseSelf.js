import {mba} from "../../../helperFunctions.js";

export async function disguiseSelf({ speaker, actor, token, character, item, args, scope, workflow }) {
    let choices1 = [["Small", "small"], ["Medium", "medium"]];
    let choices2;
    let choices3;
    let raceSelection;
    let subraceSelection;
    let selection

    // modules/mba-premades/icons/spells/level1/disguiseSelf/race/subrace/age/sex/1
    // Race/Subrace list: 
    //                    Dragonborn: Chromatic/Metallic/Gem; 
    //                    Dwarf: Duergar/Hill/Mountain,
    //                    Elf: Drow/High(sun)/High(moon),
    //                    Gnome: Wood, Forest/Rock, 
    //                    Half-Elf: None,
    //                    Halfling: Lightfoot/Stout,
    //                    Human: Calichite/Chondathan/Damaran/Illuskan/Mulan/Rashemen/Terami/Tethyrian, 
    //                    Tiefling: None
    // Age List: Adult, Old
    // Sex List: Male, Female 


    let sizeSelection = await mba.dialog("Disguise Self: Size", choices1, `<b>What is your size?</b>`);
    if (!sizeSelection) return;
    if (sizeSelection === "small") {
        choices2 = [["Gnome", "gnome"], ["Halfling", "halfling"]];
        raceSelection = await mba.dialog("Disguise Self: Race", choices2, `<b>Choose race:</b>`);
        if (!raceSelection) return;
        if (raceSelection === "gnome") {
            choices3 = [["Forest", "forest"], ["Rock", "rock"]];
        }
        if (raceSelection === "halfling") {
            choices3 = [["Lightfoot", "lightfoot"], ["Stout", "stout"]];
        }
    }
    if (sizeSelection === "medium") {
        choices2 = [
            ["Dragonborn", "dragonborn"],
            ["Dwarf", "dwarf"],
            ["Elf", "elf"],
            ["Half-elf", "halfelf"],
            ["Human", "human"],
            ["Tiefling", "tiefling"]
        ];
        raceSelection = await mba.dialog("Disguise Self: Race", choices2, `<b>Choose Race:</b>`);
        if (!raceSelection) return;
        if (raceSelection === "dragonborn") {
            choices3 = [["Chromatic", "chromatic"], ["Gem", "gem"], ["Metallic", "metallic"]];
        }
        if (raceSelection === "dwarf") {
            choices3 = [["Duergar", "duergar"], ["Hill", "hill"], ["Mountain", "mountain"]];
        }
        if (raceSelection === "elf") {
            choices3 = [["Drow", "drow"], ["High (Moon)", "highmoon"], ["High (Sun)", "highsun"], ["Wood", "wood"]];
        }
        if (raceSelection === "halfelf") {
            choices3 = [["Half-elf", "halfelf"]];
        }
        if (raceSelection === "human") {
            choices3 = [
                ["Calishite", "calishite"],
                ["Chondathan", "chondathan"],
                ["Damaran", "damaran"],
                ["Illuskan", "illuskan"],
                ["Mulan", "mulan"],
                ["Rashemi", "rashemi"],
                ["Terami", "terami"],
                ["Tethyrian", "tethyrian"]
            ];
        }
        if (raceSelection === "tiefling") {
            choices3 = [["Tiefling", "tiefling"]];
        }
    }
    subraceSelection = await mba.dialog("Disguise Self: Subrace", choices3, `<b>Choose Subrace:</b>`);
    if (!subraceSelection) return;
    let choices4 = [["Adult", "adult"], ["Old", "old"]];
    let ageSelection = await mba.dialog("Disguise Self: Age", choices4, `<b>Choose Age:</b>`);
    if (!ageSelection) return
    let choices5 = [["Male", "male"], ["Female", "female"]];
    let sexSelection = await mba.dialog("Disguise Self: Sex", choices5, `<b>Choose Sex: </b>`);
    if (!sexSelection) return

    if (sizeSelection === "small") {
        if (raceSelection === "gnome") {
            if (subraceSelection === "forest") {
                if (ageSelection === "adult") {
                    if (sexSelection === "male") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/adult/male/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/adult/male/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/adult/male/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/adult/male/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/adult/male/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/adult/male/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/adult/male/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/adult/male/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/adult/male/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/adult/male/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/adult/male/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/adult/male/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/adult/male/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/adult/male/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/adult/male/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/adult/male/16.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/adult/male/17.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/adult/male/18.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/adult/male/19.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/adult/male/20.webp"],
                        ];
                    }
                    if (sexSelection === "female") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/adult/female/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/adult/female/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/adult/female/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/adult/female/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/adult/female/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/adult/female/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/adult/female/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/adult/female/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/adult/female/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/adult/female/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/adult/female/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/adult/female/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/adult/female/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/adult/female/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/adult/female/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/adult/female/16.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/adult/female/17.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/adult/female/18.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/adult/female/19.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/adult/female/20.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/adult/female/21.webp"],
                        ];
                    }
                }
                if (ageSelection === "old") {
                    if (sexSelection === "male") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/old/male/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/old/male/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/old/male/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/old/male/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/old/male/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/old/male/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/old/male/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/old/male/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/old/male/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/old/male/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/old/male/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/old/male/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/old/male/13.webp"],
                        ];
                    }
                    if (sexSelection === "female") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/old/female/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/old/female/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/old/female/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/old/female/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/old/female/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/old/female/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/old/female/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/old/female/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/old/female/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/old/female/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/old/female/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/old/female/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/forest/old/female/13.webp"],
                        ];
                    }
                }
            }
            if (subraceSelection === "rock") {
                if (ageSelection === "adult") {
                    if (sexSelection === "male") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/adult/male/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/adult/male/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/adult/male/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/adult/male/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/adult/male/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/adult/male/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/adult/male/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/adult/male/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/adult/male/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/adult/male/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/adult/male/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/adult/male/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/adult/male/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/adult/male/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/adult/male/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/adult/male/16.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/adult/male/17.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/adult/male/18.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/adult/male/19.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/adult/male/20.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/adult/male/21.webp"],
                        ];
                    }
                    if (sexSelection === "female") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/adult/female/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/adult/female/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/adult/female/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/adult/female/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/adult/female/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/adult/female/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/adult/female/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/adult/female/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/adult/female/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/adult/female/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/adult/female/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/adult/female/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/adult/female/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/adult/female/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/adult/female/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/adult/female/16.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/adult/female/17.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/adult/female/18.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/adult/female/19.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/adult/female/20.webp"],
                        ];
                    }
                }
                if (ageSelection === "old") {
                    if (sexSelection === "male") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/old/male/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/old/male/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/old/male/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/old/male/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/old/male/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/old/male/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/old/male/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/old/male/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/old/male/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/old/male/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/old/male/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/old/male/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/old/male/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/old/male/14.webp"],
                        ];
                    }
                    if (sexSelection === "female") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/old/female/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/old/female/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/old/female/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/old/female/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/old/female/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/old/female/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/old/female/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/old/female/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/old/female/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/old/female/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/old/female/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/old/female/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/old/female/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/old/female/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/old/female/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/gnome/rock/old/female/16.webp"],
                        ];
                    }
                }
            }
        }
        if (raceSelection === "halfling") {
            if (subraceSelection === "lightfoot") {
                if (ageSelection === "adult") {
                    if (sexSelection === "male") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/adult/male/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/adult/male/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/adult/male/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/adult/male/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/adult/male/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/adult/male/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/adult/male/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/adult/male/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/adult/male/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/adult/male/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/adult/male/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/adult/male/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/adult/male/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/adult/male/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/adult/male/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/adult/male/16.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/adult/male/17.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/adult/male/18.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/adult/male/19.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/adult/male/20.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/adult/male/21.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/adult/male/22.webp"],
                        ];
                    }
                    if (sexSelection === "female") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/adult/female/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/adult/female/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/adult/female/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/adult/female/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/adult/female/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/adult/female/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/adult/female/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/adult/female/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/adult/female/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/adult/female/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/adult/female/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/adult/female/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/adult/female/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/adult/female/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/adult/female/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/adult/female/16.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/adult/female/17.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/adult/female/18.webp"],
                        ];
                    }
                }
                if (ageSelection === "old") {
                    if (sexSelection === "male") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/old/male/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/old/male/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/old/male/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/old/male/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/old/male/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/old/male/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/old/male/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/old/male/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/old/male/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/old/male/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/old/male/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/old/male/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/old/male/13.webp"],
                        ];
                    }
                    if (sexSelection === "female") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/old/female/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/old/female/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/old/female/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/old/female/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/old/female/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/old/female/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/old/female/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/old/female/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/old/female/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/old/female/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/old/female/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/old/female/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/old/female/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/old/female/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/old/female/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/lightfoot/old/female/16.webp"],
                        ];
                    }
                }
            }
            if (subraceSelection === "stout") {
                if (ageSelection === "adult") {
                    if (sexSelection === "male") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/adult/male/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/adult/male/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/adult/male/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/adult/male/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/adult/male/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/adult/male/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/adult/male/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/adult/male/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/adult/male/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/adult/male/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/adult/male/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/adult/male/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/adult/male/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/adult/male/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/adult/male/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/adult/male/16.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/adult/male/17.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/adult/male/18.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/adult/male/19.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/adult/male/20.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/adult/male/21.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/adult/male/22.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/adult/male/23.webp"],
                        ];
                    }
                    if (sexSelection === "female") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/adult/female/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/adult/female/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/adult/female/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/adult/female/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/adult/female/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/adult/female/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/adult/female/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/adult/female/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/adult/female/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/adult/female/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/adult/female/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/adult/female/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/adult/female/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/adult/female/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/adult/female/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/adult/female/16.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/adult/female/17.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/adult/female/18.webp"],
                        ];
                    }
                }
                if (ageSelection === "old") {
                    if (sexSelection === "male") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/old/male/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/old/male/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/old/male/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/old/male/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/old/male/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/old/male/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/old/male/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/old/male/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/old/male/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/old/male/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/old/male/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/old/male/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/old/male/13.webp"],
                        ];
                    }
                    if (sexSelection === "female") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/old/female/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/old/female/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/old/female/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/old/female/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/old/female/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/old/female/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/old/female/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/old/female/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/old/female/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/old/female/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/old/female/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/old/female/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/old/female/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/old/female/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/old/female/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/old/female/16.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfling/stout/old/female/17.webp"],
                        ];
                    }
                }
            }
        }
    }
    if (sizeSelection === "medium") {
        if (raceSelection === "dragonborn") {
            if (subraceSelection === "chromatic") {
                if (ageSelection === "adult") {
                    if (sexSelection === "male") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/chromatic/adult/male/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/chromatic/adult/male/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/chromatic/adult/male/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/chromatic/adult/male/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/chromatic/adult/male/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/chromatic/adult/male/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/chromatic/adult/male/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/chromatic/adult/male/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/chromatic/adult/male/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/chromatic/adult/male/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/chromatic/adult/male/11.webp"],
                        ];
                    }
                    if (sexSelection === "female") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/chromatic/adult/female/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/chromatic/adult/female/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/chromatic/adult/female/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/chromatic/adult/female/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/chromatic/adult/female/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/chromatic/adult/female/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/chromatic/adult/female/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/chromatic/adult/female/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/chromatic/adult/female/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/chromatic/adult/female/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/chromatic/adult/female/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/chromatic/adult/female/12.webp"],
                        ];
                    }
                }
                if (ageSelection === "old") {
                    if (sexSelection === "male") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/chromatic/old/male/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/chromatic/old/male/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/chromatic/old/male/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/chromatic/old/male/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/chromatic/old/male/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/chromatic/old/male/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/chromatic/old/male/7.webp"],
                        ];
                    }
                    if (sexSelection === "female") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/chromatic/old/female/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/chromatic/old/female/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/chromatic/old/female/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/chromatic/old/female/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/chromatic/old/female/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/chromatic/old/female/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/chromatic/old/female/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/chromatic/old/female/8.webp"],
                        ];
                    }
                }
            }
            if (subraceSelection === "gem") {
                if (ageSelection === "adult") {
                    if (sexSelection === "male") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/gem/adult/male/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/gem/adult/male/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/gem/adult/male/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/gem/adult/male/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/gem/adult/male/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/gem/adult/male/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/gem/adult/male/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/gem/adult/male/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/gem/adult/male/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/gem/adult/male/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/gem/adult/male/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/gem/adult/male/12.webp"],
                        ];
                    }
                    if (sexSelection === "female") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/gem/adult/female/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/gem/adult/female/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/gem/adult/female/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/gem/adult/female/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/gem/adult/female/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/gem/adult/female/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/gem/adult/female/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/gem/adult/female/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/gem/adult/female/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/gem/adult/female/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/gem/adult/female/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/gem/adult/female/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/gem/adult/female/13.webp"],
                        ];
                    }
                }
                if (ageSelection === "old") {
                    if (sexSelection === "male") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/gem/old/male/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/gem/old/male/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/gem/old/male/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/gem/old/male/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/gem/old/male/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/gem/old/male/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/gem/old/male/7.webp"],
                        ];
                    }
                    if (sexSelection === "female") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/gem/old/female/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/gem/old/female/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/gem/old/female/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/gem/old/female/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/gem/old/female/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/gem/old/female/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/gem/old/female/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/gem/old/female/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/gem/old/female/9.webp"],
                        ];
                    }
                }
            }
            if (subraceSelection === "metallic") {
                if (ageSelection === "adult") {
                    if (sexSelection === "male") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/metallic/adult/male/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/metallic/adult/male/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/metallic/adult/male/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/metallic/adult/male/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/metallic/adult/male/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/metallic/adult/male/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/metallic/adult/male/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/metallic/adult/male/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/metallic/adult/male/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/metallic/adult/male/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/metallic/adult/male/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/metallic/adult/male/12.webp"],
                        ];
                    }
                    if (sexSelection === "female") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/metallic/adult/female/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/metallic/adult/female/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/metallic/adult/female/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/metallic/adult/female/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/metallic/adult/female/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/metallic/adult/female/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/metallic/adult/female/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/metallic/adult/female/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/metallic/adult/female/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/metallic/adult/female/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/metallic/adult/female/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/metallic/adult/female/12.webp"],
                        ];
                    }
                }
                if (ageSelection === "old") {
                    if (sexSelection === "male") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/metallic/old/male/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/metallic/old/male/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/metallic/old/male/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/metallic/old/male/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/metallic/old/male/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/metallic/old/male/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/metallic/old/male/7.webp"],
                        ];
                    }
                    if (sexSelection === "female") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/metallic/old/female/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/metallic/old/female/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/metallic/old/female/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/metallic/old/female/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/metallic/old/female/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/metallic/old/female/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dragonborn/metallic/old/female/7.webp"],
                        ];
                    }
                }
            }
        }
        if (raceSelection === "dwarf") {
            if (subraceSelection === "duergar") {
                if (ageSelection === "adult") {
                    if (sexSelection === "male") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/duergar/adult/male/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/duergar/adult/male/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/duergar/adult/male/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/duergar/adult/male/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/duergar/adult/male/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/duergar/adult/male/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/duergar/adult/male/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/duergar/adult/male/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/duergar/adult/male/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/duergar/adult/male/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/duergar/adult/male/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/duergar/adult/male/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/duergar/adult/male/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/duergar/adult/male/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/duergar/adult/male/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/duergar/adult/male/16.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/duergar/adult/male/17.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/duergar/adult/male/18.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/duergar/adult/male/19.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/duergar/adult/male/20.webp"],
                        ];
                    }
                    if (sexSelection === "female") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/duergar/adult/female/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/duergar/adult/female/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/duergar/adult/female/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/duergar/adult/female/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/duergar/adult/female/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/duergar/adult/female/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/duergar/adult/female/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/duergar/adult/female/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/duergar/adult/female/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/duergar/adult/female/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/duergar/adult/female/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/duergar/adult/female/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/duergar/adult/female/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/duergar/adult/female/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/duergar/adult/female/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/duergar/adult/female/16.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/duergar/adult/female/17.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/duergar/adult/female/18.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/duergar/adult/female/19.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/duergar/adult/female/20.webp"],
                        ];
                    }
                }
                if (ageSelection === "old") {
                    if (sexSelection === "male") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/duergar/old/male/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/duergar/old/male/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/duergar/old/male/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/duergar/old/male/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/duergar/old/male/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/duergar/old/male/6.webp"],
                        ];
                    }
                    if (sexSelection === "female") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/duergar/old/female/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/duergar/old/female/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/duergar/old/female/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/duergar/old/female/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/duergar/old/female/5.webp"],
                        ];
                    }
                }
            }
            if (subraceSelection === "hill") {
                if (ageSelection === "adult") {
                    if (sexSelection === "male") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/adult/male/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/adult/male/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/adult/male/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/adult/male/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/adult/male/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/adult/male/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/adult/male/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/adult/male/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/adult/male/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/adult/male/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/adult/male/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/adult/male/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/adult/male/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/adult/male/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/adult/male/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/adult/male/16.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/adult/male/17.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/adult/male/18.webp"],
                        ];
                    }
                    if (sexSelection === "female") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/adult/female/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/adult/female/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/adult/female/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/adult/female/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/adult/female/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/adult/female/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/adult/female/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/adult/female/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/adult/female/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/adult/female/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/adult/female/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/adult/female/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/adult/female/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/adult/female/14.webp"],
                        ];
                    }
                }
                if (ageSelection === "old") {
                    if (sexSelection === "male") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/old/male/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/old/male/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/old/male/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/old/male/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/old/male/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/old/male/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/old/male/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/old/male/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/old/male/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/old/male/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/old/male/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/old/male/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/old/male/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/old/male/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/old/male/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/old/male/16.webp"],
                        ];
                    }
                    if (sexSelection === "female") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/old/female/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/old/female/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/old/female/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/old/female/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/old/female/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/old/female/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/old/female/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/old/female/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/old/female/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/old/female/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/hill/old/female/11.webp"],
                        ];
                    }
                }
            }
            if (subraceSelection === "mountain") {
                if (ageSelection === "adult") {
                    if (sexSelection === "male") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/mountain/adult/male/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/mountain/adult/male/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/mountain/adult/male/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/mountain/adult/male/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/mountain/adult/male/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/mountain/adult/male/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/mountain/adult/male/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/mountain/adult/male/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/mountain/adult/male/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/mountain/adult/male/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/mountain/adult/male/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/mountain/adult/male/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/mountain/adult/male/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/mountain/adult/male/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/mountain/adult/male/15.webp"],
                        ];
                    }
                    if (sexSelection === "female") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/mountain/adult/female/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/mountain/adult/female/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/mountain/adult/female/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/mountain/adult/female/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/mountain/adult/female/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/mountain/adult/female/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/mountain/adult/female/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/mountain/adult/female/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/mountain/adult/female/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/mountain/adult/female/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/mountain/adult/female/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/mountain/adult/female/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/mountain/adult/female/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/mountain/adult/female/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/mountain/adult/female/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/mountain/adult/female/16.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/mountain/adult/female/17.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/mountain/adult/female/18.webp"],
                        ];
                    }
                }
                if (ageSelection === "old") {
                    if (sexSelection === "male") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/mountain/old/male/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/mountain/old/male/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/mountain/old/male/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/mountain/old/male/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/mountain/old/male/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/mountain/old/male/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/mountain/old/male/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/mountain/old/male/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/mountain/old/male/9.webp"],
                        ];
                    }
                    if (sexSelection === "female") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/mountain/old/female/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/mountain/old/female/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/mountain/old/female/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/mountain/old/female/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/mountain/old/female/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/mountain/old/female/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/mountain/old/female/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/mountain/old/female/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/mountain/old/female/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/mountain/old/female/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/mountain/old/female/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/mountain/old/female/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/mountain/old/female/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/dwarf/mountain/old/female/14.webp"],
                        ];
                    }
                }
            }
        }
        if (raceSelection === "elf") {
            if (subraceSelection === "drow") {
                if (ageSelection === "adult") {
                    if (sexSelection === "male") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/adult/male/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/adult/male/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/adult/male/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/adult/male/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/adult/male/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/adult/male/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/adult/male/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/adult/male/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/adult/male/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/adult/male/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/adult/male/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/adult/male/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/adult/male/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/adult/male/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/adult/male/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/adult/male/16.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/adult/male/17.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/adult/male/18.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/adult/male/19.webp"],
                        ];
                    }
                    if (sexSelection === "female") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/adult/female/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/adult/female/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/adult/female/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/adult/female/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/adult/female/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/adult/female/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/adult/female/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/adult/female/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/adult/female/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/adult/female/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/adult/female/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/adult/female/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/adult/female/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/adult/female/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/adult/female/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/adult/female/16.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/adult/female/17.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/adult/female/18.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/adult/female/19.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/adult/female/20.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/adult/female/21.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/adult/female/22.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/adult/female/23.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/adult/female/24.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/adult/female/25.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/adult/female/26.webp"],
                        ];
                    }
                }
                if (ageSelection === "old") {
                    if (sexSelection === "male") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/old/male/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/old/male/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/old/male/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/old/male/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/old/male/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/old/male/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/old/male/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/old/male/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/old/male/9.webp"],
                        ];
                    }
                    if (sexSelection === "female") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/old/female/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/old/female/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/old/female/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/old/female/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/old/female/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/old/female/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/old/female/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/old/female/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/old/female/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/drow/old/female/10.webp"],
                        ];
                    }
                }
            }
            if (subraceSelection === "highmoon") {
                if (ageSelection === "adult") {
                    if (sexSelection === "male") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/adult/male/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/adult/male/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/adult/male/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/adult/male/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/adult/male/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/adult/male/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/adult/male/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/adult/male/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/adult/male/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/adult/male/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/adult/male/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/adult/male/12.webp"],
                        ];
                    }
                    if (sexSelection === "female") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/adult/female/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/adult/female/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/adult/female/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/adult/female/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/adult/female/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/adult/female/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/adult/female/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/adult/female/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/adult/female/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/adult/female/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/adult/female/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/adult/female/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/adult/female/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/adult/female/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/adult/female/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/adult/female/16.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/adult/female/17.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/adult/female/18.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/adult/female/19.webp"],
                        ];
                    }
                }
                if (ageSelection === "old") {
                    if (sexSelection === "male") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/old/male/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/old/male/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/old/male/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/old/male/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/old/male/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/old/male/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/old/male/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/old/male/8.webp"],
                        ];
                    }
                    if (sexSelection === "female") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/old/female/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/old/female/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/old/female/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/old/female/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/old/female/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/old/female/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/old/female/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/old/female/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/old/female/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/old/female/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/old/female/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/old/female/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/old/female/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/old/female/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/old/female/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/old/female/16.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/old/female/17.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/old/female/18.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/old/female/19.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/old/female/20.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/old/female/21.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highmoon/old/female/22.webp"],
                        ];
                    }
                }
            }
            if (subraceSelection === "highsun") {
                if (ageSelection === "adult") {
                    if (sexSelection === "male") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highsun/adult/male/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highsun/adult/male/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highsun/adult/male/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highsun/adult/male/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highsun/adult/male/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highsun/adult/male/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highsun/adult/male/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highsun/adult/male/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highsun/adult/male/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highsun/adult/male/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highsun/adult/male/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highsun/adult/male/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highsun/adult/male/13.webp"],
                        ];
                    }
                    if (sexSelection === "female") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highsun/adult/female/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highsun/adult/female/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highsun/adult/female/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highsun/adult/female/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highsun/adult/female/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highsun/adult/female/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highsun/adult/female/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highsun/adult/female/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highsun/adult/female/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highsun/adult/female/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highsun/adult/female/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highsun/adult/female/12.webp"],
                        ];
                    }
                }
                if (ageSelection === "old") {
                    if (sexSelection === "male") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highsun/old/male/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highsun/old/male/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highsun/old/male/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highsun/old/male/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highsun/old/male/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highsun/old/male/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highsun/old/male/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highsun/old/male/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highsun/old/male/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highsun/old/male/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highsun/old/male/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highsun/old/male/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highsun/old/male/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highsun/old/male/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highsun/old/male/15.webp"],
                        ];
                    }
                    if (sexSelection === "female") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highsun/old/female/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highsun/old/female/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highsun/old/female/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highsun/old/female/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highsun/old/female/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highsun/old/female/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highsun/old/female/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highsun/old/female/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highsun/old/female/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/highsun/old/female/10.webp"],
                        ];
                    }
                }
            }
            if (subraceSelection === "wood") {
                if (ageSelection === "adult") {
                    if (sexSelection === "male") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/adult/male/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/adult/male/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/adult/male/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/adult/male/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/adult/male/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/adult/male/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/adult/male/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/adult/male/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/adult/male/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/adult/male/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/adult/male/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/adult/male/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/adult/male/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/adult/male/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/adult/male/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/adult/male/16.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/adult/male/17.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/adult/male/18.webp"],
                        ];
                    }
                    if (sexSelection === "female") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/adult/female/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/adult/female/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/adult/female/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/adult/female/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/adult/female/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/adult/female/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/adult/female/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/adult/female/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/adult/female/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/adult/female/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/adult/female/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/adult/female/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/adult/female/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/adult/female/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/adult/female/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/adult/female/16.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/adult/female/17.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/adult/female/18.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/adult/female/19.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/adult/female/20.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/adult/female/21.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/adult/female/22.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/adult/female/23.webp"],
                        ];
                    }
                }
                if (ageSelection === "old") {
                    if (sexSelection === "male") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/old/male/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/old/male/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/old/male/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/old/male/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/old/male/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/old/male/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/old/male/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/old/male/8.webp"],
                        ];
                    }
                    if (sexSelection === "female") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/old/female/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/old/female/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/old/female/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/old/female/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/old/female/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/old/female/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/old/female/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/elf/wood/old/female/8.webp"],
                        ];
                    }
                }
            }
        }
        if (raceSelection === "halfelf") {
            if (subraceSelection === "halfelf") {
                if (ageSelection === "adult") {
                    if (sexSelection === "male") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/adult/male/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/adult/male/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/adult/male/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/adult/male/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/adult/male/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/adult/male/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/adult/male/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/adult/male/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/adult/male/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/adult/male/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/adult/male/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/adult/male/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/adult/male/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/adult/male/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/adult/male/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/adult/male/16.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/adult/male/17.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/adult/male/18.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/adult/male/19.webp"],
                        ];
                    }
                    if (sexSelection === "female") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/adult/female/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/adult/female/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/adult/female/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/adult/female/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/adult/female/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/adult/female/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/adult/female/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/adult/female/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/adult/female/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/adult/female/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/adult/female/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/adult/female/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/adult/female/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/adult/female/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/adult/female/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/adult/female/16.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/adult/female/17.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/adult/female/18.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/adult/female/19.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/adult/female/20.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/adult/female/21.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/adult/female/22.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/adult/female/23.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/adult/female/24.webp"],
                        ];
                    }
                }
                if (ageSelection === "old") {
                    if (sexSelection === "male") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/old/male/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/old/male/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/old/male/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/old/male/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/old/male/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/old/male/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/old/male/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/old/male/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/old/male/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/old/male/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/old/male/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/old/male/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/old/male/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/old/male/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/old/male/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/old/male/16.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/old/male/17.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/old/male/18.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/old/male/19.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/old/male/20.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/old/male/21.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/old/male/22.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/old/male/23.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/old/male/24.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/old/male/25.webp"],
                        ];
                    }
                    if (sexSelection === "female") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/old/female/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/old/female/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/old/female/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/old/female/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/old/female/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/old/female/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/old/female/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/old/female/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/old/female/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/old/female/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/old/female/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/old/female/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/old/female/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/old/female/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/old/female/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/halfelf/halfelf/old/female/16.webp"],
                        ];
                    }
                }
            }
        }
        if (raceSelection === "human") {
            if (subraceSelection === "calishite") {
                if (ageSelection === "adult") {
                    if (sexSelection === "male") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/adult/male/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/adult/male/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/adult/male/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/adult/male/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/adult/male/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/adult/male/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/adult/male/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/adult/male/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/adult/male/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/adult/male/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/adult/male/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/adult/male/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/adult/male/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/adult/male/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/adult/male/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/adult/male/16.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/adult/male/17.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/adult/male/18.webp"],
                        ];
                    }
                    if (sexSelection === "female") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/adult/female/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/adult/female/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/adult/female/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/adult/female/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/adult/female/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/adult/female/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/adult/female/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/adult/female/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/adult/female/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/adult/female/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/adult/female/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/adult/female/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/adult/female/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/adult/female/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/adult/female/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/adult/female/16.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/adult/female/17.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/adult/female/18.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/adult/female/19.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/adult/female/20.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/adult/female/21.webp"],
                        ];
                    }
                }
                if (ageSelection === "old") {
                    if (sexSelection === "male") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/old/male/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/old/male/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/old/male/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/old/male/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/old/male/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/old/male/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/old/male/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/old/male/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/old/male/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/old/male/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/old/male/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/old/male/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/old/male/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/old/male/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/old/male/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/old/male/16.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/old/male/17.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/old/male/18.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/old/male/19.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/old/male/20.webp"],
                        ];
                    }
                    if (sexSelection === "female") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/old/female/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/old/female/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/old/female/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/old/female/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/old/female/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/old/female/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/old/female/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/old/female/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/old/female/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/old/female/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/old/female/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/old/female/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/old/female/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/old/female/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/old/female/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/old/female/16.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/old/female/17.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/old/female/18.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/old/female/19.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/old/female/20.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/old/female/21.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/calishite/old/female/22.webp"],
                        ];
                    }
                }
            }
            if (subraceSelection === "chondathan") {
                if (ageSelection === "adult") {
                    if (sexSelection === "male") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/adult/male/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/adult/male/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/adult/male/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/adult/male/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/adult/male/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/adult/male/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/adult/male/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/adult/male/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/adult/male/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/adult/male/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/adult/male/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/adult/male/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/adult/male/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/adult/male/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/adult/male/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/adult/male/16.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/adult/male/17.webp"],
                        ];
                    }
                    if (sexSelection === "female") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/adult/female/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/adult/female/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/adult/female/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/adult/female/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/adult/female/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/adult/female/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/adult/female/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/adult/female/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/adult/female/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/adult/female/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/adult/female/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/adult/female/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/adult/female/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/adult/female/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/adult/female/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/adult/female/16.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/adult/female/17.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/adult/female/18.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/adult/female/19.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/adult/female/20.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/adult/female/21.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/adult/female/22.webp"],
                        ];
                    }
                }
                if (ageSelection === "old") {
                    if (sexSelection === "male") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/old/male/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/old/male/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/old/male/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/old/male/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/old/male/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/old/male/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/old/male/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/old/male/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/old/male/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/old/male/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/old/male/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/old/male/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/old/male/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/old/male/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/old/male/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/old/male/16.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/old/male/17.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/old/male/18.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/old/male/19.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/old/male/20.webp"],
                        ];
                    }
                    if (sexSelection === "female") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/old/female/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/old/female/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/old/female/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/old/female/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/old/female/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/old/female/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/old/female/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/old/female/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/old/female/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/old/female/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/old/female/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/old/female/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/old/female/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/old/female/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/old/female/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/old/female/16.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/old/female/17.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/chondathan/old/female/18.webp"],
                        ];
                    }
                }
            }
            if (subraceSelection === "damaran") {
                if (ageSelection === "adult") {
                    if (sexSelection === "male") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/adult/male/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/adult/male/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/adult/male/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/adult/male/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/adult/male/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/adult/male/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/adult/male/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/adult/male/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/adult/male/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/adult/male/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/adult/male/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/adult/male/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/adult/male/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/adult/male/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/adult/male/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/adult/male/16.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/adult/male/17.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/adult/male/18.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/adult/male/19.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/adult/male/20.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/adult/male/21.webp"],
                        ];
                    }
                    if (sexSelection === "female") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/adult/female/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/adult/female/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/adult/female/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/adult/female/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/adult/female/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/adult/female/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/adult/female/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/adult/female/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/adult/female/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/adult/female/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/adult/female/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/adult/female/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/adult/female/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/adult/female/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/adult/female/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/adult/female/16.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/adult/female/17.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/adult/female/18.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/adult/female/19.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/adult/female/20.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/adult/female/21.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/adult/female/22.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/adult/female/23.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/adult/female/24.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/adult/female/25.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/adult/female/26.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/adult/female/27.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/adult/female/28.webp"],
                        ];
                    }
                }
                if (ageSelection === "old") {
                    if (sexSelection === "male") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/old/male/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/old/male/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/old/male/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/old/male/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/old/male/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/old/male/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/old/male/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/old/male/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/old/male/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/old/male/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/old/male/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/old/male/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/old/male/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/old/male/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/old/male/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/old/male/16.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/old/male/17.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/old/male/18.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/old/male/19.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/old/male/20.webp"],
                        ];
                    }
                    if (sexSelection === "female") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/old/female/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/old/female/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/old/female/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/old/female/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/old/female/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/old/female/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/old/female/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/old/female/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/old/female/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/old/female/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/old/female/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/old/female/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/old/female/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/old/female/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/damaran/old/female/15.webp"],
                        ];
                    }
                }
            }
            if (subraceSelection === "illuskan") {
                if (ageSelection === "adult") {
                    if (sexSelection === "male") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/adult/male/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/adult/male/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/adult/male/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/adult/male/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/adult/male/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/adult/male/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/adult/male/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/adult/male/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/adult/male/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/adult/male/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/adult/male/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/adult/male/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/adult/male/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/adult/male/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/adult/male/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/adult/male/16.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/adult/male/17.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/adult/male/18.webp"],
                        ];
                    }
                    if (sexSelection === "female") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/adult/female/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/adult/female/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/adult/female/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/adult/female/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/adult/female/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/adult/female/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/adult/female/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/adult/female/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/adult/female/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/adult/female/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/adult/female/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/adult/female/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/adult/female/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/adult/female/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/adult/female/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/adult/female/16.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/adult/female/17.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/adult/female/18.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/adult/female/19.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/adult/female/20.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/adult/female/21.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/adult/female/22.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/adult/female/23.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/adult/female/24.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/adult/female/25.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/adult/female/26.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/adult/female/27.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/adult/female/28.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/adult/female/29.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/adult/female/30.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/adult/female/31.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/adult/female/32.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/adult/female/33.webp"],
                        ];
                    }
                }
                if (ageSelection === "old") {
                    if (sexSelection === "male") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/old/male/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/old/male/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/old/male/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/old/male/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/old/male/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/old/male/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/old/male/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/old/male/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/old/male/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/old/male/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/old/male/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/old/male/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/old/male/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/old/male/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/old/male/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/old/male/16.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/old/male/17.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/old/male/18.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/old/male/19.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/old/male/20.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/old/male/21.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/old/male/22.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/old/male/23.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/old/male/24.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/old/male/25.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/old/male/26.webp"],
                        ];
                    }
                    if (sexSelection === "female") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/old/female/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/old/female/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/old/female/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/old/female/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/old/female/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/old/female/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/old/female/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/old/female/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/old/female/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/old/female/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/old/female/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/old/female/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/old/female/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/old/female/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/old/female/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/old/female/16.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/old/female/17.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/illuskan/old/female/18.webp"],
                        ];
                    }
                }
            }
            if (subraceSelection === "mulan") {
                if (ageSelection === "adult") {
                    if (sexSelection === "male") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/adult/male/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/adult/male/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/adult/male/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/adult/male/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/adult/male/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/adult/male/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/adult/male/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/adult/male/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/adult/male/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/adult/male/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/adult/male/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/adult/male/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/adult/male/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/adult/male/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/adult/male/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/adult/male/16.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/adult/male/17.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/adult/male/18.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/adult/male/19.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/adult/male/20.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/adult/male/21.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/adult/male/22.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/adult/male/23.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/adult/male/24.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/adult/male/25.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/adult/male/26.webp"],
                        ];
                    }
                    if (sexSelection === "female") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/adult/female/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/adult/female/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/adult/female/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/adult/female/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/adult/female/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/adult/female/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/adult/female/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/adult/female/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/adult/female/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/adult/female/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/adult/female/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/adult/female/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/adult/female/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/adult/female/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/adult/female/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/adult/female/16.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/adult/female/17.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/adult/female/18.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/adult/female/19.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/adult/female/20.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/adult/female/21.webp"],
                        ];
                    }
                }
                if (ageSelection === "old") {
                    if (sexSelection === "male") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/old/male/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/old/male/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/old/male/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/old/male/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/old/male/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/old/male/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/old/male/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/old/male/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/old/male/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/old/male/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/old/male/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/old/male/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/old/male/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/old/male/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/old/male/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/old/male/16.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/old/male/17.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/old/male/18.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/old/male/19.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/old/male/20.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/old/male/21.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/old/male/22.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/old/male/23.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/old/male/24.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/old/male/25.webp"],
                        ];
                    }
                    if (sexSelection === "female") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/old/female/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/old/female/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/old/female/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/old/female/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/old/female/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/old/female/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/old/female/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/old/female/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/old/female/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/old/female/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/old/female/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/old/female/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/old/female/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/old/female/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/old/female/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/old/female/16.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/old/female/17.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/old/female/18.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/old/female/19.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/old/female/20.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/old/female/21.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/mulan/old/female/22.webp"],
                        ];
                    }
                }
            }
            if (subraceSelection === "rashemi") {
                if (ageSelection === "adult") {
                    if (sexSelection === "male") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/adult/male/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/adult/male/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/adult/male/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/adult/male/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/adult/male/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/adult/male/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/adult/male/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/adult/male/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/adult/male/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/adult/male/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/adult/male/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/adult/male/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/adult/male/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/adult/male/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/adult/male/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/adult/male/16.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/adult/male/17.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/adult/male/18.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/adult/male/19.webp"],
                        ];
                    }
                    if (sexSelection === "female") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/adult/female/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/adult/female/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/adult/female/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/adult/female/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/adult/female/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/adult/female/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/adult/female/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/adult/female/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/adult/female/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/adult/female/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/adult/female/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/adult/female/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/adult/female/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/adult/female/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/adult/female/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/adult/female/16.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/adult/female/17.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/adult/female/18.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/adult/female/19.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/adult/female/20.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/adult/female/21.webp"],
                        ];
                    }
                }
                if (ageSelection === "old") {
                    if (sexSelection === "male") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/old/male/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/old/male/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/old/male/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/old/male/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/old/male/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/old/male/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/old/male/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/old/male/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/old/male/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/old/male/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/old/male/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/old/male/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/old/male/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/old/male/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/old/male/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/old/male/16.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/old/male/17.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/old/male/18.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/old/male/19.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/old/male/20.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/old/male/21.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/old/male/22.webp"],
                        ];
                    }
                    if (sexSelection === "female") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/old/female/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/old/female/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/old/female/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/old/female/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/old/female/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/old/female/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/old/female/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/old/female/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/old/female/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/old/female/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/old/female/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/old/female/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/old/female/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/old/female/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/old/female/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/old/female/16.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/old/female/17.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/old/female/18.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/rashemi/old/female/19.webp"],
                        ];
                    }
                }
            }
            if (subraceSelection === "terami") {
                if (ageSelection === "adult") {
                    if (sexSelection === "male") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/adult/male/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/adult/male/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/adult/male/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/adult/male/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/adult/male/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/adult/male/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/adult/male/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/adult/male/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/adult/male/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/adult/male/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/adult/male/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/adult/male/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/adult/male/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/adult/male/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/adult/male/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/adult/male/16.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/adult/male/17.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/adult/male/18.webp"],
                        ];
                    }
                    if (sexSelection === "female") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/adult/female/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/adult/female/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/adult/female/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/adult/female/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/adult/female/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/adult/female/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/adult/female/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/adult/female/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/adult/female/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/adult/female/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/adult/female/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/adult/female/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/adult/female/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/adult/female/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/adult/female/15.webp"],
                        ];
                    }
                }
                if (ageSelection === "old") {
                    if (sexSelection === "male") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/old/male/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/old/male/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/old/male/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/old/male/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/old/male/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/old/male/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/old/male/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/old/male/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/old/male/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/old/male/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/old/male/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/old/male/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/old/male/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/old/male/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/old/male/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/old/male/16.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/old/male/17.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/old/male/18.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/old/male/19.webp"],
                        ];
                    }
                    if (sexSelection === "female") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/old/female/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/old/female/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/old/female/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/old/female/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/old/female/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/old/female/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/old/female/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/old/female/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/old/female/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/old/female/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/old/female/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/old/female/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/old/female/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/old/female/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/old/female/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/old/female/16.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/old/female/17.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/old/female/18.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/old/female/19.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/terami/old/female/20.webp"],
                        ];
                    }
                }
            }
            if (subraceSelection === "tethyrian") {
                if (ageSelection === "adult") {
                    if (sexSelection === "male") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/adult/male/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/adult/male/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/adult/male/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/adult/male/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/adult/male/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/adult/male/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/adult/male/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/adult/male/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/adult/male/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/adult/male/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/adult/male/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/adult/male/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/adult/male/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/adult/male/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/adult/male/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/adult/male/16.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/adult/male/17.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/adult/male/18.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/adult/male/19.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/adult/male/20.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/adult/male/21.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/adult/male/22.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/adult/male/23.webp"],
                        ];
                    }
                    if (sexSelection === "female") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/adult/female/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/adult/female/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/adult/female/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/adult/female/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/adult/female/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/adult/female/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/adult/female/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/adult/female/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/adult/female/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/adult/female/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/adult/female/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/adult/female/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/adult/female/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/adult/female/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/adult/female/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/adult/female/16.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/adult/female/17.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/adult/female/18.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/adult/female/19.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/adult/female/20.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/adult/female/21.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/adult/female/22.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/adult/female/23.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/adult/female/24.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/adult/female/25.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/adult/female/26.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/adult/female/27.webp"],
                        ];
                    }
                }
                if (ageSelection === "old") {
                    if (sexSelection === "male") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/old/male/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/old/male/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/old/male/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/old/male/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/old/male/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/old/male/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/old/male/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/old/male/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/old/male/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/old/male/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/old/male/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/old/male/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/old/male/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/old/male/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/old/male/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/old/male/16.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/old/male/17.webp"],
                        ];
                    }
                    if (sexSelection === "female") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/old/female/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/old/female/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/old/female/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/old/female/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/old/female/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/old/female/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/old/female/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/old/female/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/old/female/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/old/female/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/old/female/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/old/female/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/old/female/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/old/female/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/old/female/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/old/female/16.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/old/female/17.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/old/female/18.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/old/female/19.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/old/female/20.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/old/female/21.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/human/tethyrian/old/female/22.webp"],
                        ];
                    }
                }
            }
        }
        if (raceSelection === "tiefling") {
            if (subraceSelection === "tiefling") {
                if (ageSelection === "adult") {
                    if (sexSelection === "male") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/male/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/male/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/male/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/male/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/male/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/male/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/male/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/male/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/male/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/male/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/male/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/male/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/male/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/male/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/male/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/male/16.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/male/17.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/male/18.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/male/19.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/male/20.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/male/21.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/male/22.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/male/23.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/male/24.webp"],
                        ];
                    }
                    if (sexSelection === "female") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/female/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/female/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/female/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/female/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/female/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/female/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/female/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/female/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/female/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/female/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/female/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/female/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/female/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/female/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/female/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/female/16.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/female/17.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/female/18.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/female/19.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/female/20.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/female/21.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/female/22.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/female/23.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/female/24.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/female/25.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/female/26.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/female/27.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/female/28.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/female/29.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/female/30.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/female/31.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/female/32.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/female/33.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/female/34.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/female/35.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/adult/female/36.webp"],
                        ];
                    }
                }
                if (ageSelection === "old") {
                    if (sexSelection === "male") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/old/male/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/old/male/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/old/male/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/old/male/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/old/male/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/old/male/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/old/male/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/old/male/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/old/male/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/old/male/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/old/male/11.webp"],
                        ];
                    }
                    if (sexSelection === "female") {
                        selection = [
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/old/female/1.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/old/female/2.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/old/female/3.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/old/female/4.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/old/female/5.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/old/female/6.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/old/female/7.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/old/female/8.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/old/female/9.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/old/female/10.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/old/female/11.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/old/female/12.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/old/female/13.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/old/female/14.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/old/female/15.webp"],
                            ["modules/mba-premades/icons/spells/level1/disguiseSelf/tiefling/tiefling/old/female/16.webp"],
                        ];
                    }
                }
            }
        }
    }

    function generateEnergyBox(type) {
        return `
            <label class="radio-label">
            <input type="radio" name="type" value="${selection[type]}" />
            <img src="${selection[type]}" style="border: 0px; width: 100px; height: 100px"/>
            </label>
        `;
    }
    const tokenSelection = Object.keys(selection).map((type) => generateEnergyBox(type)).join("\n");
    const content = `
    <style>
        .disguiseSelf .form-group {
            display: flex;
            flex-wrap: wrap;
            width: 100%;
            align-items: flex-start;
        }
        .disguiseSelf .radio-label {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                text-align: center;
                justify-items: center;
                flex: 0 1 25%;
                line-height: normal;
        }
        .disguiseSelf .radio-label input {
            display: none;
        }
        .disguiseSelf img {
            border: 0px;
            width: 80px;
            height: 80px;
            flex: 0 0 80px;
            cursor: pointer;
        }
        /* CHECKED STYLES */
        .disguiseSelf [type="radio"]:checked + img {
            outline: 2px solid #9580FF;
        }
    </style>
    <form class="disguiseSelf">
        <div class="form-group" id="types">
            ${tokenSelection}
        </div>
    </form>
    `;
    const tokenToDisguise = await new Promise((resolve) => {
        new Dialog({
            title: "🎭 Disguise Self: Choose appearance 🎭",
            content: content,
            buttons: {
                ok: {
                    label: "Ok",
                    callback: async (html) => {
                        const element = html.find("input[type='radio'][name='type']:checked").val();
                        resolve(element);
                    },
                },
                cancel: {
                    label: "Cancel",
                    callback: async () => {
                        return;
                    }
                }
            }
        }).render(true);
    });
    if (!tokenToDisguise) {
        ui.notifications.warn("You failed to choose appearance, try again!");
        return;
    };
    let tokenPath = tokenToDisguise;
    let showIcon = true;
    if (game.users.current.isGM) {
        let hide = [["Yes, hide effect icon", "yes"], ["No, keep it", "no"]];
        let hideIcon = await mba.dialog("Disguise Self: GM", hide, `<b>Do you want to hide the effect icon?</b>`);
        if (hideIcon === "yes") showIcon = false;
    };
    async function effectMacro() {
        await game.Gametime.doIn({ hour: 1 }, async () => {
            let effect = await mbaPremades.helpers.findEffect(actor, "Disguise Self");
            if (effect) await warpgate.revert(token.document, "Disguise Self");
        });
    };
    async function effectMacroDel() {
        new Sequence()
            .animation()
            .on(token)
            .opacity(1)
            .play();

        Sequencer.EffectManager.endEffects({ name: `${token.document.name} DisSel` })
        await warpgate.revert(token.document, "Disguise Self");
    };
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p>Disguise Self cast time: ${SimpleCalendar.api.currentDateTimeDisplay().time}</p>
        `,
        'flags': {
            'dae': {
                'showIcon': showIcon
            },
            'effectmacro': {
                'onCreate': {
                    'script': mba.functionToString(effectMacro)
                },
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 1,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };
    let updates = {
        'token': {
            'flags': {
                'autorotate': {
                    'enabled': false
                },
                'image-hover': {
                    'specificArt': tokenPath
                }
            }
        },
        'embedded': {
            'ActiveEffect': {
                [effectData.name]: effectData
            }
        },
    };
    let options = {
        'permanent': false,
        'name': 'Disguise Self',
        'description': 'Disguise Self'
    };
    new Sequence()

        .effect()
        .file("jb2a.markers.circle_of_stars.blue")
        .atLocation(workflow.token)
        .delay(200)
        .duration(7500)
        .fadeOut(7500)
        .scaleToObject(1.3)
        .attachTo(workflow.token, { bindAlpha: false })
        .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 60000 })
        .zIndex(1)

        .effect()
        .file("jb2a.sneak_attack.blue")
        .atLocation(workflow.token, { followRotation: false })
        .delay(200)
        .startTime(450)
        .scaleToObject(2)
        .attachTo(workflow.token, { bindAlpha: false })
        .playbackRate(1)
        .zIndex(2)
        .waitUntilFinished(-1000)

        .animation()
        .on(workflow.token)
        .opacity(0)

        .effect()
        .file(tokenPath)
        .atLocation(workflow.token)
        .scaleToObject(1)
        .attachTo(workflow.token, { bindAlpha: false })
        .fadeOut(2000, { ease: "easeOutCubic" })
        .scaleOut(0.5, 3000, { ease: "easeOutCubic" })
        .persist()
        .name(`${workflow.token.document.name} Disguise Self`)

        .effect()
        .file("jb2a.sleep.cloud.01.blue")
        .atLocation(workflow.token)
        .delay(200)
        .opacity(0.5)
        .scaleOut(0.5, 1000, { ease: "easeOutCubic" })
        .scaleToObject(2)
        .belowTokens()
        .duration(1000)
        .fadeOut(1000)

        .thenDo(async () => {
            await warpgate.mutate(workflow.token.document, updates, {}, options);
        })

        .effect()
        .file("jb2a.particles.outward.blue.02.03")
        .atLocation(workflow.token)
        .delay(200)
        .scaleToObject(1.5)
        .zIndex(2)
        .scaleIn(0, 200, { ease: "easeOutCubic" })
        .attachTo(workflow.token, { bindAlpha: false })
        .fadeIn(760)
        .fadeOut(2500)
        .name(`${workflow.token.document.name} DisSel`)

        .play();

}