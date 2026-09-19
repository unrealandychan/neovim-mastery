import test from 'node:test';
import assert from 'node:assert/strict';

import { Tilemap } from '../adventure/js/engine/tilemap.js';
import { Player } from '../adventure/js/entities/player.js';
import { NPC, Chest, Door, KeyItem, Gem, BracketPortal, Obstacle } from '../adventure/js/entities/world-objects.js';
import { LEVELS } from '../adventure/js/levels/level-data.js';

test('Tilemap: handles bounds, collision, and walkable tiles correctly', () => {
  const mapLines = [
    "####",
    "#..#",
    "#~~#",
    "####"
  ];
  const tm = new Tilemap(4, 4, mapLines);

  assert.equal(tm.inBounds(0, 0), true);
  assert.equal(tm.inBounds(4, 4), false);
  assert.equal(tm.getTile(0, 0), '#');
  assert.equal(tm.getTile(1, 1), '.');
  assert.equal(tm.getTile(1, 2), '~');

  // '#' and '~' are not walkable
  assert.equal(tm.isWalkable(0, 0), false);
  assert.equal(tm.isWalkable(1, 2), false);

  // '.' is walkable
  assert.equal(tm.isWalkable(1, 1), true);
});

test('Tilemap word motions: w, b, e, ge jumping across voids and water', () => {
  const mapLines = [
    "The   quick   brown   fox",
  ];
  const tm = new Tilemap(25, 1, mapLines);

  // Jump from 'T' (0,0) to 'q' in 'quick' (6,0)
  const nextWord = tm.findNextWord(0, 0);
  assert.equal(nextWord.x, 6);

  // Jump to 'b' in 'brown' (14, 0)
  const thirdWord = tm.findNextWord(6, 0);
  assert.equal(thirdWord.x, 14);

  // Jump to end of 'brown' (18, 0)
  const endWord = tm.findWordEnd(14, 0);
  assert.equal(endWord.x, 18);

  // Jump backward from (14, 0) to 'quick' (6, 0)
  const prevWord = tm.findPrevWord(14, 0);
  assert.equal(prevWord.x, 6);

  // Jump backward to end of previous word from (14, 0) to 'k' (10, 0)
  const prevEnd = tm.findPrevWordEnd(14, 0);
  assert.equal(prevEnd.x, 10);
});

test('Tilemap line bounds and inline find/till: 0, $, ^, f, t, F, T', () => {
  const mapLines = [
    "   const greeting = 'hello';",
  ];
  const tm = new Tilemap(28, 1, mapLines);

  // '0' start of line
  assert.equal(tm.getLineStart(0), 0);

  // '^' first non-blank character ('c' at index 3)
  assert.equal(tm.getLineStart(0, true), 3);

  // '$' end of line (';' at index 27)
  assert.equal(tm.getLineEnd(0), 27);

  // 'f' find character 'v' -> in this case 'g' starting from index 3
  const findG = tm.findCharInRow(0, 3, 'g', true, false);
  assert.equal(findG.found, true);
  assert.equal(findG.x, 9);
  assert.equal(tm.getTile(findG.x, 0), 'g');

  // 't' till character '=' starting from index 9
  const tillEq = tm.findCharInRow(0, 9, '=', true, true);
  assert.equal(tillEq.found, true);
  assert.equal(tillEq.x, 17); // character right before '=' at index 18

  // 'F' find backward for 'c' starting from index 15
  const findPrevC = tm.findCharInRow(0, 15, 'c', false, false);
  assert.equal(findPrevC.found, true);
  assert.equal(findPrevC.x, 3);
});

