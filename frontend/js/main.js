const $ = s => document.querySelector(s), app = $('#app'), L = ['pt', 'en', 'es', 'fr'];
const I = { mail: "M4 6h16v12H4z M4 7l8 6 8-6", lock: "M6 11h12v9H6z M8 11V8a4 4 0 018 0v3", user: "M12 12a4 4 0 100-8 4 4 0 000 8z M4 21c0-4 4-6 8-6s8 2 8 6", eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z M12 15a3 3 0 100-6 3 3 0 000 6z", bulb: "M9 18h6 M10 21h4 M12 3a6 6 0 00-4 10c1 1 1 2 1 3h6c0-1 0-2 1-3a6 6 0 00-4-10z", users: "M9 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7z M2 20c0-3.5 3-5 7-5s7 1.5 7 5 M17 4a3.5 3.5 0 010 7 M18 15c2.5.5 4 2 4 5", set: "M4 7h10 M18 7h2 M4 17h2 M10 17h10 M16 5v4 M8 15v4", globe: "M12 21a9 9 0 100-18 9 9 0 000 18z M3 12h18 M12 3c3 3 3 15 0 18 M12 3c-3 3-3 15 0 18", face: "M4 8V5a1 1 0 011-1h3 M16 4h3a1 1 0 011 1v3 M20 16v3a1 1 0 01-1 1h-3 M8 20H5a1 1 0 01-1-1v-3 M9 10v1 M15 10v1 M9 15c1 1 5 1 6 0", back: "M15 5l-7 7 7 7", plus: "M12 5v14 M5 12h14", check: "M5 12l5 5 10-10", out: "M9 4H5v16h4 M16 8l4 4-4 4 M20 12H9", chev: "M9 5l7 7-7 7", trash: "M5 7h14 M9 7V4h6v3 M7 7l1 13h8l1-13", clock: "M12 21a9 9 0 100-18 9 9 0 000 18z M12 7v5l3 2", gate: "M4 21V8l8-5 8 5v13 M9 21v-7h6v7", shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" };
const ic = (n, s = 20) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${I[n]}"/></svg>`;
const K = "hi,email,pass,enter,noacc,create,name,confirm,hasacc,forgot,sendlink,newpass,save,sent,lang,face,routines,family,settings,logout,lights,on,off,days,owner,guest,invite,perms,start,front,left,right,done,bademail,rule,nomatch,auto,newr,badlogin,gate,living,garden,garage,bedroom,sec,gopen,gclosed,goffline,bopen,bclose,alarm,armed,disarmed".split(',');
const D = {
    pt: "Bem-vindo de volta|E-mail|Senha|Entrar|Não tem conta?|Criar conta|Nome completo|Confirmar senha|Já tenho conta|Esqueci a senha|Enviar link|Nova senha|Salvar|Enviamos um link de redefinição para o seu e-mail|Idioma|Reconhecimento facial|Rotinas|Família|Ajustes|Sair|Luzes|Ligar às|Desligar às|Dias|Dono|Convidado|Adicionar membro|Permissões|Iniciar captura|Olhe de frente|Vire à esquerda|Vire à direita|Rosto cadastrado|E-mail inválido|8+ caracteres, número e maiúscula|Senhas diferentes|Idioma detectado automaticamente|Nova rotina|Credenciais inválidas|Portão|Sala|Jardim|Garagem|Quarto|Segurança|Aberto|Fechado|Offline|Abrir|Fechar|Modo alarme|Armado|Desarmado".split('|'),
    en: "Welcome back|Email|Password|Sign in|No account?|Create account|Full name|Confirm password|I have an account|Forgot password|Send link|New password|Save|We sent a reset link to your email|Language|Face recognition|Routines|Family|Settings|Log out|Lights|Turn on at|Turn off at|Days|Owner|Guest|Add member|Permissions|Start capture|Look straight ahead|Turn left|Turn right|Face registered|Invalid email|8+ characters, a number and a capital|Passwords differ|Language detected automatically|New routine|Invalid credentials|Gate|Living room|Garden|Garage|Bedroom|Security|Open|Closed|Offline|Open|Close|Alarm mode|Armed|Disarmed".split('|'),
    es: "Bienvenido de nuevo|Correo|Contraseña|Entrar|¿No tienes cuenta?|Crear cuenta|Nombre completo|Confirmar contraseña|Ya tengo cuenta|Olvidé mi contraseña|Enviar enlace|Nueva contraseña|Guardar|Enviamos un enlace de restablecimiento a tu correo|Idioma|Reconocimiento facial|Rutinas|Familia|Ajustes|Salir|Luces|Encender a las|Apagar a las|Días|Dueño|Invitado|Añadir miembro|Permisos|Iniciar captura|Mira al frente|Gira a la izquierda|Gira a la derecha|Rostro registrado|Correo inválido|8+ caracteres, un número y una mayúscula|Contraseñas distintas|Idioma detectado automáticamente|Nueva rutina|Credenciales inválidas|Portón|Sala|Jardín|Garaje|Dormitorio|Seguridad|Abierto|Cerrado|Sin conexión|Abrir|Cerrar|Modo alarma|Armado|Desarmado".split('|'),
    fr: "Bon retour|E-mail|Mot de passe|Connexion|Pas de compte ?|Créer un compte|Nom complet|Confirmer le mot de passe|J'ai un compte|Mot de passe oublié|Envoyer le lien|Nouveau mot de passe|Enregistrer|Nous avons envoyé un lien de réinitialisation à votre e-mail|Langue|Reconnaissance faciale|Routines|Famille|Réglages|Déconnexion|Lumières|Allumer à|Éteindre à|Jours|Propriétaire|Invité|Ajouter un membre|Autorisations|Démarrer la capture|Regardez droit devant|Tournez à gauche|Tournez à droite|Visage enregistré|E-mail invalide|8+ caractères, un chiffre et une majuscule|Mots de passe différents|Langue détectée automatiquement|Nouvelle routine|Identifiants invalides|Portail|Salon|Jardin|Garage|Chambre|Seguridad|Abierto|Cerrado|Sin conexión|Abrir|Cerrar|Modo alarma|Armado|Desarmado".split('|')
};
const nl = (navigator.language || 'pt').slice(0, 2);
let S = {
    lang: L.includes(nl) ? nl : 'pt', hint: L.includes(nl), v: 'splash', tab: 'r', step: 1, fs: 0, me: null,
    users: [{ name: 'Demo Morador', email: 'demo@theclick.com', pass: 'Click123' }],
    sch: [{ l: 'garden', a1: '18:00', a2: '06:00', d: [1, 1, 1, 1, 1, 1, 1], on: 1 }, { l: 'living', a1: '19:30', a2: '23:00', d: [0, 1, 1, 1, 1, 1, 0], on: 0 }],
    mem: [{ n: 'Ana Souza', e: 'ana@mail.com', p: { gate: 0, lights: 1, routines: 0 } }]
};
const t = k => D[S.lang][K.indexOf(k)];
const dn = j => new Date(2023, 0, 1 + j).toLocaleDateString(S.lang, { weekday: 'narrow' });
const toast = () => { const d = document.createElement('div'); d.className = 'toast'; d.innerHTML = ic('check'); $('#phone').append(d); setTimeout(() => d.remove(), 2200) };
const lb = () => `<div class="chips top">${L.map(l => `<button class="chip ${l == S.lang ? 'on' : ''}" data-a="lang" data-p="${l}">${l.toUpperCase()}</button>`).join('')}</div>${S.hint ? `<p class="hint">${ic('globe', 14)} ${t('auto')}: ${S.lang.toUpperCase()}</p>` : '<p class="hint"></p>'}`;
const fld = (id, i, type, ph, v, eye) => `<div class="f"><label class="in">${ic(i)}<input id="${id}" type="${type}" placeholder="${ph}" ${v ? `data-v="${v}"` : ''} autocomplete="off">${eye ? `<button type="button" data-a="eye">${ic('eye', 18)}</button>` : ''}</label><div class="msg"></div></div>`;
const str = '<div class="str"><i></i><i></i><i></i></div>';
const hd = (title, b) => `<div class="hd"><button class="ib" data-a="go" data-p="${b}">${ic('back')}</button><h2>${title}</h2></div>`;
const sw = (on, a, p, k) => `<div class="sw ${on ? 'on' : ''}" data-a="${a}" data-p="${p}" ${k ? `data-k="${k}"` : ''}></div>`;
const V = {
    splash: () => `<div class="splash" data-a="go" data-p="login"><svg viewBox="0 0 200 175"><rect class="fr" x="40" y="6" width="120" height="150" rx="4"/><rect x="70" y="26" width="60" height="110" rx="6" fill="none" stroke="#ffd60a" stroke-width="3"/><rect class="knob" x="78" y="34" width="44" height="44" rx="5"/><g><line class="ray" x1="134" y1="30" x2="146" y2="22"/><line class="ray" x1="138" y1="48" x2="152" y2="48"/><line class="ray" x1="66" y1="30" x2="54" y2="22"/><line class="ray" x1="62" y1="48" x2="48" y2="48"/></g><g transform="translate(100 56)"><g class="hand"><path d="M-5 22V4a5 5 0 0110 0V14a4 4 0 018 0 4 4 0 018 1 4 4 0 018 2V34c0 12-8 20-20 20h-4c-8 0-12-5-18-13l-5-7a4 4 0 016-5l7 6z" fill="#000" stroke="#ffd60a" stroke-width="3" stroke-linejoin="round"/></g></g></svg><div class="wm"><small>THE</small><b>click</b></div></div>`,
    login: () => `<div class="scr">${lb()}<div class="mark"><i></i></div><h1>${t('hi')}</h1>${fld('em', 'mail', 'email', t('email'))}${fld('pw', 'lock', 'password', t('pass'), '', 1)}<p class="err" id="err"></p><button class="btn" style="margin-top:6px" data-a="login">${t('enter')}</button><div class="ctr"><button class="lnk" data-a="go" data-p="forgot">${t('forgot')}</button></div><div class="ctr">${t('noacc')} <button class="lnk" data-a="go" data-p="reg">${t('create')}</button></div></div>`,
    reg: () => `<div class="scr">${lb()}<h1>${t('create')}</h1>${fld('nm', 'user', 'text', t('name'), 'name')}${fld('em', 'mail', 'email', t('email'), 'email')}${fld('p1', 'lock', 'password', t('pass'), 'pass', 1)}${str}${fld('p2', 'lock', 'password', t('confirm'), 'match', 1)}<button class="btn" data-a="reg">${t('create')}</button><div class="ctr">${t('hasacc')} <button class="lnk" data-a="go" data-p="login">${t('enter')}</button></div></div>`,
    forgot: () => `<div class="scr">${hd(t('forgot'), 'login')}${S.step == 1 ? fld('em', 'mail', 'email', t('email'), 'email') + `<button class="btn" data-a="send">${t('sendlink')}</button>` : `<div class="card row" style="border-color:var(--g);color:var(--g)">${ic('check')}<span style="color:var(--t);font-size:14px">${t('sent')}</span></div>`}</div>`,
    reset: () => `<div class="scr">${hd(t('newpass'), 'login')}${fld('p1', 'lock', 'password', t('newpass'), 'pass', 1)}${str}${fld('p2', 'lock', 'password', t('confirm'), 'match', 1)}<p class="err" id="err"></p><button class="btn" data-a="reset">${t('save')}</button></div>`,
    home: () => {
        const T = [['r', 'clock', t('routines')], ['f', 'users', t('family')], ['g', 'shield', t('sec')], ['s', 'set', t('settings')]];
        return `<div class="scr"><p class="sub" style="margin:0 0 4px">${t('hi')}</p><h1>${S.me.name.split(' ')[0]}</h1>${H[S.tab]()}</div>${S.tab == 'r' ? `<button class="fab" data-a="go" data-p="newr">${ic('plus', 26)}</button>` : ''}<nav class="tabs">${T.map(x => `<button class="${S.tab == x[0] ? 'on' : ''}" data-a="tab" data-p="${x[0]}">${ic(x[1], 22)}${x[2]}</button>`).join('')}</nav>`
    },
    newr: () => `<div class="scr">${hd(t('newr'), 'home')}<p class="lbl">${t('lights')}</p><div class="chips lc">${['living', 'garden', 'garage', 'bedroom'].map((l, i) => `<button class="chip ${i ? '' : 'on'}" data-a="pick" data-p="${l}">${t(l)}</button>`).join('')}</div><div class="f"><label class="in">${ic('bulb')}<span class="lb">${t('on')}</span><input id="t1" type="time" value="18:00"></label></div><div class="f"><label class="in">${ic('clock')}<span class="lb">${t('off')}</span><input id="t2" type="time" value="23:00"></label></div><p class="lbl">${t('days')}</p><div class="dg">${[0, 1, 2, 3, 4, 5, 6].map(j => `<button class="day on" data-a="dtog">${dn(j)}</button>`).join('')}</div><button class="btn" data-a="saver">${t('save')}</button></div>`,
    addm: () => `<div class="scr">${hd(t('invite'), 'home')}${fld('nm', 'user', 'text', t('name'), 'name')}${fld('em', 'mail', 'email', t('email'), 'email')}<button class="btn" data-a="addm">${t('invite')}</button></div>`,
    face: () => {
        const f = S.fs, txt = [t('face'), t('front'), t('left'), t('right'), t('done')][f], x = f == 2 ? -16 : f == 3 ? 16 : 0;
        return `<div class="scr">${hd(t('face'), 'home')}<div class="ring ${f == 4 ? 'ok' : f ? 'run' : ''}">${f >= 1 && f <= 3 ? '<video id="cam" playsinline muted style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transform:scaleX(-1)"></video>' : ''}<div class="scan"></div><div style="transform:translateX(${x}px);transition:.5s">${ic(f == 4 ? 'check' : 'user', f == 4 ? 80 : 110)}</div></div><h2 style="text-align:center">${txt}</h2><p class="err" id="err" style="text-align:center"></p><div class="dots" style="margin-top:16px">${[1, 2, 3].map(i => `<i class="${f >= i ? 'on' : ''}"></i>`).join('')}</div>${f == 0 ? `<button class="btn" data-a="fstart">${t('start')}</button>` : f == 4 ? `<button class="btn o" data-a="go" data-p="home">${t('save')}</button>` : ''}</div>`
    }
};
const H = {
    r: () => `${S.sch.map((s, i) => `<div class="card"><div class="row"><div class="ico">${ic('bulb')}</div><div class="fx"><b>${t(s.l)}</b><small>${ic('clock', 12)} ${s.a1} - ${s.a2}</small></div><button class="ib d" style="border:0;width:34px" data-a="dels" data-p="${i}">${ic('trash', 18)}</button>${sw(s.on, 'ts', i)}</div><div class="days">${s.d.map((x, j) => `<span class="${x ? 'on' : ''}">${dn(j)}</span>`).join('')}</div></div>`).join('')}<div style="height:70px"></div>`,
    f: () => `<div class="card row"><div class="av">${S.me.name[0].toUpperCase()}</div><div class="fx"><b>${S.me.name}</b><small>${S.me.email}</small></div><span class="tag y">${t('owner')}</span></div>${S.mem.map((m, i) => `<div class="card"><div class="row"><div class="av" style="background:none;border:1.5px solid var(--b);color:var(--t)">${m.n[0].toUpperCase()}</div><div class="fx"><b>${m.n}</b><small>${m.e}</small></div><span class="tag">${t('guest')}</span><button class="ib d" style="border:0;width:34px" data-a="delm" data-p="${i}">${ic('trash', 18)}</button></div>${['gate', 'lights', 'routines'].map(k => `<div class="prm"><span>${t(k)}</span>${sw(m.p[k], 'perm', i, k)}</div>`).join('')}</div>`).join('')}<button class="btn o" data-a="go" data-p="addm">${t('invite')}</button>`,
    s: () => `<div class="card row" data-a="go" data-p="face" style="cursor:pointer"><div class="ico">${ic('face')}</div><div class="fx"><b>${t('face')}</b></div>${ic('chev', 18)}</div><p class="lbl">${t('lang')}</p>${lb()}<button class="btn o" data-a="out">${t('logout')}</button>`,
    g: () => {
        const x = S.sec;
        if (!x) return `<p class="sub">${S.secErr || '...'}</p>`;
        const open = x.gate.state == 'open';
        const gs = !x.gate.online ? ['goffline', 'r'] : open ? ['gopen', x.alarm.armed ? 'r' : 'y'] : ['gclosed', 'g'];
        return `<div class="card"><div class="row"><div class="ico">${ic('gate')}</div><div class="fx"><b>${t('garage')}</b><small>${t('gate')}</small></div><span class="tag ${gs[1]}">${t(gs[0])}</span></div></div>
        <div class="card row"><div class="ico">${ic('shield')}</div><div class="fx"><b>${t('alarm')}</b><small>${x.alarm.armed ? t('armed') : t('disarmed')}</small></div>${sw(x.alarm.armed, 'alarm', 0)}</div>
        <button class="btn o" data-a="gate" data-p="${open ? 'closed' : 'open'}">${t(open ? 'bclose' : 'bopen')}</button>
        <p class="err">${S.secErr || ''}</p>`
    },
};
function render() { app.innerHTML = V[S.v]() }
function go(v) { clearInterval(S.tm); S.v = v; if (v == 'forgot') S.step = 1; if (v == 'face') S.fs = 0; render() }
function vf(el) {
    const v = el.dataset.v, x = el.value, f = el.closest('.f'); let ok, m;
    if (v == 'email') { ok = /^\S+@\S+\.\S+$/.test(x); m = t('bademail') }
    else if (v == 'pass') { ok = /^(?=.*\d)(?=.*[A-Z]).{8,}$/.test(x); m = t('rule'); const s = [x.length >= 8, /\d/.test(x), /[A-Z]/.test(x)]; document.querySelectorAll('.str i').forEach((e, i) => e.classList.toggle('on', s[i])) }
    else if (v == 'match') { ok = x && x == $('#p1').value; m = t('nomatch') }
    else { ok = x.trim().length >= 3; m = t('name') }
    f.classList.toggle('ok', !!ok); f.classList.toggle('bad', !ok); f.querySelector('.msg').textContent = m; return !!ok
}
const chk = ids => ids.map(i => vf($('#' + i))).every(Boolean);
/* ===== Backend (API) ===== */
const API = '/auth';
const store = {
    get: k => { try { return localStorage.getItem(k) } catch (e) { return null } },
    set: (k, v) => { try { localStorage.setItem(k, v) } catch (e) { } },
    del: k => { try { localStorage.removeItem(k) } catch (e) { } }
};
async function api(path, { method = 'POST', body, token } = {}) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = 'Bearer ' + token;
    let r;
    try { r = await fetch(API + path, { method, headers, body: body ? JSON.stringify(body) : undefined }) }
    catch (e) { throw { status: 0, message: 'Sem conexão com o servidor' } }
    const data = r.status == 204 ? null : await r.json().catch(() => null);
    if (!r.ok) throw { status: r.status, message: data && (data.message || data.error) };
    return data;
}
function saveTokens(d) { store.set('tc_access', d.accessToken || d.access_token); store.set('tc_refresh', d.refreshToken || d.refresh_token) }
function saveSession(d) {
    saveTokens(d);
    S.me = { id: d.user.id, name: d.user.full_name, email: d.user.email };
}
async function restoreSession() {
    const rt = store.get('tc_refresh'); if (!rt) return false;
    try {
        const t = await api('/refresh', { body: { refresh_token: rt } });
        saveTokens(t); // o refresh token antigo já foi revogado: guardar o novo de imediato
        const m = await api('/me', { method: 'GET', token: t.accessToken || t.access_token });
        S.me = { id: m.user.id, name: m.user.full_name, email: m.user.email };
        return true;
    } catch (e) {
        if (e.status == 401) { store.del('tc_access'); store.del('tc_refresh') }
        return false;
    }
}
let cam = null;
async function camStart() {
    cam = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false
    });
}
function camStop() { if (cam) { cam.getTracks().forEach(t => t.stop()); cam = null } }
function attachCam() { const v = $('#cam'); if (v && cam) {v.srcObject = cam; v.play().catch(() => { }) } }
function camShot() {
    const v = $('#cam'), c = document.createElement('canvas');
    c.width = v.videoWidth; c.height = v.videoHeight;
    c.getContext('2d').drawImage(v, 0, 0);
    return new Promise(r => c.toBlob(r, 'image/jpeg', 0.9));
}
async function doLogin(btn) {
    const em = $('#em').value.trim(), pw = $('#pw').value, err = $('#err');
    err.textContent = '';
    if (!em || !pw) { err.textContent = t('badlogin'); return }
    btn.disabled = true;
    try {
        saveSession(await api('/login', { body: { email: em, password: pw } }));
        S.tab = 'r'; go('home');
    } catch (e) {
        err.textContent = e.status == 401 ? t('badlogin') : (e.message || 'Error');
        btn.disabled = false;
    }
}
async function doSend(btn) {
    if (!chk(['em'])) return;
    btn.disabled = true;
    try {
        await api('/forgot-password', {body: { email: $('#em').value.trim() } });
        S.step = 2; render();
    } catch (e) {
        const f = $('#em').closest('.f');
        f.classList.remove('ok'); f.classList.add('bad');
        f.querySelector('.msg').textContent = e.message || 'Error';
        btn.disabled = false;
    }
}
async function doReset(btn) {
    if (!chk(['p1', 'p2'])) return;
    btn.disabled = true;
    try {
        await api('/reset-password', {body: { token: S.rt, new_password: $('#p1').value } });
        S.rt = null;
        history.replaceState(null, '', location.pathname); // remove token da URL
        go('login'); toast();
    } catch (e) {
        $('#err').textContent = e.message || 'Error';
        btn.disabled = false;
    }
}
async function doReg(btn) {
    if (!chk(['nm', 'em', 'p1', 'p2'])) return;
    btn.disabled = true;
    try {
        saveSession(await api('/register', {
            body: { full_name: $('#nm').value.trim(), email: $('#em').value.trim(), password: $('#p1').value, language: S.lang }
        }));
        S.tab = 'r'; go('home');
    } catch (e) {
        const f = $('#em').closest('.f');
        f.classList.remove('ok'); f.classList.add('bad');
        f.querySelector('.msg').textContent = e.message || 'Error';
        btn.disabled = false;
    }
}
async function doOut() {
    const rt = store.get('tc_refresh');
    if (rt) api('/logout', { body: { refresh_token: rt } }).catch(() => { });
    store.del('tc_access'); store.del('tc_refresh');
    S.me = null; S.sec = null; go('login');
}
async function sec(path, method, body) {
    const r = await fetch('/security' + path, {
        method: method || 'GET',
        headers: { 'Authorization': 'Bearer ' + store.get('tc_access'), 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(d.error || 'Error');
    return d;
}
async function loadSec() {
    try { S.sec = await sec('/garage'); S.secErr = '' }
    catch (e) { S.secErr = e.message }
    render();
}
async function doAlarm(armed) {
    try { await sec('/alarm', 'PUT', { armed }) } catch (e) { S.secErr = e.message }
    loadSec();
}
async function doGate(state) {
    try { await sec('/gate', 'POST', { state }) } catch (e) { S.secErr = e.message }
    loadSec();
}
async function doFace(btn) {
    if (!confirm('Seu rosto será usado para reconhecimento facial. Guardamos só uma representação numérica, não a foto. Você aceita?')) return;
    btn.disabled = true;
    try {
        await camStart();
        const ang = ['front', 'left', 'right'];
        for (S.fs = 1; S.fs <= 3; S.fs++) {
            render(); attachCam();
            await new Promise(r => setTimeout(r, 2500));
            const shot = await camShot();
            await uploadFace(ang[S.fs - 1], shot);
        }
        S.fs = 4;
    } catch (e) {
        S.fs = 0;
        render();
        $('#err').textContent = e.name == 'NotAllowedError' ? 'Permissão negada para acessar a câmera' : (e.message || 'Erro ao acessar a câmera');
        return;
    } finally { camStop() }
    render();
}

async function uploadFace(angle, blob) {
    const fd = new FormData();
    fd.append('image', blob, 'face.jpg');
    fd.append('angle', angle);
    fd.append('consent', 'true');
    let r;
    try { r = await fetch('/faces/enroll', { method: 'POST', headers: { Authorization: 'Bearer ' + store.get('tc_access') }, body: fd }) }
    catch (e) { throw { message: 'Sem conexão com o servidor' } }
    const data = await r.json().catch(() => null);
    if (!r.ok) throw { status: r.status, message: data && data.error };
}

function act(a, p, el) {
    if (a == 'go') go(p);
    else if (a == 'lang') { S.lang = p; S.hint = false; render() }
    else if (a == 'eye') { const i = el.parentNode.querySelector('input'); i.type = i.type == 'password' ? 'text' : 'password' }
    else if (a == 'login') doLogin(el)
    else if (a == 'reg') doReg(el)
    else if (a == 'send') doSend(el)
    else if (a == 'reset') doReset(el)
    else if (a == 'tab') { S.tab = p; render(); if (p == 'g') loadSec() }
    else if (a == 'alarm') doAlarm(!S.sec.alarm.armed)
    else if (a == 'gate') doGate(p)
    else if (a == 'ts') { S.sch[p].on = !S.sch[p].on; render() }
    else if (a == 'dels') { S.sch.splice(p, 1); render() }
    else if (a == 'pick') { el.parentNode.querySelectorAll('.chip').forEach(c => c.classList.remove('on')); el.classList.add('on') }
    else if (a == 'dtog') el.classList.toggle('on');
    else if (a == 'saver') { S.sch.push({ l: $('.lc .on').dataset.p, a1: $('#t1').value, a2: $('#t2').value, d: [...document.querySelectorAll('.dg .day')].map(e => +e.classList.contains('on')), on: 1 }); S.tab = 'r'; go('home'); toast() }
    else if (a == 'perm') { const m = S.mem[p]; m.p[el.dataset.k] = !m.p[el.dataset.k]; render() }
    else if (a == 'delm') { S.mem.splice(p, 1); render() }
    else if (a == 'addm') { if (chk(['nm', 'em'])) { S.mem.push({ n: $('#nm').value.trim(), e: $('#em').value.trim(), p: { gate: 0, lights: 1, routines: 0 } }); S.tab = 'f'; go('home'); toast() } }
    else if (a == 'fstart') doFace(el)
    else if (a == 'out') doOut()
}
app.addEventListener('click', e => { const a = e.target.closest('[data-a]'); if (a) act(a.dataset.a, a.dataset.p, a) });
app.addEventListener('input', e => { if (e.target.dataset.v) vf(e.target) });
const rt = new URLSearchParams(location.search).get('reset_token');
if (rt) { S.rt = rt; go('reset') }
render(); setTimeout(() => { if (S.v == 'splash') go('login') }, 4000);
restoreSession().then(ok => { if (ok && (S.v == 'splash' || S.v == 'login')) { S.tab = 'r'; go('home') } });