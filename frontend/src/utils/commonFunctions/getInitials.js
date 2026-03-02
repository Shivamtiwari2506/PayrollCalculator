export const getInitials = (user) => {
  if (!user || !user.name) return '';
  const names = user.name.split(' ');
  const initials = names.map(name => name.charAt(0).toUpperCase()).join('');
  return initials;
}