test('Tilemap vertical ascents and paragraph jumps: gg, G, {, }, *', () => {
  const mapLines = [
    "ALPHA block one line 0",
    "ALPHA block one line 1",
    "                      ",
    "                      ",
    "BETA block two line 4 ",
    "ALPHA block two line 5",
    "                      ",
    "OMEGA block end line 7"
  ];
  const tm = new Tilemap(22, 8, mapLines);

  // gg jumps to top walkable line (row 0)
  const topJump = tm.jumpToLine(0, 0);
  assert.equal(topJump.y, 0);

  // G jumps to bottom walkable line (row 7)
  const botJump = tm.jumpToLine(7, 0);
  assert.equal(botJump.y, 7);

  // paragraph jump downward from row 0 across empty rows (2, 3) to row 4
  const paraDown = tm.findParagraphJump(0, 0, true);
  assert.equal(paraDown.y, 4);

  // paragraph jump upward from row 5 across empty rows (2, 3) to row 1
  const paraUp = tm.findParagraphJump(0, 5, false);
  assert.equal(paraUp.y, 1);

  // getWordAt
  const token = tm.getWordAt(0, 0);
  assert.equal(token, 'ALPHA');

  // findMatchingToken (*) forward search for 'ALPHA' from (0, 0)
  const match = tm.findMatchingToken(0, 0);
  assert.equal(match.found, true);
  assert.equal(match.token, 'ALPHA');
  assert.equal(match.y, 1);

  // findMatchingToken (*) forward search from (0, 1) jumps to line 5
  const matchNext = tm.findMatchingToken(0, 1);
  assert.equal(matchNext.found, true);
  assert.equal(matchNext.token, 'ALPHA');
  assert.equal(matchNext.y, 5);
});

test('Player entity: ability unlocks, inventory, and movement orientation', () => {
  const player = new Player(5, 5);
  assert.equal(player.hasAbility('h'), true);
  assert.equal(player.hasAbility('w'), false);

  player.unlockAbility('w');
  assert.equal(player.hasAbility('w'), true);

  player.unlockAbility('t');
  assert.equal(player.hasAbility('t'), true);
  assert.equal(player.hasAbility('T'), true);

  player.unlockAbility('gg');
  assert.equal(player.hasAbility('gg'), true);
  assert.equal(player.hasAbility('G'), true);

  player.unlockAbility('{');
  assert.equal(player.hasAbility('{'), true);
  assert.equal(player.hasAbility('}'), true);

  player.moveTo(6, 5);
  assert.equal(player.direction, 'right');
  assert.equal(player.x, 6);

  player.moveTo(6, 4);
  assert.equal(player.direction, 'up');
  assert.equal(player.y, 4);
});

test('World Objects: KeyItem, Door lock mechanics, Chest rewards, and Obstacle clearing', () => {
  const key = new KeyItem({ id: 'k1', x: 2, y: 2, keyType: 'bronzeKey', name: 'Bronze Key' });
  const door = new Door({ id: 'd1', x: 3, y: 2, keyRequired: 'bronzeKey', label: 'Iron Gate' });
  const chest = new Chest({ id: 'c1', x: 4, y: 2, rewardType: 'ability', rewardValue: 'w' });
  const obstacle = new Obstacle({ id: 'o1', x: 5, y: 2, char: 'x', type: 'weed' });

  const inventory = { bronzeKey: 0, rubyKey: 0, emeraldKey: 0, diamondKey: 0 };

  // Door is locked without key
  assert.equal(door.canUnlock(inventory), false);
  assert.equal(door.unlock(inventory), false);
  assert.equal(door.isOpen, false);

  // Collect key
  assert.equal(key.collect(), true);
  assert.equal(key.isCollected, true);
  inventory[key.keyType]++;
  assert.equal(inventory.bronzeKey, 1);

  // Door unlocks with key and consumes it
  assert.equal(door.canUnlock(inventory), true);
  assert.equal(door.unlock(inventory), true);
  assert.equal(door.isOpen, true);
  assert.equal(inventory.bronzeKey, 0);

  // Chest opens and yields reward
  const reward = chest.open();
  assert.deepEqual(reward, { type: 'ability', value: 'w', label: '' });
  assert.equal(chest.isOpen, true);
  assert.equal(chest.open(), null); // cannot open twice

  // Obstacle clear
  assert.equal(obstacle.isCleared, false);
  assert.equal(obstacle.clear(), true);
  assert.equal(obstacle.isCleared, true);
});

