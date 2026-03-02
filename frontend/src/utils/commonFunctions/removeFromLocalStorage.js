export const removeFromLocalStorage = ( ) => {
    localStorage.removeItem('token');
    localStorage.removeItem('orgId');
};