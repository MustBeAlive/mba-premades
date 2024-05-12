import {mba} from "../../../helperFunctions.js";

async function cast({ speaker, actor, token, character, item, args, scope, workflow }) {
     let target = workflow.targets.first();
     let effect = await mba.findEffect(target.actor, 'Animal Messenger');
     if (!effect) return;
     if (mba.raceOrType(target.actor) != 'beast') {
          ui.notifications.warn('Animal Messenger can only affect beasts!');
          return;
     }
     if (mba.getSize(target.actor) != 0) {
          ui.notifications.warn('Animal Messenger can only affect tiny creatures!');
          return;
     }
}

async function item({ speaker, actor, token, character, item, args, scope, workflow }) {
     let target = workflow.targets.first();
     let castLevel = workflow.castData.castLevel;
     let duration;
     switch (castLevel) {
          case 2:
               duration = 86400;
               break;
          case 3:
               duration = 86400 * 3;
               break;
          case 4:
               duration = 86400 * 5;
               break;
          case 5:
               duration = 86400 * 7;
               break;
          case 6:
               duration = 86400 * 9;
               break;
          case 7:
               duration = 86400 * 11;
               break;
          case 8:
               duration = 86400 * 13;
               break;
          case 9:
               duration = 86400 * 15;
     }
     let effectData = {
          'name': workflow.item.name,
          'icon': workflow.item.img,
          'origin': workflow.item.uuid,
          'description': `
               <p>Animal Messenger of <b>${workflow.token.document.name}</b></p>
          `,
          'duration': {
               'seconds': duration
          },
          'flags': {
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

          .wait(500)

          .effect()
          .file('jb2a.swirling_leaves.complete.01.green.0')
          .atLocation(target)
          .scaleToObject(2.25)
          .scaleIn(0, 4000, { 'ease': 'easeOutBack' })
          .endTime(4500)
          .fadeOut(750, { 'ease': 'easeOutQuint' })
          .zIndex(6)

          .wait(1000)

          .effect()
          .file('jb2a.sacred_flame.target.green')
          .atLocation(target)
          .scaleToObject(2)
          .scaleIn(0, 4000, { 'ease': 'easeOutBack' })
          .endTime(2500)
          .fadeOut(500)
          .zIndex(5)
          .waitUntilFinished(-1000)

          .effect()
          .file('jb2a.plant_growth.04.ring.4x4.complete.greenwhite')
          .atLocation(target)
          .opacity(1)
          .belowTokens()
          .randomRotation()
          .scaleToObject(1.5)
          .zIndex(1.1)

          .wait(200)

          .effect()
          .file('jb2a.magic_signs.circle.02.conjuration.loop.green')
          .atLocation(target)
          .scaleIn(0, 500, { 'ease': 'easeOutCubic' })
          .belowTokens()
          .scaleToObject(1.25)
          .duration(1200)
          .fadeIn(200, { 'ease': 'easeOutCirc', 'delay': 200 })
          .fadeOut(300, { 'ease': 'linear' })
          .filter('ColorMatrix', { 'saturate': -1, 'brightness': 2 })
          .filter('Blur', { 'blurX': 5, 'blurY': 10 })
          .zIndex(0.1)

          .effect()
          .file('jb2a.magic_signs.circle.02.conjuration.loop.green')
          .atLocation(target)
          .scaleIn(0, 500, { 'ease': 'easeOutCubic' })
          .belowTokens()
          .scaleToObject(1.25)
          .fadeOut(5000, { 'ease': 'easeOutQuint' })
          .duration(10000)

          .effect()
          .file('jb2a.swirling_leaves.outburst.01.greenorange')
          .atLocation(target)
          .opacity(1)
          .scaleToObject(2)
          .zIndex(1)

          .play();

     await warpgate.wait(4000);
     await mba.createEffect(target.actor, effectData);
}

export let animalMessenger = {
     'item': item,
     'cast': cast
}