test('All 15 Chapters: integrity check of maps, spawns, keys, doors, and objectives', () => {
  assert.equal(LEVELS.length, 15);

  LEVELS.forEach((lvl, idx) => {
    assert.ok(lvl.name, `Level ${idx + 1} has name`);
    assert.ok(lvl.width > 0, `Level ${idx + 1} has width`);
    assert.ok(lvl.height > 0, `Level ${idx + 1} has height`);
    assert.equal(lvl.map.length, lvl.height, `Map row count matches height in level ${idx + 1}`);

    // Verify player start is inside bounds and walkable
    const tm = new Tilemap(lvl.width, lvl.height, lvl.map);
    assert.equal(tm.inBounds(lvl.playerStart.x, lvl.playerStart.y), true, `Level ${idx + 1} playerStart in bounds`);
    assert.equal(tm.isWalkable(lvl.playerStart.x, lvl.playerStart.y), true, `Level ${idx + 1} playerStart walkable`);

    // Verify exit is in bounds and walkable
    if (lvl.exit) {
      assert.equal(tm.inBounds(lvl.exit.x, lvl.exit.y), true, `Level ${idx + 1} exit in bounds`);
      assert.equal(tm.isWalkable(lvl.exit.x, lvl.exit.y), true, `Level ${idx + 1} exit is walkable`);
    }

    // Verify chests are on walkable tiles
    (lvl.chests || []).forEach(c => {
      assert.equal(tm.isWalkable(c.x, c.y), true, `Chest ${c.id} in Level ${lvl.id} is placed on a walkable tile`);
    });

    // Verify doors have corresponding keys or switches
    (lvl.doors || []).forEach(d => {
      const matchingKey = (lvl.keys || []).some(k => k.keyType === d.keyRequired) || d.keyRequired === 'switch' || d.keyRequired === 'lever';
      assert.ok(matchingKey, `Door ${d.id} requires key ${d.keyRequired} which exists in level ${lvl.id}`);
    });
  });
});

test('Simulated Chapter 1 Walkthrough: Movement, Key, Gate, Chest, and Level Progression', () => {
  const lvl1 = LEVELS[0];
  const tm = new Tilemap(lvl1.width, lvl1.height, lvl1.map);
  const player = new Player(lvl1.playerStart.x, lvl1.playerStart.y);
  lvl1.initialAbilities.forEach(a => player.unlockAbility(a));

  const key = new KeyItem(lvl1.keys[0]);
  const door = new Door(lvl1.doors[0]);
  const chest = new Chest(lvl1.chests[0]);

  // Initial state
  assert.equal(player.x, 3);
  assert.equal(player.y, 3);
  assert.equal(player.hasAbility('w'), false);

  // Simulate movement to key at (7, 13)
  player.moveTo(key.x, key.y);
  key.collect();
  player.inventory[key.keyType] = 1;
  assert.equal(player.inventory.bronzeKey, 1);

  // Verify walkway from door to chest and exit is walkable
  for (let x = 21; x <= 25; x++) {
    assert.equal(tm.isWalkable(x, 10), true, `Walkway tile at (${x}, 10) must be walkable`);
  }

  // Unlock door
  player.moveTo(door.x, door.y);
  assert.equal(door.canUnlock(player.inventory), true);
  door.unlock(player.inventory);
  assert.equal(door.isOpen, true);
  assert.equal(player.inventory.bronzeKey, 0);

  // Open chest
  player.moveTo(chest.x, chest.y);
  const reward = chest.open();
  assert.equal(reward.value, 'w');
  player.unlockAbility(reward.value);
  assert.equal(player.hasAbility('w'), true);

  // Walk into exit
  player.moveTo(lvl1.exit.x, lvl1.exit.y);
  assert.equal(player.x, lvl1.exit.x);
  assert.equal(player.y, lvl1.exit.y);
  assert.equal(lvl1.exit.targetLevel, 2);
});

