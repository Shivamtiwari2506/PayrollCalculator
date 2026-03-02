
const initialState = {
    user: null,
    loading: false,
    error: null
}

const orgReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'REQUEST_USER_DATA':
            return {...state, loading: true, error: null};
        case 'SET_USER_DATA':
            return {...state, user: action.payload, loading: false, error: null};
        case 'ERROR_FETCHING':
            return {...state, loading: false, error: action.payload, user: {}};
        default:
            return state;
    }
};

export default orgReducer;