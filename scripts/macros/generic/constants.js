// To do: update spell lists after PHB2024 release

const advantageEffectData = {
    'name': 'Save: Advantage',
    'icon': 'modules/mba-premades/icons/generic/generic_buff.webp',
    'description': "You have advantage on the next save you make",
    'duration': {
        'turns': 1
    },
    'changes': [
        {
            'key': 'flags.midi-qol.advantage.ability.save.all',
            'value': '1',
            'mode': 5,
            'priority': 120
        }
    ],
    'flags': {
        'dae': {
            'specialDuration': ['isSave']
        },
        'mba-premades': {
            'effect': {
                'noAnimation': true
            }
        }
    }
};

const immunityEffectData = {
    'name': 'Save: Immunity',
    'icon': 'modules/mba-premades/icons/generic/generic_buff.webp',
    'description': "You succeed on the next save you make",
    'duration': {
        'turns': 1
    },
    'changes': [
        {
            'key': 'flags.midi-qol.min.ability.save.all',
            'value': '500',
            'mode': 2,
            'priority': 120
        }
    ],
    'flags': {
        'dae': {
            'specialDuration': ['isSave']
        },
        'mba-premades': {
            'effect': {
                'noAnimation': true
            }
        }
    }
};

const disadvantageEffectData = {
    'name': "Save: Disadvantage",
    'icon': "modules/mba-premades/icons/generic/generic_debuff.webp",
    'description': "You have disadvantage on the next save you make",
    'duration': {
        'turns': 1
    },
    'changes': [
        {
            'key': 'flags.midi-qol.disadvantage.ability.save.all',
            'value': '1',
            'mode': 5,
            'priority': 120
        }
    ],
    'flags': {
        'dae': {
            'specialDuration': ['isSave']
        },
        'mba-premades': {
            'effect': {
                'noAnimation': true
            }
        }
    }
};

const failEffectData = {
    'name': 'Save: Fail',
    'icon': 'modules/mba-premades/icons/generic/generic_debuff.webp',
    'description': "You automatically fail the next save you make.",
    'duration': {
        'turns': 1
    },
    'changes': [
        {
            'key': 'flags.midi-qol.fail.ability.save.all',
            'mode': 0,
            'value': 1,
            'priority': 20
        }
    ],
    'flags': {
        'dae': {
            'specialDuration': ["isSave"]
        },
        'mba-premades': {
            'effect': {
                'noAnimation': true
            }
        }
    }
};

function syntheticItemWorkflowOptions(targets, useSpellSlot, castLevel, consume) {
    return [
        {
            'showFullCard': false,
            'createWorkflow': true,
            'consumeResource': consume ?? false,
            'consumeRecharge': consume ?? false,
            'consumeQuantity': consume ?? false,
            'consumeUsage': consume ?? false,
            'consumeSpellSlot': useSpellSlot ?? false,
            'consumeSpellLevel': castLevel ?? false,
            'slotLevel': castLevel ?? false
        },
        {
            'targetUuids': targets,
            'configureDialog': false,
            'workflowOptions': {
                'autoRollDamage': 'always',
                'autoFastDamage': true,
                'autoRollAttack': true
            }
        }
    ];
}

function damageTypeMenu() {
    return Object.entries(CONFIG.DND5E.damageTypes).filter(i => i[0] != 'midi-none').map(j => [j[1].label, j[0]]);
}

const attacks = [
    'mwak',
    'rwak',
    'msak',
    'rsak'
];

const meleeAttacks = [
    'mwak',
    'msak'
];

const rangedAttacks = [
    'rwak',
    'rsak'
];

const weaponAttacks = [
    'mwak',
    'rwak'
];

const spellAttacks = [
    'msak',
    'rsak'
];

const yesNo = [
    ['Yes', true],
    ['No', false]
];

const okCancel = [
    {
        'label': 'Ok',
        'value': true
    },
    {
        'label': 'Cancel',
        'value': false
    },
];

const yesNoButton = [
    {
        'label': 'Yes',
        'value': true
    },
    {
        'label': 'No',
        'value': false
    },
];

const nonDamageTypes = [
    'healing',
    'temphp',
    'midi-none'
];

