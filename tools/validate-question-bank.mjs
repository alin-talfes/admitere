import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const QUESTIONS_DIR = path.join(ROOT, 'js', 'questions');
const REGISTRY = path.join(ROOT, 'js', 'questions.js');
const APP = path.join(ROOT, 'js', 'app.js');
const INDEX = path.join(ROOT, 'index.html');

const TOPICS = {
  romana: new Set(['vocabular', 'fonetica', 'morfosintaxa', 'sintaxa']),
  istorie: new Set([
    'constitutii',
    'autonomii-institutii',
    'stat-modern',
    'romania-postbelica',
    'diplomatie-conflict',
    'concert-european'
  ])
};

function fail(message) {
  throw new Error(message);
}

function runScript(file, sandbox) {
  const source = fs.readFileSync(file, 'utf8');
  try {
    vm.runInContext(source, sandbox, { filename: path.relative(ROOT, file) });
  } catch (error) {
    fail(`${path.relative(ROOT, file)}: ${error.message}`);
  }
}

function makeSandbox() {
  const context = vm.createContext({
    window: {},
    console: {
      log() {},
      warn() {},
      error() {}
    }
  });
  runScript(REGISTRY, context);
  if (!Array.isArray(context.window.QUESTION_BANK)) fail('Registrul nu a creat QUESTION_BANK.');
  if (typeof context.window.registerQuestionBatch !== 'function') fail('registerQuestionBatch nu este disponibil.');
  return context;
}

function validateQuestion(question, origin, index, seenIds) {
  const where = `${origin} #${index + 1}`;
  if (!question || typeof question !== 'object') fail(`${where}: structură invalidă.`);
  if (!/^\d{4}-(?:ro|ist)-\d{3}$/.test(question.id ?? '')) fail(`${where}: ID invalid ${String(question.id)}.`);
  if (seenIds.has(question.id)) fail(`${where}: ID duplicat ${question.id}.`);
  seenIds.add(question.id);

  if (!TOPICS[question.subject]) fail(`${question.id}: materie invalidă ${String(question.subject)}.`);
  if (!TOPICS[question.subject].has(question.topic)) fail(`${question.id}: temă invalidă ${String(question.topic)}.`);
  if (typeof question.prompt !== 'string' || !question.prompt.trim()) fail(`${question.id}: enunț lipsă.`);
  if (!Array.isArray(question.options) || question.options.length !== 4) fail(`${question.id}: trebuie să aibă exact 4 variante.`);
  if (question.options.some(option => typeof option !== 'string' || !option.trim())) fail(`${question.id}: variantă goală sau invalidă.`);
  if (!Number.isInteger(question.correctIndex) || question.correctIndex < 0 || question.correctIndex > 3) fail(`${question.id}: correctIndex invalid.`);
  if (typeof question.source !== 'string' || !question.source.trim()) fail(`${question.id}: sursă lipsă.`);
  if (typeof question.explanation !== 'string' || !question.explanation.trim()) fail(`${question.id}: explicație lipsă.`);
}

function moduleMetadata(file) {
  const base = path.basename(file, '.js');
  const match = /^(\d{4})-(ro|history)$/.exec(base);
  if (!match) fail(`Nume de modul neașteptat: ${base}.js`);
  return { year: match[1], kind: match[2] };
}

function validateModuleIdentity(file, beforeCount, sandbox) {
  const { year, kind } = moduleMetadata(file);
  const expectedSubject = kind === 'ro' ? 'romana' : 'istorie';
  const expectedIdPart = kind === 'ro' ? '-ro-' : '-ist-';

  sandbox.window.QUESTION_BANK.slice(beforeCount).forEach(question => {
    if (!question.id.startsWith(`${year}${expectedIdPart}`)) {
      fail(`${path.basename(file)} conține ID din alt an/tip: ${question.id}.`);
    }
    if (question.subject !== expectedSubject) {
      fail(`${question.id}: materia nu corespunde fișierului ${path.basename(file)}.`);
    }
  });
}

function loadModules(moduleFiles, label) {
  const sandbox = makeSandbox();
  const seenIds = new Set();

  for (const file of moduleFiles) {
    const before = sandbox.window.QUESTION_BANK.length;
    runScript(file, sandbox);
    validateModuleIdentity(file, before, sandbox);
  }

  sandbox.window.QUESTION_BANK.forEach((question, index) => validateQuestion(question, label, index, seenIds));

  const skipped = sandbox.window.QUESTION_AUDIT?.skipped ?? [];
  const activeIds = new Set(sandbox.window.QUESTION_BANK.map(question => question.id));
  for (const id of skipped) {
    if (activeIds.has(id)) fail(`${id}: item carantinat prezent în banca activă.`);
  }

  return {
    registered: sandbox.window.QUESTION_BANK.length,
    quarantinedLoaded: skipped.length,
    skipped: [...skipped]
  };
}

