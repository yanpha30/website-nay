const SIM_DEVICE_KEY = 'NAY729-SIM-KEY-2026';
const SIM_SLOTS = ['P01','P02','P03','P04','P05','P06','P07','P08','P09','P10','P11','P12'];
let autoSimTimer = null;

async function triggerSlotSimulation(nomorSlot, statusBaru) {
  try {
    const res = await fetch('../backend/api/sensor.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Device-Key': SIM_DEVICE_KEY,
      },
      body: JSON.stringify({
        nomor_slot: nomorSlot,
        status: statusBaru,
        device_id: 'SIM-WEB-01',
        timestamp: new Date().toISOString(),
      }),
    });
    const data = await res.json();
    if (data.status === 'ignored') {
      showToast(`Slot ${nomorSlot} diabaikan (sedang Maintenance)`);
    } else if (data.status === 'ok') {
      showToast(`Simulasi ${nomorSlot} → ${statusBaru.toUpperCase()}`);
      fetchSlots(true);
    } else {
      showToast(data.error || 'Event simulasi gagal');
    }
  } catch {
    showToast('Gagal mengirim event simulasi ke API');
  }
}

window.triggerSlotSimulation = triggerSlotSimulation;

function toggleAutoSimulation() {
  const btn = document.getElementById('btnAutoSim');
  const statusEl = document.getElementById('autoSimStatus');

  if (autoSimTimer) {
    clearInterval(autoSimTimer);
    autoSimTimer = null;
    if (btn) btn.textContent = '▶ Mulai Auto-Simulasi (3 dtk)';
    if (statusEl) statusEl.textContent = 'Auto-Simulasi: Nonaktif';
    showToast('Auto-Simulasi dihentikan');
    return;
  }

  if (btn) btn.textContent = '⏹ Hentikan Auto-Simulasi';
  if (statusEl) statusEl.textContent = 'Auto-Simulasi: Aktif (tiap 3 detik)';
  showToast('Auto-Simulasi aktif');

  autoSimTimer = setInterval(() => {
    const slot = SIM_SLOTS[Math.floor(Math.random() * SIM_SLOTS.length)];
    const status = Math.random() > 0.5 ? 'terisi' : 'kosong';
    triggerSlotSimulation(slot, status);
  }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnSimMasuk')?.addEventListener('click', () => {
    const slot = document.getElementById('simSlotSelect').value;
    triggerSlotSimulation(slot, 'terisi');
  });
  document.getElementById('btnSimKeluar')?.addEventListener('click', () => {
    const slot = document.getElementById('simSlotSelect').value;
    triggerSlotSimulation(slot, 'kosong');
  });
  document.getElementById('btnAutoSim')?.addEventListener('click', toggleAutoSimulation);
});
