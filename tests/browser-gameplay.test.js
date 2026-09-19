import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
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

test('Real Browser Gameplay via CDP (No Screen Freeze & Interactive Play)', { skip: !chromeBin }, async () => {
  const chrome = spawn(chromeBin, [
    '--headless',
    '--remote-debugging-port=9223',
    '--no-first-run',
    '--no-default-browser-check'
  ]);

  await new Promise(r => setTimeout(r, 1200));

  try {
    const versionRes = await fetch('http://localhost:9223/json/version');
    assert.ok(versionRes.ok, 'Chrome CDP version endpoint reachable');

    const newTabRes = await fetch(`http://localhost:9223/json/new?file://${gameHtml}`, { method: 'PUT' });
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
  const chrome = spawn(chromeBin, [
    '--headless',
    '--remote-debugging-port=9224',
    '--no-first-run',
    '--no-default-browser-check'
  ]);

  await new Promise(r => setTimeout(r, 1200));

  try {
    const versionRes = await fetch('http://localhost:9224/json/version');
    assert.ok(versionRes.ok, 'Chrome CDP version endpoint reachable');

    const newTabRes = await fetch(`http://localhost:9224/json/new?file://${adventureHtml}`, { method: 'PUT' });
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

    ws.close();
  } finally {
    chrome.kill();
  }
});
