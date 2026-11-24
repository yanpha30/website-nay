const API_BASE = '../backend/api';

function showToast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => el.classList.remove('show'), 2800);
}

function formatTime(ts) {
  if (!ts) return '-';
  const d = new Date(ts.replace(' ', 'T'));
  if (Number.isNaN(d.getTime())) return ts;
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB';
}

async function checkAuth(requireLogin = false) {
  try {
    const res = await fetch(`${API_BASE}/login.php`, { credentials: 'same-origin' });
    const data = await res.json();
    if (requireLogin && !data.authenticated) {
      window.location.href = './login.html';
      return null;
    }
    return data.user;
  } catch {
    return null;
  }
}

async function handleLogout() {
  await fetch(`${API_BASE}/login.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify({ action: 'logout' }),
  });
  window.location.href = './login.html';
}

function renderSummary(summary) {
  const map = {
    statTotal: summary.total,
    statKosong: summary.kosong,
    statTerisi: summary.terisi,
    statMaint: summary.maintenance,
  };
  for (const [id, val] of Object.entries(map)) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }
}

function createSlotCard(slot, isAdmin) {
  const div = document.createElement('div');
  div.className = `slot-card ${slot.status}`;
  const label = slot.status === 'kosong' ? 'KOSONG' : (slot.status === 'terisi' ? 'TERISI' : 'MAINTENANCE');

  let actionsHtml = '';
  if (isAdmin) {
    const nextSim = slot.status === 'terisi' ? 'kosong' : 'terisi';
    const simLabel = slot.status === 'terisi' ? 'Simulasi Keluar' : 'Simulasi Masuk';
    const nextMaint = slot.status === 'maintenance' ? 'kosong' : 'maintenance';
    const maintLabel = slot.status === 'maintenance' ? 'Aktifkan Slot' : 'Kunci Maint.';
    actionsHtml = `
      <div class="slot-actions">
        <button class="btn btn-sm btn-outline" data-sim-slot="${slot.nomor_slot}" data-sim-status="${nextSim}">${simLabel}</button>
        <button class="btn btn-sm ${slot.status === 'maintenance' ? 'btn-success' : 'btn-primary'}" data-maint-slot="${slot.nomor_slot}" data-maint-status="${nextMaint}">${maintLabel}</button>
      </div>`;
  }

  div.innerHTML = `
    <div class="slot-code">${slot.nomor_slot}</div>
    <span class="slot-badge">${label}</span>
    <div class="slot-time">Update: ${formatTime(slot.updated_at)}</div>
    ${actionsHtml}
  `;
  return div;
}

function renderDenah(slots, isAdmin) {
  const rowTop = document.getElementById('rowTop');
  const rowBottom = document.getElementById('rowBottom');
  if (!rowTop || !rowBottom) return;
  rowTop.innerHTML = '';
  rowBottom.innerHTML = '';
  slots.slice(0, 6).forEach((s) => rowTop.appendChild(createSlotCard(s, isAdmin)));
  slots.slice(6, 12).forEach((s) => rowBottom.appendChild(createSlotCard(s, isAdmin)));
}

async function fetchSlots(isAdmin = false) {
  const badge = document.getElementById('liveBadge');
  const liveText = document.getElementById('liveText');
  try {
    const res = await fetch(`${API_BASE}/slots.php`, { credentials: 'same-origin' });
    const data = await res.json();
    if (data.status !== 'ok') throw new Error(data.error || 'Gagal memuat data');
    renderSummary(data.summary);
    renderDenah(data.slots, isAdmin);
    if (badge && liveText) {
      badge.classList.remove('offline');
      liveText.textContent = `Live • ${new Date().toLocaleTimeString('id-ID')}`;
    }
  } catch {
    if (badge && liveText) {
      badge.classList.add('offline');
      liveText.textContent = 'Koneksi API terputus — mencoba ulang...';
    }
  }
}

async function toggleMaintenance(nomorSlot, statusBaru) {
  try {
    const res = await fetch(`${API_BASE}/slots.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ nomor_slot: nomorSlot, status: statusBaru }),
    });
    const data = await res.json();
    if (data.status === 'ok') {
      showToast(data.message);
      fetchSlots(true);
    } else {
      showToast(data.error || 'Gagal memperbarui maintenance');
    }
  } catch {
    showToast('Gagal menghubungi server API');
  }
}

async function fetchLogs() {
  const tbody = document.getElementById('logsBody');
  if (!tbody) return;
  const slot = document.getElementById('filterSlot')?.value || '';
  const sumber = document.getElementById('filterSumber')?.value || '';
  const params = new URLSearchParams({ with_logs: '1' });
  if (slot) params.set('slot', slot);
  if (sumber) params.set('sumber', sumber);

  try {
    const res = await fetch(`${API_BASE}/slots.php?${params.toString()}`, { credentials: 'same-origin' });
    const data = await res.json();
    const logs = data.logs || [];
    if (!logs.length) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--muted);">Belum ada riwayat perubahan status.</td></tr>';
      return;
    }
    tbody.innerHTML = logs.map((l, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td><strong>${l.nomor_slot}</strong></td>
        <td>${l.status_lama}</td>
        <td><strong>${l.status_baru}</strong></td>
        <td><span class="pill ${l.sumber}">${l.sumber}</span></td>
        <td><code>${l.device_id || '-'}</code></td>
        <td>${l.created_at}</td>
      </tr>`).join('');
  } catch {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#dc2626;">Gagal memuat riwayat dari API.</td></tr>';
  }
}

// Bootstrap per halaman
document.addEventListener('DOMContentLoaded', async () => {
  const page = document.body.dataset.page;
  document.getElementById('btnLogout')?.addEventListener('click', handleLogout);

  if (page === 'public') {
    fetchSlots(false);
    setInterval(() => fetchSlots(false), 2500);
  }

  if (page === 'login') {
    const form = document.getElementById('loginForm');
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const errEl = document.getElementById('loginError');
      errEl.style.display = 'none';
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      try {
        const res = await fetch(`${API_BASE}/login.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (data.status === 'ok') {
          window.location.href = './dashboard.html';
        } else {
          errEl.textContent = data.error || 'Login gagal';
          errEl.style.display = 'block';
        }
      } catch {
        errEl.textContent = 'Tidak dapat terhubung ke server PHP.';
        errEl.style.display = 'block';
      }
    });
  }

  if (page === 'dashboard') {
    const user = await checkAuth(true);
    if (!user) return;
    const greet = document.getElementById('userGreeting');
    if (greet) greet.textContent = `Masuk sebagai ${user.nama} (${user.role}) • Kelola maintenance & jalankan simulasi.`;

    fetchSlots(true);
    setInterval(() => fetchSlots(true), 2500);

    document.addEventListener('click', (e) => {
      const maintBtn = e.target.closest('[data-maint-slot]');
      if (maintBtn) {
        toggleMaintenance(maintBtn.dataset.maintSlot, maintBtn.dataset.maintStatus);
        return;
      }
      const simBtn = e.target.closest('[data-sim-slot]');
      if (simBtn && typeof window.triggerSlotSimulation === 'function') {
        window.triggerSlotSimulation(simBtn.dataset.simSlot, simBtn.dataset.simStatus);
      }
    });
  }

  if (page === 'riwayat') {
    const user = await checkAuth(true);
    if (!user) return;
    fetchLogs();
    document.getElementById('filterSlot')?.addEventListener('change', fetchLogs);
    document.getElementById('filterSumber')?.addEventListener('change', fetchLogs);
    document.getElementById('btnRefreshLogs')?.addEventListener('click', fetchLogs);
  }
});
