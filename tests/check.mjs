#!/usr/bin/env node
// Checks this repository before it is published. No dependency, Node 22 or later.
//
//   node tests/check.mjs
//
// What it checks:
//   1. every relative link of every Markdown file resolves, and the files this
//      repository promises are there;
//   2. every claim line of COMPARISON.md carries a URL, a quotation and the
//      date it was last read;
//   3. no em dash, no en dash, no emoji, nothing outside ASCII, anywhere in
//      the tree;
//   4. one version everywhere: the first section of CHANGELOG.md and a section
//      of RELEASES.md, whose lines alone name a package at a version (to check
//      that release); anywhere else an install line asks for @latest;
//   5. the opening of README.md, word for word, against the README of
//      @locker-protocol/agent-wallet-hyperliquid-trader when the build tree sits next to this one.
//      Skipped with a note when it does not.
//
// Exit 0 when everything passes, 1 with the list of problems otherwise.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const problems = [];
const notes = [];
const rel = (p) => path.relative(root, p) || '.';
const fail = (where, what) => problems.push(`${where}: ${what}`);

// The package README this repository documents, when the build tree is next
// door: public/agentic/ -> ../../packages/agentic/README.md.
const PACKAGE_README = path.resolve(root, '..', '..', 'packages', 'agentic', 'README.md');

// Files this repository promises, in the README and in the packages.
const REQUIRED_FILES = [
    'README.md',
    'COMPARISON.md',
    'CHANGELOG.md',
    'RELEASES.md',
    'SECURITY.md',
    'LICENSE',
    'docs/security-model.md',
    'docs/network.md',
    'docs/parity-metamask.md',
    '.github/ISSUE_TEMPLATE/bug.md',
    '.github/ISSUE_TEMPLATE/question.md',
];

function walk(dir, out = []) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        if (e.name === '.git' || e.name === 'node_modules') continue;
        const full = path.join(dir, e.name);
        if (e.isDirectory()) walk(full, out);
        else out.push(full);
    }
    return out;
}

const files = walk(root).sort();
const markdown = files.filter((f) => f.endsWith('.md')).sort();

// --- 1. The files, and every relative link -----------------------------------

for (const name of REQUIRED_FILES) {
    if (!fs.existsSync(path.join(root, name))) fail(name, 'missing');
}

let linksSeen = 0;
for (const f of markdown) {
    const text = fs.readFileSync(f, 'utf8');
    for (const m of text.matchAll(/\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
        const href = m[1];
        if (/^(https?:|mailto:|#)/.test(href)) continue;
        linksSeen++;
        const target = decodeURI(href.split('#')[0]);
        if (!target) continue;
        const resolved = path.resolve(path.dirname(f), target);
        if (!fs.existsSync(resolved)) fail(rel(f), `link ${href} does not resolve`);
    }
}
if (linksSeen === 0) fail('tests/check.mjs', 'no relative link was found: the reader is broken');

// --- 2. Every claim of COMPARISON.md is sourced, quoted and dated ------------
//
// A claim is a row of a table: the header row and the separator under it are
// not claims, and neither is anything outside a table.

const comparisonFile = path.join(root, 'COMPARISON.md');
if (!fs.existsSync(comparisonFile)) {
    fail('COMPARISON.md', 'missing');
} else {
    const lines = fs.readFileSync(comparisonFile, 'utf8').split('\n');
    const isRow = (l) => l.trimStart().startsWith('|');
    const isSeparator = (l) => isRow(l) && /^\s*\|[\s|:-]+\|\s*$/.test(l);
    let rows = 0;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!isRow(line) || isSeparator(line)) continue;
        // The header is the row immediately above a separator.
        if (i + 1 < lines.length && isSeparator(lines[i + 1])) continue;
        rows++;
        const where = `COMPARISON.md line ${i + 1}`;
        if (!/https?:\/\/[^\s)|]+/.test(line)) fail(where, 'a claim with no URL');
        if (!/"[^"]{10,}"/.test(line)) fail(where, 'a claim with nothing quoted from the source');
        if (!/\b\d{4}-\d{2}-\d{2}\b/.test(line)) fail(where, 'a claim with no date it was last read');
    }
    if (rows === 0) fail('COMPARISON.md', 'no claim was found: the reader is broken');
}

