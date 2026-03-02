export const getInitials = (user) => {
  if (!user || !user.name) return '';
  const names = user.name.split(' ');
  const initials = names.map(name => name.charAt(0).toUpperCase()).join('');
  return initials;
}

export const removeFromLocalStorage = ( ) => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('org');
};

export const ROLES = {
  ADMIN: 'Admin',
  USER: 'User',
  ORG_ADMIN: 'Org_Admin',
};