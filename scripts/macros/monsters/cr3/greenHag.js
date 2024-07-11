import {mba} from "../../../helperFunctions.js";

//To do:
//Doors: find all doors on the scene, update state to closed
//Duplicate: animation to vanish, if in combat -> update initiative (make them indistinguishable from each other)

async function lairDoors({ speaker, actor, token, character, item, args, scope, workflow }) {

}

async function lairDuplicate({ speaker, actor, token, character, item, args, scope, workflow }) {
    
}

export let greenHag = {
    'lairDoors': lairDoors,
    'lairDuplicate': lairDuplicate
}