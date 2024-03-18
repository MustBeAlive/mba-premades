async function cast({speaker, actor, token, character, item, args, scope, workflow}) {
    let ammount = workflow.castData.castLevel - 3;
    if (workflow.targets.size <= ammount) return;
    let selection = await chrisPremades.helpers.selectTarget(workflow.item.name, chrisPremades.constants.okCancel, Array.from(workflow.targets), false, 'multiple', undefined, false, 'Too many targets selected. Choose which targets to keep (Max: ' + ammount + ')');
    if (!selection.buttons) return;
    let newTargets = selection.inputs.filter(i => i).slice(0, ammount);
    chrisPremades.helpers.updateTargets(newTargets);
}

async function item({speaker, actor, token, character, item, args, scope, workflow}) {
    if (workflow.failedSaves.size < 1) return;
    let targets = Array.from(workflow.failedSaves);
    async function effectMacroCreate() {
        await token.document.update({ hidden: true });
    };
    async function effectMacroEnd() {
        await new Dialog({
            title: "Banishment",
            content: "<p>Banishment has ended. Where were you banished?</p>",
            buttons: {
                yes: {
                    label: "Home Plane (Stay)",
                    callback: async (html) => {
                        return;
                    },
                },
                no: {
                    label: "Demiplane (Return)",
                    callback: async (html) => {
                        await token.document.update({ hidden: false});
                    },
                },
            },
            default: "no"
        }).render(true);
    };
    const effectData = {
        'name': 'Banishment',
        'icon': 'assets/library/icons/sorted/spells/level4/banishment.webp',
        'origin': workflow.item.uuid,
        'duration': {
            'seconds': 60
        },
        'changes': [
            {
                'key': 'macro.CE',
                'mode': 0,
                'value': 'Incapacitated',
                'priority': 20
            }
        ],
        'flags': {
            'effectmacro': {
                'onCreate': {
                    'script': chrisPremades.helpers.functionToString(effectMacroCreate)
                },
                'onDelete': {
                    'script': chrisPremades.helpers.functionToString(effectMacroEnd)
                }
            }
        }
    };
    for (let i = 0; i < targets.length; i++) {
        let target = fromUuidSync(targets[i].document.uuid).object;
        await chrisPremades.helpers.createEffect(target.actor, effectData);
    }
}

export let banishment = {
    'cast': cast,
    'item': item
}