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
          'description': "For the next 24 hours, whenever you make an ability check, you can roll a d4 and add the number rolled to the ability check.",
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
     await chrisPremades.helpers.createEffect(target.actor, effectData);
}

async function check({ speaker, actor, token, character, item, args, scope, workflow }) {
     let target = workflow.targets.first();
     let effect = await chrisPremades.helpers.findEffect(target.actor, 'Animal Messenger');
     if (!effect) return;
     let type = chrisPremades.helpers.raceOrType(target.actor);
     if (type != 'beast') {
          ui.notifications.warn('Animal Messenger can only affect beasts!');
          await chrisPremades.helpers.removeEffect(effect);
          return;
     }
     let size = chrisPremades.helpers.getSize(target.actor)
     if (size != 0) {
          ui.notifications.warn('Animal Messenger can only affect tiny creatures!');
          await chrisPremades.helpers.removeEffect(effect);
          return;
     }
}

export let animalMessenger = {
     'item': item,
     'check': check
}