
const initialState = {
    org: null,
    loading: false,
    error: null
}

const orgReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'REQUEST_ORG_DATA':
            return {...state, loading: true, error: null};
        case 'SET_ORG_DATA':
            return {...state, org: action.payload, loading: false, error: null};
        case 'ERROR_FETCHING':
            return {...state, loading: false, error: action.payload, org: {}};
        default:
            return state;
    }
};

export default orgReducer;