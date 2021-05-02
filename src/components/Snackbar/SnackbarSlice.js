const initialState = {
    open: false, type: '', message: ''
}

export default function snackbarReducer(state = initialState, action) {
    switch (action.type) {
        case 'snackbar/message': {
            return {
                open: true,
                type: action.payload.type,
                message: action.payload.message
            }
        }
        case 'snackbar/close': {
            return {
                open: false,
                type: state.type,
                message: ''
            }
        }
        default:
          return state
    }
}