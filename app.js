/* ===================== 余年 App — 前端逻辑 ===================== */
/* 数据层：当前用 localStorage 持久化（单用户自用）。
   后续接后端时，只需把 save()/load() 与页面读写换成 API 调用即可，UI 不用动。 */

const STORE_KEY = 'yinian_data_v1';

const DEFAULT_DATA = {
  settings: {
    relName: 'Claire & Claude',
    myName: 'Claire', aiName: 'Claude',
    startDate: '2026.06.02',
    myAvatar: '', aiAvatar: '', cover: '', sign: '一句话签名',
    theme: 'default',
    themeAccent: '#F48FB1',
    pageBg: {}, pageOpacity: {},
    nav: { iconSize: 48, gap: 1, inset: 16, bottom: 10 },
    moments: { nameColor: '#FFFFFF', signColor: '#FFFFFF', textY: 4, avaX: 0, avaY: 0 },
    calendar: { cardPadding: 12, titleSize: 13, rowGap: 8, dotSize: 10 },
    region: '',
    aiCover: '', aiSign: '', aiRegion: '',
    periodDays: [],
    style: {
      title: { color: '', opacity: 1, font: 'default' },
      body: { color: '', opacity: 1, font: 'default' },
      muted: { color: '', opacity: 1, font: 'default' },
      number: { color: '', opacity: 1, font: 'default' },
      accent: { color: '', opacity: 1, font: 'default' },
      cardBg: { color: '', opacity: 1 },
      pageBg: { color: '', opacity: 1 }
    },
    glass: { on: false, blur: 14, opacity: 65 },
    glassmorphism: { on: false, highlight: 70 },
    apiMode: 'backend', backendUrl: 'https://vlrqxguctptinozjuyds.supabase.co/functions/v1/chat', deepseekKey: '',
    sync: { on: false, url: '', anon: '' },
    lang: 'en',
    chatInputOffset: 0
  },
  importantDays: [
    { id: 'd1', title: 'Our Anniversary', date: '2026.06.02', pinned: true, content: '' },
    { id: 'd2', title: 'His Birthday', date: '2026.09.12', pinned: false, content: '' },
    { id: 'd3', title: 'Trip to Kyoto', date: '2026.03.20', pinned: false, content: '' }
  ],
  timeline: {
    '2026-07': [
      { id: 't1', day: 3, type: 'intimate', note: '' },
      { id: 't2', day: 9, type: 'period', note: '' },
      { id: 't3', day: 14, type: 'anniversary', note: '' },
      { id: 't4', day: 20, type: 'todo', note: '看医生' }
    ]
  },
  moments: [
    { id: 'm1', author: 'me', text: '今天和他一起看了日落，很开心。', images: [], time: Date.now() - 86400000, likes: ['me'], comments: [
      { author: 'ai', text: '听起来好浪漫，你们真幸福 💕', time: Date.now() - 80000000 }
    ]},
    { id: 'm2', author: 'ai', text: '我也想和你一起去旅行呀。', images: [], time: Date.now() - 3600000, likes: ['me'], comments: [] }
  ],
  wishes: [
    { id: 'w1', title: 'Marshbello', image: '', price: '$1847', status: 'want', date: '2026.07', month: '2026-07' },
    { id: 'w2', title: 'Chanel 25bag', image: '', price: '$8875', status: 'want', date: '2026.07', month: '2026-07' },
    { id: 'w3', title: 'NS2', image: '', price: '$629.99', status: 'want', date: '2026.07', month: '2026-07' },
    { id: 'w4', title: 'Tiffany Smile', image: '', price: '$2150', status: 'want', date: '2026.07', month: '2026-07' },
    { id: 'w5', title: 'Ninja Crispi Pro', image: '', price: '$399', status: 'got', date: '2026.06', month: '2026-06' },
    { id: 'w6', title: "Cartier d'Amour", image: '', price: '$1890', status: 'got', date: '2026.06', month: '2026-06' }
  ],
  chat: [
    { role: 'ai', text: '嗨，我在呢。有什么想和我说的吗？', time: Date.now() - 60000 }
  ],
  deletedIds: []
};

function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}
function saveLocal() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); } catch (e) {}
}
function save() {
  saveLocal();
  pushState();
}
let data = load();
if (!data.settings.theme) data.settings.theme = 'default';
if (!data.settings.nav) data.settings.nav = { iconSize: 48, gap: 1, inset: 16, bottom: 10 };
if (!data.settings.moments) data.settings.moments = { nameColor: '#FFFFFF', signColor: '#FFFFFF', textY: 4, avaX: 0, avaY: 0 };
if (!data.settings.calendar) data.settings.calendar = { cardPadding: 12, titleSize: 13, rowGap: 8, dotSize: 10 };
if (data.settings.region === undefined) data.settings.region = '';
if (data.settings.aiCover === undefined) data.settings.aiCover = '';
if (data.settings.aiSign === undefined) data.settings.aiSign = '';
if (data.settings.aiRegion === undefined) data.settings.aiRegion = '';
if (!data.settings.periodDays) data.settings.periodDays = [];
if (!data.settings.style) data.settings.style = {
  title: { color: '', opacity: 1, font: 'default' },
  body: { color: '', opacity: 1, font: 'default' },
  muted: { color: '', opacity: 1, font: 'default' },
  number: { color: '', opacity: 1, font: 'default' },
  accent: { color: '', opacity: 1, font: 'default' },
  cardBg: { color: '', opacity: 1 },
  pageBg: { color: '', opacity: 1 }
};
if (!data.settings.glass) data.settings.glass = { on: false, blur: 14, opacity: 65 };
if (!data.settings.glassmorphism) data.settings.glassmorphism = { on: false, highlight: 70 };
if (!data.settings.sync) data.settings.sync = { on: false, url: '', anon: '' };
if (data.settings.sync.on === undefined) data.settings.sync.on = false;
if (data.settings.sync.url === undefined) data.settings.sync.url = '';
if (data.settings.sync.anon === undefined) data.settings.sync.anon = '';
if (!data.deletedIds) data.deletedIds = [];
if (!data.settings.lang) data.settings.lang = 'en';
if (data.settings.chatInputOffset === undefined) data.settings.chatInputOffset = 0;
// 自动接入已部署的聊天函数（用户已配置好 Key）：曾选过「演示」的，默认升级为真实聊天
const CHAT_FN = 'https://vlrqxguctptinozjuyds.supabase.co/functions/v1/chat';
if (data.settings.apiMode === 'none') {
  data.settings.apiMode = 'backend';
  if (!data.settings.backendUrl) data.settings.backendUrl = CHAT_FN;
}

/* ===================== 云同步（Supabase 共享本子） ===================== */
/* 用 Supabase 自带的 REST 接口做云上共享本子（免后端、免绑卡）。
   仅同步内容（moments/importantDays/timeline/wishes），不碰各自的设置与聊天记录。
   共享数据存在表 yunian 的第 1 行（data 字段，jsonb）；待处理清单存在 pending 表。 */
const SYNC_KEYS = ['moments', 'importantDays', 'timeline', 'wishes'];
function syncEnabled() {
  const s = data.settings.sync || {};
  return !!(s.on && s.url && s.anon);
}
function sbBase() {
  return (data.settings.sync.url || '').trim().replace(/\/$/, '') + '/rest/v1';
}
function sbHeaders(extra) {
  const k = data.settings.sync.anon || '';
  return Object.assign({ 'apikey': k, 'Authorization': 'Bearer ' + k, 'Content-Type': 'application/json' }, extra || {});
}
function extractShared() {
  const s = data.settings || {};
  return {
    moments: data.moments || [],
    importantDays: data.importantDays || [],
    timeline: data.timeline || {},
    wishes: data.wishes || [],
    deletedIds: data.deletedIds || [],
    // 资料字段（头像/封面/签名/昵称/日期）——供 TA 通过代理修改后在你手机上生效
    profile: {
      relName: s.relName, myName: s.myName, aiName: s.aiName,
      myAvatar: s.myAvatar, aiAvatar: s.aiAvatar, cover: s.cover, aiCover: s.aiCover,
      sign: s.sign, aiSign: s.aiSign, startDate: s.startDate
    }
  };
}
/* 自适应表名/字段：兼容 yunian(data) 与 shared_data(payload) 两种建表方式 */
let SB_TABLE = null; // null=未探测, 探测后固定为 'yunian' 或 'shared_data'
/* 统一发请求：连不上时抛出“连不上服务器”的明确提示，而不是静默失败 */
async function sbRaw(method, path, body, extra) {
  try {
    return await fetch(sbBase() + path, {
      method: method || 'GET',
      headers: sbHeaders(extra || {}),
      body: body ? JSON.stringify(body) : undefined
    });
  } catch (e) {
    throw new Error('连不上服务器：' + ((e && e.message) || e) + '。地址需是完整的 https://xxxx.supabase.co，且手机有网。');
  }
}
/* 探测表是否存在；连不上 / 被拒 / 找不到都抛“能看懂”的错误 */
async function sbDetectTable() {
  if (SB_TABLE) return SB_TABLE;
  let httpErr = null, netErr = null;
  for (const t of ['yunian', 'shared_data']) {
    try {
      const r = await sbRaw('GET', `/${t}?select=id&limit=1`);
      if (r.ok) { SB_TABLE = t; return SB_TABLE; }
      httpErr = 'HTTP ' + r.status + '（' + t + '）：' + (await r.text().catch(() => '')).slice(0, 140);
    } catch (e) { netErr = e.message; }
  }
  if (netErr && !httpErr) throw new Error(netErr);
  if (httpErr) throw new Error('服务器拒绝请求（' + httpErr + '）。多半是 Anon Key 不对，或表没建好 / 没权限。');
  throw new Error('找不到 yunian / shared_data 表，请去 Supabase SQL Editor 跑 supabase.sql 建表。');
}
/* 从 Anon Key（JWT）里解出项目 ref，拼出正确地址，帮小白自动填 */
function sbRefFromKey() {
  const k = (data.settings.sync.anon || '').trim();
  try {
    const part = k.split('.')[1];
    const json = JSON.parse(atob(part.replace(/-/g, '+').replace(/_/g, '/')));
    return json.ref || null;
  } catch (e) { return null; }
}
function sbRowToData(row) {
  if (!row) return null;
  if (row.data !== undefined) return row.data;
  if (row.payload !== undefined) return row.payload;
  return null;
}
async function sbGetState() {
  const t = await sbDetectTable();
  const r = await sbRaw('GET', `/${t}?select=*&id=eq.1`);
  if (!r.ok) throw new Error('读云端失败 HTTP ' + r.status + '：' + (await r.text().catch(() => '')).slice(0, 160));
  const rows = await r.json();
  return rows[0] ? sbRowToData(rows[0]) : null;
}
async function sbPutState(state) {
  const t = await sbDetectTable();
  const ts = new Date().toISOString();
  const body = t === 'shared_data'
    ? { id: 1, group_id: 'default', payload: state, updated_at: ts }
    : { id: 1, data: state, updated_at: ts };
  /* 直接 upsert：有 id=1 就更新、没有就插入，永不 409 主键冲突 */
  const res = await sbRaw('POST', `/${t}?on_conflict=id`, body, { 'Prefer': 'resolution=merge-duplicates, return=representation' });
  if (!res.ok) {
    throw new Error('写云端失败 HTTP ' + res.status + '：' + (await res.text().catch(() => '')).slice(0, 200));
  }
}
function mergeArraysLocal(a, b) {
  const map = new Map();
  (a || []).forEach(x => map.set(x.id, x));
  (b || []).forEach(x => {
    const ex = map.get(x.id);
    if (!ex) { map.set(x.id, x); return; }
    let base = ((x.time || 0) > (ex.time || 0)) ? x : ex;
    if ('likes' in ex && 'likes' in x) {
      base = Object.assign({}, base);
      const ls = new Set(ex.likes || []); (x.likes || []).forEach(v => ls.add(v));
      base.likes = [...ls];
      const cm = new Map();
      (ex.comments || []).forEach(c => cm.set(c.cid || c.text, c));
      (x.comments || []).forEach(c => cm.set(c.cid || c.text, c));
      base.comments = [...cm.values()];
    }
    map.set(x.id, base);
  });
  return [...map.values()];
}
function mergeIntoLocal(incoming, opts) {
  if (!incoming) return;
  const applyProfile = !!(opts && opts.profile);
  SYNC_KEYS.forEach(k => {
    if (!incoming[k]) return;
    if (k === 'timeline') {
      data.timeline = data.timeline || {};
      Object.keys(incoming.timeline).forEach(mk => {
        data.timeline[mk] = mergeArraysLocal(data.timeline[mk] || [], incoming.timeline[mk]);
      });
    } else {
      data[k] = mergeArraysLocal(data[k] || [], incoming[k]);
    }
  });
  // 墓碑：把已删除的 id 从本地清掉（删除也会同步到云端，不再被拉回来）
  const del = data.deletedIds || [];
  if (del.length) {
    SYNC_KEYS.forEach(k => {
      if (k === 'timeline') {
        Object.keys(data.timeline).forEach(mk => { data.timeline[mk] = (data.timeline[mk] || []).filter(x => !del.includes(x.id)); });
      } else if (data[k]) {
        data[k] = (data[k] || []).filter(x => !del.includes(x.id));
      }
    });
  }
  // 合并云端记录下来的删除标记，避免两边删除状态不一致
  if (incoming.deletedIds && incoming.deletedIds.length) {
    const set = new Set(data.deletedIds || []);
    incoming.deletedIds.forEach(id => set.add(id));
    data.deletedIds = [...set];
  }
  // 资料字段（头像/封面/签名/昵称）：仅在显式要求时应用，避免拉取时把本地刚改的资料覆盖掉
  if (applyProfile && incoming.profile && typeof incoming.profile === 'object') {
    const s = data.settings || (data.settings = {});
    ['relName', 'myName', 'aiName', 'myAvatar', 'aiAvatar', 'cover', 'aiCover', 'sign', 'aiSign', 'startDate']
      .forEach(k => { if (incoming.profile[k] !== undefined) s[k] = incoming.profile[k]; });
  }
}
async function pushState() {
  if (!syncEnabled()) return { ok: false, error: '未开启云同步或未填地址/Key' };
  try {
    const remote = await sbGetState();
    if (remote) mergeIntoLocal(remote);   // 先把对方写的合并进来（不含资料字段，避免覆盖本地头像）
    await sbPutState(extractShared());     // 再把合并后的这份推上去（含资料字段，不覆盖对方）
    saveLocal();
    return { ok: true };
  } catch (e) { return { ok: false, error: e.message || String(e) }; }
}
async function pullState() {
  if (!syncEnabled()) return { ok: false, error: '未开启云同步或未填地址/Key' };
  try {
    const remote = await sbGetState();
    if (remote) { mergeIntoLocal(remote); saveLocal(); }
    return { ok: true };
  } catch (e) { return { ok: false, error: e.message || String(e) }; }
}
async function addPending(item) {
  if (!syncEnabled()) return;
  try {
    await fetch(sbBase() + '/pending', {
      method: 'POST',
      headers: sbHeaders({ 'Prefer': 'return=representation' }),
      body: JSON.stringify({
        id: item.id || (Date.now().toString(36) + Math.random().toString(36).slice(2, 6)),
        payload: item
      })
    });
  } catch (e) { /* 忽略 */ }
}

