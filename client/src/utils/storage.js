export const get = (key) => {
  try { return JSON.parse(localStorage.getItem(key)); }
  catch { return null; }
};

export const set = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); }
  catch { /* ignore */ }
};

export const remove = (key) => {
  try { localStorage.removeItem(key); }
  catch { /* ignore */ }
};
