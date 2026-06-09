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

export const formatIndianRuppee = (amount) => {
  if (amount === null || amount === undefined || amount === "") return "";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Number(amount));
};

export const getRandomColor = (seed) => {
  const colors = [
    '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50',
    '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E', '#607D8B'
  ];
  const index = seed ? seed.charCodeAt(0) % colors.length : Math.floor(Math.random() * colors.length);
  return colors[index];
};