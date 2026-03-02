export const removeFromLocalStorage = ( ) => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('org');
};