function getActiveModuleFiles() {
  const html = fs.readFileSync(INDEX, 'utf8');
  const scripts = [...html.matchAll(/<script\s+src="([^"]+)"/g)].map(match => match[1]);
  const modules = scripts.filter(src => /^js\/questions\/[^/]+\.js$/.test(src));
  const duplicateScripts = modules.filter((src, index) => modules.indexOf(src) !== index);
  if (duplicateScripts.length) fail(`Module încărcate duplicat în index.html: ${[...new Set(duplicateScripts)].join(', ')}`);

  return modules.map(src => {
    const file = path.join(ROOT, src);
    if (!fs.existsSync(file)) fail(`index.html încarcă un modul inexistent: ${src}.`);
    return file;
  });
}

function validateDomContract() {
  const html = fs.readFileSync(INDEX, 'utf8');
  const app = fs.readFileSync(APP, 'utf8');

  const htmlIds = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  const duplicateIds = htmlIds.filter((id, index) => htmlIds.indexOf(id) !== index);
  if (duplicateIds.length) fail(`ID-uri HTML duplicate: ${[...new Set(duplicateIds)].join(', ')}`);
  const idSet = new Set(htmlIds);

  const htmlClasses = new Set();
  for (const match of html.matchAll(/\bclass="([^"]+)"/g)) {
    match[1].split(/\s+/).filter(Boolean).forEach(className => htmlClasses.add(className));
  }

  // Unele elemente sunt create numai în JavaScript (de exemplu answer-button), deci
  // clasele lor nu trebuie să existe inițial în index.html.
  const dynamicClasses = new Set();
  for (const match of app.matchAll(/\.className\s*=\s*['"]([^'"]+)['"]/g)) {
    match[1].split(/\s+/).filter(Boolean).forEach(className => dynamicClasses.add(className));
  }
  for (const match of app.matchAll(/\.classList\.add\(\s*['"]([^'"]+)['"]\s*\)/g)) {
    dynamicClasses.add(match[1]);
  }

  // $() returnează un singur element sau null. Selectoarele statice simple trebuie să
  // existe fie în HTML, fie să desemneze o clasă creată explicit dinamic de app.js.
  const singleSelectors = [...app.matchAll(/\$\(\s*['"]([#.][A-Za-z0-9_-]+)['"]\s*\)/g)]
    .map(match => match[1]);

  for (const selector of new Set(singleSelectors)) {
    if (selector.startsWith('#') && !idSet.has(selector.slice(1))) {
      fail(`Contract DOM rupt: app.js folosește ${selector}, dar index.html nu conține acest ID.`);
    }
    if (selector.startsWith('.')) {
      const className = selector.slice(1);
      if (!htmlClasses.has(className) && !dynamicClasses.has(className)) {
        fail(`Contract DOM rupt: app.js folosește ${selector}, dar clasa nu există în HTML și nu este creată dinamic.`);
      }
    }
  }

  const directListenerIds = [...app.matchAll(/\$\(\s*['"]#([A-Za-z0-9_-]+)['"]\s*\)\.addEventListener\s*\(/g)]
    .map(match => match[1]);
  for (const id of new Set(directListenerIds)) {
    if (!idSet.has(id)) fail(`Listener către ID inexistent: #${id}.`);
  }

  const requiredDataHooks = ['data-view', 'data-go-training', 'data-mode'];
  for (const attribute of requiredDataHooks) {
    if (!new RegExp(`\\b${attribute}(?:=|\\s|>)`).test(html)) {
      fail(`index.html nu mai conține hook-ul obligatoriu ${attribute}.`);
    }
    if (!app.includes(`[${attribute}]`)) {
      fail(`app.js nu mai leagă hook-ul obligatoriu [${attribute}].`);
    }
  }

  return {
    htmlIds: htmlIds.length,
    singleSelectors: new Set(singleSelectors).size,
    directListeners: new Set(directListenerIds).size,
    dynamicClasses: dynamicClasses.size
  };
}

function main() {
  if (!fs.existsSync(REGISTRY) || !fs.existsSync(APP) || !fs.existsSync(INDEX) || !fs.existsSync(QUESTIONS_DIR)) {
    fail('Structura repository-ului nu este cea așteptată.');
  }

  const allModules = fs.readdirSync(QUESTIONS_DIR)
    .filter(name => name.endsWith('.js'))
    .sort()
    .map(name => path.join(QUESTIONS_DIR, name));

  const activeModules = getActiveModuleFiles();
  const staging = loadModules(allModules, 'staging');
  const active = loadModules(activeModules, 'activ');
  const dom = validateDomContract();

  console.log('QA banca de grile: OK');
  console.log(`Module totale verificate: ${allModules.length}`);
  console.log(`Module active: ${activeModules.length}`);
  console.log(`Itemi structurali valizi în staging după carantină: ${staging.registered}`);
  console.log(`Itemi activi după carantină: ${active.registered}`);
  console.log(`Itemi carantinați întâlniți în modulele active: ${active.quarantinedLoaded}`);
  if (active.skipped.length) console.log(`Carantină activă: ${active.skipped.join(', ')}`);
  console.log(`Contract DOM: OK (${dom.htmlIds} ID-uri, ${dom.singleSelectors} selectori $(), ${dom.directListeners} listenere directe, ${dom.dynamicClasses} clase dinamice).`);
}

try {
  main();
} catch (error) {
  console.error(`QA banca de grile: EȘEC\n${error.message}`);
  process.exitCode = 1;
}
