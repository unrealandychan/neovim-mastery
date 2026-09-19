import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const gameHtml = path.join(rootDir, 'game', 'index.html');

const chromePaths = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser'
];

const chromeBin = chromePaths.find(p => fs.existsSync(p));

async function waitForChrome(port, maxTries = 30) {
  for (let i = 0; i < maxTries; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (res.ok) return res;
    } catch (e) {}
    await new Promise(r => setTimeout(r, 200));
  }
  throw new Error(`Chrome failed to start on port ${port}`);
}

test('Real Browser Gameplay via CDP (No Screen Freeze & Interactive Play)', { skip: !chromeBin }, async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-test-1-'));
  const chrome = spawn(chromeBin, [
    '--headless=new',
    '--remote-debugging-port=9223',
    `--user-data-dir=${tmpDir}`,
    '--no-first-run',
    '--no-default-browser-check'
  ]);

  try {
    const versionRes = await waitForChrome(9223);
    assert.ok(versionRes.ok, 'Chrome CDP version endpoint reachable');

    const newTabRes = await fetch(`http://127.0.0.1:9223/json/new?file://${gameHtml}`, { method: 'PUT' });
    const tabData = await newTabRes.json();
    assert.ok(tabData.webSocketDebuggerUrl, 'WebSocket URL obtained');

    const ws = new WebSocket(tabData.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    let id = 1;
    function send(method, params = {}) {
      return new Promise((resolve) => {
        const msgId = id++;
        const handler = (event) => {
          const data = JSON.parse(event.data);
          if (data.id === msgId) {
            ws.removeEventListener('message', handler);
            resolve(data.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    async function pressKey(key) {
      await send('Input.dispatchKeyEvent', { type: 'keyDown', key });
      await send('Input.dispatchKeyEvent', { type: 'keyUp', key });
      await new Promise(r => setTimeout(r, 15));
    }

    await new Promise(r => setTimeout(r, 800));

    // 1. Initial State Check
    const evalInit = await send('Runtime.evaluate', {
      expression: `({
        hasApp: !!window.__vim_app,
        currentDay: window.__vim_app?.currentStage?.day,
        viewportLines: document.getElementById('editor-viewport')?.children.length,
        statusMode: document.querySelector('.status-mode')?.textContent.trim()
      })`,
      returnByValue: true
    });

    const initData = evalInit.result.value;
    assert.equal(initData.hasApp, true, 'Game App booted');
    assert.equal(initData.currentDay, 1, 'Day 1 loaded initially');
    assert.ok(initData.viewportLines > 0, 'Editor viewport has rendered lines');
    assert.equal(initData.statusMode, 'NORMAL', 'Mode is NORMAL');

    // 2. Play Day 1
    await pressKey('i');
    for (const ch of 'Welcome Eddie') {
      await pressKey(ch);
    }
    await pressKey('Escape');
    await pressKey(':');
    await pressKey('w');

    // Check command-line rendering
    const evalCmd = await send('Runtime.evaluate', {
      expression: `({
        cmdlineText: document.getElementById('cmdline-bar')?.textContent,
        cmdlineActive: document.getElementById('cmdline-bar')?.classList.contains('active')
      })`,
      returnByValue: true
    });
    assert.ok(evalCmd.result.value.cmdlineText.includes('w'));
    assert.equal(evalCmd.result.value.cmdlineActive, true);

    await pressKey('Enter');
    await new Promise(r => setTimeout(r, 400));

    // 3. Victory Modal Check
    const evalVictory = await send('Runtime.evaluate', {
      expression: `({
        stageCompleted: window.__vim_app.stageCompleted,
        modalOpen: document.getElementById('modal-overlay').classList.contains('open')
      })`,
      returnByValue: true
    });
    assert.equal(evalVictory.result.value.stageCompleted, true, 'Stage completed');
    assert.equal(evalVictory.result.value.modalOpen, true, 'Victory modal opened');

    // 4. Keyboard Navigation: Press Enter to advance to Day 2
    await pressKey('Enter');
    await new Promise(r => setTimeout(r, 300));

    const evalDay2 = await send('Runtime.evaluate', {
      expression: `({
        day: window.__vim_app.currentStage.day,
        modalOpen: document.getElementById('modal-overlay').classList.contains('open')
      })`,
      returnByValue: true
    });
    assert.equal(evalDay2.result.value.day, 2, 'Advanced to Day 2');
    assert.equal(evalDay2.result.value.modalOpen, false, 'Modal closed after advancement');

    ws.close();
  } finally {
    chrome.kill();
  }
});

test('Real Browser Gameplay via CDP: Vim Adventures RPG', { skip: !chromeBin }, async () => {
  const adventureHtml = path.join(rootDir, 'adventure', 'index.html');
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-test-2-'));
  const chrome = spawn(chromeBin, [
    '--headless=new',
    '--remote-debugging-port=9224',
    `--user-data-dir=${tmpDir}`,
    '--no-first-run',
    '--no-default-browser-check'
  ]);

  try {
    const versionRes = await waitForChrome(9224);
    assert.ok(versionRes.ok, 'Chrome CDP version endpoint reachable');

    const newTabRes = await fetch(`http://127.0.0.1:9224/json/new?file://${adventureHtml}`, { method: 'PUT' });
    const tabData = await newTabRes.json();
    assert.ok(tabData.webSocketDebuggerUrl, 'WebSocket URL obtained');

    const ws = new WebSocket(tabData.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    let id = 1;
    function send(method, params = {}) {
      return new Promise((resolve) => {
        const msgId = id++;
        const handler = (event) => {
          const data = JSON.parse(event.data);
          if (data.id === msgId) {
            ws.removeEventListener('message', handler);
            resolve(data.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    await send('Page.enable');
    await send('Runtime.enable');
    await send('DOM.enable');

    async function pressKey(key) {
      await send('Input.dispatchKeyEvent', { type: 'keyDown', key, text: key.length === 1 ? key : undefined });
      await send('Input.dispatchKeyEvent', { type: 'keyUp', key });
      await new Promise(r => setTimeout(r, 60));
    }

    await new Promise(r => setTimeout(r, 600));

    // Verify RPG game booted
    const evalInit = await send('Runtime.evaluate', {
      expression: `({
        hasGame: typeof window.adventureGame !== 'undefined',
        levelId: window.adventureGame?.currentLevel?.id,
        dialogueOpen: window.adventureGame?.dialogue?.isOpen,
        playerX: window.adventureGame?.player?.x,
        playerY: window.adventureGame?.player?.y
      })`,
      returnByValue: true
    });

    const initData = evalInit.result.value;
    assert.equal(initData.hasGame, true, 'RPG Adventure Game booted');
    assert.equal(initData.levelId, 1, 'Chapter 1 loaded');
    assert.equal(initData.playerX, 3);
    assert.equal(initData.playerY, 3);

    // Close Master Bram dialogue with Escape
    await pressKey('Escape');
    await new Promise(r => setTimeout(r, 200));

    const evalAfterEsc = await send('Runtime.evaluate', {
      expression: `({ dialogueOpen: window.adventureGame?.dialogue?.isOpen })`,
      returnByValue: true
    });
    assert.equal(evalAfterEsc.result.value.dialogueOpen, false, 'Dialogue closed via Escape');

    // Move player right with 'l'
    await pressKey('l');
    await new Promise(r => setTimeout(r, 200));

    const evalMove = await send('Runtime.evaluate', {
      expression: `({
        playerX: window.adventureGame?.player?.x,
        playerY: window.adventureGame?.player?.y,
        moves: window.adventureGame?.totalMoves
      })`,
      returnByValue: true
    });
    assert.equal(evalMove.result.value.playerX, 4, 'Player moved right with l');
    assert.equal(evalMove.result.value.moves, 1, 'Move counted');

    // Test Chapter 5: Vertical Ascents gg, G, and hints to next stage
    await send('Runtime.evaluate', {
      expression: `window.adventureGame.loadLevel(4);`,
      returnByValue: true
    });
    await new Promise(r => setTimeout(r, 400));

    const evalCh5Init = await send('Runtime.evaluate', {
      expression: `({
        levelId: window.adventureGame?.currentLevel?.id,
        playerX: window.adventureGame?.player?.x,
        playerY: window.adventureGame?.player?.y,
        hasExitEntity: !!window.adventureGame?.entities?.exit
      })`,
      returnByValue: true
    });
    assert.equal(evalCh5Init.result.value.levelId, 5, 'Chapter 5 loaded');
    assert.equal(evalCh5Init.result.value.playerY, 17, 'Player starts in dungeon floor row 17');
    assert.equal(evalCh5Init.result.value.hasExitEntity, true, 'Exit entity loaded for rendering');

    // Close any opening dialogue
    await pressKey('Escape');
    await new Promise(r => setTimeout(r, 200));

    // Test Hints Button & Modal functionality
    await send('Runtime.evaluate', {
      expression: `document.getElementById('btn-hints').click();`,
      returnByValue: true
    });
    await new Promise(r => setTimeout(r, 200));

    const evalHintsOpen = await send('Runtime.evaluate', {
      expression: `({
        isOpen: document.getElementById('modal-hints')?.classList.contains('open'),
        hasWalkthrough: document.getElementById('hint-modal-body')?.innerHTML.includes('Path to Next Stage'),
        hasGGCommand: document.getElementById('hint-modal-body')?.innerHTML.includes('gg')
      })`,
      returnByValue: true
    });
    assert.equal(evalHintsOpen.result.value.isOpen, true, 'Hints modal opened via Hints button');
    assert.equal(evalHintsOpen.result.value.hasWalkthrough, true, 'Hints modal displays step-by-step walkthrough');
    assert.equal(evalHintsOpen.result.value.hasGGCommand, true, 'Hints modal includes gg command explanation');

    // Dismiss hints via Escape
    await pressKey('Escape');
    await new Promise(r => setTimeout(r, 200));

    const evalHintsClosed = await send('Runtime.evaluate', {
      expression: `document.getElementById('modal-hints')?.classList.contains('open')`,
      returnByValue: true
    });
    assert.equal(evalHintsClosed.result.value, false, 'Hints modal closed via Escape');

    // Test toggle via 'H' key
    await pressKey('H');
    await new Promise(r => setTimeout(r, 200));
    const evalHToggled = await send('Runtime.evaluate', {
      expression: `document.getElementById('modal-hints')?.classList.contains('open')`,
      returnByValue: true
    });
    assert.equal(evalHToggled.result.value, true, "Hints modal opened via 'H' key shortcut");

    // Close hints via 'Got it!' button
    await send('Runtime.evaluate', {
      expression: `document.getElementById('btn-dismiss-hints').click();`,
      returnByValue: true
    });
    await new Promise(r => setTimeout(r, 200));

    // Unlock gg/G and grant gold key to test jumps and level progression
    await send('Runtime.evaluate', {
      expression: `
        window.adventureGame.player.unlockAbility('gg');
        window.adventureGame.player.inventory.goldKey = 1;
        window.adventureGame.hud.updateAbilities(window.adventureGame.player.unlockedAbilities);
        window.adventureGame.hud.updateInventory(window.adventureGame.player.inventory);
      `,
      returnByValue: true
    });

    // Press 'g' then 'g' to fly to top Spire Battlement
    await pressKey('g');
    await pressKey('g');
    await new Promise(r => setTimeout(r, 300));

    const evalAfterGG = await send('Runtime.evaluate', {
      expression: `({
        playerY: window.adventureGame?.player?.y
      })`,
      returnByValue: true
    });
    assert.equal(evalAfterGG.result.value.playerY, 2, "gg jumped player straight to row 2 Spire Battlement");

    // Press 'G' to plunge back down to dungeon floor
    await pressKey('G');
    await new Promise(r => setTimeout(r, 300));

    const evalAfterG = await send('Runtime.evaluate', {
      expression: `({
        playerY: window.adventureGame?.player?.y
      })`,
      returnByValue: true
    });
    assert.equal(evalAfterG.result.value.playerY, 17, "G plunged player back to row 17 dungeon floor");

    // Press '8' then 'G' to jump to row 8 Balcony 3
    await pressKey('8');
    await pressKey('G');
    await new Promise(r => setTimeout(r, 300));

    const evalAfter8G = await send('Runtime.evaluate', {
      expression: `({
        playerY: window.adventureGame?.player?.y
      })`,
      returnByValue: true
    });
    assert.equal(evalAfter8G.result.value.playerY, 8, "8G jumped player directly to row 8 Balcony");

    // Fly back to top row with gg
    await pressKey('g');
    await pressKey('g');
    await new Promise(r => setTimeout(r, 300));

    // Walk right towards Spire Gate at (24, 2) and exit at (28, 2)
    await send('Runtime.evaluate', {
      expression: `
        // Position player right in front of Spire Gate
        window.adventureGame.player.x = 23;
        window.adventureGame.player.y = 2;
      `,
      returnByValue: true
    });

    // Step into door at (24, 2)
    await pressKey('l');
    await new Promise(r => setTimeout(r, 200));

    const evalDoor = await send('Runtime.evaluate', {
      expression: `({
        doorOpen: window.adventureGame?.entities?.doors?.find(d => d.id === 'd5_spire')?.isOpen,
        playerX: window.adventureGame?.player?.x
      })`,
      returnByValue: true
    });
    assert.equal(evalDoor.result.value.doorOpen, true, 'Spire Gate unlocked with gold key');
    assert.equal(evalDoor.result.value.playerX, 24, 'Player walked through gate');

    // Walk to exit at (28, 2)
    await send('Runtime.evaluate', {
      expression: `
        window.adventureGame.player.x = 28;
        window.adventureGame.player.y = 2;
        window.adventureGame.checkInteractions();
      `,
      returnByValue: true
    });
    await new Promise(r => setTimeout(r, 400));

    const evalNextChapter = await send('Runtime.evaluate', {
      expression: `({
        levelId: window.adventureGame?.currentLevel?.id
      })`,
      returnByValue: true
    });
    assert.equal(evalNextChapter.result.value.levelId, 6, 'Successfully advanced to Chapter 6');

    ws.close();
  } finally {
    chrome.kill();
  }
});
