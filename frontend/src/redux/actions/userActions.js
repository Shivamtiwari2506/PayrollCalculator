import api from '../../services/api';
import { handleApiError } from '../../utils/commonFunctions/errorHandler';

export const getCurrentUser = (id) => async (dispatch) => {
    try {
        dispatch({type: "REQUEST_USER_DATA"});
        const res = await api.get(`/auth/me`);
        if(res?.data && res?.data?.success === true) {
            localStorage.setItem('user', JSON.stringify(res?.data?.data));
            dispatch({
                type: "SET_USER_DATA",
                payload: res.data.data
            })
        }
    } catch (error) {
        handleApiError(error);
        dispatch({
            type: "ERROR_FETCHING",
            payload: error.response?.data?.error || error?.message || 'Something went wrong',
        })
    }
}