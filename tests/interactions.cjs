// DOM behavior tests. All form submissions are mocked; nothing is sent to Formspree.
const { JSDOM } = require('jsdom');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const script = fs.readFileSync(path.join(root, 'assets/js/main.js'), 'utf8');
let checks = 0;
function expect(condition, message) { assert.ok(condition, message); checks++; }
function createPage(file, query = '') {
  const dom = new JSDOM(fs.readFileSync(path.join(root, file), 'utf8'), {
    url: `https://jaijwalacontracts.in/${file}${query}`, runScripts: 'outside-only', pretendToBeVisual: true,
  });
  dom.window.matchMedia = () => ({ matches: true, addEventListener() {} });
  dom.window.eval(script);
  return dom;
}
const tick = () => new Promise(resolve => setTimeout(resolve, 0));
function fill(dom) {
  const d = dom.window.document;
  d.getElementById('name').value = 'Website test';
  d.getElementById('email').value = 'test@example.com';
  d.getElementById('message').value = 'A mocked project enquiry for automated verification.';
  d.getElementById('service').value = 'Road construction';
  d.querySelector('[name=consent]').checked = true;
  return d.querySelector('form');
}
function submit(dom, form) { form.dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true })); }
(async () => {
  for (const file of ['index.html','about.html','services.html','projects.html','contact.html','privacy-policy.html','terms-of-service.html','404.html']) {
    const dom = createPage(file);
    const d = dom.window.document;
    expect(d.documentElement.classList.contains('js'), `${file}: enhancement starts`);
    expect(!d.querySelector('.waiting'), `${file}: reduced motion leaves content visible`);
    dom.window.close();
  }
  {
    const dom = createPage('index.html'); const d = dom.window.document;
    const button = d.querySelector('.nav-toggle');
    button.click(); expect(button.getAttribute('aria-expanded') === 'true', 'menu opens');
    d.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Escape' }));
    expect(button.getAttribute('aria-expanded') === 'false', 'Escape closes menu');
    expect(d.activeElement === button, 'Escape restores toggle focus');
    button.click(); d.querySelector('main').click();
    expect(button.getAttribute('aria-expanded') === 'false', 'outside click closes menu');
    button.click(); d.querySelector('#primary-menu a').dispatchEvent(new dom.window.Event('click', { bubbles: true }));
    expect(button.getAttribute('aria-expanded') === 'false', 'navigation closes menu');
    dom.window.close();
  }
  {
    const dom = createPage('projects.html'); const d = dom.window.document;
    d.querySelector('[data-filter=roads]').click();
    expect(d.querySelectorAll('.project-card:not([hidden])').length === 1, 'road filter shows one work');
    expect(d.querySelector('.project-card:not([hidden])').dataset.category === 'roads', 'road filter matches category');
    expect(d.querySelector('[data-filter=roads]').getAttribute('aria-pressed') === 'true', 'selected filter announced');
    d.querySelector('[data-filter=materials]').click();
    expect(d.querySelector('.project-card:not([hidden])').dataset.category === 'materials', 'materials filter matches category');
    expect(d.getElementById('project-count').textContent === '1 featured work', 'count updates');
    d.querySelector('[data-filter=all]').click();
    expect(d.querySelectorAll('.project-card:not([hidden])').length === 2, 'all filter restores work');
    dom.window.close();
  }
  {
    const dom = createPage('contact.html', '?service=Construction%20aggregates'); const d = dom.window.document;
    expect(d.getElementById('service').value === 'Construction aggregates', 'service links prefill the form');
    dom.window.close();
  }
  {
    const dom = createPage('contact.html', '?service=Unknown');
    expect(dom.window.document.getElementById('service').value === '', 'unknown service ignored');
    dom.window.close();
  }
  {
    const dom = createPage('contact.html'); let calls = 0; dom.window.fetch = async () => { calls++; return {ok:true}; };
    submit(dom, dom.window.document.querySelector('form')); await tick();
    expect(calls === 0, 'invalid form does not send'); dom.window.close();
  }
  {
    const dom = createPage('contact.html'); const form = fill(dom); const d = dom.window.document;
    let resolve, calls = 0;
    dom.window.fetch = () => { calls++; return new Promise(r => { resolve = r; }); };
    submit(dom, form); submit(dom, form);
    expect(calls === 1, 'duplicate submission suppressed');
    expect(d.querySelector('button[type=submit]').disabled, 'button disabled while sending');
    expect(!d.querySelector('.success'), 'success not shown before response');
    resolve({ok:true}); await tick();
    expect(d.querySelector('.form-note').classList.contains('success'), 'confirmed delivery shows success');
    expect(d.getElementById('name').value === '', 'confirmed delivery resets form');
    expect(!d.querySelector('button[type=submit]').disabled, 'button restored after success');
    dom.window.close();
  }
  for (const kind of ['http','network','timeout']) {
    const dom = createPage('contact.html'); const form = fill(dom); const d = dom.window.document;
    dom.window.fetch = async () => {
      if (kind === 'http') return {ok:false};
      if (kind === 'timeout') throw new dom.window.DOMException('Aborted', 'AbortError');
      throw new Error('Network unavailable');
    };
    submit(dom, form); await tick();
    expect(d.querySelector('.form-note').classList.contains('error'), `${kind}: failure shown`);
    expect(d.getElementById('name').value === 'Website test', `${kind}: data preserved`);
    expect(!d.querySelector('.form-fallback').hidden, `${kind}: direct contact offered`);
    expect(!d.querySelector('button[type=submit]').disabled, `${kind}: retry enabled`);
    dom.window.close();
  }
  {
    const dom = createPage('contact.html'); const form = fill(dom); let calls = 0;
    dom.window.document.getElementById('website').value = 'spam';
    dom.window.fetch = async () => { calls++; return {ok:true}; };
    submit(dom, form); await tick(); expect(calls === 0, 'honeypot prevents submission'); dom.window.close();
  }
  console.log(`PASS: ${checks} DOM behavior assertions. No real enquiries sent.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
