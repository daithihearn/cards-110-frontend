const initialState = {
    players: []
}

export default function playersReducer(state = initialState, action) {
    switch (action.type) {
        case 'players/updateAll': {
            return {
                players: action.payload
            }
        }
        default:
          return state
    }
}