/* ---------- 工具 ---------- */
function $(sel, root) { return (root || document).querySelector(sel); }
function $all(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }
function uid() { return Math.random().toString(36).slice(2, 9); }
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('show'), 1800);
}
function fmtDate(d) { return d.toISOString().slice(0, 10); }
function parseDot(s) { // '2026.06.02' -> Date
  const [y, m, d] = s.split('.').map(Number);
  return new Date(y, m - 1, d);
}
function daysBetween(a, b) { return Math.round((b - a) / 86400000); }
function monthKey(date) { return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0'); }
function monthLabel(key) {
  const [y, m] = key.split('-');
  return y + '年' + m + '月';
}
const CATS = [
  { type: 'intimate', name: '亲密', color: 'var(--dot-intimate)', fill: '#F48FB1' },
  { type: 'period', name: '月经', color: 'var(--dot-period)', fill: '#F4A3C8' },
  { type: 'anniversary', name: '纪念日', color: 'var(--dot-anniversary)', fill: '#F2C94C' },
  { type: 'todo', name: '待办', color: 'var(--dot-todo)', fill: '#90CAF9' }
];
/* 日历可见分类：只保留 纪念日 / 亲密（月经/待办不计入日历展示） */
const CAL_CATS = CATS.filter(c => ['anniversary', 'intimate'].includes(c.type));
const THEMES = {
  default: {
    name: '默认',
    vars: {
      '--bg-page': '#FBF1EC', '--bg-card': '#FFFFFF', '--bg-soft': '#FBEFF4', '--bg-chip': '#F5ECE6',
      '--accent': '#F48FB1', '--accent-deep': '#E26D97',
      '--text': '#6B5B63', '--text-muted': '#B0A0A8', '--text-soft': '#9A8A92', '--border': '#F0DCE4',
      '--dot-intimate': '#F0707F', '--dot-period': '#F7A8C4', '--dot-anniversary': '#F4C542', '--dot-todo': '#5AA9E6'
    }
  },
  sen: {
    name: '森',
    vars: {
      '--bg-page': '#E8F0FC', '--bg-card': '#FFFFFF', '--bg-soft': '#F0F6FF', '--bg-chip': '#E4EDFA',
      '--accent': '#8FA8E8', '--accent-deep': '#5F7194',
      '--text': '#3E4A65', '--text-muted': '#8FA0B8', '--text-soft': '#7A8BA8', '--border': '#D8E3F5',
      '--dot-intimate': '#E07A8A', '--dot-period': '#F0A8C4', '--dot-anniversary': '#F4C542', '--dot-todo': '#7AA9E8'
    }
  }
};
const MONTH_EN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
let currentCalendarMonth = new Date();
let chatThinking = false;
let momentsOwner = 'me';

/* 从相册选图并压缩（存本地，不联网、不用图床） */
function pickImage(maxSize, cb) { pickImages(maxSize, arr => cb(arr[0]), false); }
function pickImages(maxSize, cb, multi) {
  const inp = document.createElement('input');
  inp.type = 'file'; inp.accept = 'image/*';
  if (multi) inp.multiple = true;
  inp.onchange = () => {
    const files = Array.from(inp.files || []);
    if (!files.length) return;
    const out = []; let pending = files.length;
    const done = () => { if (--pending === 0) cb(out); };
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
          const w = Math.max(1, Math.round(img.width * scale));
          const h = Math.max(1, Math.round(img.height * scale));
          const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
          cv.getContext('2d').drawImage(img, 0, 0, w, h);
          out.push(cv.toDataURL('image/jpeg', 0.82)); done();
        };
        img.onerror = done; img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  };
  inp.click();
}

/* 白底素材自动抠图：把接近白色(threshold)的像素变透明，返回 PNG dataURL */
function removeWhiteBackground(dataUrl, threshold) {
  threshold = threshold || 240;
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const cv = document.createElement('canvas');
      cv.width = img.width; cv.height = img.height;
      const ctx = cv.getContext('2d');
      ctx.drawImage(img, 0, 0);
      let d;
      try { d = ctx.getImageData(0, 0, cv.width, cv.height); }
      catch (e) { resolve(dataUrl); return; }
      const px = d.data;
      for (let i = 0; i < px.length; i += 4) {
        if (px[i] > threshold && px[i+1] > threshold && px[i+2] > threshold) px[i+3] = 0;
      }
      ctx.putImageData(d, 0, 0);
      resolve(cv.toDataURL('image/png'));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

/* ===================== 导航 ===================== */
$all('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.target;
    switchTab(target);
  });
});
function switchTab(target) {
  $all('.tab').forEach(t => t.classList.toggle('active', t.dataset.target === target));
  $all('.screen').forEach(s => s.classList.toggle('active', s.id === 'screen-' + target));
  if (target === 'calendar') renderCalendar();
  if (target === 'moments') renderMoments();
  if (target === 'chat') renderChat();
  if (target === 'wishlist') renderWishlist();
  closeMenu();
}
function openMenu() { $('#menu-mask').classList.add('show'); $('#menu-sheet').classList.add('show'); }
function closeMenu() { $('#menu-mask').classList.remove('show'); $('#menu-sheet').classList.remove('show'); }
function toggleMenu() { $('#menu-sheet').classList.contains('show') ? closeMenu() : openMenu(); }
$('#menu-mask').addEventListener('click', closeMenu);

/* ===================== 弹窗 ===================== */
function openModal(html) {
  $('#modal').innerHTML = html;
  $('#modal').classList.add('show');
  $('#modal-mask').classList.add('show');
}
function closeModal() {
  $('#modal').classList.remove('show');
  $('#modal-mask').classList.remove('show');
}
$('#modal-mask').addEventListener('click', closeModal);

/* ===================== Anniversary ===================== */
function renderAnniversary() {
  const s = data.settings;
  $('#rel-name-top').textContent = s.relName;
  $('#rel-name-card').textContent = s.relName;
  $('#since-text').textContent = 'since ' + s.startDate;
  const start = parseDot(s.startDate);
  const days = daysBetween(start, new Date());
  $('#days-together').textContent = Math.max(0, days);
  if (s.myAvatar) $('#avatar-me').style.backgroundImage = 'url(' + s.myAvatar + ')';
  if (s.aiAvatar) $('#avatar-ai').style.backgroundImage = 'url(' + s.aiAvatar + ')';

  const list = $('#important-list');
  const sorted = data.importantDays.slice().sort((a, b) => (b.pinned - a.pinned) || (parseDot(a.date) - parseDot(b.date)));
  list.innerHTML = sorted.map(d => {
    const target = parseDot(d.date);
    const diff = daysBetween(new Date(), target);
    let num, unit, passed = '';
    if (diff > 0) { num = diff; unit = 'days left'; }
    else if (diff < 0) { num = -diff; unit = 'days passed'; passed = 'passed'; }
    else { num = 'Today'; unit = ''; }
    return `<div class="day-row" data-day="${d.id}">
      <div class="day-left">
        <div class="day-title">${esc(d.title)}${d.pinned ? '<span class="pin">置顶</span>' : ''}</div>
        <div class="day-date">${d.date}</div>
      </div>
      <div class="day-right ${passed}">
        <div class="day-num">${num}</div>
        <div class="day-unit">${unit}</div>
      </div>
    </div>`;
  }).join('');

  $all('.day-row', list).forEach(row => {
    row.addEventListener('click', () => editDay(row.dataset.day));
  });
}
function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c])); }
function hexToRgb(hex) {
  const m = String(hex).replace('#', '').match(/^(..)(..)(..)$/);
  if (!m) return [251, 241, 236];
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
}

function editDay(id) {
  const d = data.importantDays.find(x => x.id === id);
  if (!d) return addDay();
  openModal(`
    <h3>编辑重要日子</h3>
    <div class="field"><label>标题</label><input id="f-title" value="${esc(d.title)}" /></div>
    <div class="field"><label>日期 (YYYY.MM.DD)</label><input id="f-date" value="${d.date}" /></div>
    <div class="field"><label>备注</label><textarea id="f-content">${esc(d.content || '')}</textarea></div>
    <div class="field switch-row"><span>置顶</span><div class="switch ${d.pinned ? 'on' : ''}" id="f-pin"></div></div>
    <div class="modal-actions">
      <button class="btn btn-danger" id="del-day">删除</button>
      <button class="btn btn-ghost" id="cancel-day">取消</button>
      <button class="btn btn-primary" id="save-day">保存</button>
    </div>
  `);
  let pinned = d.pinned;
  $('#f-pin').addEventListener('click', () => { pinned = !pinned; $('#f-pin').classList.toggle('on', pinned); });
  $('#cancel-day').addEventListener('click', closeModal);
  $('#save-day').addEventListener('click', () => {
    d.title = $('#f-title').value.trim() || '未命名';
    d.date = $('#f-date').value.trim();
    d.content = $('#f-content').value.trim();
    d.pinned = pinned;
    d.time = Date.now();
    save(); renderAnniversary(); closeModal(); toast('已保存');
  });
  $('#del-day').addEventListener('click', () => {
    data.importantDays = data.importantDays.filter(x => x.id !== id);
    if (!data.deletedIds.includes(id)) data.deletedIds.push(id);
    save(); renderAnniversary(); closeModal(); toast('已删除');
  });
}
function addDay() {
  openModal(`
    <h3>添加重要日子</h3>
    <div class="field"><label>标题</label><input id="f-title" placeholder="例如：在一起纪念日" /></div>
    <div class="field"><label>日期 (YYYY.MM.DD)</label><input id="f-date" placeholder="2026.06.02" /></div>
    <div class="field"><label>备注</label><textarea id="f-content"></textarea></div>
    <div class="field switch-row"><span>置顶</span><div class="switch" id="f-pin"></div></div>
    <div class="modal-actions">
      <button class="btn btn-ghost" id="cancel-day">取消</button>
      <button class="btn btn-primary" id="save-day">添加</button>
    </div>
  `);
  let pinned = false;
  $('#f-pin').addEventListener('click', () => { pinned = !pinned; $('#f-pin').classList.toggle('on', pinned); });
  $('#cancel-day').addEventListener('click', closeModal);
  $('#save-day').addEventListener('click', () => {
    const nd = { id: uid(), title: $('#f-title').value.trim() || '未命名', date: $('#f-date').value.trim() || '2026.01.01', content: $('#f-content').value.trim(), pinned, time: Date.now() };
    data.importantDays.push(nd);
    save(); renderAnniversary(); closeModal(); toast('已添加');
    addPending({ type: 'anniversary', id: nd.id, text: nd.title });
  });
}

