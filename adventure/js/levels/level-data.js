/**
 * Vim Adventures Level Definitions & Curriculum
 * 5 Rich Handcrafted Chapters with Word Paths, NPCs, Keys, Doors, and Chests.
 */

export const LEVELS = [
  // =========================================================================
  // CHAPTER 1: The Shoreline of Motion
  // Mechanics: h, j, k, l orthogonal navigation on character paths
  // =========================================================================
  {
    id: 1,
    name: "Chapter 1: Shoreline of Motion",
    subtitle: "Master the Sacred Cardinal Motions: h, j, k, l",
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
  // CHAPTER 2: The Word Archipelago
  // Mechanics: w, b, e, ge jumping across water between word islands
  // =========================================================================
  {
    id: 2,
    name: "Chapter 2: The Word Archipelago",
    subtitle: "Leap Across Chasms with w, b, e, ge",
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
        label: "Unlocked 'b' (Backward Word Jump)!"
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
  // CHAPTER 3: The Line Canyon & The Temple of Find
  // Mechanics: 0, $, ^ and f, F, t, T, ; (inline find search)
  // =========================================================================
  {
    id: 3,
    name: "Chapter 3: The Temple of Find",
    subtitle: "Command the Line with 0, $, and inline search f/t",
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
  // CHAPTER 4: The Crypt of Matching Brackets
  // Mechanics: % bracket matching jumps between (, ), [, ], {, }
  // =========================================================================
  {
    id: 4,
    name: "Chapter 4: Crypt of Matching Brackets",
    subtitle: "Warp Between Code Chasms with %",
    width: 32,
    height: 18,
    playerStart: { x: 3, y: 3 },
    initialAbilities: ['h', 'j', 'k', 'l', 'w', 'b', 'e', 'ge', '0', '$', '^', 'f', 'F', 't', 'T', ';', '%'],
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
      { id: 'k4', x: 16, y: 15, keyType: 'skullKey', name: 'Skull Key' }
    ],
    doors: [
      { id: 'd4', x: 24, y: 15, keyRequired: 'skullKey', orientation: 'vertical', label: 'Crypt Seal' }
    ],
    chests: [
      {
        id: 'c6',
        x: 17,
        y: 8,
        rewardType: 'gem',
        rewardValue: 100,
        label: "Crypt Treasury: 100 Gems!"
      }
    ],
    gems: [
      { id: 'g13', x: 6, y: 1, value: 50 },
      { id: 'g14', x: 15, y: 1, value: 50 },
      { id: 'g15', x: 10, y: 7, value: 50 }
    ],
    portals: [
      // Bracket teleporters: step on one, press %, warp to the other!
      { id: 'bp1', x: 2, y: 3, char: '(', targetX: 18, targetY: 3, pairId: 'p1' },
      { id: 'bp2', x: 18, y: 3, char: ')', targetX: 2, targetY: 3, pairId: 'p1' },
      { id: 'bp3', x: 2, y: 8, char: '[', targetX: 18, targetY: 8, pairId: 'p2' },
      { id: 'bp4', x: 18, y: 8, char: ']', targetX: 2, targetY: 8, pairId: 'p2' },
      { id: 'bp5', x: 2, y: 13, char: '{', targetX: 18, targetY: 13, pairId: 'p3' },
      { id: 'bp6', x: 18, y: 13, char: '}', targetX: 2, targetY: 13, pairId: 'p3' },
    ],
    obstacles: [],
    exit: { x: 29, y: 15, targetLevel: 5 },
    objective: "Navigate the nested chambers using '%' bracket matching to retrieve the Skull Key!"
  },

  // =========================================================================
  // CHAPTER 5: The Grand Citadel of the Vim Master
  // Mechanics: x (delete bug/weed), r (replace character), counts (3w, 2j)
  // =========================================================================
  {
    id: 5,
    name: "Chapter 5: Citadel of Enlightenment",
    subtitle: "Manipulate the World with x, r, Counts, and Claim the Trophy!",
    width: 32,
    height: 18,
    playerStart: { x: 3, y: 3 },
    initialAbilities: ['h', 'j', 'k', 'l', 'w', 'b', 'e', 'ge', '0', '$', '^', 'f', 'F', 't', 'T', ';', '%', 'x', 'r'],
    map: [
      "################################",
      "# Sanctuary of Neovim Mastery  #",
      "# ............................ #",
      "# Clear weeds with x keystroke #",
      "# ............................ #",
      "# Path: ==x==x==x==x==x==.==== #",
      "# ............................ #",
      "# = ~~~ Repair gap with r= ~~~ #",
      "# ====================~======= #",
      "# ~~~~~~~~~~~~~~~~~~~~~~~~~~ = #",
      "# ............................ #",
      "# ............................ #",
      "# Dais of Bram Moolenaar Ahead #",
      "# ............................ #",
      "# ............................ #",
      "################################",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
    ],
    npcs: [
      {
        id: 'zen_master',
        name: 'Grandmaster Bram',
        x: 14,
        y: 13,
        avatar: '🏆',
        dialogue: [
          "Congratulations, disciple of the modal arts!",
          "You have traversed the Shorelines of motion, leapt the Word Archipelago,",
          "commanded the Lines with '0' and '$', danced across Brackets with '%',",
          "and reshaped reality with 'x' and 'r'!",
          "You are now a true Vim Grandmaster! The Golden Cup of Mastery is yours!"
        ]
      }
    ],
    keys: [],
    doors: [],
    chests: [
      {
        id: 'c7',
        x: 27,
        y: 8,
        rewardType: 'gem',
        rewardValue: 250,
        label: "Master's Bounty: 250 Gems!"
      }
    ],
    gems: [
      { id: 'g16', x: 5, y: 5, value: 50 },
      { id: 'g17', x: 10, y: 5, value: 50 },
      { id: 'g18', x: 15, y: 5, value: 50 },
      { id: 'g19', x: 20, y: 5, value: 50 }
    ],
    portals: [],
    obstacles: [
      { id: 'obs1', x: 10, y: 5, char: 'x', type: 'weed', hint: 'Cut with x' },
      { id: 'obs2', x: 13, y: 5, char: 'x', type: 'weed', hint: 'Cut with x' },
      { id: 'obs3', x: 16, y: 5, char: 'x', type: 'weed', hint: 'Cut with x' },
      { id: 'obs4', x: 19, y: 5, char: 'x', type: 'weed', hint: 'Cut with x' },
      { id: 'obs5', x: 22, y: 5, char: 'x', type: 'weed', hint: 'Cut with x' }
    ],
    exit: { x: 14, y: 13, isVictory: true },
    objective: "Clear the obstacles with 'x', repair the bridge with 'r=', reach Grandmaster Bram and win!"
  }
];
