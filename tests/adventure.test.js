import test from 'node:test';
import assert from 'node:assert/strict';

import { Tilemap } from '../adventure/js/engine/tilemap.js';
import { Player } from '../adventure/js/entities/player.js';
import { Chest, Door, KeyItem, Gem, BracketPortal, Obstacle } from '../adventure/js/entities/world-objects.js';
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
  assert.equal(nextWord.y, 0);
  assert.equal(tm.getTile(nextWord.x, nextWord.y), 'q');

  // Jump from 'q' (6,0) to 'b' in 'brown' (14,0)
  const nextWord2 = tm.findNextWord(nextWord.x, nextWord.y);
  assert.equal(nextWord2.x, 14);
  assert.equal(tm.getTile(nextWord2.x, nextWord2.y), 'b');

  // Jump backward with 'b' from 'b' (14,0) back to 'q' (6,0)
  const prevWord = tm.findPrevWord(14, 0);
  assert.equal(prevWord.x, 6);
  assert.equal(tm.getTile(prevWord.x, prevWord.y), 'q');

  // Jump to word end with 'e' from 'T' (0,0) to 'e' in 'The' (2,0)
  const endWord = tm.findWordEnd(0, 0);
  assert.equal(endWord.x, 2);
  assert.equal(tm.getTile(endWord.x, endWord.y), 'e');

  // Jump backward to word end with 'ge' from 'b' (14,0) to 'k' in 'quick' (10,0)
  const prevEnd = tm.findPrevWordEnd(14, 0);
  assert.equal(prevEnd.x, 10);
  assert.equal(tm.getTile(prevEnd.x, prevEnd.y), 'k');
});

test('Tilemap line motions: 0, $, and inline char find f/t', () => {
  const line = "   const value = 42;   ";
  const tm = new Tilemap(23, 1, [line]);

  // '0' beginning of line
  assert.equal(tm.getLineStart(0, false), 0); // start of line column 0
  // '^' first non-blank
  assert.equal(tm.getLineStart(0, true), 3);
  // '$' end of line
  assert.equal(tm.getLineEnd(0), 19);

  // 'f' find character 'v' starting from index 3
  const findV = tm.findCharInRow(0, 3, 'v', true, false);
  assert.equal(findV.found, true);
  assert.equal(findV.x, 9);
  assert.equal(tm.getTile(findV.x, 0), 'v');

  // 't' till character '=' starting from index 9
  const tillEq = tm.findCharInRow(0, 9, '=', true, true);
  assert.equal(tillEq.found, true);
  assert.equal(tillEq.x, 14); // character right before '=' at index 15
});