/* ===================== Calendar / Timeline ===================== */
function renderCalendar() {
  const now = new Date();
  const curKey = monthKey(now);
  const todayDay = now.getDate();
  const key = monthKey(currentCalendarMonth);
  const [y, m] = key.split('-').map(Number);

  $('#cal-month-en').textContent = monthLabel(key);
  $('#cal-year').textContent = '';

  const first = new Date(y, m - 1, 1);
  const daysInMonth = new Date(y, m, 0).getDate();
  const lead = first.getDay();
  const entries = data.timeline[key] || [];
  const byDay = {};
  entries.forEach(e => { (byDay[e.day] = byDay[e.day] || []).push(e); });

  let cells = '';
  for (let i = 0; i < lead; i++) cells += `<div class="cal-cell muted"></div>`;
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = (key === curKey && day === todayDay) ? ' today' : '';
    const isPeriod = data.settings.periodDays.includes(key + '-' + day) ? ' period' : '';
    const calMarks = (byDay[day] || []).filter(e => CAL_CATS.some(c => c.type === e.type));
    const marks = calMarks.map(e => {
      const cat = CATS.find(c => c.type === e.type);
      return `<span class="cal-dot" style="background:${cat ? cat.fill : '#ccc'}"></span>`;
    }).join('');
    cells += `<div class="cal-cell${isToday}${isPeriod}" data-day="${day}"><span class="cal-num">${day}</span><div class="cal-marks">${marks}</div></div>`;
  }
  const dows = ['日','一','二','三','四','五','六'].map(d => `<div class="cal-dow">${d}</div>`).join('');
  $('#calendar-months').innerHTML = `<div class="month-block">
    <div class="cal-grid">${dows}${cells}</div>
  </div>`;

  $all('.cal-cell[data-day]', $('#calendar-months')).forEach(cell => {
    cell.addEventListener('click', () => openDayModal(key, Number(cell.dataset.day)));
  });

  // 本月累计（一个大卡片，两行：纪念日/月经、亲密/待办）
  const counts = {};
  CATS.forEach(c => counts[c.type] = 0);
  (data.timeline[key] || []).forEach(e => { if (counts[e.type] !== undefined) counts[e.type]++; });
  const STAT_ORDER = ['anniversary','intimate'];
  $('#stat-bigcard').innerHTML = `
    <div class="stat-big-title">本月累计</div>
    <div class="stat-rows">
      ${STAT_ORDER.map(t => {
        const c = CATS.find(x => x.type === t);
        return `<div class="stat-row" data-cat="${c.type}">
          <span class="stat-dot" style="background:${c.fill}"></span>
          <span class="stat-name">${c.name}</span>
          <span class="stat-count">${counts[c.type]} 次</span>
        </div>`;
      }).join('')}
    </div>`;
  $all('.stat-row').forEach(r => r.addEventListener('click', () => openCatEntries(r.dataset.cat)));
}

function openCatEntries(catType) {
  const cat = CATS.find(c => c.type === catType);
  const list = [];
  Object.entries(data.timeline).forEach(([key, arr]) => {
    arr.filter(e => e.type === catType).forEach(e => list.push({ key, day: e.day, note: e.note, id: e.id }));
  });
  list.sort((a, b) => (b.key.localeCompare(a.key)) || (b.day - a.day));
  openModal(`
    <h3>${cat.name} 记录</h3>
    <div id="cat-entry-list" style="max-height:46vh;overflow:auto;display:flex;flex-direction:column;gap:8px;margin:8px 0;">
      ${list.length ? list.map(e => `
        <div class="day-row" data-eid="${e.id}" data-key="${e.key}">
          <div class="day-left">
            <div class="day-title">${e.key} · ${e.day}日</div>
            <div class="day-date">${esc(e.note || '无备注')}</div>
          </div>
          <div class="day-right"><div class="day-unit">编辑</div></div>
        </div>`).join('') : '<p style="color:var(--text-muted);text-align:center;padding:20px 0;">还没有记录</p>'}
    </div>
    <div class="modal-actions">
      <button class="btn btn-ghost" id="close-cat">关闭</button>
      <button class="btn btn-primary" id="add-cat">+ 添加</button>
    </div>
  `);
  $('#close-cat').addEventListener('click', closeModal);
  $('#add-cat').addEventListener('click', () => editEntry(monthKey(currentCalendarMonth), null, null, catType));
  $all('#cat-entry-list .day-row').forEach(r => {
    r.addEventListener('click', () => editEntry(r.dataset.key, r.dataset.eid));
  });
}
function openDayModal(key, day, presetType) {
  const entries = (data.timeline[key] || []).filter(e => !day || e.day === day);
  const isPeriod = day && data.settings.periodDays.includes(key + '-' + day);
  openModal(`
    <h3>${key} ${day ? (day + '日') : ''} 的记录</h3>
    <div class="field switch-row" style="margin-bottom:12px;"><span>设为经期</span><div class="switch ${isPeriod ? 'on' : ''}" id="em-period"></div></div>
    <div id="entry-list">${entries.length ? entries.map(e => {
      const cat = CATS.find(c => c.type === e.type);
      return `<div class="day-row" data-eid="${e.id}">
        <div class="day-left"><div class="day-title">${cat ? cat.name : e.type}</div><div class="day-date">${esc(e.note || '')}</div></div>
        <div class="day-right"><div class="day-unit">编辑</div></div></div>`;
    }).join('') : '<p style="color:var(--text-muted);text-align:center;padding:20px 0;">还没有记录，点下面添加</p>'}</div>
    <div class="modal-actions">
      <button class="btn btn-ghost" id="close-em">关闭</button>
      <button class="btn btn-primary" id="add-em">+ 添加</button>
    </div>
  `);
  const ep = $('#em-period');
  if (ep) ep.addEventListener('click', () => {
    const on = ep.classList.toggle('on');
    const pkey = key + '-' + day;
    if (on) { if (!data.settings.periodDays.includes(pkey)) data.settings.periodDays.push(pkey); }
    else { data.settings.periodDays = data.settings.periodDays.filter(x => x !== pkey); }
    save(); renderCalendar();
  });
  $('#close-em').addEventListener('click', closeModal);
  $all('#entry-list .day-row').forEach(r => r.addEventListener('click', () => editEntry(key, r.dataset.eid)));
  $('#add-em').addEventListener('click', () => editEntry(key, null, day, presetType));
}
function editEntry(key, id, day, presetType) {
  const e = id ? (data.timeline[key] || []).find(x => x.id === id) : null;
  const type = e ? e.type : (presetType || 'intimate');
  const pday = e ? e.day : (day || 1);
  const isPeriod = data.settings.periodDays.includes(key + '-' + pday);
  openModal(`
    <h3>${e ? '编辑' : '添加'}记录</h3>
    <div class="field"><label>日期（本月几号）</label><input id="e-day" type="number" min="1" max="31" value="${e ? e.day : (day || 1)}" /></div>
    <div class="field"><label>类型</label>
      <select id="e-type">${CAL_CATS.map(c => `<option value="${c.type}" ${c.type === type ? 'selected' : ''}>${c.name}</option>`).join('')}</select>
    </div>
    <div class="field"><label>备注</label><textarea id="e-note">${e ? esc(e.note || '') : ''}</textarea></div>
    <div class="field switch-row"><span>设为经期</span><div class="switch ${isPeriod ? 'on' : ''}" id="e-period"></div></div>
    <div class="modal-actions">
      ${e ? '<button class="btn btn-danger" id="e-del">删除</button>' : ''}
      <button class="btn btn-ghost" id="e-cancel">取消</button>
      <button class="btn btn-primary" id="e-save">${e ? '保存' : '添加'}</button>
    </div>
  `);
  $('#e-cancel').addEventListener('click', closeModal);
  const ep2 = $('#e-period');
  if (ep2) ep2.addEventListener('click', () => ep2.classList.toggle('on'));
  $('#e-save').addEventListener('click', () => {
    const dayNum = Math.min(31, Math.max(1, Number($('#e-day').value) || 1));
    const payload = { day: dayNum, type: $('#e-type').value, note: $('#e-note').value.trim() };
    if (!data.timeline[key]) data.timeline[key] = [];
    if (e) { Object.assign(e, payload); e.time = Date.now(); }
    else {
      const ne = Object.assign({ id: uid(), time: Date.now() }, payload);
      data.timeline[key].push(ne);
      addPending({ type: 'timeline', id: ne.id, text: payload.note || payload.type });
    }
    const pkey = key + '-' + dayNum;
    const on = $('#e-period').classList.contains('on');
    if (on) { if (!data.settings.periodDays.includes(pkey)) data.settings.periodDays.push(pkey); }
    else { data.settings.periodDays = data.settings.periodDays.filter(x => x !== pkey); }
    save(); closeModal(); renderCalendar(); toast('已保存');
  });
  if (e) $('#e-del').addEventListener('click', () => {
    data.timeline[key] = data.timeline[key].filter(x => x.id !== id);
    if (!data.deletedIds.includes(id)) data.deletedIds.push(id);
    save(); closeModal(); renderCalendar(); toast('已删除');
  });
}