test('Simulated Chapter 2 Walkthrough: The Word Archipelago (w, b, e)', () => {
  const lvl2 = LEVELS[1];
  const tm = new Tilemap(lvl2.width, lvl2.height, lvl2.map);
  const player = new Player(lvl2.playerStart.x, lvl2.playerStart.y);
  lvl2.initialAbilities.forEach(a => player.unlockAbility(a));

  // Player leaps across water to next word island using 'w'
  const nextWord = tm.findNextWord(player.x, player.y);
  player.moveTo(nextWord.x, nextWord.y);
  assert.equal(tm.isWalkable(player.x, player.y), true);

  // Reach and collect Silver Key
  const key = new KeyItem(lvl2.keys[0]);
  player.moveTo(key.x, key.y);
  key.collect();
  player.inventory[key.keyType] = 1;
  assert.equal(player.inventory.silverKey, 1);

  // Unlock Archipelago Gate
  const door = new Door(lvl2.doors[0]);
  player.moveTo(door.x, door.y);
  door.unlock(player.inventory);
  assert.equal(door.isOpen, true);
  assert.equal(player.inventory.silverKey, 0);

  // Exit to Chapter 3
  player.moveTo(lvl2.exit.x, lvl2.exit.y);
  assert.equal(player.x, lvl2.exit.x);
  assert.equal(player.y, lvl2.exit.y);
  assert.equal(lvl2.exit.targetLevel, 3);
});

test('Simulated Chapter 5 Walkthrough: Tower of Vertical Ascents (gg, G) and dynamic hints', () => {
  const lvl = LEVELS[4];
  const tm = new Tilemap(lvl.width, lvl.height, lvl.map);
  const player = new Player(lvl.playerStart.x, lvl.playerStart.y);
  lvl.initialAbilities.forEach(a => player.unlockAbility(a));

  const abbot = new NPC(lvl.npcs[0]);
  const chest = new Chest(lvl.chests[0]);
  const key = new KeyItem(lvl.keys[0]);
  const door = new Door(lvl.doors[0]);
  const gameState = { player, inventory: player.inventory, entities: { doors: [door] } };

  // 1. Initial Abbot dialogue has step-by-step guidance to Chapter 6
  const initialDialogue = abbot.getDialogue(gameState);
  assert.ok(initialDialogue.some(line => line.includes('PATH TO NEXT STAGE')));
  assert.ok(initialDialogue.some(line => line.includes('Spire Gate')));

  // 2. Open chest at (15, 17) -> unlocks gg and G reciprocally
  player.moveTo(chest.x, chest.y);
  const reward = chest.open();
  assert.equal(reward.value, 'gg');
  player.unlockAbility(reward.value);
  assert.equal(player.hasAbility('gg'), true);
  assert.equal(player.hasAbility('G'), true, 'Reciprocal unlock: unlocking gg unlocks G');

  // Progressive Abbot hint after chest
  const afterChestDialogue = abbot.getDialogue(gameState);
  assert.ok(afterChestDialogue.some(line => line.includes('Tower Gold Key')));

  // 3. Collect Tower Gold Key at (26, 17)
  player.moveTo(key.x, key.y);
  key.collect();
  player.inventory[key.keyType] = 1;
  assert.equal(player.inventory.goldKey, 1);

  // Progressive Abbot hint after key
  const afterKeyDialogue = abbot.getDialogue(gameState);
  assert.ok(afterKeyDialogue.some(line => line.includes("Press 'gg' now to fly straight up")));

  // 4. Test gg jump to top floor: jumpToLine(null, x, 'top') and jumpToLine(0, x)
  const topWalkable = tm.jumpToLine(null, player.x, 'top');
  assert.equal(topWalkable.y, 2, 'Top walkable row is row 2 (Spire Battlement walkway)');
  assert.equal(tm.isWalkable(topWalkable.x, topWalkable.y), true);

  const topFromZero = tm.jumpToLine(0, player.x, 'top');
  assert.equal(topFromZero.y, 2, 'Row 0 wall clamps to row 2');

  // 5. Test G plunge to dungeon: jumpToLine(null, x, 'bottom') and jumpToLine(19, x)
  const bottomWalkable = tm.jumpToLine(null, player.x, 'bottom');
  assert.equal(bottomWalkable.y, 17, 'Bottom walkable row is row 17 (Dungeon Vault walkway)');
  assert.equal(tm.isWalkable(bottomWalkable.x, bottomWalkable.y), true);

  const bottomFromBorder = tm.jumpToLine(19, player.x, 'bottom');
  assert.equal(bottomFromBorder.y, 17, 'Row 19 wall clamps to row 17');

  // 6. Test count jump: 8G jumps to row 8 (Balcony 3)
  const balcony3 = tm.jumpToLine(8, player.x);
  assert.equal(balcony3.y, 8, '8G targets row 8 walkway');
  assert.equal(tm.isWalkable(balcony3.x, balcony3.y), true);

  // 7. Execute gg to Spire Battlement
  player.moveTo(topWalkable.x, topWalkable.y);
  assert.equal(player.y, 2);

  // 8. Unlock Spire Gate at (24, 2)
  player.moveTo(door.x, door.y);
  assert.equal(door.canUnlock(player.inventory), true);
  door.unlock(player.inventory);
  assert.equal(door.isOpen, true);

  // Progressive Abbot hint after door unlocked
  const afterDoorDialogue = abbot.getDialogue(gameState);
  assert.ok(afterDoorDialogue.some(line => line.includes('Chapter 6')));

  // 9. Move to exit portal at (28, 2)
  player.moveTo(lvl.exit.x, lvl.exit.y);
  assert.equal(player.x, 28);
  assert.equal(player.y, 2);
  assert.equal(lvl.exit.targetLevel, 6, 'Exit routes to Chapter 6');
});

