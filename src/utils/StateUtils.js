// Strip out all fields that begin with '_'
exports.getDataFromState = (state) => {
    let cleanState = {};
    // eslint-disable-next-line
    for (let key in state) {
      if (key.indexOf('_') < 0 && state.hasOwnProperty(key)) {
          cleanState[key] = state[key];
      }
    }
    return cleanState;
}