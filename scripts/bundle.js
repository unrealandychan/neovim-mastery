import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const gameJsDir = path.join(rootDir, 'game', 'js');
const outputFile = path.join(gameJsDir, 'bundle.js');

function buildBundle(baseDir, files, entryPoint, outputFile, title) {
  let bundleContent = `/**
 * ${title} - Standalone Offline Bundle
 * Generated automatically. Works seamlessly on both http:// and file:// protocols.
 */
(function() {
  'use strict';
  const modules = {};
  const cache = {};

  function defineModule(name, fn) {
    modules[name] = fn;
  }

  function requireModule(currentPath, relativePath) {
    let resolved = relativePath;
    if (relativePath.startsWith('.')) {
      const dir = pathDirname(currentPath);
      resolved = normalizePath(dir ? dir + '/' + relativePath : relativePath);
    }
    if (!resolved.endsWith('.js')) {
      resolved += '.js';
    }

    if (cache[resolved]) {
      return cache[resolved].exports;
    }
    if (!modules[resolved]) {
      throw new Error('Cannot find module "' + relativePath + '" from "' + currentPath + '" (resolved: "' + resolved + '")');
    }

    const mod = { exports: {} };
    cache[resolved] = mod;
    modules[resolved](mod.exports, function(dep) {
      return requireModule(resolved, dep);
    }, mod);
    return mod.exports;
  }

  function pathDirname(p) {
    const idx = p.lastIndexOf('/');
    return idx === -1 ? '' : p.slice(0, idx);
  }

  function normalizePath(p) {
    const parts = p.split('/');
    const res = [];
    for (const part of parts) {
      if (!part || part === '.') continue;
      if (part === '..') {
        res.pop();
      } else {
        res.push(part);
      }
    }
    return res.join('/');
  }
`;

  for (const relPath of files) {
    const fullPath = path.join(baseDir, relPath);
    let src = fs.readFileSync(fullPath, 'utf8');

    // 1. Convert imports: import { a, b } from './path.js';
    src = src.replace(/import\s*\{\s*([^}]+)\s*\}\s*from\s*['"]([^'"]+)['"];?/g, (m, imports, impPath) => {
      return `const { ${imports.trim()} } = require('${impPath}');`;
    });
    // import * as foo from '...'
    src = src.replace(/import\s*\*\s*as\s+(\w+)\s+from\s*['"]([^'"]+)['"];?/g, (m, alias, impPath) => {
      return `const ${alias} = require('${impPath}');`;
    });

    // 2. Convert export function / class
    src = src.replace(/export\s+function\s+([a-zA-Z0-9_$]+)/g, 'function $1');
    src = src.replace(/export\s+class\s+([a-zA-Z0-9_$]+)/g, 'class $1');

    // 3. Convert export const / let
    const exportedVars = [];
    src = src.replace(/export\s+(const|let|var)\s+([a-zA-Z0-9_$]+)/g, (m, decl, varName) => {
      exportedVars.push(varName);
      return `${decl} ${varName}`;
    });

    // 4. Convert export { a, b, c }
    src = src.replace(/export\s*\{\s*([^}]+)\s*\};?/g, (m, exportsList) => {
      const names = exportsList.split(',').map(s => s.trim()).filter(Boolean);
      const mappings = names.map(n => {
        if (n.includes(' as ')) {
          const [orig, alias] = n.split(/\s+as\s+/);
          return `${alias}: ${orig}`;
        }
        return `${n}: ${n}`;
      }).join(', ');
      return `Object.assign(exports, { ${mappings} });`;
    });

    // Collect defined top-level functions and classes
    const fnMatches = src.matchAll(/function\s+([a-zA-Z0-9_$]+)\s*\(/g);
    for (const match of fnMatches) {
      exportedVars.push(match[1]);
    }
    const classMatches = src.matchAll(/class\s+([a-zA-Z0-9_$]+)\s*[{]/g);
    for (const match of classMatches) {
      exportedVars.push(match[1]);
    }

    // Deduplicate exports assignment
    const uniqueExports = [...new Set(exportedVars)];
    const exportAssignments = uniqueExports.map(v => `try { exports.${v} = ${v}; } catch(e) {}`).join('\n  ');

    bundleContent += `\n/* Module: ${relPath} */\ndefineModule('${relPath}', function(exports, require, module) {\n`;
    bundleContent += src;
    bundleContent += `\n  ${exportAssignments}\n});\n`;
  }

  bundleContent += `\n  // Start the application\n  requireModule('', '${entryPoint}');\n})();\n`;

  fs.writeFileSync(outputFile, bundleContent, 'utf8');
  console.log(`Bundle generated successfully at ${outputFile} (${bundleContent.length} bytes)`);
}

// 1. Bundle 30-Day Dojo
const dojoFiles = [
  'editor/key-parser.js',
  'editor/text-objects.js',
  'editor/operators.js',
  'editor/command-mode.js',
  'editor/flash-mode.js',
  'editor/buffer.js',
  'editor/vim-engine.js',
  'stages/curriculum.js',
  'stages/evaluator.js',
  'ui/renderer.js',
  'ui/statusline.js',
  'ui/hud.js',
  'ui/diff-viewer.js',
  'ui/which-key.js',
  'ui/audio.js',
  'ui/modal.js',
  'state.js',
  'app.js',
];
buildBundle(
  path.join(rootDir, 'game', 'js'),
  dojoFiles,
  'app.js',
  path.join(rootDir, 'game', 'js', 'bundle.js'),
  'Neovim Mastery: The 30-Day Dojo'
);

// 2. Bundle Adventure RPG
const adventureFiles = [
  'engine/audio.js',
  'engine/tilemap.js',
  'entities/player.js',
  'entities/world-objects.js',
  'levels/level-data.js',
  'ui/dialogue.js',
  'ui/hud.js',
  'engine/renderer.js',
  'engine/input.js',
  'engine/game.js',
];
buildBundle(
  path.join(rootDir, 'adventure', 'js'),
  adventureFiles,
  'engine/game.js',
  path.join(rootDir, 'adventure', 'js', 'bundle.js'),
  'Vim Adventures: Realm of the Modal Hero'
);
