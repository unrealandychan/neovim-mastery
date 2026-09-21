/**
 * Vim Adventures Level Definitions & Curriculum
 * 15 Grand Handcrafted Chapters mapped to the 30-Day Dojo Curriculum.
 * Users play both the 2D Adventure RPG and the 30-Day Buffer Dojo to achieve complete Neovim mastery!
 */

export const LEVELS = [
  // =========================================================================
  // CHAPTER 1: Shoreline of Motion [Dojo Days 1-2]
  // Mechanics: h, j, k, l orthogonal navigation on character paths
  // =========================================================================
  {
    id: 1,
    name: "Chapter 1: Shoreline of Motion",
    subtitle: "Master the Sacred Cardinal Motions: h, j, k, l [Dojo Days 1-2]",
    width: 28,
    height: 16,
    playerStart: { x: 3, y: 3 },
    initialAbilities: ['h', 'j', 'k', 'l'],
    map: [
      "############################",
      "#.~~~~~~~~~~~~~~~~~~~~~~~~.#",
      "#.###~~~~~~~~~~~~~~~~~~###.#",
      "#.#Welcome to Vim Realm#.#.#",
      "#.#..........j.........#.#.#",
      "#.#..........j.........#.#.#",
      "#.###........j.......###.#.#",
      "#.~~#........j.......#~~~#.#",
      "#.~~#..hhhh..j.......#~~~#.#",
      "#.~~#..h.....j.......#~~~#.#",
      "#.~~#..h..lllllllll..=====.#",
      "#.~~#..h..........l..#~~~#.#",
      "#.###..h..........l..###.#.#",
      "#.#....hhhhhhhhhhhh....#.#.#",
      "#.#....................#.#.#",
      "############################"
    ],
    npcs: [
      {
        id: 'bram',
        name: 'Master Bram',
        x: 4,
        y: 3,
        avatar: '🧙‍♂️',
        dialogue: [
          "Greetings, brave traveler! Welcome to the Realm of Vim Adventures.",
          "In this realm, the cursor is your body and keystrokes are your power.",
          "Use 'h' (left), 'j' (down), 'k' (up), and 'l' (right) to walk the paths.",
          "Head down the trail and speak with Sailor Jack near the lighthouse!"
        ]
      },
      {
        id: 'jack',
        name: 'Sailor Jack',
        x: 18,
        y: 10,
        avatar: '⚓',
        dialogue: [
          "Ahoy! Beyond this gate lies the Word Archipelago, where normal walking fails.",
          "You will need a special leap power to cross the great sea.",
          "I dropped the Bronze Key by the southern trail. Grab it to open my gate!"
        ]
      }
    ],
    keys: [
      { id: 'k1', x: 7, y: 13, keyType: 'bronzeKey', name: 'Bronze Key' }
    ],
    doors: [
      { id: 'd1', x: 21, y: 10, keyRequired: 'bronzeKey', orientation: 'vertical', label: 'Shore Gate' }
    ],
    chests: [
      {
        id: 'c1',
        x: 24,
        y: 10,
        rewardType: 'ability',
        rewardValue: 'w',
        label: "Unlocked 'w' (Word Forward Leap)!"
      }
    ],
    gems: [
      { id: 'g1', x: 13, y: 4, value: 10 },
      { id: 'g2', x: 13, y: 7, value: 10 },
      { id: 'g3', x: 18, y: 13, value: 10 }
    ],
    portals: [],
    obstacles: [],
    exit: { x: 25, y: 10, targetLevel: 2 },
    objective: "Follow the path, find the Bronze Key, unlock the gate, and open the chest!"
  },

  // =========================================================================
  // CHAPTER 2: The Word Archipelago [Dojo Day 3]
  // Mechanics: w, b, e, ge jumping across water between word islands
  // =========================================================================
  {
    id: 2,
    name: "Chapter 2: The Word Archipelago",
    subtitle: "Leap Across Chasms with w, b, e, ge [Dojo Day 3]",
    width: 32,
    height: 18,
    playerStart: { x: 2, y: 2 },
    initialAbilities: ['h', 'j', 'k', 'l', 'w'],
    map: [
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~START~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~Jump~~~Across~~~The~~~Water~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~Never~~~Fall~~~Into~~~Ocean~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~Use~~~Word~~~Leap~~~To~~~Win~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~Backtrack~~~With~~~Key~~~b~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~End~~~Of~~~Word~~~Is~~~e~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~Silver~~~Key~~~Lies~~~Ahead~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~Sanctuary~~~Gate~~~Awaits~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~Exit~~~Portal~~~Ready~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
    ],
    npcs: [
      {
        id: 'islander',
        name: 'Island Castaway',
        x: 9,
        y: 2,
        avatar: '🏝️',
        dialogue: [
          "Look at the water! Walking with 'l' or 'j' into the ocean will stop you in your tracks.",
          "Press 'w' to jump across the water straight to the start of the next word!",
          "And when you find 'b' and 'e', you can jump backward or land on the end of words!"
        ]
      },
      {
        id: 'guardian',
        name: 'Archipelago Spirit',
        x: 13,
        y: 10,
        avatar: '🧞',
        dialogue: [
          "The 'e' key lands on the END of words, while 'w' lands on the START.",
          "Use both to reach the secluded treasure islands!"
        ]
      }
    ],
    keys: [
      { id: 'k2', x: 2, y: 8, keyType: 'silverKey', name: 'Silver Key' }
    ],
    doors: [
      { id: 'd2', x: 14, y: 14, keyRequired: 'silverKey', orientation: 'horizontal', label: 'Archipelago Gate' }
    ],
    chests: [
      {
        id: 'c2',
        x: 22,
        y: 6,
        rewardType: 'ability',
        rewardValue: 'e',
        label: "Unlocked 'e' (Forward to End of Word)!"
      },
      {
        id: 'c3',
        x: 21,
        y: 8,
        rewardType: 'ability',
        rewardValue: 'b',
        label: "Unlocked 'b' & 'ge' (Backward Word Jumps)!"
      }
    ],
    gems: [
      { id: 'g4', x: 18, y: 2, value: 20 },
      { id: 'g5', x: 24, y: 2, value: 20 },
      { id: 'g6', x: 10, y: 4, value: 20 },
      { id: 'g7', x: 17, y: 4, value: 20 },
      { id: 'g8', x: 14, y: 8, value: 20 }
    ],
    portals: [],
    obstacles: [],
    exit: { x: 10, y: 16, targetLevel: 3 },
    objective: "Leap forward to unlock 'e' and 'b', backtrack with 'b' to seize the Silver Key, then unlock the gate!"
  },

  // =========================================================================
  // CHAPTER 3: The Line Canyon [Dojo Day 3]
  // Mechanics: 0, $, ^ instant line boundary jumps across canyon ledges
  // =========================================================================
  {
    id: 3,
    name: "Chapter 3: The Line Canyon",
    subtitle: "Command Line Boundaries with 0, $, and ^ [Dojo Day 3]",
    width: 36,
    height: 12,
    playerStart: { x: 2, y: 2 },
    initialAbilities: ['h', 'j', 'k', 'l', 'w', 'b', 'e', 'ge'],
    map: [
      "####################################",
      "# Cliff Base: Warden's Perch ~~~~~ #",
      "# ..Cliff_Warden~~~~~~~~~~~~~~~~~~ #",
      "#.##################################",
      "#...Ledge_Alpha:==================$#",
      "#.##################################",
      "#...Ledge_Beta:=================Key#",
      "#.##################################",
      "#...Cliff_Sanctuary:====Gate====Exit",
      "#.##################################",
      "#..................................#",
      "####################################"
    ],
    npcs: [
      {
        id: 'warden',
        name: 'Cliff Warden',
        x: 6,
        y: 2,
        avatar: '🧗',
        dialogue: [
          "Greetings, traveler! These suspension bridges span bottomless chasms.",
          "Never crawl 30 steps with 'l' or 'h' across a long ledge!",
          "Press '$' to zip straight to the far end of the line in one instant.",
          "Press '0' or '^' to snap back to the cliff base stairway instantly!"
        ]
      }
    ],
    keys: [
      { id: 'k3', x: 34, y: 6, keyType: 'goldKey', name: 'Gold Key' }
    ],
    doors: [
      { id: 'd3', x: 24, y: 8, keyRequired: 'goldKey', orientation: 'vertical', label: 'Cliff Gate' }
    ],
    chests: [
      {
        id: 'c4',
        x: 34,
        y: 4,
        rewardType: 'ability',
        rewardValue: '$',
        label: "Unlocked '$' & '0' (Line Boundaries)!"
      }
    ],
    gems: [
      { id: 'g9', x: 18, y: 4, value: 30 },
      { id: 'g10', x: 18, y: 6, value: 30 },
      { id: 'g11', x: 18, y: 8, value: 30 }
    ],
    portals: [],
    obstacles: [],
    exit: { x: 35, y: 8, targetLevel: 4 },
    objective: "Use '$' to zip across ledges for the chest and Gold Key, snap back with '0', and unlock the gate!"
  },

  // =========================================================================
  // CHAPTER 4: The Caverns of Till & Reverse Seek [Dojo Day 5]
  // Mechanics: Inline seeking with f, t, F, T, ;, and ,
  // =========================================================================
  {
    id: 4,
    name: "Chapter 4: Caverns of Till & Reverse Seek",
    subtitle: "Precision Inline Seeking with f, t, F, T, ;, and , [Dojo Day 5]",
    width: 34,
    height: 12,
    playerStart: { x: 2, y: 2 },
    initialAbilities: ['h', 'j', 'k', 'l', 'w', 'b', 'e', 'ge', '0', '$', '^'],
    map: [
      "##################################",
      "# Magma Caverns: Seekers Vault   #",
      "# ..Hermit........c1.............#",
      "#.################################",
      "#...a~~~b~~~c~~~d~~~e~~~c2.......#",
      "#.################################",
      "#...bridge===c3~~~~~~magma_pit~~~#",
      "#.################################",
      "#...s~~~t~~~o~~~n~~~e~~~Key......#",
      "#.################################",
      "#...Cavern_Gate=============Exit.#",
      "##################################"
    ],
    npcs: [
      {
        id: 'hermit',
        name: 'Cavern Hermit',
        x: 4,
        y: 2,
        avatar: '🧔',
        dialogue: [
          "Beware the magma pits! Walking with normal steps will burn your feet.",
          "Use 'f{char}' to leap forward across stepping stones over the lava.",
          "Use 't~' (Till) to stop safely 1 tile before a hazard pit!",
          "Use 'F{char}' and ',' to reverse your search and leap backward to safety."
        ]
      }
    ],
    keys: [
      { id: 'k4_bronze', x: 24, y: 8, keyType: 'bronzeKey', name: 'Bronze Key' }
    ],
    doors: [
      { id: 'd4_cavern', x: 15, y: 10, keyRequired: 'bronzeKey', orientation: 'vertical', label: 'Cavern Gate' }
    ],
    chests: [
      {
        id: 'c4_find',
        x: 18,
        y: 2,
        rewardType: 'ability',
        rewardValue: 'f',
        label: "Unlocked 'f' & ';' (Find Character Forward)!"
      },
      {
        id: 'c4_till',
        x: 24,
        y: 4,
        rewardType: 'ability',
        rewardValue: 't',
        label: "Unlocked 't' & 'T' (Till Before Target)!"
      },
      {
        id: 'c4_rev',
        x: 12,
        y: 6,
        rewardType: 'ability',
        rewardValue: 'F',
        label: "Unlocked 'F' & ',' (Reverse Inline Find)!"
      }
    ],
    gems: [
      { id: 'g4_1', x: 12, y: 4, value: 30 },
      { id: 'g4_2', x: 12, y: 8, value: 30 },
      { id: 'g4_3', x: 20, y: 8, value: 30 }
    ],
    portals: [],
    obstacles: [],
    exit: { x: 28, y: 10, targetLevel: 5 },
    objective: "Master 'f' across magma stepping stones, use 't' before hazards, grab the Bronze Key, and advance!"
  },

  // =========================================================================
  // CHAPTER 5: The Tower of Vertical Ascents [Dojo Day 6]
  // Mechanics: gg (top of buffer), G (bottom of buffer), and line counts
  // =========================================================================
  {
    id: 5,
    name: "Chapter 5: Tower of Vertical Ascents",
    subtitle: "Command Buffer Boundaries with gg, G, and Line Jumps [Dojo Day 6]",
    width: 32,
    height: 20,
    playerStart: { x: 3, y: 17 },
    initialAbilities: ['h', 'j', 'k', 'l', 'w', 'b', 'e', 'ge', '0', '$', '^', 'f', 'F', 't', 'T', ';', ','],
    map: [
      "################################",
      "# Spire Battlement Top Floor   #",
      "# ============================ #",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#",
      "# Balcony 4: Air currents blow #",
      "# ============================ #",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#",
      "# Balcony 3: High observatory  #",
      "# ============================ #",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#",
      "# Balcony 2: Library archives  #",
      "# ============================ #",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#",
      "# Balcony 1: Armory chambers   #",
      "# ============================ #",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#",
      "# Dungeon Vault: Ground Floor  #",
      "# ============================ #",
      "# Golden Key lies in dungeon   #",
      "################################"
    ],
    npcs: [
      {
        id: 'abbot',
        name: 'High Abbot',
        x: 5,
        y: 17,
        avatar: '🧙‍♂️',
        dialogue: [
          "Welcome to the Tower of Vertical Ascents! 🗼",
          "Climbing twenty flights of stairs one by one is for mortals.",
          "Vim monks press 'gg' to fly directly to the top spire in a single instant! And 'G' plunges you back to the dungeon floor.",
          "PATH TO NEXT STAGE (CHAPTER 6):",
          "1. Open the ability chest ahead at (15, 17) to unlock 'gg' and 'G'.",
          "2. Retrieve the Tower Gold Key at the far right of this dungeon floor (26, 17).",
          "3. Type 'gg' to fly directly up to the Spire Battlement at the top of the tower!",
          "4. Unlock the Spire Gate at (24, 2) with your Gold Key to reach the Chapter 6 exit stairs at (28, 2)!",
          "Tip: You can also use line counts like '8G' to land on balconies and claim bonus gems!"
        ],
        dialogueFn(state) {
          const hasGG = state.player?.hasAbility('gg');
          const hasKey = (state.inventory?.goldKey || 0) > 0;
          const door = state.entities?.doors?.find(d => d.id === 'd5_spire');
          const isDoorOpen = door?.isOpen;

          if (isDoorOpen) {
            return [
              "The Spire Gate is unlocked! 🌟",
              "Walk right to (28, 2) and step through the glowing staircase portal to enter Chapter 6!"
            ];
          }
          if (hasKey && hasGG) {
            return [
              "You have both 'gg' and the Tower Gold Key! 🗝️",
              "Press 'gg' now to fly straight up to the Spire Battlement (row 2).",
              "Then walk right to unlock the Spire Gate at (24, 2) and exit to Chapter 6!"
            ];
          }
          if (hasGG && !hasKey) {
            return [
              "You have unlocked 'gg' and 'G'!",
              "Next step: Head to the far right of this dungeon floor to grab the Tower Gold Key at (26, 17)!",
              "Once you have the key, press 'gg' to soar to the Spire Battlement."
            ];
          }
          if (!hasGG && hasKey) {
            return [
              "You found the Tower Gold Key! 🗝️",
              "Now open the chest at (15, 17) to unlock 'gg' & 'G' so you can fly up to the top spire!"
            ];
          }
          return [
            "Welcome to the Tower of Vertical Ascents! 🗼",
            "Climbing twenty flights of stairs one by one is for mortals.",
            "Vim monks press 'gg' to fly directly to the top spire in a single instant! And 'G' plunges you back to the dungeon floor.",
            "PATH TO NEXT STAGE (CHAPTER 6):",
            "1. Open the ability chest ahead at (15, 17) to unlock 'gg' and 'G'.",
            "2. Retrieve the Tower Gold Key at the far right of this dungeon floor (26, 17).",
            "3. Type 'gg' to fly directly up to the Spire Battlement at the top of the tower!",
            "4. Unlock the Spire Gate at (24, 2) with your Gold Key to reach the Chapter 6 exit stairs at (28, 2)!",
            "Tip: You can also use line counts like '8G' to land on balconies and claim bonus gems!"
          ];
        }
      }
    ],
    keys: [
      { id: 'k5_gold', x: 26, y: 17, keyType: 'goldKey', name: 'Tower Gold Key' }
    ],
    doors: [
      { id: 'd5_spire', x: 24, y: 2, keyRequired: 'goldKey', orientation: 'vertical', label: 'Spire Gate' }
    ],
    chests: [
      {
        id: 'c5_vert',
        x: 15,
        y: 17,
        rewardType: 'ability',
        rewardValue: 'gg',
        label: "Unlocked 'gg' & 'G' (Vertical Buffer Jumps)!"
      }
    ],
    gems: [
      { id: 'g5_1', x: 20, y: 5, value: 40 },
      { id: 'g5_2', x: 20, y: 8, value: 40 },
      { id: 'g5_3', x: 20, y: 11, value: 40 }
    ],
    portals: [],
    obstacles: [],
    exit: { x: 28, y: 2, targetLevel: 6 },
    objective: "1. Open chest (15, 17) for 'gg'/'G' ➜ 2. Grab Gold Key (26, 17) ➜ 3. Press 'gg' to fly to Spire Gate (24, 2) for Chapter 6 exit!"
  },

  // =========================================================================
  // CHAPTER 6: The Forest of Empty Paragraphs [Dojo Day 6]
  // Mechanics: { and } jumping across empty lines / forest clearings
  // =========================================================================
  {
    id: 6,
    name: "Chapter 6: Forest of Empty Paragraphs",
    subtitle: "Leap Across Forest Glades with { and } [Dojo Day 6]",
    width: 34,
    height: 20,
    playerStart: { x: 2, y: 2 },
    initialAbilities: ['h', 'j', 'k', 'l', 'w', 'b', 'e', 'ge', '0', '$', '^', 'f', 'F', 't', 'T', ';', ',', 'gg', 'G'],
    map: [
      "##################################",
      "# Glade 1: Sunlit canopy glade   #",
      "# ============================== #",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#",
      "# Glade 2: Ancient oak grove     #",
      "# ============================== #",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#",
      "# Glade 3: Whispering pines      #",
      "# ============================== #",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#",
      "# Glade 4: Silver Key shrine     #",
      "# ============================== #",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#",
      "# Glade 5: Sacred forest exit    #",
      "# ============================== #",
      "##################################"
    ],
    npcs: [
      {
        id: 'robin',
        name: 'Ranger Robin',
        x: 10,
        y: 2,
        avatar: '🏹',
        dialogue: [
          "The undergrowth between glades is too thick for normal walking.",
          "In Vim, code functions are separated by empty blank lines.",
          "Press '}' to leap downward across the clearing to the next glade, and '{' to leap back!"
        ]
      }
    ],
    keys: [
      { id: 'k6_silver', x: 28, y: 13, keyType: 'silverKey', name: 'Silver Key' }
    ],
    doors: [
      { id: 'd6_forest', x: 22, y: 18, keyRequired: 'silverKey', orientation: 'vertical', label: 'Forest Gate' }
    ],
    chests: [
      {
        id: 'c6_para',
        x: 25,
        y: 2,
        rewardType: 'ability',
        rewardValue: '{',
        label: "Unlocked '{' & '}' (Paragraph Leaps)!"
      }
    ],
    gems: [
      { id: 'g6_1', x: 16, y: 5, value: 40 },
      { id: 'g6_2', x: 16, y: 9, value: 40 },
      { id: 'g6_3', x: 16, y: 13, value: 40 }
    ],
    portals: [],
    obstacles: [],
    exit: { x: 28, y: 18, targetLevel: 7 },
    objective: "Unlock '{' and '}', leap down to Glade 4 for the Silver Key, then unlock the Forest Gate!"
  },

  // =========================================================================
  // CHAPTER 7: Crypt of Matching Brackets [Dojo Day 10]
  // Mechanics: % bracket matching jumps between (, ), [, ], {, }
  // =========================================================================
  {
    id: 7,
    name: "Chapter 7: Crypt of Matching Brackets",
    subtitle: "Warp Between Code Chasms with % [Dojo Day 10]",
    width: 32,
    height: 18,
    playerStart: { x: 3, y: 3 },
    initialAbilities: ['h', 'j', 'k', 'l', 'w', 'b', 'e', 'ge', '0', '$', '^', 'f', 'F', 't', 'T', ';', ',', 'gg', 'G', '{', '}'],
    map: [
      "################################",
      "# ( Chamber Alpha ) ~~~~~~~~~~ #",
      "# ................. ~~~~~~~~~~ #",
      "# ( ............. ) ~~~~~~~~~~ #",
      "################################",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#",
      "# [ Chamber Beta  ] ~~~~~~~~~~ #",
      "# ................. ~~~~~~~~~~ #",
      "# [ ............. ] ~~~~~~~~~~ #",
      "################################",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#",
      "# { Chamber Gamma } ~~~~~~~~~~ #",
      "# ................. ~~~~~~~~~~ #",
      "# { ............. } ~~~~~~~~~~ #",
      "################################",
      "#..Skull Key Altar Awaits Exit.#",
      "#..............................#",
      "################################"
    ],
    npcs: [
      {
        id: 'monk',
        name: 'Bracket Monk',
        x: 8,
        y: 3,
        avatar: '📿',
        dialogue: [
          "The chambers are sealed by solid granite and chasms. Walking cannot cross.",
          "Open the chest here in Chamber Alpha to unlock the power of '%'!",
          "Stand upon any bracket '(', ')', '[', ']', '{', or '}' and press '%'!",
          "The power of '%' will instantly transport you to its matching partner across the void!"
        ]
      }
    ],
    keys: [
      { id: 'k7_skull', x: 16, y: 16, keyType: 'skullKey', name: 'Skull Key' }
    ],
    doors: [
      { id: 'd7_crypt', x: 24, y: 16, keyRequired: 'skullKey', orientation: 'vertical', label: 'Crypt Seal' }
    ],
    chests: [
      {
        id: 'c7_bracket',
        x: 14,
        y: 3,
        rewardType: 'ability',
        rewardValue: '%',
        label: "Unlocked '%' (Matching Bracket Warp)!"
      }
    ],
    gems: [
      { id: 'g7_1', x: 5, y: 7, value: 50 },
      { id: 'g7_2', x: 14, y: 7, value: 50 },
      { id: 'g7_3', x: 5, y: 12, value: 50 }
    ],
    portals: [
      { id: 'p1', x: 2, y: 3, targetX: 18, targetY: 3, char: '(' },
      { id: 'p2', x: 18, y: 3, targetX: 2, targetY: 8, char: ')' },
      { id: 'p3', x: 2, y: 8, targetX: 18, targetY: 8, char: '[' },
      { id: 'p4', x: 18, y: 8, targetX: 2, targetY: 13, char: ']' },
      { id: 'p5', x: 2, y: 13, targetX: 18, targetY: 13, char: '{' },
      { id: 'p6', x: 18, y: 13, targetX: 4, targetY: 16, char: '}' }
    ],
    obstacles: [],
    exit: { x: 28, y: 16, targetLevel: 8 },
    objective: "Unlock '%' in Chamber Alpha, warp through Beta and Gamma to the Altar, and claim the Skull Key!"
  },

  // =========================================================================
  // CHAPTER 8: The Labyrinth of Precision Counts [Dojo Day 2]
  // Mechanics: Count grammar (3w, 5j, 18h, 4j, 10h) across water bridges
  // =========================================================================
  {
    id: 8,
    name: "Chapter 8: Labyrinth of Precision Counts",
    subtitle: "Precision Leaps with Counts: 3w, 5j, 18h [Dojo Day 2]",
    width: 34,
    height: 13,
    playerStart: { x: 2, y: 1 },
    initialAbilities: ['h', 'j', 'k', 'l', 'w', 'b', 'e', 'ge', '0', '$', '^', 'f', 'F', 't', 'T', ';', ',', 'gg', 'G', '{', '}', '%'],
    map: [
      "##################################",
      "# START~~~~Island1~~~~Island2~~~.#",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~..#",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~..#",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~..#",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~..#",
      "#~~~~~~~~~~~~Key===============..#",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~..#",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~..#",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~..#",
      "#~~~~~~~~~~~~Exit====Gate======..#",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#",
      "##################################"
    ],
    npcs: [
      {
        id: 'mathius',
        name: 'Count Mathius',
        x: 4,
        y: 1,
        avatar: '🧮',
        dialogue: [
          "In Vim, numbers give commands their true multiplied power!",
          "Type '3w' to leap across the three islands to the far tower.",
          "Use '5j' to descend the vertical bridge, then '18h' to reach the Key!",
          "Precision counts save time and protect you from falling into the sea."
        ]
      }
    ],
    keys: [
      { id: 'k8_bronze', x: 13, y: 6, keyType: 'bronzeKey', name: 'Bronze Key' }
    ],
    doors: [
      { id: 'd8_gate', x: 21, y: 10, keyRequired: 'bronzeKey', orientation: 'vertical', label: 'Labyrinth Gate' }
    ],
    chests: [
      {
        id: 'c8_gems',
        x: 28,
        y: 6,
        rewardType: 'gems',
        rewardValue: 100,
        label: "Found 100 Bonus Gems for Precision!"
      }
    ],
    gems: [
      { id: 'g8_1', x: 11, y: 1, value: 50 },
      { id: 'g8_2', x: 22, y: 1, value: 50 },
      { id: 'g8_3', x: 31, y: 3, value: 50 }
    ],
    portals: [],
    obstacles: [],
    exit: { x: 13, y: 10, targetLevel: 9 },
    objective: "Use counts like '3w', '5j', '18h' to navigate bridges, claim the Bronze Key, and advance!"
  },

  // =========================================================================
  // CHAPTER 9: The Pruning Grounds of 'x' [Dojo Days 2 & 4]
  // Mechanics: Character deletion / weed clearing with x and counts (3x)
  // =========================================================================
  {
    id: 9,
    name: "Chapter 9: The Pruning Grounds of 'x'",
    subtitle: "Slice Glitches, Bugs, and Weeds with x and 3x [Dojo Days 2 & 4]",
    width: 32,
    height: 14,
    playerStart: { x: 2, y: 2 },
    initialAbilities: ['h', 'j', 'k', 'l', 'w', 'b', 'e', 'ge', '0', '$', '^', 'f', 'F', 't', 'T', ';', ',', 'gg', 'G', '{', '}', '%'],
    map: [
      "################################",
      "# Gardener Pete's Hedge Maze   #",
      "# .Pete.........Chest..........#",
      "#.##############################",
      "#...Corridor_A....x............#",
      "##############################.#",
      "#...Corridor_B....xxx..........#",
      "#.##############################",
      "#...Key...x...Corridor_C.......#",
      "##############################.#",
      "#...Pruning_Gate==========Exit.#",
      "# ============================ #",
      "#..............................#",
      "################################"
    ],
    npcs: [
      {
        id: 'pete',
        name: 'Gardener Pete',
        x: 4,
        y: 2,
        avatar: '🧑‍🌾',
        dialogue: [
          "Glitch weeds 'x' have choked my entire hedgerow maze!",
          "Stand facing a weed and press 'x' to slice it away into a walkable path.",
          "For clusters of weeds like 'xxx', type '3x' to prune them all at once!",
          "Prune the corridors, claim my Ruby Key, and unlock the garden gate."
        ]
      }
    ],
    keys: [
      { id: 'k9_ruby', x: 5, y: 8, keyType: 'rubyKey', name: 'Ruby Key' }
    ],
    doors: [
      { id: 'd9_gate', x: 20, y: 10, keyRequired: 'rubyKey', orientation: 'vertical', label: 'Pruning Gate' }
    ],
    chests: [
      {
        id: 'c9_x',
        x: 18,
        y: 2,
        rewardType: 'ability',
        rewardValue: 'x',
        label: "Unlocked 'x' (Cut Character / Obstacle)!"
      }
    ],
    gems: [
      { id: 'g9_1', x: 10, y: 4, value: 50 },
      { id: 'g9_2', x: 10, y: 6, value: 50 },
      { id: 'g9_3', x: 20, y: 8, value: 50 }
    ],
    portals: [],
    obstacles: [
      { id: 'obs9_1', x: 18, y: 4, char: 'x', type: 'weed' },
      { id: 'obs9_2', x: 18, y: 6, char: 'x', type: 'weed' },
      { id: 'obs9_3', x: 19, y: 6, char: 'x', type: 'weed' },
      { id: 'obs9_4', x: 20, y: 6, char: 'x', type: 'weed' },
      { id: 'obs9_5', x: 10, y: 8, char: 'x', type: 'weed' }
    ],
    exit: { x: 26, y: 10, targetLevel: 10 },
    objective: "Unlock 'x', prune single and clustered weeds with 'x' and '3x', grab Ruby Key, and exit!"
  },

  // =========================================================================
  // CHAPTER 10: The Masons of Replacement ('r') [Dojo Days 4 & 14]
  // Mechanics: Character replacement with r{char} to repair bridge tiles
  // =========================================================================
  {
    id: 10,
    name: "Chapter 10: Masons of Replacement ('r')",
    subtitle: "Restore Broken Bridges with r= [Dojo Days 4 & 14]",
    width: 34,
    height: 12,
    playerStart: { x: 2, y: 2 },
    initialAbilities: ['h', 'j', 'k', 'l', 'w', 'b', 'e', 'ge', '0', '$', '^', 'f', 'F', 't', 'T', ';', ',', 'gg', 'G', '{', '}', '%', 'x'],
    map: [
      "##################################",
      "# West Bank      ~~~   East Bank #",
      "# .Bob..Chest... ~~~ ........... #",
      "# .............. ~~~ ........... #",
      "# .............. ~~~ ........... #",
      "# .............. ~~~ ........... #",
      "# ===Bridge=====~~======Key===== #",
      "# .............. ~~~ ........... #",
      "# .............. ~~~ ........... #",
      "# .............. ~~~ Mason_GateE #",
      "# ============== ~~~ =========== #",
      "##################################"
    ],
    npcs: [
      {
        id: 'bob',
        name: 'Mason Bob',
        x: 4,
        y: 2,
        avatar: '👷',
        dialogue: [
          "A raging river cuts our workshop in two! The bridge collapsed into water '~'!",
          "Open the chest at (10, 2) to unlock the mason's tool 'r'.",
          "Face each water gap and type 'r=' to replace the rushing water with solid bridge '=}.",
          "Cross the repaired bridge, seize the Emerald Key, and open the Mason Gate!"
        ]
      }
    ],
    keys: [
      { id: 'k10_emerald', x: 25, y: 6, keyType: 'emeraldKey', name: 'Emerald Key' }
    ],
    doors: [
      { id: 'd10_mason', x: 28, y: 9, keyRequired: 'emeraldKey', orientation: 'vertical', label: 'Mason Gate' }
    ],
    chests: [
      {
        id: 'c10_r',
        x: 10,
        y: 2,
        rewardType: 'ability',
        rewardValue: 'r',
        label: "Unlocked 'r' (Replace Character)!"
      }
    ],
    gems: [
      { id: 'g10_1', x: 8, y: 6, value: 60 },
      { id: 'g10_2', x: 20, y: 6, value: 60 },
      { id: 'g10_3', x: 28, y: 6, value: 60 }
    ],
    portals: [],
    obstacles: [],
    exit: { x: 31, y: 9, targetLevel: 11 },
    objective: "Unlock 'r', use 'r=' to repair both bridge gaps, grab the Emerald Key, and open the gate!"
  },

  // =========================================================================
  // CHAPTER 11: The Halls of Undo & Reversal ('u') [Dojo Day 12]
  // Mechanics: Undo tree, rewinding moves and state with 'u'
  // =========================================================================
  {
    id: 11,
    name: "Chapter 11: Halls of Undo & Reversal",
    subtitle: "Manipulate Time and Reverse Traps with u [Dojo Day 12]",
    width: 32,
    height: 15,
    playerStart: { x: 2, y: 2 },
    initialAbilities: ['h', 'j', 'k', 'l', 'w', 'b', 'e', 'ge', '0', '$', '^', 'f', 'F', 't', 'T', ';', ',', 'gg', 'G', '{', '}', '%', 'x', 'r', 'u'],
    map: [
      "################################",
      "# Chrono Chamber of Time Loops #",
      "# .Chronos.....................#",
      "#.##############################",
      "#...Trap_Pit: Dead_End_Fault...#",
      "#.##############################",
      "#..............................#",
      "#.##############################",
      "#...Silver_Key_Altar_Vault:==K.#",
      "#.##############################",
      "#..............................#",
      "#.##############################",
      "#...Chrono_Gate===========Exit.#",
      "# ============================ #",
      "################################"
    ],
    npcs: [
      {
        id: 'chronos',
        name: 'Chronos the Sage',
        x: 4,
        y: 2,
        avatar: '⏳',
        dialogue: [
          "Beware the temporal pitfalls! The upper vault is a deceptive dead-end trap.",
          "In Vim, the 'u' key is your eternal undo spell!",
          "Make a misstep into a dead end? Press 'u' repeatedly to rewind your path and time itself.",
          "Retrieve the Silver Key from the middle vault and unlock the Chrono Gate!"
        ]
      }
    ],
    keys: [
      { id: 'k11_silver', x: 29, y: 8, keyType: 'silverKey', name: 'Silver Key' }
    ],
    doors: [
      { id: 'd11_chrono', x: 20, y: 12, keyRequired: 'silverKey', orientation: 'vertical', label: 'Chrono Gate' }
    ],
    chests: [
      {
        id: 'c11_gems',
        x: 22,
        y: 8,
        rewardType: 'gems',
        rewardValue: 120,
        label: "Discovered 120 Timeless Gems!"
      }
    ],
    gems: [
      { id: 'g11_1', x: 12, y: 4, value: 60 },
      { id: 'g11_2', x: 20, y: 4, value: 60 },
      { id: 'g11_3', x: 12, y: 8, value: 60 }
    ],
    portals: [],
    obstacles: [],
    exit: { x: 29, y: 12, targetLevel: 12 },
    objective: "Navigate the corridors, use 'u' to rewind trap steps, claim the Silver Key, and unlock the Chrono Gate!"
  },

  // =========================================================================
  // CHAPTER 12: Chamber of Case Inversion ('~') [Dojo Days 13 & 27]
  // Mechanics: Toggle switch polarity with ~ (invert lower to UPPER)
  // =========================================================================
  {
    id: 12,
    name: "Chapter 12: Chamber of Case Inversion ('~')",
    subtitle: "Toggle Binary Switches and Gates with ~ [Dojo Days 13 & 27]",
    width: 34,
    height: 14,
    playerStart: { x: 2, y: 2 },
    initialAbilities: ['h', 'j', 'k', 'l', 'w', 'b', 'e', 'ge', '0', '$', '^', 'f', 'F', 't', 'T', ';', ',', 'gg', 'G', '{', '}', '%', 'x', 'r', 'u'],
    map: [
      "##################################",
      "# Sanctuary of Polarity Crystals #",
      "# .Switcher.....Chest............#",
      "#.################################",
      "#...Switch_Alpha: [o] =====Gate1.#",
      "################################.#",
      "#...Switch_Beta:  [s] =====Gate2.#",
      "################################.#",
      "#...Gold_Key_Vault:==============#",
      "################################.#",
      "#...Polarity_Gate===========Exit.#",
      "# ============================== #",
      "#................................#",
      "##################################"
    ],
    npcs: [
      {
        id: 'switcher',
        name: 'Mystic Switcher',
        x: 4,
        y: 2,
        avatar: '🔮',
        dialogue: [
          "Behold the ancient polarity mechanisms! Lowercase letters like 'o' and 's' are dormant.",
          "Open the chest at (18, 2) to unlock the '~' (tilde) case inversion power.",
          "Stand facing switch 'o' and press '~' to flip it to uppercase 'O' and open Gate 1!",
          "Next, face switch 's' and press '~' to flip it to 'S' to lower Gate 2 and claim the Gold Key!"
        ]
      }
    ],
    keys: [
      { id: 'k12_gold', x: 20, y: 8, keyType: 'goldKey', name: 'Gold Key' }
    ],
    doors: [
      { id: 'd12_switch', x: 28, y: 4, keyRequired: 'switch', orientation: 'vertical', label: 'Switch Gate 1' },
      { id: 'd12_drawbridge', x: 28, y: 6, keyRequired: 'switch', orientation: 'vertical', label: 'Switch Gate 2' },
      { id: 'd12_polarity', x: 20, y: 10, keyRequired: 'goldKey', orientation: 'vertical', label: 'Polarity Gate' }
    ],
    chests: [
      {
        id: 'c12_tilde',
        x: 18,
        y: 2,
        rewardType: 'ability',
        rewardValue: '~',
        label: "Unlocked '~' (Toggle Case)!"
      }
    ],
    gems: [
      { id: 'g12_1', x: 10, y: 4, value: 70 },
      { id: 'g12_2', x: 10, y: 6, value: 70 },
      { id: 'g12_3', x: 10, y: 8, value: 70 }
    ],
    portals: [],
    obstacles: [],
    exit: { x: 28, y: 10, targetLevel: 13 },
    objective: "Unlock '~', flip switch 'o'->'O' and 's'->'S' to unlock both gates, grab Gold Key, and exit!"
  },

  // =========================================================================
  // CHAPTER 13: Valley of Golden Beacons ('*') [Dojo Days 18 & 23]
  // Mechanics: Search word under cursor with * to warp across beacons
  // =========================================================================
  {
    id: 13,
    name: "Chapter 13: Valley of Golden Beacons ('*')",
    subtitle: "Search and Warp to Matching Tokens with * [Dojo Days 18 & 23]",
    width: 34,
    height: 17,
    playerStart: { x: 2, y: 1 },
    initialAbilities: ['h', 'j', 'k', 'l', 'w', 'b', 'e', 'ge', '0', '$', '^', 'f', 'F', 't', 'T', ';', ',', 'gg', 'G', '{', '}', '%', 'x', 'r', 'u', '~'],
    map: [
      "##################################",
      "# Island_One:...Chest...SOLAR... #",
      "# ============================== #",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#",
      "#...SOLAR=========ASTRAL.........#",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#",
      "#...ASTRAL========LUNAR..........#",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#",
      "#...ZENITH====LUNAR======Key.....#",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#",
      "#...ZENITH====Gate==========Exit.#",
      "# ============================== #",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#",
      "##################################"
    ],
    npcs: [
      {
        id: 'stella',
        name: 'Stargazer Stella',
        x: 4,
        y: 1,
        avatar: '🔭',
        dialogue: [
          "The sky islands are isolated by miles of bottomless void.",
          "Open the chest at (16, 1) to unlock the '*' token search warp.",
          "Stand upon a beacon word like 'SOLAR', 'ASTRAL', or 'LUNAR' and press '*'!",
          "In Vim, '*' searches forward for the word under your cursor, warping you across the chasm!"
        ]
      }
    ],
    keys: [
      { id: 'k13_ruby', x: 26, y: 10, keyType: 'rubyKey', name: 'Ruby Key' }
    ],
    doors: [
      { id: 'd13_star', x: 14, y: 13, keyRequired: 'rubyKey', orientation: 'vertical', label: 'Starlight Gate' }
    ],
    chests: [
      {
        id: 'c13_star',
        x: 16,
        y: 1,
        rewardType: 'ability',
        rewardValue: '*',
        label: "Unlocked '*' (Search Word Under Cursor)!"
      }
    ],
    gems: [
      { id: 'g13_1', x: 10, y: 4, value: 75 },
      { id: 'g13_2', x: 10, y: 7, value: 75 },
      { id: 'g13_3', x: 20, y: 10, value: 75 }
    ],
    portals: [],
    obstacles: [],
    exit: { x: 28, y: 13, targetLevel: 14 },
    objective: "Unlock '*', warp across beacon islands using '*', retrieve Ruby Key, and exit!"
  },

  // =========================================================================
  // CHAPTER 14: The Line Demolition Vaults ('D') [Dojo Day 4]
  // Mechanics: Delete to line end (D / d$) clearing barrier rows
  // =========================================================================
  {
    id: 14,
    name: "Chapter 14: Line Demolition Vaults ('D')",
    subtitle: "Obliterate Barriers to Line End with D [Dojo Day 4]",
    width: 34,
    height: 15,
    playerStart: { x: 2, y: 2 },
    initialAbilities: ['h', 'j', 'k', 'l', 'w', 'b', 'e', 'ge', '0', '$', '^', 'f', 'F', 't', 'T', ';', ',', 'gg', 'G', '{', '}', '%', 'x', 'r', 'u', '~', '*'],
    map: [
      "##################################",
      "# Demolition Training Arena      #",
      "# .Dan..Chest....................#",
      "#.################################",
      "#...# Barrier_1: xxxxxxxxxxxxxxx.#",
      "#.################################",
      "#...#............................#",
      "#.################################",
      "#...# Barrier_2: xxxxxxxxxxxxxxx.#",
      "#.################################",
      "#...# Barrier_3: xxxxxxxxxxxxxxK.#",
      "#.################################",
      "#...Vault_Gate==============Exit.#",
      "# ============================== #",
      "##################################"
    ],
    npcs: [
      {
        id: 'dan',
        name: 'Demolition Dan',
        x: 4,
        y: 2,
        avatar: '💣',
        dialogue: [
          "Single 'x' cuts one tile at a time. Too slow for a master!",
          "Open the chest at (10, 2) to unlock 'D' (delete to end of line)!",
          "Stand facing each laser barrier row and hit 'D' to blast the entire path open in one strike!",
          "Vaporize Barrier 3 to seize the Diamond Key, then open the Vault Gate!"
        ]
      }
    ],
    keys: [
      { id: 'k14_diamond', x: 31, y: 10, keyType: 'diamondKey', name: 'Diamond Key' }
    ],
    doors: [
      { id: 'd14_vault', x: 15, y: 12, keyRequired: 'diamondKey', orientation: 'vertical', label: 'Vault Gate' }
    ],
    chests: [
      {
        id: 'c14_d',
        x: 10,
        y: 2,
        rewardType: 'ability',
        rewardValue: 'D',
        label: "Unlocked 'D' (Delete to Line End)!"
      }
    ],
    gems: [
      { id: 'g14_1', x: 31, y: 4, value: 80 },
      { id: 'g14_2', x: 31, y: 8, value: 80 },
      { id: 'g14_3', x: 20, y: 6, value: 80 }
    ],
    portals: [],
    obstacles: [
      { id: 'obs14_1', x: 17, y: 4, char: 'x', type: 'barrier' },
      { id: 'obs14_2', x: 17, y: 8, char: 'x', type: 'barrier' },
      { id: 'obs14_3', x: 17, y: 10, char: 'x', type: 'barrier' }
    ],
    exit: { x: 28, y: 12, targetLevel: 15 },
    objective: "Unlock 'D', vaporize barrier rows, claim the Diamond Key, and enter the Grand Citadel!"
  },

  // =========================================================================
  // CHAPTER 15: Grand Citadel of the Neovim Grandmaster [Dojo Days 29-30]
  // Mechanics: Climax synthesizing ALL motions, objects, operators, and Bram
  // =========================================================================
  {
    id: 15,
    name: "Chapter 15: Grand Citadel of the Neovim Grandmaster",
    subtitle: "The Ultimate Modal Trial - Bram Moolenaar's Blessing [Dojo Days 29-30]",
    width: 34,
    height: 22,
    playerStart: { x: 31, y: 20 },
    initialAbilities: ['h', 'j', 'k', 'l', 'w', 'b', 'e', 'ge', '0', '$', '^', 'f', 'F', 't', 'T', ';', ',', 'gg', 'G', '{', '}', '%', 'x', 'r', 'u', '~', '*', 'D'],
    map: [
      "##################################",
      "# Bram's Golden Throne of Glory  #",
      "# ...............Exit........... #",
      "# ...........Grandmaster........ #",
      "# ==============Gate============ #",
      "# .............CROWN............ #",
      "##################################",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#",
      "#.################################",
      "#...Switch: [o] ==Gate===Key CROWN#",
      "#.################################",
      "#................................#",
      "################################.#",
      "#...Barrier:..xxxxxxxxxxxxxxxxx..#",
      "#.################################",
      "#................................#",
      "################################.#",
      "#...Bridge====~~================.#",
      "#.################################",
      "# Foyer: Begin the Grand Trial . #",
      "##################################"
    ],
    npcs: [
      {
        id: 'grandmaster',
        name: 'Grandmaster Bram',
        x: 16,
        y: 3,
        avatar: '👑',
        dialogue: [
          "Welcome to the pinnacle of the Modal Arts, Hero!",
          "You repaired broken bridges with 'r', vaporized barrier rows with 'D',",
          "inverted polarities with '~', and leaped across the stars with '*'.",
          "Step upon my Golden Throne, claim your Grandmaster Crown, and ascend to Vim immortality!"
        ]
      }
    ],
    keys: [
      { id: 'k15_gold', x: 25, y: 10, keyType: 'goldKey', name: 'Grandmaster Gold Key' }
    ],
    doors: [
      { id: 'd15_switch', x: 18, y: 10, keyRequired: 'switch', orientation: 'vertical', label: 'Citadel Switch Gate' },
      { id: 'd15_master', x: 16, y: 4, keyRequired: 'goldKey', orientation: 'vertical', label: 'Grandmaster Gate' }
    ],
    chests: [
      {
        id: 'c15_trophy',
        x: 13,
        y: 3,
        rewardType: 'gems',
        rewardValue: 500,
        label: "Crowned with the 500 Gem Grandmaster Treasure!"
      }
    ],
    gems: [
      { id: 'g15_1', x: 8, y: 10, value: 100 },
      { id: 'g15_2', x: 10, y: 14, value: 100 },
      { id: 'g15_3', x: 10, y: 18, value: 100 }
    ],
    portals: [],
    obstacles: [
      { id: 'obs15_1', x: 14, y: 14, char: 'x', type: 'barrier' }
    ],
    exit: { x: 16, y: 2, isVictory: true },
    objective: "Repair bridges ('r='), vaporize barriers ('D'), toggle switch ('~'), warp with '*', and reach Bram's Throne!"
  }
];