// --- 3 bis. What the agent key cannot do, said exactly ------------------------
//
// Hyperliquid refuses the agent key every withdrawal and every send, and ACCEPTS a
// deposit into a Hyperliquid vault from it (measured on mainnet, 2026-09-28): a line
// saying the key "cannot withdraw or send funds", "cannot send at all" or is refused
// "transfers" promises more than the exchange does (audit 2026-09-30, E-02).

const OVERCLAIMS = [/cannot withdraw or send funds/i, /cannot send at all/i, /refuses (?:it|that key|the agent key) for withdrawals, sends and transfers/i, /can never withdraw or send funds/i];
for (const f of files) {
    if (rel(f).startsWith('tests/')) continue; // this file names the phrasings it refuses
    fs.readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
        for (const re of OVERCLAIMS) if (re.test(line)) fail(`${rel(f)} line ${i + 1}`, `says more than Hyperliquid does about the agent key (${re.source}): it accepts a deposit into a Hyperliquid vault`);
    });
}

// --- 3. ASCII only: no em dash, no en dash, no emoji -------------------------

const EM_DASH = 0x2014;
const EN_DASH = 0x2013;
const isEmoji = (cp) =>
    (cp >= 0x1f000 && cp <= 0x1faff) || // pictographs, faces, symbols, objects
    (cp >= 0x2600 && cp <= 0x27bf) || // miscellaneous symbols and dingbats
    cp === 0xfe0f || // variation selector 16, the one that makes a glyph an emoji
    (cp >= 0x1f1e6 && cp <= 0x1f1ff); // regional indicators, the flags
const name = (cp) => {
    if (cp === EM_DASH) return 'an em dash';
    if (cp === EN_DASH) return 'an en dash';
    if (isEmoji(cp)) return 'an emoji';
    return 'a character outside ASCII';
};

for (const f of files) {
    const text = fs.readFileSync(f, 'utf8');
    let line = 1;
    const seen = new Set();
    for (const ch of text) {
        if (ch === '\n') { line++; continue; }
        const cp = ch.codePointAt(0);
        if (cp < 0x80) continue;
        const key = `${cp}:${line}`;
        if (seen.has(key)) continue;
        seen.add(key);
        fail(rel(f), `line ${line} holds ${name(cp)} (U+${cp.toString(16).toUpperCase().padStart(4, '0')})`);
    }
}

// --- 3 ter. What npm ships: no em dash, no en dash, no emoji ------------------
//
// The READMEs npm shows on each package page and the JavaScript the packages ship escaped
// the gate above, which reads this folder alone (audit 2, G13-19). They keep the glyphs
// lpa prints on purpose (box drawing, arrows, its spinner), so only the dashes and the
// characters drawn as emoji are refused there.

const PACKAGES = path.resolve(root, '..', '..', 'packages');
const LPA_PACKAGES_DIR = process.env.LPA_PACKAGES_DIR ? path.resolve(process.env.LPA_PACKAGES_DIR) : PACKAGES;
// The flags' regional indicators are drawn as emoji by themselves (Emoji_Presentation).
const drawnAsEmoji = (ch) => /\p{Emoji_Presentation}/u.test(ch) || ch === '\uFE0F';
const shipped = [];
if (!fs.existsSync(LPA_PACKAGES_DIR)) {
    notes.push(`The packages were not read for dashes and emoji: ${path.relative(root, LPA_PACKAGES_DIR)} is not there, which is normal in a clone of this repository alone.`);
} else {
    for (const pkg of fs.readdirSync(LPA_PACKAGES_DIR).sort()) {
        const dir = path.join(LPA_PACKAGES_DIR, pkg);
        if (!fs.statSync(dir).isDirectory()) continue;
        if (fs.existsSync(path.join(dir, 'README.md'))) shipped.push(path.join(dir, 'README.md'));
        for (const sub of ['bin', 'dist']) {
            if (fs.existsSync(path.join(dir, sub))) shipped.push(...walk(path.join(dir, sub)).filter((f) => /\.(?:m?js|d\.ts)$/.test(f)));
        }
    }
    for (const f of shipped) {
        const where = path.relative(LPA_PACKAGES_DIR, f);
        let line = 1;
        const seen = new Set();
        for (const ch of fs.readFileSync(f, 'utf8')) {
            if (ch === '\n') { line++; continue; }
            const cp = ch.codePointAt(0);
            if (cp < 0x80) continue;
            const what = cp === EM_DASH ? 'an em dash' : cp === EN_DASH ? 'an en dash' : drawnAsEmoji(ch) ? 'an emoji' : null;
            if (what === null || seen.has(`${cp}:${line}`)) continue;
            seen.add(`${cp}:${line}`);
            fail(`packages/${where}`, `line ${line} holds ${what} (U+${cp.toString(16).toUpperCase().padStart(4, '0')})`);
        }
    }
}

