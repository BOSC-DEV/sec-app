
export const ADMIN_USERNAMES = ['sec', 'thesec'];

export const BANNED_USERNAMES: string[] = [];

export const getAdminList = (): string[] => {
  return [...ADMIN_USERNAMES];
};

export const isAdmin = (username: string): boolean => {
  return ADMIN_USERNAMES.includes(username);
};

export const isBanned = (username: string): boolean => {
  return BANNED_USERNAMES.includes(username);
};

export const banUser = (username: string): void => {
  if (!BANNED_USERNAMES.includes(username)) {
    BANNED_USERNAMES.push(username);
    // Show toast notification to admins
    toast({
      title: "User Banned",
      description: `User ${username} has been banned from commenting`,
      variant: "default",
    });
  }
};