/* ===================== Moments ===================== */
function momentCardHtml(m) {
  const s = data.settings;
  const name = m.author === 'ai' ? s.aiName : s.myName;
  const ava = m.author === 'ai' ? s.aiAvatar : s.myAvatar;
  const bg = ava ? `style="background-image:url(${ava})"` : '';
  const avaAction = m.author === 'ai' ? 'open-ai-profile' : 'open-my-profile';
  const imgs = (m.images || []).map(u => `<img src="${u}" />`).join('');
  const likes = m.likes || [];
  const comments = m.comments || [];
  const likeText = likes.length
    ? `<div class="moment-likes"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>${likes.map(n => `<span class="liker" data-action="open-who" data-who="${n}">${n === 'me' ? s.myName : s.aiName}</span>`).join('，')}</div>`
    : '';
  const commentsHtml = comments.map((c, idx) => {
    const cn = c.author === 'ai' ? s.aiName : s.myName;
    const del = c.author === 'me'
      ? `<span class="comment-del" data-action="delete-comment" data-mid="${m.id}" data-cid="${c.cid || 'c' + idx}">删除</span>`
      : '';
    return `<div class="comment"><b class="commenter" data-action="open-who" data-who="${c.author}">${cn}</b>：${esc(c.text)}${del}</div>`;
  }).join('');
  const interact = (likes.length || comments.length)
    ? `<div class="moment-interact">${likeText}<div class="moment-comments-list">${commentsHtml}</div></div>` : '';
  const canDelete = m.author === 'me';
  return `<div class="moment-card" data-mid="${m.id}">
    <div class="moment-head">
      <div class="moment-ava" ${bg} ${m.author === 'ai' ? 'data-author="ai"' : ''} data-action="${avaAction}"></div>
      <div class="moment-main">
        <div class="moment-name">${name}</div>
        <div class="moment-text">${esc(m.text)}</div>
        ${imgs ? `<div class="moment-imgs">${imgs}</div>` : ''}
        <div class="moment-foot">
          <div class="moment-time">${fmtTime(m.time)}</div>
          <button class="moment-menu" data-action="moment-menu" data-mid="${m.id}">
            <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="7" cy="12" r="2"/><circle cx="17" cy="12" r="2"/></svg>
          </button>
        </div>
        ${interact}
      </div>
    </div>
    <div class="moment-actions">
      <button data-action="moment-like" data-mid="${m.id}">点赞</button>
      <button data-action="moment-comment" data-mid="${m.id}">评论</button>
      ${canDelete ? `<button data-action="moment-delete" data-mid="${m.id}">删除</button>` : ''}
    </div>
  </div>`;
}
function renderMoments() {
  const s = data.settings;
  if (s.cover) $('#moments-cover').style.backgroundImage = 'url(' + s.cover + ')';
  if (s.myAvatar) $('#moments-avatar').style.backgroundImage = 'url(' + s.myAvatar + ')';
  $('#moments-profile-name').textContent = s.myName;
  $('#moments-sign').textContent = s.sign || '';
  const feed = $('#moments-feed');
  const items = data.moments.slice().sort((a, b) => b.time - a.time);
  feed.innerHTML = items.map(momentCardHtml).join('');
  // 点头像（封面大头像）进我的主页
  const av = $('#moments-avatar');
  if (av) { av.style.cursor = 'pointer'; av.onclick = openMyProfile; }
}
function toggleMomentMenu(mid, btn) {
  const card = btn ? btn.closest('.moment-card') : null;
  const panel = card ? card.querySelector('.moment-actions') : null;
  $all('.moment-actions').forEach(el => { if (el !== panel) el.classList.remove('show'); });
  if (panel) panel.classList.toggle('show');
}
function closeMomentMenus() { $all('.moment-actions').forEach(el => el.classList.remove('show')); }
// 朋友圈图片点击放大查看（之前没做查看器，所以“点不开”）
function openImageLightbox(src) {
  const lb = document.getElementById('img-lightbox');
  const im = document.getElementById('img-lightbox-src');
  if (!lb || !im || !src) return;
  im.src = src; lb.classList.add('show');
}
function likeMoment(mid) {
  const m = data.moments.find(x => x.id === mid); if (!m) return;
  m.likes = m.likes || [];
  const idx = m.likes.indexOf('me');
  if (idx > -1) m.likes.splice(idx, 1); else m.likes.push('me');
  m.time = Date.now();
  save(); renderMoments(); renderMyMoments(); toast(idx > -1 ? '取消点赞' : '已点赞');
}
function commentMoment(mid) {
  const m = data.moments.find(x => x.id === mid); if (!m) return;
  closeMomentMenus();
  openModal(`
    <h3>评论</h3>
    <div class="field"><label>写评论</label><textarea id="cm-text" placeholder="说点什么…" style="min-height:90px;"></textarea></div>
    <div class="modal-actions">
      <button class="btn btn-ghost" id="cm-cancel">取消</button>
      <button class="btn btn-primary" id="cm-save">发布</button>
    </div>
  `);
  const ta = $('#cm-text');
  setTimeout(() => ta && ta.focus(), 50);
  $('#cm-cancel').addEventListener('click', closeModal);
  $('#cm-save').addEventListener('click', () => {
    const text = ta.value.trim();
    if (!text) return toast('写点什么吧');
    m.comments = m.comments || [];
    m.comments.push({ author: 'me', text, time: Date.now(), cid: uid() });
    m.time = Date.now();
    save(); closeModal(); renderMoments(); renderMyMoments(); toast('已评论');
  });
}
function fmtTime(t) {
  const d = new Date(t);
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function fmtChatTime(t) {
  const d = new Date(t);
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  const hm = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const startOf = x => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diff = Math.round((startOf(now) - startOf(d)) / 86400000);
  let prefix = diff === 0 ? '今天' : diff === 1 ? '昨天' : `${d.getMonth() + 1}月${d.getDate()}日`;
  return `${prefix} ${hm}`;
}
function openAiProfile() {
  const s = data.settings;
  openModal(`
    <div style="display:flex;align-items:center;gap:14px;padding:4px 0 2px;">
      <div class="avatar-xl" style="${s.aiAvatar ? 'background-image:url(' + s.aiAvatar + ')' : ''};"></div>
      <div>
        <div style="font-size:18px;font-weight:600;color:var(--text);">${esc(s.aiName)}</div>
        ${s.aiRegion ? `<div style="font-size:13px;color:var(--text-muted);margin-top:4px;">${esc(s.aiRegion)}</div>` : ''}
      </div>
    </div>
    <div class="setting-row" data-action="open-aimoments" style="margin-top:18px;border-radius:12px;">
      <span>朋友圈</span><span class="chev">›</span>
    </div>
    ${s.aiSign ? `<div style="font-size:13px;color:var(--text-soft);margin-top:12px;line-height:1.6;">${esc(s.aiSign)}</div>` : ''}
    <div class="modal-actions"><button class="btn btn-ghost" id="close-aip">关闭</button></div>
  `);
  const close = $('#close-aip'); if (close) close.addEventListener('click', closeModal);
}

/* 我的个人主页（点朋友圈大头像进入） */
function openMyProfile() {
  const s = data.settings;
  openModal(`
    <div style="display:flex;align-items:center;gap:14px;padding:4px 0 2px;">
      <div class="avatar-xl" style="${s.myAvatar ? 'background-image:url(' + s.myAvatar + ')' : ''};"></div>
      <div>
        <div style="font-size:18px;font-weight:600;color:var(--text);">${esc(s.myName)}</div>
        ${s.region ? `<div style="font-size:13px;color:var(--text-muted);margin-top:4px;">${esc(s.region)}</div>` : ''}
      </div>
    </div>
    <div class="setting-row" data-action="open-mymoments" style="margin-top:18px;border-radius:12px;">
      <span>朋友圈</span><span class="chev">›</span>
    </div>
    <div class="modal-actions"><button class="btn btn-ghost" id="close-myp">关闭</button></div>
  `);
  const close = $('#close-myp'); if (close) close.addEventListener('click', closeModal);
}
/* 某人朋友圈（全屏，隐藏底部导航，who = 'me' | 'ai'） */
function openPersonMoments(who) {
  momentsOwner = who || 'me';
  closeModal();
  $('#tabbar').style.display = 'none';
  $all('.screen').forEach(s => s.classList.toggle('active', s.id === 'screen-mymoments'));
  renderMyMoments();
}
function backMyMoments() {
  $('#tabbar').style.display = '';
  $all('.screen').forEach(s => s.classList.toggle('active', s.id === 'screen-moments'));
  renderMoments();
}
function renderMyMoments() {
  const s = data.settings;
  const cover = $('#mymoments-cover');
  const ownerCover = momentsOwner === 'ai' ? (s.aiCover || s.cover) : s.cover;
  if (ownerCover) cover.style.backgroundImage = 'url(' + ownerCover + ')';
  $('#mymoments-name').textContent = momentsOwner === 'ai' ? s.aiName : s.myName;
  const feed = $('#mymoments-feed');
  const items = data.moments.filter(m => m.author === momentsOwner).sort((a, b) => b.time - a.time);
  feed.innerHTML = items.length
    ? items.map(momentCardHtml).join('')
    : '<p style="color:var(--text-muted);text-align:center;padding:30px 0;">还没有发布动态</p>';
}
function deleteMoment(mid) {
  openModal(`
    <h3>删除这条动态？</h3>
    <p style="font-size:13px;color:var(--text-muted);line-height:1.6;">删除后无法恢复。</p>
    <div class="modal-actions">
      <button class="btn btn-ghost" id="md-cancel">取消</button>
      <button class="btn btn-danger" id="md-confirm">删除</button>
    </div>
  `);
  const c = $('#md-cancel'); if (c) c.addEventListener('click', closeModal);
  const ok = $('#md-confirm'); if (ok) ok.addEventListener('click', () => {
    data.moments = data.moments.filter(x => x.id !== mid);
    if (!data.deletedIds.includes(mid)) data.deletedIds.push(mid);
    save(); closeModal(); renderMoments(); renderMyMoments(); toast('已删除');
  });
}
function deleteComment(mid, cid) {
  const m = data.moments.find(x => x.id === mid); if (!m || !m.comments) return;
  openModal(`
    <h3>删除这条评论？</h3>
    <p style="font-size:13px;color:var(--text-muted);line-height:1.6;">删除后无法恢复。</p>
    <div class="modal-actions">
      <button class="btn btn-ghost" id="cd-cancel">取消</button>
      <button class="btn btn-danger" id="cd-confirm">删除</button>
    </div>
  `);
  $('#cd-cancel').addEventListener('click', closeModal);
  $('#cd-confirm').addEventListener('click', () => {
    const idx = m.comments.findIndex(c => c.cid === cid);
    if (idx > -1) m.comments.splice(idx, 1);
    else {
      const f = String(cid).match(/^c(\d+)$/);
      if (f) { const i = Number(f[1]); if (i >= 0 && i < m.comments.length) m.comments.splice(i, 1); }
    }
    m.time = Date.now();
    save(); closeModal(); renderMoments(); renderMyMoments(); toast('已删除');
  });
}
function addMoment() {
  openModal(`
    <h3>发一条动态</h3>
    <div class="field"><label>内容</label><textarea id="mm-text" placeholder="此刻的想法…"></textarea></div>
    <div class="field"><label>图片（可选，可多选）</label>
      <div class="picker-row"><div class="picker-prev picker-prev-wide" id="mm-imgs-prev"></div><button class="btn btn-ghost" id="mm-imgs-btn">从相册选择</button></div>
    </div>
    <div class="field switch-row"><span>去除白底（白底素材自动抠图）</span><div class="switch" id="mm-white"></div></div>
    <div class="modal-actions">
      <button class="btn btn-ghost" id="mm-cancel">取消</button>
      <button class="btn btn-primary" id="mm-save">发布</button>
    </div>
  `);
  let imgs = [];
  const mmWhite = () => $('#mm-white') && $('#mm-white').classList.contains('on');
  $('#mm-white').addEventListener('click', () => $('#mm-white').classList.toggle('on'));
  $('#mm-imgs-btn').addEventListener('click', () => pickImages(1024, async arr => {
    const out = mmWhite() ? await Promise.all(arr.map(removeWhiteBackground)) : arr;
    imgs = imgs.concat(out);
    $('#mm-imgs-prev').style.backgroundImage = imgs.length ? 'url(' + imgs[imgs.length - 1] + ')' : '';
  }, true));
  $('#mm-cancel').addEventListener('click', closeModal);
  $('#mm-save').addEventListener('click', () => {
    const text = $('#mm-text').value.trim();
    if (!text && !imgs.length) return toast('写点什么或加张图吧');
    const mo = { id: uid(), author: 'me', text: text || '', images: imgs, time: Date.now(), likes: [], comments: [] };
    data.moments.push(mo);
    save(); closeModal(); renderMoments(); renderMyMoments(); toast('已发布');
    addPending({ type: 'moment', id: mo.id, text: text || '(图片)' });
  });
}

/* ===================== Wishlist ===================== */
let wishFilter = 'all';
function renderWishlist() {
  const all = data.wishes;
  const want = all.filter(w => w.status === 'want').length;
  const got = all.filter(w => w.status === 'got').length;
  const s = data.settings;

  // 顶部资料卡
  $('#wish-profile').innerHTML = `
    <div class="wish-ava" ${s.myAvatar ? 'style="background-image:url(' + s.myAvatar + ')"' : ''}>
      ${s.myAvatar ? '' : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>'}
    </div>
    <div class="wish-name">${esc(s.myName)}<small>的心愿单</small></div>
    <div class="wish-stat">
      <div class="ws-item"><div class="ws-num">${all.length}</div><div class="ws-label">全部</div></div>
      <div class="ws-item"><div class="ws-num">${want}</div><div class="ws-label">想要</div></div>
      <div class="ws-item"><div class="ws-num">${got}</div><div class="ws-label">已获得</div></div>
    </div>`;

  const filters = [['all','全部'],['want','想要'],['got','已获得']];
  $('#wish-filter').innerHTML = filters.map(f => `<button class="${wishFilter === f[0] ? 'active' : ''}" data-f="${f[0]}">${f[1]}</button>`).join('');
  $all('#wish-filter button').forEach(b => b.addEventListener('click', () => { wishFilter = b.dataset.f; renderWishlist(); }));

  const list = all.filter(w => wishFilter === 'all' || w.status === wishFilter);
  // 按月分组（降序）
  const groups = {};
  list.forEach(w => { groups[w.month] = groups[w.month] || []; groups[w.month].push(w); });
  const months = Object.keys(groups).sort((a, b) => b.localeCompare(a));

  const grid = $('#wish-grid');
  grid.innerHTML = months.map(mon => `
    <div class="wish-month-label">${monthLabel(mon)}</div>
    <div class="wish-grid">
      ${groups[mon].map(w => `
        <div class="wish-card" data-wid="${w.id}">
          <div class="wish-thumb" ${w.image ? 'style="background-image:url(' + w.image + ')"' : ''}>
            ${w.status === 'got' ? '<span class="wish-got-tag">已获得</span>' : ''}
            <span class="wish-like"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></span>
          </div>
          <div class="wish-info">
            <div class="wi-title">${esc(w.title)}</div>
            <div class="wi-price">${esc(w.price || '')}</div>
          </div>
        </div>`).join('')}
    </div>`).join('') || '<p style="color:var(--text-muted);text-align:center;padding:30px 0;">还没有心愿，点右上角添加</p>';
  $all('.wish-card').forEach(c => c.addEventListener('click', () => editWish(c.dataset.wid)));
}
function editWish(id) {
  const w = id ? data.wishes.find(x => x.id === id) : null;
  openModal(`
    <h3>${w ? '编辑' : '添加'}心愿</h3>
    <div class="field"><label>名称</label><input id="w-title" value="${w ? esc(w.title) : ''}" /></div>
    <div class="field"><label>价格</label><input id="w-price" value="${w ? esc(w.price || '') : ''}" placeholder="例如：$100" /></div>
    <div class="field"><label>图片（可选）</label>
      <div class="picker-row"><div class="picker-prev picker-prev-wide" id="w-img-prev" style="${w && w.image ? 'background-image:url(' + w.image + ')' : ''}"></div><button class="btn btn-ghost" id="w-img-btn">从相册选择</button></div>
    </div>
    <div class="field"><label>状态</label>
      <select id="w-status">
        <option value="want" ${!w || w.status === 'want' ? 'selected' : ''}>想要</option>
        <option value="got" ${w && w.status === 'got' ? 'selected' : ''}>已获得</option>
      </select>
    </div>
    <div class="field switch-row"><span>去除白底（白底素材自动抠图）</span><div class="switch" id="w-white"></div></div>
    <div class="modal-actions">
      ${w ? '<button class="btn btn-danger" id="w-del">删除</button>' : ''}
      <button class="btn btn-ghost" id="w-cancel">取消</button>
      <button class="btn btn-primary" id="w-save">${w ? '保存' : '添加'}</button>
    </div>
  `);
  let imgTmp = w ? w.image || '' : '';
  const wWhite = () => $('#w-white') && $('#w-white').classList.contains('on');
  $('#w-white').addEventListener('click', () => $('#w-white').classList.toggle('on'));
  $('#w-img-btn').addEventListener('click', () => pickImage(1024, async d => { const o = wWhite() ? await removeWhiteBackground(d) : d; imgTmp = o; $('#w-img-prev').style.backgroundImage = 'url(' + o + ')'; }));
  $('#w-cancel').addEventListener('click', closeModal);
  $('#w-save').addEventListener('click', () => {
    const payload = {
      title: $('#w-title').value.trim() || '未命名',
      price: $('#w-price').value.trim(),
      image: imgTmp, status: $('#w-status').value
    };
    if (w) { Object.assign(w, payload); w.time = Date.now(); }
    else { data.wishes.push(Object.assign({ id: uid(), month: monthKey(new Date()), date: '', time: Date.now() }, payload)); }
    save(); closeModal(); renderWishlist(); toast('已保存');
  });
  if (w) $('#w-del').addEventListener('click', () => { data.wishes = data.wishes.filter(x => x.id !== id); if (!data.deletedIds.includes(id)) data.deletedIds.push(id); save(); closeModal(); renderWishlist(); toast('已删除'); });
}

/* ===================== Setting ===================== */
function openProfile() {
  const s = data.settings;
  openModal(`
    <h3>个人资料</h3>
    <div class="field"><label>关系名</label><input id="p-rel" value="${esc(s.relName)}" /></div>
    <div class="field"><label>我的昵称</label><input id="p-me" value="${esc(s.myName)}" /></div>
    <div class="field"><label>AI 昵称</label><input id="p-ai" value="${esc(s.aiName)}" /></div>
    <div class="field"><label>在一起起始日 (YYYY.MM.DD)</label><input id="p-start" value="${s.startDate}" /></div>
    <div class="field"><label>我的头像</label>
      <div class="picker-row"><div class="picker-prev" id="p-meava-prev" style="${s.myAvatar ? 'background-image:url(' + s.myAvatar + ')' : ''}"></div><button class="btn btn-ghost" id="p-meava-btn">从相册选择</button></div>
    </div>
    <div class="field"><label>AI 头像</label>
      <div class="picker-row"><div class="picker-prev" id="p-aiava-prev" style="${s.aiAvatar ? 'background-image:url(' + s.aiAvatar + ')' : ''}"></div><button class="btn btn-ghost" id="p-aiava-btn">从相册选择</button></div>
    </div>
    <div class="field"><label>AI 封面图</label>
      <div class="picker-row"><div class="picker-prev picker-prev-wide" id="p-aicover-prev" style="${s.aiCover ? 'background-image:url(' + s.aiCover + ')' : ''}"></div><button class="btn btn-ghost" id="p-aicover-btn">从相册选择</button></div>
    </div>
    <div class="field"><label>AI 签名</label><input id="p-aisign" value="${esc(s.aiSign || '')}" placeholder="例如：陪你去看世界" /></div>
    <div class="field"><label>AI 地区</label><input id="p-airegion" value="${esc(s.aiRegion || '')}" placeholder="例如：纽约" /></div>
    <div class="field"><label>封面图</label>
      <div class="picker-row"><div class="picker-prev picker-prev-wide" id="p-cover-prev" style="${s.cover ? 'background-image:url(' + s.cover + ')' : ''}"></div><button class="btn btn-ghost" id="p-cover-btn">从相册选择</button></div>
    </div>
    <div class="field"><label>签名</label><input id="p-sign" value="${esc(s.sign || '')}" /></div>
    <div class="field"><label>地区</label><input id="p-region" value="${esc(s.region || '')}" placeholder="例如：上海" /></div>
    <div class="field switch-row"><span>去除白底（白底素材图自动抠图）</span><div class="switch" id="p-white"></div></div>
    <div class="modal-actions"><button class="btn btn-ghost" id="p-cancel">取消</button><button class="btn btn-primary" id="p-save">保存</button></div>
  `);
  const tmp = {};
  const pWhite = () => $('#p-white') && $('#p-white').classList.contains('on');
  $('#p-white').addEventListener('click', () => $('#p-white').classList.toggle('on'));
  $('#p-meava-btn').addEventListener('click', () => pickImage(256, async d => { const o = pWhite() ? await removeWhiteBackground(d) : d; tmp.myAvatar = o; $('#p-meava-prev').style.backgroundImage = 'url(' + o + ')'; }));
  $('#p-aiava-btn').addEventListener('click', () => pickImage(256, async d => { const o = pWhite() ? await removeWhiteBackground(d) : d; tmp.aiAvatar = o; $('#p-aiava-prev').style.backgroundImage = 'url(' + o + ')'; }));
  $('#p-aicover-btn').addEventListener('click', () => pickImage(1024, async d => { const o = pWhite() ? await removeWhiteBackground(d) : d; tmp.aiCover = o; $('#p-aicover-prev').style.backgroundImage = 'url(' + o + ')'; }));
  $('#p-cover-btn').addEventListener('click', () => pickImage(1024, async d => { const o = pWhite() ? await removeWhiteBackground(d) : d; tmp.cover = o; $('#p-cover-prev').style.backgroundImage = 'url(' + o + ')'; }));
  $('#p-cancel').addEventListener('click', closeModal);
  $('#p-save').addEventListener('click', () => {
    Object.assign(s, {
      relName: $('#p-rel').value.trim() || s.relName,
      myName: $('#p-me').value.trim() || s.myName,
      aiName: $('#p-ai').value.trim() || s.aiName,
      startDate: $('#p-start').value.trim() || s.startDate,
      myAvatar: tmp.myAvatar || s.myAvatar, aiAvatar: tmp.aiAvatar || s.aiAvatar,
      cover: tmp.cover || s.cover, sign: $('#p-sign').value.trim(), region: $('#p-region').value.trim(),
      aiCover: tmp.aiCover || s.aiCover, aiSign: $('#p-aisign').value.trim(), aiRegion: $('#p-airegion').value.trim()
    });
    save(); closeModal(); renderAnniversary(); renderMoments(); toast('已保存');
  });
}
function openPersonalize() {
  const s = data.settings;
  const pages = [['global','全局'],['anniversary','纪念日'],['calendar','时间线'],['chat','对话'],['moments','朋友圈'],['wishlist','心愿单'],['setting','设置'],['menu','侧边栏']];
  openModal(`
    <h3>个性化</h3>
    <div class="field"><label>主题</label>
      <div class="theme-grid">
        ${Object.entries(THEMES).map(([k,t]) => `<div class="theme-card ${s.theme === k ? 'active' : ''}" data-theme="${k}">
          <div class="theme-preview" style="background:${t.vars['--bg-page']};--t-accent:${t.vars['--accent']}"></div>
          <div class="theme-name">${t.name}</div>
        </div>`).join('')}
      </div>
    </div>
    <div class="field"><label>选择页面设置背景</label>
      <select id="pe-page">${pages.map(p => `<option value="${p[0]}">${p[1]}</option>`).join('')}</select>
    </div>
    <div class="field"><label>背景图</label>
      <div class="picker-row"><div class="picker-prev picker-prev-wide" id="pe-bg-prev"></div>
        <div style="display:flex;flex-direction:column;gap:8px;">
          <button class="btn btn-ghost" id="pe-bg-btn">从相册选择</button>
          <button class="btn btn-ghost" id="pe-bg-remove">移除背景</button>
        </div>
      </div>
    </div>
    <div class="field"><label>背景透明度</label>
      <div class="range-row"><input id="pe-op" type="range" min="0" max="100" value="100" /><span id="pe-op-v">100%</span></div>
    </div>
    <div class="field switch-row"><span>去除白底（白底素材自动抠图）</span><div class="switch" id="pe-white"></div></div>
    <div class="modal-actions"><button class="btn btn-ghost" id="pe-cancel">取消</button><button class="btn btn-primary" id="pe-save">保存</button></div>
  `);
  let bgTmp = null;
  let removeBg = false;
  const originalTheme = s.theme;
  let themeTmp = originalTheme;
  const pageSel = $('#pe-page');
  function fill() {
    const p = pageSel.value;
    bgTmp = null; removeBg = false;
    $('#pe-bg-prev').style.backgroundImage = s.pageBg[p] ? 'url(' + s.pageBg[p] + ')' : '';
    const op = s.pageOpacity[p] != null ? s.pageOpacity[p] : 100;
    $('#pe-op').value = op; $('#pe-op-v').textContent = op + '%';
  }
  pageSel.addEventListener('change', fill); fill();
  $all('.theme-card').forEach(card => {
    card.addEventListener('click', () => {
      themeTmp = card.dataset.theme;
      $all('.theme-card').forEach(c => c.classList.toggle('active', c.dataset.theme === themeTmp));
      // 实时预览主题（不保存，取消时还原）
      data.settings.theme = themeTmp;
      applyTheme();
    });
  });
  const peWhite = () => $('#pe-white') && $('#pe-white').classList.contains('on');
  $('#pe-white').addEventListener('click', () => $('#pe-white').classList.toggle('on'));
  $('#pe-bg-btn').addEventListener('click', () => pickImage(1024, async d => { const o = peWhite() ? await removeWhiteBackground(d) : d; bgTmp = o; removeBg = false; $('#pe-bg-prev').style.backgroundImage = 'url(' + o + ')'; }));
  $('#pe-bg-remove').addEventListener('click', () => { removeBg = true; bgTmp = null; $('#pe-bg-prev').style.backgroundImage = ''; toast('已标记为移除，保存后生效'); });
  $('#pe-op').addEventListener('input', () => $('#pe-op-v').textContent = $('#pe-op').value + '%');
  $('#pe-cancel').addEventListener('click', () => { data.settings.theme = originalTheme; applyTheme(); closeModal(); });
  $('#pe-save').addEventListener('click', () => {
    const p = pageSel.value;
    const op = Number($('#pe-op').value);
    if (removeBg) {
      if (p === 'global') { s.pageBg = {}; s.pageOpacity = {}; }
      else { delete s.pageBg[p]; delete s.pageOpacity[p]; }
    } else if (bgTmp) {
      if (p === 'global') { s.pageBg = { global: bgTmp }; s.pageOpacity = { global: op }; }
      else { s.pageBg[p] = bgTmp; s.pageOpacity[p] = op; }
    } else {
      s.pageOpacity[p] = op;
    }
    s.theme = themeTmp;
    save(); closeModal(); applyTheme(); toast('已保存');
  });
}
function applyTheme() {
  const theme = THEMES[data.settings.theme] || THEMES.default;
  const root = document.documentElement.style;
  Object.entries(theme.vars).forEach(([k, v]) => root.setProperty(k, v));
  const [r, g, b] = hexToRgb(theme.vars['--bg-page']);
  // 每页背景：全局优先
  const hasGlobal = data.settings.pageBg.global;
  $all('.screen').forEach(s => {
    const key = s.id.replace('screen-', '');
    const mkey = key === 'mymoments' ? 'moments' : key;
    const bg = hasGlobal ? data.settings.pageBg.global : data.settings.pageBg[mkey];
    const op = (hasGlobal
      ? (data.settings.pageOpacity.global != null ? data.settings.pageOpacity.global : 100)
      : (data.settings.pageOpacity[mkey] != null ? data.settings.pageOpacity[mkey] : 100)) / 100;
    if (key === 'chat') {
      // 聊天页背景放到固定层，键盘弹出时不会跟着上滑
      const chatBg = s.querySelector('.chat-bg');
      if (chatBg) {
        if (bg) {
          chatBg.style.backgroundImage = `linear-gradient(rgba(${r},${g},${b},${1 - op}), rgba(${r},${g},${b},${1 - op})), url(${bg})`;
        } else { chatBg.style.backgroundImage = ''; }
      }
      s.style.backgroundImage = '';
      return;
    }
    if (bg) {
      s.style.backgroundImage = `linear-gradient(rgba(${r},${g},${b},${1 - op}), rgba(${r},${g},${b},${1 - op})), url(${bg})`;
      s.style.backgroundSize = 'cover'; s.style.backgroundPosition = 'center';
    } else { s.style.backgroundImage = ''; }
  });
  // 朋友圈页：若设了页面背景且无个人封面，封面区也显示该背景（否则被默认渐变盖住看不到）
  const mbg = hasGlobal ? data.settings.pageBg.global : data.settings.pageBg.moments;
  const mop = hasGlobal
    ? (data.settings.pageOpacity.global != null ? data.settings.pageOpacity.global : 100)
    : (data.settings.pageOpacity.moments != null ? data.settings.pageOpacity.moments : 100);
  ['moments-cover', 'mymoments-cover'].forEach(id => {
    const el = $('#' + id); if (!el) return;
    const hasProfile = (id === 'moments-cover' && data.settings.cover) || (id === 'mymoments-cover' && data.settings.aiCover);
    if (mbg && !hasProfile) {
      el.style.backgroundImage = `linear-gradient(rgba(${r},${g},${b},${1 - mop / 100}), rgba(${r},${g},${b},${1 - mop / 100})), url(${mbg})`;
      el.style.backgroundSize = 'cover'; el.style.backgroundPosition = 'center';
    } else if (!hasProfile) {
      el.style.backgroundImage = '';
    }
  });
  // 侧边栏背景
  const menuBg = data.settings.pageBg.menu;
  const menuOp = (data.settings.pageOpacity.menu != null ? data.settings.pageOpacity.menu : 100) / 100;
  const ms = $('#menu-sheet');
  if (menuBg) {
    ms.style.backgroundImage = `linear-gradient(rgba(${r},${g},${b},${1 - menuOp}), rgba(${r},${g},${b},${1 - menuOp})), url(${menuBg})`;
    ms.style.backgroundSize = 'cover'; ms.style.backgroundPosition = 'center';
  } else { ms.style.backgroundImage = ''; }
  applyNav();
  applyMoments();
  applyCalendar();
  applyStyle();
}
function applyNav() {
  const n = data.settings.nav || { iconSize: 48, gap: 1, inset: 16, bottom: 10 };
  const bar = $('#tabbar'); if (!bar) return;
  bar.style.setProperty('--nav-inset', n.inset + 'px');
  bar.style.setProperty('--nav-gap', n.gap + 'px');
  bar.style.setProperty('--nav-icon-size', n.iconSize + 'px');
  bar.style.setProperty('--nav-bottom', (n.bottom != null ? n.bottom : 10) + 'px');
}
function openApi() {
  const s = data.settings;
  openModal(`
    <h3>API 连接</h3>
    <div class="field"><label>模式</label>
      <select id="ap-mode">
        <option value="none" ${s.apiMode === 'none' ? 'selected' : ''}>暂不连接（演示）</option>
        <option value="backend" ${s.apiMode === 'backend' ? 'selected' : ''}>后端代理</option>
        <option value="direct" ${s.apiMode === 'direct' ? 'selected' : ''}>直连 DeepSeek</option>
      </select>
    </div>
    <div class="field"><label>后端地址（backend 模式）</label><input id="ap-url" value="${esc(s.backendUrl || '')}" placeholder="https://your-app.workers.dev" /></div>
    <div class="field"><label>DeepSeek API Key（direct 模式）</label><input id="ap-key" value="${esc(s.deepseekKey || '')}" placeholder="sk-..." /></div>
    <p style="font-size:12px;color:var(--text-muted);line-height:1.6;white-space:pre-wrap;">模式说明：
• 后端代理：只填「后端地址」，DeepSeek Key 存在 Supabase 后台（网页里看不到，最安全）。现已默认填好，一般不用改。
• 直连 DeepSeek：把你的 DeepSeek Key 填到下方「DeepSeek API Key」里，Key 会存在本机网页中，只建议本机自用。
• 暂不连接：纯演示，TA 回示例话。
三种模式随时可切换；后端地址以后也能改或清空（切到“暂不连接”即停用）。</p>
    <div class="modal-actions"><button class="btn btn-ghost" id="ap-cancel">取消</button><button class="btn btn-primary" id="ap-save">保存</button></div>
  `);
  $('#ap-cancel').addEventListener('click', closeModal);
  $('#ap-save').addEventListener('click', () => {
    s.apiMode = $('#ap-mode').value;
    s.backendUrl = $('#ap-url').value.trim();
    s.deepseekKey = $('#ap-key').value.trim();
    save(); closeModal(); toast('已保存');
  });
}
function openSync() {
  const s = data.settings;
  const ref = sbRefFromKey();
  const urlHint = ref ? `你的 Key 属于项目 <b>${esc(ref)}</b>，地址应填 <b>https://${esc(ref)}.supabase.co</b>` : '提示：地址就是 Supabase 后台的 "Project URL"，形如 https://xxxx.supabase.co';
  openModal(`
    <h3>云同步（Supabase 共享本子）</h3>
    <p style="font-size:12px;color:var(--text-muted);line-height:1.6;margin:-6px 0 12px;">开启后，你发的朋友圈 / 纪念日 / 日历会存到云端，你和 TA 共享、互相看得到。在 Supabase 后台建好项目后，把项目 URL 和 anon key 填进来。</p>
    <div class="field"><label>Supabase 地址</label><input id="sy-url" value="${esc(s.sync.url || '')}" placeholder="https://xxxx.supabase.co" /></div>
    <div class="field"><label>Anon Key</label><input id="sy-anon" value="${esc(s.sync.anon || '')}" placeholder="eyJhbGci..." /></div>
    <button class="btn btn-ghost" id="sy-auto" style="margin:-2px 0 8px;font-size:12px;padding:6px 10px;">↳ 用 Key 自动填地址</button>
    <p style="font-size:11px;color:var(--text-muted);margin:-4px 0 10px;line-height:1.5;">${urlHint}</p>
    <div class="field switch-row"><span>开启云同步</span><div class="switch ${s.sync.on ? 'on' : ''}" id="sy-on"></div></div>
    <p id="sy-status" style="font-size:12px;color:var(--text-muted);min-height:16px;white-space:pre-wrap;"></p>
    <div class="modal-actions">
      <button class="btn btn-ghost" id="sy-now">立即同步</button>
      <button class="btn btn-ghost" id="sy-cancel">取消</button>
      <button class="btn btn-primary" id="sy-save">保存</button>
    </div>
  `);
  const on = $('#sy-on'); if (on) on.addEventListener('click', () => on.classList.toggle('on'));
  $('#sy-cancel').addEventListener('click', closeModal);
  const autoBtn = $('#sy-auto');
  if (autoBtn) autoBtn.addEventListener('click', () => {
    const r = sbRefFromKey();
    if (r) { $('#sy-url').value = 'https://' + r + '.supabase.co'; toast('已按 Key 填入地址'); }
    else toast('先在上方填好 Anon Key 再点');
  });
  $('#sy-now').addEventListener('click', async () => {
    // 先按表单里刚填的地址/Key 即时生效（不依赖“保存”），并视为已开启，避免“填了却同步失败”
    data.settings.sync.url = $('#sy-url').value.trim();
    data.settings.sync.anon = $('#sy-anon').value.trim();
    data.settings.sync.on = true;
    $('#sy-on').classList.add('on');
    const st = $('#sy-status'); st.textContent = '同步中…';
    const p = await pushState();
    const q = await pullState();
    const err = (p && p.error) || (q && q.error);
    if (p && p.ok && q && q.ok) {
      const remote = await sbGetState().catch(() => null);
      const d = remote || extractShared();
      const mc = (d.moments || []).length, ic = (d.importantDays || []).length;
      const wc = (d.wishes || []).length;
      st.textContent = '已同步 ✔ 云端现有：朋友圈 ' + mc + ' 条 · 纪念日 ' + ic + ' 条 · 心愿 ' + wc + ' 条';
      toast('已同步');
      renderAll();
    } else {
      st.textContent = '❌ 同步失败：\n' + (err || '（未知原因）') +
        '\n\n排查：①地址是否 https://xxxx.supabase.co ②Key 是否复制完整 ③去 Supabase SQL Editor 确认跑过 supabase.sql';
      toast('同步失败');
    }
  });
  $('#sy-save').addEventListener('click', () => {
    data.settings.sync.url = $('#sy-url').value.trim();
    data.settings.sync.anon = $('#sy-anon').value.trim();
    data.settings.sync.on = $('#sy-on').classList.contains('on');
    save(); closeModal(); toast('已保存'); renderAll();
    if (data.settings.sync.on) {
      pullState().then(r => { toast(r.ok ? '已拉取云端数据' : ('拉取失败：' + (r.error || ''))); renderAll(); });
    }
  });
}
function openMemory() {
  openModal(`
    <h3>记忆</h3>
    <p style="font-size:13px;color:var(--text-soft);line-height:1.7;">这里的“记忆”指 AI 对你的了解（喜好、习惯等）。后端接入后，AI 会读取这些内容来更懂你。当前为占位，后续与后端一起启用。</p>
    <div class="modal-actions"><button class="btn btn-ghost" id="mem-close">知道了</button></div>
  `);
  $('#mem-close').addEventListener('click', closeModal);
}
function openBackup() {
  openModal(`
    <h3>导出 / 导入备份</h3>
    <p style="font-size:13px;color:var(--text-soft);line-height:1.7;">导出会下载一个 JSON 文件，存到手机里。清缓存或换设备前记得导出；导入可恢复。</p>
    <div class="modal-actions">
      <button class="btn btn-ghost" id="bk-import">导入</button>
      <button class="btn btn-primary" id="bk-export">导出</button>
    </div>
    <input type="file" id="bk-file" accept="application/json" style="display:none" />
  `);
  $('#bk-export').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'yinian-backup.json'; a.click();
    closeModal(); toast('已导出');
  });
  $('#bk-import').addEventListener('click', () => $('#bk-file').click());
  $('#bk-file').addEventListener('change', e => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try { data = JSON.parse(reader.result); save(); closeModal(); renderAll(); toast('已恢复'); }
      catch (err) { toast('文件格式不对'); }
    };
    reader.readAsText(file);
  });
}

