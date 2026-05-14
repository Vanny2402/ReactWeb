/** Display rate: 1 USD = 4000 KHR (UI only). */
export const USD_TO_KHR_RATE = 4000;
export const format2Digit = (value) =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

export const khrFromUsd = (usd) =>
  Math.round(Number(usd || 0) * USD_TO_KHR_RATE);

export const formatKHR = (value) =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

/** One line: USD + KHR for labels and tables. */
export const formatUsdKhrLine = (usd) => {
  const u = Number(usd || 0);
  return `$${format2Digit(u)} | ៛${formatKHR(khrFromUsd(u))}`;
};

export function formatUsdKhrSplit(amount) {
  const usd = Number(amount || 0);
  const khr = usd * 4000;

  return { usd, khr };
}


export const formatDateForInput = (date) => {
  const d = new Date(date);
  const pad = (n) => String(n).padStart(2, "0");

  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const formdateForm = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const pad = (n) => String(n).padStart(2, "0");

  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Convert "YYYY-MM-DDTHH:MM" to "DD/MM/YYYY hh:mm AM/PM"
export const formatDateAMPM = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const pad = (n) => String(n).padStart(2, "0");

  let hours = date.getHours();
  const minutes = pad(date.getMinutes());
  const ampm = hours >= 12 ? "pm" : "am";

  hours = hours % 12;
  if (hours === 0) hours = 12; // handle midnight/noon

  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();

  return `${day}/${month}/${year}:${hours}:${minutes}:${ampm} `;
};
