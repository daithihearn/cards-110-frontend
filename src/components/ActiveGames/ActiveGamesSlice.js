

const initialState = {
    activeGames: []
}

export default function activeGamesReducer(state = initialState, action) {
    switch (action.type) {
        case 'activeGames/updateAll': {
            return {
                activeGames: action.payload
            }
        }
        case 'activeGames/addGame': {
            return {
                activeGames: state.activeGames.append(action.payload)
            }
        }
        // case 'activeGames/removeGame': {
        //     return {
        //         activeGames: state.activeGames.splice(action.payload, 1)
        //     }
        // }
        default:
          return state
    }
}