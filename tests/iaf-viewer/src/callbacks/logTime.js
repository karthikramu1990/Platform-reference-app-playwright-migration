/**
 * Shared local timestamp prefix for iaf-viewer callback logging (`hh:mm:ss`).
 * @returns {string}
 */
export function logTime() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}