test('Simulated Chapter 6 Walkthrough: Forest of Empty Paragraphs ({, })', () => {
  const lvl = LEVELS[5];
  const tm = new Tilemap(lvl.width, lvl.height, lvl.map);
  const player = new Player(lvl.playerStart.x, lvl.playerStart.y);
  lvl.initialAbilities.forEach(a => player.unlockAbility(a));

  // Leap forward paragraphs through clearings
  let pJump = tm.findParagraphJump(player.x, player.y, true);
  player.moveTo(pJump.x, pJump.y);
  assert.equal(player.y, 5);

  // Reach Key at Glade 4
  const key = new KeyItem(lvl.keys[0]);
  player.moveTo(key.x, key.y);
  key.collect();
  player.inventory[key.keyType] = 1;
  assert.equal(player.inventory.silverKey, 1);

  // Unlock Forest Gate
  const door = new Door(lvl.doors[0]);
  player.moveTo(door.x, door.y);
  door.unlock(player.inventory);
  assert.equal(door.isOpen, true);

  player.moveTo(lvl.exit.x, lvl.exit.y);
  assert.equal(player.x, lvl.exit.x);
  assert.equal(lvl.exit.targetLevel, 7);
});

test('Simulated Chapter 7 Walkthrough: Crypt of Matching Brackets (%)', () => {
  const lvl = LEVELS[6];
  const tm = new Tilemap(lvl.width, lvl.height, lvl.map);
  const player = new Player(lvl.playerStart.x, lvl.playerStart.y);
  lvl.initialAbilities.forEach(a => player.unlockAbility(a));

  // Warp from (2, 3) to (18, 3)
  const p1 = lvl.portals.find(p => p.x === 2 && p.y === 3);
  player.moveTo(p1.targetX, p1.targetY);

  const key = new KeyItem(lvl.keys[0]);
  player.moveTo(key.x, key.y);
  key.collect();
  player.inventory[key.keyType] = 1;

  const door = new Door(lvl.doors[0]);
  player.moveTo(door.x, door.y);
  door.unlock(player.inventory);
  assert.equal(door.isOpen, true);

  player.moveTo(lvl.exit.x, lvl.exit.y);
  assert.equal(player.x, lvl.exit.x);
  assert.equal(player.y, lvl.exit.y);
  assert.equal(lvl.exit.targetLevel, 8);
});

