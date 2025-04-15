
export const ADMIN_USERNAMES = ['sec', 'thesec'];

export const getAdminList = (): string[] => {
  return [...ADMIN_USERNAMES];
};

export const isAdmin = (username: string): boolean => {
  return ADMIN_USERNAMES.includes(username);
};