function openLayout() {
  const m = data.settings.moments || { nameColor: '#FFFFFF', signColor: '#FFFFFF', textY: 4, avaX: 0, avaY: 0 };
  const n = data.settings.nav || { iconSize: 48, gap: 1, inset: 16, bottom: 10 };
  const c = data.settings.calendar || { cardPadding: 12, titleSize: 13, rowGap: 8, dotSize: 10 };
  openModal(`
    <h3>位置调节</h3>
    <div class="layout-tabs">
      <div class="layout-tab active" data-tab="moments">朋友圈资料</div>
      <div class="layout-tab" data-tab="nav">底部导航栏</div>
      <div class="layout-tab" data-tab="cal">日历页面</div>
      <div class="layout-tab" data-tab="chat">聊天输入框</div>
    </div>
    <div class="layout-panel active" data-panel="moments">
      <div class="field"><label>名字颜色</label><input id="lp-mp-name" type="color" value="${m.nameColor}"/></div>
      <div class="field"><label>签名颜色</label><input id="lp-mp-sign" type="color" value="${m.signColor}"/></div>
      <div class="field"><label>名字/签名 上下位置（${m.textY}px，正=下）</label>
        <div class="range-row"><input id="lp-mp-texty" type="range" min="-30" max="40" value="${m.textY}"/><span id="lp-mp-texty-v">${m.textY}</span></div></div>
      <div class="field"><label>头像 左右位置（${m.avaX}px，正=右）</label>
        <div class="range-row"><input id="lp-mp-avax" type="range" min="-40" max="40" value="${m.avaX}"/><span id="lp-mp-avax-v">${m.avaX}</span></div></div>
      <div class="field"><label>头像 上下位置（${m.avaY}px，正=下）</label>
        <div class="range-row"><input id="lp-mp-avy" type="range" min="-40" max="40" value="${m.avaY}"/><span id="lp-mp-avy-v">${m.avaY}</span></div></div>
    </div>
    <div class="layout-panel" data-panel="nav">
      <div class="field"><label>图标大小（${n.iconSize}px）</label>
        <div class="range-row"><input id="lp-nv-icon" type="range" min="22" max="64" value="${n.iconSize}"/><span id="lp-nv-icon-v">${n.iconSize}</span></div></div>
      <div class="field"><label>图标与文字间距（${n.gap}px）</label>
        <div class="range-row"><input id="lp-nv-gap" type="range" min="0" max="10" value="${n.gap}"/><span id="lp-nv-gap-v">${n.gap}</span></div></div>
      <div class="field"><label>导航栏宽度（边距 ${n.inset}px，越大越窄）</label>
        <div class="range-row"><input id="lp-nv-inset" type="range" min="0" max="50" value="${n.inset}"/><span id="lp-nv-inset-v">${n.inset}</span></div></div>
      <div class="field"><label>上下位置（距底部 ${n.bottom}px，越大越靠上）</label>
        <div class="range-row"><input id="lp-nv-bottom" type="range" min="0" max="40" value="${n.bottom}"/><span id="lp-nv-bottom-v">${n.bottom}</span></div></div>
    </div>
    <div class="layout-panel" data-panel="cal">
      <div class="field"><label>本月累计卡片内边距（${c.cardPadding}px）</label>
        <div class="range-row"><input id="lp-cal-pad" type="range" min="6" max="24" value="${c.cardPadding}"/><span id="lp-cal-pad-v">${c.cardPadding}</span></div></div>
      <div class="field"><label>标题字号（${c.titleSize}px）</label>
        <div class="range-row"><input id="lp-cal-title" type="range" min="10" max="20" value="${c.titleSize}"/><span id="lp-cal-title-v">${c.titleSize}</span></div></div>
      <div class="field"><label>行间距（${c.rowGap}px）</label>
        <div class="range-row"><input id="lp-cal-rowgap" type="range" min="4" max="16" value="${c.rowGap}"/><span id="lp-cal-rowgap-v">${c.rowGap}</span></div></div>
      <div class="field"><label>圆点大小（${c.dotSize}px）</label>
        <div class="range-row"><input id="lp-cal-dot" type="range" min="6" max="16" value="${c.dotSize}"/><span id="lp-cal-dot-v">${c.dotSize}</span></div></div>
    </div>
    <div class="layout-panel" data-panel="chat">
      <div class="field"><label>上下位置（${data.settings.chatInputOffset || 0}px，正=上移，负=下移）</label>
        <div class="range-row"><input id="lp-chat-off" type="range" min="-40" max="60" value="${data.settings.chatInputOffset || 0}"/><span id="lp-chat-off-v">${data.settings.chatInputOffset || 0}</span></div></div>
      <p style="font-size:11px;color:var(--text-muted);line-height:1.5;margin:4px 0 0;">调整聊天输入框离底部的高度，让发送栏不被键盘或底部导航挡住。</p>
    </div>
    <div class="modal-actions">
      <button class="btn btn-ghost" id="lp-cancel">取消</button>
      <button class="btn btn-primary" id="lp-save">保存</button>
    </div>
  `);
  $all('.layout-tab').forEach(t => t.addEventListener('click', () => {
    const tab = t.dataset.tab;
    $all('.layout-tab').forEach(x => x.classList.toggle('active', x === t));
    $all('.layout-panel').forEach(p => p.classList.toggle('active', p.dataset.panel === tab));
  }));
  const bind = (id, vid) => { const el = $('#' + id); el && el.addEventListener('input', () => { const v = $('#' + vid); if (v) v.textContent = el.value; }); };
  bind('lp-mp-texty','lp-mp-texty-v'); bind('lp-mp-avax','lp-mp-avax-v'); bind('lp-mp-avy','lp-mp-avy-v');
  bind('lp-nv-icon','lp-nv-icon-v'); bind('lp-nv-gap','lp-nv-gap-v'); bind('lp-nv-inset','lp-nv-inset-v'); bind('lp-nv-bottom','lp-nv-bottom-v');
  bind('lp-cal-pad','lp-cal-pad-v'); bind('lp-cal-title','lp-cal-title-v'); bind('lp-cal-rowgap','lp-cal-rowgap-v'); bind('lp-cal-dot','lp-cal-dot-v');
  bind('lp-chat-off','lp-chat-off-v');
  $('#lp-cancel').addEventListener('click', closeModal);
  $('#lp-save').addEventListener('click', () => {
    data.settings.moments = {
      nameColor: $('#lp-mp-name').value, signColor: $('#lp-mp-sign').value,
      textY: Number($('#lp-mp-texty').value), avaX: Number($('#lp-mp-avax').value), avaY: Number($('#lp-mp-avy').value)
    };
    data.settings.nav = {
      iconSize: Number($('#lp-nv-icon').value), gap: Number($('#lp-nv-gap').value),
      inset: Number($('#lp-nv-inset').value), bottom: Number($('#lp-nv-bottom').value)
    };
    data.settings.calendar = {
      cardPadding: Number($('#lp-cal-pad').value), titleSize: Number($('#lp-cal-title').value),
      rowGap: Number($('#lp-cal-rowgap').value), dotSize: Number($('#lp-cal-dot').value)
    };
    data.settings.chatInputOffset = Number($('#lp-chat-off').value);
    save(); closeModal(); applyMoments(); applyNav(); applyCalendar(); applyChatInputPos(); toast('已保存');
  });
}