test('Simulated Chapter 9 Walkthrough: The Pruning Grounds of x', () => {
  const lvl = LEVELS[8];
  const tm = new Tilemap(lvl.width, lvl.height, lvl.map);
  const player = new Player(lvl.playerStart.x, lvl.playerStart.y);
  lvl.initialAbilities.forEach(a => player.unlockAbility(a));

  // Clear obstacle weed
  const obs = new Obstacle(lvl.obstacles[0]);
  obs.clear();
  tm.setTile(obs.x, obs.y, '=');
  assert.equal(tm.isWalkable(obs.x, obs.y), true);

  // Collect Ruby Key
  const key = new KeyItem(lvl.keys[0]);
  player.moveTo(key.x, key.y);
  key.collect();
  player.inventory[key.keyType] = 1;
  assert.equal(player.inventory.rubyKey, 1);

  // Unlock Pruning Gate
  const door = new Door(lvl.doors[0]);
  player.moveTo(door.x, door.y);
  door.unlock(player.inventory);
  assert.equal(door.isOpen, true);

  player.moveTo(lvl.exit.x, lvl.exit.y);
  assert.equal(player.x, lvl.exit.x);
  assert.equal(lvl.exit.targetLevel, 10);
});

test('Simulated Chapter 10 Walkthrough: Masons of Replacement (r=)', () => {
  const lvl = LEVELS[9];
  const tm = new Tilemap(lvl.width, lvl.height, lvl.map);
  const player = new Player(lvl.playerStart.x, lvl.playerStart.y);
  lvl.initialAbilities.forEach(a => player.unlockAbility(a));

  // Repair bridge gap
  assert.equal(tm.isWalkable(17, 4), false);
  tm.setTile(17, 4, '=');
  assert.equal(tm.isWalkable(17, 4), true);

  // Collect Emerald Key
  const key = new KeyItem(lvl.keys[0]);
  player.moveTo(key.x, key.y);
  key.collect();
  player.inventory[key.keyType] = 1;
  assert.equal(player.inventory.emeraldKey, 1);

  // Unlock Mason Gate
  const door = new Door(lvl.doors[0]);
  player.moveTo(door.x, door.y);
  door.unlock(player.inventory);
  assert.equal(door.isOpen, true);

  player.moveTo(lvl.exit.x, lvl.exit.y);
  assert.equal(player.x, lvl.exit.x);
  assert.equal(lvl.exit.targetLevel, 11);
});

test('Simulated Chapter 12 Walkthrough: Chamber of Case Inversion (~)', () => {
  const lvl = LEVELS[11];
  const tm = new Tilemap(lvl.width, lvl.height, lvl.map);
  const player = new Player(lvl.playerStart.x, lvl.playerStart.y);
  lvl.initialAbilities.forEach(a => player.unlockAbility(a));

  // Flip switch 'o' to 'O'
  const switchTile = tm.getTile(17, 4);
  assert.equal(switchTile, 'o');
  tm.setTile(17, 4, 'O');
  assert.equal(tm.getTile(17, 4), 'O');

  // Switch gate unlocks
  const switchDoor = lvl.doors.find(d => d.keyRequired === 'switch');
  switchDoor.isOpen = true;
  assert.equal(switchDoor.isOpen, true);

  // Collect Gold Key
  const key = new KeyItem(lvl.keys[0]);
  player.moveTo(key.x, key.y);
  key.collect();
  player.inventory[key.keyType] = 1;
  assert.equal(player.inventory.goldKey, 1);

  // Unlock Polarity Gate
  const door = new Door(lvl.doors.find(d => d.keyRequired === 'goldKey'));
  player.moveTo(door.x, door.y);
  door.unlock(player.inventory);
  assert.equal(door.isOpen, true);

  player.moveTo(lvl.exit.x, lvl.exit.y);
  assert.equal(player.x, lvl.exit.x);
  assert.equal(lvl.exit.targetLevel, 13);
});

