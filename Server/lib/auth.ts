// Security service: password hashes and opaque server-side sessions.
import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { prisma } from "./prisma";

const scrypt = promisify(scryptCallback);
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 14;

export type PublicUser = {
  id: string;
  name: string;
  handle: string;
  email: string | null;
  phone: string | null;
  photoUrl: string | null;
  role: string;
  city: { id: string; name: string; slug: string } | null;
  favouriteGenres: string[];
  cityPreferences: string[];
  notifications: { whatsappDrops: boolean; radarAlerts: boolean; waitlistOffers: boolean };
};

export function normaliseEmail(value: string) { return value.trim().toLowerCase(); }

export function hashToken(token: string) { return createHash("sha256").update(token).digest("hex"); }

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = await scrypt(password, salt, 64) as Buffer;
  return `scrypt$${salt}$${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, storedHash: string) {
  const [algorithm, salt, value] = storedHash.split("$");
  if (algorithm !== "scrypt" || !salt || !value) return false;
  const expected = Buffer.from(value, "hex");
  const actual = await scrypt(password, salt, expected.length) as Buffer;
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function createHandle(name: string) {
  const base = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 28) || "member";
  return `${base}-${randomBytes(3).toString("hex")}`;
}

export function toPublicUser(user: any): PublicUser {
  return {
    id: user.id, name: user.name, handle: user.handle, email: user.email, phone: user.phone,
    photoUrl: user.photoUrl, role: user.role, city: user.city ? { id: user.city.id, name: user.city.name, slug: user.city.slug } : null,
    favouriteGenres: user.favouriteGenres, cityPreferences: user.cityPreferences,
    notifications: { whatsappDrops: user.whatsappDrops, radarAlerts: user.radarAlerts, waitlistOffers: user.waitlistOffers },
  };
}

const userInclude = { city: { select: { id: true, name: true, slug: true } } } as const;

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  await prisma.session.create({ data: { userId, tokenHash: hashToken(token), expiresAt } });
  return { token, expiresAt };
}

export async function getSessionUser(token?: string) {
  if (!token) return null;
  const session = await prisma.session.findUnique({ where: { tokenHash: hashToken(token) }, include: { user: { include: userInclude } } });
  if (!session) return null;
  if (session.expiresAt <= new Date()) {
    await prisma.session.delete({ where: { id: session.id } });
    return null;
  }
  return session.user;
}

export async function deleteSession(token?: string) {
  if (token) await prisma.session.deleteMany({ where: { tokenHash: hashToken(token) } });
}