const spellsCantrips = [
    "Acid Splash",
    "Blade Ward",
    "Booming Blade",
    "Chill Touch",
    "Control Flames",
    "Create Bonfire",
    "Dancing Lights",
    "Druidcraft",
    "Eldritch Blast",
    "Fire Bolt",
    "Friends",
    "Frostbite",
    "Green-Flame Blade",
    "Guidance",
    "Gust",
    "Infestation",
    "Light",
    "Lightning Lure",
    "Mage Hand",
    "Magic Stone",
    "Mending",
    "Message",
    "Mind Sliver",
    "Minor Illusion",
    "Mold Earth",
    "Poison Spray",
    "Prestidigitation",
    "Primal Savagery",
    "Produce Flame",
    "Ray of Frost",
    "Resistance",
    "Sacred Flame",
    "Shape Water",
    "Shillelagh",
    "Shocking Grasp",
    "Spare the Dying",
    "Sword Burst",
    "Thaumaturgy",
    "Thorn Whip",
    "Thunderclap",
    "Toll the Dead",
    "True Strike",
    "Vicious Mockery",
    "Word of Radiance"
];

const spellsLevel1 = [
    "Absorb Elements",
    "Alarm",
    "Animal Friendship",
    "Armor of Agathys",
    "Arms of Hadar",
    "Bane",
    "Beast Bond",
    "Bless",
    "Burning Hands",
    "Catapult",
    "Cause Fear",
    "Ceremony",
    "Chaos Bolt",
    "Charm Person",
    "Chromatic Orb",
    "Color Spray",
    "Command",
    "Compelled Duel",
    "Comprehend Languages",
    "Create or Destroy Water",
    "Cure Wounds",
    "Detect Evil and Good",
    "Detect Magic",
    "Detect Poison and Disease",
    "Disguise Self",
    "Dissonant Whispers",
    "Divine Favor",
    "Earth Tremor",
    "Ensnaring Strike",
    "Entangle",
    "Expeditious Retreat",
    "Faerie Fire",
    "False Life",
    "Feather Fall",
    "Find Familiar",
    "Fog Cloud",
    "Frost Fingers",
    "Goodberry",
    "Grease",
    "Guiding Bolt",
    "Hail of Thorns",
    "Healing Word",
    "Hellish Rebuke",
    "Heroism",
    "Hex",
    "Hunter's Mark",
    "Ice Knife",
    "Identify",
    "Illusory Script",
    "Inflict Wounds",
    "Jump",
    "Longstrider",
    "Mage Armor",
    "Magic Missile",
    "Protection from Evil and Good",
    "Purify Food and Drink",
    "Ray of Sickness",
    "Sanctuary",
    "Searing Smite",
    "Shield",
    "Shield of Faith",
    "Silent Image",
    "Sleep",
    "Snare",
    "Speak with Animals",
    "Tasha's Caustic Brew",
    "Tasha's Hideous Laughter",
    "Tenser's Floating Disk",
    "Thunderous Smite",
    "Thunderwave",
    "Unseen Servant",
    "Witch Bolt",
    "Wrathful Smite",
    "Zephyr Strike"
];

const spellsLevel2 = [
    "Aganazzar's Scorcher",
    "Aid",
    "Alter Self",
    "Animal Messenger",
    "Arcane Lock",
    "Augury",
    "Barkskin",
    "Beast Sense",
    "Blindness/Deafness",
    "Blur",
    "Borrowed Knowledge",
    "Branding Smite",
    "Calm Emotions",
    "Cloud of Daggers",
    "Continual Flame",
    "Cordon of Arrows",
    "Crown of Madness",
    "Darkness",
    "Darkvision",
    "Detect Thoughts",
    "Dragon's Breath",
    "Dust Devil",
    "Earthbind",
    "Enhance Ability",
    "Enlarge/Reduce",
    "Enthrall",
    "Find Steed",
    "Find Traps",
    "Flame Blade",
    "Flaming Sphere",
    "Gentle Repose",
    "Gust of Wind",
    "Healing Spirit",
    "Heat Metal",
    "Hold Person",
    "Invisibility",
    "Kinetic Jaunt",
    "Knock",
    "Lesser Restoration",
    "Levitate",
    "Locate Animals or Plants",
    "Locate Object",
    "Magic Mouth",
    "Magic Weapon",
    "Maximilian's Earthen Grasp",
    "Melf's Acid Arrow",
    "Mind Spike",
    "Mirror Image",
    "Misty Step",
    "Moonbeam",
    "Nathair's Mischief",
    "Nystul's Magic Aura",
    "Pass without Trace",
    "Phantasmal Force",
    "Prayer of Healing",
    "Protection from Poison",
    "Pyrotechnics",
    "Ray of Enfeeblement",
    "Rime's Binding Ice",
    "Rope Trick",
    "Scorching Ray",
    "See Invisibility",
    "Shadow Blade",
    "Shatter",
    "Silence",
    "Skywrite",
    "Snilloc's Snowball Swarm",
    "Spider Climb",
    "Spike Growth",
    "Spiritual Weapon",
    "Spray of Cards",
    "Suggestion",
    "Summon Beast",
    "Tasha's Mind Whip",
    "Vortex Warp",
    "Warding Bond",
    "Warding Wind",
    "Web",
    "Wither and Bloom",
    "Zone of Truth"
];

