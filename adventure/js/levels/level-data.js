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
      { id: 'k2', x: 25, y: 12, keyType: 'silverKey', name: 'Silver Key' }
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
      { id: 'g8', x: 7, y: 8, value: 20 }
    ],
    portals: [],
    obstacles: [],
    exit: { x: 10, y: 16, targetLevel: 3 },
    objective: "Use 'w' and 'e' to leap across words, collect the Silver Key, and open the gate!"
  },

  // =========================================================================
  // CHAPTER 3: The Line Canyon & Temple of Find [Dojo Days 3 & 5]
  // Mechanics: 0, $, ^ and f, ; (inline find search)
  // =========================================================================
  {
    id: 3,
    name: "Chapter 3: The Temple of Find",
    subtitle: "Command the Line with 0, $, and inline search f [Dojo Days 3 & 5]",
    width: 36,
    height: 18,
    playerStart: { x: 2, y: 2 },
    initialAbilities: ['h', 'j', 'k', 'l', 'w', 'b', 'e', 'ge'],
    map: [
      "####################################",
      "#..................................#",
      "# const start = explore_canyon();  #",
      "#..................................#",
      "# let speed = instant_line_jump;   #",
      "#..................................#",
      "# find_treasure_with_f_target;     #",
      "#..................................#",
      "# type_f_then_z_to_reach_z_portal; #",
      "#..................................#",
      "# press_dollar_to_hit_line_end;    #",
      "#..................................#",
      "# press_zero_to_snap_back_home;    #",
      "#..................................#",
      "# unlock_gate_with_golden_key;     #",
      "#..................................#",
      "# enter_crypt_portal_below;        #",
      "####################################"
    ],
    npcs: [
      {
        id: 'findley',
        name: 'Master Findley',
        x: 28,
        y: 2,
        avatar: '🧙‍♂️',
        dialogue: [
          "Greetings! Why crawl character by character when you can fly?",
          "Press '$' to zip directly to the end of a line!",
          "Press '0' or '^' to snap to the beginning!",
          "And best of all: press 'f' followed by any letter to instantly teleport to it on the line!"
        ]
      }
    ],
    keys: [
      { id: 'k3', x: 28, y: 14, keyType: 'goldKey', name: 'Gold Key' }
    ],
    doors: [
      { id: 'd3', x: 18, y: 16, keyRequired: 'goldKey', orientation: 'vertical', label: 'Temple Gate' }
    ],
    chests: [
      {
        id: 'c4',
        x: 31,
        y: 4,
        rewardType: 'ability',
        rewardValue: '$',
        label: "Unlocked '$' & '0' (Line Boundaries)!"
      },
      {
        id: 'c5',
        x: 27,
        y: 6,
        rewardType: 'ability',
        rewardValue: 'f',
        label: "Unlocked 'f' & ';' (Find Character Forward)!"
      }
    ],
    gems: [
      { id: 'g9', x: 12, y: 4, value: 30 },
      { id: 'g10', x: 25, y: 8, value: 30 },
      { id: 'g11', x: 16, y: 10, value: 30 },
      { id: 'g12', x: 10, y: 12, value: 30 }
    ],
    portals: [],
    obstacles: [],
    exit: { x: 26, y: 16, targetLevel: 4 },
    objective: "Master 'f<char>', '$', and '0' to navigate the canyon and seize the Gold Key!"
  },

  // =========================================================================
  // CHAPTER 4: The Caverns of Till & Reverse Seek [Dojo Day 5]
  // Mechanics: t, T, F, and repeat , (safe precision inline seek)
  // =========================================================================
  {
    id: 4,
    name: "Chapter 4: Caverns of Till & Reverse Seek",
    subtitle: "Precision Till t/T and Backward F [Dojo Day 5]",
    width: 34,
    height: 18,
    playerStart: { x: 2, y: 2 },
    initialAbilities: ['h', 'j', 'k', 'l', 'w', 'b', 'e', 'ge', '0', '$', '^', 'f', ';'],
    map: [
      "##################################",
      "#................................#",
      "# path:..safe_walkway~~magma_pit.#",
      "#................................#",
      "# danger:..ice_bridge~~spikes_X..#",
      "#................................#",
      "# seek_back:..return_home_with_F.#",
      "#................................#",
      "# stop_till_safe:..till_with_t~~.#",
      "#................................#",
      "# repeat_reverse_with_comma_key..#",
      "#................................#",
      "# bronze_key_shines_in_chamber...#",
      "#................................#",
      "# cavern_gate_locks_exit_door....#",
      "#................................#",
      "# venture_into_spire_above.......#",
      "##################################"
    ],
    npcs: [
      {
        id: 'hermit',
        name: 'Cavern Hermit',
        x: 10,
        y: 2,
        avatar: '🧔',
        dialogue: [
          "Beware the magma and spikes! If you use 'f~', you will land right IN the lava!",
          "Use 't~' (Till) instead: it lands you ONE tile BEFORE the target, keeping you safe!",
          "Use 'F<char>' to seek backwards to safety, and ',' to reverse your repeat search."
        ]
      }
    ],
    keys: [
      { id: 'k4_bronze', x: 25, y: 12, keyType: 'bronzeKey', name: 'Bronze Key' }
    ],
    doors: [
      { id: 'd4_cavern', x: 22, y: 14, keyRequired: 'bronzeKey', orientation: 'vertical', label: 'Cavern Gate' }
    ],
    chests: [
      {
        id: 'c4_till',
        x: 28,
        y: 8,
        rewardType: 'ability',
        rewardValue: 't',
        label: "Unlocked 't' & 'T' (Till Inline Seek)!"
      },
      {
        id: 'c4_rev',
        x: 29,
        y: 6,
        rewardType: 'ability',
        rewardValue: 'F',
        label: "Unlocked 'F' & ',' (Reverse Inline Find)!"
      }
    ],
    gems: [
      { id: 'g4_1', x: 12, y: 4, value: 30 },
      { id: 'g4_2', x: 19, y: 6, value: 30 },
      { id: 'g4_3', x: 14, y: 10, value: 30 }
    ],
    portals: [],
    obstacles: [],
    exit: { x: 30, y: 16, targetLevel: 5 },
    objective: "Use 't' to stop safely before magma, grab the Bronze Key, and advance to Chapter 5!"
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
      "#..............................#",
      "# Balcony 4: Air currents blow #",
      "# ============================ #",
      "#..............................#",
      "# Balcony 3: High observatory  #",
      "# ============================ #",
      "#..............................#",
      "# Balcony 2: Library archives  #",
      "# ============================ #",
      "#..............................#",
      "# Balcony 1: Armory chambers   #",
      "# ============================ #",
      "#..............................#",
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
      "#                                #",
      "#                                #",
      "# Glade 2: Ancient oak grove     #",
      "# ============================== #",
      "#                                #",
      "#                                #",
      "# Glade 3: Whispering pines      #",
      "# ============================== #",
      "#                                #",
      "#                                #",
      "# Glade 4: Silver Key shrine     #",
      "# ============================== #",
      "#                                #",
      "#                                #",
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
      "################### ~~~~~~~~~~ #",
      "~~~~~~~~~~~~~~~~~~~ ~~~~~~~~~~ #",
      "# [ Chamber Beta  ] ~~~~~~~~~~ #",
      "# ................. ~~~~~~~~~~ #",
      "# [ ............. ] ~~~~~~~~~~ #",
      "################### ~~~~~~~~~~ #",
      "~~~~~~~~~~~~~~~~~~~ ~~~~~~~~~~ #",
      "# { Chamber Gamma } ~~~~~~~~~~ #",
      "# ................. ~~~~~~~~~~ #",
      "# { ............. } ~~~~~~~~~~ #",
      "###################. ~~~~~~~~~ #",
      "# Skull Key Altar Awaits Exit  #",
      "# ............................ #",
      "################################"
    ],
    npcs: [
      {
        id: 'monk',
        name: 'Bracket Monk',
        x: 10,
        y: 3,
        avatar: '📿',
        dialogue: [
          "The walls here are impenetrable to normal footsteps.",
          "Stand upon any bracket '(', ')', '[', ']', '{', or '}' and press '%'!",
          "The power of '%' will instantly transport your spirit to its matching partner!"
        ]
      }
    ],
    keys: [
      { id: 'k7_skull', x: 16, y: 15, keyType: 'skullKey', name: 'Skull Key' }
    ],
    doors: [
      { id: 'd7_crypt', x: 24, y: 15, keyRequired: 'skullKey', orientation: 'vertical', label: 'Crypt Seal' }
    ],
    chests: [
      {
        id: 'c7_bracket',
        x: 14,
        y: 12,
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
      { id: 'p2', x: 18, y: 3, targetX: 2, targetY: 3, char: ')' },
      { id: 'p3', x: 2, y: 8, targetX: 18, targetY: 8, char: '[' },
      { id: 'p4', x: 18, y: 8, targetX: 2, targetY: 8, char: ']' },
      { id: 'p5', x: 2, y: 13, targetX: 18, targetY: 13, char: '{' },
      { id: 'p6', x: 18, y: 13, targetX: 2, targetY: 13, char: '}' }
    ],
    obstacles: [],
    exit: { x: 28, y: 15, targetLevel: 8 },
    objective: "Use '%' to warp across brackets, retrieve the Skull Key, and unlock the Crypt Seal!"
  },

  // =========================================================================
  // CHAPTER 8: The Labyrinth of Precision Counts [Dojo Day 2]
  // Mechanics: Count grammar (3w, 4j, 6l, 2f,) over crumbling tiles
  // =========================================================================
  {
    id: 8,
    name: "Chapter 8: Labyrinth of Precision Counts",
    subtitle: "Precision Leaps with Counts: 3w, 4j, 6l [Dojo Day 2]",
    width: 34,
    height: 18,
    playerStart: { x: 2, y: 2 },
    initialAbilities: ['h', 'j', 'k', 'l', 'w', 'b', 'e', 'ge', '0', '$', '^', 'f', 'F', 't', 'T', ';', ',', 'gg', 'G', '{', '}', '%'],
    map: [
      "##################################",
      "# START~~~~~~~~~~~~~~~~~~~~~~~~~~#",
      "# step:..~~~jump~~~safe~~~zone...#",
      "# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ #",
      "# ~~~~~~....~~~~~~....~~~~~~.... #",
      "# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ #",
      "# count_3w_across_ocean_islands. #",
      "# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ #",
      "# leap_4j_downward_to_platforms. #",
      "# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ #",
      "# hit_6l_right_into_sanctuary... #",
      "# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ #",
      "# bronze_key_rests_on_pillar.... #",
      "# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ #",
      "# unlock_labyrinth_gate_ahead... #",
      "# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ #",
      "# enter_pruning_grounds_now..... #",
      "##################################"
    ],
    npcs: [
      {
        id: 'mathius',
        name: 'Count Mathius',
        x: 8,
        y: 2,
        avatar: '🧮',
        dialogue: [
          "In Vim, numbers give commands their true multiplied power!",
          "Instead of pressing 'w' three times, type '3w'.",
          "Try '4j' or '6l' to jump long distances without wearing down your keys!",
          "Combine counts with motions to cross this treacherous chasm."
        ]
      }
    ],
    keys: [
      { id: 'k8_bronze', x: 28, y: 12, keyType: 'bronzeKey', name: 'Bronze Key' }
    ],
    doors: [
      { id: 'd8_gate', x: 24, y: 14, keyRequired: 'bronzeKey', orientation: 'vertical', label: 'Labyrinth Gate' }
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
      { id: 'g8_1', x: 12, y: 4, value: 50 },
      { id: 'g8_2', x: 20, y: 4, value: 50 },
      { id: 'g8_3', x: 28, y: 4, value: 50 }
    ],
    portals: [],
    obstacles: [],
    exit: { x: 30, y: 16, targetLevel: 9 },
    objective: "Use counts like '3w', '4j', '6l' to leap islands, grab the Bronze Key, and advance!"
  },

  // =========================================================================
  // CHAPTER 9: The Pruning Grounds of 'x' [Dojo Days 2 & 4]
  // Mechanics: Character deletion / weed clearing with x
  // =========================================================================
  {
    id: 9,
    name: "Chapter 9: The Pruning Grounds of 'x'",
    subtitle: "Slice Glitches, Bugs, and Weeds with x [Dojo Days 2 & 4]",
    width: 32,
    height: 18,
    playerStart: { x: 2, y: 2 },
    initialAbilities: ['h', 'j', 'k', 'l', 'w', 'b', 'e', 'ge', '0', '$', '^', 'f', 'F', 't', 'T', ';', ',', 'gg', 'G', '{', '}', '%'],
    map: [
      "################################",
      "# Gardener Overgrown Sanctuary #",
      "# ============================ #",
      "# ............................ #",
      "# xxxxxxxxxxxxxxxxxxxxxxxx.... #",
      "# ............................ #",
      "# ....xxxxxxxxxxxxxxxxxxxx.... #",
      "# ............................ #",
      "# xxxxxxxxxxxxxxxxxxxxxxxx.... #",
      "# ............................ #",
      "# Ruby Key glows in overgrown. #",
      "# ............................ #",
      "# Pruning Gate seals garden .. #",
      "# ============================ #",
      "# ............................ #",
      "# Enter the Mason's workshop . #",
      "# ============================ #",
      "################################"
    ],
    npcs: [
      {
        id: 'pete',
        name: 'Gardener Pete',
        x: 8,
        y: 3,
        avatar: '🧑‍🌾',
        dialogue: [
          "Glitch weeds 'x' have choked my entire garden path!",
          "Stand facing them and press 'x' to prune them away, turning them into stone paths.",
          "Clear the weeds, retrieve my Ruby Key, and open the garden gate!"
        ]
      }
    ],
    keys: [
      { id: 'k9_ruby', x: 5, y: 10, keyType: 'rubyKey', name: 'Ruby Key' }
    ],
    doors: [
      { id: 'd9_gate', x: 22, y: 12, keyRequired: 'rubyKey', orientation: 'vertical', label: 'Pruning Gate' }
    ],
    chests: [
      {
        id: 'c9_x',
        x: 26,
        y: 3,
        rewardType: 'ability',
        rewardValue: 'x',
        label: "Unlocked 'x' (Cut Character / Obstacle)!"
      }
    ],
    gems: [
      { id: 'g9_1', x: 15, y: 5, value: 50 },
      { id: 'g9_2', x: 15, y: 7, value: 50 },
      { id: 'g9_3', x: 15, y: 9, value: 50 }
    ],
    portals: [],
    obstacles: [
      { id: 'obs9_1', x: 2, y: 4, char: 'x', type: 'weed' },
      { id: 'obs9_2', x: 10, y: 6, char: 'x', type: 'weed' },
      { id: 'obs9_3', x: 2, y: 8, char: 'x', type: 'weed' }
    ],
    exit: { x: 28, y: 15, targetLevel: 10 },
    objective: "Unlock 'x', slice through the glitch weeds, grab the Ruby Key, and unlock the gate!"
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
    height: 18,
    playerStart: { x: 2, y: 2 },
    initialAbilities: ['h', 'j', 'k', 'l', 'w', 'b', 'e', 'ge', '0', '$', '^', 'f', 'F', 't', 'T', ';', ',', 'gg', 'G', '{', '}', '%', 'x'],
    map: [
      "##################################",
      "# Mason's Aqueduct Construction  #",
      "# ============================== #",
      "# .............................. #",
      "# Bridge 1:..====~====~====..... #",
      "# .............................. #",
      "# Bridge 2:..====~====~====..... #",
      "# .............................. #",
      "# Bridge 3:..====~====~====..... #",
      "# .............................. #",
      "# Emerald Key in tool shed...... #",
      "# .............................. #",
      "# Mason Gate locks exit path.... #",
      "# ============================== #",
      "# .............................. #",
      "# Halls of Time await beyond.... #",
      "# ============================== #",
      "##################################"
    ],
    npcs: [
      {
        id: 'bob',
        name: 'Mason Bob',
        x: 8,
        y: 2,
        avatar: '👷',
        dialogue: [
          "Our water aqueducts have gaps '~' where stones collapsed into the river!",
          "Facing a gap, press 'r' followed by '=' to replace the water with solid path.",
          "Repair the bridge spans to collect the Emerald Key and cross to safety!"
        ]
      }
    ],
    keys: [
      { id: 'k10_emerald', x: 28, y: 10, keyType: 'emeraldKey', name: 'Emerald Key' }
    ],
    doors: [
      { id: 'd10_mason', x: 24, y: 12, keyRequired: 'emeraldKey', orientation: 'vertical', label: 'Mason Gate' }
    ],
    chests: [
      {
        id: 'c10_r',
        x: 26,
        y: 2,
        rewardType: 'ability',
        rewardValue: 'r',
        label: "Unlocked 'r' (Replace Character)!"
      }
    ],
    gems: [
      { id: 'g10_1', x: 17, y: 4, value: 60 },
      { id: 'g10_2', x: 17, y: 6, value: 60 },
      { id: 'g10_3', x: 17, y: 8, value: 60 }
    ],
    portals: [],
    obstacles: [],
    exit: { x: 28, y: 15, targetLevel: 11 },
    objective: "Unlock 'r', use 'r=' to repair bridge gaps, grab the Emerald Key, and open the gate!"
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
    height: 18,
    playerStart: { x: 2, y: 2 },
    initialAbilities: ['h', 'j', 'k', 'l', 'w', 'b', 'e', 'ge', '0', '$', '^', 'f', 'F', 't', 'T', ';', ',', 'gg', 'G', '{', '}', '%', 'x', 'r'],
    map: [
      "################################",
      "# Chrono Chamber of Time Loops #",
      "# ============================ #",
      "# ............................ #",
      "# Dead-End Vault with Key: ... #",
      "# ............................ #",
      "# ############################ #",
      "# ............................ #",
      "# Labyrinth Corridors Ahead .. #",
      "# ............................ #",
      "# Silver Key unlocks door .... #",
      "# ............................ #",
      "# Chrono Gate guards exit .... #",
      "# ============================ #",
      "# ............................ #",
      "# Step into Polarity Chamber.. #",
      "# ============================ #",
      "################################"
    ],
    npcs: [
      {
        id: 'chronos',
        name: 'Chronos the Sage',
        x: 8,
        y: 2,
        avatar: '⏳',
        dialogue: [
          "Never fear making a wrong turn or getting stuck in a trap corridor.",
          "In Vim, the 'u' key is your eternal undo spell!",
          "Make a misstep? Cut the wrong tile? Press 'u' to rewind time and state instantly."
        ]
      }
    ],
    keys: [
      { id: 'k11_silver', x: 27, y: 4, keyType: 'silverKey', name: 'Silver Key' }
    ],
    doors: [
      { id: 'd11_chrono', x: 20, y: 12, keyRequired: 'silverKey', orientation: 'vertical', label: 'Chrono Gate' }
    ],
    chests: [
      {
        id: 'c11_gems',
        x: 27,
        y: 9,
        rewardType: 'gems',
        rewardValue: 120,
        label: "Discovered 120 Timeless Gems!"
      }
    ],
    gems: [
      { id: 'g11_1', x: 12, y: 4, value: 60 },
      { id: 'g11_2', x: 20, y: 4, value: 60 },
      { id: 'g11_3', x: 12, y: 9, value: 60 }
    ],
    portals: [],
    obstacles: [],
    exit: { x: 26, y: 15, targetLevel: 12 },
    objective: "Navigate the corridors, collect the Silver Key, use 'u' if trapped, and unlock the gate!"
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
    height: 18,
    playerStart: { x: 2, y: 2 },
    initialAbilities: ['h', 'j', 'k', 'l', 'w', 'b', 'e', 'ge', '0', '$', '^', 'f', 'F', 't', 'T', ';', ',', 'gg', 'G', '{', '}', '%', 'x', 'r'],
    map: [
      "##################################",
      "# Sanctuary of Polarity Crystals #",
      "# ============================== #",
      "# .............................. #",
      "# Switch Alpha: [o] closed gate. #",
      "# .............................. #",
      "# Switch Beta:  [s] drawbridge.. #",
      "# .............................. #",
      "# Gold Key shines in locked room #",
      "# .............................. #",
      "# Polarity Gate seals passage... #",
      "# ============================== #",
      "# .............................. #",
      "# Enter the Valley of Beacons... #",
      "# ============================== #",
      "# .............................. #",
      "# Exit portal ready ahead....... #",
      "##################################"
    ],
    npcs: [
      {
        id: 'switcher',
        name: 'Mystic Switcher',
        x: 8,
        y: 2,
        avatar: '🔮',
        dialogue: [
          "Behold the ancient runes! Lowercase letters like 'o' are dormant and closed.",
          "Stand facing the switch and press '~' (tilde) to invert its case to uppercase 'O'!",
          "Inverting the switch triggers magical mechanisms that open gates throughout the room."
        ]
      }
    ],
    keys: [
      { id: 'k12_gold', x: 28, y: 8, keyType: 'goldKey', name: 'Gold Key' }
    ],
    doors: [
      { id: 'd12_switch', x: 22, y: 4, keyRequired: 'switch', orientation: 'vertical', label: 'Switch Gate' },
      { id: 'd12_polarity', x: 24, y: 10, keyRequired: 'goldKey', orientation: 'vertical', label: 'Polarity Gate' }
    ],
    chests: [
      {
        id: 'c12_tilde',
        x: 26,
        y: 2,
        rewardType: 'ability',
        rewardValue: '~',
        label: "Unlocked '~' (Toggle Case)!"
      }
    ],
    gems: [
      { id: 'g12_1', x: 12, y: 6, value: 70 },
      { id: 'g12_2', x: 20, y: 6, value: 70 },
      { id: 'g12_3', x: 12, y: 12, value: 70 }
    ],
    portals: [],
    obstacles: [],
    exit: { x: 28, y: 15, targetLevel: 13 },
    objective: "Unlock '~', flip switch 'o' to 'O' to open the inner room, grab the Gold Key, and exit!"
  },

  // =========================================================================
  // CHAPTER 13: Valley of Golden Beacons ('*') [Dojo Days 18 & 23]
  // Mechanics: Search word under cursor with * to warp across beacons
  // =========================================================================
  {
    id: 13,
    name: "Chapter 13: Valley of Golden Beacons ('*')",
    subtitle: "Search and Warp to Matching Tokens with * [Dojo Days 18 & 23]",
    width: 36,
    height: 20,
    playerStart: { x: 2, y: 2 },
    initialAbilities: ['h', 'j', 'k', 'l', 'w', 'b', 'e', 'ge', '0', '$', '^', 'f', 'F', 't', 'T', ';', ',', 'gg', 'G', '{', '}', '%', 'x', 'r', '~'],
    map: [
      "####################################",
      "# Cliff 1: BEACON ~~~~~~~~~~~~~~~~ #",
      "# ================================ #",
      "# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ #",
      "# Cliff 2: ~~~~~~~~ BEACON ~~~~~~~ #",
      "# ================================ #",
      "# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ #",
      "# Cliff 3: ~~~~~~~~~~~~~~ RUNE ~~~ #",
      "# ================================ #",
      "# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ #",
      "# Cliff 4: RUNE ~~~~~~~~~~~~~~~~~~ #",
      "# ================================ #",
      "# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ #",
      "# Cliff 5: ~~~~~~~~~~~~~~ NOVA ~~~ #",
      "# Ruby Key rests on remote peak .. #",
      "# Cliff 6: NOVA ~~~~~~~~~~~~~~~~~~ #",
      "# Starlight Gate awaits traveler . #",
      "# ================================ #",
      "# Passage to Demolition Vaults ... #",
      "####################################"
    ],
    npcs: [
      {
        id: 'stella',
        name: 'Stargazer Stella',
        x: 10,
        y: 2,
        avatar: '🔭',
        dialogue: [
          "The cliffs are separated by miles of bottomless air.",
          "Stand on any beacon word like 'BEACON' or 'RUNE' and press '*'!",
          "In Vim, '*' searches forward for the word under the cursor, warping you straight to the next matching beacon!"
        ]
      }
    ],
    keys: [
      { id: 'k13_ruby', x: 28, y: 14, keyType: 'rubyKey', name: 'Ruby Key' }
    ],
    doors: [
      { id: 'd13_star', x: 24, y: 16, keyRequired: 'rubyKey', orientation: 'vertical', label: 'Starlight Gate' }
    ],
    chests: [
      {
        id: 'c13_star',
        x: 26,
        y: 2,
        rewardType: 'ability',
        rewardValue: '*',
        label: "Unlocked '*' (Search Word Under Cursor)!"
      }
    ],
    gems: [
      { id: 'g13_1', x: 19, y: 4, value: 75 },
      { id: 'g13_2', x: 25, y: 7, value: 75 },
      { id: 'g13_3', x: 10, y: 10, value: 75 }
    ],
    portals: [],
    obstacles: [],
    exit: { x: 30, y: 18, targetLevel: 14 },
    objective: "Unlock '*', warp across cliffs with matching tokens, retrieve the Ruby Key, and proceed!"
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
    height: 18,
    playerStart: { x: 2, y: 2 },
    initialAbilities: ['h', 'j', 'k', 'l', 'w', 'b', 'e', 'ge', '0', '$', '^', 'f', 'F', 't', 'T', ';', ',', 'gg', 'G', '{', '}', '%', 'x', 'r', '~', '*'],
    map: [
      "##################################",
      "# Demolition Training Arena      #",
      "# ============================== #",
      "# .............................. #",
      "# Corridor 1:..xxxxxxxxx barriers#",
      "# .............................. #",
      "# Corridor 2:..xxxxxxxxx tripwire#",
      "# .............................. #",
      "# Corridor 3:..xxxxxxxxx lasers..#",
      "# .............................. #",
      "# Diamond Key locked in chamber. #",
      "# .............................. #",
      "# Vault Gate guards Grand Citadel#",
      "# ============================== #",
      "# .............................. #",
      "# Ascend to Citadel of Bram..... #",
      "# ============================== #",
      "##################################"
    ],
    npcs: [
      {
        id: 'dan',
        name: 'Demolition Dan',
        x: 8,
        y: 2,
        avatar: '💣',
        dialogue: [
          "Single 'x' cuts one tile at a time. Too slow for a master!",
          "In Vim, 'D' (d$) deletes from your cursor all the way to the END of the line!",
          "Stand before a row of barrier traps and hit 'D' to blast the entire path open in one strike!"
        ]
      }
    ],
    keys: [
      { id: 'k14_diamond', x: 28, y: 10, keyType: 'diamondKey', name: 'Diamond Key' }
    ],
    doors: [
      { id: 'd14_vault', x: 24, y: 12, keyRequired: 'diamondKey', orientation: 'vertical', label: 'Vault Gate' }
    ],
    chests: [
      {
        id: 'c14_d',
        x: 26,
        y: 2,
        rewardType: 'ability',
        rewardValue: 'D',
        label: "Unlocked 'D' (Delete to Line End)!"
      }
    ],
    gems: [
      { id: 'g14_1', x: 14, y: 4, value: 80 },
      { id: 'g14_2', x: 14, y: 6, value: 80 },
      { id: 'g14_3', x: 14, y: 8, value: 80 }
    ],
    portals: [],
    obstacles: [
      { id: 'obs14_1', x: 15, y: 4, char: 'x', type: 'barrier' },
      { id: 'obs14_2', x: 15, y: 6, char: 'x', type: 'barrier' },
      { id: 'obs14_3', x: 15, y: 8, char: 'x', type: 'barrier' }
    ],
    exit: { x: 28, y: 15, targetLevel: 15 },
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
    width: 36,
    height: 22,
    playerStart: { x: 3, y: 19 },
    initialAbilities: ['h', 'j', 'k', 'l', 'w', 'b', 'e', 'ge', '0', '$', '^', 'f', 'F', 't', 'T', ';', ',', 'gg', 'G', '{', '}', '%', 'x', 'r', '~', '*', 'D'],
    map: [
      "####################################",
      "# Golden Citadel of Modal Masters  #",
      "# ================================ #",
      "# ( Crown Chamber ) ~~~~~~~~~~~~~~ #",
      "# ( ..............) ~~~~~~~~~~~~~~ #",
      "# Switch: [o] ~~~~~ RUNE ~~~~~~~~~ #",
      "# ================================ #",
      "#                                  #",
      "# Barrier Row: xxxxxxxxxxxxxxxxxx. #",
      "#                                  #",
      "# Broken Bridge: =====~=====~===== #",
      "#                                  #",
      "# RUNE ~~~~~~~~~~~~~~~~~~~~~~~~~~~ #",
      "# ================================ #",
      "#                                  #",
      "# Golden Key on Altar of Mastery . #",
      "# ================================ #",
      "# Grandmaster Gate to the Throne . #",
      "# ................................ #",
      "# Traveler Entrance: Begin Trial . #",
      "# ================================ #",
      "####################################"
    ],
    npcs: [
      {
        id: 'grandmaster',
        name: 'Grandmaster Bram',
        x: 18,
        y: 3,
        avatar: '👑',
        dialogue: [
          "Welcome to the pinnacle of the Modal Arts, Hero!",
          "You have walked the Shoreline, leaped the Archipelago, navigated the Lines,",
          "ascended the Towers, paired the Brackets, and mastered Deletion and Replacement.",
          "Combine all your arts in this final hall, reach my throne, and receive the Grandmaster Crown!"
        ]
      }
    ],
    keys: [
      { id: 'k15_gold', x: 28, y: 15, keyType: 'goldKey', name: 'Grandmaster Gold Key' }
    ],
    doors: [
      { id: 'd15_switch', x: 18, y: 5, keyRequired: 'switch', orientation: 'vertical', label: 'Citadel Switch Gate' },
      { id: 'd15_master', x: 18, y: 17, keyRequired: 'goldKey', orientation: 'vertical', label: 'Grandmaster Gate' }
    ],
    chests: [
      {
        id: 'c15_trophy',
        x: 15,
        y: 3,
        rewardType: 'gems',
        rewardValue: 500,
        label: "Crowned with the 500 Gem Grandmaster Treasure!"
      }
    ],
    gems: [
      { id: 'g15_1', x: 8, y: 3, value: 100 },
      { id: 'g15_2', x: 26, y: 3, value: 100 },
      { id: 'g15_3', x: 8, y: 15, value: 100 }
    ],
    portals: [
      { id: 'p15_1', x: 2, y: 3, targetX: 18, targetY: 4, char: '(' },
      { id: 'p15_2', x: 18, y: 4, targetX: 2, targetY: 3, char: ')' }
    ],
    obstacles: [
      { id: 'obs15_1', x: 15, y: 8, char: 'x', type: 'barrier' }
    ],
    exit: { x: 18, y: 2, isVictory: true },
    objective: "Synthesize all modal powers, unlock the Grandmaster Gate, and reach Bram's Golden Throne!"
  }
];
