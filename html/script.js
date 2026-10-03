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
    map:'<path d="M9 4L3 7v13l6-3 6 3 6-3V4l-6 3z"/><path d="M9 4v13M15 7v13"/>',
    settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 9 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 4.6 9a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/>',
    power:'<path d="M18.4 6.6a9 9 0 1 1-12.8 0"/><path d="M12 2v10"/>',
    play:'<path d="M7 4l12 8-12 8z"/>',
    user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    cash:'<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/>',
    bank:'<path d="M3 10l9-6 9 6"/><path d="M5 10v9M19 10v9M9 10v9M15 10v9M3 21h18"/>',
    job:'<rect x="2" y="7" width="20" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>',
    phone:'<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/>',
    gang:'<path d="M12 3l8 4v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    weather:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19"/>',
    id:'<rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="9" cy="12" r="2.5"/><path d="M14 10h5M14 14h5"/>',
    discord:'<path d="M9 7.5a12 12 0 0 1 6 0l.6-1.2a9 9 0 0 1 3.2 1.4c1.6 2.7 2.4 5.7 2.2 8.8a10 10 0 0 1-3.3 1.7l-.9-1.5"/><path d="M6.3 16.7L5.4 18.2a10 10 0 0 1-3.3-1.7c-.2-3.1.6-6.1 2.2-8.8a9 9 0 0 1 3.2-1.4L8 7.5"/><ellipse cx="9" cy="13" rx="1.3" ry="1.7" fill="currentColor" stroke="none"/><ellipse cx="15" cy="13" rx="1.3" ry="1.7" fill="currentColor" stroke="none"/>',
    youtube:'<rect x="2.5" y="5.5" width="19" height="13" rx="4.5"/><path d="M10.5 9.3l5 2.7-5 2.7z" fill="currentColor" stroke="none"/>',
};
const ic = (n, s = 17) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[n] || ICONS.user}</svg>`;

let data = null;

function initials(name) {
    return String(name || '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}
function hexToRgb(hex) {
    const m = String(hex || '').replace('#', '').match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
    return m ? `${parseInt(m[1], 16)},${parseInt(m[2], 16)},${parseInt(m[3], 16)}` : '63,207,110';
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
            <span class="sheen"></span>
            <span class="ic">${ic(b.icon, 19)}</span>
            <span class="tx"><b>${esc(b.label)}</b>${b.sub ? `<span>${esc(b.sub)}</span>` : ''}</span>
        </button>`).join('');
}

function renderLinks() {
    $('links').innerHTML = data.config.links.map((l, i) => `
        <button class="link" style="--c:${esc(l.accent || '#3fcf6e')}" data-link="${i}">
            <span class="glow"></span>
            <span class="top">
                <span class="badge">${ic(l.icon, 20)}</span>
                <span><b>${esc(l.title)}</b><span class="sub">${esc(l.sub || '')}</span></span>
            </span>
            <span class="cta">${esc(l.cta || 'Open')}</span>
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
    el.style.setProperty('--c', b.accent || '#3fcf6e');
    el.style.backgroundImage = b.image ? `url(${esc(b.image)})` : '';
    el.innerHTML = `
        <span class="bglow"></span><span class="stripes"></span>
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
    root.style.setProperty('--accent', ui.accent || '#3fcf6e');
    root.style.setProperty('--accent-rgb', hexToRgb(ui.accent || '#3fcf6e'));

    const bg = $('bg');
    if (ui.background) { bg.classList.add('img'); bg.style.backgroundImage = `linear-gradient(rgba(5,7,9,.8),rgba(5,7,9,.88)), url(${esc(ui.background)})`; }
    else { bg.classList.remove('img'); bg.style.backgroundImage = ''; }

    renderTop(); renderChips(); renderActions(); renderLinks(); renderNews(); renderBanner();
    playEntrance();
}

let toastTimer = null;
function toast(msg) {
    clearTimeout(toastTimer);
    $('toast').textContent = msg;
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

function askConfirm(text, onYes) {
    $('confirm').innerHTML = `
        <div class="confirm-card">
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
        if (b.confirm) askConfirm(b.confirm, () => runButton(b));
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