const spellsLevel3 = [
    "Animate Dead",
    "Antagonize",
    "Ashardalon's Stride",
    "Aura of Vitality",
    "Beacon of Hope",
    "Bestow Curse",
    "Blindng Smite",
    "Blink",
    "Call Lightning",
    "Catnap",
    "Clairvoyance",
    "Conjure Animals",
    "Conjure Barrage",
    "Counterspell",
    "Create Food and Water",
    "Crusader's Mantle",
    "Daylight",
    "Dispel Magic",
    "Elemental Weapon",
    "Enemies Abound",
    "Erupting Earth",
    "Fear",
    "Feign Death",
    "Fireball",
    "Flame Arrows",
    "Fly",
    "Gaseous Form",
    "Glyph of Warding",
    "Haste",
    "Hunger of Hadar",
    "Hypnotic Pattern",
    "Intellect Fortress",
    "Leomund's Tiny Hut",
    "Life Transference",
    "Lightning Arrow",
    "Lightning Bolt",
    "Magic Circle",
    "Major Image",
    "Mass Healing Word",
    "Meld into Stone",
    "Melf's Minute Meteors",
    "Nondetection",
    "Phantom Steed",
    "Plant Growth",
    "Protection from Energy",
    "Remove Curse",
    "Revivify",
    "Sending",
    "Sleet Storm",
    "Slow",
    "Speak with Dead",
    "Speak with Plants",
    "Spirit Guardians",
    "Spirit Shroud",
    "Stinking Cloud",
    "Summon Fey",
    "Summon Lesser Demons",
    "Summon Shadowspawn",
    "Summon Undead",
    "Thunder Step",
    "Tidal Wave",
    "Tiny Servant",
    "Tongues",
    "Vampiric Touch",
    "Wall of Sand",
    "Wall of Water",
    "Water Breathing",
    "Water Walk",
    "Wind Wall"
];

const spellsLevel4 = [
    "Arcane Eye",
    "Aura of Life",
    "Aura of Purity",
    "Banishment",
    "Blight",
    "Charm Monster",
    "Compulsion",
    "Confusion",
    "Conjure Minor Elementals",
    "Conjure Woodland Beings",
    "Control Water",
    "Death Ward",
    "Dimension Door",
    "Divination",
    "Dominate Beast",
    "Elemental Bane",
    "Evard's Black Tentacles",
    "Fabricate",
    "Find Greater Steed",
    "Fire Shield",
    "Freedom of Movement",
    "Giant Insect",
    "Grasping Vine",
    "Greater Invisibility",
    "Guardian of Faith",
    "Guardian of Nature",
    "Hallucinatory Terrain",
    "Ice Storm",
    "Leomund's Secret Chest",
    "Locate Creature",
    "Mordenkainen's Faithful Hound",
    "Mordenkainen's Private Sanctum",
    "Otiluke's Resilient Sphere",
    "Phantasmal Killer",
    "Polymorph",
    "Raulothim's Psychic Lance",
    "Shadow of Moil",
    "Sickening Radiance",
    "Spirit of Death",
    "Staggering Smite",
    "Stone Shape",
    "Stoneskin",
    "Storm Sphere",
    "Summon Aberration",
    "Summon Construct",
    "Summon Elemental",
    "Summon Greater Demon",
    "Vitriolic Sphere",
    "Wall of Fire",
    "Watery Sphere",
];