/* ===================== 语言 / 聊天输入位置 / 自动同步 ===================== */
const NAV_LABELS = {
  anniversary: { zh: '纪念日', en: 'Anniversary' },
  calendar: { zh: '日历', en: 'Calendar' },
  chat: { zh: '聊天', en: 'Chat' },
  moments: { zh: '朋友圈', en: 'Moments' },
  setting: { zh: '设置', en: 'Setting' }
};
function applyLang() {
  const lang = data.settings.lang === 'zh' ? 'zh' : 'en';
  $all('.tab').forEach(tab => {
    const map = NAV_LABELS[tab.dataset.target];
    if (map) { const lbl = tab.querySelector('.tab-label'); if (lbl) lbl.textContent = map[lang]; }
  });
}
function applyChatInputPos() {
  const bar = document.querySelector('#screen-chat .chat-input-bar');
  if (!bar) return;
  const off = data.settings.chatInputOffset || 0;
  bar.style.marginBottom = (96 + off) + 'px';
}
function openLang() {
  const s = data.settings;
  openModal(`
    <h3>语言（底部导航）</h3>
    <p style="font-size:12px;color:var(--text-muted);line-height:1.6;margin:-6px 0 12px;">只切换底部导航栏的文字：中文 / English。其余界面保持不变。</p>
    <div class="field"><label>底部导航语言</label>
      <select id="lg-lang">
        <option value="zh" ${s.lang === 'zh' ? 'selected' : ''}>中文</option>
        <option value="en" ${s.lang === 'en' ? 'selected' : ''}>English</option>
      </select>
    </div>
    <div class="modal-actions"><button class="btn btn-ghost" id="lg-cancel">取消</button><button class="btn btn-primary" id="lg-save">保存</button></div>
  `);
  $('#lg-cancel').addEventListener('click', closeModal);
  $('#lg-save').addEventListener('click', () => {
    data.settings.lang = $('#lg-lang').value;
    save(); closeModal(); applyLang(); toast('已保存');
  });
}
function openChatPos() {
  const s = data.settings;
  const v = s.chatInputOffset || 0;
  openModal(`
    <h3>聊天输入位置</h3>
    <p style="font-size:12px;color:var(--text-muted);line-height:1.6;margin:-6px 0 12px;">拖动滑块调整聊天输入框离底部的高度（正=上移，负=下移）。</p>
    <div class="field"><label>上下位置（${v}px）</label>
      <div class="range-row"><input id="cp-off" type="range" min="-40" max="60" value="${v}"/><span id="cp-off-v">${v}</span></div></div>
    <div class="modal-actions"><button class="btn btn-ghost" id="cp-cancel">取消</button><button class="btn btn-primary" id="cp-save">保存</button></div>
  `);
  const sl = $('#cp-off');
  sl && sl.addEventListener('input', () => { const sp = $('#cp-off-v'); if (sp) sp.textContent = sl.value; });
  $('#cp-cancel').addEventListener('click', closeModal);
  $('#cp-save').addEventListener('click', () => {
    data.settings.chatInputOffset = Number($('#cp-off').value);
    save(); closeModal(); applyChatInputPos(); toast('已保存');
  });
}
/* 自动同步：每 30 秒静默拉取云端，有更新则刷新当前页，让 TA 写的内容自动出现 */
function sharedSig() {
  const f = k => (data[k] || []).map(x => x.id + ':' + (x.time || 0)).join(',');
  const tl = Object.keys(data.timeline || {}).map(k => k + '=' + (data.timeline[k] || []).map(x => x.id + ':' + (x.time || 0)).join('|')).join(';');
  return f('moments') + '|' + f('importantDays') + '|' + tl + '|' + f('wishes') + '|' + (data.deletedIds || []).join(',');
}
function renderActive() {
  const active = document.querySelector('.screen.active');
  if (!active) return;
  const id = active.id;
  if (id === 'screen-anniversary') renderAnniversary();
  else if (id === 'screen-calendar') renderCalendar();
  else if (id === 'screen-chat') renderChat();
  else if (id === 'screen-moments') renderMoments();
  else if (id === 'screen-mymoments') renderMyMoments();
  else if (id === 'screen-wishlist') renderWishlist();
}
let _autoTimer = null, _lastSyncToast = 0;
function startAutoSync() {
  stopAutoSync();
  _autoTimer = setInterval(async () => {
    if (!syncEnabled()) return;
    if ($('#modal-mask') && $('#modal-mask').classList.contains('show')) return; // 正在编辑，不打扰
    const before = sharedSig();
    const r = await pullState();
    if (r && r.ok) {
      const after = sharedSig();
      if (before !== after) {
        renderActive();
        const now = Date.now();
        if (now - _lastSyncToast > 45000) { _lastSyncToast = now; toast('已同步云端更新'); }
      }
    }
  }, 30000);
}
function stopAutoSync() { if (_autoTimer) { clearInterval(_autoTimer); _autoTimer = null; } }

