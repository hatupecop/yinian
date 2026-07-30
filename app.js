/* ===================== 余年 App — 前端逻辑 ===================== */
/* 数据层：当前用 localStorage 持久化（单用户自用）。
   后续接后端时，只需把 save()/load() 与页面读写换成 API 调用即可，UI 不用动。 */

const STORE_KEY = 'yinian_data_v1';

const DEFAULT_DATA = {
  settings: {
    relName: 'Claire & Claude',
    myName: 'Claire', aiName: 'Claude',
    startDate: '2026.06.02',
    myAvatar: '', aiAvatar: '', aiHomeAvatar: '', cover: '', sign: '一句话签名',
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
    gmShadow: false,
    bubbleSameAsTheme: true,
    bgFrost: false,
    bgFrostBlur: 18,
    aiFrost: false,
    aiGlass: false,
    apiMode: 'backend', backendUrl: 'https://vlrqxguctptinozjuyds.supabase.co/functions/v1/chat', deepseekKey: '', chatModel: 'deepseek-v4-flash',
    sync: { on: false, url: '', anon: '' },
    lang: 'en',
    chatInputOffset: 0
  },
  importantDays: [
    { id: 'd1', title: 'Our Anniversary', date: '2026.06.02', pinned: true, content: '' },
    { id: 'd2', title: 'His Birthday', date: '2026.09.12', pinned: false, content: '' },
    { id: 'd3', title: 'Trip to Kyoto', date: '2026.03.20', pinned: false, content: '' }
  ],
  bitsOfBliss: [],
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
  deletedIds: [],
  works: []
};
function defaultWorks() {
  const now = Date.now();
  return [
    { id: 'w1', type: 'image', src: 'https://picsum.photos/seed/yinianW1/720/1280', caption: '周末野餐，小狗把三明治偷吃了 🐶', likes: 128, liked: false, faved: false, aiLiked: true, aiFaved: false, time: now - 86400000 * 2,
      comments: [ { name: '我', text: '好可爱！云真的好慢☁️', likes: 3, replies: [ { name: 'TA', text: '下次带你去～', likes: 1 } ] }, { name: '阿白', text: '小狗表情绝了', likes: 8, replies: [] } ] },
    { id: 'w2', type: 'image', src: 'https://picsum.photos/seed/yinianW2/720/1280', caption: '咖啡时光，今天也好好生活了', likes: 64, liked: false, faved: false, aiLiked: false, aiFaved: true, time: now - 86400000,
      comments: [ { name: '丸子', text: '喝的什么呀', likes: 2, replies: [ { name: 'TA', text: '燕麦拿铁', likes: 0 } ] } ] },
    { id: 'w3', type: 'image', src: 'https://picsum.photos/seed/yinianW3/720/1280', caption: '海边吹风，风很轻，烦恼很重', likes: 233, liked: false, faved: false, aiLiked: true, aiFaved: false, time: now - 3600000,
      comments: [] }
  ];
}

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
if (!data.bitsOfBliss) data.bitsOfBliss = [];
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
if (data.settings.gmShadow === undefined) data.settings.gmShadow = false;
if (data.settings.bubbleSameAsTheme === undefined) data.settings.bubbleSameAsTheme = true;
if (data.settings.bgFrost === undefined) data.settings.bgFrost = false;
if (data.settings.bgFrostBlur == null) data.settings.bgFrostBlur = 18;
if (data.settings.topFadeA === undefined) {
  // 兼容旧版单值 topFade：作为“透明度”，高度用默认 20%
  data.settings.topFadeA = (data.settings.topFade !== undefined ? data.settings.topFade : 0);
  data.settings.topFadeH = 20;
}
if (data.settings.topFadeH === undefined) data.settings.topFadeH = 20;
// 迁移：旧版默认 100 会在背景图上糊一层主题色；现已改为中性蒙版且默认关闭，若仍是旧默认则归零
if (data.settings.topFadeA === 100) data.settings.topFadeA = 0;
// 文字自定义 v2：text=文案覆盖，elStyle=各元素字体/颜色/字号，fonts=导入字体
if (!data.settings.text) data.settings.text = {};
if (!data.settings.elStyle) data.settings.elStyle = {};
if (!data.settings.fonts) data.settings.fonts = [];
if (data.settings.globalFont === undefined) data.settings.globalFont = '';
// 旧长按编辑的 elementOverrides 废弃：有残留则迁移到 elStyle（仅保留样式，不保留文案）
if (data.settings.elementOverrides) {
  const old = data.settings.elementOverrides;
  Object.keys(old).forEach(k => {
    const key = k.replace(/^(tkey|eid):/, '');
    const o = old[k];
    if (o.color || o.size) {
      data.settings.elStyle[key] = { font: '', color: o.color || '', size: o.size || 0 };
    }
    if (o.text && !data.settings.text[key]) data.settings.text[key] = o.text;
  });
}
// 作品（抖音风）数据：首次进入自动填充示例作品
if (!data.works) data.works = defaultWorks();
if (!Array.isArray(data.works)) data.works = [];
data.works.forEach(w => { if (w.aiLiked === undefined) w.aiLiked = false; if (w.aiFaved === undefined) w.aiFaved = false; });
delete data.settings.elementOverrides;
if (!data.settings.sync) data.settings.sync = { on: false, url: '', anon: '' };
if (data.settings.sync.on === undefined) data.settings.sync.on = false;
if (data.settings.sync.url === undefined) data.settings.sync.url = '';
if (data.settings.sync.anon === undefined) data.settings.sync.anon = '';
if (!data.deletedIds) data.deletedIds = [];
if (!data.settings.text) data.settings.text = {};
if (!data.settings.elementOverrides) data.settings.elementOverrides = {};
if (!data.settings.elStyle) data.settings.elStyle = {};
// 一次性清理早期 bug：颜色输入框默认值被误存为红色 #C2185B，导致所有元素染红。只清这个特定值，且只跑一次。
if (!data.settings._colorFixV1) {
  Object.keys(data.settings.elStyle).forEach(k => {
    const st = data.settings.elStyle[k];
    if ((st.color || '').toUpperCase() === '#C2185B') {
      st.color = '';
      if (!st.font && !st.size) delete data.settings.elStyle[k];
    }
  });
  data.settings._colorFixV1 = true;
  save();
}
if (!data.settings.lang) data.settings.lang = 'en';
if (data.settings.chatInputOffset === undefined) data.settings.chatInputOffset = 0;
if (data.settings.chatInputHeight === undefined) data.settings.chatInputHeight = 54;
if (!data.settings.think) data.settings.think = { follow: true, bgColor: '#FCE4EC', bgOpacity: 0.5, textColor: '#9b8e88', lineColor: '#F48FB1' };
if (!data.settings.aiBubble) data.settings.aiBubble = { follow: true, bgColor: '#FCE4EC', bgOpacity: 0.6, textColor: '' };
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
  },
  dream: {
    name: '梦境',
    vars: {
      '--bg-page': '#17121c',
      '--bg-card': 'rgba(33,26,40,0.72)',
      '--bg-soft': 'rgba(48,38,56,0.6)',
      '--bg-chip': 'rgba(54,43,63,0.7)',
      '--accent': '#E8A6C0',
      '--accent-deep': '#C77D9E',
      '--text': '#E9DCE6',
      '--text-muted': '#A890A0',
      '--text-soft': '#BFA9B6',
      '--border': 'rgba(255,255,255,0.08)',
      '--dot-intimate': '#E8899B', '--dot-period': '#E8A6C0', '--dot-anniversary': '#E8C45A', '--dot-todo': '#8FB0E8'
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
/* 从相册选视频（不压缩，存本地，不联网、不用图床） */
function pickVideo(cb) {
  const inp = document.createElement('input');
  inp.type = 'file'; inp.accept = 'video/*';
  inp.onchange = () => {
    const file = inp.files && inp.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => cb(reader.result);
    reader.readAsDataURL(file);
  };
  inp.click();
}
/* 可复用媒体选择器：正方形多图/视频，空卡中心+，自定义来源菜单（拍照/相册/文件），每张右上×删除 */
let _srcSheet = null, _srcCb = null, _srcAccept = null, _srcMulti = false, _workPicker = null;
function openFilePicker(accept, capture, multi, cb) {
  const inp = document.createElement('input');
  inp.type = 'file'; inp.accept = accept; if (multi) inp.multiple = true; if (capture) inp.capture = capture;
  inp.onchange = () => { const files = Array.from(inp.files || []); if (!files.length) return; processMediaFiles(files, accept, cb); };
  inp.click();
}
function processMediaFiles(files, accept, cb) {
  const isVideo = accept.indexOf('video') >= 0;
  const out = []; let pending = files.length;
  const done = () => { if (--pending === 0) cb(out); };
  files.forEach(f => {
    const r = new FileReader();
    r.onload = () => {
      if (!isVideo && f.type.indexOf('image') === 0) {
        const img = new Image();
        img.onload = () => {
          const scale = Math.min(1, 1024 / Math.max(img.width, img.height));
          const w = Math.max(1, Math.round(img.width * scale)), h = Math.max(1, Math.round(img.height * scale));
          const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
          cv.getContext('2d').drawImage(img, 0, 0, w, h);
          out.push({ type: 'image', src: cv.toDataURL('image/jpeg', 0.82) }); done();
        };
        img.onerror = () => { out.push({ type: 'image', src: r.result }); done(); };
        img.src = r.result;
      } else { out.push({ type: isVideo ? 'video' : 'image', src: r.result }); done(); }
    };
    r.readAsDataURL(f);
  });
}
function showSourceSheet(accept, multi, cb) {
  // 每次调用都刷新当前回调/参数，避免闭包只捕获第一次的值（会导致后续加图全部路由到第一个选择器而“加不进去”）
  _srcAccept = accept; _srcMulti = multi; _srcCb = cb;
  if (!_srcSheet) {
    const mask = document.createElement('div'); mask.className = 'src-sheet-mask';
    const sheet = document.createElement('div'); sheet.className = 'src-sheet';
    sheet.innerHTML = '<button data-src="camera">拍照</button><button data-src="album">从相册选择</button><button data-src="file">从文件选择</button><button class="src-cancel" data-src="cancel">取消</button>';
    document.body.appendChild(mask); document.body.appendChild(sheet);
    _srcSheet = { mask, sheet };
    mask.addEventListener('click', hideSourceSheet);
    sheet.addEventListener('click', e => {
      const src = e.target.dataset.src; if (!src || src === 'cancel') return hideSourceSheet();
      hideSourceSheet();
      const cap = src === 'camera' ? 'environment' : '';
      openFilePicker(_srcAccept, cap, _srcMulti, files => _srcCb && _srcCb(files));
    });
  }
  _srcSheet.mask.classList.add('show'); _srcSheet.sheet.classList.add('show');
}
function hideSourceSheet() { if (_srcSheet) { _srcSheet.mask.classList.remove('show'); _srcSheet.sheet.classList.remove('show'); } }
function mountMediaPicker(host, opts) {
  opts = opts || {};
  let values = (opts.values || []).slice();
  const accept = opts.accept || 'image';
  const multi = !!opts.multi;
  function render() {
    host.innerHTML = '';
    const grid = document.createElement('div'); grid.className = 'media-grid';
    values.forEach((v, i) => {
      const t = document.createElement('div'); t.className = 'media-thumb'; t.dataset.type = v.type;
      if (v.type === 'video') { const vid = document.createElement('video'); vid.src = v.src; vid.muted = true; vid.style.cssText = 'width:100%;height:100%;object-fit:cover'; t.appendChild(vid); }
      else t.style.backgroundImage = 'url(' + v.src + ')';
      const del = document.createElement('button'); del.className = 'media-del'; del.type = 'button'; del.textContent = '✕';
      del.addEventListener('click', e => { e.stopPropagation(); values.splice(i, 1); render(); opts.onChange && opts.onChange(values); });
      t.appendChild(del); grid.appendChild(t);
    });
    if (multi || values.length === 0) {
      const add = document.createElement('div'); add.className = 'media-add';
      add.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>';
      add.addEventListener('click', () => showSourceSheet(accept, multi, files => { values = values.concat(files); render(); opts.onChange && opts.onChange(values); }));
      grid.appendChild(add);
    }
    host.appendChild(grid);
  }
  render();
  return { get: () => values, set: v => { values = (v || []).slice(); render(); } };
}

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
  if (target === 'home') renderHome();
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
let pendingTextRevert = null;
function closeModal() {
  $('#modal').classList.remove('show');
  $('#modal-mask').classList.remove('show');
  if (pendingTextRevert) { const f = pendingTextRevert; pendingTextRevert = null; try { f(); } catch (e) {} }
}
$('#modal-mask').addEventListener('click', closeModal);

/* ===================== Anniversary ===================== */
function renderAnniversary() {
  const s = data.settings;
  const relTop = $('#rel-name-top'); if (relTop) relTop.textContent = s.relName;
  $('#rel-name-card').textContent = s.relName;
  $('#since-text').innerHTML = '<span class="anni-since-label">since</span> <span class="anni-since-date">' + s.startDate + '</span>';
  const start = parseDot(s.startDate);
  const days = daysBetween(start, new Date());
  $('#days-together').textContent = Math.max(0, days);
  const meAva = $('#avatar-me'); if (s.myAvatar && meAva) meAva.style.backgroundImage = 'url(' + s.myAvatar + ')';
  const aiAva = $('#avatar-ai'); if (s.aiAvatar && aiAva) aiAva.style.backgroundImage = 'url(' + s.aiAvatar + ')';

  const list = $('#important-list');
  const sorted = data.importantDays.slice().sort((a, b) => (b.pinned - a.pinned) || (parseDot(a.date) - parseDot(b.date)));
  list.innerHTML = sorted.map(d => {
    const target = parseDot(d.date);
    const diff = daysBetween(new Date(), target);
    let num, unit, passed = '';
    if (diff > 0) { num = diff; unit = TT('anni.daysLeft'); }
    else if (diff < 0) { num = -diff; unit = TT('anni.daysPassed'); passed = 'passed'; }
    else { num = TT('anni.today'); unit = ''; }
    return `<div class="day-row" data-day="${d.id}">
      <div class="day-left">
        <div class="day-title">${esc(d.title)}${d.pinned ? '<span class="pin">' + TT('anni.pinned') + '</span>' : ''}${d.type && d.type !== 'normal' ? '<span class="day-type ' + d.type + '">' + TT('anni.type.' + d.type) + '</span>' : ''}</div>
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
  renderBits();
}
function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c])); }
function hexToRgb(hex) {
  const m = String(hex).replace('#', '').match(/^(..)(..)(..)$/);
  if (!m) return { r: 251, g: 241, b: 236 };
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
}

function editDay(id) {
  const d = data.importantDays.find(x => x.id === id);
  if (!d) return addDay();
  openModal(`
    <h3>编辑重要日子</h3>
    <div class="field"><label>标题</label><input id="f-title" value="${esc(d.title)}" /></div>
    <div class="field"><label>日期 (YYYY.MM.DD)</label><input id="f-date" value="${d.date}" /></div>
    <div class="field"><label>备注</label><textarea id="f-content">${esc(d.content || '')}</textarea></div>
    <div class="field"><label>类型</label>
      <div class="inline-picker" id="d-type-picker">
        <div class="ip-current" id="d-type-cur">${TT('anni.type.normal')}</div>
        <div class="ip-list">
          <div class="ip-opt sel" data-v="normal">${TT('anni.type.normal')}</div>
        </div>
      </div>
    </div>
    <div class="field switch-row"><span>置顶</span><div class="switch ${d.pinned ? 'on' : ''}" id="f-pin"></div></div>
    <div class="modal-actions">
      <button class="btn btn-danger" id="del-day">删除</button>
      <button class="btn btn-ghost" id="cancel-day">取消</button>
      <button class="btn btn-primary" id="save-day">保存</button>
    </div>
  `);
  let pinned = d.pinned;
  let dayType = 'normal';
  const typePicker = $('#d-type-picker');
  const typeCur = $('#d-type-cur');
  if (typePicker) {
    typeCur.textContent = TT('anni.type.normal');
    typeCur.addEventListener('click', () => typePicker.classList.toggle('open'));
    $all('.ip-opt', typePicker).forEach(opt => opt.addEventListener('click', () => {
      dayType = opt.dataset.v;
      typeCur.textContent = opt.textContent;
      $all('.ip-opt', typePicker).forEach(o => o.classList.toggle('sel', o === opt));
      typePicker.classList.remove('open');
    }));
  }
  $('#f-pin').addEventListener('click', () => { pinned = !pinned; $('#f-pin').classList.toggle('on', pinned); });
  $('#cancel-day').addEventListener('click', closeModal);
  $('#save-day').addEventListener('click', () => {
    d.title = $('#f-title').value.trim() || '未命名';
    d.date = $('#f-date').value.trim();
    d.content = $('#f-content').value.trim();
    d.type = dayType;
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
    <div class="field"><label>类型</label>
      <div class="inline-picker" id="d-type-picker">
        <div class="ip-current" id="d-type-cur">${TT('anni.type.normal')}</div>
        <div class="ip-list">
          <div class="ip-opt sel" data-v="normal">${TT('anni.type.normal')}</div>
        </div>
      </div>
    </div>
    <div class="field switch-row"><span>置顶</span><div class="switch" id="f-pin"></div></div>
    <div class="modal-actions">
      <button class="btn btn-ghost" id="cancel-day">取消</button>
      <button class="btn btn-primary" id="save-day">添加</button>
    </div>
  `);
  let pinned = false;
  let dayType = 'normal';
  const typePicker = $('#d-type-picker');
  const typeCur = $('#d-type-cur');
  if (typePicker) {
    typeCur.textContent = TT('anni.type.normal');
    typeCur.addEventListener('click', () => typePicker.classList.toggle('open'));
    $all('.ip-opt', typePicker).forEach(opt => opt.addEventListener('click', () => {
      dayType = opt.dataset.v;
      typeCur.textContent = opt.textContent;
      $all('.ip-opt', typePicker).forEach(o => o.classList.toggle('sel', o === opt));
      typePicker.classList.remove('open');
    }));
  }
  $('#f-pin').addEventListener('click', () => { pinned = !pinned; $('#f-pin').classList.toggle('on', pinned); });
  $('#cancel-day').addEventListener('click', closeModal);
  $('#save-day').addEventListener('click', () => {
    const nd = { id: uid(), title: $('#f-title').value.trim() || '未命名', date: $('#f-date').value.trim() || '2026.01.01', content: $('#f-content').value.trim(), type: dayType, pinned, time: Date.now() };
    data.importantDays.push(nd);
    save(); renderAnniversary(); closeModal(); toast('已添加');
    addPending({ type: 'anniversary', id: nd.id, text: nd.title });
  });
}

/* ===================== Bits of Bliss ===================== */
function fmtTime(t) {
  if (!t) return '';
  const d = new Date(t), p = n => ('' + n).padStart(2, '0');
  return d.getFullYear() + '.' + p(d.getMonth() + 1) + '.' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
}
function fmtDateOnly(t) {
  if (!t) return '';
  const d = new Date(t), p = n => ('' + n).padStart(2, '0');
  return d.getFullYear() + '.' + p(d.getMonth() + 1) + '.' + p(d.getDate());
}
function pickImageToDataURL(file, cb) {
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      const max = 1024;
      let w = img.width, h = img.height;
      if (w > max || h > max) { const r = Math.min(max / w, max / h); w = Math.round(w * r); h = Math.round(h * r); }
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      try { cb(canvas.toDataURL('image/jpeg', 0.82)); } catch (e) { cb(reader.result); }
    };
    img.onerror = () => cb(reader.result);
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}
function wireImgPick(inputSel, btnSel, prevSel) {
  const input = $(inputSel), btn = $(btnSel), prev = $(prevSel);
  if (btn) btn.addEventListener('click', () => input && input.click());
  if (input) input.addEventListener('change', () => {
    const f = input.files && input.files[0];
    if (!f) return;
    pickImageToDataURL(f, d => { prev.src = d; prev.dataset.b64 = d; prev.classList.add('has-img'); });
  });
}
function renderBits() {
  const list = $('#bit-list');
  if (!list) return;
  const sorted = (data.bitsOfBliss || []).slice().sort((a, b) => (b.time || 0) - (a.time || 0));
  list.innerHTML = sorted.map(b => `
    <div class="bit-row" data-bit="${b.id}">
      <div class="bit-left">
        <div class="bit-title">${esc(b.title)}</div>
        <div class="bit-time">${fmtDateOnly(b.time)}</div>
      </div>
      <div class="bit-chev">›</div>
    </div>`).join('');
  $all('.bit-row', list).forEach(row => row.addEventListener('click', () => showBitDetail(row.dataset.bit)));
}
let currentBitId = null;
function showBitDetail(id) {
  const b = (data.bitsOfBliss || []).find(x => x.id === id);
  if (!b) return;
  currentBitId = id;
  $('#bitDTitle').textContent = b.title;
  $('#bitDDate').textContent = fmtTime(b.time);
  $('#bitDBody').textContent = b.content || '（没有具体内容）';
  const imgs = (b.images && b.images.length) ? b.images : (b.img ? [b.img] : []);
  const wrap = $('#bitDImgs'); wrap.innerHTML = '';
  if (imgs.length === 1) {
    wrap.innerHTML = `<div class="bit-deck-card on"><img src="${imgs[0]}" alt=""></div>`;
  } else if (imgs.length > 1) {
    const cards = imgs.map((s, i) => `<div class="bit-deck-card${i === 0 ? ' on' : ''}"><img src="${s}" alt=""></div>`).join('');
    const dots = imgs.map((_, i) => `<i class="${i === 0 ? 'on' : ''}"></i>`).join('');
    wrap.innerHTML = `<div class="bit-deck">${cards}</div><div class="bit-deck-dots">${dots}</div>`;
    initBitDeck();
  }
  $all('.screen').forEach(s => s.classList.toggle('active', s.id === 'screen-bit'));
}
function initBitDeck() {
  const wrap = document.getElementById('bitDImgs');
  if (!wrap) return;
  const deck = wrap.querySelector('.bit-deck');
  if (!deck) return;
  const cards = [...deck.querySelectorAll('.bit-deck-card')];
  const dots = [...wrap.querySelectorAll('.bit-deck-dots i')];
  let lastApplied = -1;
  let settleT = null;
  function computeBest() {
    const mid = deck.scrollLeft + deck.clientWidth / 2;
    let best = 0, bd = 1e9;
    cards.forEach((c, i) => {
      const cm = c.offsetLeft + c.offsetWidth / 2;
      const dd = Math.abs(cm - mid);
      if (dd < bd) { bd = dd; best = i; }
    });
    return best;
  }
  function commit(best) {
    if (best === lastApplied) return;
    lastApplied = best;
    cards.forEach((c, i) => {
      c.classList.toggle('on', i === best);
      c.classList.toggle('near', Math.abs(i - best) === 1);
    });
    dots.forEach((d, i) => d.classList.toggle('on', i === best));
  }
  // 只在滚动停下后判定居中卡：滚动过程中绝不切换 .on/.near，
  // 杜绝逐帧来回跳导致的缩放/透明度闪烁（安卓 WebView 尤其明显）。
  function onScroll() {
    clearTimeout(settleT);
    settleT = setTimeout(() => commit(computeBest()), 120);
  }
  deck.addEventListener('scroll', onScroll, { passive: true });
  if ('onscrollend' in deck) deck.addEventListener('scrollend', () => { clearTimeout(settleT); commit(computeBest()); });
  requestAnimationFrame(() => {
    deck.scrollLeft = cards[0].offsetLeft - (deck.clientWidth - cards[0].offsetWidth) / 2;
    commit(0);
  });
}
function editBit(id) {
  const b = (data.bitsOfBliss || []).find(x => x.id === id);
  if (!b) return addBit();
  const initImgs = (b.images && b.images.length) ? b.images : (b.img ? [b.img] : []);
  openModal(`
    <h3>编辑幸福瞬间</h3>
    <div class="field"><label>标题</label><input id="b-title" value="${esc(b.title)}" /></div>
    <div class="field"><label>内容</label><textarea id="b-content">${esc(b.content || '')}</textarea></div>
    <div class="field"><label>图片（可选，可多选）</label><div id="b-imgs"></div></div>
    <div class="modal-actions">
      <button class="btn btn-ghost" id="b-cancel">取消</button>
      <button class="btn btn-primary" id="b-save">保存</button>
    </div>`);
  const picker = mountMediaPicker($('#b-imgs'), { accept: 'image', multi: true, values: initImgs.map(s => ({ type: 'image', src: s })), onChange: v => { b.images = v.map(x => x.src); } });
  $('#b-cancel').addEventListener('click', closeModal);
  $('#b-save').addEventListener('click', () => {
    b.title = $('#b-title').value.trim() || '未命名';
    b.content = $('#b-content').value.trim();
    b.images = picker.get().map(x => x.src);
    delete b.img;
    if (!b.time) b.time = Date.now();
    save(); renderBits(); closeModal(); toast('已保存');
  });
}
function addBit() {
  openModal(`
    <h3>记录幸福瞬间</h3>
    <div class="field"><label>标题</label><input id="b-title" placeholder="例如：今晚的晚霞" /></div>
    <div class="field"><label>内容</label><textarea id="b-content" placeholder="写下来这一刻……"></textarea></div>
    <div class="field"><label>图片（可选，可多选）</label><div id="b-imgs"></div></div>
    <div class="modal-actions">
      <button class="btn btn-ghost" id="b-cancel">取消</button>
      <button class="btn btn-primary" id="b-save">保存</button>
    </div>`);
  const picker = mountMediaPicker($('#b-imgs'), { accept: 'image', multi: true, values: [] });
  $('#b-cancel').addEventListener('click', closeModal);
  $('#b-save').addEventListener('click', () => {
    const title = $('#b-title').value.trim() || '未命名';
    const content = $('#b-content').value.trim();
    const images = picker.get().map(x => x.src);
    data.bitsOfBliss = data.bitsOfBliss || [];
    data.bitsOfBliss.unshift({ id: uid(), title, content, time: Date.now(), images });
    save(); renderBits(); closeModal(); toast('已记录');
  });
}

/* ===================== 家 / Home ===================== */
function renderHome() {
  const s = data.settings;
  const greet = $('#home-greet'); if (greet) greet.textContent = 'Hi ' + (s.myName || 'Claire') + ' 💕';
  const start = parseDot(s.startDate);
  const days = Math.max(0, daysBetween(start, new Date()));
  const sub = $('#home-hero-sub'); if (sub) sub.textContent = '在一起的第 ' + days + ' 天 · 今天也想和你虚度时光';
  const nxt = $('#hw-next-val'), nxts = $('#hw-next-sub');
  if (nxt && nxts) {
    const upcoming = data.importantDays.filter(d => daysBetween(new Date(), parseDot(d.date)) > 0).sort((a, b) => parseDot(a.date) - parseDot(b.date))[0];
    if (upcoming) { nxt.textContent = upcoming.title; nxts.textContent = '还有 ' + daysBetween(new Date(), parseDot(upcoming.date)) + ' 天'; }
    else { nxt.textContent = '暂无'; nxts.textContent = '去添加一个吧'; }
  }
  const bv = $('#hw-bliss-val'), bs = $('#hw-bliss-sub');
  if (bv && bs) {
    const bits = (data.bitsOfBliss || []).slice().sort((a, b) => (b.time || 0) - (a.time || 0));
    if (bits[0]) { bv.textContent = bits[0].title; bs.textContent = fmtDateOnly(bits[0].time); }
    else { bv.textContent = '还没有'; bs.textContent = '点 + 记录第一个'; }
  }
}
function openHomeMod(mod) {
  const names = { diary: '交换日记', us: '记录我和他', bliss: '幸福瞬间', memo: '备忘' };
  const desc = { diary: '你和 TA 共写的私密手账，TA 也会基于你们的聊天留下一段反思。', us: '关于你们的小档案：怎么认识、昵称、喜好、几个 Q&A。', bliss: '珍藏每一个小确幸，像一本只属于两个人的宝盒。', memo: '随手记下要记得的事，轻量清单。' };
  openModal(`
    <h3>${names[mod] || '模块'}（预览）</h3>
    <p style="color:var(--text-muted);font-size:14px;line-height:1.7;margin:0 0 8px">${desc[mod] || ''}</p>
    <p style="color:var(--text-muted);font-size:13px;line-height:1.6">这是「家」的预览原型。确认家的形态后，这个入口会接上真实内容。</p>
    <div class="modal-actions"><button class="btn btn-primary" id="hm-ok">知道了</button></div>`);
  const ok = $('#hm-ok'); if (ok) ok.addEventListener('click', closeModal);
}

/* ===================== Calendar / Timeline ===================== */
function renderCalendar() {
  const now = new Date();
  const curKey = monthKey(now);
  const todayDay = now.getDate();
  const key = monthKey(currentCalendarMonth);
  const [y, m] = key.split('-').map(Number);

  $('#cal-month-en').textContent = y + '·' + String(m).padStart(2, '0');
  const cy = $('#cal-year'); if (cy) { cy.textContent = ''; cy.style.display = 'none'; }

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
  const dows = ['SUN','MON','TUE','WED','THU','FRI','SAT'].map(d => `<div class="cal-dow">${d}</div>`).join('');
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
      <div class="inline-picker" id="e-type-picker">
        <div class="ip-current" id="e-type-cur">${CAL_CATS.find(c => c.type === type) ? CAL_CATS.find(c => c.type === type).name : '亲密'}</div>
        <div class="ip-list">
          ${CAL_CATS.map(c => `<div class="ip-opt ${c.type === type ? 'sel' : ''}" data-v="${c.type}">${c.name}</div>`).join('')}
        </div>
      </div>
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
  let entryType = type;
  const eTypePicker = $('#e-type-picker');
  const eTypeCur = $('#e-type-cur');
  if (eTypePicker) {
    eTypeCur.addEventListener('click', () => eTypePicker.classList.toggle('open'));
    $all('.ip-opt', eTypePicker).forEach(opt => opt.addEventListener('click', () => {
      entryType = opt.dataset.v;
      eTypeCur.textContent = opt.textContent;
      $all('.ip-opt', eTypePicker).forEach(o => o.classList.toggle('sel', o === opt));
      eTypePicker.classList.remove('open');
    }));
  }
  const ep2 = $('#e-period');
  if (ep2) ep2.addEventListener('click', () => ep2.classList.toggle('on'));
  $('#e-save').addEventListener('click', () => {
    const dayNum = Math.min(31, Math.max(1, Number($('#e-day').value) || 1));
    const payload = { day: dayNum, type: entryType, note: $('#e-note').value.trim() };
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
  const videoHtml = m.video
    ? `<div class="moment-video"><video src="${esc(m.video)}"${m.videoCover ? ' poster="' + esc(m.videoCover) + '"' : ''} controls preload="metadata"></video></div>`
    : '';
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
  const canDelete = m.author === 'me' || m.author === 'ai';
  return `<div class="moment-card" data-mid="${m.id}">
    <div class="moment-head">
      <div class="moment-ava" ${bg} ${m.author === 'ai' ? 'data-author="ai"' : ''} data-action="${avaAction}"></div>
      <div class="moment-main">
        <div class="moment-name">${name}</div>
        <div class="moment-text">${esc(m.text)}</div>
        ${videoHtml}${imgs ? `<div class="moment-imgs">${imgs}</div>` : ''}
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
      <div class="avatar-xl" style="${(s.aiHomeAvatar || s.aiAvatar) ? 'background-image:url(' + (s.aiHomeAvatar || s.aiAvatar) + ')' : ''};"></div>
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
    <div class="field"><label>图片（可选，可多选）</label><div id="mm-imgs"></div></div>
    <div class="field"><label>视频（可选，与图片二选一）</label><div id="mm-video"></div></div>
    <div class="field"><label>视频封面（可选，选了视频可设）</label><div id="mm-cover"></div></div>
    <div class="field switch-row"><span>去除白底（白底素材自动抠图）</span><div class="switch" id="mm-white"></div></div>
    <div class="modal-actions">
      <button class="btn btn-ghost" id="mm-cancel">取消</button>
      <button class="btn btn-primary" id="mm-save">发布</button>
    </div>`);
  let imgs = [], video = '', videoCover = '';
  const imgPicker = mountMediaPicker($('#mm-imgs'), { accept: 'image', multi: true, values: [] });
  const vidPicker = mountMediaPicker($('#mm-video'), { accept: 'video', multi: false, values: [] });
  const coverPicker = mountMediaPicker($('#mm-cover'), { accept: 'image', multi: false, values: [] });
  const mmWhite = () => $('#mm-white') && $('#mm-white').classList.contains('on');
  $('#mm-white').addEventListener('click', () => $('#mm-white').classList.toggle('on'));
  $('#mm-cancel').addEventListener('click', closeModal);
  $('#mm-save').addEventListener('click', async () => {
    const text = $('#mm-text').value.trim();
    imgs = imgPicker.get().map(x => x.src);
    video = vidPicker.get().length ? vidPicker.get()[0].src : '';
    videoCover = coverPicker.get().length ? coverPicker.get()[0].src : '';
    if (mmWhite() && imgs.length) imgs = await Promise.all(imgs.map(removeWhiteBackground));
    if (!text && !imgs.length && !video) return toast('写点什么、加张图或视频吧');
    const mo = { id: uid(), author: 'me', text: text || '', images: imgs, video: video || '', videoCover: videoCover || '', time: Date.now(), likes: [], comments: [] };
    data.moments.push(mo);
    save(); closeModal(); renderMoments(); renderMyMoments(); toast('已发布');
    addPending({ type: 'moment', id: mo.id, text: text || (video ? '(视频)' : '(图片)') });
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
    <div class="wish-name" data-eid="wishlist.name">${esc(s.myName)}<small data-tkey="wishlist.nameSuffix">的心愿单</small></div>
    <div class="wish-stat">
      <div class="ws-item"><div class="ws-num">${all.length}</div><div class="ws-label" data-tkey="wishlist.statAll">全部</div></div>
      <div class="ws-item"><div class="ws-num">${want}</div><div class="ws-label" data-tkey="wishlist.statWant">想要</div></div>
      <div class="ws-item"><div class="ws-num">${got}</div><div class="ws-label" data-tkey="wishlist.statGot">已获得</div></div>
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
    <div class="wish-month-label" data-eid="wishlist.monthLabel">${monthLabel(mon)}</div>
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
    </div>`).join('') || `<p style="color:var(--text-muted);text-align:center;padding:30px 0;" data-tkey="wishlist.empty">${TT('wishlist.empty')}</p>`;
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
      <div class="inline-picker" id="w-status-picker">
        <div class="ip-current" id="w-status-cur">${(!w || w.status === 'want') ? '想要' : '已获得'}</div>
        <div class="ip-list">
          <div class="ip-opt ${!w || w.status === 'want' ? 'sel' : ''}" data-v="want">想要</div>
          <div class="ip-opt ${w && w.status === 'got' ? 'sel' : ''}" data-v="got">已获得</div>
        </div>
      </div>
    </div>
    <div class="field switch-row"><span>去除白底（白底素材自动抠图）</span><div class="switch" id="w-white"></div></div>
    <div class="modal-actions">
      ${w ? '<button class="btn btn-danger" id="w-del">删除</button>' : ''}
      <button class="btn btn-ghost" id="w-cancel">取消</button>
      <button class="btn btn-primary" id="w-save">${w ? '保存' : '添加'}</button>
    </div>
  `);
  let imgTmp = w ? w.image || '' : '';
  let wishStatus = w ? w.status : 'want';
  // 内联选择器（状态）：点击展开 / 收起，选中后更新当前值
  const statusPicker = $('#w-status-picker');
  const statusCur = $('#w-status-cur');
  if (statusPicker) {
    statusCur.addEventListener('click', () => statusPicker.classList.toggle('open'));
    $all('.ip-opt', statusPicker).forEach(opt => opt.addEventListener('click', () => {
      wishStatus = opt.dataset.v;
      statusCur.textContent = opt.textContent;
      $all('.ip-opt', statusPicker).forEach(o => o.classList.toggle('sel', o === opt));
      statusPicker.classList.remove('open');
    }));
  }
  const wWhite = () => $('#w-white') && $('#w-white').classList.contains('on');
  $('#w-white').addEventListener('click', () => $('#w-white').classList.toggle('on'));
  $('#w-img-btn').addEventListener('click', () => pickImage(1024, async d => { const o = wWhite() ? await removeWhiteBackground(d) : d; imgTmp = o; $('#w-img-prev').style.backgroundImage = 'url(' + o + ')'; }));
  $('#w-cancel').addEventListener('click', closeModal);
  $('#w-save').addEventListener('click', () => {
    const payload = {
      title: $('#w-title').value.trim() || '未命名',
      price: $('#w-price').value.trim(),
      image: imgTmp, status: wishStatus
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
  const subj = { cur: 'ai' };
  const profFields = (who) => {
    const isAi = who === 'ai';
    const ava = isAi ? s.aiAvatar : s.myAvatar;
    const homeAva = isAi ? (s.aiHomeAvatar || '') : '';
    const cover = isAi ? s.aiCover : s.cover;
    const momentSign = isAi ? (s.aiMomentSign || '') : (s.meMomentSign || '');
    const bio = isAi ? (s.aiSign || '') : (s.sign || '');
    const tags = (isAi ? (s.aiTags || []) : (s.meTags || [])).join(', ');
    const region = isAi ? (s.aiRegion || '') : (s.region || '');
    const name = isAi ? (s.aiName || '') : (s.myName || '');
    return `
      <div class="field"><label>${isAi ? 'TA 的名字' : '我的昵称'}</label><input id="p-name" value="${esc(name)}" /></div>
      <div class="field"><label>头像</label>
        <div class="picker-row"><div class="picker-prev" id="p-ava-prev" style="${ava ? 'background-image:url(' + ava + ')' : ''}"></div><button class="btn btn-ghost" id="p-ava-btn">从相册选择</button></div></div>
      ${isAi ? `<div class="field"><label>主页头像（可与聊天头像不同）</label>
        <div class="picker-row"><div class="picker-prev" id="p-homeava-prev" style="${homeAva ? 'background-image:url(' + homeAva + ')' : ''}"></div><button class="btn btn-ghost" id="p-homeava-btn">从相册选择</button></div></div>` : ''}
      <div class="field"><label>封面图</label>
        <div class="picker-row"><div class="picker-prev picker-prev-wide" id="p-cover-prev" style="${cover ? 'background-image:url(' + cover + ')' : ''}"></div><button class="btn btn-ghost" id="p-cover-btn">从相册选择</button></div></div>
      <div class="field"><label>朋友圈个签</label><input id="p-momentsign" value="${esc(momentSign)}" placeholder="今天也要开心" /></div>
      <div class="field"><label>主页简介</label><input id="p-bio" value="${esc(bio)}" placeholder="陪你去看世界" /></div>
      <div class="field"><label>主页标签（逗号分隔）</label><input id="p-tags" value="${esc(tags)}" placeholder="BG, 单机入, 狗狗" /></div>
      <div class="field"><label>地区</label><input id="p-region" value="${esc(region)}" placeholder="上海" /></div>
    `;
  };
  openModal(`
    <h3>个人资料</h3>
    <div class="seg" id="p-seg">
      <div class="seg-opt active" data-who="ai">TA 的资料</div>
      <div class="seg-opt" data-who="me">我的资料</div>
    </div>
    <div id="p-basics">
      <div class="field"><label>关系名</label><input id="p-rel" value="${esc(s.relName)}" /></div>
      <div class="field"><label>在一起起始日 (YYYY.MM.DD)</label><input id="p-start" value="${s.startDate}" /></div>
    </div>
    <div id="p-fields">${profFields('ai')}</div>
    <div class="field switch-row"><span>去除白底（白底素材图自动抠图）</span><div class="switch" id="p-white"></div></div>
    <div class="modal-actions"><button class="btn btn-ghost" id="p-cancel">取消</button><button class="btn btn-primary" id="p-save">保存</button></div>
  `);
  const tmp = {};
  const pWhite = () => $('#p-white') && $('#p-white').classList.contains('on');
  $('#p-white').addEventListener('click', () => $('#p-white').classList.toggle('on'));
  function commitPicks(who) {
    const avaKey = who === 'ai' ? 'aiAvatar' : 'myAvatar';
    const coverKey = who === 'ai' ? 'aiCover' : 'cover';
    s[avaKey] = tmp[avaKey] || s[avaKey];
    s[coverKey] = tmp[coverKey] || s[coverKey];
  }
  function cacheCurrent() {
    const who = subj.cur;
    const name = $('#p-name').value.trim();
    const ms = $('#p-momentsign').value.trim();
    const bio = $('#p-bio').value.trim();
    const tags = ($('#p-tags').value || '').split(',').map(x => x.trim()).filter(Boolean);
    const region = $('#p-region').value.trim();
    commitPicks(who);
    if (who === 'ai') { s.aiName = name || s.aiName; s.aiMomentSign = ms; s.aiSign = bio; s.aiTags = tags; s.aiRegion = region; s.aiHomeAvatar = tmp.aiHomeAvatar || s.aiHomeAvatar; }
    else { s.myName = name || s.myName; s.meMomentSign = ms; s.sign = bio; s.meTags = tags; s.region = region; }
  }
  function bindPickers() {
    const who = subj.cur;
    const avaKey = who === 'ai' ? 'aiAvatar' : 'myAvatar';
    const coverKey = who === 'ai' ? 'aiCover' : 'cover';
    $('#p-ava-btn').addEventListener('click', () => pickImage(256, async d => { const o = pWhite() ? await removeWhiteBackground(d) : d; tmp[avaKey] = o; $('#p-ava-prev').style.backgroundImage = 'url(' + o + ')'; }));
    $('#p-cover-btn').addEventListener('click', () => pickImage(1024, async d => { const o = pWhite() ? await removeWhiteBackground(d) : d; tmp[coverKey] = o; $('#p-cover-prev').style.backgroundImage = 'url(' + o + ')'; }));
    const hb = $('#p-homeava-btn');
    if (hb) hb.addEventListener('click', () => pickImage(256, async d => { const o = pWhite() ? await removeWhiteBackground(d) : d; tmp.aiHomeAvatar = o; $('#p-homeava-prev').style.backgroundImage = 'url(' + o + ')'; }));
  }
  $('#p-seg').querySelectorAll('.seg-opt').forEach(opt => opt.addEventListener('click', () => {
    if (opt.dataset.who === subj.cur) return;
    $('#p-seg').querySelectorAll('.seg-opt').forEach(o => o.classList.remove('active'));
    opt.classList.add('active');
    cacheCurrent();
    subj.cur = opt.dataset.who;
    $('#p-fields').innerHTML = profFields(subj.cur);
    bindPickers();
  }));
  bindPickers();
  $('#p-cancel').addEventListener('click', closeModal);
  $('#p-save').addEventListener('click', () => {
    cacheCurrent();
    Object.assign(s, {
      relName: $('#p-rel').value.trim() || s.relName,
      startDate: $('#p-start').value.trim() || s.startDate
    });
    save(); closeModal(); renderAnniversary(); renderMoments(); renderAiProfile(); toast('已保存');
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
    <div class="field switch-row"><span>背景磨砂（只磨砂此背景图，不动卡片气泡）</span><div class="switch" id="pe-bg-frost"></div></div>
    <div class="field"><label>磨砂浓度（${data.settings.bgFrostBlur != null ? data.settings.bgFrostBlur : 18}px 模糊）</label>
      <div class="range-row"><input type="range" min="0" max="40" id="pe-bg-frost-blur" value="${data.settings.bgFrostBlur != null ? data.settings.bgFrostBlur : 18}" /><span id="pe-bg-frost-blur-v">${data.settings.bgFrostBlur != null ? data.settings.bgFrostBlur : 18}px</span></div></div>
    <div class="modal-actions"><button class="btn btn-ghost" id="pe-cancel">取消</button><button class="btn btn-primary" id="pe-save">保存</button></div>
  `);
  let bgTmp = null;
  let removeBg = false;
  const originalTheme = s.theme;
  const origPageBg = JSON.parse(JSON.stringify(s.pageBg));
  const origPageOpacity = JSON.parse(JSON.stringify(s.pageOpacity));
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
  const pebf = $('#pe-bg-frost'); if (pebf) { pebf.classList.toggle('on', !!data.settings.bgFrost); pebf.addEventListener('click', () => pebf.classList.toggle('on')); }
  const pebfb = $('#pe-bg-frost-blur'); if (pebfb) { pebfb.addEventListener('input', () => { const v = $('#pe-bg-frost-blur-v'); if (v) v.textContent = pebfb.value + 'px'; }); }
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
  $('#pe-bg-btn').addEventListener('click', () => pickImage(1024, async d => { const o = peWhite() ? await removeWhiteBackground(d) : d; bgTmp = o; removeBg = false; const p = pageSel.value; if (p === 'global') { s.pageBg = { global: o }; s.pageOpacity = { global: Number($('#pe-op').value) }; } else { s.pageBg[p] = o; s.pageOpacity[p] = Number($('#pe-op').value); } $('#pe-bg-prev').style.backgroundImage = 'url(' + o + ')'; applyTheme(); }));
  $('#pe-bg-remove').addEventListener('click', () => { removeBg = true; bgTmp = null; const p = pageSel.value; if (p === 'global') { s.pageBg = {}; s.pageOpacity = {}; } else { delete s.pageBg[p]; delete s.pageOpacity[p]; } $('#pe-bg-prev').style.backgroundImage = ''; applyTheme(); toast('已移除，保存后生效'); });
  $('#pe-op').addEventListener('input', () => { const v = $('#pe-op').value; $('#pe-op-v').textContent = v + '%'; const p = pageSel.value; if (p === 'global') { s.pageOpacity = { global: Number(v) }; } else { s.pageOpacity[p] = Number(v); } applyTheme(); });
  $('#pe-cancel').addEventListener('click', () => { data.settings.theme = originalTheme; s.pageBg = JSON.parse(JSON.stringify(origPageBg)); s.pageOpacity = JSON.parse(JSON.stringify(origPageOpacity)); applyTheme(); closeModal(); });
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
    data.settings.bgFrost = $('#pe-bg-frost') ? $('#pe-bg-frost').classList.contains('on') : false;
    data.settings.bgFrostBlur = $('#pe-bg-frost-blur') ? Number($('#pe-bg-frost-blur').value) : 18;
    save(); closeModal(); applyTheme(); toast('已保存');
  });
}
function applyTheme() {
  const theme = THEMES[data.settings.theme] || THEMES.default;
  const root = document.documentElement.style;
  Object.entries(theme.vars).forEach(([k, v]) => root.setProperty(k, v));
  const { r, g, b } = hexToRgb(theme.vars['--bg-page']);
  // 每页背景：全局优先
  const hasGlobal = data.settings.pageBg.global;
  const ta = (data.settings.topFadeA != null ? data.settings.topFadeA : 100) / 100;
  const th = (data.settings.topFadeH != null ? data.settings.topFadeH : 20);
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
          const scrim = Math.min(ta, 0.45);
          const img = scrim > 0
            ? `linear-gradient(to bottom, rgba(0,0,0,${scrim}) 0%, rgba(0,0,0,${scrim}) ${th * 0.5}%, rgba(0,0,0,0) ${th}%, rgba(0,0,0,0) 100%), url(${bg})`
            : `url(${bg})`;
          if (data.settings.bgFrost) { chatBg.style.backgroundImage = 'none'; chatBg.style.setProperty('--bg-img', img); chatBg.classList.add('bg-frost'); }
          else { chatBg.style.backgroundImage = img; chatBg.style.removeProperty('--bg-img'); chatBg.classList.remove('bg-frost'); }
        } else { chatBg.style.backgroundImage = ''; chatBg.style.removeProperty('--bg-img'); chatBg.classList.remove('bg-frost'); }
      }
      s.style.backgroundImage = '';
      return;
    }
    if (bg) {
      // 顶部渐隐改为中性深色蒙版，不再用主题色，避免粉白/蓝白底色糊在背景图上；topFadeA=0 时干净显示图片
      const scrim = Math.min(ta, 0.45);
      const img = scrim > 0
        ? `linear-gradient(to bottom, rgba(0,0,0,${scrim}) 0%, rgba(0,0,0,${scrim}) ${th * 0.5}%, rgba(0,0,0,0) ${th}%, rgba(0,0,0,0) 100%), url(${bg})`
        : `url(${bg})`;
      if (data.settings.bgFrost) { s.style.backgroundImage = 'none'; s.style.setProperty('--bg-img', img); s.classList.add('bg-frost'); }
      else { s.style.backgroundImage = img; s.style.removeProperty('--bg-img'); s.classList.remove('bg-frost'); }
      s.style.backgroundSize = 'cover'; s.style.backgroundPosition = 'center';
      s.style.backgroundColor = 'transparent';
    } else { s.style.backgroundImage = ''; s.style.backgroundColor = ''; s.style.removeProperty('--bg-img'); s.classList.remove('bg-frost'); }
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
      const img = `linear-gradient(rgba(0,0,0,${1 - mop / 100}), rgba(0,0,0,${1 - mop / 100})), url(${mbg})`;
      if (data.settings.bgFrost) { el.style.backgroundImage = 'none'; el.style.setProperty('--bg-img', img); el.classList.add('bg-frost'); }
      else { el.style.backgroundImage = img; el.style.removeProperty('--bg-img'); el.classList.remove('bg-frost'); }
      el.style.backgroundSize = 'cover'; el.style.backgroundPosition = 'center';
    } else if (!hasProfile) {
      el.style.backgroundImage = ''; el.style.removeProperty('--bg-img'); el.classList.remove('bg-frost');
    }
  });
  // 侧边栏背景
  const menuBg = data.settings.pageBg.menu;
  const menuOp = (data.settings.pageOpacity.menu != null ? data.settings.pageOpacity.menu : 100) / 100;
  const ms = $('#menu-sheet');
  if (menuBg) {
    const img = `linear-gradient(rgba(0,0,0,${1 - menuOp}), rgba(0,0,0,${1 - menuOp})), url(${menuBg})`;
    if (data.settings.bgFrost) { ms.style.backgroundImage = 'none'; ms.style.setProperty('--bg-img', img); ms.classList.add('bg-frost'); }
    else { ms.style.backgroundImage = img; ms.style.removeProperty('--bg-img'); ms.classList.remove('bg-frost'); }
    ms.style.backgroundSize = 'cover'; ms.style.backgroundPosition = 'center';
  } else { ms.style.backgroundImage = ''; ms.style.removeProperty('--bg-img'); ms.classList.remove('bg-frost'); }
  applyNav();
  applyMoments();
  applyCalendar();
  applyStyle();
  // 外观可调节变量（主页顶部按钮色 / 聊天面板底色与透明度）
  root.setProperty('--top-btn-color', data.settings.topBtnColor || '');
  root.setProperty('--chat-panel-bg', data.settings.chatPanelBg || '#ffffff');
  root.setProperty('--chat-panel-alpha', (data.settings.chatPanelAlpha != null ? data.settings.chatPanelAlpha : 90));
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
      <div class="field"><label>输入框高度（${data.settings.chatInputHeight || 54}px）</label>
        <div class="range-row"><input id="lp-chat-h" type="range" min="36" max="80" value="${data.settings.chatInputHeight || 54}"/><span id="lp-chat-h-v">${data.settings.chatInputHeight || 54}</span></div></div>
      <p style="font-size:11px;color:var(--text-muted);line-height:1.5;margin:4px 0 0;">上下位置：调整输入框离底部的高度；输入框高度：调整输入框本身的粗细。</p>
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
  bind('lp-chat-off','lp-chat-off-v'); bind('lp-chat-h','lp-chat-h-v');
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
    data.settings.chatInputHeight = Number($('#lp-chat-h').value);
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

/* ===================== 文案 / 字体 / 元素样式自定义 ===================== */
/* EL_CFG: 所有可配置元素。key 用于 settings.text（文案）和 settings.elStyle（字体/颜色/字号）。
   dynamic=true 表示内容由 renderXxx 实时写入；applyText 只在其 text 覆盖非空时才覆盖。
   selector 用于 applyText / applyElStyle 定位元素。 */
const EL_CFG = {
  // 纪念日
  'anni.relNameTop': { group: '纪念日', label: '顶部关系名', selector: '#rel-name-top', dynamic: true },
  'anni.relNameCard': { group: '纪念日', label: '卡片关系名', selector: '#rel-name-card', dynamic: true },
  'anni.heroDays': { group: '纪念日', label: '相伴天数数字', selector: '#days-together', dynamic: true },
  'anni.heroSub': { group: '纪念日', label: 'days together for', selector: '[data-tkey="anni.heroSub"]', default: 'days together for' },
  'anni.sincePrefix': { group: '纪念日', label: 'since 前缀', selector: '#since-text', dynamic: true },
  'anni.sectionTitle': { group: '纪念日', label: 'Important Days', selector: '[data-tkey="anni.sectionTitle"]', default: 'Important Days' },
  'anni.daysLeft': { group: '纪念日', label: 'days left', default: 'days left' },
  'anni.daysPassed': { group: '纪念日', label: 'days passed', default: 'days passed' },
  'anni.today': { group: '纪念日', label: 'Today', default: 'Today' },
  'anni.pinned': { group: '纪念日', label: '置顶标签', default: '置顶' },
  'anni.dayNum': { group: '纪念日', label: '卡片右侧数字', selector: '.day-num' },
  'anni.dayUnit': { group: '纪念日', label: '卡片右侧单位', selector: '.day-unit' },
  'anni.type.normal': { group: '纪念日类型', label: '普通', default: '普通' },
  // 日历
  'cal.month': { group: '日历', label: '月份英文', selector: '#cal-month-en', dynamic: true },
  'cal.year': { group: '日历', label: '年份', selector: '#cal-year', dynamic: true },
  // 聊天
  'chat.userName': { group: '聊天', label: '顶部名字', selector: '#chat-user-name', dynamic: true },
  'chat.online': { group: '聊天', label: '在线状态', selector: '[data-tkey="chat.online"]', default: '在线' },
  'chat.placeholder': { group: '聊天', label: '输入框占位', selector: '#chat-input', prop: 'placeholder', default: 'Type a message...' },
  // 心愿单
  'wishlist.title': { group: '心愿单', label: '顶部标题', selector: '#screen-wishlist .topbar-title', default: 'wishlist' },
  'wishlist.name': { group: '心愿单', label: '资料卡名字', selector: '#wish-profile .wish-name', dynamic: true },
  'wishlist.nameSuffix': { group: '心愿单', label: '的心愿单', selector: '[data-tkey="wishlist.nameSuffix"]', default: '的心愿单' },
  'wishlist.monthLabel': { group: '心愿单', label: '月份标签', selector: '.wish-month-label', dynamic: true },
  'wishlist.statAll': { group: '心愿单', label: '全部', default: '全部' },
  'wishlist.statWant': { group: '心愿单', label: '想要', default: '想要' },
  'wishlist.statGot': { group: '心愿单', label: '已获得', default: '已获得' },
  'wishlist.empty': { group: '心愿单', label: '空状态', default: '还没有心愿，点右上角添加' },
  // 朋友圈
  'moments.profileName': { group: '朋友圈', label: '主页名字', selector: '#moments-profile-name', dynamic: true },
  'moments.ptr': { group: '朋友圈', label: '下拉刷新', default: '下拉刷新' },
  // 设置
  'setting.title': { group: '设置', label: '页面标题', selector: '#screen-setting .topbar-title', default: 'Setting' },
  'setting.row.profile': { group: '设置', label: '个人资料', selector: '[data-tkey="setting.row.profile"]', default: '个人资料' },
  'setting.row.personalize': { group: '设置', label: '个性化', selector: '[data-tkey="setting.row.personalize"]', default: '个性化' },
  'setting.row.style': { group: '设置', label: '外观自定义', selector: '[data-tkey="setting.row.style"]', default: '外观自定义' },
  'setting.row.text': { group: '设置', label: '文案自定义', selector: '[data-tkey="setting.row.text"]', default: '文案自定义' },
  'setting.row.layout': { group: '设置', label: '位置调节', selector: '[data-tkey="setting.row.layout"]', default: '位置调节' },
  'setting.row.api': { group: '设置', label: 'API 连接', selector: '[data-tkey="setting.row.api"]', default: 'API 连接' },
  'setting.row.memory': { group: '设置', label: '记忆', selector: '[data-tkey="setting.row.memory"]', default: '记忆' },
  'setting.row.sync': { group: '设置', label: '云同步', selector: '[data-tkey="setting.row.sync"]', default: '云同步（共享数据）' },
  'setting.row.backup': { group: '设置', label: '备份', selector: '[data-tkey="setting.row.backup"]', default: '导出 / 导入备份' },
  'setting.row.fonts': { group: '设置', label: '字体管理', selector: '[data-tkey="setting.row.fonts"]', default: '字体管理' },
  // 侧边栏 / 通用
  'menu.wishlist': { group: '通用', label: '心愿单', default: '心愿单' },
  'common.save': { group: '通用', label: '保存', default: '保存' },
  'common.cancel': { group: '通用', label: '取消', default: '取消' },
  'common.delete': { group: '通用', label: '删除', default: '删除' },
  'common.add': { group: '通用', label: '添加', default: '添加' },
  // 底部导航
  'nav.anniversary': { group: '底部导航', label: '纪念日', selector: '.tab[data-target="anniversary"] .tab-label', default: '纪念日' },
  'nav.calendar': { group: '底部导航', label: '日历', selector: '.tab[data-target="calendar"] .tab-label', default: '日历' },
  'nav.chat': { group: '底部导航', label: '聊天', selector: '.tab[data-target="chat"] .tab-label', default: '聊天' },
  'nav.moments': { group: '底部导航', label: '朋友圈', selector: '.tab[data-target="moments"] .tab-label', default: '朋友圈' },
  'nav.setting': { group: '底部导航', label: '设置', selector: '.tab[data-target="setting"] .tab-label', default: '设置' }
};

function TT(key) {
  const ov = data.settings.text;
  if (ov && ov[key] != null && String(ov[key]).trim() !== '') return ov[key];
  const cfg = EL_CFG[key];
  if (cfg && cfg.default != null) return cfg.default;
  return key;
}
function applyText() {
  // 底部导航：优先用户覆盖，其次 lang
  $all('.tab').forEach(tab => {
    const t = tab.dataset.target; const el = tab.querySelector('.tab-label');
    const ov = data.settings.text['nav.' + t];
    if (el) {
      if (ov != null && String(ov).trim() !== '') el.textContent = ov;
      else { const m = NAV_LABELS[t]; if (m) el.textContent = m[data.settings.lang === 'zh' ? 'zh' : 'en']; }
    }
  });
  // 其他带 selector 的元素：用户覆盖非空则写入；动态元素没覆盖时由 renderXxx 负责
  Object.keys(EL_CFG).forEach(key => {
    const cfg = EL_CFG[key];
    if (!cfg.selector) return;
    const ov = data.settings.text[key];
    if (ov == null || String(ov).trim() === '') return;
    $all(cfg.selector).forEach(el => {
      if (cfg.prop === 'placeholder') el.placeholder = ov;
      else el.textContent = ov;
    });
  });
}
function applyElStyle() {
  const styles = data.settings.elStyle || {};
  const present = new Set(Object.keys(styles));
  Object.keys(EL_CFG).forEach(key => {
    const cfg = EL_CFG[key];
    if (!cfg || !cfg.selector) return;
    const st = styles[key] || {};
    $all(cfg.selector).forEach(el => {
      if (present.has(key)) {
        el.style.fontFamily = st.font || '';
        el.style.color = st.color || '';
        el.style.fontSize = (st.size > 0 ? st.size + 'px' : '');
      } else {
        // 该元素已无覆盖：清掉之前可能残留的内联样式，否则红字去不掉
        el.style.fontFamily = '';
        el.style.color = '';
        el.style.fontSize = '';
      }
    });
  });
}
function injectFonts() {
  let style = $('#injected-fonts');
  if (!style) { style = document.createElement('style'); style.id = 'injected-fonts'; document.head.appendChild(style); }
  const fonts = data.settings.fonts || [];
  let css = '';
  fonts.forEach(f => {
    if (!f.name || !f.url) return;
    css += `@font-face { font-family: "${f.name}"; src: url("${f.url}"); font-display: swap; }\n`;
  });
  style.textContent = css;
}
function applyFonts() {
  injectFonts();
  const gf = data.settings.globalFont || '';
  document.body.style.fontFamily = gf;
}
function applyChatInputPos() {
  const bar = document.querySelector('#screen-chat .chat-input-bar');
  if (!bar) return;
  const off = data.settings.chatInputOffset || 0;
  bar.style.setProperty('--chat-offset', off + 'px');
  const h = data.settings.chatInputHeight || 54;
  bar.style.setProperty('--chat-height', h + 'px');
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
  else if (id === 'screen-home') renderHome();
  applyText();
  applyElStyle();
  applyFonts();
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
  // 主题同款气泡：开=气泡跟随主题（强制关闭磨砂/玻璃拟态）；关=使用用户 glass/glassmorphism 设置
  const sameTheme = data.settings.bubbleSameAsTheme !== false;
  document.body.classList.toggle('frost-on', !sameTheme && !!g.on);
  const gmOn = !sameTheme && !!(data.settings.glassmorphism && data.settings.glassmorphism.on);
  const aiGmOn = !sameTheme && !!(data.settings.aiGlass);
  document.body.classList.toggle('glassmorphism-on', gmOn);
  document.body.classList.toggle('ai-frost-on', !sameTheme && !!(data.settings.aiFrost));
  document.body.classList.toggle('ai-glass-on', aiGmOn);
  document.body.classList.toggle('gm-shadow-on', !!(data.settings.gmShadow) && (gmOn || aiGmOn));
  document.body.classList.toggle('bg-frost-on', !!(data.settings.bgFrost));
  r.setProperty('--bg-frost-blur', ((data.settings.bgFrostBlur != null ? data.settings.bgFrostBlur : 18)) + 'px');
  const gm = data.settings.glassmorphism || {};
  r.setProperty('--gm-highlight', ((gm.highlight != null ? gm.highlight : 70)) / 100);
  applyThink();
  applyAiBubble();
}
function applyThink() {
  applyThinkVars(data.settings.think || {});
}
function applyThinkVars(t) {
  const r = document.documentElement.style;
  if (t.follow) {
    r.removeProperty('--think-bg');
  } else if (t.bgColor) {
    const c = hexToRgb(t.bgColor);
    r.setProperty('--think-bg', 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + (t.bgOpacity != null ? t.bgOpacity : 0) + ')');
  } else {
    r.removeProperty('--think-bg');
  }
  r.setProperty('--think-text', t.textColor || 'var(--text-muted)');
  r.setProperty('--think-line', t.lineColor || 'var(--accent)');
}
function applyAiBubble(t) {
  const o = t || data.settings.aiBubble || {};
  const r = document.documentElement.style;
  if (o.follow) {
    r.removeProperty('--ai-bubble-bg');
    r.removeProperty('--ai-bubble-text');
  } else {
    if (o.bgColor) {
      const c = hexToRgb(o.bgColor);
      r.setProperty('--ai-bubble-bg', 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + (o.bgOpacity != null ? o.bgOpacity : 0) + ')');
    } else r.removeProperty('--ai-bubble-bg');
    if (o.textColor) r.setProperty('--ai-bubble-text', o.textColor);
    else r.removeProperty('--ai-bubble-text');
  }
}
function openStyle() {
  const st = data.settings.style || {};
  const grp = k => st[k] || { color: '', opacity: 1, font: 'default' };
  const t = data.settings.think || {};
  const tFollow = t.follow !== false;
  const thinkOp = Math.round((t.bgOpacity != null ? t.bgOpacity : 0) * 100);
  const a = data.settings.aiBubble || {};
  const aFollow = a.follow !== false;
  const aibOp = Math.round((a.bgOpacity != null ? a.bgOpacity : 0) * 100);
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
      <div style="font-size:14px;font-weight:500;color:var(--text);margin-bottom:8px;">气泡外观</div>
      <div class="field switch-row"><span>主题同款气泡（关闭后可自定义磨砂 / 拟态玻璃）</span><div class="switch ${data.settings.bubbleSameAsTheme !== false ? 'on' : ''}" id="st-bubble-theme"></div></div>
      <div id="bubble-custom" style="${data.settings.bubbleSameAsTheme !== false ? 'display:none;' : ''}">
        <div style="font-size:13px;font-weight:500;color:var(--text-soft);margin:6px 0 4px;">磨砂效果</div>
        <div class="field switch-row"><span>开启磨砂效果（气泡卡半透明磨砂，无边框无阴影）</span><div class="switch ${data.settings.glass && data.settings.glass.on ? 'on' : ''}" id="st-glass-on"></div></div>
        <div class="field"><label>模糊强度（${data.settings.glass ? data.settings.glass.blur : 14}px）</label>
          <div class="range-row"><input type="range" min="0" max="40" id="st-glass-blur" value="${data.settings.glass ? data.settings.glass.blur : 14}"/><span id="st-glass-blurv">${data.settings.glass ? data.settings.glass.blur : 14}px</span></div></div>
        <div class="field"><label>磨砂浓度（透明度 ${data.settings.glass ? data.settings.glass.opacity : 65}%）</label>
          <div class="range-row"><input type="range" min="0" max="100" id="st-glass-opacity" value="${data.settings.glass ? data.settings.glass.opacity : 65}"/><span id="st-glass-opacityv">${data.settings.glass ? data.settings.glass.opacity : 65}%</span></div></div>
      </div>
    </div>
    <div class="style-group" style="border-top:1px solid var(--border);padding-top:12px;margin-top:14px;">
      <div id="bubble-custom-gm" style="${data.settings.bubbleSameAsTheme !== false ? 'display:none;' : ''}">
        <div style="font-size:13px;font-weight:500;color:var(--text-soft);margin-bottom:6px;">玻璃拟态效果</div>
        <div class="field switch-row"><span>开启玻璃拟态（中间完全透明 + 边缘玻璃高光，无模糊无阴影）</span><div class="switch ${data.settings.glassmorphism && data.settings.glassmorphism.on ? 'on' : ''}" id="st-gm-on"></div></div>
        <div class="field"><label>高光强度（边缘玻璃光泽 ${data.settings.glassmorphism ? data.settings.glassmorphism.highlight : 70}%）</label>
          <div class="range-row"><input type="range" min="0" max="100" id="st-gm-highlight" value="${data.settings.glassmorphism ? data.settings.glassmorphism.highlight : 70}"/><span id="st-gm-highlightv">${data.settings.glassmorphism ? data.settings.glassmorphism.highlight : 70}%</span></div></div>
        <div class="field switch-row"><span>玻璃拟态阴影（气泡/卡片底部黑色投影，默认关）</span><div class="switch ${data.settings.gmShadow ? 'on' : ''}" id="st-gm-shadow"></div></div>
      </div>
    </div>
    <div class="style-group" style="border-top:1px solid var(--border);padding-top:12px;margin-top:14px;">
      <div style="font-size:14px;font-weight:500;color:var(--text);margin-bottom:8px;">顶部背景渐隐</div>
      <p style="font-size:12px;color:var(--text-muted);line-height:1.6;margin:-4px 0 10px;">顶部栏那一截会盖一层主题色，让菜单文字更清楚。调低则背景图在顶部露出来更多，调高则盖得更实。</p>
      <div class="field"><label>顶部渐隐范围（${data.settings.topFadeH != null ? data.settings.topFadeH : 20}%，越大盖住越高）</label>
        <div class="range-row"><input type="range" min="0" max="40" id="st-topfade-h" value="${data.settings.topFadeH != null ? data.settings.topFadeH : 20}"/><span id="st-topfade-h-v">${data.settings.topFadeH != null ? data.settings.topFadeH : 20}%</span></div></div>
      <div class="field"><label>顶部渐隐透明度（${data.settings.topFadeA != null ? data.settings.topFadeA : 100}%，0 = 完全透明露出背景）</label>
        <div class="range-row"><input type="range" min="0" max="100" id="st-topfade-a" value="${data.settings.topFadeA != null ? data.settings.topFadeA : 100}"/><span id="st-topfade-a-v">${data.settings.topFadeA != null ? data.settings.topFadeA : 100}%</span></div></div>
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
    <div class="style-group" style="border-top:1px solid var(--border);padding-top:12px;margin-top:14px;">
      <div style="font-size:14px;font-weight:500;color:var(--text);margin-bottom:8px;">主页顶部按钮颜色</div>
      <div class="field"><label>按钮颜色（留空则跟随主题文字色）</label>
        <input type="color" id="st-topbtn" value="${data.settings.topBtnColor || '#2b2230'}" style="width:100%;height:38px;border:1px solid var(--border);border-radius:10px;background:var(--cardbg);padding:2px;" /></div>
    </div>
    <div class="style-group" style="border-top:1px solid var(--border);padding-top:12px;margin-top:14px;">
      <div style="font-size:14px;font-weight:500;color:var(--text);margin-bottom:8px;">聊天菜单面板（磨砂玻璃）</div>
      <div class="field"><label>面板底色</label>
        <input type="color" id="st-chatbg" value="${data.settings.chatPanelBg || '#ffffff'}" style="width:100%;height:38px;border:1px solid var(--border);border-radius:10px;background:var(--cardbg);padding:2px;" /></div>
      <div class="field"><label>面板透明度（${data.settings.chatPanelAlpha != null ? data.settings.chatPanelAlpha : 90}%，越低越透）</label>
        <div class="range-row"><input type="range" min="0" max="100" id="st-chatalpha" value="${data.settings.chatPanelAlpha != null ? data.settings.chatPanelAlpha : 90}"/><span id="st-chatalphav">${data.settings.chatPanelAlpha != null ? data.settings.chatPanelAlpha : 90}%</span></div></div>
    </div>
    <div class="style-group" style="border-top:1px solid var(--border);padding-top:12px;margin-top:14px;">
      <div style="font-size:14px;font-weight:500;color:var(--text);margin-bottom:8px;">思考过程（聊天 AI 思考块）</div>
      <div class="switch-row" style="margin-bottom:8px;">
        <label style="font-size:13px;color:var(--text-muted);">跟随主题外观</label>
        <div class="switch ${tFollow ? 'on' : ''}" id="st-think-follow" role="switch" aria-checked="${tFollow}"><span></span></div>
      </div>
      <div id="think-custom" style="${tFollow ? 'opacity:.45;' : ''}">
        <div class="field"><label>思考框背景色</label><input type="color" id="st-think-bg" value="${t.bgColor || '#FCE4EC'}" ${tFollow ? 'disabled' : ''} style="width:100%;height:38px;border:1px solid var(--border);border-radius:10px;background:var(--cardbg);padding:2px;" /></div>
        <div class="field"><label>思考框透明度（${thinkOp}%，0 = 完全透明）</label>
          <div class="range-row"><input type="range" min="0" max="100" id="st-think-op" value="${thinkOp}" ${tFollow ? 'disabled' : ''}/><span id="st-think-opv">${thinkOp}%</span></div></div>
        <div class="field"><label>思考文字颜色</label><input type="color" id="st-think-text" value="${t.textColor || '#9b8e88'}" ${tFollow ? 'disabled' : ''} style="width:100%;height:38px;border:1px solid var(--border);border-radius:10px;background:var(--cardbg);padding:2px;" /></div>
        <div class="field"><label>竖线颜色</label><input type="color" id="st-think-line" value="${t.lineColor || '#F48FB1'}" ${tFollow ? 'disabled' : ''} style="width:100%;height:38px;border:1px solid var(--border);border-radius:10px;background:var(--cardbg);padding:2px;" /></div>
      </div>
    </div>
    <div class="style-group" style="border-top:1px solid var(--border);padding-top:12px;margin-top:14px;">
      <div style="font-size:14px;font-weight:500;color:var(--text);margin-bottom:8px;">AI 回复气泡</div>
      <div class="switch-row" style="margin-bottom:8px;">
        <label style="font-size:13px;color:var(--text-muted);">跟随主题外观</label>
        <div class="switch ${aFollow ? 'on' : ''}" id="st-aib-follow" role="switch" aria-checked="${aFollow}"><span></span></div>
      </div>
      <div id="aib-custom" style="${aFollow ? 'opacity:.45;' : ''}">
        <div class="field"><label>气泡背景色</label><input type="color" id="st-aib-bg" value="${a.bgColor || '#FCE4EC'}" ${aFollow ? 'disabled' : ''} style="width:100%;height:38px;border:1px solid var(--border);border-radius:10px;background:var(--cardbg);padding:2px;" /></div>
        <div class="field"><label>气泡透明度（${aibOp}%，0 = 完全透明）</label>
          <div class="range-row"><input type="range" min="0" max="100" id="st-aib-op" value="${aibOp}" ${aFollow ? 'disabled' : ''}/><span id="st-aib-opv">${aibOp}%</span></div></div>
        <div class="field"><label>气泡文字颜色</label><input type="color" id="st-aib-text" value="${a.textColor || '#333333'}" ${aFollow ? 'disabled' : ''} style="width:100%;height:38px;border:1px solid var(--border);border-radius:10px;background:var(--cardbg);padding:2px;" /></div>
      </div>
    </div>
    <div class="style-group" style="border-top:1px solid var(--border);padding-top:12px;margin-top:14px;">
      <div style="font-size:14px;font-weight:500;color:var(--text);margin-bottom:4px;">AI 思考卡磨砂 / 玻璃（独立）</div>
      <p style="font-size:12px;color:var(--text-muted);line-height:1.6;margin:0 0 10px;">只控制「AI 思考卡」（思考区 + 回复连着的整张卡），跟上面的全局磨砂/玻璃互不影响，可单独开启。</p>
      <div class="field switch-row"><span>开启磨砂（AI 卡半透明磨砂）</span><div class="switch ${data.settings.aiFrost ? 'on' : ''}" id="st-aifrost-on"></div></div>
      <div class="field switch-row"><span>开启玻璃拟态（AI 卡透明 + 玻璃高光）</span><div class="switch ${data.settings.aiGlass ? 'on' : ''}" id="st-aiglass-on"></div></div>
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
  if (go) go.addEventListener('click', () => { data.settings.glass.on = go.classList.toggle('on'); applyStyle(); });
  const gb = $('#st-glass-blur');
  if (gb) gb.addEventListener('input', () => { const v = $('#st-glass-blurv'); if (v) v.textContent = gb.value + 'px'; data.settings.glass.blur = Number(gb.value); applyStyle(); });
  const gop = $('#st-glass-opacity');
  if (gop) gop.addEventListener('input', () => { const v = $('#st-glass-opacityv'); if (v) v.textContent = gop.value + '%'; data.settings.glass.opacity = Number(gop.value); applyStyle(); });
  const gmo = $('#st-gm-on');
  if (gmo) gmo.addEventListener('click', () => { data.settings.glassmorphism.on = gmo.classList.toggle('on'); applyStyle(); });
  const gmh = $('#st-gm-highlight');
  if (gmh) gmh.addEventListener('input', () => { const v = $('#st-gm-highlightv'); if (v) v.textContent = gmh.value + '%'; data.settings.glassmorphism.highlight = Number(gmh.value); applyStyle(); });
  const gms = $('#st-gm-shadow');
  if (gms) gms.addEventListener('click', () => { data.settings.gmShadow = gms.classList.toggle('on'); applyStyle(); });
  const aifo = $('#st-aifrost-on');
  if (aifo) aifo.addEventListener('click', () => { data.settings.aiFrost = aifo.classList.toggle('on'); applyStyle(); });
  const aigo = $('#st-aiglass-on');
  if (aigo) aigo.addEventListener('click', () => { data.settings.aiGlass = aigo.classList.toggle('on'); applyStyle(); });
  // 主题同款气泡：开=隐藏自定义选项；关=显示
  const bth = $('#st-bubble-theme');
  if (bth) bth.addEventListener('click', () => {
    const on = bth.classList.toggle('on');
    data.settings.bubbleSameAsTheme = on;
    const show = !on;
    const bc = $('#bubble-custom'); if (bc) bc.style.display = show ? '' : 'none';
    const bcg = $('#bubble-custom-gm'); if (bcg) bcg.style.display = show ? '' : 'none';
    if (on) { data.settings.glass.on = false; data.settings.glassmorphism.on = false; data.settings.aiFrost = false; data.settings.aiGlass = false; }
    applyStyle();
  });
  const tfh = $('#st-topfade-h');
  if (tfh) tfh.addEventListener('input', () => { const v = $('#st-topfade-h-v'); if (v) v.textContent = tfh.value + '%'; data.settings.topFadeH = Number(tfh.value); applyTheme(); });
  const tfa = $('#st-topfade-a');
  if (tfa) tfa.addEventListener('input', () => { const v = $('#st-topfade-a-v'); if (v) v.textContent = tfa.value + '%'; data.settings.topFadeA = Number(tfa.value); applyTheme(); });
  const stb = $('#st-topbtn'); if (stb) stb.addEventListener('input', () => document.documentElement.style.setProperty('--top-btn-color', stb.value));
  const scb = $('#st-chatbg'); const sca = $('#st-chatalpha');
  if (scb) scb.addEventListener('input', () => document.documentElement.style.setProperty('--chat-panel-bg', scb.value));
  if (sca) sca.addEventListener('input', () => { const v = $('#st-chatalphav'); if (v) v.textContent = sca.value + '%'; document.documentElement.style.setProperty('--chat-panel-alpha', sca.value); });
  const tbg = $('#st-think-bg'), top = $('#st-think-op'), ttxt = $('#st-think-text'), tln = $('#st-think-line');
  const applyThinkPreview = () => { if (!tbg) return; const f = $('#st-think-follow'); applyThinkVars({ follow: f ? f.classList.contains('on') : true, bgColor: tbg.value, bgOpacity: Number(top.value) / 100, textColor: ttxt.value, lineColor: tln.value }); };
  if (tbg) tbg.addEventListener('input', applyThinkPreview);
  if (top) top.addEventListener('input', () => { const v = $('#st-think-opv'); if (v) v.textContent = top.value + '%'; applyThinkPreview(); });
  if (ttxt) ttxt.addEventListener('input', applyThinkPreview);
  if (tln) tln.addEventListener('input', applyThinkPreview);
  const aib = $('#st-aib-bg'), aop = $('#st-aib-op'), ait = $('#st-aib-text');
  const applyAiPreview = () => { if (!aib) return; const f = $('#st-aib-follow'); applyAiBubble({ follow: f ? f.classList.contains('on') : true, bgColor: aib.value, bgOpacity: Number(aop.value) / 100, textColor: ait.value }); };
  if (aib) aib.addEventListener('input', applyAiPreview);
  if (aop) aop.addEventListener('input', () => { const v = $('#st-aib-opv'); if (v) v.textContent = aop.value + '%'; applyAiPreview(); });
  if (ait) ait.addEventListener('input', applyAiPreview);
  const bindFollow = (swId, opId, opvId, ids) => {
    const sw = $('#' + swId); if (!sw) return;
    sw.addEventListener('click', () => {
      const on = sw.classList.toggle('on');
      sw.setAttribute('aria-checked', on ? 'true' : 'false');
      ids.forEach(id => { const el = $('#' + id); if (el) el.disabled = on; });
      const custom = $('#' + (swId === 'st-think-follow' ? 'think-custom' : 'aib-custom'));
      if (custom) { custom.style.opacity = on ? '.45' : '1'; }
      if (!on) { const opEl = $('#' + opId), opv = $('#' + opvId); if (opEl && Number(opEl.value) === 0) { opEl.value = 60; if (opv) opv.textContent = '60%'; } }
      if (swId === 'st-think-follow') applyThinkPreview(); else applyAiPreview();
    });
  };
  bindFollow('st-think-follow', 'st-think-op', 'st-think-opv', ['st-think-bg', 'st-think-op', 'st-think-text', 'st-think-line']);
  bindFollow('st-aib-follow', 'st-aib-op', 'st-aib-opv', ['st-aib-bg', 'st-aib-op', 'st-aib-text']);
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
    data.settings.gmShadow = false;
    data.settings.bubbleSameAsTheme = true;
    data.settings.bgFrost = false;
    data.settings.bgFrostBlur = 18;
    data.settings.topFadeA = 0; data.settings.topFadeH = 20;
    data.settings.topBtnColor = ''; data.settings.chatPanelBg = '#ffffff'; data.settings.chatPanelAlpha = 90;
    data.settings.think = { follow: true, bgColor: '#FCE4EC', bgOpacity: 0.5, textColor: '#9b8e88', lineColor: '#F48FB1' };
    data.settings.aiBubble = { follow: true, bgColor: '#FCE4EC', bgOpacity: 0.6, textColor: '' };
    save(); applyTheme(); closeModal(); toast('已恢复主题');
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
    data.settings.gmShadow = $('#st-gm-shadow').classList.contains('on');
    data.settings.aiFrost = $('#st-aifrost-on').classList.contains('on');
    data.settings.aiGlass = $('#st-aiglass-on').classList.contains('on');
    data.settings.bubbleSameAsTheme = $('#st-bubble-theme').classList.contains('on');
    if (data.settings.bubbleSameAsTheme) { data.settings.glass.on = false; data.settings.glassmorphism.on = false; data.settings.aiFrost = false; data.settings.aiGlass = false; }
    data.settings.topFadeH = Number($('#st-topfade-h').value);
    data.settings.topFadeA = Number($('#st-topfade-a').value);
    data.settings.topBtnColor = $('#st-topbtn').value;
    data.settings.chatPanelBg = $('#st-chatbg').value;
    data.settings.chatPanelAlpha = Number($('#st-chatalpha').value);
    data.settings.think = {
      follow: $('#st-think-follow').classList.contains('on'),
      bgColor: $('#st-think-bg').value,
      bgOpacity: Number($('#st-think-op').value) / 100,
      textColor: $('#st-think-text').value,
      lineColor: $('#st-think-line').value
    };
    data.settings.aiBubble = {
      follow: $('#st-aib-follow').classList.contains('on'),
      bgColor: $('#st-aib-bg').value,
      bgOpacity: Number($('#st-aib-op').value) / 100,
      textColor: $('#st-aib-text').value
    };
    const langEl = $('#st-lang'); if (langEl) data.settings.lang = langEl.value;
    save(); closeModal(); applyTheme(); applyStyle(); applyLang(); toast('已保存');
  });
}
/* ===================== 文案 / 元素样式自定义面板 ===================== */
function fontOptions(selected) {
  const builtins = [
    { value: '', label: '默认' },
    { value: 'var(--font)', label: '系统默认' },
    { value: FONT_MAP.kai, label: '楷体' },
    { value: FONT_MAP.xingkai, label: '华文行楷' },
    { value: FONT_MAP.yuan, label: '圆体' },
    { value: FONT_MAP.dengxian, label: '等线' }
  ];
  const custom = (data.settings.fonts || []).filter(f => f.name).map(f => ({ value: `"${f.name}"`, label: f.name }));
  const all = builtins.concat(custom);
  return all.map(o => `<option value="${esc(o.value)}" ${o.value === selected ? 'selected' : ''}>${esc(o.label)}</option>`).join('');
}
function previewElStyle(key, st) {
  const cfg = EL_CFG[key];
  if (!cfg || !cfg.selector) return;
  $all(cfg.selector).forEach(el => {
    el.style.fontFamily = st.font || '';
    el.style.color = st.color || '';
    el.style.fontSize = (st.size > 0 ? st.size + 'px' : '');
  });
}
function openText() {
  // 草稿：只在「保存」时写回 data，避免误触即时生效
  const draftText = Object.assign({}, data.settings.text || {});
  const draftStyle = JSON.parse(JSON.stringify(data.settings.elStyle || {}));
  pendingTextRevert = () => { applyText(); applyElStyle(); };
  const canText = cfg => cfg.default != null || cfg.dynamic;
  function applyDraftText(key) {
    const cfg = EL_CFG[key]; if (!cfg || !cfg.selector) return;
    const t = draftText[key];
    $all(cfg.selector).forEach(el => {
      if (cfg.prop === 'placeholder') el.placeholder = (t != null && t !== '') ? t : (cfg.default || '');
      else if (t != null && t !== '') el.textContent = t;
      else if (cfg.default != null) el.textContent = cfg.default;
    });
    if ((t == null || t === '') && cfg.dynamic) renderActive();
  }
  function applyDraftStyle(key) {
    const cfg = EL_CFG[key]; if (!cfg || !cfg.selector) return;
    const st = draftStyle[key] || {};
    $all(cfg.selector).forEach(el => {
      el.style.fontFamily = st.font || '';
      el.style.color = st.color || '';
      el.style.fontSize = (st.size > 0 ? st.size + 'px' : '');
    });
  }
  const groups = {};
  Object.keys(EL_CFG).forEach(key => {
    const cfg = EL_CFG[key];
    if (!groups[cfg.group]) groups[cfg.group] = [];
    groups[cfg.group].push({ key, ...cfg });
  });
  const groupOrder = ['纪念日','纪念日类型','日历','聊天','心愿单','朋友圈','设置','底部导航','通用'];
  const sortedGroups = groupOrder.filter(g => groups[g]).map(g => ({ name: g, items: groups[g] }));
  const itemsHtml = sortedGroups.map(g => {
    const hasOv = g.items.some(it => (draftText[it.key] != null && draftText[it.key] !== '') || draftStyle[it.key]);
    const rows = g.items.map(it => {
      const t = draftText[it.key] || '';
      const st = draftStyle[it.key] || {};
      const textInput = canText(it) ? `<input type="text" class="et-text" data-et-key="${it.key}" value="${esc(t)}" placeholder="${esc(it.default || '')}" />` : '';
      return `
        <div class="et-row" data-et-key="${it.key}">
          <div class="et-row-head">
            <div class="et-label">${esc(it.label)}</div>
            <button class="et-reset-row" data-et-key="${it.key}">本行重置</button>
          </div>
          <div class="et-controls">
            ${textInput}
            <select class="et-font" data-et-key="${it.key}">${fontOptions(st.font || '')}</select>
            <span class="et-color-wrap">
              <input type="color" class="et-color" data-et-key="${it.key}" value="${st.color || '#888888'}" />
              <span class="et-mini">颜色</span>
            </span>
            <div class="et-size-wrap">
              <span class="et-mini">字号</span>
              <input type="range" class="et-size" data-et-key="${it.key}" min="0" max="72" value="${st.size || 0}" />
              <span class="et-size-v">${st.size || 0}px</span>
            </div>
          </div>
        </div>`;
    }).join('');
    return `<div class="et-group ${hasOv ? 'open' : ''}">
      <div class="et-group-head"><span>${esc(g.name)}</span><span class="et-chev">▾</span></div>
      <div class="et-group-body">${rows}</div>
    </div>`;
  }).join('');
  openModal(`
    <h3>文案与字体自定义</h3>
    <p style="font-size:12px;color:var(--text-muted);line-height:1.6;margin:-6px 0 12px;">点分组标题可展开/收起。每行可单独改文案、字体、颜色、字号；字号 0 = 默认。改完点「保存」才生效，误触不会即时保存。</p>
    <div class="modal-actions" style="margin-bottom:12px;">
      <button class="btn btn-ghost" id="tx-fonts">字体管理</button>
      <button class="btn btn-danger" id="tx-reset">全部恢复</button>
    </div>
    <div class="et-list">${itemsHtml}</div>
    <div class="modal-actions">
      <button class="btn btn-ghost" id="tx-cancel">取消</button>
      <button class="btn btn-primary" id="tx-save">保存</button>
    </div>
  `);
  // 分组折叠
  $all('.et-group-head').forEach(h => h.addEventListener('click', () => h.parentElement.classList.toggle('open')));
  // 单行重置
  $all('.et-reset-row').forEach(btn => btn.addEventListener('click', e => {
    e.stopPropagation();
    const key = btn.dataset.etKey;
    delete draftText[key]; delete draftStyle[key];
    const row = btn.closest('.et-row');
    const inpText = row.querySelector('.et-text');
    const selFont = row.querySelector('.et-font');
    const inpColor = row.querySelector('.et-color');
    const inpSize = row.querySelector('.et-size');
    const spSize = row.querySelector('.et-size-v');
    if (inpText) inpText.value = '';
    if (selFont) selFont.value = '';
    if (inpColor) inpColor.value = '#888888';
    if (inpSize) { inpSize.value = 0; if (spSize) spSize.textContent = '0px'; }
    applyDraftText(key); applyDraftStyle(key);
  }));
  // 实时预览（仅预览，不写 data）
  $all('.et-row').forEach(row => {
    const key = row.dataset.etKey;
    const inpText = row.querySelector('.et-text');
    const selFont = row.querySelector('.et-font');
    const inpColor = row.querySelector('.et-color');
    const inpSize = row.querySelector('.et-size');
    const spSize = row.querySelector('.et-size-v');
    if (inpText) inpText.addEventListener('input', () => { draftText[key] = inpText.value; applyDraftText(key); });
    if (selFont) selFont.addEventListener('change', () => { draftStyle[key] = draftStyle[key] || {}; draftStyle[key].font = selFont.value; applyDraftStyle(key); });
    if (inpColor) inpColor.addEventListener('input', () => { draftStyle[key] = draftStyle[key] || {}; draftStyle[key].color = inpColor.value; applyDraftStyle(key); });
    if (inpSize) inpSize.addEventListener('input', () => { if (spSize) spSize.textContent = inpSize.value + 'px'; draftStyle[key] = draftStyle[key] || {}; draftStyle[key].size = Number(inpSize.value); applyDraftStyle(key); });
  });
  $('#tx-fonts').addEventListener('click', () => { closeModal(); setTimeout(openFonts, 220); });
  $('#tx-cancel').addEventListener('click', () => { renderActive(); closeModal(); });
  $('#tx-reset').addEventListener('click', () => {
    data.settings.text = {}; data.settings.elStyle = {};
    save(); closeModal(); applyText(); applyElStyle(); renderActive(); toast('已恢复默认');
  });
  $('#tx-save').addEventListener('click', () => {
    const newText = {}; const newStyle = {};
    Object.keys(EL_CFG).forEach(key => {
      const t = draftText[key];
      if (t != null && t.trim() !== '') newText[key] = t.trim();
      const st = draftStyle[key];
      if (st) {
        const font = st.font || '';
        const color = st.color || '';
        const size = st.size > 0 ? st.size : 0;
        if (font || color || size > 0) newStyle[key] = { font, color, size };
      }
    });
    data.settings.text = newText; data.settings.elStyle = newStyle;
    save(); closeModal(); applyText(); applyElStyle(); renderActive(); toast('已保存');
  });
}
function openFonts() {
  const fonts = data.settings.fonts || [];
  const rows = fonts.map((f, i) => `
    <div class="font-row" data-fi="${i}">
      <div class="font-name">${esc(f.name)}</div>
      <div class="font-actions">
        <button class="btn btn-ghost font-preview" data-fi="${i}">预览</button>
        <button class="btn btn-danger font-del" data-fi="${i}">删除</button>
      </div>
    </div>`).join('') || '<p style="color:var(--text-muted);font-size:13px;text-align:center;padding:10px 0;">还没有导入字体</p>';
  openModal(`
    <h3>字体管理</h3>
    <p style="font-size:12px;color:var(--text-muted);line-height:1.6;margin:-6px 0 12px;">支持两种方式导入字体：① 粘贴网络字体 CSS 链接（如 Google Fonts）；② 上传本地字体文件（TTF/OTF/WOFF/WOFF2）。</p>
    <div class="field"><label>网络字体 CSS 链接</label><input type="text" id="font-url" placeholder="https://fonts.googleapis.com/css2?family=..." /></div>
    <div class="field"><label>或上传本地字体</label><input type="file" id="font-file" accept=".ttf,.otf,.woff,.woff2" /></div>
    <div class="field"><label>字体名称（用于选择）</label><input type="text" id="font-name" placeholder="例如：MyFont" /></div>
    <div class="modal-actions" style="margin-bottom:12px;">
      <button class="btn btn-primary" id="font-add">导入字体</button>
    </div>
    <div class="font-list">${rows}</div>
    <div class="field"><label>全局字体</label><select id="global-font">${fontOptions(data.settings.globalFont || '')}</select></div>
    <p style="font-size:11px;color:var(--text-muted);line-height:1.5;margin:4px 0 0;">全局字体会影响整个 App 的默认字体；单独元素的字体可在「文案与字体自定义」里覆盖。</p>
    <div class="modal-actions">
      <button class="btn btn-ghost" id="font-close">关闭</button>
      <button class="btn btn-primary" id="font-save">保存</button>
    </div>
  `);
  const fileInput = $('#font-file');
  fileInput && fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file && !$('#font-name').value.trim()) {
      $('#font-name').value = file.name.replace(/\.[^.]+$/, '');
    }
  });
  $('#font-add').addEventListener('click', () => {
    const name = $('#font-name').value.trim();
    if (!name) { toast('请输入字体名称'); return; }
    const url = $('#font-url').value.trim();
    const file = fileInput.files[0];
    if (url) {
      // 外部 CSS：通过 link 加载，不存 base64，但把 CSS URL 记下来，注入时 fetch 不一定跨域可用；这里只支持直接字体文件 URL
      toast('请粘贴字体文件直链，或上传本地字体');
      return;
    }
    if (!file) { toast('请选择字体文件或粘贴直链'); return; }
    const reader = new FileReader();
    reader.onload = e => {
      data.settings.fonts.push({ name, url: e.target.result });
      save(); injectFonts(); openFonts(); toast('字体导入成功');
    };
    reader.readAsDataURL(file);
  });
  $all('.font-del').forEach(btn => btn.addEventListener('click', () => {
    const i = Number(btn.dataset.fi);
    data.settings.fonts.splice(i, 1);
    save(); injectFonts(); openFonts();
  }));
  $all('.font-preview').forEach(btn => btn.addEventListener('click', () => {
    const i = Number(btn.dataset.fi);
    const f = data.settings.fonts[i];
    if (!f) return;
    toast(`字体「${f.name}」已试用`);
    document.body.style.fontFamily = `"${f.name}"`;
  }));
  $('#font-close').addEventListener('click', closeModal);
  $('#font-save').addEventListener('click', () => {
    data.settings.globalFont = $('#global-font').value;
    save(); closeModal(); applyFonts(); toast('已保存');
  });
}


const CHAT_MODELS = [
  { id: 'deepseek-v4-flash', name: 'Flash' },
  { id: 'deepseek-v4-pro', name: 'PRO' }
];
function closeChatMenu() { const p = $('#chatMorePanel'); if (p) p.classList.remove('show'); }
function openChatMenu() {
  const panel = $('#chatMorePanel');
  if (panel.classList.contains('show')) { closeChatMenu(); return; }
  const cur = data.settings.chatModel || 'deepseek-v4-flash';
  const modelRows = CHAT_MODELS.map(m => `
    <div class="cmp-row ${m.id === cur ? 'sel' : ''}" data-action="mm-model" data-model="${m.id}">
      <div class="cm-info"><div class="cm-name">${m.name}</div></div>
      ${m.id === cur ? '<div class="cm-check">✓</div>' : ''}
    </div>`).join('');
  const convs = data.conversations || [];
  const histRows = convs.length
    ? convs.map(c => `<div class="cmp-row" data-action="mm-load" data-cid="${c.id}"><div class="cm-info"><div class="cm-name">${esc(c.title || '对话')}</div><div class="cm-desc">${c.messages.length} 条消息</div></div></div>`).join('')
    : '<div class="cmp-empty">还没有历史对话</div>';
  panel.innerHTML = `
    <div class="cmp-section"><div class="cmp-model-head" data-action="mm-model-toggle">DeepSeek <span class="chev">▾</span></div>
      <div class="cmp-model-list" id="cmpModelList" style="display:none">${modelRows}</div></div>
    <div class="cmp-section"><div class="cmp-title">对话</div>
      <div class="cmp-row" data-action="mm-newchat"><div class="cm-info"><div class="cm-name">＋ 新建对话</div></div></div>
      <div class="cmp-row" data-action="mm-history"><div class="cm-info"><div class="cm-name">历史对话（${convs.length}）</div></div></div>
      <div class="cmp-hist" id="cmpHist" style="display:none">${histRows}</div>
    </div>`;
  panel.classList.add('show');
}
function newChat() {
  if ((data.chat || []).length) {
    (data.conversations = data.conversations || []).push({ id: uid(), title: (data.chat[0].text || '新对话').slice(0, 12), messages: data.chat.slice() });
  }
  data.chat = []; save(); closeChatMenu(); renderChat(); toast('已新建对话');
}
function loadConversation(cid) {
  const c = (data.conversations || []).find(x => x.id === cid); if (!c) return;
  data.chat = c.messages.slice(); save(); closeChatMenu(); renderChat(); toast('已打开历史对话');
}

function renderChat() {
  const s = data.settings;
  $('#chat-user-name').textContent = s.aiName;
  const ci = $('#chat-input'); if (ci) ci.placeholder = TT('chat.placeholder');
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
    let thinkHead = '';
    let mergedCard = '';
    if (!mine && m.reasoning) {
      thinkHead = `<div class="think-head">
        <button class="think-toggle" type="button" onclick="toggleThink(this)" aria-label="展开/收起思考过程"><svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg><span class="think-label">thinking</span></button>
      </div>`;
      mergedCard = `<div class="ai-msg-card">
        <div class="think-content"><div class="think-text">${esc(m.reasoning)}</div></div>
        <div class="bubble">${esc(m.text)}</div>
      </div>`;
    }
    html += `<div class="bubble-row ${mine ? 'me' : 'ai'}">
      <div class="bubble-wrap">
        ${thinkHead}
        ${mergedCard || `<div class="bubble">${esc(m.text)}</div>`}
      </div>
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
function toggleThink(btn) {
  const wrap = btn.closest('.bubble-wrap');
  if (wrap) wrap.classList.toggle('think-collapsed');
}
async function sendChat() {
  const input = $('#chat-input');
  const text = input.value.trim(); if (!text) return;
  input.value = '';
  data.chat.push({ role: 'user', text, time: Date.now() });
  save(); chatThinking = true; renderChat();

  const s = data.settings;
  const body = $('#chat-body');
  // 用真实 AI 行替换“正在输入”占位行，便于流式写入思考与回答
  const dotsRow = body.querySelector('.chat-thinking-row');
  const aiRow = document.createElement('div');
  aiRow.className = 'bubble-row ai';
  aiRow.innerHTML = `<div class="bubble-wrap">
    <div class="think-head">
      <button class="think-toggle" type="button" onclick="toggleThink(this)" aria-label="展开/收起思考过程"><svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg><span class="think-label">thinking</span></button>
    </div>
    <div class="ai-msg-card">
      <div class="think-content" id="streamThink"><div class="think-text" id="thinkText"></div></div>
      <div class="bubble" id="aiBubble"></div>
    </div>
  </div>`;
  if (dotsRow) dotsRow.replaceWith(aiRow);
  const thinkBlock = aiRow.querySelector('#streamThink');
  const thinkEl = aiRow.querySelector('#thinkText');
  const bubbleEl = aiRow.querySelector('#aiBubble');

  const messages = data.chat.map(m => ({ role: (m.role === 'ai' || m.role === 'assistant') ? 'assistant' : (m.role === 'me' || m.role === 'user' ? 'user' : m.role), content: m.text }));

  let reasoning = '', reply = '', hasReasoning = false;
  // rAF 批量刷新：避免每片都重写整段文本 + 强制滚动导致卡顿
  let bufR = '', bufC = '', raf = null, scrollPending = false;
  const flush = () => {
    raf = null;
    if (bufR) { thinkEl.appendChild(document.createTextNode(bufR)); bufR = ''; }
    if (bufC) { bubbleEl.appendChild(document.createTextNode(bufC)); bufC = ''; }
    if (scrollPending) { body.scrollTop = body.scrollHeight; scrollPending = false; }
  };
  const schedule = () => { scrollPending = true; if (raf == null) raf = requestAnimationFrame(flush); };
  const onReasoning = t => { hasReasoning = true; reasoning += t; bufR += t; schedule(); };
  const onContent = t => { reply += t; bufC += t; schedule(); };
  try {
    await streamChat(s, messages, { onReasoning, onContent });
  } catch (e) {
    if (!reply) { reply = '（连接失败，请检查设置）'; bubbleEl.textContent = reply; }
  }
  if (raf != null) { cancelAnimationFrame(raf); flush(); }
  if (!hasReasoning) { thinkBlock.style.display = 'none'; const th = aiRow.querySelector('.think-head'); if (th) th.style.display = 'none'; }
  chatThinking = false;
  data.chat.push({ role: 'ai', text: reply, reasoning: reasoning || '', time: Date.now() });
  save();
}

// 流式读取 SSE：逐行把 reasoning_content 与 content 增量回调出去
async function streamChat(s, messages, cb) {
  const mkBody = m => JSON.stringify({ model: s.chatModel || 'deepseek-v4-flash', messages: m, stream: true, temperature: 0.8, max_tokens: 1024 });
  let resp;
  if (s.apiMode === 'backend' && s.backendUrl) {
    const base = (s.backendUrl || '').replace(/\/+$/, '');
    const url = base.endsWith('/chat') ? base : base + '/chat';
    resp = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: mkBody(messages) });
  } else if (s.apiMode === 'direct' && s.deepseekKey) {
    resp = await fetch('https://api.deepseek.com/v1/chat/completions', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + s.deepseekKey }, body: mkBody(messages) });
  } else {
    const demo = '（演示模式）这是一条示例回复。在“设置 → API 连接”里配置后端或 Key 后，我就能真的和你对话啦。';
    for (const ch of demo) { cb.onContent(ch); await new Promise(r => setTimeout(r, 18)); }
    return;
  }
  if (!resp.ok) {
    let msg = 'HTTP ' + resp.status;
    try { const j = await resp.json(); if (j && j.error) msg = j.error; } catch (e) {}
    throw new Error(msg);
  }
  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buf = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let nl;
    while ((nl = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, nl).trim();
      buf = buf.slice(nl + 1);
      if (!line.startsWith('data:')) continue;
      const data = line.slice(5).trim();
      if (data === '[DONE]') return;
      try {
        const j = JSON.parse(data);
        const d = j.choices && j.choices[0] && j.choices[0].delta;
        if (!d) continue;
        const rc = d.reasoning_content || d.reasoning;
        if (rc) cb.onReasoning(rc);
        if (d.content) cb.onContent(d.content);
      } catch (e) {}
    }
  }
}

/* ===================== AI 主页 / 朋友圈入口 ===================== */
function closeChatUserMenu() { const p = $('#chatUserMenu'); if (p) p.classList.remove('show'); }
function openChatUserMenu() {
  const panel = $('#chatUserMenu');
  if (panel.classList.contains('show')) { closeChatUserMenu(); return; }
  closeChatMenu();
  panel.innerHTML = `
    <div class="cu-row" data-action="goto-aiprofile"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg><span>主页</span></div>
    <div class="cu-row" data-action="goto-aimoments"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg><span>朋友圈</span></div>`;
  panel.classList.add('show');
}
function openAiProfilePage() {
  closeModal();
  $('#tabbar').style.display = 'none';
  $all('.screen').forEach(s => s.classList.toggle('active', s.id === 'screen-aiprofile'));
  renderAiProfile();
}
function backAiProfile() {
  $('#tabbar').style.display = '';
  $all('.screen').forEach(s => s.classList.toggle('active', s.id === 'screen-chat'));
  renderChat();
}
function renderAiProfile() {
  const s = data.settings;
  const tn = $('#aiprofile-top-name'); if (tn) tn.textContent = s.aiName;
  $('#aiprofile-name').textContent = s.aiName;
  $('#aiprofile-bio').textContent = s.aiSign || '这里可以写一段简介。去「设置 → 个人资料」里修改吧。';
  const ava = $('#aiprofile-avatar');
  const ha = s.aiHomeAvatar || s.aiAvatar;
  if (ha) { ava.style.backgroundImage = 'url(' + ha + ')'; ava.style.backgroundColor = ''; }
  else { ava.style.backgroundImage = ''; ava.style.backgroundColor = 'var(--cardbg)'; }
  // 标签
  const tags = (s.aiTags && s.aiTags.length) ? s.aiTags : ['BG', 'AI', '陪伴'];
  $('#aiprofile-tags').innerHTML = tags.map(t => `<span class="aiprofile-tag">${esc(t)}</span>`).join('');
  // 网格：作品（抖音风）
  const all = data.works.map((w, i) => ({ w, i }));
  let items = all;
  if (aiprofileTab === 'likes') items = all.filter(o => o.w.aiLiked);
  else if (aiprofileTab === 'favs') items = all.filter(o => o.w.aiFaved);
  const grid = $('#aiprofile-grid');
  if (items.length) {
    grid.innerHTML = items.map(o => {
      const play = o.w.type === 'video' ? '<span class="play-badge">▶</span>' : '';
      return `<div class="aiprofile-grid-item" data-action="work-grid-item" data-i="${o.i}" style="background-image:url(${esc(o.w.cover || o.w.src)})">${play}</div>`;
    }).join('');
  } else {
    const emptyText = aiprofileTab === 'likes' ? '他还没有点赞的作品' : aiprofileTab === 'favs' ? '他还没有收藏的作品' : '还没有作品，点右上角 + 发布第一个吧';
    grid.innerHTML = `<div class="aiprofile-grid-item placeholder" style="grid-column:1/4;aspect-ratio:auto;height:80px;">${emptyText}</div>`;
  }
}
let aiprofileTab = 'grid';
function switchAiProfileTab(tab) {
  aiprofileTab = tab;
  $all('.aiprofile-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  renderAiProfile();
}

/* ===================== 作品（抖音风）feed / 评论 / 发帖 ===================== */
let workFeedIndex = 0, workPicks = [], workCover = '', _workFileBound = false;
function openWorkFeed(i) {
  const feed = $('#workFeed'), items = $('#workFeedItems');
  const aiName = data.settings.aiName || 'TA';
  items.innerHTML = data.works.map((w, idx) => {
    const media = w.type === 'video'
      ? `<video src="${esc(w.src)}" poster="${esc(w.cover || w.poster || w.src)}" controls></video>`
      : `<img src="${esc(w.cover || w.src)}" alt="">`;
    const cmtN = (w.comments || []).reduce((n, c) => n + 1 + (c.replies ? c.replies.length : 0), 0);
    return `
      <div class="wf-item" data-idx="${idx}">
        ${media}
        <div class="wf-side">
          <div class="act ${w.liked ? 'liked' : ''}" data-action="work-like" data-i="${idx}">
            <svg viewBox="0 0 24 24" fill="${w.liked ? '#fe2c55' : 'none'}" stroke="${w.liked ? '#fe2c55' : '#fff'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
            <span>${w.likes}</span>
          </div>
          <div class="act" data-action="work-comment-open" data-i="${idx}">
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.5 8.6 8.6 0 0 1-3.8-.9L3 21l1.9-5.7A8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5z"/></svg>
            <span>${cmtN}</span>
          </div>
          <div class="act ${w.faved ? 'faved' : ''}" data-action="work-fav" data-i="${idx}">
            <svg viewBox="0 0 24 24" fill="${w.faved ? '#F7C948' : 'none'}" stroke="${w.faved ? '#F7C948' : '#fff'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
          </div>
        </div>
        <div class="wf-bottom">
          <div class="wf-name"><b>${esc(aiName)}</b></div>
          <div class="wf-caption">${esc(w.caption || '')}</div>
        </div>
      </div>`;
  }).join('');
  feed.classList.add('show');
  items.scrollTop = 0;
  workFeedIndex = i || 0;
  if (items.children[workFeedIndex]) items.children[workFeedIndex].scrollIntoView();
}
function closeWorkFeed() {
  $('#workFeed').classList.remove('show');
  closeWorkComment();
  document.querySelectorAll('#workFeed video').forEach(v => { try { v.pause(); v.currentTime = 0; } catch (e) {} });
}
function spawnWorkBurst(act, ch, color) {
  for (let i = 0; i < 6; i++) {
    const s = document.createElement('span');
    s.className = (ch === '★') ? 'burst-star' : 'burst-heart';
    s.textContent = ch; s.style.color = color;
    const ang = Math.PI * (0.18 + i * 0.13);
    const bx = Math.cos(ang) * 30 * (i % 2 ? 1 : -1);
    s.style.setProperty('--bx', bx + 'px');
    s.style.top = '2px';
    s.style.animationDelay = (i * 0.03) + 's';
    act.appendChild(s);
    setTimeout(() => s.remove(), 760);
  }
}
function workLike(i, a) {
  const w = data.works[i]; if (!w) return;
  if (!w.liked) { w.liked = true; w.likes++; } else { w.liked = false; w.likes--; }
  const svg = a.querySelector('svg');
  svg.setAttribute('fill', w.liked ? '#fe2c55' : 'none');
  svg.style.stroke = w.liked ? '#fe2c55' : '#fff';
  a.classList.toggle('liked', w.liked);
  a.querySelector('span').textContent = w.likes;
  if (w.liked) spawnWorkBurst(a, '♥', '#fe2c55');
  save();
}
function workFav(i, a) {
  const w = data.works[i]; if (!w) return;
  w.faved = !w.faved;
  const svg = a.querySelector('svg');
  svg.setAttribute('fill', w.faved ? '#F7C948' : 'none');
  svg.style.stroke = w.faved ? '#F7C948' : '#fff';
  a.classList.toggle('faved', w.faved);
  save();
}
function openWorkComment(i) { workFeedIndex = i; renderWorkComments(); $('#workComment').classList.add('show'); }
function closeWorkComment() { $('#workComment').classList.remove('show'); }
/* 评论点赞爱心：与朋友圈/作品一致——未点空心、已点实心红 */
function clikeHeart(on) {
  return `<svg class="clike-h" viewBox="0 0 24 24" fill="${on ? '#fe2c55' : 'none'}" stroke="${on ? '#fe2c55' : 'currentColor'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>`;
}
function renderWorkComments() {
  const w = data.works[workFeedIndex]; if (!w) return;
  const cs = w.comments || [];
  $('#workCmtCount').textContent = cs.reduce((n, c) => n + 1 + (c.replies ? c.replies.length : 0), 0);
  $('#workCmtList').innerHTML = cs.map((c, ci) => `
    <div class="cmt" onclick="workCmtClick(${ci},event)">
      <div class="cava"></div>
      <div class="cbody">
        <div class="cname">${esc(c.name)}</div>
        <div class="ctext">${esc(c.text)}</div>
        <div class="cmeta"><span>刚刚</span>
          <span class="clike ${c.liked ? 'clike-on' : ''}" onclick="workLikeComment(${ci},event)">${clikeHeart(c.liked)} <span id="wcl${ci}">${c.likes || 0}</span></span>
          <span class="reply" onclick="workReplyTo('${esc(c.name)}')">回复</span></div>
        <div class="replies">${(c.replies || []).map((r, ri) => `
          <div class="cmt" onclick="workCmtClickReply('${esc(r.name)}',event)"><div class="cava" style="width:28px;height:28px"></div>
            <div class="cbody"><div class="cname">${esc(r.name)}</div><div class="ctext">${esc(r.text)}</div>
            <div class="cmeta"><span class="clike ${r.liked ? 'clike-on' : ''}" onclick="workLikeReply(${ci},${ri},event)">${clikeHeart(r.liked)} <span id="wrl${ci}_${ri}">${r.likes || 0}</span></span></div></div></div>`).join('')}</div>
      </div>
    </div>`).join('');
}
function workCmtClick(ci, e) {
  if (e.target.closest('.cava') || e.target.closest('.cname') || e.target.closest('.clike')) return;
  const w = data.works[workFeedIndex]; if (w && w.comments[ci]) workReplyTo(w.comments[ci].name);
}
function workCmtClickReply(name, e) {
  if (e.target.closest('.cava') || e.target.closest('.cname') || e.target.closest('.clike')) return;
  workReplyTo(name);
}
function workReplyTo(name) { const inp = $('#workCmtInput'); inp.value = '回复 ' + name + '：'; inp.focus(); }
function workSendComment() {
  const w = data.works[workFeedIndex]; if (!w) return;
  const v = $('#workCmtInput').value.trim(); if (!v) return;
  if (!w.comments) w.comments = [];
  w.comments.unshift({ name: '我', text: v, likes: 0, liked: false, replies: [] });
  $('#workCmtInput').value = '';
  renderWorkComments(); save(); toast('已发布评论');
}
function workLikeComment(ci, e) {
  e.stopPropagation();
  const w = data.works[workFeedIndex]; if (!w || !w.comments[ci]) return;
  const c = w.comments[ci];
  if (c.liked) { c.liked = false; c.likes = Math.max(0, (c.likes || 0) - 1); }
  else { c.liked = true; c.likes = (c.likes || 0) + 1; }
  const el = document.getElementById('wcl' + ci); if (el) el.textContent = c.likes;
  const sp = e.target.closest('.clike');
  if (sp) {
    sp.classList.toggle('clike-on', !!c.liked);
    const svg = sp.querySelector('.clike-h');
    if (svg) { svg.setAttribute('fill', c.liked ? '#fe2c55' : 'none'); svg.style.stroke = c.liked ? '#fe2c55' : 'currentColor'; }
  }
  save();
}
function workLikeReply(ci, ri, e) {
  e.stopPropagation();
  const w = data.works[workFeedIndex]; if (!w || !w.comments[ci] || !w.comments[ci].replies[ri]) return;
  const r = w.comments[ci].replies[ri];
  if (r.liked) { r.liked = false; r.likes = Math.max(0, (r.likes || 0) - 1); }
  else { r.liked = true; r.likes = (r.likes || 0) + 1; }
  const rel = document.getElementById('wrl' + ci + '_' + ri); if (rel) rel.textContent = r.likes;
  const sp = e.target.closest('.clike');
  if (sp) {
    sp.classList.toggle('clike-on', !!r.liked);
    const svg = sp.querySelector('.clike-h');
    if (svg) { svg.setAttribute('fill', r.liked ? '#fe2c55' : 'none'); svg.style.stroke = r.liked ? '#fe2c55' : 'currentColor'; }
  }
  save();
}
/* 发作品 */
function openWorkComposer() {
  workPicks = []; workCover = ''; $('#workCaption').value = '';
  const cp = $('#workCoverPrev'); if (cp) cp.style.backgroundImage = '';
  $('#workComposer').classList.add('show');
  if (!_workPicker) {
    _workPicker = mountMediaPicker($('#workPickGrid'), { accept: 'image,video', multi: true, values: [], onChange: v => { workPicks = v; } });
    const cb = document.getElementById('workCoverBtn');
    if (cb) cb.addEventListener('click', () => pickImage(1024, d => {
      workCover = d; const p = $('#workCoverPrev'); if (p) p.style.backgroundImage = 'url(' + d + ')';
    }));
  } else {
    _workPicker.set([]);
  }
}
function closeWorkComposer() { $('#workComposer').classList.remove('show'); $('#workSheet').classList.remove('show'); }
function renderWorkPicks() {
  const g = $('#workPickGrid');
  let html = workPicks.map((p, idx) => `
    <div class="pick-cell">
      ${p.type === 'video' ? `<video src="${esc(p.src)}"></video>` : `<img src="${esc(p.src)}" alt="">`}
      <div class="rm" data-action="work-rm-media" data-idx="${idx}">✕</div>
    </div>`).join('');
  html += `<div class="pick-cell" data-action="work-pick">+ 添加</div>`;
  g.innerHTML = html;
}
function workPick() { $('#workSheet').classList.add('show'); }
function workSheetRow() { $('#workSheet').classList.remove('show'); const f = document.getElementById('workFile'); if (f) { f.value = ''; f.click(); } }
function workRmMedia(idx) { workPicks.splice(idx, 1); renderWorkPicks(); }
function workFileChange(e) {
  const files = Array.from(e.target.files || []);
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = ev => {
      workPicks.push({ type: file.type.indexOf('video') === 0 ? 'video' : 'image', src: ev.target.result });
      renderWorkPicks();
    };
    reader.readAsDataURL(file);
  });
}
function publishWork() {
  if (!workPicks.length) { toast('先添加一张图片或视频吧'); return; }
  const caption = $('#workCaption').value.trim();
  workPicks.forEach((p, k) => {
    data.works.unshift({
      id: 'w' + Date.now() + '_' + k, type: p.type, src: p.src, cover: workCover, caption: caption,
      likes: 0, liked: false, faved: false, time: Date.now(), comments: []
    });
  });
  save(); closeWorkComposer(); renderAiProfile();
  toast('已发布 ' + workPicks.length + ' 个作品');
}

/* ===================== 通话页面 ===================== */
let _callTimer = null, _callSec = 0, _callMuted = false, _callSpeaker = false;
function openCallPage() {
  const s = data.settings;
  $('#tabbar').style.display = 'none';
  $all('.screen').forEach(sc => sc.classList.toggle('active', sc.id === 'screen-call'));
  $('#call-name').textContent = s.aiName;
  const ava = $('#call-avatar');
  if (s.aiAvatar) { ava.style.backgroundImage = 'url(' + s.aiAvatar + ')'; $('#call-bg').style.backgroundImage = 'url(' + s.aiAvatar + ')'; }
  else { ava.style.backgroundImage = ''; $('#call-bg').style.backgroundImage = ''; }
  $('#call-status').textContent = '正在呼叫…';
  $('#call-timer').textContent = '00:00';
  $('#call-mute').classList.toggle('on', _callMuted);
  $('#call-speaker').classList.toggle('on', _callSpeaker);
  clearInterval(_callTimer); _callSec = 0;
  // 模拟对方接通
  setTimeout(() => {
    if (!$('#screen-call') || !$('#screen-call').classList.contains('active')) return;
    $('#call-status').textContent = '通话中';
    const scC = document.getElementById('screen-call'); if (scC) scC.classList.add('call-connected');
    _callTimer = setInterval(() => {
      _callSec++;
      const m = String(Math.floor(_callSec / 60)).padStart(2, '0');
      const sec = String(_callSec % 60).padStart(2, '0');
      const t = $('#call-timer'); if (t) t.textContent = m + ':' + sec;
    }, 1000);
  }, 1800);
}
function backCall() {
  clearInterval(_callTimer); _callTimer = null;
  const scC = document.getElementById('screen-call'); if (scC) scC.classList.remove('call-connected');
  $('#tabbar').style.display = '';
  $all('.screen').forEach(s => s.classList.toggle('active', s.id === 'screen-chat'));
  renderChat();
}
function toggleCallMute() { _callMuted = !_callMuted; $('#call-mute').classList.toggle('on', _callMuted); toast(_callMuted ? '已静音' : '已取消静音'); }
function toggleCallSpeaker() { _callSpeaker = !_callSpeaker; $('#call-speaker').classList.toggle('on', _callSpeaker); toast(_callSpeaker ? '已开启免提' : '已关闭免提'); }

/* ===================== 事件绑定 ===================== */
document.addEventListener('click', e => {
  // 点内联选择器外部时收起已展开的选择列表
  const openPickers = $all('.inline-picker.open');
  if (openPickers.length && !e.target.closest('.inline-picker')) {
    openPickers.forEach(p => p.classList.remove('open'));
  }
  const panel = $('#chatMorePanel');
  if (panel && panel.classList.contains('show') && !e.target.closest('#chatMorePanel') && !e.target.closest('[data-action="chat-more"]')) closeChatMenu();
  const up = $('#chatUserMenu');
  if (up && up.classList.contains('show') && !e.target.closest('#chatUserMenu') && !e.target.closest('[data-action="chat-user-menu"]')) closeChatUserMenu();
  // 作品评论：点评论面板以外（含作品画面/侧栏/返回）即收起
  const wc = document.getElementById('workComment');
  if (wc && wc.classList.contains('show') && !e.target.closest('#workComment') && !e.target.closest('[data-action="work-comment-open"]')) closeWorkComment();
  // 点朋友圈图片 → 全屏查看；点查看层任意处 → 关闭
  if (e.target.tagName === 'IMG' && e.target.closest('.moment-imgs')) {
    openImageLightbox(e.target.currentSrc || e.target.src); return;
  }
  const a = e.target.closest('[data-action]');
  if (!a) { closeMomentMenus(); return; }
  const act = a.dataset.action;
  if (act === 'add-day') addDay();
  else if (act === 'add-bit') addBit();
  else if (act === 'bit-back') switchTab('anniversary');
  else if (act === 'bit-edit') { const id = currentBitId; switchTab('anniversary'); editBit(id); }
  else if (act === 'bit-del') { const id = currentBitId; if (id) { data.bitsOfBliss = (data.bitsOfBliss || []).filter(x => x.id !== id); save(); renderBits(); } switchTab('anniversary'); toast('已删除'); }
  else if (act === 'home-mod') openHomeMod(a.dataset.mod);
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
  else if (act === 'edit-text') openText();
  else if (act === 'edit-fonts') openFonts();
  else if (act === 'edit-lang') openLang();
  else if (act === 'edit-chatpos') openChatPos();
  else if (act === 'backup') { closeMenu(); openBackup(); }
  else if (act === 'close-menu') closeMenu();
  else if (act === 'menu') toggleMenu();
  else if (act === 'goto') switchTab(a.dataset.target);
  else if (act === 'send-chat') sendChat();
  else if (act === 'chat-extra') toast('更多功能后续扩展');
  else if (act === 'chat-mic') toast('语音输入后续扩展');
  else if (act === 'chat-call') openCallPage();
  else if (act === 'chat-search') toast('搜索聊天记录后续扩展');
  else if (act === 'chat-more') { closeChatUserMenu(); openChatMenu(); }
  else if (act === 'chat-user-menu') openChatUserMenu();
  else if (act === 'mm-model') { data.settings.chatModel = a.dataset.model; save(); openChatMenu(); toast('已切换：' + ((CHAT_MODELS.find(m => m.id === a.dataset.model)) || {}).name); }
  else if (act === 'mm-model-toggle') { const l = $('#cmpModelList'); if (l) { const open = l.style.display === 'none'; l.style.display = open ? 'block' : 'none'; a.classList.toggle('open', open); } }
  else if (act === 'mm-newchat') newChat();
  else if (act === 'mm-history') { const h = $('#cmpHist'); if (h) h.style.display = (h.style.display === 'none' ? 'block' : 'none'); }
  else if (act === 'mm-load') loadConversation(a.dataset.cid);
  else if (act === 'goto-aiprofile') { closeChatUserMenu(); openAiProfilePage(); }
  else if (act === 'goto-aimoments') { closeChatUserMenu(); closeModal(); openPersonMoments('ai'); }
  else if (act === 'back-aiprofile') {
    if ($('#workComposer').classList.contains('show')) { closeWorkComposer(); return; }
    if ($('#workFeed').classList.contains('show')) { closeWorkFeed(); return; }
    backAiProfile();
  }
  else if (act === 'aiprofile-tab') switchAiProfileTab(a.dataset.tab);
  else if (act === 'aiprofile-add') openWorkComposer();
  else if (act === 'aiprofile-menu') toast('主页菜单后续扩展');
  else if (act === 'work-grid-item') openWorkFeed(+a.dataset.i);
  else if (act === 'work-feed-close') closeWorkFeed();
  else if (act === 'work-like') workLike(+a.dataset.i, a);
  else if (act === 'work-fav') workFav(+a.dataset.i, a);
  else if (act === 'work-comment-open') openWorkComment(+a.dataset.i);
  else if (act === 'work-comment-close') closeWorkComment();
  else if (act === 'work-comment-send') workSendComment();
  else if (act === 'work-forward') { toast('已转发到聊天'); }
  else if (act === 'work-composer-cancel') closeWorkComposer();
  else if (act === 'work-composer-pub') publishWork();
  else if (act === 'work-pick') workPick();
  else if (act === 'work-sheet-row') workSheetRow(a.dataset.src);
  else if (act === 'work-sheet-cancel') $('#workSheet').classList.remove('show');
  else if (act === 'work-rm-media') workRmMedia(+a.dataset.idx);
  else if (act === 'aiprofile-menu') toast('主页菜单后续扩展');
  else if (act === 'back-call') backCall();
  else if (act === 'call-end') backCall();
  else if (act === 'call-mute') toggleCallMute();
  else if (act === 'call-speaker') toggleCallSpeaker();
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
/* 键盘高度检测（visualViewport）：键盘弹起时输入框贴键盘、导航栏沉到键盘后 */
(function () {
  const root = document.documentElement;
  let baseH = window.innerHeight;
  // 聊天背景锁定为初始视口高度：键盘弹起期间不变 → 背景图不随键盘 resize 重裁切、不移动
  function lockChatBg() { root.style.setProperty('--chat-bg-h', window.innerHeight + 'px'); }
  lockChatBg();
  function update() {
    const vv = window.visualViewport;
    const vh = vv ? vv.height : window.innerHeight;
    const vTop = vv ? vv.offsetTop : 0;
    // 键盘高度：兼容“视口收缩”与“键盘覆盖”两种模式
    const kb = Math.max(0, window.innerHeight - vh - vTop, baseH - window.innerHeight);
    // 覆盖层模式：布局视口不收缩，但 visualViewport 缩小 → 输入框需额外抬升
    const overlay = (window.innerHeight >= baseH - 2) && (vh < baseH - 2);
    root.style.setProperty('--kb-input', (overlay ? kb : 0) + 'px');
    // 键盘弹起：给 body 加 kb-open（输入框贴键盘、导航栏沉到键盘后）
    if (kb > 4) document.body.classList.add('kb-open');
    else { document.body.classList.remove('kb-open'); lockChatBg(); } // 键盘收起后重新锁定（适应旋转/地址栏）
  }
  function recapBase() { if (window.innerHeight > baseH) baseH = window.innerHeight; }
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', update);
    window.visualViewport.addEventListener('scroll', update);
  }
  window.addEventListener('resize', () => { recapBase(); update(); });
  update();
})();

/* ===================== 启动 ===================== */
function renderAll() {
  applyTheme();
  renderAnniversary();
  renderHome();
  renderMoments();
  renderWishlist();
  applyLang();
  applyText();
  applyElStyle();
  applyFonts();
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
  // 带返回图标的页面（心愿单 / 设置 / 我的朋友圈 / TA 主页 / 通话）隐藏底部导航栏
  (function setupTabbarHiding() {
    const hideScreens = ['screen-wishlist', 'screen-setting', 'screen-mymoments', 'screen-aiprofile', 'screen-call'];
    const tabbar = document.getElementById('tabbar');
    function syncTabbar() {
      const active = document.querySelector('.screen.active');
      const hide = !!(active && hideScreens.includes(active.id));
      if (tabbar) tabbar.style.display = hide ? 'none' : '';
      document.body.classList.toggle('no-tabbar', hide);
    }
    const obs = new MutationObserver(syncTabbar);
    document.querySelectorAll('.screen').forEach(s => obs.observe(s, { attributes: true, attributeFilter: ['class'] }));
    syncTabbar();
  })();
  // 图片查看层：点任意处关闭
  const lb = document.getElementById('img-lightbox');
  if (lb) lb.addEventListener('click', () => lb.classList.remove('show'));
})();