test('Player entity: ability unlocks, inventory, and movement orientation', () => {
  const player = new Player(5, 5);
  assert.equal(player.hasAbility('h'), true);
  assert.equal(player.hasAbility('w'), false);

  player.unlockAbility('w');
  assert.equal(player.hasAbility('w'), true);

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

  const inventory = { bronzeKey: 0 };

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

test('All 5 Chapters: integrity check of maps, spawns, keys, doors, and objectives', () => {
  assert.equal(LEVELS.length, 5);

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

    // Verify doors have corresponding keys if required
    (lvl.doors || []).forEach(d => {
      const matchingKey = (lvl.keys || []).some(k => k.keyType === d.keyRequired);
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

  // Move to door at (21, 10)
  player.moveTo(door.x, door.y);
  assert.equal(door.canUnlock(player.inventory), true);
  door.unlock(player.inventory);
  assert.equal(door.isOpen, true);
  assert.equal(player.inventory.bronzeKey, 0);

  // Move to chest at (24, 10)
  player.moveTo(chest.x, chest.y);
  const reward = chest.open();
  assert.equal(reward.value, 'w');
  player.unlockAbility(reward.value);
  assert.equal(player.hasAbility('w'), true);

  // Move to exit at (25, 10)
  player.moveTo(lvl1.exit.x, lvl1.exit.y);
  assert.equal(player.x, lvl1.exit.x);
  assert.equal(player.y, lvl1.exit.y);
  assert.equal(lvl1.exit.targetLevel, 2);
});

test('Simulated Chapter 2 Walkthrough: Word Archipelago and Motions (w, b, e)', () => {
  const lvl = LEVELS[1];
  const tm = new Tilemap(lvl.width, lvl.height, lvl.map);
  const player = new Player(lvl.playerStart.x, lvl.playerStart.y);
  lvl.initialAbilities.forEach(a => player.unlockAbility(a));

  // Word jump to Island Castaway
  const nextWord = tm.findNextWord(player.x, player.y);
  player.moveTo(nextWord.x, nextWord.y);
  assert.equal(player.x, 9);
  assert.equal(player.y, 2);

  // Chest c2 yields 'e'
  const c2 = new Chest(lvl.chests.find(c => c.id === 'c2'));
  player.moveTo(c2.x, c2.y);
  player.unlockAbility(c2.open().value);
  assert.equal(player.hasAbility('e'), true);

  // Chest c3 yields 'b' and 'ge'
  const c3 = new Chest(lvl.chests.find(c => c.id === 'c3'));
  player.moveTo(c3.x, c3.y);
  player.unlockAbility(c3.open().value);
  assert.equal(player.hasAbility('b'), true);
  assert.equal(player.hasAbility('ge'), true);

  // Silver Key pickup
  const key = new KeyItem(lvl.keys[0]);
  player.moveTo(key.x, key.y);
  key.collect();
  player.inventory[key.keyType] = 1;

  // Archipelago Gate unlock
  const door = new Door(lvl.doors[0]);
  player.moveTo(door.x, door.y);
  door.unlock(player.inventory);
  assert.equal(door.isOpen, true);

  // Exit
  player.moveTo(lvl.exit.x, lvl.exit.y);
  assert.equal(player.x, lvl.exit.x);
  assert.equal(player.y, lvl.exit.y);
});

test('Simulated Chapter 3 Walkthrough: Temple of Find (f, $, 0)', () => {
  const lvl = LEVELS[2];
  const tm = new Tilemap(lvl.width, lvl.height, lvl.map);
  const player = new Player(lvl.playerStart.x, lvl.playerStart.y);
  lvl.initialAbilities.forEach(a => player.unlockAbility(a));

  // Chest c4 unlocks $ (plus 0, ^)
  const c4 = new Chest(lvl.chests.find(c => c.id === 'c4'));
  player.moveTo(c4.x, c4.y);
  player.unlockAbility(c4.open().value);
  assert.equal(player.hasAbility('$'), true);
  assert.equal(player.hasAbility('0'), true);

  // Chest c5 unlocks f (plus F, t, T, ;, ,)
  const c5 = new Chest(lvl.chests.find(c => c.id === 'c5'));
  player.moveTo(c5.x, c5.y);
  player.unlockAbility(c5.open().value);
  assert.equal(player.hasAbility('f'), true);
  assert.equal(player.hasAbility(';'), true);

  // Gold Key and Temple Gate
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
});

test('Simulated Chapter 4 Walkthrough: Crypt of Matching Brackets (%)', () => {
  const lvl = LEVELS[3];
  const tm = new Tilemap(lvl.width, lvl.height, lvl.map);
  const player = new Player(lvl.playerStart.x, lvl.playerStart.y);
  lvl.initialAbilities.forEach(a => player.unlockAbility(a));

  // Warp from (2, 3) to (18, 3)
  const p1 = lvl.portals.find(p => p.x === 2 && p.y === 3);
  player.moveTo(p1.targetX, p1.targetY);

  // Corridor column 19 to passage at (19, 14) into Altar
  for (let y = 3; y <= 15; y++) {
    assert.equal(tm.isWalkable(19, y), true, `Corridor tile at (19, ${y}) must be walkable`);
  }

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
});

test('Simulated Chapter 5 Walkthrough: Citadel of Enlightenment (x, r, and Victory)', () => {
  const lvl = LEVELS[4];
  const tm = new Tilemap(lvl.width, lvl.height, lvl.map);
  const player = new Player(lvl.playerStart.x, lvl.playerStart.y);
  lvl.initialAbilities.forEach(a => player.unlockAbility(a));

  // Cut obstacle with x
  const obs = new Obstacle(lvl.obstacles[0]);
  obs.clear();
  tm.setTile(obs.x, obs.y, '=');
  assert.equal(tm.isWalkable(obs.x, obs.y), true);

  // Repair bridge gap with r=
  assert.equal(tm.isWalkable(22, 8), false); // water before repair
  tm.setTile(22, 8, '=');
  assert.equal(tm.isWalkable(22, 8), true); // path after repair

  // Chest reward
  const chest = new Chest(lvl.chests[0]);
  player.moveTo(chest.x, chest.y);
  const rew = chest.open();
  player.inventory.gems += rew.value;
  assert.equal(player.inventory.gems, 250);

  // Reach victory exit at Grandmaster Bram
  player.moveTo(lvl.exit.x, lvl.exit.y);
  assert.equal(player.x, lvl.exit.x);
  assert.equal(player.y, lvl.exit.y);
  assert.equal(lvl.exit.isVictory, true);
});
