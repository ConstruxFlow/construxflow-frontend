// src/api/equipmentApi.js
const API = 'http://localhost:8080/api/equipment';

export const toEnum = (uiLabel) => {
  if (!uiLabel) return null;
  if (uiLabel === 'Available') return 'AVAILABLE';
  if (uiLabel === 'On a Site') return 'ON_A_SITE';
  if (uiLabel === 'Under Maintenance') return 'UNDER_MAINTENANCE';
  return uiLabel; // pass-through
};

export const fromEnum = (e) => {
  if (!e) return '';
  if (e === 'AVAILABLE') return 'Available';
  if (e === 'ON_A_SITE') return 'On a Site';
  if (e === 'UNDER_MAINTENANCE') return 'Under Maintenance';
  return e;
};

export async function fetchEquipment({ search, status, page, size, sortBy, sortDir }) {
  const params = new URLSearchParams();

  if (search && search.trim()) params.append('search', search.trim());

  // IMPORTANT: do not send "All"
  if (status && status !== 'All') {
    params.append('status', toEnum(status));
  }

  if (page != null) params.append('page', page);
  if (size != null) params.append('size', size);
  if (sortBy) params.append('sortBy', sortBy);
  if (sortDir) params.append('sortDir', sortDir);

  const url = `${API}/search?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`fetchEquipment failed: ${res.status} ${text}`);
  }
  return res.json(); // expected Spring Page<T> JSON
}

export async function fetchEquipmentStats() {
  const res = await fetch(`${API}/stats`);
  if (!res.ok) throw new Error('stats failed');
  return res.json();
}

export async function patchEquipmentStatus(id, uiLabel) {
  const enumVal = toEnum(uiLabel);
  const res = await fetch(`${API}/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(enumVal),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`patch status failed: ${res.status} ${text}`);
  }
  return res.text();
}
