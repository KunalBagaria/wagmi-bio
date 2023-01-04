import json from './ReservedUsernames.json';

export const validateReservedLink = (link: string): boolean => {
  if (!/^[a-z0-9]+$/i.test(link)) return true;
  const { usernames } = json;
  return usernames.indexOf(link.toLowerCase()) !== -1;
};