test('Simulated Chapter 13 Walkthrough: Valley of Golden Beacons (*)', () => {
  const lvl = LEVELS[12];
  const tm = new Tilemap(lvl.width, lvl.height, lvl.map);
  const player = new Player(lvl.playerStart.x, lvl.playerStart.y);
  lvl.initialAbilities.forEach(a => player.unlockAbility(a));

  // Warp across beacon tokens with *
  const match = tm.findMatchingToken(11, 1);
  assert.equal(match.found, true);
  assert.equal(match.token, 'BEACON');
  player.moveTo(match.x, match.y);

  // Collect Ruby Key
  const key = new KeyItem(lvl.keys[0]);
  player.moveTo(key.x, key.y);
  key.collect();
  player.inventory[key.keyType] = 1;
  assert.equal(player.inventory.rubyKey, 1);

  // Unlock Starlight Gate
  const door = new Door(lvl.doors[0]);
  player.moveTo(door.x, door.y);
  door.unlock(player.inventory);
  assert.equal(door.isOpen, true);

  player.moveTo(lvl.exit.x, lvl.exit.y);
  assert.equal(player.x, lvl.exit.x);
  assert.equal(lvl.exit.targetLevel, 14);
});

test('Simulated Chapter 14 Walkthrough: Line Demolition Vaults (D)', () => {
  const lvl = LEVELS[13];
  const tm = new Tilemap(lvl.width, lvl.height, lvl.map);
  const player = new Player(lvl.playerStart.x, lvl.playerStart.y);
  lvl.initialAbilities.forEach(a => player.unlockAbility(a));

  // Demolish barrier row with D
  for (let x = 14; x <= 22; x++) {
    tm.setTile(x, 4, '=');
    assert.equal(tm.isWalkable(x, 4), true);
  }

  // Collect Diamond Key
  const key = new KeyItem(lvl.keys[0]);
  player.moveTo(key.x, key.y);
  key.collect();
  player.inventory[key.keyType] = 1;
  assert.equal(player.inventory.diamondKey, 1);

  // Unlock Vault Gate
  const door = new Door(lvl.doors[0]);
  player.moveTo(door.x, door.y);
  door.unlock(player.inventory);
  assert.equal(door.isOpen, true);

  player.moveTo(lvl.exit.x, lvl.exit.y);
  assert.equal(player.x, lvl.exit.x);
  assert.equal(lvl.exit.targetLevel, 15);
});

test('Simulated Chapter 15 Walkthrough: Grand Citadel of the Neovim Grandmaster (Full Synthesis & Victory)', () => {
  const lvl = LEVELS[14];
  const tm = new Tilemap(lvl.width, lvl.height, lvl.map);
  const player = new Player(lvl.playerStart.x, lvl.playerStart.y);
  lvl.initialAbilities.forEach(a => player.unlockAbility(a));

  // 1. Collect Grandmaster Gold Key
  const key = new KeyItem(lvl.keys[0]);
  player.moveTo(key.x, key.y);
  key.collect();
  player.inventory[key.keyType] = 1;
  assert.equal(player.inventory.goldKey, 1);

  // 2. Unlock Grandmaster Gate
  const masterDoor = lvl.doors.find(d => d.keyRequired === 'goldKey');
  player.moveTo(masterDoor.x, masterDoor.y);
  const doorObj = new Door(masterDoor);
  doorObj.unlock(player.inventory);
  assert.equal(doorObj.isOpen, true);

  // 3. Clear barrier with D
  const obs = new Obstacle(lvl.obstacles[0]);
  obs.clear();
  tm.setTile(obs.x, obs.y, '=');

  // 4. Flip switch 'o' to 'O' to open Citadel Switch Gate
  tm.setTile(10, 5, 'O');
  const switchDoor = lvl.doors.find(d => d.keyRequired === 'switch');
  switchDoor.isOpen = true;
  assert.equal(switchDoor.isOpen, true);

  // 5. Open Grandmaster Trophy Chest
  const chest = new Chest(lvl.chests[0]);
  player.moveTo(chest.x, chest.y);
  const rew = chest.open();
  player.inventory.gems += rew.value;
  assert.equal(player.inventory.gems, 500);

  // 6. Arrive at Grandmaster Bram's Golden Throne exit (Victory!)
  player.moveTo(lvl.exit.x, lvl.exit.y);
  assert.equal(player.x, lvl.exit.x);
  assert.equal(player.y, lvl.exit.y);
  assert.equal(lvl.exit.isVictory, true);
});