// --- 4. One version everywhere -----------------------------------------------

const changelog = fs.existsSync(path.join(root, 'CHANGELOG.md')) ? fs.readFileSync(path.join(root, 'CHANGELOG.md'), 'utf8') : '';
const first = /^##\s+(\d+\.\d+\.\d+)\b/m.exec(changelog);
let VERSION = null;
if (!first) {
    fail('CHANGELOG.md', 'no section headed by a version');
} else {
    VERSION = first[1];
    const releases = fs.existsSync(path.join(root, 'RELEASES.md')) ? fs.readFileSync(path.join(root, 'RELEASES.md'), 'utf8') : '';
    if (!new RegExp(`^##\\s+${VERSION.replace(/\./g, '\\.')}\\b`, 'm').test(releases)) fail('RELEASES.md', `no section for ${VERSION}`);
    for (const f of markdown) {
        const text = fs.readFileSync(f, 'utf8');
        for (const m of text.matchAll(/@locker-protocol\/[a-z-]+@([0-9][^\s"'`)\],]*)/g)) {
            if (rel(f) !== 'RELEASES.md') fail(rel(f), `${m[0]} names a version: write @latest`);
            else if (m[1] !== VERSION) fail(rel(f), `the version ${m[1]} is not ${VERSION}`);
        }
    }
}

// --- 5. The opening of the README, word for word -----------------------------
//
// The formula is the bold line, the line under it, and the three lines that
// say where the key is, who can withdraw, and what goes where.

function formula(text, where) {
    const lines = text.split('\n');
    const start = lines.findIndex((l) => l.startsWith('**Your private key is nowhere'));
    if (start === -1) { fail(where, 'the opening line of the formula is missing'); return null; }
    const after = lines.slice(start + 1).filter((l) => l.trim() !== '');
    const subtitle = after[0];
    const bullets = after.slice(1, 4);
    if (subtitle === undefined || bullets.length < 3 || !bullets.every((b) => b.startsWith('- **'))) {
        fail(where, 'the formula is not the bold line, its subtitle and three lines');
        return null;
    }
    return [lines[start], subtitle, ...bullets].join('\n');
}

const ours = formula(fs.readFileSync(path.join(root, 'README.md'), 'utf8'), 'README.md');
if (!fs.existsSync(PACKAGE_README)) {
    notes.push(`The formula was not compared: ${path.relative(root, PACKAGE_README)} is not there, which is normal in a clone of this repository alone.`);
} else if (ours !== null) {
    const theirs = formula(fs.readFileSync(PACKAGE_README, 'utf8'), 'packages/agentic/README.md');
    if (theirs !== null && ours !== theirs) {
        const a = ours.split('\n');
        const b = theirs.split('\n');
        for (let i = 0; i < Math.max(a.length, b.length); i++) {
            if (a[i] !== b[i]) fail('README.md', `line ${i + 1} of the formula differs from the one in packages/agentic/README.md:\n    here:  ${a[i] ?? '(nothing)'}\n    there: ${b[i] ?? '(nothing)'}`);
        }
    }
}

// --- Report ------------------------------------------------------------------

for (const n of notes) console.log(`note: ${n}`);

if (problems.length) {
    console.error(`\ncheck failed, ${problems.length} problem${problems.length > 1 ? 's' : ''}:`);
    for (const p of problems) console.error(`- ${p}`);
    process.exit(1);
}

console.log(`check: ok (${files.length} files, ${markdown.length} Markdown, ${linksSeen} relative links, version ${VERSION}; ${shipped.length} files shipped by the packages)`);