const spellsLevel5 = [
    "Animate Objects",
    "Antilife Shell",
    "Awaken",
    "Banishing Smite",
    "Bigby's Hand",
    "Circle of Power",
    "Cloudkill",
    "Commune",
    "Commune with Nature",
    "Cone of Cold",
    "Conjure Elemental",
    "Conjure Volley",
    "Contact Other Plane",
    "Contagion",
    "Contol Winds",
    "Creation",
    "Danse Macabre",
    "Dawn",
    "Destructive Wave",
    "Dispel Evil and Good",
    "Dominate Person",
    "Dream",
    "Enervation",
    "Far Step",
    "Flame Strike",
    "Geas",
    "Greater Restoration",
    "Hallow",
    "Hold Monster",
    "Holy Weapon",
    "Immolation",
    "Infernal Calling",
    "Insect Plague",
    "Legend Lore",
    "Maelstrom",
    "Mass Cure Wounds",
    "Mislead",
    "Modify Memory",
    "Negative Energy Flood",
    "Passwall",
    "Planar Binding",
    "Raise Dead",
    "Rary's Telepathic Bond",
    "Reincarnate",
    "Scrying",
    "Seeming",
    "Skill Empowerment",
    "Steel Wind Strike",
    "Summon Celestial",
    "Summon Draconic Spirit",
    "Swift Quiver",
    "Synaptic Static",
    "Telekinesis",
    "Teleportation Circle",
    "Transmute Rock",
    "Tree Stride",
    "Wall of Force",
    "Wall of Light",
    "Wall of Stone",
    "Wrath of Nature"
];

const spellsLevel6 = [
    "Arcane Gate",
    "Blade Barrier",
    "Bones of the Earth",
    "Chain Lightning",
    "Circle of Death",
    "Conjure Fey",
    "Contingency",
    "Create Homunculus",
    "Create Undead",
    "Disintegrate",
    "Drawmij's Instant Summons",
    "Druid Grove",
    "Eyebite",
    "Find the Path",
    "Fizban's Platinum Shield",
    "Flesh to Stone",
    "Forbiddance",
    "Globe of Invulnerability",
    "Guards and Wards",
    "Harm",
    "Heal",
    "Heroes' Feast",
    "Investiture of Flame",
    "Investiture of Ice",
    "Investiture of Stone",
    "Investiture of Wind",
    "Magic Jar",
    "Mass Suggestion",
    "Mental Prison",
    "Move Earth",
    "Otiluke's Freezing Sphere",
    "Otto's Irresistible Dance",
    "Planar Ally",
    "Primodial Ward",
    "Programmed Illusion",
    "Scatter",
    "Soul Cage",
    "Summon Fiend",
    "Sunbeam",
    "Tasha's Otherworldly Guise",
    "Tenser's Transformation",
    "Transport via Plants",
    "True Seeing",
    "Wall of Ice",
    "Wall of Thorns",
    "Wind Walk",
    "Word of Recall"
];

const spellsLevel7 = [
    "Conjure Celestial",
    "Create Magen",
    "Crown of Stars",
    "Delayed Blast Fireball",
    "Divine Word",
    "Draconic Transformation",
    "Dream of Blue Veil",
    "Etherealness",
    "Finger of Death",
    "Fire Storm",
    "Forcecage",
    "Mirage Arcane",
    "Mordenkainen's Magnificent Mansion",
    "Mordenkainen's Sword",
    "Plane Shift",
    "Power Word Pain",
    "Prismatic Spray",
    "Project Image",
    "Regenerate",
    "Resurrection",
    "Reverse Gravity",
    "Sequester",
    "Simulacrum",
    "Symbol",
    "Teleport",
    "Temple of Gods",
    "Whirlwind",
];

const spellsLevel8 = [
    "Abi-Dalzim's Horrid Wilting",
    "Animal Shapes",
    "Antimagic Field",
    "Antipathy/Sympathy",
    "Clone",
    "Control Weather",
    "Demiplane",
    "Dominate Monster",
    "Earthquake",
    "Feeblemind",
    "Glibness",
    "Holy Aura",
    "Illusory Dragon",
    "Incendiary Cloud",
    "Maddening Darkness",
    "Maze",
    "Mighty Fortress",
    "Mind Blank",
    "Power Word Stun",
    "Sunburst",
    "Telepathy",
    "Tsunami",
];

const spellsLevel9 = [
    "Astral Projection",
    "Blade of Disaster",
    "Foresight",
    "Gate",
    "Imprisonment",
    "Invulnerability",
    "Mass Heal",
    "Mass Polymorph",
    "Meteor Swarm",
    "Power Word Heal",
    "Power Word Kill",
    "Prismatic Wall",
    "Psychic Scream",
    "Shapechange",
    "Storm of Vengeance",
    "Time Stop",
    "True Polymorph",
    "True Resurrection",
    "Weird",
    "Wish",
];

