const initialState = {
  games: [],
}

export default function myGamesReducer(state = initialState, action) {
  switch (action.type) {
    case "myGames/updateAll": {
      return {
        games: action.payload,
      }
    }
    case "myGames/addGame": {
      return {
        games: state.games.concat(action.payload),
      }
    }
    case "myGames/removeGame": {
      let updated = [...state.games]
      let idx = updated.findIndex((x) => x.id === action.payload)
      if (idx === -1) {
        return state
      }
      updated.splice(idx, 1)
      return {
        games: updated,
      }
    }
    default:
      return state
  }
}
