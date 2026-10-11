const resourceName = (typeof GetParentResourceName === 'function') ? GetParentResourceName() : 'vexxd_pausemenu';
function nui(name, data) {
    return fetch(`https://${resourceName}/${name}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        body: JSON.stringify(data || {})
    }).then(r => r.json()).catch(() => null);
}
const $ = id => document.getElementById(id);
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
const money = n => '$' + Number(n || 0).toLocaleString('en-US');

const ICONS = {
    map: '<path d="M3 7l6 -3l6 3l6 -3v13l-6 3l-6 -3l-6 3v-13"/><path d="M9 4v13"/><path d="M15 7v13"/>',
    settings: '<path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065"/><path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"/>',
    power: '<path d="M7 6a7.75 7.75 0 1 0 10 0"/><path d="M12 4l0 8"/>',
    play: '<path d="M7 4v16l13 -8l-13 -8"/>',
    user: '<path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"/><path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"/>',
    cash: '<path d="M7 15h-3a1 1 0 0 1 -1 -1v-8a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v3"/><path d="M7 10a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v8a1 1 0 0 1 -1 1h-12a1 1 0 0 1 -1 -1l0 -8"/><path d="M12 14a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"/>',
    bank: '<path d="M3 21l18 0"/><path d="M3 10l18 0"/><path d="M5 6l7 -3l7 3"/><path d="M4 10l0 11"/><path d="M20 10l0 11"/><path d="M8 14l0 3"/><path d="M12 14l0 3"/><path d="M16 14l0 3"/>',
    job: '<path d="M3 9a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2l0 -9"/><path d="M8 7v-2a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v2"/><path d="M12 12l0 .01"/><path d="M3 13a20 20 0 0 0 18 0"/>',
    phone: '<path d="M6 5a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2v-14"/><path d="M11 4h2"/><path d="M12 17v.01"/>',
    gang: '<path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3"/>',
    clock: '<path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"/><path d="M12 7v5l3 3"/>',
    weather: '<path d="M8 12a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"/><path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7"/>',
    id: '<path d="M3 7a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v10a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3l0 -10"/><path d="M7 10a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M15 8l2 0"/><path d="M15 12l2 0"/><path d="M7 16l10 0"/>',
    discord: '<path d="M8 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0"/><path d="M14 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0"/><path d="M15.5 17c0 1 1.5 3 2 3c1.5 0 2.833 -1.667 3.5 -3c.667 -1.667 .5 -5.833 -1.5 -11.5c-1.457 -1.015 -3 -1.34 -4.5 -1.5l-.972 1.923a11.913 11.913 0 0 0 -4.053 0l-.975 -1.923c-1.5 .16 -3.043 .485 -4.5 1.5c-2 5.667 -2.167 9.833 -1.5 11.5c.667 1.333 2 3 3.5 3c.5 0 2 -2 2 -3"/><path d="M7 16.5c3.5 1 6.5 1 10 0"/>',
    youtube: '<path d="M2 8a4 4 0 0 1 4 -4h12a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-12a4 4 0 0 1 -4 -4v-8"/><path d="M10 9l5 3l-5 3l0 -6"/>',
    link: '<path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6"/><path d="M11 13l9 -9"/><path d="M15 4h5v5"/>',
};
const ic = (n, s = 17) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${ICONS[n] || ICONS.user}</svg>`;

let data = null;

function initials(name) {
    return String(name || '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}
function hexToRgb(hex) {
    const m = String(hex || '').replace('#', '').match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
    return m ? `${parseInt(m[1], 16)},${parseInt(m[2], 16)},${parseInt(m[3], 16)}` : '239,68,68';
}

function setVal(key, value) {
    const el = document.querySelector(`[data-k="${key}"]`);
    if (!el) return;
    const next = String(value ?? '');
    if (el.textContent === next) return;
    el.textContent = next;
    el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash');
}

function renderTop() {
    const p = data.player, s = data.session, c = data.config;
    $('pName').textContent = p.name || 'Player';
    $('pSub').textContent = `${p.job || 'Unemployed'}${p.grade ? ' · ' + p.grade : ''}`;
    $('sOnline').textContent = `${s.players} / ${s.maxSlots}`;
    $('sServer').textContent = c.server.name;
    $('sTag').textContent = c.server.tagline || '';
    $('sClock').textContent = s.time;

    const av = $('avatar');
    if (p.avatar) { av.style.backgroundImage = `url(${esc(p.avatar)})`; av.textContent = ''; }
    else { av.style.backgroundImage = ''; av.textContent = initials(p.name); }
}

function renderChips() {
    const p = data.player, s = data.session, st = data.config.stats;
    const chips = [];
    const add = (on, key, cls, icon, k, v) => { if (on) chips.push({ key, cls, icon, k, v }); };

    add(st.id, 'id', '', 'id', 'Account ID', p.id);
    add(st.cash, 'cash', 'green', 'cash', 'Cash', money(p.cash));
    add(st.bank, 'bank', 'blue', 'bank', 'Bank', money(p.bank));
    add(st.job, 'job', '', 'job', 'Job', p.job);
    add(st.phone && p.phone, 'phone', '', 'phone', 'Phone', p.phone);
    add(st.gang && p.gang, 'gang', 'violet', 'gang', 'Gang', p.gang);
    add(st.time, 'time', 'amber', 'clock', 'Date', `${s.date} · ${s.time}`);
    add(st.weather, 'weather', '', 'weather', 'Weather', s.weather);

    $('chips').innerHTML = chips.map(c => `
        <div class="chip ${c.cls}">
            <span class="ic">${ic(c.icon, 15)}</span>
            <span class="tx"><span class="k">${esc(c.k)}</span><div class="v num" data-k="${c.key}">${esc(c.v)}</div></span>
        </div>`).join('');
}

function renderActions() {
    $('actions').innerHTML = data.config.buttons.map((b, i) => `
        <button class="tile ${b.size === 'small' ? 'small' : 'large'} ${b.danger ? 'danger' : ''} ${b.image ? 'has-img' : ''}"
                data-btn="${i}" ${b.image ? `style="background-image:url(${esc(b.image)})"` : ''}>
            ${b.image ? '<span class="shade"></span>' : ''}
            <span class="ic">${ic(b.icon, 19)}</span>
            <span class="tx"><b>${esc(b.label)}</b>${b.sub ? `<span>${esc(b.sub)}</span>` : ''}</span>
        </button>`).join('');
}

function renderLinks() {
    $('links').innerHTML = data.config.links.map((l, i) => `
        <button class="link" style="--c:${esc(l.accent || '#3fcf6e')}" data-link="${i}">
            <span class="top">
                <span class="badge">${ic(l.icon, 24)}</span>
                <span><b>${esc(l.title)}</b><span class="sub">${esc(l.sub || '')}</span></span>
            </span>
            <span class="cta">${esc(l.cta || 'Open')}${ic('link', 14)}</span>
            ${l.members ? `<span class="members">${esc(l.members)}</span>` : ''}
        </button>`).join('');
}

function renderNews() {
    const items = data.config.announcements || [];
    $('newsCount').textContent = items.length ? items.length : '';
    $('news').innerHTML = items.length ? items.map(a => `
        <div class="item">
            <div class="meta">
                ${a.tag ? `<span class="tag">${esc(a.tag)}</span>` : ''}
                <span class="date num">${esc(a.date || '')}</span>
            </div>
            <b>${esc(a.title)}</b>
            <p>${esc(a.body)}</p>
        </div>`).join('') : `<div class="empty">Nothing announced yet.</div>`;
}

function renderBanner() {
    const b = data.config.banner;
    const el = $('banner');
    if (!b || !b.enabled) { el.classList.add('hidden'); return; }
    el.classList.remove('hidden');
    if (b.accent) el.style.setProperty('--c', b.accent); else el.style.removeProperty('--c');
    el.style.backgroundImage = b.image ? `url(${esc(b.image)})` : '';
    el.classList.toggle('has-img', !!b.image);
    el.innerHTML = `
        ${b.image ? '<span class="shade"></span>' : ''}
        <span class="btx"><b>${esc(b.title)}</b><span>${esc(b.sub || '')}</span></span>
        ${b.cta ? `<span class="bcta">${esc(b.cta)}</span>` : ''}`;
    el.onclick = () => {
        if (b.url) openLink(b.url);
        else if (b.event) nui('action', { action: 'event', event: b.event });
    };
}

function playEntrance() {
    const wrap = $('wrap');
    let i = 0;
    wrap.querySelectorAll(':scope > *, .chip, .col > *').forEach(el => el.style.setProperty('--i', i++));
    wrap.classList.remove('enter'); void wrap.offsetWidth; wrap.classList.add('enter');
}

function renderAll() {
    const ui = data.config.ui || {};
    const root = document.documentElement;
    root.style.setProperty('--accent', ui.accent || '#ef4444');
    root.style.setProperty('--accent-rgb', hexToRgb(ui.accent || '#ef4444'));

    const bg = $('bg');
    if (ui.background) { bg.classList.add('img'); bg.style.backgroundImage = `linear-gradient(rgba(5,7,9,.8),rgba(5,7,9,.88)), url(${esc(ui.background)})`; }
    else { bg.classList.remove('img'); bg.style.backgroundImage = ''; }

    renderTop(); renderChips(); renderActions(); renderLinks(); renderNews(); renderBanner();
    playEntrance();
}

let toastTimer = null;
function toast(msg) {
    clearTimeout(toastTimer);
    $('toast').innerHTML = `${ic('link', 18)}<span>${esc(msg)}</span>`;
    $('toast').classList.remove('hidden');
    toastTimer = setTimeout(() => $('toast').classList.add('hidden'), 2600);
}

function copyText(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    ta.remove();
    return ok;
}

function openLink(url) {
    if (!url) return;
    if (typeof window.invokeNative === 'function') {
        try {
            window.invokeNative('openUrl', url);
            toast('Opened in your browser');
            return;
        } catch (e) {}
    }
    if (copyText(url)) toast('Link copied to your clipboard');
    else toast(url);
}

function runButton(b) {
    if (b.action === 'url' && b.url) { openLink(b.url); return; }
    nui('action', { action: b.action, url: b.url, event: b.event, args: b.args });
}

function askConfirm(text, onYes, icon) {
    $('confirm').innerHTML = `
        <div class="confirm-card">
            <span class="confirm-ic">${ic(icon || 'power', 26)}</span>
            <b>${esc(text)}</b>
            <div class="confirm-row">
                <button data-no>Cancel</button>
                <button class="yes" data-yes>Confirm</button>
            </div>
        </div>`;
    $('confirm').classList.remove('hidden');
    $('confirm').querySelector('[data-no]').onclick = () => $('confirm').classList.add('hidden');
    $('confirm').querySelector('[data-yes]').onclick = () => { $('confirm').classList.add('hidden'); onYes(); };
}

document.addEventListener('click', e => {
    const btn = e.target.closest('[data-btn]');
    if (btn) {
        const b = data.config.buttons[Number(btn.dataset.btn)];
        if (b.confirm) askConfirm(b.confirm, () => runButton(b), b.icon);
        else runButton(b);
        return;
    }
    const link = e.target.closest('[data-link]');
    if (link) {
        const l = data.config.links[Number(link.dataset.link)];
        openLink(l.url);
    }
});

document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;

    if (!$('confirm').classList.contains('hidden')) {
        $('confirm').classList.add('hidden');
        return;
    }
    if (!$('root').classList.contains('hidden')) {
        $('root').classList.add('hidden');
        nui('close');
    }
});

window.addEventListener('message', e => {
    const d = e.data;
    switch (d.action) {
        case 'open':
            data = d.data;
            renderAll();
            $('confirm').classList.add('hidden');
            $('root').classList.remove('hidden');
            break;

        case 'clock':
            if (!data) break;
            data.session.time = d.data.time; data.session.date = d.data.date; data.session.weather = d.data.weather;
            $('sClock').textContent = d.data.time;
            setVal('time', `${d.data.date} · ${d.data.time}`);
            setVal('weather', d.data.weather);
            break;

        case 'player':
            if (!data) break;
            data.player = d.data;
            setVal('cash', money(d.data.cash));
            setVal('bank', money(d.data.bank));
            setVal('job', d.data.job);
            setVal('id', d.data.id);
            if (d.players != null) $('sOnline').textContent = `${d.players} / ${data.session.maxSlots}`;
            break;

        case 'close':
            $('root').classList.add('hidden');
            break;

        case 'copied':
            openLink(d.url);
            break;
    }
});