const weapons = [
    "Battleaxe",
    "Blowgun",
    "Club",
    "Dagger",
    "Dart",
    "Flail",
    "Glaive",
    "Greataxe",
    "Greatclub",
    "Greatsword",
    "Halberd",
    "Hand Crossbow",
    "Handaxe",
    "Heavy Crossbow",
    "Javelin",
    "Lance",
    "Light Crossbow",
    "Light Hammer",
    "Longbow",
    "Longsword",
    "Mace",
    "Maul",
    "Morningstar",
    "Net", //
    "Pike",
    "Quarterstaff",
    "Rapier",
    "Scimitar",
    "Shortbow",
    "Shortsword",
    "Sickle",
    "Sling",
    "Spear",
    "Staff", //
    "Trident",
    "War Pick",
    "Warhammer",
    "Whip",
    "Wooden Staff" //
];

const weaponsMelee = [
    "Battleaxe",
    "Club",
    "Dagger",
    "Flail",
    "Glaive",
    "Greataxe",
    "Greatclub",
    "Greatsword",
    "Halberd",
    "Handaxe",
    "Javelin",
    "Lance",
    "Light Hammer",
    "Longsword",
    "Mace",
    "Maul",
    "Morningstar",
    "Pike",
    "Quarterstaff",
    "Rapier",
    "Scimitar",
    "Shortsword",
    "Sickle",
    "Spear",
    "Staff", //?
    "Trident",
    "War Pick",
    "Warhammer",
    "Whip"
];

const weaponsRanged = [
    "Blowgun",
    "Dart",
    "Hand Crossbow",
    "Heavy Crossbow",
    "Light Crossbow",
    'Longbow',
    'Net', //?
    "Shortbow",
    "Sling",
];

const cleave = [
    "greataxe",
    "halberd"
];

const graze = [
    "glaive",
    "greatsword"
];

const nick = [
    "dagger",
    "lighthammer",
    "scimitar",
    "sickle"
];

const push = [
    "greatclub",
    "heavycrossbow",
    "pike",
    "warhammer"
];

const sap = [
    "flail",
    "longsword",
    "mace",
    "morningstar",
    "spear",
    "warpick"
];

const slow = [
    "club",
    "javelin",
    "lightcrossbow",
    "longbow",
    "musket", //?
    "sling",
    "whip",
];

const topple = [
    "battleaxe",
    "lance",
    "maul",
    "quarterstaff",
    "trident"
];

const vex = [
    "blowgun",
    "dart",
    "handcrossbow",
    "handaxe",
    "pistol", //?
    "rapier",
    "shortbow",
    "shortsword"
];

const weaponTypes = {
    'cleave': cleave,
    'graze': graze,
    'nick': nick,
    'push': push,
    'sap': sap,
    'slow': slow,
    'topple': topple,
    'vex': vex
}

export let constants = {
    'advantageEffectData': advantageEffectData,
    'attacks': attacks,
    'damageTypeMenu': damageTypeMenu,
    'disadvantageEffectData': disadvantageEffectData,
    'immunityEffectData': immunityEffectData,
    'failEffectData': failEffectData,
    'meleeAttacks': meleeAttacks,
    'nonDamageTypes': nonDamageTypes,
    'okCancel': okCancel,
    'rangedAttacks': rangedAttacks,
    'spellAttacks': spellAttacks,
    'spellsCantrips': spellsCantrips,
    'spellsLevel1': spellsLevel1,
    'spellsLevel2': spellsLevel2,
    'spellsLevel3': spellsLevel3,
    'spellsLevel4': spellsLevel4,
    'spellsLevel5': spellsLevel5,
    'spellsLevel6': spellsLevel6,
    'spellsLevel7': spellsLevel7,
    'spellsLevel8': spellsLevel8,
    'spellsLevel9': spellsLevel9,
    'syntheticItemWorkflowOptions': syntheticItemWorkflowOptions,
    'yesNo': yesNo,
    'yesNoButton': yesNoButton,
    'weapons': weapons,
    'weaponAttacks': weaponAttacks,
    'weaponsMelee': weaponsMelee,
    'weaponsRanged': weaponsRanged,
    'weaponTypes': weaponTypes,
};