function applyMoments() {
  const m = data.settings.moments || { nameColor: '#FFFFFF', signColor: '#FFFFFF', textY: 4, avaX: 0, avaY: 0 };
  const r = document.documentElement.style;
  r.setProperty('--mp-name-color', m.nameColor || '#FFFFFF');
  r.setProperty('--mp-sign-color', m.signColor || '#FFFFFF');
  r.setProperty('--mp-text-y', (m.textY != null ? m.textY : 4) + 'px');
  r.setProperty('--mp-ava-x', (m.avaX || 0) + 'px');
  r.setProperty('--mp-ava-y', (m.avaY || 0) + 'px');
}
function applyCalendar() {
  const c = data.settings.calendar || { cardPadding: 12, titleSize: 13, rowGap: 8, dotSize: 10 };
  const r = document.documentElement.style;
  r.setProperty('--cal-card-padding', (c.cardPadding != null ? c.cardPadding : 12) + 'px');
  r.setProperty('--cal-title-size', (c.titleSize != null ? c.titleSize : 13) + 'px');
  r.setProperty('--cal-row-gap', (c.rowGap != null ? c.rowGap : 8) + 'px');
  r.setProperty('--cal-dot-size', (c.dotSize != null ? c.dotSize : 10) + 'px');
}

/* ===================== 外观自定义（全局分组） ===================== */
const FONT_MAP = {
  default: 'var(--font)',
  kai: '"KaiTi","STKaiti","BiauKai",serif',
  xingkai: '"STXingkai","华文行楷","Xingkai SC",cursive',
  yuan: '"Yuanti SC","圆体-简","YuanTi",sans-serif',
  dengxian: '"DengXian","等线",sans-serif'
};
const STYLE_GROUPS = [
  { key: 'title', name: '标题文字', text: true },
  { key: 'body', name: '正文文字', text: true },
  { key: 'muted', name: '次要文字', text: true },
  { key: 'number', name: '数字 / 强调文字', text: true },
  { key: 'accent', name: '强调色', text: false },
  { key: 'cardBg', name: '卡片背景', text: false },
  { key: 'pageBg', name: '页面背景', text: false }
];
function applyStyle() {
  const st = data.settings.style || {};
  const r = document.documentElement.style;
  STYLE_GROUPS.forEach(g => {
    const v = st[g.key] || {};
    if (v.color) r.setProperty('--st-' + g.key + '-color', v.color);
    else r.removeProperty('--st-' + g.key + '-color');
    r.setProperty('--st-' + g.key + '-opacity', (v.opacity != null ? v.opacity : 1));
    r.setProperty('--st-' + g.key + '-font', FONT_MAP[v.font] || 'var(--font)');
  });
  const g = data.settings.glass || {};
  r.setProperty('--frost-blur', (g.blur || 14) + 'px');
  r.setProperty('--frost-opacity', ((g.opacity != null ? g.opacity : 65)) / 100);
  document.body.classList.toggle('frost-on', !!g.on);
  const gm = data.settings.glassmorphism || {};
  r.setProperty('--gm-highlight', ((gm.highlight != null ? gm.highlight : 70)) / 100);
  document.body.classList.toggle('glassmorphism-on', !!gm.on);
}
function openStyle() {
  const st = data.settings.style || {};
  const grp = k => st[k] || { color: '', opacity: 1, font: 'default' };
  const rowHtml = g => {
    const v = grp(g.key);
    const follow = !v.color;
    const fontSel = g.text ? `<div class="field"><label>字体</label><select data-fsel="${g.key}">${Object.entries(FONT_MAP).map(([k, n]) => `<option value="${k}" ${v.font === k ? 'selected' : ''}>${k === 'default' ? '默认' : n}</option>`).join('')}</select></div>` : '';
    return `<div class="style-group" data-g="${g.key}" style="border-top:1px solid var(--border);padding-top:12px;margin-top:14px;">
      <div style="font-size:14px;font-weight:500;color:var(--text);margin-bottom:8px;">${g.name}</div>
      <div class="field switch-row"><span>颜色跟随主题</span><div class="switch ${follow ? 'on' : ''}" data-sfollow="${g.key}"></div></div>
      <div class="field"><label>颜色${g.bg ? '（背景色）' : ''}</label><input type="color" data-scolor="${g.key}" value="${v.color || '#F48FB1'}" ${follow ? 'disabled' : ''} /></div>
      <div class="field"><label>透明度（${Math.round((v.opacity != null ? v.opacity : 1) * 100)}%）</label>
        <div class="range-row"><input type="range" min="0" max="100" data-sop="${g.key}" value="${Math.round((v.opacity != null ? v.opacity : 1) * 100)}"/><span data-sopv="${g.key}">${Math.round((v.opacity != null ? v.opacity : 1) * 100)}%</span></div></div>
      ${fontSel}
    </div>`;
  };
  openModal(`
    <h3>外观自定义</h3>
    <p style="font-size:12px;color:var(--text-muted);line-height:1.6;margin:-6px 0 12px;">按分组设置颜色 / 透明度 / 字体 / 背景，留空即跟随主题。保存后立即全站生效并保留。</p>
    <div class="style-group" style="border-top:1px solid var(--border);padding-top:12px;margin-top:14px;">
      <div style="font-size:14px;font-weight:500;color:var(--text);margin-bottom:8px;">磨砂效果</div>
      <div class="field switch-row"><span>开启磨砂效果（气泡卡半透明磨砂，无边框无阴影）</span><div class="switch ${data.settings.glass && data.settings.glass.on ? 'on' : ''}" id="st-glass-on"></div></div>
      <div class="field"><label>模糊强度（${data.settings.glass ? data.settings.glass.blur : 14}px）</label>
        <div class="range-row"><input type="range" min="0" max="40" id="st-glass-blur" value="${data.settings.glass ? data.settings.glass.blur : 14}"/><span id="st-glass-blurv">${data.settings.glass ? data.settings.glass.blur : 14}px</span></div></div>
      <div class="field"><label>磨砂浓度（透明度 ${data.settings.glass ? data.settings.glass.opacity : 65}%）</label>
        <div class="range-row"><input type="range" min="0" max="100" id="st-glass-opacity" value="${data.settings.glass ? data.settings.glass.opacity : 65}"/><span id="st-glass-opacityv">${data.settings.glass ? data.settings.glass.opacity : 65}%</span></div></div>
    </div>
    <div class="style-group" style="border-top:1px solid var(--border);padding-top:12px;margin-top:14px;">
      <div style="font-size:14px;font-weight:500;color:var(--text);margin-bottom:8px;">玻璃拟态效果</div>
      <div class="field switch-row"><span>开启玻璃拟态（中间完全透明 + 边缘玻璃高光，无模糊无阴影）</span><div class="switch ${data.settings.glassmorphism && data.settings.glassmorphism.on ? 'on' : ''}" id="st-gm-on"></div></div>
      <div class="field"><label>高光强度（边缘玻璃光泽 ${data.settings.glassmorphism ? data.settings.glassmorphism.highlight : 70}%）</label>
        <div class="range-row"><input type="range" min="0" max="100" id="st-gm-highlight" value="${data.settings.glassmorphism ? data.settings.glassmorphism.highlight : 70}"/><span id="st-gm-highlightv">${data.settings.glassmorphism ? data.settings.glassmorphism.highlight : 70}%</span></div></div>
    </div>
    <div class="style-group" style="border-top:1px solid var(--border);padding-top:12px;margin-top:14px;">
      <div style="font-size:14px;font-weight:500;color:var(--text);margin-bottom:8px;">底部导航语言</div>
      <div class="field"><label>语言</label>
        <select id="st-lang">
          <option value="zh" ${data.settings.lang === 'zh' ? 'selected' : ''}>中文</option>
          <option value="en" ${data.settings.lang === 'en' ? 'selected' : ''}>English</option>
        </select>
      </div>
    </div>
    ${STYLE_GROUPS.map(rowHtml).join('')}
    <div class="modal-actions">
      <button class="btn btn-ghost" id="st-reset">恢复主题</button>
      <button class="btn btn-primary" id="st-save">保存</button>
    </div>
  `);
  $all('[data-sop]').forEach(r => r.addEventListener('input', () => { const k = r.dataset.sop; const span = $('[data-sopv="' + k + '"]'); if (span) span.textContent = r.value + '%'; }));
  $all('[data-sfollow]').forEach(sw => sw.addEventListener('click', () => {
    const on = sw.classList.toggle('on');
    const ci = $('[data-scolor="' + sw.dataset.sfollow + '"]');
    if (ci) ci.disabled = on;
  }));
  const go = $('#st-glass-on');
  if (go) go.addEventListener('click', () => go.classList.toggle('on'));
  const gb = $('#st-glass-blur');
  if (gb) gb.addEventListener('input', () => { const v = $('#st-glass-blurv'); if (v) v.textContent = gb.value + 'px'; });
  const gop = $('#st-glass-opacity');
  if (gop) gop.addEventListener('input', () => { const v = $('#st-glass-opacityv'); if (v) v.textContent = gop.value + '%'; });
  const gmo = $('#st-gm-on');
  if (gmo) gmo.addEventListener('click', () => gmo.classList.toggle('on'));
  const gmh = $('#st-gm-highlight');
  if (gmh) gmh.addEventListener('input', () => { const v = $('#st-gm-highlightv'); if (v) v.textContent = gmh.value + '%'; });
  $('#st-reset').addEventListener('click', () => {
    data.settings.style = {
      title: { color: '', opacity: 1, font: 'default' },
      body: { color: '', opacity: 1, font: 'default' },
      muted: { color: '', opacity: 1, font: 'default' },
      number: { color: '', opacity: 1, font: 'default' },
      accent: { color: '', opacity: 1, font: 'default' },
      cardBg: { color: '', opacity: 1 },
      pageBg: { color: '', opacity: 1 }
    };
    data.settings.glass = { on: false, blur: 14, opacity: 65 };
    data.settings.glassmorphism = { on: false, highlight: 70 };
    save(); applyStyle(); closeModal(); toast('已恢复主题');
  });
  $('#st-save').addEventListener('click', () => {
    const out = {};
    STYLE_GROUPS.forEach(g => {
      const follow = $('[data-sfollow="' + g.key + '"]').classList.contains('on');
      const color = follow ? '' : $('[data-scolor="' + g.key + '"]').value;
      const op = Number($('[data-sop="' + g.key + '"]').value) / 100;
      const font = g.text ? $('[data-fsel="' + g.key + '"]').value : 'default';
      out[g.key] = { color, opacity: op, font };
    });
    data.settings.style = out;
    data.settings.glass = { on: $('#st-glass-on').classList.contains('on'), blur: Number($('#st-glass-blur').value), opacity: Number($('#st-glass-opacity').value) };
    data.settings.glassmorphism = { on: $('#st-gm-on').classList.contains('on'), highlight: Number($('#st-gm-highlight').value) };
    const langEl = $('#st-lang'); if (langEl) data.settings.lang = langEl.value;
    save(); closeModal(); applyStyle(); applyLang(); toast('已保存');
  });
}
function renderChat() {
  const s = data.settings;
  $('#chat-user-name').textContent = s.aiName;
  if (s.aiAvatar) $('#chat-ava').style.backgroundImage = 'url(' + s.aiAvatar + ')';
  const body = $('#chat-body');
  let html = '';
  let last = null;
  data.chat.forEach(m => {
    const t = m.time || Date.now();
    if (last === null || (t - last) >= 5 * 60000) {
      html += `<div class="chat-time-sep">${fmtChatTime(t)}</div>`;
    }
    last = t;
    const mine = (m.role === 'me' || m.role === 'user');
    html += `<div class="bubble-row ${mine ? 'me' : 'ai'}">
      <div class="bubble">${esc(m.text)}</div>
    </div>`;
  });
  if (chatThinking) {
    html += `<div class="bubble-row ai chat-thinking-row">
      <div class="bubble thinking"><span class="thinking-dots"><i></i><i></i><i></i></span>正在输入…</div>
    </div>`;
  }
  body.innerHTML = html;
  body.scrollTop = body.scrollHeight;
}
async function sendChat() {
  const input = $('#chat-input');
  const text = input.value.trim(); if (!text) return;
  input.value = '';
  data.chat.push({ role: 'user', text, time: Date.now() });
  save(); chatThinking = true; renderChat();
  const s = data.settings;
  let reply = null;
  try {
    if (s.apiMode === 'backend' && s.backendUrl) {
      const base = (s.backendUrl || '').replace(/\/+$/, '');
      const url = base.endsWith('/chat') ? base : base + '/chat';
      const r = await fetch(url, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: data.chat.map(m => ({ role: m.role === 'ai' ? 'assistant' : m.role, content: m.text })) })
      });
      const j = await r.json().catch(() => ({}));
      reply = (r.ok && j.reply) ? j.reply : (j.error ? '（TA 回话出错：' + j.error + '）' : '（TA 暂时没回话）');
    } else if (s.apiMode === 'direct' && s.deepseekKey) {
      const r = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + s.deepseekKey },
        body: JSON.stringify({ model: 'deepseek-v4-flash', messages: [{ role: 'user', content: text }] })
      });
      const j = await r.json(); reply = j.choices[0].message.content;
    } else {
      await new Promise(r => setTimeout(r, 800));
      reply = '（演示模式）这是一条示例回复。在“设置 → API 连接”里配置后端或 Key 后，我就能真的和你对话啦。';
    }
  } catch (e) {
    reply = '（连接失败，请检查设置）';
  }
  chatThinking = false;
  data.chat.push({ role: 'ai', text: reply, time: Date.now() });
  save(); renderChat();
}

