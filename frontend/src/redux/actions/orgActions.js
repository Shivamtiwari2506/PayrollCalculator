import api from '../../services/api';
import { handleApiError } from '../../utils/commonFunctions/errorHandler';

export const getOrgData = (id) => async (dispatch) => {
    try {
        dispatch({type: "REQUEST_ORG_DATA"});
        const res = await api.get(`/org/me`);
        if(res?.data && res?.data?.success === true) {
            localStorage.setItem("org", JSON.stringify(res?.data?.data));
            dispatch({
                type: "SET_ORG_DATA",
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