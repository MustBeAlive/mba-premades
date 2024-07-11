import {mba} from "../../../helperFunctions.js"

export async function ropeTrick({ speaker, actor, token, character, item, args, scope, workflow }) {
    let sceneData = {
        "name": "Rope Trick",
        "navigation": true,
        "navOrder": 0,
        "navName": "RT",
        "background": {
            "src": "modules/mba-premades/icons/spells/level2/rope_trick/rope_trick_space.webp",
            "scaleX": 1,
            "scaleY": 1,
            "offsetX": 0,
            "offsetY": 0,
            "rotation": 0
        },
        "foregroundElevation": 20,
        "width": 600,
        "height": 400,
        "padding": 0.05,
        "initial": {
            "x": null,
            "y": null,
            "scale": null
        },
        "backgroundColor": "#999999",
        "grid": {
            "type": 1,
            "size": 100,
            "color": "#000000",
            "alpha": 0.1,
            "distance": 5,
            "units": "ft"
        },
        "tokenVision": true,
        "fogExploration": false,
        "fogReset": 1718065422803,
        "globalLight": true,
        "globalLightThreshold": null,
        "darkness": 0,
        "flags": {
            "smalltime": {
                "darkness-link": false,
                "player-vis": "2",
                "moonlight": false
            },
            "levels": {
                "backgroundElevation": 0,
                "lightMasking": true,
                "weatherElevation": null
            },
            "perceptive": {
                "SceneBrightEndFlag": 0.25,
                "SceneDimEndFlag": 0.75
            },
            "wall-height": {
                "advancedVision": true
            },
            "token-attacher": {},
            "walledtemplates": {
                "version": "0.7.10"
            }
        },
        "tiles": [
            {
                "texture": {
                    "src": null,
                    "scaleX": 1,
                    "scaleY": 1,
                    "tint": null,
                    "offsetX": 0,
                    "offsetY": 0,
                    "rotation": 0
                },
                "x": 200,
                "y": 400,
                "width": 100,
                "height": 100,
                "rotation": 0,
                "alpha": 1,
                "overhead": false,
                "roof": false,
                "occlusion": {
                    "mode": 1,
                    "alpha": 0,
                    "radius": null
                },
                "flags": {
                    "monks-active-tiles": {
                        "active": true,
                        "record": false,
                        "restriction": "all",
                        "controlled": "all",
                        "trigger": [
                            "enter"
                        ],
                        "allowpaused": false,
                        "usealpha": false,
                        "pointer": false,
                        "vision": false,
                        "pertoken": false,
                        "minrequired": 0,
                        "cooldown": null,
                        "chance": 100,
                        "fileindex": 0,
                        "actions": [
                            {
                                "action": "teleport",
                                "data": {
                                    "entity": {
                                        "id": "token",
                                        "name": "Triggering Token"
                                    },
                                    "location": {
                                        "x": workflow.token.center.x, /*- canvas.grid.size / 2*/
                                        "y": workflow.token.center.y, /*- canvas.grid.size / 2*/
                                        "sceneId": game.canvas.scene.id,
                                    },
                                    "position": "random",
                                    "remotesnap": false,
                                    "animatepan": false,
                                    "triggerremote": false,
                                    "deletesource": true,
                                    "preservesettings": false,
                                    "avoidtokens": false,
                                    "colour": ""
                                },
                            },
                            {
                                "action": "scene",
                                "data": {
                                    "sceneid": {
                                        "id": `Scene.${game.canvas.scene.id}`,
                                        "name": game.canvas.scene.name,
                                    },
                                    "activate": false,
                                    "for": "trigger"
                                },
                            }
                        ],
                    }
                },
                "hidden": true,
                "locked": true
            }
        ],
        "walls": [
            {
                "light": 20,
                "sight": 20,
                "sound": 20,
                "move": 20,
                "c": [
                    200,
                    400,
                    200,
                    200
                ],
                "_id": "ZYU8BJ6WfygGYyVh",
                "dir": 0,
                "door": 0,
                "ds": 0,
                "threshold": {
                    "light": null,
                    "sight": null,
                    "sound": null,
                    "attenuation": false
                },
                "flags": {}
            },
            {
                "light": 20,
                "sight": 20,
                "sound": 20,
                "move": 20,
                "c": [
                    200,
                    200,
                    600,
                    200
                ],
                "_id": "7MugnrJQzime86fi",
                "dir": 0,
                "door": 0,
                "ds": 0,
                "threshold": {
                    "light": null,
                    "sight": null,
                    "sound": null,
                    "attenuation": false
                },
                "flags": {}
            },
            {
                "light": 20,
                "sight": 20,
                "sound": 20,
                "move": 20,
                "c": [
                    600,
                    200,
                    600,
                    400
                ],
                "_id": "IjDFk4oT8DG4q4aV",
                "dir": 0,
                "door": 0,
                "ds": 0,
                "threshold": {
                    "light": null,
                    "sight": null,
                    "sound": null,
                    "attenuation": false
                },
                "flags": {}
            },
            {
                "light": 20,
                "sight": 20,
                "sound": 20,
                "move": 20,
                "c": [
                    600,
                    400,
                    300,
                    400
                ],
                "_id": "5qJIDmLgxYCAsRUn",
                "dir": 0,
                "door": 0,
                "ds": 0,
                "threshold": {
                    "light": null,
                    "sight": null,
                    "sound": null,
                    "attenuation": false
                },
                "flags": {}
            },
            {
                "light": 20,
                "sight": 20,
                "sound": 20,
                "move": 20,
                "c": [
                    200,
                    400,
                    200,
                    500
                ],
                "_id": "MxKiK1Xho1nXpJ98",
                "dir": 0,
                "door": 0,
                "ds": 0,
                "threshold": {
                    "light": null,
                    "sight": null,
                    "sound": null,
                    "attenuation": false
                },
                "flags": {}
            },
            {
                "light": 20,
                "sight": 20,
                "sound": 20,
                "move": 20,
                "c": [
                    200,
                    500,
                    300,
                    500
                ],
                "_id": "k65jsjjWZvivTPRT",
                "dir": 0,
                "door": 0,
                "ds": 0,
                "threshold": {
                    "light": null,
                    "sight": null,
                    "sound": null,
                    "attenuation": false
                },
                "flags": {}
            },
            {
                "light": 20,
                "sight": 20,
                "sound": 20,
                "move": 20,
                "c": [
                    300,
                    500,
                    300,
                    400
                ],
                "_id": "rINssS5MqURJ0opY",
                "dir": 0,
                "door": 0,
                "ds": 0,
                "threshold": {
                    "light": null,
                    "sight": null,
                    "sound": null,
                    "attenuation": false
                },
                "flags": {}
            },
            {
                "light": 20,
                "sight": 20,
                "sound": 0,
                "move": 0,
                "c": [
                    200,
                    400,
                    300,
                    400
                ],
                "_id": "4XGGox708YSy1JN1",
                "dir": 0,
                "door": 0,
                "ds": 0,
                "threshold": {
                    "light": null,
                    "sight": null,
                    "sound": null,
                    "attenuation": false
                },
                "flags": {}
            }
        ],
    }
    await mba.createScene(sceneData);
    await warpgate.wait(100);
    let [ropeScene] = game.scenes.filter(s => s.name === "Rope Trick");
    if (!ropeScene) {
        ui.notifications.warn("Unable to find scene! (Rope Trick");
        return;
    }
    await mba.playerDialogMessage();
    let position = await mba.aimCrosshair(workflow.token, 5, workflow.item.img, 2, 1);
    await mba.clearPlayerDialogMessage();
    if (position.canceled) {
        ui.notifications.warn("Failed to choose position, returning!");
        let ropeTrickSceneID = game.scenes.filter(s => s.name === "Rope Trick").map(i => i.id);
        if (ropeTrickSceneID) await mba.deleteScene(ropeTrickSceneID);
        return;
    }
    let tileData = [
        {
            "texture": {
                "src": null,
                "scaleX": 1,
                "scaleY": 1,
                "tint": null,
                "offsetX": 0,
                "offsetY": 0,
                "rotation": 0
            },
            "x": position.x - canvas.grid.size / 2,
            "y": position.y - canvas.grid.size / 2,
            "width": 100,
            "height": 100,
            "rotation": 0,
            "alpha": 1,
            "overhead": false,
            "roof": false,
            "occlusion": {
                "mode": 1,
                "alpha": 0,
                "radius": null
            },
            "flags": {
                "mba-premades": {
                    'spell': {
                        'ropeTrick': true
                    }
                },
                "monks-active-tiles": {
                    "active": true,
                    "record": false,
                    "restriction": "all",
                    "controlled": "all",
                    "trigger": ["enter"],
                    "allowpaused": false,
                    "usealpha": false,
                    "pointer": false,
                    "vision": false,
                    "pertoken": false,
                    "minrequired": 0,
                    "cooldown": null,
                    "chance": 100,
                    "fileindex": -1,
                    "actions": [
                        {
                            "action": "teleport",
                            "data": {
                                "entity": {
                                    "id": "token",
                                    "name": "Triggering Token"
                                },
                                "location": {
                                    "x": 251,
                                    "y": 350,
                                    "sceneId": ropeScene.id
                                },
                                "position": "random",
                                "remotesnap": true,
                                "animatepan": false,
                                "triggerremote": false,
                                "deletesource": true,
                                "preservesettings": false,
                                "avoidtokens": false,
                                "colour": ""
                            },
                        },
                        {
                            "action": "scene",
                            "data": {
                                "sceneid": {
                                    "id": `Scene.${ropeScene.id}`,
                                    "name": ropeScene.name,
                                },
                                "activate": false,
                                "for": "trigger"
                            },
                        }
                    ],
                }
            },
            "hidden": true,
            "locked": true
        }
    ];
    await mba.createTile(tileData);
    let [ropeTile] = game.canvas.scene.tiles.filter(t => t.flags['mba-premades']?.spell?.ropeTrick === true);
    async function effectMacroDel() {
        Sequencer.EffectManager.endEffects({ name: `Rope Trick` });
        let ropeTrickSceneID = game.scenes.filter(s => s.name === "Rope Trick").map(i => i.id);
        if (ropeTrickSceneID) await mbaPremades.helpers.deleteScene(ropeTrickSceneID);
        let [ropeTile] = game.canvas.scene.tiles.filter(t => t.flags['mba-premades']?.spell?.ropeTrick === true);
        if (ropeTile) await mbaPremades.helpers.deleteTile(ropeTile);
    };
    let effectData = {
        'name': workflow.item.name,
        'icon': workflow.item.img,
        'origin': workflow.item.uuid,
        'description': `
            <p></p>
        `,
        'duration': {
            'seconds': 3600
        },
        'flags': {
            'effectmacro': {
                'onDelete': {
                    'script': mba.functionToString(effectMacroDel)
                }
            },
            'mba-premades': {
                'spell': {
                    'ropeTrick': {
                        'tileId': ropeTile.id
                    }
                }
            },
            'midi-qol': {
                'castData': {
                    baseLevel: 2,
                    castLevel: workflow.castData.castLevel,
                    itemUuid: workflow.item.uuid
                }
            }
        }
    };

    new Sequence()

        .effect()
        .file("jb2a.magic_signs.circle.02.transmutation.complete.yellow")
        .attachTo(ropeTile)
        .size(1.6, { gridUnits: true })
        .belowTokens()
        .zIndex(1)
        .waitUntilFinished(-9542)

        .effect()
        .file("jb2a.portals.horizontal.ring.orange")
        .atLocation(ropeTile)
        .size(1.6, { gridUnits: true })
        .fadeIn(2000)
        .fadeOut(2000)
        .belowTokens()
        .zIndex(2)
        .persist()
        .name(`Rope Trick`)

        .thenDo(async () => {
            await mba.createEffect(workflow.actor, effectData);
        })

        .play()
}