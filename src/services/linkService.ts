// src/services/linkService.ts
import { ref, set, get, remove, update } from 'firebase/database';
import { rtdb } from '../lib/firebase';

export interface ShortLink {
  id: string;
  alias: string;
  originalUrl: string;
  isActive: boolean;
  isGuest: boolean;
  clickCount: number;
  ownerId: string | null;
  createdAt: any;
}

const generateShortcode = () => Math.random().toString(36).substring(2, 8);

// Helper to timeout promises
const withTimeout = <T>(promise: Promise<T>, ms: number, errorMsg: string): Promise<T> => {
  let timer: any;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(errorMsg)), ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
};

export const createGuestLink = async (originalUrl: string): Promise<ShortLink> => {
  const alias = generateShortcode();
  const id = `guest_${Date.now()}`;
  
  const newLink: ShortLink = {
    id,
    alias,
    originalUrl,
    isActive: true,
    isGuest: true,
    clickCount: 0,
    ownerId: null,
    createdAt: new Date().toISOString()
  };

  await set(ref(rtdb, `links/${alias}`), newLink);
  return newLink;
};

export const createAuthLink = async (originalUrl: string, customAlias: string, userId: string): Promise<ShortLink> => {
  const alias = customAlias.trim() || generateShortcode();
  
  const newLink = {
    id: alias,
    alias,
    originalUrl,
    isActive: true,
    isGuest: false,
    clickCount: 0,
    ownerId: userId,
    createdAt: new Date().toISOString()
  };

  console.log("Creating link with payload:", newLink);
  
  try {
    await withTimeout(
      set(ref(rtdb, `links/${alias}`), newLink),
      10000,
      "Database connection timed out. Please check your internet or Firebase config."
    );
    console.log("Link created successfully in RTDB");
    return newLink as ShortLink;
  } catch (error) {
    console.error("Error creating link:", error);
    throw error;
  }
};

export const getUserLinks = async (userId: string): Promise<ShortLink[]> => {
  console.log("Fetching links for user:", userId);
  const linksRef = ref(rtdb, 'links');
  
  try {
    const snapshot = await withTimeout(
      get(linksRef),
      10000,
      "Database fetch timed out."
    );
    
    const links: ShortLink[] = [];
    if (snapshot.exists()) {
      snapshot.forEach((child) => {
        const data = child.val() as ShortLink;
        if (data && data.ownerId === userId) {
          links.push(data);
        }
      });
    }
    
    return links.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error("Error fetching links:", error);
    throw error;
  }
};

export const updateLink = async (alias: string, data: Partial<ShortLink>): Promise<void> => {
  await update(ref(rtdb, `links/${alias}`), data);
};

export const deleteLink = async (alias: string): Promise<void> => {
  await remove(ref(rtdb, `links/${alias}`));
};
