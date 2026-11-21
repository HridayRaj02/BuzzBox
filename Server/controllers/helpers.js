// Shared HTTP validation and response helpers used by controllers.
function singleQueryValue(value) {
  return typeof value === "string" ? value : undefined;
}

function parseLimit(value) {
  if (value === undefined) return undefined;
  if (!/^\d+$/.test(value)) return null;
  const limit = Number(value);
  return limit >= 1 && limit <= 100 ? limit : null;
}

function parseCookies(header = "") {
  return Object.fromEntries(header.split(";").map((part) => part.trim().split(/=(.*)/s, 2)).filter(([key]) => key));
}

function cookieOptions(expires) {
  return { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", expires };
}

function requireBodyString(value, field, min = 1, max = 500) {
  if (typeof value !== "string" || value.trim().length < min || value.trim().length > max) {
    throw Object.assign(new Error(`${field} must be between ${min} and ${max} characters.`), { status: 400 });
  }
  return value.trim();
}

function parseStringList(value, field) {
  if (!Array.isArray(value) || value.length > 30 || value.some((item) => typeof item !== "string" || item.trim().length < 1 || item.trim().length > 64)) {
    throw Object.assign(new Error(`${field} must be an array of up to 30 short strings.`), { status: 400 });
  }
  return [...new Set(value.map((item) => item.trim()))];
}

function publicEvent(event) {
  return { ...event, ticketTiers: event.ticketTiers?.map((tier) => ({ ...tier, availableQuantity: Math.max(0, tier.quantity - tier.sold) })) };
}

module.exports = { cookieOptions, parseCookies, parseLimit, parseStringList, publicEvent, requireBodyString, singleQueryValue };
