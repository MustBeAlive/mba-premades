import {constants} from "../../generic/constants.js";
import {mba} from "../../../helperFunctions.js";

async function luringSongCast({ speaker, actor, token, character, item, args, scope, workflow }) {

}

async function luringSongTurnStart(token) {

}

async function luringSongItem({ speaker, actor, token, character, item, args, scope, workflow }) {

}

export let harpy = {
    'luringSongCast': luringSongCast,
    'luringSongItem': luringSongItem,
    'luringSongTurnStart': luringSongTurnStart
}