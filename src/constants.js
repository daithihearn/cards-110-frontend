export const triggerBounceMessage = "Trigger bounce!"
export const triggerBounceInterval = 3000

export const compareScore = (a, b) => {
  let comparison = 0
  if (b.score > a.score) {
    comparison = 1
  } else if (b.score < a.score) {
    comparison = -1
  }
  return comparison
}

export const compareTeamIds = (a, b) => {
  let comparison = 0
  if (b.teamId > a.teamId) {
    comparison = 1
  } else if (b.teamId < a.teamId) {
    comparison = -1
  }
  return comparison
}

export const doPlayersMatchProfiles = (players, playerProfiles) => {
  if (players.length !== playerProfiles.length) {
    return false
  }

  playerProfiles.forEach((profile) => {
    if (!players.find((p) => p.id === profile.id)) {
      return false
    }
  })

  return true
}