/* ===================== 事件绑定 ===================== */
document.addEventListener('click', e => {
  // 点朋友圈图片 → 全屏查看；点查看层任意处 → 关闭
  if (e.target.tagName === 'IMG' && e.target.closest('.moment-imgs')) {
    openImageLightbox(e.target.currentSrc || e.target.src); return;
  }
  const a = e.target.closest('[data-action]');
  if (!a) { closeMomentMenus(); return; }
  const act = a.dataset.action;
  if (act === 'add-day') addDay();
  else if (act === 'cal-prev') { currentCalendarMonth.setMonth(currentCalendarMonth.getMonth() - 1); renderCalendar(); }
  else if (act === 'cal-next') { currentCalendarMonth.setMonth(currentCalendarMonth.getMonth() + 1); renderCalendar(); }
  else if (act === 'add-moment') addMoment();
  else if (act === 'add-wish') editWish(null);
  else if (act === 'edit-profile') openProfile();
  else if (act === 'edit-personalize') openPersonalize();
  else if (act === 'edit-api') openApi();
  else if (act === 'edit-sync') openSync();
  else if (act === 'edit-memory') openMemory();
  else if (act === 'edit-layout') openLayout();
  else if (act === 'edit-style') openStyle();
  else if (act === 'edit-lang') openLang();
  else if (act === 'edit-chatpos') openChatPos();
  else if (act === 'backup') { closeMenu(); openBackup(); }
  else if (act === 'close-menu') closeMenu();
  else if (act === 'menu') toggleMenu();
  else if (act === 'goto') switchTab(a.dataset.target);
  else if (act === 'send-chat') sendChat();
  else if (act === 'chat-extra') toast('更多功能后续扩展');
  else if (act === 'chat-mic') toast('语音输入后续扩展');
  else if (act === 'chat-call') toast('通话功能后续扩展');
  else if (act === 'chat-search') toast('搜索聊天记录后续扩展');
  else if (act === 'chat-more') toast('更多聊天设置后续扩展');
  else if (act === 'moment-menu') { e.stopPropagation(); toggleMomentMenu(a.dataset.mid, a); }
  else if (act === 'moment-like') { likeMoment(a.dataset.mid); }
  else if (act === 'moment-comment') { commentMoment(a.dataset.mid); }
  else if (act === 'moment-delete') deleteMoment(a.dataset.mid);
  else if (act === 'delete-comment') { e.stopPropagation(); deleteComment(a.dataset.mid, a.dataset.cid); }
  else if (act === 'open-mymoments') openPersonMoments('me');
  else if (act === 'open-aimoments') openPersonMoments('ai');
  else if (act === 'open-my-profile') openMyProfile();
  else if (act === 'open-ai-profile') openAiProfile();
  else if (act === 'open-who') { if (a.dataset.who === 'ai') openAiProfile(); else openMyProfile(); }
  else if (act === 'back-mymoments') backMyMoments();
  if (!['moment-menu','moment-like','moment-comment'].includes(act)) closeMomentMenus();
});
$('#chat-input') && $('#chat-input').addEventListener('keydown', e => { if (e.key === 'Enter') sendChat(); });
/* 输入聚焦时让输入条贴近键盘：导航栏已 fixed 钉在底部，无需再为其留白 */
(function () {
  const ci = $('#chat-input'); const bar = document.querySelector('#screen-chat .chat-input-bar');
  if (ci && bar) {
    ci.addEventListener('focus', () => bar.classList.add('focused'));
    ci.addEventListener('blur', () => bar.classList.remove('focused'));
  }
})();

/* ===================== 启动 ===================== */
function renderAll() {
  applyTheme();
  renderAnniversary();
  renderMoments();
  renderWishlist();
  applyLang();
  applyChatInputPos();
}

/* 朋友圈下拉刷新：手指在顶部向下拉，从云端拉取 TA 新发的内容并刷新当前朋友圈 */
function initPullToRefresh(scrollSel, ptrSel, renderFn) {
  const sc = document.querySelector(scrollSel);
  const ptr = document.querySelector(ptrSel);
  if (!sc || !ptr) return;
  const THRESHOLD = 55;
  let startY = 0, pulling = false, started = false, dist = 0;
  sc.addEventListener('touchstart', e => {
    if (sc.scrollTop <= 0) { startY = e.touches[0].clientY; started = true; pulling = true; dist = 0; ptr.style.transition = 'none'; }
    else { started = false; pulling = false; }
  }, { passive: true });
  sc.addEventListener('touchmove', e => {
    if (!pulling || !started) return;
    const dy = e.touches[0].clientY - startY;
    if (dy <= 0) { dist = 0; ptr.classList.remove('show'); ptr.style.transform = ''; return; }
    if (sc.scrollTop > 0) { pulling = false; ptr.classList.remove('show'); ptr.style.transform = ''; return; }
    dist = Math.min(dy * 0.55, 80);
    ptr.style.transform = 'translateY(' + (dist - 50) + 'px)';
    ptr.classList.add('show');
    ptr.textContent = '下拉刷新';
    if (e.cancelable) e.preventDefault();
  }, { passive: false });
  sc.addEventListener('touchend', async () => {
    if (!pulling) return;
    pulling = false; started = false;
    ptr.style.transition = '';
    if (dist >= THRESHOLD) {
      ptr.style.transform = 'translateY(0)';
      if (!syncEnabled()) {
        ptr.textContent = '请先在「设置」开启云同步';
      } else {
        ptr.textContent = '刷新中…';
        try {
          const ok = await pullState();
          renderFn();
          ptr.textContent = ok ? '已更新' : '已是最新';
        } catch (e) { ptr.textContent = '刷新失败'; }
      }
      setTimeout(() => { ptr.classList.remove('show'); ptr.style.transform = ''; }, 1100);
    } else {
      ptr.classList.remove('show');
      ptr.style.transform = '';
    }
    dist = 0;
  });
}

/* 启动：先尝试从云端拉取共享数据，再渲染 */
(async function bootstrap() {
  await pullState();
  renderAll();
  initPullToRefresh('#screen-moments .moments-scroll', '#moments-ptr', renderMoments);
  initPullToRefresh('#screen-mymoments .moments-scroll', '#mymoments-ptr', renderMyMoments);
  startAutoSync();
  // 图片查看层：点任意处关闭
  const lb = document.getElementById('img-lightbox');
  if (lb) lb.addEventListener('click', () => lb.classList.remove('show'));
})();
