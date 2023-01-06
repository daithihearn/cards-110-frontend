const initialState = {
  stats: [],
}

export default function gameStatsReducer(state = initialState, action) {
  switch (action.type) {
    case "gameStats/update": {
      return {
        stats: action.payload,
      }
    }
    default:
      return state
  }
}
