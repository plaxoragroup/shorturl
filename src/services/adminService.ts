import { ref, get, update, remove, set } from 'firebase/database';
import { rtdb } from '../lib/firebase';
import { ShortLink } from './linkService';

export interface UserData {
  uid: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  status: 'active' | 'suspended';
  createdAt: string;
  lastLogin?: string;
}

export interface PlatformStats {
  totalUsers: number;
  totalLinks: number;
  totalClicks: number;
  guestLinks: number;
}

export interface ActivityLog {
  id: string;
  action: string;
  target: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'danger';
}

// Stats
export const getPlatformStats = async (): Promise<PlatformStats> => {
  const usersRef = ref(rtdb, 'users');
  const linksRef = ref(rtdb, 'links');

  const [usersSnap, linksSnap] = await Promise.all([
    get(usersRef),
    get(linksRef)
  ]);

  let totalUsers = 0;
  let totalLinks = 0;
  let totalClicks = 0;
  let guestLinks = 0;

  if (usersSnap.exists()) {
    totalUsers = Object.keys(usersSnap.val()).length;
  }

  if (linksSnap.exists()) {
    const links = linksSnap.val();
    totalLinks = Object.keys(links).length;
    
    Object.values(links).forEach((link: any) => {
      totalClicks += (link.clickCount || 0);
      if (link.isGuest) {
        guestLinks++;
      }
    });
  }

  return {
    totalUsers,
    totalLinks,
    totalClicks,
    guestLinks
  };
};

// Users
export const getAllUsers = async (): Promise<UserData[]> => {
  const snapshot = await get(ref(rtdb, 'users'));
  if (!snapshot.exists()) return [];

  const users: UserData[] = [];
  snapshot.forEach((child) => {
    users.push({
      uid: child.key as string,
      ...child.val()
    });
  });

  return users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const updateUserStatus = async (uid: string, status: 'active' | 'suspended'): Promise<void> => {
  await update(ref(rtdb, `users/${uid}`), { status });
  await logActivity(`User ${status}`, `UID: ${uid}`, status === 'active' ? 'success' : 'warning');
};

export const deleteUser = async (uid: string): Promise<void> => {
  await remove(ref(rtdb, `users/${uid}`));
  await logActivity('User Deleted', `UID: ${uid}`, 'danger');
};

// Links
export const getAllLinks = async (): Promise<ShortLink[]> => {
  const snapshot = await get(ref(rtdb, 'links'));
  if (!snapshot.exists()) return [];

  const links: ShortLink[] = [];
  snapshot.forEach((child) => {
    links.push({
      ...(child.val() as ShortLink),
      // ensure we have a fallback if id isn't set somehow
      id: child.val().id || child.key, 
    });
  });

  return links.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const updateLinkStatus = async (alias: string, isActive: boolean): Promise<void> => {
  await update(ref(rtdb, `links/${alias}`), { isActive });
  await logActivity(`Link ${isActive ? 'Enabled' : 'Disabled'}`, alias, isActive ? 'success' : 'warning');
};

export const deleteLinkByAdmin = async (alias: string): Promise<void> => {
  await remove(ref(rtdb, `links/${alias}`));
  await logActivity('Link Deleted', alias, 'danger');
};

// Activity Logs
export const logActivity = async (action: string, target: string, type: ActivityLog['type']) => {
  const id = Date.now().toString();
  await set(ref(rtdb, `logs/${id}`), {
    id,
    action,
    target,
    type,
    time: new Date().toISOString()
  });
};

export const getRecentLogs = async (limit: number = 10): Promise<ActivityLog[]> => {
  const snapshot = await get(ref(rtdb, 'logs'));
  if (!snapshot.exists()) return [];

  const logs: ActivityLog[] = [];
  snapshot.forEach((child) => {
    logs.push(child.val() as ActivityLog);
  });

  // Sort descending and slice
  return logs
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, limit);
};

// Settings
export interface PlatformSettings {
  websiteName: string;
  maintenanceMode: boolean;
  enableGuestLinks: boolean;
}

export const getSettings = async (): Promise<PlatformSettings> => {
  const snapshot = await get(ref(rtdb, 'settings'));
  if (snapshot.exists()) {
    return snapshot.val() as PlatformSettings;
  }
  return {
    websiteName: 'ShortURL',
    maintenanceMode: false,
    enableGuestLinks: true
  };
};

export const saveSettings = async (settings: PlatformSettings): Promise<void> => {
  await set(ref(rtdb, 'settings'), settings);
  await logActivity('Settings Updated', `Maintenance: ${settings.maintenanceMode ? 'ON' : 'OFF'}`, 'info');
};
